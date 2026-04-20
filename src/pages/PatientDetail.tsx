import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FlaskConical, Pencil, Pill, Plus, XCircle } from "lucide-react";
import {
  ObservationDialog,
  type ObservationFormValues,
} from "@/components/clinical/ObservationDialog";
import {
  MedicationRequestDialog,
  type MedRequestFormValues,
} from "@/components/clinical/MedicationRequestDialog";
import type { PatientMedicationRequest, PatientObservation } from "@/lib/types";

type CancelTarget =
  | { kind: "observation"; item: PatientObservation }
  | { kind: "medication"; item: PatientMedicationRequest }
  | null;

const PatientDetail = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [obsDialog, setObsDialog] = useState<{
    open: boolean;
    mode: "create" | "edit";
    item?: PatientObservation | null;
  }>({ open: false, mode: "create" });

  const [medDialog, setMedDialog] = useState<{
    open: boolean;
    mode: "create" | "edit";
    item?: PatientMedicationRequest | null;
  }>({ open: false, mode: "create" });

  const [cancelTarget, setCancelTarget] = useState<CancelTarget>(null);

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

  // ---------- Observation mutations ----------
  const createObservation = useMutation({
    mutationFn: (input: Parameters<typeof api.createObservation>[0]) =>
      api.createObservation(input),
    onSuccess: () => {
      toast({ title: "Lab result added" });
      setObsDialog({ open: false, mode: "create" });
      qc.invalidateQueries({ queryKey: queryKeys.observations(id) });
    },
    onError: (err: Error) =>
      toast({ title: "Failed to add result", description: err.message, variant: "destructive" }),
  });

  const updateObservation = useMutation({
    mutationFn: (vars: { id: string; patch: Parameters<typeof api.updateObservation>[1] }) =>
      api.updateObservation(vars.id, vars.patch),
    onSuccess: () => {
      toast({ title: "Lab result updated" });
      setObsDialog({ open: false, mode: "create" });
      qc.invalidateQueries({ queryKey: queryKeys.observations(id) });
    },
    onError: (err: Error) =>
      toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  // ---------- MedicationRequest mutations ----------
  const createMedRequest = useMutation({
    mutationFn: (input: Parameters<typeof api.createMedicationRequest>[0]) =>
      api.createMedicationRequest(input),
    onSuccess: () => {
      toast({ title: "Prescription created" });
      setMedDialog({ open: false, mode: "create" });
      qc.invalidateQueries({ queryKey: queryKeys.medicationRequests(id) });
    },
    onError: (err: Error) =>
      toast({ title: "Failed to prescribe", description: err.message, variant: "destructive" }),
  });

  const updateMedRequest = useMutation({
    mutationFn: (vars: {
      id: string;
      patch: Parameters<typeof api.updateMedicationRequest>[1];
    }) => api.updateMedicationRequest(vars.id, vars.patch),
    onSuccess: () => {
      toast({ title: "Prescription updated" });
      setMedDialog({ open: false, mode: "create" });
      qc.invalidateQueries({ queryKey: queryKeys.medicationRequests(id) });
    },
    onError: (err: Error) =>
      toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  // ---------- Submit handlers ----------
  const submitObservation = (v: ObservationFormValues) => {
    if (obsDialog.mode === "edit" && obsDialog.item) {
      updateObservation.mutate({
        id: obsDialog.item.id,
        patch: {
          code: v.code,
          display: v.display,
          valueNumber: v.valueNumber ?? null,
          valueString: v.valueString ?? null,
          unit: v.unit ?? null,
          category: v.category,
          status: v.status,
        },
      });
    } else {
      createObservation.mutate({
        patientId: id,
        code: v.code,
        display: v.display,
        valueNumber: v.valueNumber,
        valueString: v.valueString,
        unit: v.unit,
        category: v.category,
        note: v.note,
      });
    }
  };

  const submitMedRequest = (v: MedRequestFormValues) => {
    if (medDialog.mode === "edit" && medDialog.item) {
      updateMedRequest.mutate({
        id: medDialog.item.id,
        patch: {
          medicationName: v.medicationName,
          medicationCode: v.medicationCode ?? null,
          dosage: v.dosage ?? null,
          frequency: v.frequency ?? null,
          status: v.status,
        },
      });
    } else {
      createMedRequest.mutate({
        patientId: id,
        medicationName: v.medicationName,
        medicationCode: v.medicationCode,
        dosage: v.dosage,
        frequency: v.frequency,
        status: v.status,
        note: v.note,
      });
    }
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    if (cancelTarget.kind === "observation") {
      updateObservation.mutate(
        { id: cancelTarget.item.id, patch: { status: "cancelled" } },
        { onSettled: () => setCancelTarget(null) },
      );
    } else {
      updateMedRequest.mutate(
        { id: cancelTarget.item.id, patch: { status: "cancelled" } },
        { onSettled: () => setCancelTarget(null) },
      );
    }
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
            <Button
              size="sm"
              onClick={() => setObsDialog({ open: true, mode: "create", item: null })}
            >
              <Plus className="mr-1 h-4 w-4" /> Add result
            </Button>
          </CardHeader>
          <CardContent>
            {observationsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : observations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lab results yet.</p>
            ) : (
              <ul className="divide-y">
                {observations.map((o) => {
                  const isCancelled = o.status === "cancelled";
                  return (
                    <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                      <div className="min-w-0">
                        <div className={`font-medium ${isCancelled ? "line-through text-muted-foreground" : ""}`}>
                          {o.display}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(o.effectiveAt).toLocaleString()}
                          {o.performerName ? ` · ${o.performerName}` : ""}
                          {o.sourceSystem ? ` · via ${o.sourceSystem}` : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {o.category && <Badge variant="outline">{o.category}</Badge>}
                        {isCancelled && <Badge variant="destructive">cancelled</Badge>}
                        <div className="font-display text-lg">
                          {o.valueNumber ?? o.valueString ?? "—"}{" "}
                          <span className="text-sm text-muted-foreground">{o.unit}</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Edit lab result"
                          onClick={() => setObsDialog({ open: true, mode: "edit", item: o })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {!isCancelled && (
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Cancel lab result"
                            onClick={() => setCancelTarget({ kind: "observation", item: o })}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
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
            <Button
              size="sm"
              onClick={() => setMedDialog({ open: true, mode: "create", item: null })}
            >
              <Plus className="mr-1 h-4 w-4" /> New prescription
            </Button>
          </CardHeader>
          <CardContent>
            {medsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : meds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
            ) : (
              <ul className="divide-y">
                {meds.map((m) => {
                  const isCancelled = m.status === "cancelled";
                  return (
                    <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                      <div className="min-w-0">
                        <div className={`font-medium ${isCancelled ? "line-through text-muted-foreground" : ""}`}>
                          {m.medicationName}
                        </div>
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
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            m.status === "active"
                              ? "default"
                              : m.status === "cancelled"
                                ? "destructive"
                                : "outline"
                          }
                          className="capitalize"
                        >
                          {m.status.replace("_", " ")}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Edit prescription"
                          onClick={() => setMedDialog({ open: true, mode: "edit", item: m })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {!isCancelled && (
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Cancel prescription"
                            onClick={() => setCancelTarget({ kind: "medication", item: m })}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
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

      <ObservationDialog
        open={obsDialog.open}
        onOpenChange={(open) => setObsDialog((s) => ({ ...s, open }))}
        mode={obsDialog.mode}
        initial={obsDialog.item}
        pending={createObservation.isPending || updateObservation.isPending}
        onSubmit={submitObservation}
      />

      <MedicationRequestDialog
        open={medDialog.open}
        onOpenChange={(open) => setMedDialog((s) => ({ ...s, open }))}
        mode={medDialog.mode}
        initial={medDialog.item}
        pending={createMedRequest.isPending || updateMedRequest.isPending}
        onSubmit={submitMedRequest}
      />

      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel this {cancelTarget?.kind === "observation" ? "lab result" : "prescription"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {cancelTarget?.kind === "observation"
                ? `"${cancelTarget.item.display}" will be marked as cancelled. It stays in the record for audit purposes.`
                : cancelTarget?.kind === "medication"
                  ? `"${cancelTarget.item.medicationName}" will be marked as cancelled. It stays in the record for audit purposes.`
                  : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default PatientDetail;
