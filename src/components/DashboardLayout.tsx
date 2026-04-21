import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Hospital,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
  HeartPulse,
  Plug,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navByRole = {
  patient: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/appointments", label: "Appointments", icon: Calendar },
    { to: "/dashboard/records", label: "My Records", icon: FileText },
    { to: "/dashboard/doctors", label: "Find a Doctor", icon: Stethoscope },
    { to: "/dashboard/facilities", label: "Facilities", icon: Hospital },
  ],
  doctor: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/appointments", label: "Schedule", icon: Calendar },
    { to: "/dashboard/availability", label: "Availability", icon: Calendar },
    { to: "/dashboard/patients", label: "Patients", icon: Users },
    { to: "/dashboard/facilities", label: "Facilities", icon: Hospital },
  ],
  admin: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/appointments", label: "All Appointments", icon: Calendar },
    { to: "/dashboard/doctors", label: "Doctors", icon: Stethoscope },
    { to: "/dashboard/patients", label: "Patients", icon: Users },
    { to: "/dashboard/facilities", label: "Facilities", icon: Hospital },
    { to: "/dashboard/clerks", label: "Clerks", icon: ShieldCheck },
    { to: "/dashboard/integrations", label: "Integrations", icon: Plug },
  ],
  clerk: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/patients", label: "Patients", icon: Users },
    { to: "/dashboard/patients/new", label: "Register patient", icon: UserPlus },
    { to: "/dashboard/appointments", label: "Appointments", icon: Calendar },
    { to: "/dashboard/facilities", label: "Facilities", icon: Hospital },
  ],
} as const;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;
  const items = navByRole[user.role];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-soft">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">Caretide</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {user.role} portal
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium">{user.fullName}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container grid gap-6 py-6 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border bg-card p-2 shadow-soft md:flex-col md:overflow-visible">
            {items.map((item) => {
              const active =
                item.to === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
