import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";
import { toUserDTO } from "../dto";

export const doctorsRouter = Router();

doctorsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const facilityId = req.query.facilityId as string | undefined;

    // Build the where clause: filter by primary facility OR by parent hospital
    // (so picking a hospital also returns doctors assigned to its clinics).
    let where = {};
    if (facilityId) {
      const target = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: { children: { select: { id: true } } },
      });
      if (!target) throw new HttpError(404, "Facility not found");
      const ids = [target.id, ...target.children.map((c) => c.id)];
      where = { primaryFacilityId: { in: ids } };
    }

    const docs = await prisma.doctorProfile.findMany({
      where,
      include: {
        user: true,
        primaryFacility: {
          include: { parent: { select: { id: true, name: true, type: true } } },
        },
      },
    });
    res.json(
      docs.map((d) => ({
        userId: d.userId,
        specialty: d.specialty,
        licenseNumber: d.licenseNumber,
        yearsExperience: d.yearsExperience ?? undefined,
        bio: d.bio ?? undefined,
        primaryFacilityId: d.primaryFacilityId ?? null,
        primaryFacility: d.primaryFacility
          ? {
              id: d.primaryFacility.id,
              name: d.primaryFacility.name,
              type: d.primaryFacility.type,
              parent: d.primaryFacility.parent ?? null,
            }
          : null,
        user: toUserDTO(d.user),
      })),
    );
  } catch (e) {
    next(e);
  }
});

const patchSchema = z.object({
  primaryFacilityId: z.string().nullable().optional(),
  specialty: z.string().min(1).optional(),
  bio: z.string().nullable().optional(),
  yearsExperience: z.number().int().nullable().optional(),
});

// Doctors can update their own profile; admins can update anyone.
doctorsRouter.patch("/:userId", requireAuth, async (req, res, next) => {
  try {
    const targetId = req.params.userId;
    if (req.auth!.role !== "admin" && req.auth!.sub !== targetId) {
      throw new HttpError(403, "Cannot edit another doctor's profile");
    }
    const body = patchSchema.parse(req.body);
    const updated = await prisma.doctorProfile.update({
      where: { userId: targetId },
      data: body,
      include: {
        user: true,
        primaryFacility: {
          include: { parent: { select: { id: true, name: true, type: true } } },
        },
      },
    });
    res.json({
      userId: updated.userId,
      specialty: updated.specialty,
      licenseNumber: updated.licenseNumber,
      yearsExperience: updated.yearsExperience ?? undefined,
      bio: updated.bio ?? undefined,
      primaryFacilityId: updated.primaryFacilityId ?? null,
      primaryFacility: updated.primaryFacility
        ? {
            id: updated.primaryFacility.id,
            name: updated.primaryFacility.name,
            type: updated.primaryFacility.type,
            parent: updated.primaryFacility.parent ?? null,
          }
        : null,
      user: toUserDTO(updated.user),
    });
  } catch (e) {
    next(e);
  }
});
