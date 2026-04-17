import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { toUserDTO } from "../dto";

export const patientsRouter = Router();

patientsRouter.get(
  "/",
  requireAuth,
  requireRole("doctor", "admin"),
  async (_req, res, next) => {
    try {
      const users = await prisma.user.findMany({ where: { role: "patient" } });
      res.json(users.map(toUserDTO));
    } catch (e) {
      next(e);
    }
  },
);
