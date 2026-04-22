import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, KeyRound, Loader2, LogOut } from "lucide-react";

/**
 * Full-screen gate shown when the signed-in user must change their temporary
 * password. Blocks all dashboard navigation until the change succeeds.
 */
export function ForcePasswordChangeGate() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api.changePassword({ currentPassword: current, newPassword: next }),
    onSuccess: async () => {
      toast({ title: "Password updated", description: "Welcome aboard." });
      await refresh();
    },
    onError: (err: Error) =>
      toast({
        title: "Could not update password",
        description: err.message,
        variant: "destructive",
      }),
  });

  if (!user) return null;

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

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-soft px-4 py-10">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <CardTitle className="font-display text-2xl">Set a new password</CardTitle>
          <CardDescription>
            Hi {user.fullName.split(" ")[0]}, your account was created with a
            temporary password. To protect patient data, you need to choose a
            new password before accessing the {user.role} portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fpc-current">Current (temporary) password</Label>
              <Input
                id="fpc-current"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                autoComplete="current-password"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fpc-new">New password</Label>
              <Input
                id="fpc-new"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fpc-confirm">Confirm new password</Label>
              <Input
                id="fpc-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
              <Button type="submit" disabled={mutation.isPending} className="sm:flex-1">
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                Update password
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                disabled={mutation.isPending}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
