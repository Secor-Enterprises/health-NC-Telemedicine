import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { FileText, Upload, Plus, FlaskConical, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Records = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [recordOpen, setRecordOpen] = useState(false);
  const [facilityId, setFacilityId] = useState<string>("");

  useEffect(() => {
    document.title = "Medical Records · Caretide";
  }, []);

  const { data: facilities = [] } = useQuery({
    queryKey: queryKeys.facilities,
    queryFn: () => api.listFacilities(),
  });

  const recordsQuery = useQuery({
    queryKey: user ? queryKeys.records(user.id) : ["records", "anon"],
    queryFn: () => api.listRecords(user!.id),
    enabled: !!user,
  });

  const filesQuery = useQuery({
    queryKey: user ? queryKeys.files(user.id) : ["files", "anon"],
    queryFn: () => api.listFiles(user!.id),
    enabled: !!user,
  });

  const observationsQuery = useQuery({
    queryKey: user ? queryKeys.observations(user.id) : ["observations", "anon"],
    queryFn: () => api.listObservations(user!.id),
    enabled: !!user,
  });

  const medicationsQuery = useQuery({
    queryKey: user ? queryKeys.medicationRequests(user.id) : ["medicationRequests", "anon"],
    queryFn: () => api.listMedicationRequests(user!.id),
    enabled: !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      api.uploadFile({ patientId: user!.id, uploaderId: user!.id, file }),
    onSuccess: () => {
      toast({ title: "File uploaded" });
      qc.invalidateQueries({ queryKey: queryKeys.files(user!.id) });
    },
    onError: (err: Error) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    },
  });

  const recordMutation = useMutation({
    mutationFn: (input: { title: string; description: string; diagnosis: string; treatment: string; facilityId: string | null }) =>
      api.createRecord({
        patientId: user!.id,
        authorId: user!.id,
        authorName: user!.fullName,
        ...input,
      } as Parameters<typeof api.createRecord>[0]),
    onSuccess: () => {
      toast({ title: "Record added" });
      setRecordOpen(false);
      setFacilityId("");
      qc.invalidateQueries({ queryKey: queryKeys.records(user!.id) });
    },
    onError: (err: Error) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    uploadMutation.mutate(file, { onSettled: () => { e.target.value = ""; } });
  };

  const handleAddRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    recordMutation.mutate({
      title: String(fd.get("title")),
      description: String(fd.get("description")),
      diagnosis: String(fd.get("diagnosis") || ""),
      treatment: String(fd.get("treatment") || ""),
      facilityId: facilityId || null,
    });
  };

  if (!user) return null;

  const records = recordsQuery.data ?? [];
  const files = filesQuery.data ?? [];
  const observations = observationsQuery.data ?? [];
  const medications = medicationsQuery.data ?? [];
  const loading = recordsQuery.isLoading || filesQuery.isLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Medical records</h1>
            <p className="text-muted-foreground">Visit history and uploaded documents.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild disabled={uploadMutation.isPending}>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                {uploadMutation.isPending ? "Uploading…" : "Upload file"}
                <input id="file-upload" type="file" className="hidden" onChange={handleUpload} />
              </Label>
            </Button>
            <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Add note</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Add a record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddRecord} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Input id="diagnosis" name="diagnosis" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment</Label>
                      <Input id="treatment" name="treatment" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Facility (optional)</Label>
                    <Select value={facilityId} onValueChange={setFacilityId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hospital or clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.type === "clinic" && f.parent
                              ? `${f.parent.name} · ${f.name}`
                              : f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={recordMutation.isPending}>
                    {recordMutation.isPending ? "Saving…" : "Save record"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Records timeline */}
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="font-display text-xl">Visit notes</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-muted-foreground">No records yet.</p>
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
                    {(r.diagnosis || r.treatment) && (
                      <div className="mt-2 grid gap-2 rounded-md border bg-secondary/40 p-3 text-sm sm:grid-cols-2">
                        {r.diagnosis && <div><span className="font-medium">Diagnosis: </span>{r.diagnosis}</div>}
                        {r.treatment && <div><span className="font-medium">Treatment: </span>{r.treatment}</div>}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Files */}
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="font-display text-xl">Files</CardTitle></CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files uploaded.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {files.map((f) => (
                  <li key={f.id}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-secondary/40"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{f.fileName}</div>
                        <div className="text-xs text-muted-foreground">
                          {(f.fileSize / 1024).toFixed(1)} KB · {new Date(f.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Records;
