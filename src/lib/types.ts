// ============================================================
// Domain types — shared across the app and your backend contract
// ============================================================

export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string; // ISO
}

export interface PatientProfile {
  userId: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  emergencyContact?: string;
}

export interface DoctorProfile {
  userId: string;
  specialty: string;
  licenseNumber: string;
  yearsExperience?: number;
  bio?: string;
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
