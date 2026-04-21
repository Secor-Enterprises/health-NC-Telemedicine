import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";
import { toUserDTO } from "../dto";

export const patientsRouter = Router();

// Anyone in care-team roles can browse the patient roster.
patientsRouter.get(
  "/",
  requireAuth,
  requireRole("doctor", "admin", "clerk"),
  async (_req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        where: { role: "patient" },
        include: { patientProfile: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(
        users.map((u) => ({
          ...toUserDTO(u),
          profile: u.patientProfile
            ? {
                userId: u.patientProfile.userId,
                dateOfBirth: u.patientProfile.dateOfBirth?.toISOString() ?? null,
                phone: u.patientProfile.phone ?? null,
                address: u.patientProfile.address ?? null,
                bloodType: u.patientProfile.bloodType ?? null,
                allergies: u.patientProfile.allergies ?? null,
                emergencyContact: u.patientProfile.emergencyContact ?? null,
              }
            : null,
        })),
      );
    } catch (e) {
      next(e);
    }
  },
);

patientsRouter.get(
  "/:id",
  requireAuth,
  requireRole("doctor", "admin", "clerk"),
  async (req, res, next) => {
    try {
      const u = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { patientProfile: true },
      });
      if (!u || u.role !== "patient") throw new HttpError(404, "Patient not found");
      res.json({
        ...toUserDTO(u),
        profile: u.patientProfile
          ? {
              userId: u.patientProfile.userId,
              dateOfBirth: u.patientProfile.dateOfBirth?.toISOString() ?? null,
              phone: u.patientProfile.phone ?? null,
              address: u.patientProfile.address ?? null,
              bloodType: u.patientProfile.bloodType ?? null,
              allergies: u.patientProfile.allergies ?? null,
              emergencyContact: u.patientProfile.emergencyContact ?? null,
            }
          : null,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Clerk/admin: register a patient ----------
const profileSchema = z.object({
  dateOfBirth: z.string().datetime().nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  bloodType: z.string().max(10).nullable().optional(),
  allergies: z.string().max(1000).nullable().optional(),
  emergencyContact: z.string().max(200).nullable().optional(),
});

const createPatientSchema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().min(1).max(120),
  // Optional — when provided, patient gets a login account.
  password: z.string().min(8).max(200).optional(),
  profile: profileSchema.optional(),
});

patientsRouter.post(
  "/",
  requireAuth,
  requireRole("admin", "clerk"),
  async (req, res, next) => {
    try {
      const body = createPatientSchema.parse(req.body);
      const email = body.email.toLowerCase();
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) throw new HttpError(409, "An account with this email already exists");

      // If no password provided, generate a random placeholder so the column
      // is satisfied; the patient cannot log in until a password is set.
      const plaintext = body.password ?? `lock_${crypto.randomUUID()}`;
      const passwordHash = await bcrypt.hash(plaintext, 10);

      const created = await prisma.user.create({
        data: {
          email,
          fullName: body.fullName,
          role: "patient",
          passwordHash,
          patientProfile: {
            create: {
              dateOfBirth: body.profile?.dateOfBirth ? new Date(body.profile.dateOfBirth) : null,
              phone: body.profile?.phone ?? null,
              address: body.profile?.address ?? null,
              bloodType: body.profile?.bloodType ?? null,
              allergies: body.profile?.allergies ?? null,
              emergencyContact: body.profile?.emergencyContact ?? null,
            },
          },
        },
        include: { patientProfile: true },
      });

      res.status(201).json({
        ...toUserDTO(created),
        canLogin: !!body.password,
        profile: created.patientProfile
          ? {
              userId: created.patientProfile.userId,
              dateOfBirth: created.patientProfile.dateOfBirth?.toISOString() ?? null,
              phone: created.patientProfile.phone ?? null,
              address: created.patientProfile.address ?? null,
              bloodType: created.patientProfile.bloodType ?? null,
              allergies: created.patientProfile.allergies ?? null,
              emergencyContact: created.patientProfile.emergencyContact ?? null,
            }
          : null,
      });
    } catch (e) {
      next(e);
    }
  },
);

const updatePatientSchema = z.object({
  fullName: z.string().trim().min(1).max(120).optional(),
  profile: profileSchema.optional(),
});

patientsRouter.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "clerk", "doctor"),
  async (req, res, next) => {
    try {
      const body = updatePatientSchema.parse(req.body);
      const target = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { patientProfile: true },
      });
      if (!target || target.role !== "patient") throw new HttpError(404, "Patient not found");

      const updated = await prisma.user.update({
        where: { id: target.id },
        data: {
          ...(body.fullName ? { fullName: body.fullName } : {}),
          ...(body.profile
            ? {
                patientProfile: {
                  upsert: {
                    create: {
                      dateOfBirth: body.profile.dateOfBirth ? new Date(body.profile.dateOfBirth) : null,
                      phone: body.profile.phone ?? null,
                      address: body.profile.address ?? null,
                      bloodType: body.profile.bloodType ?? null,
                      allergies: body.profile.allergies ?? null,
                      emergencyContact: body.profile.emergencyContact ?? null,
                    },
                    update: {
                      ...(body.profile.dateOfBirth !== undefined
                        ? { dateOfBirth: body.profile.dateOfBirth ? new Date(body.profile.dateOfBirth) : null }
                        : {}),
                      ...(body.profile.phone !== undefined ? { phone: body.profile.phone } : {}),
                      ...(body.profile.address !== undefined ? { address: body.profile.address } : {}),
                      ...(body.profile.bloodType !== undefined ? { bloodType: body.profile.bloodType } : {}),
                      ...(body.profile.allergies !== undefined ? { allergies: body.profile.allergies } : {}),
                      ...(body.profile.emergencyContact !== undefined
                        ? { emergencyContact: body.profile.emergencyContact }
                        : {}),
                    },
                  },
                },
              }
            : {}),
        },
        include: { patientProfile: true },
      });

      res.json({
        ...toUserDTO(updated),
        profile: updated.patientProfile
          ? {
              userId: updated.patientProfile.userId,
              dateOfBirth: updated.patientProfile.dateOfBirth?.toISOString() ?? null,
              phone: updated.patientProfile.phone ?? null,
              address: updated.patientProfile.address ?? null,
              bloodType: updated.patientProfile.bloodType ?? null,
              allergies: updated.patientProfile.allergies ?? null,
              emergencyContact: updated.patientProfile.emergencyContact ?? null,
            }
          : null,
      });
    } catch (e) {
      next(e);
    }
  },
);
