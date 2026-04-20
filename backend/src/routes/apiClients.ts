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
