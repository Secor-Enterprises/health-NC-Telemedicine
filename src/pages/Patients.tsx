import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { ChevronRight, Search, UserPlus, Users } from "lucide-react";

const Patients = () => {
  const { user } = useAuth();
  const [q, setQ] = useState("");

  useEffect(() => {
    document.title = "Patients · Caretide";
  }, []);

  // Everyone in care-team roles uses the patient roster endpoint so newly
  // registered patients (without appointments yet) still appear.
  const patientsQuery = useQuery({
    queryKey: queryKeys.patients,
    queryFn: () => api.listPatients(),
    enabled: !!user,
  });

  const apptsQuery = useQuery({
    queryKey: user ? queryKeys.appointments({ userId: user.id, role: user.role }) : ["appointments", "anon"],
    queryFn: () => api.listAppointments({ userId: user!.id, role: user!.role }),
    enabled: !!user,
  });

  const visitsByPatient = useMemo(() => {
    const map = new Map<string, { visits: number; last?: string }>();
    (apptsQuery.data ?? []).forEach((a) => {
      const existing = map.get(a.patientId) ?? { visits: 0, last: undefined };
      existing.visits += 1;
      if (!existing.last || a.scheduledAt > existing.last) existing.last = a.scheduledAt;
      map.set(a.patientId, existing);
    });
    return map;
  }, [apptsQuery.data]);

  const filtered = useMemo(() => {
    const list = patientsQuery.data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (p) =>
        p.fullName.toLowerCase().includes(needle) ||
        p.email.toLowerCase().includes(needle),
    );
  }, [patientsQuery.data, q]);

  const canRegister = user?.role === "admin" || user?.role === "clerk";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold">Patients</h1>
            <p className="text-muted-foreground">
              {user?.role === "doctor"
                ? "People who have appointments with you."
                : "All registered patients."}
            </p>
          </div>
          {canRegister && (
            <Button asChild>
              <Link to="/dashboard/patients/new">
                <UserPlus className="mr-1 h-4 w-4" /> Register patient
              </Link>
            </Button>
          )}
        </div>

        <Card className="shadow-soft">
          <CardHeader className="space-y-3">
            <CardTitle className="font-display text-xl">Roster</CardTitle>
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {patientsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {q ? "No patients match your search." : "No patients yet."}
                </p>
                {canRegister && !q && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard/patients/new">
                      <UserPlus className="mr-1 h-4 w-4" /> Register the first patient
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <ul className="divide-y">
                {filtered.map((p) => {
                  const v = visitsByPatient.get(p.id);
                  return (
                    <li key={p.id}>
                      <Link
                        to={`/dashboard/patients/${p.id}`}
                        className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-secondary/40 -mx-2 px-2 rounded-md"
                      >
                        <div>
                          <div className="font-medium">{p.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {p.email}
                            {v
                              ? ` · ${v.visits} visit${v.visits === 1 ? "" : "s"}${v.last ? ` · last ${new Date(v.last).toLocaleDateString()}` : ""}`
                              : " · no visits yet"}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
