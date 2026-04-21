import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";
import { toUserDTO } from "../dto";

export const patientsRouter = Router();

// ---------- Shared helpers ----------
type ProfileFields = {
  fullName?: string | null;
  dateOfBirth?: string | null;
  phone?: string | null;
  address?: string | null;
  bloodType?: string | null;
  allergies?: string | null;
  emergencyContact?: string | null;
};

const FIELD_LABELS: Record<keyof ProfileFields, string> = {
  fullName: "Full name",
  dateOfBirth: "Date of birth",
  phone: "Phone",
  address: "Address",
  bloodType: "Blood type",
  allergies: "Allergies",
  emergencyContact: "Emergency contact",
};

function serializePatient(u: {
  patientProfile: {
    userId: string;
    dateOfBirth: Date | null;
    phone: string | null;
    address: string | null;
    bloodType: string | null;
    allergies: string | null;
    emergencyContact: string | null;
  } | null;
} & Parameters<typeof toUserDTO>[0]) {
  return {
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
  };
}

function diffSnapshots(before: ProfileFields, after: ProfileFields) {
  const changes: { field: string; label: string; before: string | null; after: string | null }[] = [];
  (Object.keys(FIELD_LABELS) as (keyof ProfileFields)[]).forEach((key) => {
    const b = before[key] ?? null;
    const a = after[key] ?? null;
    if (b !== a) {
      changes.push({
        field: key,
        label: FIELD_LABELS[key],
        before: b,
        after: a,
      });
    }
  });
  return changes;
}

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
      res.json(users.map(serializePatient));
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
      res.json(serializePatient(u));
    } catch (e) {
      next(e);
    }
  },
);

// ---------- Audit log read endpoint ----------
patientsRouter.get(
  "/:id/audit",
  requireAuth,
  requireRole("doctor", "admin", "clerk"),
  async (req, res, next) => {
    try {
      const target = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!target || target.role !== "patient") throw new HttpError(404, "Patient not found");
      const logs = await prisma.patientAuditLog.findMany({
        where: { patientId: target.id },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      res.json(
        logs.map((l) => ({
          id: l.id,
          patientId: l.patientId,
          actorId: l.actorId,
          actorName: l.actorName,
          actorRole: l.actorRole,
          action: l.action,
          changes: safeParseChanges(l.changes),
          createdAt: l.createdAt.toISOString(),
        })),
      );
    } catch (e) {
      next(e);
    }
  },
);

function safeParseChanges(raw: string) {
  try {
    return JSON.parse(raw) as { field: string; label: string; before: string | null; after: string | null }[];
  } catch {
    return [];
  }
}

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

      // Audit: record the creation with the initial snapshot as "after".
      const initial: ProfileFields = {
        fullName: created.fullName,
        dateOfBirth: created.patientProfile?.dateOfBirth?.toISOString() ?? null,
        phone: created.patientProfile?.phone ?? null,
        address: created.patientProfile?.address ?? null,
        bloodType: created.patientProfile?.bloodType ?? null,
        allergies: created.patientProfile?.allergies ?? null,
        emergencyContact: created.patientProfile?.emergencyContact ?? null,
      };
      const initialChanges = diffSnapshots({}, initial);
      const actor = await prisma.user.findUnique({ where: { id: req.auth!.sub } });
      await prisma.patientAuditLog.create({
        data: {
          patientId: created.id,
          actorId: req.auth!.sub,
          actorName: actor?.fullName ?? req.auth!.email,
          actorRole: req.auth!.role,
          action: "created",
          changes: JSON.stringify(initialChanges),
        },
      });

      res.status(201).json({
        ...serializePatient(created),
        canLogin: !!body.password,
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

      const beforeSnapshot: ProfileFields = {
        fullName: target.fullName,
        dateOfBirth: target.patientProfile?.dateOfBirth?.toISOString() ?? null,
        phone: target.patientProfile?.phone ?? null,
        address: target.patientProfile?.address ?? null,
        bloodType: target.patientProfile?.bloodType ?? null,
        allergies: target.patientProfile?.allergies ?? null,
        emergencyContact: target.patientProfile?.emergencyContact ?? null,
      };

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

      const afterSnapshot: ProfileFields = {
        fullName: updated.fullName,
        dateOfBirth: updated.patientProfile?.dateOfBirth?.toISOString() ?? null,
        phone: updated.patientProfile?.phone ?? null,
        address: updated.patientProfile?.address ?? null,
        bloodType: updated.patientProfile?.bloodType ?? null,
        allergies: updated.patientProfile?.allergies ?? null,
        emergencyContact: updated.patientProfile?.emergencyContact ?? null,
      };

      const changes = diffSnapshots(beforeSnapshot, afterSnapshot);
      if (changes.length > 0) {
        const actor = await prisma.user.findUnique({ where: { id: req.auth!.sub } });
        await prisma.patientAuditLog.create({
          data: {
            patientId: updated.id,
            actorId: req.auth!.sub,
            actorName: actor?.fullName ?? req.auth!.email,
            actorRole: req.auth!.role,
            action: "updated",
            changes: JSON.stringify(changes),
          },
        });
      }

      res.json(serializePatient(updated));
    } catch (e) {
      next(e);
    }
  },
);
