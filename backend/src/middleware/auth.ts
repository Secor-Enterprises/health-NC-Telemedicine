import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./error";
import type { UserRole } from "@prisma/client";

export interface AuthPayload {
  sub: string;
  role: UserRole;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function signToken(payload: AuthPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(new HttpError(401, "Missing bearer token"));
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as AuthPayload;
    req.auth = decoded;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new HttpError(401, "Unauthenticated"));
    if (!roles.includes(req.auth.role)) return next(new HttpError(403, "Forbidden"));
    next();
  };
}
