import type { Observation, ObservationStatus, User } from "@prisma/client";
import type { FhirResource } from "../types";

type ObsFull = Observation & { performer?: User | null };

export function observationToFhir(o: ObsFull): FhirResource {
  return {
    resourceType: "Observation",
    id: o.id,
    status: o.status,
    category: o.category
      ? [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: o.category,
              },
            ],
          },
        ]
      : undefined,
    code: {
      coding: [{ system: "http://loinc.org", code: o.code, display: o.display }],
      text: o.display,
    },
    subject: { reference: `Patient/${o.patientId}` },
    effectiveDateTime: o.effectiveAt.toISOString(),
    performer: o.performerId
      ? [{ reference: `Practitioner/${o.performerId}`, display: o.performer?.fullName }]
      : undefined,
    valueQuantity:
      o.valueNumber !== null && o.valueNumber !== undefined
        ? {
            value: o.valueNumber,
            unit: o.unit ?? undefined,
            system: "http://unitsofmeasure.org",
            code: o.unit ?? undefined,
          }
        : undefined,
    valueString: o.valueString ?? undefined,
    note: o.note ? [{ text: o.note }] : undefined,
  };
}

export function observationFromFhir(r: FhirResource): {
  patientId: string;
  performerId?: string;
  status: ObservationStatus;
  code: string;
  display: string;
  valueNumber?: number;
  valueString?: string;
  unit?: string;
  category?: string;
  effectiveAt: Date;
  note?: string;
  sourceSystem?: string;
  sourceId?: string;
} {
  const patientId = r.subject?.reference?.split("/")[1];
  if (!patientId) throw new Error("Observation.subject Patient reference required");
  const coding = r.code?.coding?.[0];
  if (!coding?.code) throw new Error("Observation.code.coding[0].code required");

  const status = (r.status as ObservationStatus) ?? "final";
  const performerId = r.performer?.[0]?.reference?.split("/")[1];

  return {
    patientId,
    performerId,
    status,
    code: coding.code,
    display: coding.display ?? r.code?.text ?? coding.code,
    valueNumber: r.valueQuantity?.value,
    valueString: r.valueString,
    unit: r.valueQuantity?.unit ?? r.valueQuantity?.code,
    category: r.category?.[0]?.coding?.[0]?.code,
    effectiveAt: r.effectiveDateTime ? new Date(r.effectiveDateTime) : new Date(),
    note: r.note?.[0]?.text,
    sourceSystem: r.meta?.source,
    sourceId: r.identifier?.[0]?.value,
  };
}

// DiagnosticReport groups multiple observations.
export function diagnosticReportToFhir(opts: {
  id: string;
  patientId: string;
  effectiveAt: Date;
  code: { code: string; display: string };
  observationIds: string[];
}): FhirResource {
  return {
    resourceType: "DiagnosticReport",
    id: opts.id,
    status: "final",
    code: {
      coding: [{ system: "http://loinc.org", ...opts.code }],
      text: opts.code.display,
    },
    subject: { reference: `Patient/${opts.patientId}` },
    effectiveDateTime: opts.effectiveAt.toISOString(),
    result: opts.observationIds.map((id) => ({ reference: `Observation/${id}` })),
  };
}
