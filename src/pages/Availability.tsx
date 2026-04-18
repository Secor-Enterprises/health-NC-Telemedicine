import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { AvailabilitySlot } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SLOT_LENGTH_MIN = 30;

const Availability = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");

  useEffect(() => {
    document.title = "Availability · Caretide";
  }, []);

  const { data: slots = [] } = useQuery({
    queryKey: user ? queryKeys.slotsByDoctor(user.id) : ["slots", "anon"],
    queryFn: () => api.listSlots({ doctorId: user!.id }),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (vars: { startsAt: string; endsAt: string }) =>
      api.createSlot({ doctorId: user!.id, ...vars }),
    onSuccess: (_, vars) => {
      toast({ title: "Slot added", description: format(new Date(vars.startsAt), "PPP p") });
      qc.invalidateQueries({ queryKey: queryKeys.slotsByDoctor(user!.id) });
    },
    onError: (err: Error) => {
      toast({ title: "Could not add slot", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteSlot(id),
    onSuccess: () => {
      toast({ title: "Slot removed" });
      qc.invalidateQueries({ queryKey: queryKeys.slotsByDoctor(user!.id) });
    },
    onError: (err: Error) => {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    const [h, m] = time.split(":").map(Number);
    const start = new Date(date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + SLOT_LENGTH_MIN * 60_000);
    createMutation.mutate({ startsAt: start.toISOString(), endsAt: end.toISOString() });
  };

  const grouped = slots.reduce<Record<string, AvailabilitySlot[]>>((acc, s) => {
    const key = format(new Date(s.startsAt), "EEEE, MMM d");
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Availability</h1>
          <p className="text-muted-foreground">
            Open {SLOT_LENGTH_MIN}-minute slots that patients can book.
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">Add a slot</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAdd}
              className="grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end"
            >
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Start time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                <Plus className="mr-2 h-4 w-4" /> Add slot
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">Upcoming slots</CardTitle>
          </CardHeader>
          <CardContent>
            {slots.length === 0 ? (
              <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No slots yet. Add a few above so patients can book.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(grouped).map(([day, items]) => (
                  <div key={day}>
                    <div className="mb-2 text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((s) => (
                        <div
                          key={s.id}
                          className="group flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm shadow-soft"
                        >
                          <span>
                            {format(new Date(s.startsAt), "p")} –{" "}
                            {format(new Date(s.endsAt), "p")}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteMutation.mutate(s.id)}
                            disabled={deleteMutation.isPending}
                            className="rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                            aria-label="Remove slot"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Availability;
