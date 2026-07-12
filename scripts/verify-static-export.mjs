import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const routes = [
  "out/index.html",
  "out/404.html",
  "out/portals/patient/index.html",
  "out/portals/doctor/index.html",
  "out/portals/nurse/index.html",
  "out/portals/specialist/index.html",
  "out/portals/administration/index.html",
  "out/portals/executive/index.html",
  "out/portals/platform-admin/index.html",
];

const failures = [];
for (const route of routes) {
  try {
    await access(path.join(root, route));
  } catch {
    failures.push(`Missing static route: ${route}`);
  }
}

try {
  const home = await readFile(path.join(root, "out/index.html"), "utf8");
  if (!home.includes("Secor HealthConnect")) failures.push("Home export does not contain the product title");
  if (!home.includes("Synthetic")) failures.push("Home export does not disclose synthetic demonstration data");
} catch {
  // Missing file already captured above.
}

if (failures.length > 0) {
  console.error("Static export verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Static export verified: ${routes.length} required HTML routes.`);
