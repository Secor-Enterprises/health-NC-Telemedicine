export type Role =
  | "patient"
  | "doctor"
  | "nurse"
  | "specialist"
  | "administration"
  | "executive"
  | "azure";

export const roles: { id: Role; label: string; subtitle: string }[] = [
  { id: "patient", label: "Patient", subtitle: "Appointments and personal health" },
  { id: "doctor", label: "Doctor", subtitle: "Consultation and clinical decisions" },
  { id: "nurse", label: "Nurse", subtitle: "Triage, vitals and care tasks" },
  { id: "specialist", label: "Specialist", subtitle: "Referrals and second opinions" },
  { id: "administration", label: "Administration", subtitle: "Facilities and scheduling" },
  { id: "executive", label: "Executive", subtitle: "Provincial health intelligence" },
  { id: "azure", label: "Azure Admin", subtitle: "Platform health and security" }
];

export const languages = [
  "English", "Afrikaans", "isiZulu", "isiXhosa", "Sepedi", "Setswana",
  "Sesotho", "XiTsonga", "siSwati", "Tshivenda", "isiNdebele"
];

export type Dashboard = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: { label: string; value: string; change: string }[];
  queueTitle: string;
  queue: { name: string; detail: string; status: string }[];
  actions: string[];
};

export const dashboards: Record<Role, Dashboard> = {
  patient: {
    eyebrow: "My health",
    title: "Good morning, Naledi",
    description: "Your next virtual consultation is ready. Review your care plan and recent results.",
    metrics: [
      { label: "Next appointment", value: "09:30", change: "Today" },
      { label: "Medication adherence", value: "94%", change: "+6% this month" },
      { label: "Open care tasks", value: "3", change: "1 due today" }
    ],
    queueTitle: "Your care journey",
    queue: [
      { name: "Virtual consultation", detail: "Dr. Mokoena · 09:30", status: "Ready" },
      { name: "Blood pressure check", detail: "Submit before 17:00", status: "Due" },
      { name: "Prescription refill", detail: "Available at Upington Clinic", status: "Approved" }
    ],
    actions: ["Join consultation", "Book appointment", "Send WhatsApp message"]
  },
  doctor: {
    eyebrow: "Clinical workspace",
    title: "Today's patient queue",
    description: "Prioritised consultations across district hospitals and feeder clinics.",
    metrics: [
      { label: "Patients today", value: "18", change: "4 urgent" },
      { label: "Average wait", value: "12m", change: "-8m" },
      { label: "Avoided transfers", value: "7", change: "This week" }
    ],
    queueTitle: "Priority queue",
    queue: [
      { name: "Naledi Molefe", detail: "Hypertension follow-up · Kuruman Clinic", status: "Ready" },
      { name: "Thabo Jacobs", detail: "Respiratory symptoms · De Aar Clinic", status: "Urgent" },
      { name: "Lerato Dlamini", detail: "Diabetes review · Upington Hospital", status: "Waiting" }
    ],
    actions: ["Start consultation", "Review referrals", "Create prescription"]
  },
  nurse: {
    eyebrow: "Nursing operations",
    title: "Triage and care tasks",
    description: "Capture observations, prioritise patients and coordinate facility care.",
    metrics: [
      { label: "Awaiting triage", value: "9", change: "3 urgent" },
      { label: "Vitals complete", value: "24", change: "Today" },
      { label: "Care tasks", value: "11", change: "5 completed" }
    ],
    queueTitle: "Triage queue",
    queue: [
      { name: "Mpho Daniels", detail: "Chest discomfort · Walk-in", status: "Urgent" },
      { name: "Kagiso Ndlovu", detail: "Antenatal check · Appointment", status: "Next" },
      { name: "Zanele Maseko", detail: "Vaccination · Walk-in", status: "Waiting" }
    ],
    actions: ["Start triage", "Record vitals", "Escalate patient"]
  },
  specialist: {
    eyebrow: "Specialist network",
    title: "Referral review centre",
    description: "Review high-priority referrals and provide remote specialist guidance.",
    metrics: [
      { label: "New referrals", value: "13", change: "5 priority" },
      { label: "Reviews completed", value: "8", change: "Today" },
      { label: "Median response", value: "2.4h", change: "-18%" }
    ],
    queueTitle: "Referral inbox",
    queue: [
      { name: "Cardiology review", detail: "ECG attached · Kuruman", status: "Priority" },
      { name: "Radiology opinion", detail: "Chest image · De Aar", status: "New" },
      { name: "Dermatology case", detail: "Image set · Springbok", status: "Reviewing" }
    ],
    actions: ["Open referral", "Join MDT meeting", "Send clinical opinion"]
  },
  administration: {
    eyebrow: "Facility administration",
    title: "Operations command centre",
    description: "Coordinate appointments, queues, facilities and patient communications.",
    metrics: [
      { label: "Appointments", value: "146", change: "Across 9 facilities" },
      { label: "No-show risk", value: "11%", change: "-4%" },
      { label: "Open incidents", value: "2", change: "Low severity" }
    ],
    queueTitle: "Operational alerts",
    queue: [
      { name: "Kuruman Clinic", detail: "Queue above threshold", status: "Attention" },
      { name: "De Aar Clinic", detail: "Backup link active", status: "Stable" },
      { name: "Upington Hospital", detail: "Teams room available", status: "Ready" }
    ],
    actions: ["Register patient", "Manage schedule", "Send notifications"]
  },
  executive: {
    eyebrow: "Provincial overview",
    title: "Northern Cape health intelligence",
    description: "Real-time access, utilisation and system-pressure indicators.",
    metrics: [
      { label: "Virtual consultations", value: "1,284", change: "+22% month-on-month" },
      { label: "Avoided transfers", value: "312", change: "Estimated R2.1m saved" },
      { label: "Platform availability", value: "99.93%", change: "Within target" }
    ],
    queueTitle: "District performance",
    queue: [
      { name: "ZF Mgcawu", detail: "High adoption · 91%", status: "On track" },
      { name: "Pixley ka Seme", detail: "Wait time improving", status: "Watch" },
      { name: "John Taolo Gaetsewe", detail: "Specialist demand elevated", status: "Action" }
    ],
    actions: ["Open facility map", "View cost savings", "Export executive report"]
  },
  azure: {
    eyebrow: "Platform administration",
    title: "Azure service health",
    description: "Deployment, identity, observability and security controls for the demo environment.",
    metrics: [
      { label: "Services healthy", value: "12/12", change: "South Africa North" },
      { label: "Security score", value: "86%", change: "+4%" },
      { label: "Deployments", value: "3", change: "Last 24 hours" }
    ],
    queueTitle: "Platform events",
    queue: [
      { name: "Microsoft Entra ID", detail: "Conditional Access healthy", status: "Healthy" },
      { name: "Azure SQL Database", detail: "RLS and threat detection active", status: "Healthy" },
      { name: "FHIR API", detail: "P95 latency 184ms", status: "Healthy" }
    ],
    actions: ["View deployments", "Open audit log", "Run readiness check"]
  }
};
