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

  // Facilities — 3 hospitals, each with feeder clinics
  const hospitals: { name: string; clinics: string[] }[] = [
    {
      name: "Postmasburg Hospital",
      clinics: ["Postdene Clinic", "Boichoko Clinic", "Postmasburg Town Clinic"],
    },
    {
      name: "Kuruman Hospital",
      clinics: ["Kuruman Clinic 1", "Kuruman Clinic 2", "Kuruman Clinic 3"],
    },
    {
      name: "Olifantshoek Hospital",
      clinics: ["Olifantshoek Clinic 1", "Olifantshoek Clinic 2"],
    },
  ];

  for (const h of hospitals) {
    const existing = await prisma.facility.findFirst({
      where: { name: h.name, type: "hospital" },
    });
    const hospital =
      existing ??
      (await prisma.facility.create({
        data: { name: h.name, type: "hospital" },
      }));

    for (const clinicName of h.clinics) {
      const clinicExists = await prisma.facility.findFirst({
        where: { name: clinicName, parentId: hospital.id },
      });
      if (!clinicExists) {
        await prisma.facility.create({
          data: { name: clinicName, type: "clinic", parentId: hospital.id },
        });
      }
    }
  }

  console.log("✅ Seed complete: doctor@demo.com / patient@demo.com (demo1234)");
  console.log("✅ Facilities seeded: 3 hospitals + 8 clinics");
}

main().finally(() => prisma.$disconnect());
