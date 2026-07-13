import { notFound } from "next/navigation";
import { PortalExperience } from "@/components/portal-experience";
import { isRoleId, portals, roleIds } from "@/lib/healthconnect";

export function generateStaticParams() {
  return roleIds.map((role) => ({ role }));
}

export function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  return params.then(({ role }) => ({
    title: isRoleId(role) ? `${portals[role].label} | Secor HealthConnect` : "Portal not found",
    description: isRoleId(role) ? portals[role].description : "Unknown Secor HealthConnect portal",
  }));
}

export default async function RolePortalPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!isRoleId(role)) notFound();
  return <PortalExperience initialRole={role} />;
}
