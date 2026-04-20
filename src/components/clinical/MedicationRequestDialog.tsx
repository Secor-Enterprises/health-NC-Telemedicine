import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { PatientMedicationRequest } from "@/lib/types";

export type MedRequestStatus =
  | "active" | "on_hold" | "cancelled" | "completed" | "draft";

export interface MedRequestFormValues {
  medicationName: string;
  medicationCode?: string;
  dosage?: string;
  frequency?: string;
  status: MedRequestStatus;
  note?: string;
}

const schema = z.object({
  medicationName: z.string().trim().min(1, "Medication required").max(200),
  medicationCode: z.string().trim().max(64).optional(),
  dosage: z.string().trim().max(200).optional(),
  frequency: z.string().trim().max(64).optional(),
  note: z.string().trim().max(2000).optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: PatientMedicationRequest | null;
  pending: boolean;
  onSubmit: (values: MedRequestFormValues) => void;
}

export function MedicationRequestDialog({
  open, onOpenChange, mode, initial, pending, onSubmit,
}: Props) {
  const [status, setStatus] = useState<MedRequestStatus>("active");

  useEffect(() => {
    if (open) {
      const s = (initial?.status as MedRequestStatus) ?? "active";
      // Filter out unsupported statuses in form (stopped/unknown)
      const allowed: MedRequestStatus[] = ["active", "on_hold", "cancelled", "completed", "draft"];
      setStatus(allowed.includes(s) ? s : "active");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      medicationName: fd.get("medicationName"),
      medicationCode: fd.get("medicationCode") || undefined,
      dosage: fd.get("dosage") || undefined,
      frequency: fd.get("frequency") || undefined,
      note: fd.get("note") || undefined,
    });
    if (!parsed.success) {
      toast({
        title: "Invalid input",
        description: parsed.error.issues[0]?.message ?? "Check the form",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      medicationName: parsed.data.medicationName,
      medicationCode: parsed.data.medicationCode,
      dosage: parsed.data.dosage,
      frequency: parsed.data.frequency,
      status,
      note: parsed.data.note,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "edit" ? "Edit prescription" : "New prescription"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3" key={initial?.id ?? "new"}>
          <div className="space-y-2">
            <Label htmlFor="medicationName">Medication</Label>
            <Input
              id="medicationName"
              name="medicationName"
              placeholder="e.g. Amoxicillin 500mg"
              required
              maxLength={200}
              defaultValue={initial?.medicationName ?? ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="medicationCode">RxNorm code (optional)</Label>
              <Input
                id="medicationCode"
                name="medicationCode"
                maxLength={64}
                defaultValue={initial?.medicationCode ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as MedRequestStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="on_hold">On hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                name="dosage"
                placeholder="1 tablet by mouth"
                maxLength={200}
                defaultValue={initial?.dosage ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                name="frequency"
                placeholder="BID, QD, PRN…"
                maxLength={64}
                defaultValue={initial?.frequency ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" name="note" maxLength={2000} defaultValue={""} />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : mode === "edit" ? "Save changes" : "Create prescription"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
