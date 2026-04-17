import { Router } from "express";
import { authRouter } from "./auth";
import { doctorsRouter } from "./doctors";
import { patientsRouter } from "./patients";
import { appointmentsRouter } from "./appointments";
import { recordsRouter } from "./records";
import { filesRouter } from "./files";
import { slotsRouter } from "./slots";

export const router = Router();
router.use("/auth", authRouter);
router.use("/doctors", doctorsRouter);
router.use("/patients", patientsRouter);
router.use("/appointments", appointmentsRouter);
router.use("/records", recordsRouter);
router.use("/files", filesRouter);
router.use("/slots", slotsRouter);
