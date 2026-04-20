import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";
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

patientsRouter.get(
  "/:id",
  requireAuth,
  requireRole("doctor", "admin"),
  async (req, res, next) => {
    try {
      const u = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!u || u.role !== "patient") throw new HttpError(404, "Patient not found");
      res.json(toUserDTO(u));
    } catch (e) {
      next(e);
    }
  },
);
