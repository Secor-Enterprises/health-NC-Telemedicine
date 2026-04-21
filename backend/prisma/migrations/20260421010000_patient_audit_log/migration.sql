-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "PatientAuditAction" AS ENUM ('created', 'updated');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PatientAuditLog" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "actorName" TEXT NOT NULL,
  "actorRole" "UserRole" NOT NULL,
  "action" "PatientAuditAction" NOT NULL,
  "changes" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PatientAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PatientAuditLog_patientId_createdAt_idx"
  ON "PatientAuditLog"("patientId", "createdAt");

ALTER TABLE "PatientAuditLog"
  ADD CONSTRAINT "PatientAuditLog_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PatientAuditLog"
  ADD CONSTRAINT "PatientAuditLog_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
