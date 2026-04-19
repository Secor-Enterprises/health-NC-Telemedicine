import type { MedicationRequest, MedicationRequestStatus, User } from "@prisma/client";
import type { FhirResource } from "../types";

type MedReqFull = MedicationRequest & { prescriber?: User | null };

export function medicationRequestToFhir(m: MedReqFull): FhirResource {
  return {
    resourceType: "MedicationRequest",
    id: m.id,
    status: m.status.replace("_", "-"),
    intent: "order",
    medicationCodeableConcept: {
      coding: m.medicationCode
        ? [
            {
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              code: m.medicationCode,
              display: m.medicationName,
            },
          ]
        : undefined,
      text: m.medicationName,
    },
    subject: { reference: `Patient/${m.patientId}` },
    authoredOn: m.authoredOn.toISOString(),
    requester: m.prescriberId
      ? { reference: `Practitioner/${m.prescriberId}`, display: m.prescriber?.fullName }
      : undefined,
    dosageInstruction: m.dosage
      ? [
          {
            text: m.dosage,
            timing: m.frequency ? { code: { text: m.frequency } } : undefined,
          },
        ]
      : undefined,
    note: m.note ? [{ text: m.note }] : undefined,
  };
}

export function medicationRequestFromFhir(r: FhirResource): {
  patientId: string;
  prescriberId?: string;
  status: MedicationRequestStatus;
  medicationCode?: string;
  medicationName: string;
  dosage?: string;
  frequency?: string;
  authoredOn: Date;
  note?: string;
  sourceSystem?: string;
  sourceId?: string;
} {
  const patientId = r.subject?.reference?.split("/")[1];
  if (!patientId) throw new Error("MedicationRequest.subject Patient reference required");
  const med = r.medicationCodeableConcept;
  const coding = med?.coding?.[0];
  const medicationName = med?.text ?? coding?.display ?? "Unknown";
  const status = ((r.status as string) || "active").replace("-", "_") as MedicationRequestStatus;

  return {
    patientId,
    prescriberId: r.requester?.reference?.split("/")[1],
    status,
    medicationCode: coding?.code,
    medicationName,
    dosage: r.dosageInstruction?.[0]?.text,
    frequency: r.dosageInstruction?.[0]?.timing?.code?.text,
    authoredOn: r.authoredOn ? new Date(r.authoredOn) : new Date(),
    note: r.note?.[0]?.text,
    sourceSystem: r.meta?.source,
    sourceId: r.identifier?.[0]?.value,
  };
}
