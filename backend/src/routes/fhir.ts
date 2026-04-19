import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireApiKey, requireScope } from "../middleware/apiKey";
import { capabilityStatement } from "../fhir/capability";
import { operationOutcome, type FhirBundle, type FhirResource } from "../fhir/types";
import { patientToFhir, patientFromFhir } from "../fhir/mappers/patient";
import { practitionerToFhir } from "../fhir/mappers/practitioner";
import { organizationToFhir } from "../fhir/mappers/organization";
import {
  appointmentToFhir,
  appointmentFromFhir,
  encounterToFhir,
} from "../fhir/mappers/appointment";
import {
  observationToFhir,
  observationFromFhir,
} from "../fhir/mappers/observation";
import {
  medicationRequestToFhir,
  medicationRequestFromFhir,
} from "../fhir/mappers/medicationRequest";
import { documentReferenceToFhir } from "../fhir/mappers/documentReference";
import bcrypt from "bcryptjs";

export const fhirRouter = Router();

// Always set the FHIR content-type
fhirRouter.use((_req, res, next) => {
  res.type("application/fhir+json");
  next();
});

// ---------- Public: capability statement ----------
fhirRouter.get("/metadata", (_req, res) => {
  res.json(capabilityStatement());
});

// ---------- Auth required for everything else ----------
fhirRouter.use(requireApiKey);

const bundle = (entries: FhirResource[]): FhirBundle => ({
  resourceType: "Bundle",
  type: "searchset",
  total: entries.length,
  entry: entries.map((r) => ({
    fullUrl: `${r.resourceType}/${r.id}`,
    resource: r,
  })),
});

const fail = (res: Response, status: number, msg: string, code = "processing") => {
  const o = operationOutcome(status, msg, code);
  res.status(o.status).json(o.body);
};

const wrap =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch((err: Error) => {
      const status = (err as unknown as { status?: number }).status ?? 500;
      const o = operationOutcome(status, err.message);
      res.status(o.status).json(o.body);
      next();
    });
  };

// ============================================================
// Patient
// ============================================================
fhirRouter.get(
  "/Patient/:id",
  requireScope("patient.read", "*.read"),
  wrap(async (req, res) => {
    const u = await prisma.user.findFirst({
      where: { id: req.params.id, role: "patient" },
      include: { patientProfile: true },
    });
    if (!u) return fail(res, 404, "Patient not found", "not-found");
    res.json(patientToFhir(u));
  }),
);

fhirRouter.get(
  "/Patient",
  requireScope("patient.read", "*.read"),
  wrap(async (req, res) => {
    const name = req.query.name as string | undefined;
    const email = req.query.email as string | undefined;
    const items = await prisma.user.findMany({
      where: {
        role: "patient",
        ...(name ? { fullName: { contains: name, mode: "insensitive" } } : {}),
        ...(email ? { email: email.toLowerCase() } : {}),
      },
      include: { patientProfile: true },
      take: 100,
    });
    res.json(bundle(items.map(patientToFhir)));
  }),
);

fhirRouter.post(
  "/Patient",
  requireScope("patient.write", "*.write"),
  wrap(async (req, res) => {
    const data = patientFromFhir(req.body);
    const exists = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (exists) return fail(res, 409, "Patient with this email exists", "duplicate");
    const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);
    const created = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        fullName: data.fullName,
        role: "patient",
        passwordHash,
        patientProfile: {
          create: {
            phone: data.phone,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
          },
        },
      },
      include: { patientProfile: true },
    });
    res.status(201).json(patientToFhir(created));
  }),
);

// ============================================================
// Practitioner
// ============================================================
fhirRouter.get(
  "/Practitioner/:id",
  requireScope("practitioner.read", "*.read"),
  wrap(async (req, res) => {
    const u = await prisma.user.findFirst({
      where: { id: req.params.id, role: "doctor" },
      include: { doctorProfile: true },
    });
    if (!u) return fail(res, 404, "Practitioner not found", "not-found");
    res.json(practitionerToFhir(u));
  }),
);

fhirRouter.get(
  "/Practitioner",
  requireScope("practitioner.read", "*.read"),
  wrap(async (_req, res) => {
    const items = await prisma.user.findMany({
      where: { role: "doctor" },
      include: { doctorProfile: true },
      take: 100,
    });
    res.json(bundle(items.map(practitionerToFhir)));
  }),
);

// ============================================================
// Organization (Facility)
// ============================================================
fhirRouter.get(
  "/Organization/:id",
  requireScope("organization.read", "*.read"),
  wrap(async (req, res) => {
    const f = await prisma.facility.findUnique({
      where: { id: req.params.id },
      include: { parent: true },
    });
    if (!f) return fail(res, 404, "Organization not found", "not-found");
    res.json(organizationToFhir(f));
  }),
);

fhirRouter.get(
  "/Organization",
  requireScope("organization.read", "*.read"),
  wrap(async (_req, res) => {
    const items = await prisma.facility.findMany({ include: { parent: true } });
    res.json(bundle(items.map((f) => organizationToFhir(f))));
  }),
);

// ============================================================
// Appointment + Encounter
// ============================================================
const apptInclude = {
  patient: true,
  doctor: { include: { doctorProfile: true } },
  facility: true,
} as const;

fhirRouter.get(
  "/Appointment/:id",
  requireScope("appointment.read", "*.read"),
  wrap(async (req, res) => {
    const a = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: apptInclude,
    });
    if (!a) return fail(res, 404, "Appointment not found", "not-found");
    res.json(appointmentToFhir(a));
  }),
);

fhirRouter.get(
  "/Appointment",
  requireScope("appointment.read", "*.read"),
  wrap(async (req, res) => {
    const patient = (req.query.patient as string | undefined)?.split("/").pop();
    const practitioner = (req.query.practitioner as string | undefined)?.split("/").pop();
    const items = await prisma.appointment.findMany({
      where: {
        ...(patient ? { patientId: patient } : {}),
        ...(practitioner ? { doctorId: practitioner } : {}),
      },
      include: apptInclude,
      take: 200,
    });
    res.json(bundle(items.map(appointmentToFhir)));
  }),
);

fhirRouter.post(
  "/Appointment",
  requireScope("appointment.write", "*.write"),
  wrap(async (req, res) => {
    const d = appointmentFromFhir(req.body);
    const created = await prisma.appointment.create({ data: d, include: apptInclude });
    res.status(201).json(appointmentToFhir(created));
  }),
);

fhirRouter.get(
  "/Encounter/:id",
  requireScope("encounter.read", "*.read"),
  wrap(async (req, res) => {
    const id = req.params.id.replace(/^enc-/, "");
    const a = await prisma.appointment.findUnique({
      where: { id },
      include: apptInclude,
    });
    if (!a) return fail(res, 404, "Encounter not found", "not-found");
    res.json(encounterToFhir(a));
  }),
);

fhirRouter.get(
  "/Encounter",
  requireScope("encounter.read", "*.read"),
  wrap(async (req, res) => {
    const patient = (req.query.patient as string | undefined)?.split("/").pop();
    const items = await prisma.appointment.findMany({
      where: patient ? { patientId: patient } : {},
      include: apptInclude,
      take: 200,
    });
    res.json(bundle(items.map(encounterToFhir)));
  }),
);

// ============================================================
// Observation
// ============================================================
fhirRouter.get(
  "/Observation/:id",
  requireScope("observation.read", "*.read"),
  wrap(async (req, res) => {
    const o = await prisma.observation.findUnique({
      where: { id: req.params.id },
      include: { performer: true },
    });
    if (!o) return fail(res, 404, "Observation not found", "not-found");
    res.json(observationToFhir(o));
  }),
);

fhirRouter.get(
  "/Observation",
  requireScope("observation.read", "*.read"),
  wrap(async (req, res) => {
    const patient = (req.query.patient as string | undefined)?.split("/").pop();
    const code = req.query.code as string | undefined;
    const category = req.query.category as string | undefined;
    const items = await prisma.observation.findMany({
      where: {
        ...(patient ? { patientId: patient } : {}),
        ...(code ? { code } : {}),
        ...(category ? { category } : {}),
      },
      include: { performer: true },
      orderBy: { effectiveAt: "desc" },
      take: 200,
    });
    res.json(bundle(items.map(observationToFhir)));
  }),
);

fhirRouter.post(
  "/Observation",
  requireScope("observation.write", "*.write"),
  wrap(async (req, res) => {
    const d = observationFromFhir(req.body);
    const created = await prisma.observation.create({
      data: { ...d, sourceSystem: d.sourceSystem ?? req.apiClient?.name },
      include: { performer: true },
    });
    res.status(201).json(observationToFhir(created));
  }),
);

// ============================================================
// DiagnosticReport (synthesized from observations)
// ============================================================
fhirRouter.get(
  "/DiagnosticReport",
  requireScope("diagnosticreport.read", "observation.read", "*.read"),
  wrap(async (req, res) => {
    const patient = (req.query.patient as string | undefined)?.split("/").pop();
    const items = await prisma.observation.findMany({
      where: { ...(patient ? { patientId: patient } : {}), category: "laboratory" },
      orderBy: { effectiveAt: "desc" },
      take: 200,
    });
    // Group by date
    const groups = new Map<string, typeof items>();
    for (const o of items) {
      const day = o.effectiveAt.toISOString().slice(0, 10);
      const k = `${o.patientId}_${day}`;
      const arr = groups.get(k) ?? [];
      arr.push(o);
      groups.set(k, arr);
    }
    const reports = [...groups.entries()].map(([k, obs]) => ({
      resourceType: "DiagnosticReport" as const,
      id: `dr-${k}`,
      status: "final",
      code: { text: "Lab panel" },
      subject: { reference: `Patient/${obs[0].patientId}` },
      effectiveDateTime: obs[0].effectiveAt.toISOString(),
      result: obs.map((o) => ({ reference: `Observation/${o.id}` })),
    }));
    res.json(bundle(reports));
  }),
);

// ============================================================
// MedicationRequest
// ============================================================
fhirRouter.get(
  "/MedicationRequest/:id",
  requireScope("medicationrequest.read", "*.read"),
  wrap(async (req, res) => {
    const m = await prisma.medicationRequest.findUnique({
      where: { id: req.params.id },
      include: { prescriber: true },
    });
    if (!m) return fail(res, 404, "MedicationRequest not found", "not-found");
    res.json(medicationRequestToFhir(m));
  }),
);

fhirRouter.get(
  "/MedicationRequest",
  requireScope("medicationrequest.read", "*.read"),
  wrap(async (req, res) => {
    const patient = (req.query.patient as string | undefined)?.split("/").pop();
    const status = req.query.status as string | undefined;
    const items = await prisma.medicationRequest.findMany({
      where: {
        ...(patient ? { patientId: patient } : {}),
        ...(status
          ? { status: status.replace("-", "_") as never }
          : {}),
      },
      include: { prescriber: true },
      orderBy: { authoredOn: "desc" },
      take: 200,
    });
    res.json(bundle(items.map(medicationRequestToFhir)));
  }),
);

fhirRouter.post(
  "/MedicationRequest",
  requireScope("medicationrequest.write", "*.write"),
  wrap(async (req, res) => {
    const d = medicationRequestFromFhir(req.body);
    const created = await prisma.medicationRequest.create({
      data: { ...d, sourceSystem: d.sourceSystem ?? req.apiClient?.name },
      include: { prescriber: true },
    });
    res.status(201).json(medicationRequestToFhir(created));
  }),
);

// ============================================================
// DocumentReference (medical files)
// ============================================================
fhirRouter.get(
  "/DocumentReference/:id",
  requireScope("documentreference.read", "*.read"),
  wrap(async (req, res) => {
    const f = await prisma.medicalFile.findUnique({ where: { id: req.params.id } });
    if (!f) return fail(res, 404, "DocumentReference not found", "not-found");
    res.json(documentReferenceToFhir(f, `${req.protocol}://${req.get("host")}`));
  }),
);

fhirRouter.get(
  "/DocumentReference",
  requireScope("documentreference.read", "*.read"),
  wrap(async (req, res) => {
    const patient = (req.query.patient as string | undefined)?.split("/").pop();
    const items = await prisma.medicalFile.findMany({
      where: patient ? { patientId: patient } : {},
      orderBy: { uploadedAt: "desc" },
      take: 100,
    });
    const base = `${req.protocol}://${req.get("host")}`;
    res.json(bundle(items.map((f) => documentReferenceToFhir(f, base))));
  }),
);
