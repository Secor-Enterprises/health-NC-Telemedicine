import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { User } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: User;
}

export function EditPatientDialog({ open, onOpenChange, patient }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState(() => initial(patient));

  // Reset form when patient changes or dialog reopens.
  useEffect(() => {
    if (open) setForm(initial(patient));
  }, [open, patient]);

  const update = useMutation({
    mutationFn: () =>
      api.updatePatient(patient.id, {
        fullName: form.fullName,
        profile: {
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
          phone: form.phone || null,
          address: form.address || null,
          bloodType: form.bloodType || null,
          allergies: form.allergies || null,
          emergencyContact: form.emergencyContact || null,
        },
      }),
    onSuccess: () => {
      toast({ title: "Patient updated", description: "Audit log entry recorded." });
      onOpenChange(false);
      qc.invalidateQueries({ queryKey: queryKeys.patient(patient.id) });
      qc.invalidateQueries({ queryKey: queryKeys.patients });
      qc.invalidateQueries({ queryKey: queryKeys.patientAudit(patient.id) });
    },
    onError: (err: Error) =>
      toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    update.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
          <DialogDescription>
            Changes are recorded in the audit log with your name and timestamp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ep-name">Full name</Label>
            <Input
              id="ep-name"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-dob">Date of birth</Label>
            <Input
              id="ep-dob"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-phone">Phone</Label>
            <Input
              id="ep-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ep-address">Address</Label>
            <Input
              id="ep-address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-blood">Blood type</Label>
            <Input
              id="ep-blood"
              value={form.bloodType}
              onChange={(e) => setForm((f) => ({ ...f, bloodType: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-emerg">Emergency contact</Label>
            <Input
              id="ep-emerg"
              value={form.emergencyContact}
              onChange={(e) => setForm((f) => ({ ...f, emergencyContact: e.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ep-allergies">Allergies</Label>
            <Textarea
              id="ep-allergies"
              rows={2}
              value={form.allergies}
              onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function initial(p: User) {
  const profile = p.profile;
  return {
    fullName: p.fullName,
    dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    bloodType: profile?.bloodType ?? "",
    allergies: profile?.allergies ?? "",
    emergencyContact: profile?.emergencyContact ?? "",
  };
}
