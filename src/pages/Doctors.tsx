import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Stethoscope, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { AvailabilitySlot, DoctorProfile, User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DoctorEntry = DoctorProfile & { user: User };

const Doctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<DoctorEntry | null>(null);
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.title = "Find a doctor · Caretide";
  }, []);

  const { data: doctors = [] } = useQuery({
    queryKey: queryKeys.doctors,
    queryFn: () => api.listDoctors(),
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

  // Reset booking form when doctor changes
  useEffect(() => {
    setChosenSlot(null);
    setReason("");
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Find a doctor</h1>
          <p className="text-muted-foreground">
            Browse available clinicians and pick an open time slot.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
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
          ))}
        </div>

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                Book with {selected?.user.fullName}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBook} className="space-y-4">
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
