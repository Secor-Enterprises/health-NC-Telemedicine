/**
 * ============================================================
 * REST API CLIENT — wired to the Express + Prisma backend
 * ============================================================
 *
 * Configure the backend URL via VITE_API_BASE_URL (e.g. http://localhost:8080/api).
 * Auth: JWT stored in localStorage and sent as `Authorization: Bearer <token>`.
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

// ============================================================
// HTTP helper
// ============================================================

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getStoredSession();
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
    ...((init.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? safeJSON(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) ||
      text ||
      res.statusText;
    throw new Error(message);
  }

  return data as T;
}

function safeJSON(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function qs(params: Record<string, string | undefined | boolean>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (entries.length === 0) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of entries) sp.set(k, String(v));
  return `?${sp.toString()}`;
}

// ============================================================
// API
// ============================================================

export const api = {
  // ---------- AUTH ----------
  async login(email: string, password: string): Promise<AuthSession> {
    const session = await request<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setStoredSession(session);
    return session;
  },

  async register(input: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }): Promise<AuthSession> {
    const session = await request<AuthSession>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setStoredSession(session);
    return session;
  },

  async logout(): Promise<void> {
    try {
      await request<void>("/auth/logout", { method: "POST" });
    } catch {
      // ignore — clear local session regardless
    }
    setStoredSession(null);
  },

  async me(): Promise<User | null> {
    const session = getStoredSession();
    if (!session) return null;
    try {
      return await request<User>("/auth/me");
    } catch {
      setStoredSession(null);
      return null;
    }
  },

  // ---------- DOCTORS ----------
  async listDoctors(): Promise<(DoctorProfile & { user: User })[]> {
    return request("/doctors");
  },

  // ---------- PATIENTS ----------
  async listPatients(): Promise<User[]> {
    return request("/patients");
  },

  // ---------- APPOINTMENTS ----------
  async listAppointments(_params: {
    userId: string;
    role: UserRole;
  }): Promise<Appointment[]> {
    // Backend infers scope from JWT (role + userId)
    return request("/appointments");
  },

  async createAppointment(input: {
    patientId: string;
    patientName: string;
    doctorId: string;
    scheduledAt: string;
    reason: string;
  }): Promise<Appointment> {
    return request("/appointments", {
      method: "POST",
      body: JSON.stringify({
        doctorId: input.doctorId,
        scheduledAt: input.scheduledAt,
        reason: input.reason,
      }),
    });
  },

  async updateAppointment(
    id: string,
    patch: { status?: AppointmentStatus; notes?: string },
  ): Promise<Appointment> {
    return request(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  // ---------- MEDICAL RECORDS ----------
  async listRecords(patientId: string): Promise<MedicalRecord[]> {
    return request(`/records${qs({ patientId })}`);
  },

  async createRecord(
    input: Omit<MedicalRecord, "id" | "createdAt">,
  ): Promise<MedicalRecord> {
    return request("/records", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  // ---------- MEDICAL FILES ----------
  async listFiles(patientId: string): Promise<MedicalFile[]> {
    return request(`/files${qs({ patientId })}`);
  },

  async uploadFile(input: {
    patientId: string;
    uploaderId: string;
    file: File;
  }): Promise<MedicalFile> {
    const fd = new FormData();
    fd.append("patientId", input.patientId);
    fd.append("file", input.file);
    return request("/files", { method: "POST", body: fd });
  },

  // ---------- AVAILABILITY SLOTS ----------
  async listSlots(params: {
    doctorId: string;
    onlyOpen?: boolean;
    from?: string;
    to?: string;
  }): Promise<AvailabilitySlot[]> {
    return request(
      `/slots${qs({
        doctorId: params.doctorId,
        onlyOpen: params.onlyOpen,
        from: params.from,
        to: params.to,
      })}`,
    );
  },

  async createSlot(input: {
    doctorId: string;
    startsAt: string;
    endsAt: string;
  }): Promise<AvailabilitySlot> {
    return request("/slots", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async deleteSlot(id: string): Promise<void> {
    return request(`/slots/${id}`, { method: "DELETE" });
  },
};
