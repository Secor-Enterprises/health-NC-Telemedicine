import type { User, DoctorProfile } from "@prisma/client";
import type { FhirResource } from "../types";

type DoctorWithProfile = User & { doctorProfile: DoctorProfile | null };

export function practitionerToFhir(u: DoctorWithProfile): FhirResource {
  const [given, ...family] = u.fullName.split(" ");
  return {
    resourceType: "Practitioner",
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
    telecom: [{ system: "email", value: u.email }],
    qualification: u.doctorProfile
      ? [
          {
            code: { text: u.doctorProfile.specialty },
            identifier: [{ value: u.doctorProfile.licenseNumber }],
          },
        ]
      : undefined,
  };
}
