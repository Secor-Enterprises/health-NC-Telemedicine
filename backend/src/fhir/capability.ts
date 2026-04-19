import type { FhirResource } from "./types";

export function capabilityStatement(): FhirResource {
  const resource = (type: string, interactions: string[]) => ({
    type,
    interaction: interactions.map((c) => ({ code: c })),
    searchParam:
      type === "Observation"
        ? [
            { name: "patient", type: "reference" },
            { name: "code", type: "token" },
            { name: "category", type: "token" },
          ]
        : type === "MedicationRequest"
          ? [{ name: "patient", type: "reference" }, { name: "status", type: "token" }]
          : type === "Appointment"
            ? [{ name: "patient", type: "reference" }, { name: "practitioner", type: "reference" }]
            : type === "Patient"
              ? [{ name: "name", type: "string" }, { name: "email", type: "string" }]
              : undefined,
  });

  return {
    resourceType: "CapabilityStatement",
    status: "active",
    date: new Date().toISOString(),
    kind: "instance",
    software: { name: "Caretide", version: "1.0.0" },
    fhirVersion: "4.0.1",
    format: ["application/fhir+json", "application/json"],
    rest: [
      {
        mode: "server",
        security: {
          description: "API key authentication via X-API-Key header.",
        },
        resource: [
          resource("Patient", ["read", "search-type", "create", "update"]),
          resource("Practitioner", ["read", "search-type"]),
          resource("Organization", ["read", "search-type"]),
          resource("Appointment", ["read", "search-type", "create", "update"]),
          resource("Encounter", ["read", "search-type"]),
          resource("Observation", ["read", "search-type", "create"]),
          resource("DiagnosticReport", ["read", "search-type"]),
          resource("MedicationRequest", ["read", "search-type", "create"]),
          resource("DocumentReference", ["read", "search-type"]),
        ],
      },
    ],
  };
}
