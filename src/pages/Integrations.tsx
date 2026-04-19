import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, API_BASE_URL } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { Copy, KeyRound, Plug, Trash2, Activity } from "lucide-react";
import type { ApiClient } from "@/lib/types";

const SCOPE_PRESETS: { label: string; value: string }[] = [
  { label: "Read everything", value: "*.read" },
  { label: "Lab system (labs only)", value: "patient.read observation.* organization.read practitioner.read" },
  { label: "Pharmacy", value: "patient.read medicationrequest.* practitioner.read" },
  { label: "Full access", value: "*" },
];

const Integrations = () => {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [scopes, setScopes] = useState(SCOPE_PRESETS[1].value);
  const [issued, setIssued] = useState<ApiClient | null>(null);
  const [eventsFor, setEventsFor] = useState<ApiClient | null>(null);

  useEffect(() => {
    document.title = "Integrations · Caretide";
  }, []);

  const clientsQuery = useQuery({
    queryKey: queryKeys.apiClients,
    queryFn: () => api.listApiClients(),
  });

  const eventsQuery = useQuery({
    queryKey: eventsFor ? queryKeys.apiClientEvents(eventsFor.id) : ["apiClientEvents", "none"],
    queryFn: () => api.listApiClientEvents(eventsFor!.id),
    enabled: !!eventsFor,
  });

  const createMutation = useMutation({
    mutationFn: api.createApiClient,
    onSuccess: (client) => {
      toast({ title: "API key created", description: "Copy it now — you won't see it again." });
      setIssued(client);
      setCreateOpen(false);
      qc.invalidateQueries({ queryKey: queryKeys.apiClients });
    },
    onError: (err: Error) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api.updateApiClient(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.apiClients }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteApiClient,
    onSuccess: () => {
      toast({ title: "Deleted" });
      qc.invalidateQueries({ queryKey: queryKeys.apiClients });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      name: String(fd.get("name")),
      scopes,
    });
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const fhirBase = API_BASE_URL.replace(/\/api\/?$/, "/fhir");

  const clients = clientsQuery.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Integrations</h1>
            <p className="text-muted-foreground">
              FHIR R4 endpoints for partner labs, pharmacies, and hospital systems.
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <KeyRound className="mr-2 h-4 w-4" />
                New API key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Issue API key</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Partner name</Label>
                  <Input id="name" name="name" placeholder="e.g. Postmasburg Lab" required />
                </div>
                <div className="space-y-2">
                  <Label>Scopes</Label>
                  <div className="grid gap-2">
                    {SCOPE_PRESETS.map((p) => (
                      <label
                        key={p.value}
                        className="flex cursor-pointer items-start gap-2 rounded-md border bg-card p-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="scopePreset"
                          value={p.value}
                          checked={scopes === p.value}
                          onChange={() => setScopes(p.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{p.label}</div>
                          <div className="text-xs text-muted-foreground">{p.value}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <Input
                    value={scopes}
                    onChange={(e) => setScopes(e.target.value)}
                    placeholder="custom.scope.string"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating…" : "Create key"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">FHIR R4 endpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <code className="rounded bg-muted px-2 py-1">{fhirBase}/metadata</code>
              <Button variant="ghost" size="icon" onClick={() => copy(`${fhirBase}/metadata`)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground">
              Authenticate with header <code>X-API-Key: ct_…</code>. Supported resources:
              Patient, Practitioner, Organization, Appointment, Encounter, Observation,
              DiagnosticReport, MedicationRequest, DocumentReference.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">API clients</CardTitle>
          </CardHeader>
          <CardContent>
            {clientsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : clients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No API clients yet. Issue one to let an external system connect.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Scopes</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <code className="text-xs">{c.keyPrefix}…</code>
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate text-xs text-muted-foreground">
                        {c.scopes}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.lastUsedAt
                          ? new Date(c.lastUsedAt).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={c.active}
                          onCheckedChange={(v) =>
                            toggleMutation.mutate({ id: c.id, active: v })
                          }
                        />
                      </TableCell>
                      <TableCell className="space-x-1 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEventsFor(c)}
                          aria-label="View events"
                        >
                          <Activity className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Delete "${c.name}"? This cannot be undone.`)) {
                              deleteMutation.mutate(c.id);
                            }
                          }}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Issued key dialog (one-time display) */}
      <Dialog open={!!issued} onOpenChange={(open) => !open && setIssued(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Save your API key</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This is the only time the full key will be shown. Copy it and store it securely.
          </p>
          <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
            <code className="flex-1 break-all text-xs">{issued?.apiKey}</code>
            <Button size="icon" variant="ghost" onClick={() => issued?.apiKey && copy(issued.apiKey)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setIssued(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Events drawer */}
      <Dialog open={!!eventsFor} onOpenChange={(open) => !open && setEventsFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              Activity · {eventsFor?.name}
            </DialogTitle>
          </DialogHeader>
          {eventsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (eventsQuery.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Path</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventsQuery.data!.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="text-xs">
                        {new Date(e.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{e.method}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{e.path}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Integrations;
