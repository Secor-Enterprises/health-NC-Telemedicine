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
  ApiClient,
  ApiClientEvent,
  Appointment,
  AppointmentStatus,
  AuthSession,
  AvailabilitySlot,
  DoctorProfile,
  Facility,
  FacilityType,
  MedicalFile,
  MedicalRecord,
  PatientMedicationRequest,
  PatientObservation,
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
  async listDoctors(params?: {
    facilityId?: string;
  }): Promise<(DoctorProfile & { user: User })[]> {
    return request(`/doctors${qs({ facilityId: params?.facilityId })}`);
  },

  async updateDoctor(
    userId: string,
    patch: {
      primaryFacilityId?: string | null;
      specialty?: string;
      bio?: string | null;
      yearsExperience?: number | null;
    },
  ): Promise<DoctorProfile & { user: User }> {
    return request(`/doctors/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  // ---------- PATIENTS ----------
  async listPatients(): Promise<User[]> {
    return request("/patients");
  },

  async getPatient(id: string): Promise<User> {
    return request(`/patients/${id}`);
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
    facilityId?: string | null;
  }): Promise<Appointment> {
    return request("/appointments", {
      method: "POST",
      body: JSON.stringify({
        patientId: input.patientId,
        doctorId: input.doctorId,
        scheduledAt: input.scheduledAt,
        reason: input.reason,
        facilityId: input.facilityId ?? null,
      }),
    });
  },

  async updateAppointment(
    id: string,
    patch: {
      status?: AppointmentStatus;
      notes?: string;
      facilityId?: string | null;
    },
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

  // ---------- FACILITIES ----------
  async listFacilities(params?: {
    type?: FacilityType;
    parentId?: string;
  }): Promise<Facility[]> {
    return request(`/facilities${qs({ ...(params ?? {}) })}`);
  },

  async getFacility(id: string): Promise<Facility> {
    return request(`/facilities/${id}`);
  },

  async createFacility(input: {
    name: string;
    type: FacilityType;
    parentId?: string | null;
    address?: string | null;
    phone?: string | null;
    notes?: string | null;
  }): Promise<Facility> {
    return request("/facilities", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async updateFacility(
    id: string,
    patch: Partial<{
      name: string;
      type: FacilityType;
      parentId: string | null;
      address: string | null;
      phone: string | null;
      notes: string | null;
    }>,
  ): Promise<Facility> {
    return request(`/facilities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  async deleteFacility(id: string): Promise<void> {
    return request(`/facilities/${id}`, { method: "DELETE" });
  },

  // ---------- API CLIENTS (FHIR integrations, admin-only) ----------
  async listApiClients(): Promise<ApiClient[]> {
    return request("/api-clients");
  },

  async createApiClient(input: {
    name: string;
    scopes: string;
  }): Promise<ApiClient> {
    return request("/api-clients", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async updateApiClient(
    id: string,
    patch: Partial<{ name: string; scopes: string; active: boolean }>,
  ): Promise<ApiClient> {
    return request(`/api-clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  async deleteApiClient(id: string): Promise<void> {
    return request(`/api-clients/${id}`, { method: "DELETE" });
  },

  async listApiClientEvents(id: string): Promise<ApiClientEvent[]> {
    return request(`/api-clients/${id}/events`);
  },

  // ---------- FHIR-derived patient data (labs, prescriptions) ----------
  async listObservations(patientId: string): Promise<PatientObservation[]> {
    return request(`/fhir-data/observations${qs({ patientId })}`);
  },

  async listMedicationRequests(patientId: string): Promise<PatientMedicationRequest[]> {
    return request(`/fhir-data/medication-requests${qs({ patientId })}`);
  },

  async createObservation(input: {
    patientId: string;
    code: string;
    display: string;
    valueNumber?: number;
    valueString?: string;
    unit?: string;
    category?: "laboratory" | "vital-signs" | "imaging" | "social-history" | "exam";
    status?: "registered" | "preliminary" | "final" | "amended" | "cancelled";
    effectiveAt?: string;
    note?: string;
  }): Promise<PatientObservation> {
    return request("/fhir-data/observations", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async createMedicationRequest(input: {
    patientId: string;
    medicationName: string;
    medicationCode?: string;
    dosage?: string;
    frequency?: string;
    status?: "active" | "on_hold" | "cancelled" | "completed" | "stopped" | "draft" | "unknown";
    authoredOn?: string;
    note?: string;
  }): Promise<PatientMedicationRequest> {
    return request("/fhir-data/medication-requests", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
