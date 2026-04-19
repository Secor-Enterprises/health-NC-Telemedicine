import type { MedicalFile } from "@prisma/client";
import type { FhirResource } from "../types";

export function documentReferenceToFhir(f: MedicalFile, baseUrl: string): FhirResource {
  return {
    resourceType: "DocumentReference",
    id: f.id,
    status: "current",
    docStatus: "final",
    subject: { reference: `Patient/${f.patientId}` },
    date: f.uploadedAt.toISOString(),
    description: f.fileName,
    content: [
      {
        attachment: {
          contentType: f.fileType,
          url: f.url.startsWith("http") ? f.url : `${baseUrl}${f.url}`,
          title: f.fileName,
          size: f.fileSize,
          creation: f.uploadedAt.toISOString(),
        },
      },
    ],
  };
}
