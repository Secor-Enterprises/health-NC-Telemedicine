import assert from "node:assert/strict";
import test from "node:test";
import { createSyntheticConfirmation, initialAppointmentDraft, validateAppointmentDraft } from "../src/lib/appointments";

test("appointment draft requires consent", () => {
  const errors = validateAppointmentDraft(initialAppointmentDraft);
  assert.ok(errors.includes("Accept the synthetic demonstration privacy notice."));
});

test("valid synthetic appointment creates a stable confirmation", () => {
  const confirmation = createSyntheticConfirmation({ ...initialAppointmentDraft, consentAccepted: true });
  assert.equal(confirmation.status, "confirmed");
  assert.equal(confirmation.facility, "Kuruman Clinic");
  assert.equal(confirmation.slot.label, "09:30");
  assert.match(confirmation.reference, /^HC-DEMO-/);
});

test("empty appointment fields return accessible validation messages", () => {
  const errors = validateAppointmentDraft({
    ...initialAppointmentDraft,
    facilityId: "",
    service: "",
    slotId: "",
    reason: "",
    consentAccepted: false
  });
  assert.equal(errors.length, 5);
});
