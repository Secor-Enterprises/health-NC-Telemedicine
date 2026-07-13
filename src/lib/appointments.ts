export type AppointmentMode = "video" | "clinic-assisted" | "telephone";
export type AppointmentStatus = "draft" | "confirmed" | "cancelled";

export type FacilityOption = { id: string; name: string; district: string; services: string[] };
export type AppointmentSlot = { id: string; label: string; start: string; clinician: string; mode: AppointmentMode };
export type AppointmentDraft = {
  facilityId: string;
  service: string;
  slotId: string;
  mode: AppointmentMode;
  language: string;
  interpreterRequired: boolean;
  consentAccepted: boolean;
  reason: string;
};

export const facilities: FacilityOption[] = [
  { id: "upington", name: "Upington Hospital", district: "ZF Mgcawu", services: ["General medicine", "Chronic care", "Mental health"] },
  { id: "kuruman", name: "Kuruman Clinic", district: "John Taolo Gaetsewe", services: ["General medicine", "Hypertension follow-up", "Diabetes review"] },
  { id: "de-aar", name: "De Aar Clinic", district: "Pixley ka Seme", services: ["General medicine", "Respiratory review", "Medication follow-up"] }
];

export const appointmentSlots: AppointmentSlot[] = [
  { id: "slot-0930", label: "09:30", start: "2026-07-15T09:30:00+02:00", clinician: "Dr Mokoena", mode: "video" },
  { id: "slot-1100", label: "11:00", start: "2026-07-15T11:00:00+02:00", clinician: "Dr Daniels", mode: "clinic-assisted" },
  { id: "slot-1430", label: "14:30", start: "2026-07-15T14:30:00+02:00", clinician: "Dr Jacobs", mode: "telephone" }
];

export const initialAppointmentDraft: AppointmentDraft = {
  facilityId: "kuruman",
  service: "Hypertension follow-up",
  slotId: "slot-0930",
  mode: "video",
  language: "English",
  interpreterRequired: false,
  consentAccepted: false,
  reason: "Routine follow-up and blood-pressure review"
};

export function getFacility(facilityId: string): FacilityOption | undefined {
  return facilities.find((item) => item.id === facilityId);
}

export function getDefaultService(facilityId: string): string {
  return getFacility(facilityId)?.services[0] ?? "";
}

export function validateAppointmentDraft(draft: AppointmentDraft): string[] {
  const errors: string[] = [];
  const facility = getFacility(draft.facilityId);
  if (!facility) errors.push("Select a valid facility.");
  if (!draft.service.trim()) {
    errors.push("Select or enter a service.");
  } else if (facility && !facility.services.includes(draft.service)) {
    errors.push("Select a service offered by the selected facility.");
  }
  if (!draft.slotId || !appointmentSlots.some((slot) => slot.id === draft.slotId)) errors.push("Select a valid appointment time.");
  if (!draft.reason.trim()) errors.push("Provide a short reason for the appointment.");
  if (!draft.consentAccepted) errors.push("Accept the synthetic demonstration privacy notice.");
  return errors;
}

export function createSyntheticConfirmation(draft: AppointmentDraft) {
  const errors = validateAppointmentDraft(draft);
  if (errors.length > 0) throw new Error("Invalid synthetic appointment selection.");
  const facility = getFacility(draft.facilityId)!;
  const slot = appointmentSlots.find((item) => item.id === draft.slotId)!;
  return {
    reference: `HC-DEMO-${slot.id.toUpperCase()}`,
    facility: facility.name,
    district: facility.district,
    service: draft.service,
    slot,
    language: draft.language,
    interpreterRequired: draft.interpreterRequired,
    status: "confirmed" as AppointmentStatus
  };
}
