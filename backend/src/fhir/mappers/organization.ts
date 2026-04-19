import type { Facility } from "@prisma/client";
import type { FhirResource } from "../types";

export function organizationToFhir(
  f: Facility & { parent?: { id: string; name: string } | null },
): FhirResource {
  return {
    resourceType: "Organization",
    id: f.id,
    active: true,
    name: f.name,
    type: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/organization-type",
            code: f.type === "hospital" ? "prov" : "dept",
            display: f.type === "hospital" ? "Healthcare Provider" : "Hospital Department",
          },
        ],
        text: f.type,
      },
    ],
    telecom: f.phone ? [{ system: "phone", value: f.phone }] : undefined,
    address: f.address ? [{ text: f.address }] : undefined,
    partOf: f.parent ? { reference: `Organization/${f.parent.id}`, display: f.parent.name } : undefined,
  };
}
