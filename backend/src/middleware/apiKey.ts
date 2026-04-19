import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { prisma } from "../prisma";
import { HttpError } from "./error";

/**
 * SMART-style scopes (simplified):
 *   <resource>.<action>   where action is "read" | "write" | "*"
 *   resource can be "*" (any), "patient", "practitioner", "organization",
 *   "appointment", "encounter", "observation", "diagnosticreport",
 *   "medicationrequest", "documentreference"
 *
 * Example scope string: "patient.read observation.* organization.read"
 */

export interface ApiClientContext {
  id: string;
  name: string;
  scopes: string[];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      apiClient?: ApiClientContext;
    }
  }
}

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  // 32 bytes -> 43 char base64url
  const raw = crypto.randomBytes(32).toString("base64url");
  const key = `ct_${raw}`;
  return { key, prefix: key.slice(0, 8), hash: hashApiKey(key) };
}

export async function requireApiKey(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header =
      (req.headers["x-api-key"] as string | undefined) ||
      (req.headers["X-API-Key"] as unknown as string | undefined);
    if (!header) throw new HttpError(401, "Missing X-API-Key header");

    const client = await prisma.apiClient.findUnique({
      where: { keyHash: hashApiKey(header) },
    });
    if (!client || !client.active) throw new HttpError(401, "Invalid API key");

    req.apiClient = {
      id: client.id,
      name: client.name,
      scopes: client.scopes.split(/\s+/).filter(Boolean),
    };

    // Fire-and-forget: update lastUsedAt + log event
    void prisma.apiClient.update({
      where: { id: client.id },
      data: { lastUsedAt: new Date() },
    });
    void prisma.apiClientEvent.create({
      data: {
        clientId: client.id,
        method: req.method,
        path: req.originalUrl.split("?")[0],
        status: 0, // updated below — best effort
        resource: req.params.resource ?? null,
      },
    });

    next();
  } catch (e) {
    next(e);
  }
}

export function requireScope(...required: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const ctx = req.apiClient;
    if (!ctx) return next(new HttpError(401, "API client missing"));
    const has = (need: string) => {
      const [res, act] = need.split(".");
      return ctx.scopes.some((s) => {
        if (s === "*" || s === "*.*") return true;
        const [sr, sa] = s.split(".");
        return (sr === "*" || sr === res) && (sa === "*" || sa === act);
      });
    };
    if (!required.some(has)) {
      return next(
        new HttpError(403, `Missing scope. Required one of: ${required.join(", ")}`),
      );
    }
    next();
  };
}
