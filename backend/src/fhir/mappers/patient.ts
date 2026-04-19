import type { User, PatientProfile } from "@prisma/client";
import type { FhirResource } from "../types";

type PatientWithProfile = User & { patientProfile: PatientProfile | null };

export function patientToFhir(u: PatientWithProfile): FhirResource {
  const [given, ...family] = u.fullName.split(" ");
  return {
    resourceType: "Patient",
    id: u.id,
    active: true,
    name: [
      {
        use: "official",
        text: u.fullName,
        given: given ? [given] : [],
        family: family.join(" ") || undefined,
      },
    ],
    telecom: [
      { system: "email", value: u.email, use: "home" },
      ...(u.patientProfile?.phone
        ? [{ system: "phone", value: u.patientProfile.phone }]
        : []),
    ],
    birthDate: u.patientProfile?.dateOfBirth
      ? u.patientProfile.dateOfBirth.toISOString().slice(0, 10)
      : undefined,
    address: u.patientProfile?.address
      ? [{ text: u.patientProfile.address }]
      : undefined,
    extension: u.patientProfile?.bloodType
      ? [
          {
            url: "http://hl7.org/fhir/StructureDefinition/patient-bloodGroup",
            valueString: u.patientProfile.bloodType,
          },
        ]
      : undefined,
  };
}

export function patientFromFhir(r: FhirResource): {
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
} {
  const name = r.name?.[0];
  const fullName =
    name?.text ||
    [name?.given?.join(" "), name?.family].filter(Boolean).join(" ").trim() ||
    "Unknown Patient";
  const email = r.telecom?.find((t: { system: string }) => t.system === "email")?.value;
  const phone = r.telecom?.find((t: { system: string }) => t.system === "phone")?.value;
  const address = r.address?.[0]?.text;
  const dateOfBirth = r.birthDate ? new Date(r.birthDate) : undefined;
  if (!email) throw new Error("Patient.telecom email is required");
  return { email, fullName, phone, address, dateOfBirth };
}
