import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(200).optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
  phone: z.string().max(40).optional(),
  address: z.string().max(500).optional(),
  bloodType: z.string().max(10).optional(),
  allergies: z.string().max(1000).optional(),
  emergencyContact: z.string().max(200).optional(),
});

const RegisterPatient = () => {
  const [createLogin, setCreateLogin] = useState(true);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    document.title = "Register patient · Caretide";
  }, []);

  const create = useMutation({
    mutationFn: (input: Parameters<typeof api.createPatient>[0]) => api.createPatient(input),
    onSuccess: (p) => {
      toast({
        title: "Patient registered",
        description: p.canLogin
          ? `${p.fullName} can now sign in with their email.`
          : `${p.fullName} has been added (no login created).`,
      });
      qc.invalidateQueries({ queryKey: queryKeys.patients });
      navigate(`/dashboard/patients/${p.id}`);
    },
    onError: (err: Error) =>
      toast({ title: "Could not register patient", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      password: createLogin ? String(fd.get("password") ?? "") : "",
      dateOfBirth: String(fd.get("dateOfBirth") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      bloodType: String(fd.get("bloodType") ?? ""),
      allergies: String(fd.get("allergies") ?? ""),
      emergencyContact: String(fd.get("emergencyContact") ?? ""),
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast({
        title: "Check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    if (createLogin && !parsed.data.password) {
      toast({ title: "Password required", description: "Provide a temporary password or disable login.", variant: "destructive" });
      return;
    }

    create.mutate({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      password: createLogin ? parsed.data.password : undefined,
      profile: {
        dateOfBirth: parsed.data.dateOfBirth
          ? new Date(parsed.data.dateOfBirth).toISOString()
          : null,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
        bloodType: parsed.data.bloodType || null,
        allergies: parsed.data.allergies || null,
        emergencyContact: parsed.data.emergencyContact || null,
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <UserPlus className="h-7 w-7 text-primary" /> Register patient
          </h1>
          <p className="text-muted-foreground">
            Capture demographics and (optionally) provision a login account.
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">New patient</CardTitle>
            <CardDescription>All fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name *</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood type</Label>
                <Input id="bloodType" name="bloodType" placeholder="e.g. O+" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency contact</Label>
                <Input id="emergencyContact" name="emergencyContact" placeholder="Name · phone" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea id="allergies" name="allergies" rows={2} placeholder="List known allergies, if any" />
              </div>

              <div className="md:col-span-2 rounded-lg border bg-secondary/30 p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Label htmlFor="createLogin" className="text-base">Create login account</Label>
                    <p className="text-sm text-muted-foreground">
                      Patient can sign in with their email and the temporary password you set.
                    </p>
                  </div>
                  <Switch id="createLogin" checked={createLogin} onCheckedChange={setCreateLogin} />
                </div>
                {createLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Temporary password *</Label>
                    <Input id="password" name="password" type="text" minLength={8} required={createLogin} />
                    <p className="text-xs text-muted-foreground">
                      Share securely with the patient. They can change it after first sign-in.
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register patient
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegisterPatient;
