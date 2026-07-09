import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Calendar,
  ShieldCheck,
  Stethoscope,
  FileText,
  Lock,
  ArrowRight,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-soft">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-semibold">Caretide</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Platform</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#security" className="hover:text-foreground">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?mode=register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="container grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-in space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success" />
              Secure telemedicine, hosted on your terms
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Care that travels at the <span className="text-primary">speed of trust.</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              A clinical-grade portal for patients and clinicians — appointments,
              records, and visit notes in one calm, focused workspace.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" asChild>
                <Link to="/auth?mode=register">
                  Create account <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">I already have an account</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Self-hosted ready</div>
              <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Role-based access</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-hero opacity-20 blur-3xl" />
            <div className="relative rounded-2xl border bg-gradient-card p-6 shadow-elevated">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary" />
                  <div>
                    <div className="font-medium">Dr. Sarah Chen</div>
                    <div className="text-xs text-muted-foreground">General Practice</div>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  Confirmed
                </span>
              </div>
              <div className="space-y-3 py-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Tomorrow · 10:30 AM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Reason: BP follow-up</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t pt-4 text-center">
                {["Records", "Notes", "History"].map((l) => (
                  <div key={l} className="rounded-lg bg-secondary/50 px-2 py-3 text-xs font-medium">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold">Everything a clinic needs. Nothing more.</h2>
          <p className="mt-3 text-muted-foreground">
            Three primitives that respect both patient and provider time.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Calendar, title: "Appointments", body: "Request, confirm, and review visits without endless phone tag." },
            { icon: FileText, title: "Medical records", body: "Visit notes, diagnoses, and uploaded documents in one timeline." },
            { icon: Stethoscope, title: "Provider portal", body: "Doctors see their schedule and patient history at a glance." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border bg-gradient-card p-6 shadow-soft transition-shadow hover:shadow-elevated">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-y bg-gradient-soft py-20">
        <div className="container grid gap-10 md:grid-cols-3">
          {[
            { n: "01", t: "Register", d: "Patients and clinicians create their accounts in under a minute." },
            { n: "02", t: "Connect", d: "Patients book a visit; doctors confirm from their schedule view." },
            { n: "03", t: "Care", d: "Notes and files attach to the record — accessible whenever needed." },
          ].map((s) => (
            <div key={s.n}>
              <div className="font-display text-5xl text-primary/40">{s.n}</div>
              <h3 className="mt-2 font-display text-2xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section id="security" className="container py-20">
        <div className="rounded-3xl border bg-gradient-hero p-10 text-primary-foreground shadow-elevated md:p-16">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-4xl font-semibold">Built for self-hosting.</h2>
              <p className="mt-4 max-w-xl text-primary-foreground/85">
                Caretide ships as a frontend that talks to your REST API. Keep
                patient data within your network, your jurisdiction, your rules.
              </p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth?mode=register">
                Start now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} Secor Enterprises(Pty)Ltd</span>
          </div>
          <div>Northern Cape telemedicine portal</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
