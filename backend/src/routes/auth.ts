import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { HttpError } from "../middleware/error";
import { requireAuth, signToken } from "../middleware/auth";
import { toUserDTO } from "../dto";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = loginSchema.extend({
  fullName: z.string().min(1),
  role: z.enum(["patient", "doctor"]),
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password");
    }
    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    res.json({ user: toUserDTO(user), token });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (exists) throw new HttpError(409, "An account with this email already exists");
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        fullName: body.fullName,
        role: body.role,
        ...(body.role === "patient"
          ? { patientProfile: { create: {} } }
          : {}),
      },
    });
    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    res.status(201).json({ user: toUserDTO(user), token });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/logout", (_req, res) => {
  // Stateless JWT — client just discards the token.
  res.status(204).send();
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth!.sub } });
    if (!user) throw new HttpError(401, "User not found");
    res.json(toUserDTO(user));
  } catch (e) {
    next(e);
  }
});
