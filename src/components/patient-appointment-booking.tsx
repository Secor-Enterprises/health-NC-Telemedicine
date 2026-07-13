"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import styles from "./patient-appointment-booking.module.css";
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
    <main className={styles.page}>
      <a className="skip-link" href="#booking-form">Skip to booking form</a>
      <header className={styles.header}>
        <div><span className="eyebrow">Patient portal · Synthetic demonstration</span><h1>Book a telemedicine appointment</h1><p>No production booking or clinical transaction is performed.</p></div>
        <Link className={styles.back} href="/portals/patient/">Return to patient portal</Link>
      </header>
      <section className={`${styles.integrations} integration-summary`} aria-label="Integration status">
        {["Azure SQL","Microsoft Entra","Teams","WhatsApp"].map((name) => <span className="integration-badge integration-mocked" key={name}><span aria-hidden="true">●</span> {name}: Mocked</span>)}
      </section>
      <div className={styles.grid}>
        <form id="booking-form" className={styles.form} onSubmit={submit} noValidate>
          <div><span className="eyebrow">Step 1 of 3</span><h2>Appointment details</h2></div>
          {errors.length > 0 && <div className={styles.errors} role="alert"><strong>Review the following:</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
          <label className={styles.field}><span>Facility</span><select value={draft.facilityId} onChange={(event) => changeFacility(event.target.value)}>{facilities.map((facility) => <option value={facility.id} key={facility.id}>{facility.name} · {facility.district}</option>)}</select></label>
          <label className={styles.field}><span>Service</span><select value={draft.service} onChange={(event) => update("service", event.target.value)}>{(selectedFacility?.services ?? []).map((service) => <option key={service}>{service}</option>)}</select></label>
          <fieldset className={styles.field}><legend>Appointment time</legend><div className={styles.slots}>{appointmentSlots.map((slot) => <label className={`${styles.slot} ${draft.slotId === slot.id ? styles.selected : ""}`} key={slot.id}><input type="radio" name="slot" value={slot.id} checked={draft.slotId === slot.id} onChange={() => setDraft((current) => ({ ...current, slotId: slot.id, mode: slot.mode }))} /><strong>{slot.label}</strong><span>{slot.clinician}</span><small>{slot.mode.replace("-", " ")}</small></label>)}</div></fieldset>
          <label className={styles.field}><span>Preferred language</span><select value={draft.language} onChange={(event) => update("language", event.target.value)}>{languages.map((language) => <option key={language}>{language}</option>)}</select></label>
          <label className={styles.check}><input type="checkbox" checked={draft.interpreterRequired} onChange={(event) => update("interpreterRequired", event.target.checked)} /><span>Request an interpreter or SASL accessibility support</span></label>
          <label className={styles.field}><span>Reason for appointment</span><textarea rows={4} value={draft.reason} onChange={(event) => update("reason", event.target.value)} /></label>
          <label className={styles.check}><input type="checkbox" checked={draft.consentAccepted} onChange={(event) => update("consentAccepted", event.target.checked)} /><span>I understand this is a synthetic demonstration and accept the demonstration privacy notice.</span></label>
          <button className={styles.primary} type="submit">Confirm synthetic appointment</button>
        </form>
        <aside className={styles.side}>
          <section><span className="eyebrow">Readiness</span><h2>Before the consultation</h2><ul className={styles.list}><li>Use a private, quiet location</li><li>Test camera, audio and connectivity</li><li>Keep medication and recent results available</li><li>Interpreter support can be requested</li></ul></section>
          <section className={styles.safety}><strong>Clinical safety</strong><p>This workflow does not diagnose, prescribe or replace emergency care.</p></section>
          {confirmation && <section className={styles.confirmation} role="status" aria-live="polite"><span className="eyebrow">Step 3 of 3</span><h2>Appointment confirmed</h2><dl>{Object.entries({Reference:confirmation.reference,Facility:confirmation.facility,Service:confirmation.service,Time:confirmation.slot.label,Clinician:confirmation.slot.clinician,Language:confirmation.language}).map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className={styles.muted}>Production persistence will use a server-side API and an approved Teams or clinic-assisted invitation.</p></section>}
        </aside>
      </div>
    </main>
  );
}
