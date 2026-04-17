/**
 * ============================================================
 * REST API CLIENT — wire this to your onsite backend
 * ============================================================
 *
 * Replace the mock implementations below with real `fetch()` calls.
 * Suggested endpoint contract:
 *
 *   POST   /auth/login                    { email, password } -> AuthSession
 *   POST   /auth/register                 { email, password, fullName, role } -> AuthSession
 *   POST   /auth/logout
 *   GET    /auth/me                       -> User
 *
 *   GET    /doctors                       -> Doctor[]
 *   GET    /patients                      -> User[] (doctor/admin only)
 *
 *   GET    /appointments?role=...&userId  -> Appointment[]
 *   POST   /appointments                  { doctorId, scheduledAt, reason } -> Appointment
 *   PATCH  /appointments/:id              { status?, notes? } -> Appointment
 *
 *   GET    /records?patientId=            -> MedicalRecord[]
 *   POST   /records                       { patientId, title, ... } -> MedicalRecord
 *
 *   GET    /files?patientId=              -> MedicalFile[]
 *   POST   /files  (multipart)            -> MedicalFile
 *
 * Auth: send the token from localStorage as `Authorization: Bearer <token>`.
 * ============================================================
 */

import type {
  Appointment,
  AppointmentStatus,
  AuthSession,
  AvailabilitySlot,
  DoctorProfile,
  MedicalFile,
  MedicalRecord,
  User,
  UserRole,
} from "./types";

// ----- Configure your backend URL here -----
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

const STORAGE_KEY = "telemed.session";
const MOCK_DELAY = 350;

// ============================================================
// Mock in-memory store (REMOVE when wiring real backend)
// ============================================================

const mockUsers: (User & { password: string })[] = [
  {
    id: "u-doc-1",
    email: "doctor@demo.com",
    password: "demo1234",
    fullName: "Dr. Sarah Chen",
    role: "doctor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-pat-1",
    email: "patient@demo.com",
    password: "demo1234",
    fullName: "John Doe",
    role: "patient",
    createdAt: new Date().toISOString(),
  },
];

const mockDoctors: DoctorProfile[] = [
  {
    userId: "u-doc-1",
    specialty: "General Practice",
    licenseNumber: "MD-10293",
    yearsExperience: 12,
    bio: "Board-certified GP focused on preventive care and chronic disease management.",
  },
];

const mockAppointments: Appointment[] = [
  {
    id: "a-1",
    patientId: "u-pat-1",
    patientName: "John Doe",
    doctorId: "u-doc-1",
    doctorName: "Dr. Sarah Chen",
    specialty: "General Practice",
    scheduledAt: new Date(Date.now() + 86_400_000).toISOString(),
    durationMinutes: 30,
    reason: "Follow-up on blood pressure",
    status: "confirmed",
  },
];

const mockRecords: MedicalRecord[] = [
  {
    id: "r-1",
    patientId: "u-pat-1",
    authorId: "u-doc-1",
    authorName: "Dr. Sarah Chen",
    title: "Annual checkup",
    description: "Routine physical, bloodwork ordered.",
    diagnosis: "Healthy, mildly elevated BP",
    treatment: "Lifestyle counseling, recheck in 3 months",
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
];

const mockFiles: MedicalFile[] = [];

const delay = <T>(value: T): Promise<T> =>
  new Promise((res) => setTimeout(() => res(value), MOCK_DELAY));

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ============================================================
// Session helpers
// ============================================================

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function setStoredSession(session: AuthSession | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

// Real backend helper — uncomment and use when wiring fetch
// async function request<T>(path: string, init?: RequestInit): Promise<T> {
//   const session = getStoredSession();
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
//       ...(init?.headers ?? {}),
//     },
//   });
//   if (!res.ok) throw new Error((await res.text()) || res.statusText);
//   return res.json() as Promise<T>;
// }

// ============================================================
// Auth
// ============================================================

export const api = {
  // ---------- AUTH ----------
  async login(email: string, password: string): Promise<AuthSession> {
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) throw new Error("Invalid email or password");
    const { password: _pw, ...user } = found;
    const session: AuthSession = { user, token: `mock-token-${user.id}` };
    setStoredSession(session);
    return delay(session);
  },

  async register(input: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }): Promise<AuthSession> {
    if (mockUsers.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("An account with this email already exists");
    }
    const user: User = {
      id: uid("u"),
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push({ ...user, password: input.password });
    const session: AuthSession = { user, token: `mock-token-${user.id}` };
    setStoredSession(session);
    return delay(session);
  },

  async logout(): Promise<void> {
    setStoredSession(null);
    return delay(undefined);
  },

  async me(): Promise<User | null> {
    return delay(getStoredSession()?.user ?? null);
  },

  // ---------- DOCTORS ----------
  async listDoctors(): Promise<(DoctorProfile & { user: User })[]> {
    const out = mockDoctors.map((d) => ({
      ...d,
      user: mockUsers.find((u) => u.id === d.userId)!,
    }));
    return delay(out);
  },

  // ---------- APPOINTMENTS ----------
  async listAppointments(params: {
    userId: string;
    role: UserRole;
  }): Promise<Appointment[]> {
    const all =
      params.role === "admin"
        ? mockAppointments
        : params.role === "doctor"
          ? mockAppointments.filter((a) => a.doctorId === params.userId)
          : mockAppointments.filter((a) => a.patientId === params.userId);
    return delay([...all].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)));
  },

  async createAppointment(input: {
    patientId: string;
    patientName: string;
    doctorId: string;
    scheduledAt: string;
    reason: string;
  }): Promise<Appointment> {
    const doctorUser = mockUsers.find((u) => u.id === input.doctorId);
    const doctor = mockDoctors.find((d) => d.userId === input.doctorId);
    if (!doctorUser || !doctor) throw new Error("Doctor not found");
    const appt: Appointment = {
      id: uid("a"),
      patientId: input.patientId,
      patientName: input.patientName,
      doctorId: input.doctorId,
      doctorName: doctorUser.fullName,
      specialty: doctor.specialty,
      scheduledAt: input.scheduledAt,
      durationMinutes: 30,
      reason: input.reason,
      status: "requested",
    };
    mockAppointments.push(appt);
    return delay(appt);
  },

  async updateAppointment(
    id: string,
    patch: { status?: AppointmentStatus; notes?: string },
  ): Promise<Appointment> {
    const appt = mockAppointments.find((a) => a.id === id);
    if (!appt) throw new Error("Appointment not found");
    Object.assign(appt, patch);
    return delay(appt);
  },

  // ---------- MEDICAL RECORDS ----------
  async listRecords(patientId: string): Promise<MedicalRecord[]> {
    return delay(
      mockRecords
        .filter((r) => r.patientId === patientId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  },

  async createRecord(input: Omit<MedicalRecord, "id" | "createdAt">): Promise<MedicalRecord> {
    const rec: MedicalRecord = {
      ...input,
      id: uid("r"),
      createdAt: new Date().toISOString(),
    };
    mockRecords.push(rec);
    return delay(rec);
  },

  // ---------- MEDICAL FILES ----------
  async listFiles(patientId: string): Promise<MedicalFile[]> {
    return delay(mockFiles.filter((f) => f.patientId === patientId));
  },

  async uploadFile(input: {
    patientId: string;
    uploaderId: string;
    file: File;
  }): Promise<MedicalFile> {
    // In production, POST multipart/form-data to /files
    const url = URL.createObjectURL(input.file);
    const f: MedicalFile = {
      id: uid("f"),
      patientId: input.patientId,
      uploaderId: input.uploaderId,
      fileName: input.file.name,
      fileType: input.file.type,
      fileSize: input.file.size,
      url,
      uploadedAt: new Date().toISOString(),
    };
    mockFiles.push(f);
    return delay(f);
  },
};
