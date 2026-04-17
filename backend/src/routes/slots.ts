import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";

export const slotsRouter = Router();

// GET /slots?doctorId=&from=&to=&onlyOpen=true
slotsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const doctorId = String(req.query.doctorId || "");
    if (!doctorId) throw new HttpError(400, "doctorId is required");
    const from = req.query.from ? new Date(String(req.query.from)) : new Date();
    const to = req.query.to
      ? new Date(String(req.query.to))
      : new Date(Date.now() + 30 * 86_400_000);
    const onlyOpen = String(req.query.onlyOpen || "false") === "true";

    const slots = await prisma.availabilitySlot.findMany({
      where: { doctorId, startsAt: { gte: from, lte: to } },
      orderBy: { startsAt: "asc" },
    });

    if (!onlyOpen) {
      return res.json(slots.map(toSlotDTO));
    }

    // Filter out slots that overlap an active appointment
    const appts = await prisma.appointment.findMany({
      where: {
        doctorId,
        status: { in: ["requested", "confirmed"] },
        scheduledAt: { gte: from, lte: to },
      },
    });

    const open = slots.filter((s) => {
      return !appts.some((a) => {
        const aStart = a.scheduledAt.getTime();
        const aEnd = aStart + a.durationMinutes * 60_000;
        return aStart < s.endsAt.getTime() && aEnd > s.startsAt.getTime();
      });
    });

    res.json(open.map(toSlotDTO));
  } catch (e) {
    next(e);
  }
});

const createSchema = z
  .object({
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
  })
  .refine((d) => new Date(d.endsAt) > new Date(d.startsAt), {
    message: "endsAt must be after startsAt",
  });

// POST /slots — doctor creates own slot
slotsRouter.post("/", requireAuth, requireRole("doctor", "admin"), async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const doctorId = req.auth!.sub;
    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);

    // Reject overlapping slots for the same doctor
    const overlap = await prisma.availabilitySlot.findFirst({
      where: {
        doctorId,
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
    });
    if (overlap) throw new HttpError(409, "Overlaps an existing slot");

    const created = await prisma.availabilitySlot.create({
      data: { doctorId, startsAt, endsAt },
    });
    res.status(201).json(toSlotDTO(created));
  } catch (e) {
    next(e);
  }
});

slotsRouter.delete("/:id", requireAuth, requireRole("doctor", "admin"), async (req, res, next) => {
  try {
    const slot = await prisma.availabilitySlot.findUnique({ where: { id: req.params.id } });
    if (!slot) throw new HttpError(404, "Slot not found");
    if (req.auth!.role !== "admin" && slot.doctorId !== req.auth!.sub) {
      throw new HttpError(403, "Forbidden");
    }
    await prisma.availabilitySlot.delete({ where: { id: slot.id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

function toSlotDTO(s: { id: string; doctorId: string; startsAt: Date; endsAt: Date }) {
  return {
    id: s.id,
    doctorId: s.doctorId,
    startsAt: s.startsAt.toISOString(),
    endsAt: s.endsAt.toISOString(),
  };
}
