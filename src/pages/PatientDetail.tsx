import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FlaskConical, Pill, Plus } from "lucide-react";

const observationSchema = z.object({
  code: z.string().trim().min(1, "Code required").max(64),
  display: z.string().trim().min(1, "Name required").max(200),
  valueNumber: z
    .union([z.string().length(0), z.coerce.number().finite()])
    .optional(),
  valueString: z.string().trim().max(500).optional(),
  unit: z.string().trim().max(32).optional(),
  category: z.enum(["laboratory", "vital-signs", "imaging", "social-history", "exam"]),
  note: z.string().trim().max(2000).optional(),
});

const medRequestSchema = z.object({
  medicationName: z.string().trim().min(1, "Medication required").max(200),
  medicationCode: z.string().trim().max(64).optional(),
  dosage: z.string().trim().max(200).optional(),
  frequency: z.string().trim().max(64).optional(),
  status: z.enum(["active", "on_hold", "completed", "cancelled", "draft"]),
  note: z.string().trim().max(2000).optional(),
});

const PatientDetail = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [obsOpen, setObsOpen] = useState(false);
  const [medOpen, setMedOpen] = useState(false);
  const [obsCategory, setObsCategory] = useState("laboratory");
  const [medStatus, setMedStatus] = useState("active");

  const patientQuery = useQuery({
    queryKey: queryKeys.patient(id),
    queryFn: () => api.getPatient(id),
    enabled: !!id && !!user,
  });

  const recordsQuery = useQuery({
    queryKey: queryKeys.records(id),
    queryFn: () => api.listRecords(id),
    enabled: !!id && !!user,
  });

  const observationsQuery = useQuery({
    queryKey: queryKeys.observations(id),
    queryFn: () => api.listObservations(id),
    enabled: !!id && !!user,
  });

  const medsQuery = useQuery({
    queryKey: queryKeys.medicationRequests(id),
    queryFn: () => api.listMedicationRequests(id),
    enabled: !!id && !!user,
  });

  const patient = patientQuery.data;

  useEffect(() => {
    document.title = patient ? `${patient.fullName} · Caretide` : "Patient · Caretide";
  }, [patient]);

  const observationMutation = useMutation({
    mutationFn: (input: Parameters<typeof api.createObservation>[0]) =>
      api.createObservation(input),
    onSuccess: () => {
      toast({ title: "Lab result added" });
      setObsOpen(false);
      qc.invalidateQueries({ queryKey: queryKeys.observations(id) });
    },
    onError: (err: Error) =>
      toast({ title: "Failed to add result", description: err.message, variant: "destructive" }),
  });

  const medMutation = useMutation({
    mutationFn: (input: Parameters<typeof api.createMedicationRequest>[0]) =>
      api.createMedicationRequest(input),
    onSuccess: () => {
      toast({ title: "Prescription created" });
      setMedOpen(false);
      qc.invalidateQueries({ queryKey: queryKeys.medicationRequests(id) });
    },
    onError: (err: Error) =>
      toast({ title: "Failed to prescribe", description: err.message, variant: "destructive" }),
  });

  const handleAddObservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = observationSchema.safeParse({
      code: fd.get("code"),
      display: fd.get("display"),
      valueNumber: fd.get("valueNumber") || undefined,
      valueString: fd.get("valueString") || undefined,
      unit: fd.get("unit") || undefined,
      category: obsCategory,
      note: fd.get("note") || undefined,
    });
    if (!parsed.success) {
      toast({
        title: "Invalid input",
        description: parsed.error.issues[0]?.message ?? "Check the form",
        variant: "destructive",
      });
      return;
    }
    const v = parsed.data;
    const valueNumber =
      typeof v.valueNumber === "number" ? v.valueNumber : undefined;
    if (valueNumber === undefined && !v.valueString) {
      toast({
        title: "Missing value",
        description: "Provide a numeric or text value.",
        variant: "destructive",
      });
      return;
    }
    observationMutation.mutate({
      patientId: id,
      code: v.code,
      display: v.display,
      valueNumber,
      valueString: v.valueString,
      unit: v.unit,
      category: v.category,
      note: v.note,
    });
  };

  const handleAddMedication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = medRequestSchema.safeParse({
      medicationName: fd.get("medicationName"),
      medicationCode: fd.get("medicationCode") || undefined,
      dosage: fd.get("dosage") || undefined,
      frequency: fd.get("frequency") || undefined,
      status: medStatus,
      note: fd.get("note") || undefined,
    });
    if (!parsed.success) {
      toast({
        title: "Invalid input",
        description: parsed.error.issues[0]?.message ?? "Check the form",
        variant: "destructive",
      });
      return;
    }
    const v = parsed.data;
    medMutation.mutate({
      patientId: id,
      medicationName: v.medicationName,
      medicationCode: v.medicationCode,
      dosage: v.dosage,
      frequency: v.frequency,
      status: v.status,
      note: v.note,
    });
  };

  const records = recordsQuery.data ?? [];
  const observations = observationsQuery.data ?? [];
  const meds = medsQuery.data ?? [];

  const initials = useMemo(
    () =>
      patient?.fullName
        ?.split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() ?? "?",
    [patient],
  );

  if (patientQuery.isLoading) {
    return (
      <DashboardLayout>
        <p className="text-sm text-muted-foreground">Loading patient…</p>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <Card className="shadow-soft">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">Patient not found.</p>
            <Button asChild variant="outline">
              <Link to="/dashboard/patients">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to roster
              </Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link to="/dashboard/patients">
              <ArrowLeft className="mr-1 h-4 w-4" /> Patients
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-semibold text-primary">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold">{patient.fullName}</h1>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
          </div>
        </div>

        {/* Lab results & vitals */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Lab results & vitals
            </CardTitle>
            <Dialog open={obsOpen} onOpenChange={setObsOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Add result
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">Add lab result or vital</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddObservation} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="code">LOINC code</Label>
                      <Input id="code" name="code" placeholder="e.g. 718-7" required maxLength={64} />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={obsCategory} onValueChange={setObsCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="laboratory">Laboratory</SelectItem>
                          <SelectItem value="vital-signs">Vital signs</SelectItem>
                          <SelectItem value="imaging">Imaging</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="social-history">Social history</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display">Name / description</Label>
                    <Input id="display" name="display" placeholder="e.g. Hemoglobin" required maxLength={200} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="valueNumber">Numeric value</Label>
                      <Input id="valueNumber" name="valueNumber" type="number" step="any" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input id="unit" name="unit" placeholder="g/dL" maxLength={32} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valueString">Or text value</Label>
                      <Input id="valueString" name="valueString" placeholder="Positive" maxLength={500} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Note</Label>
                    <Textarea id="note" name="note" maxLength={2000} />
                  </div>
                  <Button type="submit" className="w-full" disabled={observationMutation.isPending}>
                    {observationMutation.isPending ? "Saving…" : "Save result"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {observationsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : observations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lab results yet.</p>
            ) : (
              <ul className="divide-y">
                {observations.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="min-w-0">
                      <div className="font-medium">{o.display}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.effectiveAt).toLocaleString()}
                        {o.performerName ? ` · ${o.performerName}` : ""}
                        {o.sourceSystem ? ` · via ${o.sourceSystem}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {o.category && <Badge variant="outline">{o.category}</Badge>}
                      <div className="font-display text-lg">
                        {o.valueNumber ?? o.valueString ?? "—"}{" "}
                        <span className="text-sm text-muted-foreground">{o.unit}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Prescriptions
            </CardTitle>
            <Dialog open={medOpen} onOpenChange={setMedOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" /> New prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">New prescription</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMedication} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="medicationName">Medication</Label>
                    <Input id="medicationName" name="medicationName" placeholder="e.g. Amoxicillin 500mg" required maxLength={200} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="medicationCode">RxNorm code (optional)</Label>
                      <Input id="medicationCode" name="medicationCode" maxLength={64} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={medStatus} onValueChange={setMedStatus}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="on_hold">On hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input id="dosage" name="dosage" placeholder="1 tablet by mouth" maxLength={200} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input id="frequency" name="frequency" placeholder="BID, QD, PRN…" maxLength={64} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Note</Label>
                    <Textarea id="note" name="note" maxLength={2000} />
                  </div>
                  <Button type="submit" className="w-full" disabled={medMutation.isPending}>
                    {medMutation.isPending ? "Saving…" : "Create prescription"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {medsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : meds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
            ) : (
              <ul className="divide-y">
                {meds.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="min-w-0">
                      <div className="font-medium">{m.medicationName}</div>
                      <div className="text-xs text-muted-foreground">
                        {m.dosage ?? "Dosage not specified"}
                        {m.frequency ? ` · ${m.frequency}` : ""}
                        {m.prescriberName ? ` · Rx by ${m.prescriberName}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Authored {new Date(m.authoredOn).toLocaleDateString()}
                        {m.sourceSystem ? ` · via ${m.sourceSystem}` : ""}
                      </div>
                    </div>
                    <Badge
                      variant={m.status === "active" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {m.status.replace("_", " ")}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Visit notes */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">Visit notes</CardTitle>
          </CardHeader>
          <CardContent>
            {recordsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-muted-foreground">No visit notes yet.</p>
            ) : (
              <ol className="relative space-y-6 border-l border-border pl-6">
                {records.map((r) => (
                  <li key={r.id} className="relative">
                    <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()} · {r.authorName}
                      {r.facilityName ? ` · 📍 ${r.facilityName}` : ""}
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">{r.title}</div>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail;
