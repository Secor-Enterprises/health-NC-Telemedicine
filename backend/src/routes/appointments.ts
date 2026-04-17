import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../middleware/error";
import { toAppointmentDTO } from "../dto";

export const appointmentsRouter = Router();

appointmentsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const { sub, role } = req.auth!;
    const where =
      role === "admin"
        ? {}
        : role === "doctor"
          ? { doctorId: sub }
          : { patientId: sub };
    const items = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: { include: { doctorProfile: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });
    res.json(items.map(toAppointmentDTO));
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  reason: z.string().min(1),
});

appointmentsRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    // Patients can only book for themselves
    if (req.auth!.role === "patient" && body.patientId !== req.auth!.sub) {
      throw new HttpError(403, "Patients can only book for themselves");
    }
    const created = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        doctorId: body.doctorId,
        scheduledAt: new Date(body.scheduledAt),
        reason: body.reason,
        status: "requested",
      },
      include: {
        patient: true,
        doctor: { include: { doctorProfile: true } },
      },
    });
    res.status(201).json(toAppointmentDTO(created));
  } catch (e) {
    next(e);
  }
});

const patchSchema = z.object({
  status: z.enum(["requested", "confirmed", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
});

appointmentsRouter.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const patch = patchSchema.parse(req.body);
    const existing = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, "Appointment not found");

    const { sub, role } = req.auth!;
    const isParticipant = existing.doctorId === sub || existing.patientId === sub;
    if (role !== "admin" && !isParticipant) throw new HttpError(403, "Forbidden");

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: patch,
      include: {
        patient: true,
        doctor: { include: { doctorProfile: true } },
      },
    });
    res.json(toAppointmentDTO(updated));
  } catch (e) {
    next(e);
  }
});
