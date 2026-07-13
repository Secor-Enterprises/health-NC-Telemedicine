import assert from "node:assert/strict";
import test from "node:test";
import { createSyntheticConfirmation, getDefaultService, initialAppointmentDraft, validateAppointmentDraft } from "../src/lib/appointments";

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

test("service must be offered by the selected facility", () => {
  const errors = validateAppointmentDraft({ ...initialAppointmentDraft, facilityId: "upington", service: "Hypertension follow-up", consentAccepted: true });
  assert.ok(errors.includes("Select a service offered by the selected facility."));
});

test("facility changes have a valid default service", () => {
  assert.equal(getDefaultService("upington"), "General medicine");
  assert.equal(getDefaultService("missing"), "");
});
