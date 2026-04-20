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
import type { PatientObservation } from "@/lib/types";

export type ObservationCategory =
  | "laboratory"
  | "vital-signs"
  | "imaging"
  | "social-history"
  | "exam";

export type ObservationStatus =
  | "registered"
  | "preliminary"
  | "final"
  | "amended"
  | "cancelled";

export interface ObservationFormValues {
  code: string;
  display: string;
  valueNumber?: number;
  valueString?: string;
  unit?: string;
  category: ObservationCategory;
  status: ObservationStatus;
  note?: string;
}

const schema = z.object({
  code: z.string().trim().min(1, "Code required").max(64),
  display: z.string().trim().min(1, "Name required").max(200),
  unit: z.string().trim().max(32).optional(),
  note: z.string().trim().max(2000).optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: PatientObservation | null;
  pending: boolean;
  onSubmit: (values: ObservationFormValues) => void;
}

export function ObservationDialog({
  open, onOpenChange, mode, initial, pending, onSubmit,
}: Props) {
  const [category, setCategory] = useState<ObservationCategory>("laboratory");
  const [status, setStatus] = useState<ObservationStatus>("final");

  useEffect(() => {
    if (open) {
      setCategory((initial?.category as ObservationCategory) ?? "laboratory");
      setStatus((initial?.status as ObservationStatus) ?? "final");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      code: fd.get("code"),
      display: fd.get("display"),
      unit: fd.get("unit") || undefined,
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
    const valueNumberRaw = String(fd.get("valueNumber") ?? "").trim();
    const valueStringRaw = String(fd.get("valueString") ?? "").trim();
    const valueNumber = valueNumberRaw === "" ? undefined : Number(valueNumberRaw);
    if (valueNumber !== undefined && !Number.isFinite(valueNumber)) {
      toast({ title: "Invalid number", variant: "destructive" });
      return;
    }
    if (valueNumber === undefined && !valueStringRaw) {
      toast({
        title: "Missing value",
        description: "Provide a numeric or text value.",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      code: parsed.data.code,
      display: parsed.data.display,
      valueNumber,
      valueString: valueStringRaw || undefined,
      unit: parsed.data.unit,
      category,
      status,
      note: parsed.data.note,
    });
  };

  const initialNumber =
    initial?.valueNumber !== null && initial?.valueNumber !== undefined
      ? String(initial.valueNumber)
      : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "edit" ? "Edit lab result or vital" : "Add lab result or vital"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3" key={initial?.id ?? "new"}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="code">LOINC code</Label>
              <Input
                id="code"
                name="code"
                placeholder="e.g. 718-7"
                required
                maxLength={64}
                defaultValue={initial?.code ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ObservationCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="vital-signs">Vital signs</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="social-history">Social history</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display">Name / description</Label>
            <Input
              id="display"
              name="display"
              placeholder="e.g. Hemoglobin"
              required
              maxLength={200}
              defaultValue={initial?.display ?? ""}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="valueNumber">Numeric value</Label>
              <Input
                id="valueNumber"
                name="valueNumber"
                type="number"
                step="any"
                defaultValue={initialNumber}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                name="unit"
                placeholder="g/dL"
                maxLength={32}
                defaultValue={initial?.unit ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valueString">Or text value</Label>
              <Input
                id="valueString"
                name="valueString"
                placeholder="Positive"
                maxLength={500}
                defaultValue={initial?.valueString ?? ""}
              />
            </div>
          </div>
          {mode === "edit" && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ObservationStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="preliminary">Preliminary</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="amended">Amended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" name="note" maxLength={2000} defaultValue={""} />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : mode === "edit" ? "Save changes" : "Save result"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
