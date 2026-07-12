import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";

const requiredFiles = [
  "design/tokens.json",
  "design/tokens.css",
  "design/components.json",
  "design/frame-map.json",
  "docs/design/DESIGN_SYSTEM_HANDOFF.md",
  "docs/design/FIGMA_FRAME_REGISTER.md",
  "docs/design/FIGMA_IMPLEMENTATION_RUNBOOK.md",
  "docs/design/ACCESSIBILITY_CHECKLIST.md",
  "docs/design/LOCALISATION_AND_SASL.md",
  "docs/design/DEMONSTRATION_STATES.md",
  "docs/design/CLINICAL_SECURITY_REVIEW.md",
  "docs/design/REVIEW_AND_ACCEPTANCE_EVIDENCE.md"
];

for (const file of requiredFiles) {
  await access(file);
}

const tokens = JSON.parse(await readFile("design/tokens.json", "utf8"));
const components = JSON.parse(await readFile("design/components.json", "utf8"));
const frameMap = JSON.parse(await readFile("design/frame-map.json", "utf8"));
const tokenCss = await readFile("design/tokens.css", "utf8");

const errors = [];

const expectedBreakpoints = ["mobile", "tablet", "desktop", "wide"];
for (const name of expectedBreakpoints) {
  if (!tokens.breakpoints?.[name]) {
    errors.push(`Missing breakpoint: ${name}`);
  }
}

const expectedSemanticColors = [
  "background/page",
  "background/surface",
  "background/navigation",
  "text/primary",
  "text/secondary",
  "text/inverse",
  "border/default",
  "focus/ring",
  "status/success",
  "status/warning",
  "status/danger",
  "status/information"
];

for (const name of expectedSemanticColors) {
  if (!tokens.color?.semantic?.[name]) {
    errors.push(`Missing semantic colour token: ${name}`);
  }
}

const expectedCssVariables = [
  "--hc-bg-page",
  "--hc-bg-surface",
  "--hc-bg-navigation",
  "--hc-text-primary",
  "--hc-text-secondary",
  "--hc-border-default",
  "--hc-focus-ring",
  "--hc-status-success",
  "--hc-status-warning",
  "--hc-status-danger",
  "--hc-status-info",
  "--hc-touch-minimum"
];

for (const variable of expectedCssVariables) {
  if (!tokenCss.includes(`${variable}:`)) {
    errors.push(`Missing CSS variable: ${variable}`);
  }
}

const expectedComponents = [
  "AppShell",
  "NavigationItem",
  "Button",
  "TextField",
  "SelectField",
  "StatusBadge",
  "IntegrationStatus",
  "MetricCard",
  "Panel",
  "QueueRow",
  "SystemState",
  "ConsentNotice",
  "ClinicalAlert",
  "VitalsCard",
  "ReferralCard",
  "DataTable",
  "ModalDialog",
  "ToastNotification"
];

const componentNames = new Set(components.components?.map((item) => item.name));
for (const name of expectedComponents) {
  if (!componentNames.has(name)) {
    errors.push(`Missing component family: ${name}`);
  }
}

const mappedIssues = new Set();
for (const page of frameMap.pages ?? []) {
  for (const frame of page.frames ?? []) {
    if (frame.issue) mappedIssues.add(frame.issue);
    for (const issue of frame.issues ?? []) mappedIssues.add(issue);
  }
  for (const frame of page.plannedFrames ?? []) {
    if (frame.issue) mappedIssues.add(frame.issue);
    for (const issue of frame.issues ?? []) mappedIssues.add(issue);
  }
}

for (let issue = 11; issue <= 19; issue += 1) {
  if (!mappedIssues.has(issue)) {
    errors.push(`Issue #${issue} is not mapped to a Figma frame or planned frame`);
  }
}

const existingPortalFrames = [
  "Patient Desktop",
  "Doctor Desktop",
  "Nurse Desktop",
  "Specialist Desktop",
  "Administration Desktop",
  "Executive Desktop",
  "Azure Administration Desktop"
];

const allFrames = (frameMap.pages ?? []).flatMap((page) => page.frames ?? []);
for (const name of existingPortalFrames) {
  if (!allFrames.some((frame) => frame.name === name && frame.status === "existing")) {
    errors.push(`Missing verified portal frame mapping: ${name}`);
  }
}

if (errors.length > 0) {
  console.error("Design handoff validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Design handoff valid: ${requiredFiles.length} files, ${componentNames.size} component families, ${mappedIssues.size} mapped issues.`);
