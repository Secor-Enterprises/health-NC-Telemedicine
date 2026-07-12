import type { IntegrationState, RoleId, WorkItem } from "./healthconnect";

export type AdapterResult<T> = {
  state: IntegrationState;
  data: T;
  message: string;
};

export interface IdentityAdapter {
  getCurrentRole(): Promise<AdapterResult<RoleId>>;
}

export interface ClinicalDataAdapter {
  getQueue(role: RoleId): Promise<AdapterResult<WorkItem[]>>;
}

export interface CollaborationAdapter {
  createConsultation(caseId: string): Promise<AdapterResult<{ meetingId: string }>>;
}

export interface MessagingAdapter {
  sendTemplate(template: string, syntheticRecipientId: string): Promise<AdapterResult<{ messageId: string }>>;
}

export interface FhirAdapter {
  previewResource(resourceType: string, syntheticId: string): Promise<AdapterResult<Record<string, unknown>>>;
}

export const adapterBoundary = {
  identity: "Microsoft Entra ID",
  clinicalData: "Azure SQL Database through server-side APIs",
  collaboration: "Microsoft Graph and Teams",
  messaging: "WhatsApp Business Platform",
  interoperability: "HL7 FHIR R4",
} as const;

export const demoAdapters = {
  state: "Mocked" as const,
  disclosure:
    "The public demonstration uses deterministic synthetic data. Connected adapters require server-side authorization, managed secrets and approved Azure environments.",
};
