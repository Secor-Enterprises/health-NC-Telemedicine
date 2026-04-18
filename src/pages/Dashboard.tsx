import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { Calendar, FileText, Stethoscope, Users, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Dashboard · Caretide";
  }, []);

  const { data: appts = [], isLoading } = useQuery({
    queryKey: user ? queryKeys.appointments({ userId: user.id, role: user.role }) : ["appointments", "anon"],
    queryFn: () => api.listAppointments({ userId: user!.id, role: user!.role }),
    enabled: !!user,
  });

  if (!user) return null;

  const upcoming = appts.filter((a) => new Date(a.scheduledAt) > new Date() && a.status !== "cancelled");

  const greeting =
    user.role === "doctor" ? `Good day, Dr. ${user.fullName.split(" ").pop()}`
    : user.role === "admin" ? "Admin overview"
    : `Hello, ${user.fullName.split(" ")[0]}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">{greeting}</h1>
          <p className="text-muted-foreground">
            {user.role === "patient"
              ? "Here's a quick view of your care."
              : user.role === "doctor"
                ? "Here's your schedule and recent activity."
                : "System-wide overview."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={Calendar} label="Upcoming appointments" value={isLoading ? "—" : upcoming.length} />
          {user.role === "patient" && (
            <>
              <StatCard icon={FileText} label="Records on file" value="View" to="/dashboard/records" />
              <StatCard icon={Stethoscope} label="Find a doctor" value="Browse" to="/dashboard/doctors" />
            </>
          )}
          {user.role === "doctor" && (
            <>
              <StatCard icon={Users} label="Active patients" value={new Set(appts.map((a) => a.patientId)).size} />
              <StatCard icon={Calendar} label="Open schedule" value="Manage" to="/dashboard/appointments" />
            </>
          )}
          {user.role === "admin" && (
            <>
              <StatCard icon={Users} label="Total appointments" value={appts.length} />
              <StatCard icon={Stethoscope} label="Doctors" value="Manage" to="/dashboard/doctors" />
            </>
          )}
        </div>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl">Upcoming</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/appointments">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : upcoming.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
                {user.role === "patient" && (
                  <Button className="mt-3" asChild>
                    <Link to="/dashboard/doctors">Book a visit</Link>
                  </Button>
                )}
              </div>
            ) : (
              <ul className="divide-y">
                {upcoming.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">
                        {user.role === "patient" ? a.doctorName : a.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {a.specialty} · {new Date(a.scheduledAt).toLocaleString()}
                      </div>
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground capitalize">
                      {a.status}
                    </span>
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

function StatCard({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  to?: string;
}) {
  const inner = (
    <Card className="h-full transition-shadow hover:shadow-elevated">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default Dashboard;
