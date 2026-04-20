import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { generateApiKey } from "../middleware/apiKey";
import { HttpError } from "../middleware/error";
import type { ObservationStatus, MedicationRequestStatus } from "@prisma/client";

export const apiClientsRouter = Router();

apiClientsRouter.use(requireAuth, requireRole("admin"));

apiClientsRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.apiClient.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { events: true } } },
    });
    res.json(
      items.map((c) => ({
        id: c.id,
        name: c.name,
        keyPrefix: c.keyPrefix,
        scopes: c.scopes,
        active: c.active,
        createdAt: c.createdAt.toISOString(),
        lastUsedAt: c.lastUsedAt?.toISOString() ?? null,
        eventCount: c._count.events,
      })),
    );
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  name: z.string().min(1),
  scopes: z.string().min(1),
});

apiClientsRouter.post("/", async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const { key, prefix, hash } = generateApiKey();
    const created = await prisma.apiClient.create({
      data: {
        name: body.name,
        keyHash: hash,
        keyPrefix: prefix,
        scopes: body.scopes,
      },
    });
    // Return the plaintext key ONCE. The client must store it.
    res.status(201).json({
      id: created.id,
      name: created.name,
      keyPrefix: created.keyPrefix,
      scopes: created.scopes,
      active: created.active,
      createdAt: created.createdAt.toISOString(),
      apiKey: key,
    });
  } catch (e) {
    next(e);
  }
});

const patchSchema = z.object({
  active: z.boolean().optional(),
  scopes: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
});

apiClientsRouter.patch("/:id", async (req, res, next) => {
  try {
    const body = patchSchema.parse(req.body);
    const updated = await prisma.apiClient.update({
      where: { id: req.params.id },
      data: body,
    });
    res.json({
      id: updated.id,
      name: updated.name,
      keyPrefix: updated.keyPrefix,
      scopes: updated.scopes,
      active: updated.active,
      createdAt: updated.createdAt.toISOString(),
      lastUsedAt: updated.lastUsedAt?.toISOString() ?? null,
    });
  } catch (e) {
    next(e);
  }
});

apiClientsRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.apiClient.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

apiClientsRouter.get("/:id/events", async (req, res, next) => {
  try {
    const events = await prisma.apiClientEvent.findMany({
      where: { clientId: req.params.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(
      events.map((e) => ({
        id: e.id,
        method: e.method,
        path: e.path,
        status: e.status,
        resource: e.resource,
        createdAt: e.createdAt.toISOString(),
      })),
    );
  } catch (e) {
    next(e);
  }
});

// Patient-scoped read endpoints to surface FHIR data in the patient portal
export const fhirDataRouter = Router();
fhirDataRouter.use(requireAuth);

fhirDataRouter.get("/observations", async (req, res, next) => {
  try {
    const patientId = String(req.query.patientId || "");
    if (!patientId) throw new HttpError(400, "patientId required");
    const { sub, role } = req.auth!;
    if (role === "patient" && patientId !== sub) throw new HttpError(403, "Forbidden");
    const items = await prisma.observation.findMany({
      where: { patientId },
      include: { performer: true },
      orderBy: { effectiveAt: "desc" },
    });
    res.json(
      items.map((o) => ({
        id: o.id,
        code: o.code,
        display: o.display,
        valueNumber: o.valueNumber,
        valueString: o.valueString,
        unit: o.unit,
        category: o.category,
        status: o.status,
        effectiveAt: o.effectiveAt.toISOString(),
        performerName: o.performer?.fullName ?? null,
        sourceSystem: o.sourceSystem,
      })),
    );
  } catch (e) {
    next(e);
  }
});

fhirDataRouter.get("/medication-requests", async (req, res, next) => {
  try {
    const patientId = String(req.query.patientId || "");
    if (!patientId) throw new HttpError(400, "patientId required");
    const { sub, role } = req.auth!;
    if (role === "patient" && patientId !== sub) throw new HttpError(403, "Forbidden");
    const items = await prisma.medicationRequest.findMany({
      where: { patientId },
      include: { prescriber: true },
      orderBy: { authoredOn: "desc" },
    });
    res.json(
      items.map((m) => ({
        id: m.id,
        medicationName: m.medicationName,
        medicationCode: m.medicationCode,
        dosage: m.dosage,
        frequency: m.frequency,
        status: m.status,
        authoredOn: m.authoredOn.toISOString(),
        prescriberName: m.prescriber?.fullName ?? null,
        sourceSystem: m.sourceSystem,
      })),
    );
  } catch (e) {
    next(e);
  }
});

// ---------- Doctor/admin write endpoints ----------

const observationCreateSchema = z.object({
  patientId: z.string().min(1),
  code: z.string().min(1).max(64),
  display: z.string().min(1).max(200),
  valueNumber: z.number().finite().optional(),
  valueString: z.string().max(500).optional(),
  unit: z.string().max(32).optional(),
  category: z.enum(["laboratory", "vital-signs", "imaging", "social-history", "exam"]).optional(),
  status: z
    .enum(["registered", "preliminary", "final", "amended", "cancelled"])
    .optional(),
  effectiveAt: z.string().datetime().optional(),
  note: z.string().max(2000).optional(),
});

fhirDataRouter.post(
  "/observations",
  requireRole("doctor", "admin"),
  async (req, res, next) => {
    try {
      const body = observationCreateSchema.parse(req.body);
      // ensure patient exists and is a patient
      const patient = await prisma.user.findUnique({ where: { id: body.patientId } });
      if (!patient || patient.role !== "patient") throw new HttpError(404, "Patient not found");
      if (body.valueNumber === undefined && !body.valueString) {
        throw new HttpError(400, "Either valueNumber or valueString is required");
      }

      const created = await prisma.observation.create({
        data: {
          patientId: body.patientId,
          performerId: req.auth!.sub,
          status: (body.status ?? "final") as ObservationStatus,
          code: body.code,
          display: body.display,
          valueNumber: body.valueNumber ?? null,
          valueString: body.valueString ?? null,
          unit: body.unit ?? null,
          category: body.category ?? "laboratory",
          effectiveAt: body.effectiveAt ? new Date(body.effectiveAt) : new Date(),
          note: body.note ?? null,
        },
        include: { performer: true },
      });

      res.status(201).json({
        id: created.id,
        code: created.code,
        display: created.display,
        valueNumber: created.valueNumber,
        valueString: created.valueString,
        unit: created.unit,
        category: created.category,
        status: created.status,
        effectiveAt: created.effectiveAt.toISOString(),
        performerName: created.performer?.fullName ?? null,
        sourceSystem: created.sourceSystem,
      });
    } catch (e) {
      next(e);
    }
  },
);

const medRequestCreateSchema = z.object({
  patientId: z.string().min(1),
  medicationName: z.string().min(1).max(200),
  medicationCode: z.string().max(64).optional(),
  dosage: z.string().max(200).optional(),
  frequency: z.string().max(64).optional(),
  status: z
    .enum(["active", "on_hold", "cancelled", "completed", "stopped", "draft", "unknown"])
    .optional(),
  authoredOn: z.string().datetime().optional(),
  note: z.string().max(2000).optional(),
});

fhirDataRouter.post(
  "/medication-requests",
  requireRole("doctor", "admin"),
  async (req, res, next) => {
    try {
      const body = medRequestCreateSchema.parse(req.body);
      const patient = await prisma.user.findUnique({ where: { id: body.patientId } });
      if (!patient || patient.role !== "patient") throw new HttpError(404, "Patient not found");

      const created = await prisma.medicationRequest.create({
        data: {
          patientId: body.patientId,
          prescriberId: req.auth!.sub,
          status: (body.status ?? "active") as MedicationRequestStatus,
          medicationCode: body.medicationCode ?? null,
          medicationName: body.medicationName,
          dosage: body.dosage ?? null,
          frequency: body.frequency ?? null,
          authoredOn: body.authoredOn ? new Date(body.authoredOn) : new Date(),
          note: body.note ?? null,
        },
        include: { prescriber: true },
      });

      res.status(201).json({
        id: created.id,
        medicationName: created.medicationName,
        medicationCode: created.medicationCode,
        dosage: created.dosage,
        frequency: created.frequency,
        status: created.status,
        authoredOn: created.authoredOn.toISOString(),
        prescriberName: created.prescriber?.fullName ?? null,
        sourceSystem: created.sourceSystem,
      });
    } catch (e) {
      next(e);
    }
  },
);
