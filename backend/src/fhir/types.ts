/**
 * Minimal FHIR R4 type aliases — we keep these loose to avoid a 100k LOC
 * dependency. For strict validation a hospital integration would use
 * `@types/fhir` or `fhir.r4` packages.
 */

export type FhirResourceType =
  | "Patient"
  | "Practitioner"
  | "Organization"
  | "Appointment"
  | "Encounter"
  | "Observation"
  | "DiagnosticReport"
  | "MedicationRequest"
  | "DocumentReference"
  | "CapabilityStatement"
  | "OperationOutcome"
  | "Bundle";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FhirResource = { resourceType: FhirResourceType } & Record<string, any>;

export interface FhirBundle {
  resourceType: "Bundle";
  type: "searchset" | "transaction" | "transaction-response" | "collection";
  total?: number;
  entry?: { fullUrl?: string; resource: FhirResource }[];
}

export interface OperationOutcomeIssue {
  severity: "fatal" | "error" | "warning" | "information";
  code: string;
  diagnostics?: string;
}

export function operationOutcome(
  status: number,
  diagnostics: string,
  code = "processing",
): { status: number; body: { resourceType: "OperationOutcome"; issue: OperationOutcomeIssue[] } } {
  return {
    status,
    body: {
      resourceType: "OperationOutcome",
      issue: [
        {
          severity: status >= 500 ? "fatal" : "error",
          code,
          diagnostics,
        },
      ],
    },
  };
}
