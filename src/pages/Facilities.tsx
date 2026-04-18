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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import type { Facility } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Building2, Hospital, Pencil, Plus, Trash2 } from "lucide-react";

const Facilities = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Facility | null>(null);
  const [creating, setCreating] = useState<{
    type: "hospital" | "clinic";
    parentId?: string;
  } | null>(null);

  useEffect(() => {
    document.title = "Facilities · Caretide";
  }, []);

  const { data: facilities = [], isLoading } = useQuery({
    queryKey: queryKeys.facilities,
    queryFn: () => api.listFacilities(),
  });

  const saveMutation = useMutation({
    mutationFn: (vars: {
      id?: string;
      name: string;
      type: "hospital" | "clinic";
      parentId?: string | null;
      address?: string | null;
      phone?: string | null;
      notes?: string | null;
    }) =>
      vars.id
        ? api.updateFacility(vars.id, vars)
        : api.createFacility({
            name: vars.name,
            type: vars.type,
            parentId: vars.parentId ?? null,
            address: vars.address ?? null,
            phone: vars.phone ?? null,
            notes: vars.notes ?? null,
          }),
    onSuccess: () => {
      toast({ title: "Saved" });
      setEditing(null);
      setCreating(null);
      qc.invalidateQueries({ queryKey: queryKeys.facilities });
    },
    onError: (err: Error) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteFacility(id),
    onSuccess: () => {
      toast({ title: "Removed" });
      qc.invalidateQueries({ queryKey: queryKeys.facilities });
    },
    onError: (err: Error) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  const hospitals = facilities.filter((f) => f.type === "hospital");
  const clinicsByParent = facilities
    .filter((f) => f.type === "clinic")
    .reduce<Record<string, Facility[]>>((acc, c) => {
      const k = c.parentId ?? "_orphan";
      (acc[k] ||= []).push(c);
      return acc;
    }, {});

  const isAdmin = user.role === "admin";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = editing?.id;
    const type = (editing?.type ?? creating?.type ?? "hospital") as
      | "hospital"
      | "clinic";
    const parentId =
      type === "clinic"
        ? (editing?.parentId ?? creating?.parentId ?? null)
        : null;
    saveMutation.mutate({
      id,
      type,
      parentId,
      name: String(fd.get("name") ?? "").trim(),
      address: String(fd.get("address") ?? "") || null,
      phone: String(fd.get("phone") ?? "") || null,
      notes: String(fd.get("notes") ?? "") || null,
    });
  };

  const dialogOpen = !!editing || !!creating;
  const dialogTitle = editing
    ? `Edit ${editing.type}`
    : creating?.type === "clinic"
      ? "Add clinic"
      : "Add hospital";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Facilities</h1>
            <p className="text-muted-foreground">
              Hospitals and their feeder clinics. All entities share the central
              record-keeping database.
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setCreating({ type: "hospital" })}>
              <Plus className="mr-2 h-4 w-4" /> Add hospital
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : hospitals.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No facilities yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {hospitals.map((h) => {
              const clinics = clinicsByParent[h.id] ?? [];
              return (
                <Card key={h.id} className="shadow-soft">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Hospital className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-xl">
                          {h.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {clinics.length} feeder clinic
                          {clinics.length === 1 ? "" : "s"}
                          {h.address ? ` · ${h.address}` : ""}
                          {h.phone ? ` · ${h.phone}` : ""}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setCreating({ type: "clinic", parentId: h.id })
                          }
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" /> Clinic
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditing(h)}
                          aria-label="Edit hospital"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Delete ${h.name} and all its clinics?`))
                              deleteMutation.mutate(h.id);
                          }}
                          aria-label="Delete hospital"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {clinics.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No clinics linked yet.
                      </p>
                    ) : (
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {clinics.map((c) => (
                          <li
                            key={c.id}
                            className="flex items-center justify-between gap-3 rounded-lg border bg-card/60 p-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <div className="min-w-0">
                                <div className="truncate font-medium">
                                  {c.name}
                                </div>
                                {(c.address || c.phone) && (
                                  <div className="truncate text-xs text-muted-foreground">
                                    {[c.address, c.phone]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </div>
                                )}
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditing(c)}
                                  aria-label="Edit clinic"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    if (confirm(`Delete ${c.name}?`))
                                      deleteMutation.mutate(c.id);
                                  }}
                                  aria-label="Delete clinic"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) {
            setEditing(null);
            setCreating(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{dialogTitle}</DialogTitle>
            {creating?.type === "clinic" && (
              <DialogDescription>
                Linked to{" "}
                {hospitals.find((h) => h.id === creating.parentId)?.name ?? ""}
              </DialogDescription>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editing?.name ?? ""}
                required
              />
            </div>
            {editing?.type === "clinic" && (
              <div className="space-y-2">
                <Label>Parent hospital</Label>
                <Select
                  defaultValue={editing.parentId ?? undefined}
                  onValueChange={(v) =>
                    setEditing((prev) => (prev ? { ...prev, parentId: v } : prev))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={editing?.address ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={editing?.phone ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={editing?.notes ?? ""}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Facilities;
