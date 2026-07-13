"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { appointmentSlots, createSyntheticConfirmation, facilities, getDefaultService, initialAppointmentDraft, validateAppointmentDraft, type AppointmentDraft } from "@/lib/appointments";
import { languages } from "@/lib/healthconnect";

export function PatientAppointmentBooking() {
  const [draft, setDraft] = useState<AppointmentDraft>(initialAppointmentDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<ReturnType<typeof createSyntheticConfirmation> | null>(null);
  const selectedFacility = useMemo(() => facilities.find((item) => item.id === draft.facilityId), [draft.facilityId]);

  function update<K extends keyof AppointmentDraft>(key: K, value: AppointmentDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors([]);
    setConfirmation(null);
  }

  function changeFacility(facilityId: string) {
    setDraft((current) => ({ ...current, facilityId, service: getDefaultService(facilityId) }));
    setErrors([]);
    setConfirmation(null);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAppointmentDraft(draft);
    setErrors(nextErrors);
    if (nextErrors.length === 0) setConfirmation(createSyntheticConfirmation(draft));
  }

  return (
    <main className="workflow-page">
      <a className="skip-link" href="#booking-form">Skip to booking form</a>
      <header className="workflow-header">
        <div><span className="eyebrow">Patient portal · Synthetic demonstration</span><h1>Book a telemedicine appointment</h1><p>No production booking or clinical transaction is performed.</p></div>
        <Link className="secondary-link" href="/portals/patient/">Return to patient portal</Link>
      </header>

      <section className="integration-summary" aria-label="Integration status">
        {['Azure SQL','Microsoft Entra','Teams','WhatsApp'].map((name) => <span className="integration-badge integration-mocked" key={name}><span aria-hidden="true">●</span> {name}: Mocked</span>)}
      </section>

      <div className="workflow-grid">
        <form id="booking-form" className="surface-panel booking-form" onSubmit={submit} noValidate>
          <div className="panel-heading"><div><span className="eyebrow">Step 1 of 3</span><h2>Appointment details</h2></div></div>
          {errors.length > 0 && <div className="form-errors" role="alert"><strong>Review the following:</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}

          <label className="field-stack"><span>Facility</span><select value={draft.facilityId} onChange={(event) => changeFacility(event.target.value)}>{facilities.map((facility) => <option value={facility.id} key={facility.id}>{facility.name} · {facility.district}</option>)}</select></label>
          <label className="field-stack"><span>Service</span><select value={draft.service} onChange={(event) => update("service", event.target.value)}>{(selectedFacility?.services ?? []).map((service) => <option key={service}>{service}</option>)}</select></label>

          <fieldset className="field-stack"><legend>Appointment time</legend><div className="slot-grid">{appointmentSlots.map((slot) => <label className={draft.slotId === slot.id ? "slot-card selected" : "slot-card"} key={slot.id}><input type="radio" name="slot" value={slot.id} checked={draft.slotId === slot.id} onChange={() => { update("slotId", slot.id); update("mode", slot.mode); }} /><strong>{slot.label}</strong><span>{slot.clinician}</span><small>{slot.mode.replace("-", " ")}</small></label>)}</div></fieldset>

          <label className="field-stack"><span>Preferred language</span><select value={draft.language} onChange={(event) => update("language", event.target.value)}>{languages.map((language) => <option key={language}>{language}</option>)}</select></label>
          <label className="check-row"><input type="checkbox" checked={draft.interpreterRequired} onChange={(event) => update("interpreterRequired", event.target.checked)} /><span>Request an interpreter or SASL accessibility support</span></label>
          <label className="field-stack"><span>Reason for appointment</span><textarea rows={4} value={draft.reason} onChange={(event) => update("reason", event.target.value)} /></label>
          <label className="check-row consent-row"><input type="checkbox" checked={draft.consentAccepted} onChange={(event) => update("consentAccepted", event.target.checked)} /><span>I understand this is a synthetic demonstration and accept the demonstration privacy notice.</span></label>
          <button className="primary-button" type="submit">Confirm synthetic appointment</button>
        </form>

        <aside className="workflow-side">
          <section className="surface-panel"><span className="eyebrow">Readiness</span><h2>Before the consultation</h2><ul className="readiness-list"><li>✓ Use a private, quiet location</li><li>✓ Test camera, audio and connectivity</li><li>✓ Keep medication and recent results available</li><li>✓ Interpreter support can be requested</li></ul></section>
          <section className="surface-panel clinical-disclosure"><strong>Clinical safety</strong><p>This workflow does not diagnose, prescribe or replace emergency care.</p></section>
          {confirmation && <section className="surface-panel confirmation-panel" role="status" aria-live="polite"><span className="eyebrow">Step 3 of 3</span><h2>Appointment confirmed</h2><dl className="confirmation-list"><div><dt>Reference</dt><dd>{confirmation.reference}</dd></div><div><dt>Facility</dt><dd>{confirmation.facility}</dd></div><div><dt>Service</dt><dd>{confirmation.service}</dd></div><div><dt>Time</dt><dd>{confirmation.slot.label}</dd></div><div><dt>Clinician</dt><dd>{confirmation.slot.clinician}</dd></div><div><dt>Language</dt><dd>{confirmation.language}</dd></div></dl><p className="muted-copy">Production persistence will use a server-side API and approved Teams or clinic-assisted invitation.</p></section>}
        </aside>
      </div>
    </main>
  );
}
