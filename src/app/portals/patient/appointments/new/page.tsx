import type { Metadata } from "next";
import { PatientAppointmentBooking } from "@/components/patient-appointment-booking";

export const metadata: Metadata = {
  title: "Book appointment | Secor HealthConnect",
  description: "Synthetic patient appointment booking workflow for the Secor HealthConnect demonstration."
};

export default function NewPatientAppointmentPage() {
  return <PatientAppointmentBooking />;
}
