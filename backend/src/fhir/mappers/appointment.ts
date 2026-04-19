import type {
  Appointment,
  AppointmentStatus,
  Facility,
  User,
  DoctorProfile,
} from "@prisma/client";
import type { FhirResource } from "../types";

type ApptFull = Appointment & {
  patient: User;
  doctor: User & { doctorProfile: DoctorProfile | null };
  facility?: Facility | null;
};

const statusMap: Record<AppointmentStatus, string> = {
  requested: "proposed",
  confirmed: "booked",
  completed: "fulfilled",
  cancelled: "cancelled",
};

const reverseStatusMap: Record<string, AppointmentStatus> = {
  proposed: "requested",
  pending: "requested",
  booked: "confirmed",
  arrived: "confirmed",
  fulfilled: "completed",
  cancelled: "cancelled",
  noshow: "cancelled",
};

export function appointmentToFhir(a: ApptFull): FhirResource {
  const end = new Date(a.scheduledAt.getTime() + a.durationMinutes * 60_000);
  return {
    resourceType: "Appointment",
    id: a.id,
    status: statusMap[a.status],
    description: a.reason,
    start: a.scheduledAt.toISOString(),
    end: end.toISOString(),
    minutesDuration: a.durationMinutes,
    comment: a.notes ?? undefined,
    participant: [
      {
        actor: { reference: `Patient/${a.patientId}`, display: a.patient.fullName },
        status: "accepted",
      },
      {
        actor: { reference: `Practitioner/${a.doctorId}`, display: a.doctor.fullName },
        status: "accepted",
      },
      ...(a.facility
        ? [
            {
              actor: {
                reference: `Organization/${a.facility.id}`,
                display: a.facility.name,
              },
              status: "accepted",
            },
          ]
        : []),
    ],
  };
}

export function encounterToFhir(a: ApptFull): FhirResource {
  const end = new Date(a.scheduledAt.getTime() + a.durationMinutes * 60_000);
  return {
    resourceType: "Encounter",
    id: `enc-${a.id}`,
    status: a.status === "completed" ? "finished" : a.status === "cancelled" ? "cancelled" : "planned",
    class: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "AMB",
      display: "ambulatory",
    },
    subject: { reference: `Patient/${a.patientId}`, display: a.patient.fullName },
    participant: [
      {
        individual: {
          reference: `Practitioner/${a.doctorId}`,
          display: a.doctor.fullName,
        },
      },
    ],
    period: { start: a.scheduledAt.toISOString(), end: end.toISOString() },
    appointment: [{ reference: `Appointment/${a.id}` }],
    serviceProvider: a.facility
      ? { reference: `Organization/${a.facility.id}`, display: a.facility.name }
      : undefined,
    reasonCode: [{ text: a.reason }],
  };
}

export function appointmentFromFhir(r: FhirResource): {
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  facilityId?: string | null;
  notes?: string;
} {
  const start = r.start ? new Date(r.start) : null;
  if (!start) throw new Error("Appointment.start is required");
  const end = r.end ? new Date(r.end) : null;
  const minutes =
    r.minutesDuration ??
    (end ? Math.round((end.getTime() - start.getTime()) / 60_000) : 30);

  const refOf = (type: string) => {
    const p = r.participant?.find(
      (x: { actor?: { reference?: string } }) =>
        x.actor?.reference?.startsWith(`${type}/`),
    );
    return p?.actor?.reference?.split("/")[1];
  };

  const patientId = refOf("Patient");
  const doctorId = refOf("Practitioner");
  const facilityId = refOf("Organization") ?? null;
  if (!patientId || !doctorId) {
    throw new Error("Appointment requires Patient and Practitioner participants");
  }

  return {
    patientId,
    doctorId,
    scheduledAt: start,
    durationMinutes: minutes,
    reason: r.description ?? r.reasonCode?.[0]?.text ?? "Appointment",
    status: reverseStatusMap[r.status as string] ?? "requested",
    facilityId,
    notes: r.comment,
  };
}
