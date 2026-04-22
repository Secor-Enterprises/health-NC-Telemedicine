// ============================================================
// Domain types — shared across the app and your backend contract
// ============================================================

export type UserRole = "patient" | "doctor" | "admin" | "clerk";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  /** True when the account was created with a temporary password and must be changed before normal use. */
  mustChangePassword?: boolean;
  createdAt: string; // ISO
  /** Present on patient list/detail responses. */
  profile?: PatientProfile | null;
}

export interface PatientProfile {
  userId: string;
  dateOfBirth?: string | null;
  phone?: string | null;
  address?: string | null;
  bloodType?: string | null;
  allergies?: string | null;
  emergencyContact?: string | null;
}

export interface DoctorProfile {
  userId: string;
  specialty: string;
  licenseNumber: string;
  yearsExperience?: number;
  bio?: string;
  primaryFacilityId?: string | null;
  primaryFacility?: {
    id: string;
    name: string;
    type: FacilityType;
    parent?: { id: string; name: string; type: FacilityType } | null;
  } | null;
}

export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  scheduledAt: string; // ISO
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  facilityId?: string | null;
  facilityName?: string | null;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  facilityId?: string | null;
  facilityName?: string | null;
  createdAt: string;
}

export interface MedicalFile {
  id: string;
  patientId: string;
  uploaderId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  startsAt: string; // ISO
  endsAt: string;   // ISO
}

export interface AuthSession {
  user: User;
  token: string;
}

export type FacilityType = "hospital" | "clinic";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  parentId?: string | null;
  parent?: { id: string; name: string; type: FacilityType } | null;
  children?: { id: string; name: string; type: FacilityType }[];
  address?: string | null;
  phone?: string | null;
  notes?: string | null;
  createdAt?: string;
}

// ============================================================
// FHIR R4 interoperability — Integrations
// ============================================================

export interface ApiClient {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string;
  active: boolean;
  createdAt: string;
  lastUsedAt?: string | null;
  eventCount?: number;
  /** Plaintext key — only returned once from create. */
  apiKey?: string;
}

export interface ApiClientEvent {
  id: string;
  method: string;
  path: string;
  status: number;
  resource?: string | null;
  createdAt: string;
}

export interface PatientObservation {
  id: string;
  code: string;
  display: string;
  valueNumber?: number | null;
  valueString?: string | null;
  unit?: string | null;
  category?: string | null;
  status: string;
  effectiveAt: string;
  performerName?: string | null;
  sourceSystem?: string | null;
}

export interface PatientAuditChange {
  field: string;
  label: string;
  before: string | null;
  after: string | null;
}

export interface PatientAuditEntry {
  id: string;
  patientId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: "created" | "updated";
  changes: PatientAuditChange[];
  createdAt: string;
}

export interface PatientMedicationRequest {
  id: string;
  medicationName: string;
  medicationCode?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  status: string;
  authoredOn: string;
  prescriberName?: string | null;
  sourceSystem?: string | null;
}
