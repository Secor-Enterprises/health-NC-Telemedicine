import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, KeyRound, AlertTriangle } from "lucide-react";

/**
 * Banner shown to users whose account was created with a temporary password
 * (currently: clerks created by an admin). Persists across pages until the
 * user successfully changes their password.
 */
export function PasswordChangeBanner() {
  const { user, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api.changePassword({ currentPassword: current, newPassword: next }),
    onSuccess: async () => {
      toast({ title: "Password updated", description: "You're all set." });
      setOpen(false);
      setCurrent("");
      setNext("");
      setConfirm("");
      await refresh();
    },
    onError: (err: Error) =>
      toast({
        title: "Could not update password",
        description: err.message,
        variant: "destructive",
      }),
  });

  if (!user?.mustChangePassword) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (next.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    if (next !== confirm) {
      toast({
        title: "Passwords don't match",
        description: "Re-type the new password.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate();
  };

  return (
    <>
      <div
        role="alert"
        className="border-b border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100"
      >
        <div className="container flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              <strong className="font-semibold">Action required:</strong> change
              your temporary password to keep your account secure.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-400/40 dark:bg-amber-900/40 dark:text-amber-50 dark:hover:bg-amber-900/60"
            onClick={() => setOpen(true)}
          >
            <KeyRound className="mr-1.5 h-4 w-4" />
            Change password
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(o) => !mutation.isPending && setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change your password</DialogTitle>
            <DialogDescription>
              Your account was created with a temporary password. Please set a
              new one before continuing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cp-current">Current (temporary) password</Label>
              <Input
                id="cp-current"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-new">New password</Label>
              <Input
                id="cp-new"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-confirm">Confirm new password</Label>
              <Input
                id="cp-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
