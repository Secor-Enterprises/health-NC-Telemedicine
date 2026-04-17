import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { toUserDTO } from "../dto";

export const doctorsRouter = Router();

doctorsRouter.get("/", requireAuth, async (_req, res, next) => {
  try {
    const docs = await prisma.doctorProfile.findMany({ include: { user: true } });
    res.json(
      docs.map((d) => ({
        userId: d.userId,
        specialty: d.specialty,
        licenseNumber: d.licenseNumber,
        yearsExperience: d.yearsExperience ?? undefined,
        bio: d.bio ?? undefined,
        user: toUserDTO(d.user),
      })),
    );
  } catch (e) {
    next(e);
  }
});
