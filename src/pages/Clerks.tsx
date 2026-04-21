import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import type { User } from "@/lib/types";

const Clerks = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  useEffect(() => {
    document.title = "Clerks · Caretide";
  }, []);

  const clerksQuery = useQuery({
    queryKey: queryKeys.clerks,
    queryFn: () => api.listClerks(),
  });

  const create = useMutation({
    mutationFn: (input: Parameters<typeof api.createClerk>[0]) => api.createClerk(input),
    onSuccess: () => {
      toast({ title: "Clerk created" });
      setOpen(false);
      qc.invalidateQueries({ queryKey: queryKeys.clerks });
    },
    onError: (err: Error) =>
      toast({ title: "Could not create clerk", description: err.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteClerk(id),
    onSuccess: () => {
      toast({ title: "Clerk removed" });
      setToDelete(null);
      qc.invalidateQueries({ queryKey: queryKeys.clerks });
    },
    onError: (err: Error) =>
      toast({ title: "Could not remove clerk", description: err.message, variant: "destructive" }),
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!fullName || !email || password.length < 8) {
      toast({ title: "Check the form", description: "Name, email, and 8+ char password are required.", variant: "destructive" });
      return;
    }
    create.mutate({ fullName, email, password });
  };

  const clerks = clerksQuery.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" /> Registration clerks
            </h1>
            <p className="text-muted-foreground">
              Front-desk users who register patients and book appointments on their behalf.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New clerk</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create clerk account</DialogTitle>
                <DialogDescription>
                  The clerk can sign in immediately with the email and password you set.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Full name</Label>
                  <Input id="c-name" name="fullName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-password">Temporary password</Label>
                  <Input id="c-password" name="password" type="text" minLength={8} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={create.isPending}>
                    {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create clerk
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">Active clerks</CardTitle>
            <CardDescription>
              Clerks can edit patient demographics, register new patients, and manage appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clerksQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : clerks.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                No clerks yet. Create one to enable front-desk patient registration.
              </div>
            ) : (
              <ul className="divide-y">
                {clerks.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="font-medium">{c.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {c.email} · joined {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Remove clerk"
                      onClick={() => setToDelete(c)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this clerk?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.fullName} will no longer be able to sign in. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && remove.mutate(toDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Clerks;
