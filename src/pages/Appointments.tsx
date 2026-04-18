import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { AppointmentStatus } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

const statusColor: Record<AppointmentStatus, string> = {
  requested: "bg-warning/15 text-warning-foreground",
  confirmed: "bg-success/15 text-success",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const Appointments = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    document.title = "Appointments · Caretide";
  }, []);

  const { data: appts = [], isLoading } = useQuery({
    queryKey: user ? queryKeys.appointments({ userId: user.id, role: user.role }) : ["appointments", "anon"],
    queryFn: () => api.listAppointments({ userId: user!.id, role: user!.role }),
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; status: AppointmentStatus }) =>
      api.updateAppointment(vars.id, { status: vars.status }),
    onSuccess: (_, vars) => {
      toast({ title: "Updated", description: `Appointment ${vars.status}.` });
      qc.invalidateQueries({ queryKey: queryKeys.appointmentsAll });
    },
    onError: (err: Error) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Appointments</h1>
            <p className="text-muted-foreground">
              {user.role === "patient" ? "Your visits, past and upcoming." : "Schedule and patient visits."}
            </p>
          </div>
          {user.role === "patient" && (
            <Button asChild>
              <a href="/dashboard/doctors">Book a visit</a>
            </Button>
          )}
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">All appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : appts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No appointments yet.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {appts.map((a) => (
                  <li key={a.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {user.role === "patient" ? a.doctorName : a.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {a.specialty} · {new Date(a.scheduledAt).toLocaleString()} · {a.durationMinutes}min
                      </div>
                      <div className="text-sm">{a.reason}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColor[a.status]}`}>
                        {a.status}
                      </span>
                      {(user.role === "doctor" || user.role === "admin") && (
                        <Select
                          onValueChange={(v) => updateMutation.mutate({ id: a.id, status: v as AppointmentStatus })}
                        >
                          <SelectTrigger className="h-8 w-[140px] text-xs">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="completed">Mark completed</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
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

export default Appointments;
