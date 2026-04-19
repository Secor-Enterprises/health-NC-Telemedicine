import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Stethoscope, Calendar as CalendarIcon, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
import type { AvailabilitySlot, DoctorProfile, User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DoctorEntry = DoctorProfile & { user: User };

const ALL = "__all__";

const Doctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<DoctorEntry | null>(null);
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [facilityId, setFacilityId] = useState<string>("");
  const [filterFacilityId, setFilterFacilityId] = useState<string>(ALL);

  useEffect(() => {
    document.title = "Find a doctor · Caretide";
  }, []);

  const { data: facilities = [] } = useQuery({
    queryKey: queryKeys.facilities,
    queryFn: () => api.listFacilities(),
  });

  const activeFacilityId =
    filterFacilityId === ALL ? undefined : filterFacilityId;

  const { data: doctors = [] } = useQuery({
    queryKey: queryKeys.doctorsByFacility(activeFacilityId),
    queryFn: () => api.listDoctors({ facilityId: activeFacilityId }),
  });

  const { data: slots = [], isLoading: loadingSlots } = useQuery({
    queryKey: selected
      ? queryKeys.slots({ doctorId: selected.userId, onlyOpen: true })
      : ["slots", "none"],
    queryFn: () => api.listSlots({ doctorId: selected!.userId, onlyOpen: true }),
    enabled: !!selected,
  });

  const bookMutation = useMutation({
    mutationFn: () =>
      api.createAppointment({
        patientId: user!.id,
        patientName: user!.fullName,
        doctorId: selected!.userId,
        scheduledAt: chosenSlot!,
        reason,
        facilityId: facilityId || null,
      }),
    onSuccess: () => {
      toast({ title: "Appointment requested", description: "We'll notify you on confirmation." });
      qc.invalidateQueries({ queryKey: queryKeys.appointmentsAll });
      if (selected) {
        qc.invalidateQueries({ queryKey: queryKeys.slotsByDoctor(selected.userId) });
      }
      setSelected(null);
      navigate("/dashboard/appointments");
    },
    onError: (err: Error) => {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    },
  });

  // Reset booking form when doctor changes; default facility to doctor's primary
  useEffect(() => {
    setChosenSlot(null);
    setReason("");
    setFacilityId(selected?.primaryFacilityId ?? "");
  }, [selected]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selected || !chosenSlot) return;
    bookMutation.mutate();
  };

  const grouped = slots.reduce<Record<string, AvailabilitySlot[]>>((acc, s) => {
    const key = format(new Date(s.startsAt), "EEE, MMM d");
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  // Group facilities for the filter: hospitals first, then their clinics indented
  const facilityOptions = useMemo(() => {
    const hospitals = facilities.filter((f) => f.type === "hospital");
    const clinicsByParent = new Map<string, typeof facilities>();
    for (const f of facilities) {
      if (f.type === "clinic" && f.parentId) {
        const arr = clinicsByParent.get(f.parentId) ?? [];
        arr.push(f);
        clinicsByParent.set(f.parentId, arr);
      }
    }
    const out: { id: string; label: string; depth: number }[] = [];
    for (const h of hospitals) {
      out.push({ id: h.id, label: h.name, depth: 0 });
      for (const c of clinicsByParent.get(h.id) ?? []) {
        out.push({ id: c.id, label: c.name, depth: 1 });
      }
    }
    return out;
  }, [facilities]);

  const formatFacility = (d: DoctorEntry) => {
    if (!d.primaryFacility) return null;
    const pf = d.primaryFacility;
    return pf.parent ? `${pf.parent.name} · ${pf.name}` : pf.name;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Find a doctor</h1>
            <p className="text-muted-foreground">
              Browse available clinicians and pick an open time slot.
            </p>
          </div>
          <div className="w-full sm:w-72 space-y-1.5">
            <Label htmlFor="facility-filter" className="text-xs uppercase tracking-wider text-muted-foreground">
              Filter by facility
            </Label>
            <Select value={filterFacilityId} onValueChange={setFilterFacilityId}>
              <SelectTrigger id="facility-filter">
                <SelectValue placeholder="All facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All facilities</SelectItem>
                {facilityOptions.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.depth === 1 ? `\u00A0\u00A0\u00A0\u00A0${f.label}` : f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {doctors.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No doctors found for this facility.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => {
              const facilityLabel = formatFacility(d);
              return (
                <Card key={d.userId} className="transition-shadow hover:shadow-elevated">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-display text-lg font-semibold">
                          {d.user.fullName}
                        </div>
                        <div className="text-sm text-muted-foreground">{d.specialty}</div>
                      </div>
                    </div>
                    {facilityLabel && (
                      <Badge variant="secondary" className="gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {facilityLabel}
                      </Badge>
                    )}
                    {d.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{d.bio}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>License {d.licenseNumber}</span>
                      {d.yearsExperience && <span>{d.yearsExperience} yrs experience</span>}
                    </div>
                    <Button className="w-full" onClick={() => setSelected(d)}>
                      <CalendarIcon className="mr-2 h-4 w-4" /> Book a visit
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                Book with {selected?.user.fullName}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBook} className="space-y-4">
              {selected && formatFacility(selected) && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>Primary facility:</span>
                    <span className="font-medium text-foreground">
                      {formatFacility(selected)}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Pick an open time</Label>
                {loadingSlots ? (
                  <p className="text-sm text-muted-foreground">Loading slots…</p>
                ) : slots.length === 0 ? (
                  <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No open slots in the next 30 days.
                  </p>
                ) : (
                  <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
                    {Object.entries(grouped).map(([day, items]) => (
                      <div key={day}>
                        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {day}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {items.map((s) => {
                            const active = chosenSlot === s.startsAt;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setChosenSlot(s.startsAt)}
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "bg-card hover:bg-secondary",
                                )}
                              >
                                {format(new Date(s.startsAt), "p")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for visit</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Briefly describe your symptoms or reason."
                />
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

              <Button
                type="submit"
                className="w-full"
                disabled={!chosenSlot || bookMutation.isPending}
              >
                {bookMutation.isPending ? "Requesting…" : "Request appointment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
