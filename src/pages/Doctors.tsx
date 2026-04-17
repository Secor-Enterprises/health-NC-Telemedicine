import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { DoctorProfile, User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Stethoscope, Calendar } from "lucide-react";

type DoctorEntry = DoctorProfile & { user: User };

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<DoctorEntry[]>([]);
  const [selected, setSelected] = useState<DoctorEntry | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Find a doctor · Caretide";
  }, []);

  useEffect(() => {
    api.listDoctors().then(setDoctors);
  }, []);

  const handleBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !selected) return;
    const fd = new FormData(e.currentTarget);
    try {
      await api.createAppointment({
        patientId: user.id,
        patientName: user.fullName,
        doctorId: selected.userId,
        scheduledAt: new Date(String(fd.get("scheduledAt"))).toISOString(),
        reason: String(fd.get("reason")),
      });
      toast({ title: "Appointment requested", description: "We'll notify you on confirmation." });
      setSelected(null);
      navigate("/dashboard/appointments");
    } catch (err) {
      toast({ title: "Booking failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Find a doctor</h1>
          <p className="text-muted-foreground">Browse available clinicians and request a visit.</p>
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
                    <div className="font-display text-lg font-semibold">{d.user.fullName}</div>
                    <div className="text-sm text-muted-foreground">{d.specialty}</div>
                  </div>
                </div>
                {d.bio && <p className="text-sm text-muted-foreground line-clamp-3">{d.bio}</p>}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>License {d.licenseNumber}</span>
                  {d.yearsExperience && <span>{d.yearsExperience} yrs experience</span>}
                </div>
                <Button className="w-full" onClick={() => setSelected(d)}>
                  <Calendar className="mr-2 h-4 w-4" /> Book a visit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                Book with {selected?.user.fullName}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBook} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Date & time</Label>
                <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for visit</Label>
                <Textarea id="reason" name="reason" required placeholder="Briefly describe your symptoms or reason." />
              </div>
              <Button type="submit" className="w-full">Request appointment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
