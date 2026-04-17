import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { HeartPulse, Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

const Auth = () => {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "register" ? "register" : "login";
  const [tab, setTab] = useState<"login" | "register">(initialMode);
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign in · Caretide";
  }, []);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await login(String(fd.get("email")), String(fd.get("password")));
      toast({ title: "Welcome back" });
      navigate("/dashboard");
    } catch (err) {
      toast({ title: "Sign-in failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await register({
        fullName: String(fd.get("fullName")),
        email: String(fd.get("email")),
        password: String(fd.get("password")),
        role: String(fd.get("role")) as UserRole,
      });
      toast({ title: "Account created", description: "Welcome to Caretide." });
      navigate("/dashboard");
    } catch (err) {
      toast({ title: "Registration failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden bg-gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/15 backdrop-blur">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="font-display text-2xl font-semibold">Caretide</span>
        </Link>
        <div className="space-y-6">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Calm, careful, clinical — the way care should feel online.
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Demo accounts ready: <span className="font-medium">patient@demo.com</span> or{" "}
            <span className="font-medium">doctor@demo.com</span> · password{" "}
            <span className="font-medium">demo1234</span>
          </p>
        </div>
        <div className="text-sm text-primary-foreground/70">© {new Date().getFullYear()} Caretide</div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-gradient-soft p-6">
        <Card className="w-full max-w-md shadow-elevated">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in or create an account to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" name="email" type="email" required defaultValue="patient@demo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" name="password" type="password" required defaultValue="demo1234" />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full name</Label>
                    <Input id="reg-name" name="fullName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" name="password" type="password" required minLength={8} />
                  </div>
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <RadioGroup name="role" defaultValue="patient" className="grid grid-cols-2 gap-2">
                      <Label className="flex cursor-pointer items-center gap-2 rounded-md border bg-card p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary">
                        <RadioGroupItem value="patient" />
                        Patient
                      </Label>
                      <Label className="flex cursor-pointer items-center gap-2 rounded-md border bg-card p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary">
                        <RadioGroupItem value="doctor" />
                        Doctor
                      </Label>
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
