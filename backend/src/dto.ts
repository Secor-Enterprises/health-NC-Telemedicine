import type {
  Appointment,
  DoctorProfile,
  Facility,
  MedicalFile,
  MedicalRecord,
  User,
} from "@prisma/client";

export function toUserDTO(u: User) {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    mustChangePassword: u.mustChangePassword,
    createdAt: u.createdAt.toISOString(),
  };
}

type ApptWithRels = Appointment & {
  patient: User;
  doctor: User & { doctorProfile: DoctorProfile | null };
  facility?: Facility | null;
};

export function toAppointmentDTO(a: ApptWithRels) {
  return {
    id: a.id,
    patientId: a.patientId,
    patientName: a.patient.fullName,
    doctorId: a.doctorId,
    doctorName: a.doctor.fullName,
    specialty: a.doctor.doctorProfile?.specialty ?? "",
    scheduledAt: a.scheduledAt.toISOString(),
    durationMinutes: a.durationMinutes,
    reason: a.reason,
    status: a.status,
    notes: a.notes ?? undefined,
    facilityId: a.facilityId ?? null,
    facilityName: a.facility?.name ?? null,
  };
}

export function toRecordDTO(
  r: MedicalRecord & { author: User; facility?: Facility | null },
) {
  return {
    id: r.id,
    patientId: r.patientId,
    authorId: r.authorId,
    authorName: r.author.fullName,
    title: r.title,
    description: r.description,
    diagnosis: r.diagnosis ?? undefined,
    treatment: r.treatment ?? undefined,
    facilityId: r.facilityId ?? null,
    facilityName: r.facility?.name ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

export function toFileDTO(f: MedicalFile) {
  return {
    id: f.id,
    patientId: f.patientId,
    uploaderId: f.uploaderId,
    fileName: f.fileName,
    fileType: f.fileType,
    fileSize: f.fileSize,
    url: f.url,
    uploadedAt: f.uploadedAt.toISOString(),
  };
}
