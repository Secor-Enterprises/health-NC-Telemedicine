import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Appointment } from "@/lib/types";
import { Users } from "lucide-react";

const Patients = () => {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>([]);

  useEffect(() => {
    document.title = "Patients · Caretide";
  }, []);

  useEffect(() => {
    if (!user) return;
    api.listAppointments({ userId: user.id, role: user.role }).then(setAppts);
  }, [user]);

  const patients = useMemo(() => {
    const map = new Map<string, { id: string; name: string; visits: number; last: string }>();
    appts.forEach((a) => {
      const existing = map.get(a.patientId);
      if (!existing) {
        map.set(a.patientId, { id: a.patientId, name: a.patientName, visits: 1, last: a.scheduledAt });
      } else {
        existing.visits += 1;
        if (a.scheduledAt > existing.last) existing.last = a.scheduledAt;
      }
    });
    return [...map.values()].sort((a, b) => b.last.localeCompare(a.last));
  }, [appts]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Patients</h1>
          <p className="text-muted-foreground">People who have appointments with you.</p>
        </div>
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="font-display text-xl">Roster</CardTitle></CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No patients yet.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {patients.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.visits} visit{p.visits === 1 ? "" : "s"} · last {new Date(p.last).toLocaleDateString()}
                      </div>
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

export default Patients;
