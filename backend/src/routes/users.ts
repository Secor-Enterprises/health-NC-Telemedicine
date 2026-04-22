import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";
import { toUserDTO } from "../dto";

/**
 * Admin-only user management — currently scoped to clerk accounts so admins
 * can create registration-clerk logins that operate the front-desk workflow.
 */
export const usersRouter = Router();

usersRouter.get(
  "/clerks",
  requireAuth,
  requireRole("admin"),
  async (_req, res, next) => {
    try {
      const clerks = await prisma.user.findMany({
        where: { role: "clerk" },
        orderBy: { createdAt: "desc" },
      });
      res.json(clerks.map(toUserDTO));
    } catch (e) {
      next(e);
    }
  },
);

const createClerkSchema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(200),
});

usersRouter.post(
  "/clerks",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const body = createClerkSchema.parse(req.body);
      const email = body.email.toLowerCase();
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) throw new HttpError(409, "An account with this email already exists");
      const passwordHash = await bcrypt.hash(body.password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          fullName: body.fullName,
          role: "clerk",
          passwordHash,
          mustChangePassword: true,
        },
      });
      res.status(201).json(toUserDTO(user));
    } catch (e) {
      next(e);
    }
  },
);

usersRouter.delete(
  "/clerks/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const target = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!target || target.role !== "clerk") throw new HttpError(404, "Clerk not found");
      await prisma.user.delete({ where: { id: target.id } });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
);
