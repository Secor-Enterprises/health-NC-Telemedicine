import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const doctor = await prisma.user.upsert({
    where: { email: "doctor@demo.com" },
    update: {},
    create: {
      email: "doctor@demo.com",
      fullName: "Dr. Sarah Chen",
      role: UserRole.doctor,
      passwordHash,
      doctorProfile: {
        create: {
          specialty: "General Practice",
          licenseNumber: "MD-10293",
          yearsExperience: 12,
          bio: "Board-certified GP focused on preventive care.",
        },
      },
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: "patient@demo.com" },
    update: {},
    create: {
      email: "patient@demo.com",
      fullName: "John Doe",
      role: UserRole.patient,
      passwordHash,
      patientProfile: { create: {} },
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      scheduledAt: new Date(Date.now() + 86_400_000),
      reason: "Follow-up on blood pressure",
      status: "confirmed",
    },
  });

  console.log("✅ Seed complete: doctor@demo.com / patient@demo.com (demo1234)");
}

main().finally(() => prisma.$disconnect());
