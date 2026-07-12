import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const requiredFiles = [
  ".gitattributes",
  "design/source/figma/Secor-HealthConnect-Milestone-1-UX-Foundation.fig",
  "design/source/figma/README.md",
  "tools/figma-healthconnect/manifest.json",
  "tools/figma-healthconnect/code.js",
  "tools/figma-healthconnect/README.md"
];

const failures = [];

async function text(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

for (const file of requiredFiles) {
  try {
    const info = await stat(path.join(root, file));
    if (!info.isFile() || info.size === 0) failures.push(`${file} is missing or empty`);
  } catch {
    failures.push(`${file} is missing`);
  }
}

const manifest = JSON.parse(await text("tools/figma-healthconnect/manifest.json"));
if (manifest.name !== "Secor HealthConnect Canvas Bootstrap") failures.push("Unexpected plugin name");
if (manifest.main !== "code.js") failures.push("Plugin manifest must execute code.js");
if (!Array.isArray(manifest.editorType) || !manifest.editorType.includes("figma")) failures.push("Plugin must target Figma design files");
if (manifest.documentAccess !== "dynamic-page") failures.push("Plugin must use dynamic-page access");

const attributes = await text(".gitattributes");
if (!attributes.includes("*.fig filter=lfs diff=lfs merge=lfs -text")) failures.push(".fig files are not governed by Git LFS");

const plugin = await text("tools/figma-healthconnect/code.js");
const requiredCollections = [
  "HealthConnect/Primitives",
  "HealthConnect/Semantic Color",
  "HealthConnect/Spacing & Radius",
  "HealthConnect/Motion & Layout"
];
for (const name of requiredCollections) {
  if (!plugin.includes(name)) failures.push(`Missing collection definition: ${name}`);
}

const requiredPages = [
  "02 Additional MVP Flows",
  "03 Foundations & Tokens",
  "04 Components & Variants",
  "05 Critical States",
  "06 Accessibility & Localisation",
  "07 Developer Handoff"
];
for (const name of requiredPages) {
  if (!plugin.includes(name)) failures.push(`Missing page definition: ${name}`);
}

const requiredComponents = [
  "StatusBadge",
  "Button",
  "TextField",
  "SelectField",
  "IntegrationStatus",
  "NavigationItem",
  "Panel",
  "MetricCard",
  "QueueRow",
  "SystemState",
  "ConsentNotice",
  "ClinicalAlert",
  "VitalsCard",
  "ReferralCard",
  "DataTable",
  "ModalDialog",
  "ToastNotification",
  "AppShell"
];
for (const name of requiredComponents) {
  if (!plugin.includes(`name: "${name}"`)) failures.push(`Missing component family: ${name}`);
}

const requiredJourneys = [
  "Secure Sign-in",
  "MFA Verification",
  "Language & Accessibility",
  "POPIA Consent",
  "Appointment Booking",
  "Virtual Waiting Room",
  "Nurse Triage & Vitals",
  "Doctor Consultation",
  "Specialist Referral & MDT",
  "Prescription, Results & Follow-up",
  "Administration, Audit & Platform Health"
];
for (const name of requiredJourneys) {
  if (!plugin.includes(name)) failures.push(`Missing journey: ${name}`);
}

const requiredResponsive = [
  "Patient Tablet",
  "Doctor Tablet",
  "Nurse Mobile",
  "Specialist Tablet",
  "Specialist Mobile",
  "Administration Tablet",
  "Administration Mobile",
  "Executive Mobile",
  "Azure Administration Tablet",
  "Azure Administration Mobile"
];
for (const name of requiredResponsive) {
  if (!plugin.includes(name)) failures.push(`Missing responsive frame: ${name}`);
}

const safetyPhrases = [
  "Synthetic demonstration data only",
  "Recording is disabled",
  "human-reviewed",
  "Live/Sandbox/Mocked/Unavailable/Disabled",
  "GitHub issue #"
];
for (const phrase of safetyPhrases) {
  if (!plugin.includes(phrase)) failures.push(`Missing safety or handoff phrase: ${phrase}`);
}

for (const issue of [11, 12, 13, 14, 15, 16, 17, 18, 19]) {
  const issuePattern = issue === 11 ? /issue:\s*11/ : new RegExp(`issue:\\s*${issue}`);
  if (!issuePattern.test(plugin)) failures.push(`Plugin does not reference GitHub issue #${issue}`);
}

if (failures.length > 0) {
  console.error("Figma plugin validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Figma plugin validation passed.");
console.log(`Collections: ${requiredCollections.length}`);
console.log(`Pages: ${requiredPages.length}`);
console.log(`Component families: ${requiredComponents.length}`);
console.log(`Journeys: ${requiredJourneys.length}`);
console.log(`Responsive frames: ${requiredResponsive.length}`);
