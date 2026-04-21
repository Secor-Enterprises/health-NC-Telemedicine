import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateApiKey } from "../src/middleware/apiKey";

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

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      fullName: "Caretide Admin",
      role: UserRole.admin,
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "clerk@demo.com" },
    update: {},
    create: {
      email: "clerk@demo.com",
      fullName: "Front-Desk Clerk",
      role: UserRole.clerk,
      passwordHash,
    },
  });

  const existingAppt = await prisma.appointment.findFirst({
    where: { patientId: patient.id, doctorId: doctor.id },
  });
  if (!existingAppt) {
    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        scheduledAt: new Date(Date.now() + 86_400_000),
        reason: "Follow-up on blood pressure",
        status: "confirmed",
      },
    });
  }

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

  const postmasburg = await prisma.facility.findFirst({
    where: { name: "Postmasburg Hospital", type: "hospital" },
  });
  if (postmasburg) {
    await prisma.doctorProfile.update({
      where: { userId: doctor.id },
      data: { primaryFacilityId: postmasburg.id },
    });
  }

  // ---------- Demo FHIR API client ----------
  const existingClient = await prisma.apiClient.findFirst({
    where: { name: "Demo Lab System" },
  });
  if (!existingClient) {
    const { key, prefix, hash } = generateApiKey();
    await prisma.apiClient.create({
      data: {
        name: "Demo Lab System",
        keyHash: hash,
        keyPrefix: prefix,
        scopes: "patient.read observation.* medicationrequest.* organization.read practitioner.read",
      },
    });
    console.log(`🔑 Demo FHIR API key (save it now): ${key}`);
  }

  // ---------- Demo observations & medications ----------
  const obsCount = await prisma.observation.count({ where: { patientId: patient.id } });
  if (obsCount === 0) {
    await prisma.observation.createMany({
      data: [
        {
          patientId: patient.id,
          performerId: doctor.id,
          status: "final",
          code: "718-7",
          display: "Hemoglobin",
          valueNumber: 14.2,
          unit: "g/dL",
          category: "laboratory",
          effectiveAt: new Date(Date.now() - 7 * 86_400_000),
          sourceSystem: "Demo Lab System",
        },
        {
          patientId: patient.id,
          performerId: doctor.id,
          status: "final",
          code: "8480-6",
          display: "Systolic blood pressure",
          valueNumber: 128,
          unit: "mmHg",
          category: "vital-signs",
          effectiveAt: new Date(Date.now() - 1 * 86_400_000),
        },
        {
          patientId: patient.id,
          performerId: doctor.id,
          status: "final",
          code: "8462-4",
          display: "Diastolic blood pressure",
          valueNumber: 82,
          unit: "mmHg",
          category: "vital-signs",
          effectiveAt: new Date(Date.now() - 1 * 86_400_000),
        },
      ],
    });
  }

  const medCount = await prisma.medicationRequest.count({ where: { patientId: patient.id } });
  if (medCount === 0) {
    await prisma.medicationRequest.create({
      data: {
        patientId: patient.id,
        prescriberId: doctor.id,
        status: "active",
        medicationCode: "197361",
        medicationName: "Lisinopril 10 MG Oral Tablet",
        dosage: "1 tablet by mouth daily",
        frequency: "QD",
        sourceSystem: "Demo Pharmacy",
      },
    });
  }

  console.log("✅ Seed complete: doctor@demo.com / patient@demo.com / admin@demo.com / clerk@demo.com (demo1234)");
}

main().finally(() => prisma.$disconnect());
