import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";

export const facilitiesRouter = Router();

// GET /facilities — list all (optionally filter by type or parent)
facilitiesRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const type = req.query.type as "hospital" | "clinic" | undefined;
    const parentId = req.query.parentId as string | undefined;
    const items = await prisma.facility.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(parentId ? { parentId } : {}),
      },
      include: {
        parent: { select: { id: true, name: true, type: true } },
        children: { select: { id: true, name: true, type: true } },
      },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

facilitiesRouter.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const item = await prisma.facility.findUnique({
      where: { id: req.params.id },
      include: {
        parent: true,
        children: { orderBy: { name: "asc" } },
      },
    });
    if (!item) throw new HttpError(404, "Facility not found");
    res.json(item);
  } catch (e) {
    next(e);
  }
});

const upsertSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["hospital", "clinic"]),
  parentId: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

facilitiesRouter.post(
  "/",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const body = upsertSchema.parse(req.body);
      if (body.type === "clinic" && !body.parentId) {
        throw new HttpError(400, "Clinics require a parent hospital");
      }
      const created = await prisma.facility.create({ data: body });
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  },
);

facilitiesRouter.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const body = upsertSchema.partial().parse(req.body);
      const updated = await prisma.facility.update({
        where: { id: req.params.id },
        data: body,
      });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  },
);

facilitiesRouter.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      await prisma.facility.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
);
