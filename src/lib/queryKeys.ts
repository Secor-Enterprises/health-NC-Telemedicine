/**
 * Centralized React Query keys.
 * Keep keys structured so partial invalidation works (e.g. invalidate all "appointments").
 */
export const queryKeys = {
  me: ["auth", "me"] as const,

  doctors: ["doctors"] as const,
  doctorsByFacility: (facilityId?: string) =>
    ["doctors", { facilityId: facilityId ?? null }] as const,
  patients: ["patients"] as const,

  appointments: (scope: { userId: string; role: string }) =>
    ["appointments", scope] as const,
  appointmentsAll: ["appointments"] as const,

  records: (patientId: string) => ["records", patientId] as const,
  files: (patientId: string) => ["files", patientId] as const,

  slots: (params: {
    doctorId: string;
    onlyOpen?: boolean;
    from?: string;
    to?: string;
  }) => ["slots", params] as const,
  slotsByDoctor: (doctorId: string) => ["slots", { doctorId }] as const,

  facilities: ["facilities"] as const,
  facility: (id: string) => ["facilities", id] as const,

  apiClients: ["apiClients"] as const,
  apiClientEvents: (id: string) => ["apiClients", id, "events"] as const,
  observations: (patientId: string) => ["observations", patientId] as const,
  medicationRequests: (patientId: string) => ["medicationRequests", patientId] as const,
};
