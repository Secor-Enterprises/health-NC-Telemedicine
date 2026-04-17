import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation failed", issues: err.issues });
  }
  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message || "Internal server error";
  if (status >= 500) console.error(err);
  res.status(status).json({ message });
};

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
