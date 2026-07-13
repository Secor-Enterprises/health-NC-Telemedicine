export const roleIds = [
  "patient",
  "doctor",
  "nurse",
  "specialist",
  "administration",
  "executive",
  "platform-admin",
] as const;

export type RoleId = (typeof roleIds)[number];
export type IntegrationState = "Live" | "Sandbox" | "Mocked" | "Unavailable" | "Disabled";
export type SystemState = "ready" | "loading" | "empty" | "error" | "offline" | "degraded" | "permission-denied";

export type Metric = {
  label: string;
  value: string;
  context: string;
  tone?: "positive" | "neutral" | "warning";
};

export type WorkItem = {
  id: string;
  title: string;
  detail: string;
  status: string;
  priority?: "routine" | "attention" | "urgent";
};

export type PortalDefinition = {
  id: RoleId;
  label: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  navigation: string[];
  metrics: Metric[];
  queueTitle: string;
  queue: WorkItem[];
  actions: string[];
  clinicalNote?: string;
};

export const languages = [
  "English",
  "Afrikaans",
  "isiZulu",
  "isiXhosa",
  "Sepedi",
  "Setswana",
  "Sesotho",
  "XiTsonga",
  "siSwati",
  "Tshivenda",
  "isiNdebele",
] as const;

export const integrations: { name: string; state: IntegrationState; detail: string }[] = [
  { name: "Microsoft Entra ID", state: "Mocked", detail: "Demo role switching; no tenant authentication" },
  { name: "Azure SQL Database", state: "Mocked", detail: "Typed synthetic data adapter" },
  { name: "Microsoft Teams", state: "Mocked", detail: "Consultation launch simulation" },
  { name: "WhatsApp Business", state: "Mocked", detail: "Notification preference simulation" },
  { name: "HL7 FHIR R4", state: "Mocked", detail: "Resource mapping boundary only" },
];

export const portals: Record<RoleId, PortalDefinition> = {
  patient: {
    id: "patient",
    label: "Patient portal",
    shortLabel: "Patient",
    eyebrow: "My health",
    title: "Good morning, Naledi",
    description: "Manage appointments, prepare for virtual care and follow your treatment plan.",
    navigation: ["Overview", "Appointments", "Health record", "Medication", "Messages"],
    metrics: [
      { label: "Next appointment", value: "09:30", context: "Today · Virtual consultation" },
      { label: "Medication adherence", value: "94%", context: "+6% this month", tone: "positive" },
      { label: "Open care tasks", value: "3", context: "One due today", tone: "warning" },
    ],
    queueTitle: "Your care journey",
    queue: [
      { id: "p-1", title: "Virtual consultation", detail: "Dr Mokoena · Kuruman Clinic", status: "Ready" },
      { id: "p-2", title: "Blood-pressure check", detail: "Submit before 17:00", status: "Due", priority: "attention" },
      { id: "p-3", title: "Prescription refill", detail: "Available at Upington Clinic", status: "Approved" },
    ],
    actions: ["Join consultation", "Book appointment", "Request interpreter"],
  },
  doctor: {
    id: "doctor",
    label: "Doctor portal",
    shortLabel: "Doctor",
    eyebrow: "Clinical workspace",
    title: "Today's patient queue",
    description: "Review triage evidence, conduct teleconsultations and coordinate follow-up care.",
    navigation: ["Queue", "Schedule", "Patients", "Referrals", "Clinical notes"],
    metrics: [
      { label: "Patients today", value: "18", context: "Four urgent", tone: "warning" },
      { label: "Average wait", value: "12 min", context: "Eight minutes lower", tone: "positive" },
      { label: "Avoided transfers", value: "7", context: "Synthetic weekly estimate" },
    ],
    queueTitle: "Priority queue",
    queue: [
      { id: "d-1", title: "Naledi Molefe", detail: "Hypertension follow-up · Kuruman", status: "Ready" },
      { id: "d-2", title: "Thabo Jacobs", detail: "Respiratory symptoms · De Aar", status: "Urgent", priority: "urgent" },
      { id: "d-3", title: "Lerato Dlamini", detail: "Diabetes review · Upington", status: "Waiting" },
    ],
    actions: ["Start consultation", "Review referral", "Create draft prescription"],
    clinicalNote: "Decision-support indicators are advisory and require clinician confirmation.",
  },
  nurse: {
    id: "nurse",
    label: "Nurse portal",
    shortLabel: "Nurse",
    eyebrow: "Nursing operations",
    title: "Triage and care coordination",
    description: "Capture observations, prioritise patients and prepare safe clinical handovers.",
    navigation: ["Triage queue", "Vitals", "Care tasks", "Vaccinations", "Escalations"],
    metrics: [
      { label: "Awaiting triage", value: "9", context: "Three urgent", tone: "warning" },
      { label: "Vitals completed", value: "24", context: "Today", tone: "positive" },
      { label: "Open care tasks", value: "11", context: "Five completed" },
    ],
    queueTitle: "Triage queue",
    queue: [
      { id: "n-1", title: "Mpho Daniels", detail: "Chest discomfort · Walk-in", status: "Urgent", priority: "urgent" },
      { id: "n-2", title: "Kagiso Ndlovu", detail: "Antenatal check · Appointment", status: "Next" },
      { id: "n-3", title: "Zanele Maseko", detail: "Vaccination · Walk-in", status: "Waiting" },
    ],
    actions: ["Start triage", "Record vitals", "Escalate to doctor"],
    clinicalNote: "Triage guidance is not an autonomous diagnosis and remains subject to clinical review.",
  },
  specialist: {
    id: "specialist",
    label: "Specialist portal",
    shortLabel: "Specialist",
    eyebrow: "Specialist network",
    title: "Referral review centre",
    description: "Review priority referrals, request evidence and provide documented specialist guidance.",
    navigation: ["Referral inbox", "Case review", "MDT meetings", "Opinions", "Follow-up"],
    metrics: [
      { label: "New referrals", value: "13", context: "Five priority", tone: "warning" },
      { label: "Reviews completed", value: "8", context: "Today", tone: "positive" },
      { label: "Median response", value: "2.4 h", context: "18% lower" },
    ],
    queueTitle: "Referral inbox",
    queue: [
      { id: "s-1", title: "Cardiology review", detail: "ECG attached · Kuruman", status: "Priority", priority: "attention" },
      { id: "s-2", title: "Radiology opinion", detail: "Chest image · De Aar", status: "New" },
      { id: "s-3", title: "Dermatology case", detail: "Image set · Springbok", status: "Reviewing" },
    ],
    actions: ["Open referral", "Join MDT meeting", "Draft clinical opinion"],
    clinicalNote: "Specialist opinions are clearly separated from final treatment decisions.",
  },
  administration: {
    id: "administration",
    label: "Facility administration portal",
    shortLabel: "Facility admin",
    eyebrow: "Facility operations",
    title: "Operations command centre",
    description: "Coordinate registration, schedules, queues, accessibility and patient communications.",
    navigation: ["Operations", "Appointments", "Patients", "Resources", "Communications"],
    metrics: [
      { label: "Appointments", value: "146", context: "Across nine facilities" },
      { label: "No-show risk", value: "11%", context: "Four points lower", tone: "positive" },
      { label: "Open incidents", value: "2", context: "Low severity", tone: "warning" },
    ],
    queueTitle: "Operational alerts",
    queue: [
      { id: "a-1", title: "Kuruman Clinic", detail: "Queue above threshold", status: "Attention", priority: "attention" },
      { id: "a-2", title: "De Aar Clinic", detail: "Backup link active", status: "Stable" },
      { id: "a-3", title: "Upington Hospital", detail: "Teams room available", status: "Ready" },
    ],
    actions: ["Register patient", "Manage schedule", "Send approved notification"],
  },
  executive: {
    id: "executive",
    label: "Provincial executive portal",
    shortLabel: "Executive",
    eyebrow: "Provincial overview",
    title: "Northern Cape health intelligence",
    description: "Review synthetic access, utilisation, service-pressure and benefits indicators.",
    navigation: ["Executive overview", "Districts", "Facilities", "Benefits", "Governance"],
    metrics: [
      { label: "Virtual consultations", value: "1,284", context: "Synthetic monthly total", tone: "positive" },
      { label: "Avoided transfers", value: "312", context: "Estimated only" },
      { label: "Platform availability", value: "99.93%", context: "Demonstration metric" },
    ],
    queueTitle: "District performance",
    queue: [
      { id: "e-1", title: "ZF Mgcawu", detail: "High adoption · 91%", status: "On track" },
      { id: "e-2", title: "Pixley ka Seme", detail: "Wait time improving", status: "Watch", priority: "attention" },
      { id: "e-3", title: "John Taolo Gaetsewe", detail: "Specialist demand elevated", status: "Action", priority: "urgent" },
    ],
    actions: ["Open facility map", "Review benefit assumptions", "Export synthetic report"],
  },
  "platform-admin": {
    id: "platform-admin",
    label: "Application administration portal",
    shortLabel: "Platform admin",
    eyebrow: "Platform administration",
    title: "Service health and access governance",
    description: "Review identity, integrations, audit events, deployment and operational readiness.",
    navigation: ["Service health", "Identity", "Integrations", "Audit", "Releases"],
    metrics: [
      { label: "Services healthy", value: "12 / 12", context: "Mocked status", tone: "positive" },
      { label: "Security score", value: "86%", context: "Synthetic control score" },
      { label: "Deployments", value: "3", context: "Last 24 hours" },
    ],
    queueTitle: "Platform events",
    queue: [
      { id: "pa-1", title: "Microsoft Entra ID", detail: "Conditional Access design ready", status: "Mocked" },
      { id: "pa-2", title: "Azure SQL Database", detail: "Adapter boundary configured", status: "Mocked" },
      { id: "pa-3", title: "FHIR gateway", detail: "R4 mapping boundary", status: "Mocked" },
    ],
    actions: ["Review deployments", "Open audit catalogue", "Run readiness check"],
  },
};

export const demoJourney: { role: RoleId; label: string; action: string }[] = [
  { role: "patient", label: "Patient booking", action: "Book appointment" },
  { role: "nurse", label: "Nurse triage", action: "Record vitals" },
  { role: "doctor", label: "Doctor consultation", action: "Start consultation" },
  { role: "specialist", label: "Specialist referral", action: "Open referral" },
  { role: "administration", label: "Facility follow-up", action: "Send approved notification" },
];

export function isRoleId(value: string): value is RoleId {
  return roleIds.includes(value as RoleId);
}

export function portalHref(role: RoleId): string {
  return `/portals/${role}/`;
}
