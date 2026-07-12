/*
 * Secor HealthConnect Canvas Bootstrap
 *
 * Repository-controlled Figma plugin for the canonical Secor HealthConnect file.
 * It creates or reconciles local variables, styles, component starters,
 * critical states, responsive role frames, prototype journeys and handoff pages.
 *
 * This plugin uses synthetic demonstration content only. It does not connect to
 * Azure, Microsoft Entra, Teams, WhatsApp, FHIR or any production data source.
 */

const NS = "healthconnect";
const RUN_KEY = "canvas-bootstrap-v1";

const COLORS = {
  "navy-900": "#09263F",
  "navy-800": "#12344F",
  "navy-700": "#173B57",
  "ink-900": "#112436",
  "slate-600": "#6D7E8C",
  "slate-300": "#A9C3D4",
  "line-200": "#DBE5EB",
  "surface-050": "#F4F8FA",
  white: "#FFFFFF",
  "cyan-500": "#00A6D6",
  "teal-600": "#008F86",
  "teal-050": "#DFF6F2",
  "green-600": "#2D8A52",
  "green-400": "#52D38F",
  "green-050": "#E9F7EF",
  "amber-500": "#E3A313",
  "amber-700": "#9A6900",
  "amber-050": "#FFF5DA",
  "red-600": "#C94747",
  "red-050": "#FDEAEA",
  "blue-050": "#EAF5FA",
  "blue-600": "#19759B"
};

const SEMANTIC = {
  "background/page": "surface-050",
  "background/surface": "white",
  "background/navigation": "navy-900",
  "background/navigation-hover": "navy-700",
  "background/accent": "teal-600",
  "text/primary": "ink-900",
  "text/secondary": "slate-600",
  "text/inverse": "white",
  "text/navigation-muted": "slate-300",
  "border/default": "line-200",
  "focus/ring": "cyan-500",
  "status/success": "green-600",
  "status/success-bg": "green-050",
  "status/warning": "amber-700",
  "status/warning-bg": "amber-050",
  "status/danger": "red-600",
  "status/danger-bg": "red-050",
  "status/information": "blue-600",
  "status/information-bg": "blue-050"
};

const SPACING = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 10: 40, 12: 48, 16: 64 };
const RADIUS = { none: 0, sm: 8, md: 10, lg: 12, xl: 14, "2xl": 17, round: 999 };
const BREAKPOINTS = { mobile: 390, tablet: 834, desktop: 1280, wide: 1440 };

const PAGE_NAMES = [
  "03 Foundations & Tokens",
  "04 Components & Variants",
  "05 Critical States",
  "06 Accessibility & Localisation",
  "07 Developer Handoff"
];

const PORTALS = [
  { name: "Patient Desktop", issue: 12, role: "Patient", viewport: "Desktop" },
  { name: "Doctor Desktop", issue: 13, role: "Doctor", viewport: "Desktop" },
  { name: "Nurse Desktop", issue: 14, role: "Nurse", viewport: "Desktop" },
  { name: "Specialist Desktop", issue: 15, role: "Specialist", viewport: "Desktop" },
  { name: "Administration Desktop", issue: 16, role: "Facility administration", viewport: "Desktop" },
  { name: "Executive Desktop", issue: 17, role: "Provincial executive", viewport: "Desktop" },
  { name: "Azure Administration Desktop", issue: 18, role: "Application administration", viewport: "Desktop" }
];

const RESPONSIVE = [
  { name: "Patient Tablet", role: "Patient", issue: 12, width: 834, height: 1112 },
  { name: "Doctor Tablet", role: "Doctor", issue: 13, width: 834, height: 1112 },
  { name: "Nurse Mobile", role: "Nurse", issue: 14, width: 390, height: 844 },
  { name: "Specialist Tablet", role: "Specialist", issue: 15, width: 834, height: 1112 },
  { name: "Specialist Mobile", role: "Specialist", issue: 15, width: 390, height: 844 },
  { name: "Administration Tablet", role: "Facility administration", issue: 16, width: 834, height: 1112 },
  { name: "Administration Mobile", role: "Facility administration", issue: 16, width: 390, height: 844 },
  { name: "Executive Mobile", role: "Provincial executive", issue: 17, width: 390, height: 844 },
  { name: "Azure Administration Tablet", role: "Application administration", issue: 18, width: 834, height: 1112 },
  { name: "Azure Administration Mobile", role: "Application administration", issue: 18, width: 390, height: 844 }
];

const JOURNEYS = [
  { name: "Secure Sign-in", issue: 11, integration: "Entra ID — Mocked", body: "Workforce identity entry with privacy-safe demonstration credentials." },
  { name: "MFA Verification", issue: 11, integration: "Entra ID — Mocked", body: "Second-factor verification with recovery and support guidance." },
  { name: "Language & Accessibility", issue: 11, integration: "Local preferences — Live prototype", body: "Language, text size, screen-reader and interpreter preferences." },
  { name: "POPIA Consent", issue: 12, integration: "Consent service — Mocked", body: "Versioned privacy notice and purpose-specific consent choices." },
  { name: "Appointment Booking", issue: 12, integration: "Azure SQL — Mocked", body: "Facility, service, date and accessibility requirement selection." },
  { name: "Virtual Waiting Room", issue: 12, integration: "Teams — Mocked", body: "Connectivity, device, privacy and consultation readiness checks." },
  { name: "Nurse Triage & Vitals", issue: 14, integration: "FHIR Observation — Mocked", body: "Structured intake, observations and human-reviewed escalation." },
  { name: "Doctor Consultation", issue: 13, integration: "Teams — Mocked", body: "Clinical review, notes and advisory decision-support disclosure." },
  { name: "Specialist Referral & MDT", issue: 15, integration: "FHIR ServiceRequest — Mocked", body: "Referral review, evidence request and multidisciplinary collaboration." },
  { name: "Prescription, Results & Follow-up", issue: 13, integration: "FHIR — Mocked", body: "Prescription, laboratory, imaging and follow-up communication states." },
  { name: "Administration, Audit & Platform Health", issue: 18, integration: "Azure — Mocked", body: "Role governance, integration health, audit and operational status." }
];

const COMPONENT_FAMILIES = [
  { name: "StatusBadge", property: "Tone", values: ["Neutral", "Information", "Success", "Warning", "Danger"], issue: 19 },
  { name: "Button", property: "Style", values: ["Primary", "Secondary", "Tertiary", "Danger"], issue: 19 },
  { name: "TextField", property: "State", values: ["Empty", "Filled", "Focus", "Error", "Disabled", "ReadOnly"], issue: 19 },
  { name: "SelectField", property: "State", values: ["Empty", "Selected", "Focus", "Error", "Disabled"], issue: 19 },
  { name: "IntegrationStatus", property: "Status", values: ["Live", "Sandbox", "Mocked", "Unavailable", "Disabled"], issue: 18 },
  { name: "NavigationItem", property: "State", values: ["Default", "Selected", "Focus", "Disabled"], issue: 19 },
  { name: "Panel", property: "State", values: ["Default", "Loading", "Empty", "Error", "PermissionDenied"], issue: 19 },
  { name: "MetricCard", property: "State", values: ["Default", "Loading", "Stale", "Error"], issue: 17 },
  { name: "QueueRow", property: "State", values: ["Waiting", "Ready", "InProgress", "Completed", "Cancelled"], issue: 16 },
  { name: "SystemState", property: "Type", values: ["Loading", "Empty", "Error", "Offline", "Degraded", "PermissionDenied", "SessionExpired", "Maintenance"], issue: 19 },
  { name: "ConsentNotice", property: "State", values: ["NotReviewed", "Accepted", "Declined", "Expired", "Updated"], issue: 12 },
  { name: "ClinicalAlert", property: "Severity", values: ["Information", "Attention", "Urgent", "Critical"], issue: 13 },
  { name: "VitalsCard", property: "State", values: ["Default", "Editing", "ValidationError", "Saved"], issue: 14 },
  { name: "ReferralCard", property: "State", values: ["Draft", "Submitted", "Accepted", "InformationRequested", "Scheduled", "Completed", "Declined"], issue: 15 },
  { name: "DataTable", property: "State", values: ["Default", "Loading", "Empty", "Error", "PermissionDenied"], issue: 18 },
  { name: "ModalDialog", property: "Purpose", values: ["Confirm", "Form", "Warning", "Destructive", "Information"], issue: 19 },
  { name: "ToastNotification", property: "Tone", values: ["Information", "Success", "Warning", "Danger"], issue: 19 },
  { name: "AppShell", property: "Connectivity", values: ["Online", "Degraded", "Offline"], issue: 19 }
];

function rgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255
  };
}

function solid(hex, opacity = 1) {
  return { type: "SOLID", color: rgb(hex), opacity };
}

function tag(node, kind, key) {
  node.setSharedPluginData(NS, "run", RUN_KEY);
  node.setSharedPluginData(NS, "kind", kind);
  node.setSharedPluginData(NS, "key", key || node.name);
}

function isManaged(node, kind) {
  if (node.getSharedPluginData(NS, "run") !== RUN_KEY) return false;
  return !kind || node.getSharedPluginData(NS, "kind") === kind;
}

function managedChildren(page, kind) {
  return page.children.filter((node) => isManaged(node, kind));
}

function removeManaged(page, kind) {
  for (const node of [...managedChildren(page, kind)]) node.remove();
}

function ensurePage(name) {
  let page = figma.root.children.find((candidate) => candidate.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  return page;
}

function makeAutoFrame(name, direction = "VERTICAL") {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = 12;
  frame.paddingTop = 16;
  frame.paddingRight = 16;
  frame.paddingBottom = 16;
  frame.paddingLeft = 16;
  frame.cornerRadius = 12;
  frame.fills = [solid(COLORS.white)];
  frame.strokes = [solid(COLORS["line-200"])];
  frame.strokeWeight = 1;
  return frame;
}

function setFixedWidth(node, width) {
  node.resize(width, Math.max(node.height, 1));
  node.layoutSizingHorizontal = "FIXED";
}

function setFixedSize(node, width, height) {
  node.resize(width, height);
  node.layoutSizingHorizontal = "FIXED";
  node.layoutSizingVertical = "FIXED";
}

async function resolveFonts() {
  const available = await figma.listAvailableFontsAsync();
  const choose = (styles) => {
    for (const style of styles) {
      const found = available.find((entry) => entry.fontName.family === "Inter" && entry.fontName.style === style);
      if (found) return found.fontName;
    }
    const inter = available.find((entry) => entry.fontName.family === "Inter");
    if (inter) return inter.fontName;
    return available[0].fontName;
  };
  const fonts = {
    regular: choose(["Regular"]),
    medium: choose(["Medium", "Regular"]),
    semibold: choose(["Semi Bold", "Semibold", "Bold", "Regular"]),
    bold: choose(["Bold", "Semi Bold", "Semibold", "Regular"])
  };
  const unique = new Map(Object.values(fonts).map((font) => [`${font.family}:${font.style}`, font]));
  await Promise.all([...unique.values()].map((font) => figma.loadFontAsync(font)));
  return fonts;
}

function makeText(text, font, size = 14, color = COLORS["ink-900"], weightName) {
  const node = figma.createText();
  node.name = weightName ? `Text/${weightName}` : "Text";
  node.fontName = font;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 150 };
  node.characters = text;
  node.fills = [solid(color)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function makeParagraph(text, font, width, color = COLORS["slate-600"], size = 14) {
  const node = makeText(text, font, size, color);
  node.textAutoResize = "HEIGHT";
  node.resize(width, 1);
  return node;
}

function variableCodeName(prefix, name) {
  return `var(--hc-${prefix}-${name.replace(/\//g, "-").replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase()})`;
}

async function ensureCollections() {
  const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const existingVariables = await figma.variables.getLocalVariablesAsync();

  function collection(name) {
    let item = existingCollections.find((candidate) => candidate.name === name);
    if (!item) {
      item = figma.variables.createVariableCollection(name);
      try { item.renameMode(item.defaultModeId, "Value"); } catch (_) {}
      existingCollections.push(item);
    }
    return item;
  }

  function variable(name, coll, type, value, scopes, codeName) {
    let item = existingVariables.find((candidate) => candidate.name === name && candidate.variableCollectionId === coll.id);
    if (!item) {
      item = figma.variables.createVariable(name, coll, type);
      existingVariables.push(item);
    }
    item.scopes = scopes;
    item.setValueForMode(coll.defaultModeId, value);
    if (codeName) item.setVariableCodeSyntax("WEB", codeName);
    return item;
  }

  const primitives = collection("HealthConnect/Primitives");
  const semantic = collection("HealthConnect/Semantic Color");
  const spacingRadius = collection("HealthConnect/Spacing & Radius");
  const motionLayout = collection("HealthConnect/Motion & Layout");

  const primitiveVars = {};
  for (const [name, hex] of Object.entries(COLORS)) {
    primitiveVars[name] = variable(`color/${name}`, primitives, "COLOR", rgb(hex), [], variableCodeName("color", name));
  }

  const semanticVars = {};
  for (const [name, primitiveName] of Object.entries(SEMANTIC)) {
    let scopes = ["FRAME_FILL", "SHAPE_FILL"];
    if (name.startsWith("text/") || name.startsWith("focus/")) scopes = ["TEXT_FILL"];
    if (name.startsWith("border/")) scopes = ["STROKE_COLOR"];
    if (name.startsWith("status/") && !name.endsWith("-bg")) scopes = ["TEXT_FILL", "STROKE_COLOR"];
    semanticVars[name] = variable(
      `color/${name}`,
      semantic,
      "COLOR",
      { type: "VARIABLE_ALIAS", id: primitiveVars[primitiveName].id },
      scopes,
      variableCodeName("color", name)
    );
  }

  const spacingVars = {};
  for (const [name, value] of Object.entries(SPACING)) {
    spacingVars[name] = variable(`spacing/${name}`, spacingRadius, "FLOAT", value, ["GAP"], variableCodeName("space", name));
  }

  const radiusVars = {};
  for (const [name, value] of Object.entries(RADIUS)) {
    radiusVars[name] = variable(`radius/${name}`, spacingRadius, "FLOAT", value, ["CORNER_RADIUS"], variableCodeName("radius", name));
  }

  const layoutVars = {};
  for (const [name, value] of Object.entries(BREAKPOINTS)) {
    layoutVars[`breakpoint/${name}`] = variable(`breakpoint/${name}`, motionLayout, "FLOAT", value, ["WIDTH_HEIGHT"], variableCodeName("breakpoint", name));
  }
  layoutVars["touch/minimum"] = variable("touch/minimum", motionLayout, "FLOAT", 44, ["WIDTH_HEIGHT"], "var(--hc-touch-minimum)");
  layoutVars["touch/preferred"] = variable("touch/preferred", motionLayout, "FLOAT", 48, ["WIDTH_HEIGHT"], "var(--hc-touch-preferred)");
  layoutVars["motion/fast"] = variable("motion/duration/fast", motionLayout, "FLOAT", 120, [], "var(--hc-motion-duration-fast)");
  layoutVars["motion/default"] = variable("motion/duration/default", motionLayout, "FLOAT", 200, [], "var(--hc-motion-duration-default)");
  layoutVars["motion/slow"] = variable("motion/duration/slow", motionLayout, "FLOAT", 320, [], "var(--hc-motion-duration-slow)");
  layoutVars["motion/easing"] = variable("motion/easing/standard", motionLayout, "STRING", "cubic-bezier(0.2, 0, 0, 1)", [], "var(--hc-motion-easing-standard)");

  return { primitives, semantic, spacingRadius, motionLayout, primitiveVars, semanticVars, spacingVars, radiusVars, layoutVars };
}

function bindFill(node, variable, fallback) {
  if (!variable) {
    node.fills = [solid(fallback)];
    return;
  }
  node.fills = [figma.variables.setBoundVariableForPaint(solid(fallback), "color", variable)];
}

function bindStroke(node, variable, fallback) {
  if (!variable) {
    node.strokes = [solid(fallback)];
    return;
  }
  node.strokes = [figma.variables.setBoundVariableForPaint(solid(fallback), "color", variable)];
}

function bindText(node, variable, fallback) {
  node.fills = [figma.variables.setBoundVariableForPaint(solid(fallback), "color", variable)];
}

async function ensureStyles(fonts) {
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();

  function textStyle(name, font, size, lineHeight, letterSpacing) {
    let style = textStyles.find((candidate) => candidate.name === name);
    if (!style) {
      style = figma.createTextStyle();
      style.name = name;
      textStyles.push(style);
    }
    style.fontName = font;
    style.fontSize = size;
    style.lineHeight = { unit: "PERCENT", value: lineHeight };
    style.letterSpacing = { unit: "PERCENT", value: letterSpacing || 0 };
    return style;
  }

  textStyle("HealthConnect/Display/Large", fonts.bold, 34, 120, -3);
  textStyle("HealthConnect/Title/Large", fonts.bold, 28, 125, -2);
  textStyle("HealthConnect/Title/Medium", fonts.semibold, 20, 130, -1);
  textStyle("HealthConnect/Body/Large", fonts.regular, 16, 150, 0);
  textStyle("HealthConnect/Body/Medium", fonts.regular, 14, 150, 0);
  textStyle("HealthConnect/Body/Small", fonts.regular, 12, 150, 0);
  textStyle("HealthConnect/Label/Medium", fonts.semibold, 14, 130, 0);
  textStyle("HealthConnect/Label/Small", fonts.semibold, 12, 130, 0);
  textStyle("HealthConnect/Eyebrow", fonts.bold, 11, 120, 12);

  function effectStyle(name, effects) {
    let style = effectStyles.find((candidate) => candidate.name === name);
    if (!style) {
      style = figma.createEffectStyle();
      style.name = name;
      effectStyles.push(style);
    }
    style.effects = effects;
    return style;
  }

  effectStyle("HealthConnect/Elevation/Surface", [{
    type: "DROP_SHADOW",
    color: { ...rgb("#17394E"), a: 0.08 },
    offset: { x: 0, y: 8 },
    radius: 28,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }]);
  effectStyle("HealthConnect/Elevation/Floating", [{
    type: "DROP_SHADOW",
    color: { ...rgb("#001A2B"), a: 0.27 },
    offset: { x: 0, y: 12 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }]);
  effectStyle("HealthConnect/Elevation/Focus", [{
    type: "DROP_SHADOW",
    color: { ...rgb("#00A6D6"), a: 0.35 },
    offset: { x: 0, y: 0 },
    radius: 0,
    spread: 3,
    visible: true,
    blendMode: "NORMAL"
  }]);

  return { textStyles, effectStyles };
}

function pageTitle(page, title, description, fonts) {
  const header = makeAutoFrame("Page Header", "VERTICAL");
  header.x = 64;
  header.y = 64;
  header.itemSpacing = 8;
  header.fills = [];
  header.strokes = [];
  header.paddingTop = header.paddingRight = header.paddingBottom = header.paddingLeft = 0;
  header.appendChild(makeText(title, fonts.bold, 32));
  header.appendChild(makeParagraph(description, fonts.regular, 900));
  tag(header, "page-header", title);
  page.appendChild(header);
  return header;
}

function swatch(name, hex, fonts) {
  const card = makeAutoFrame(`Swatch/${name}`, "VERTICAL");
  setFixedWidth(card, 180);
  const sample = figma.createRectangle();
  sample.name = "Colour sample";
  sample.resize(148, 84);
  sample.cornerRadius = 10;
  sample.fills = [solid(hex)];
  card.appendChild(sample);
  card.appendChild(makeText(name, fonts.semibold, 13));
  card.appendChild(makeText(hex, fonts.regular, 12, COLORS["slate-600"]));
  tag(card, "foundation-swatch", name);
  return card;
}

function createFoundationsPage(page, fonts, vars) {
  removeManaged(page);
  pageTitle(page, "HealthConnect Foundations", "Local variables and styles generated from design/tokens.json. Synthetic demonstration use only.", fonts);

  const colours = makeAutoFrame("Colour Primitives", "HORIZONTAL");
  colours.x = 64;
  colours.y = 180;
  colours.layoutWrap = "WRAP";
  colours.counterAxisSpacing = 16;
  colours.itemSpacing = 16;
  colours.paddingTop = colours.paddingRight = colours.paddingBottom = colours.paddingLeft = 0;
  colours.fills = [];
  colours.strokes = [];
  setFixedWidth(colours, 1280);
  for (const [name, hex] of Object.entries(COLORS)) colours.appendChild(swatch(name, hex, fonts));
  tag(colours, "foundation-section", "colours");
  page.appendChild(colours);

  const metrics = makeAutoFrame("Spacing Radius Layout", "VERTICAL");
  metrics.x = 64;
  metrics.y = 830;
  setFixedWidth(metrics, 920);
  metrics.appendChild(makeText("Spacing, radius and layout", fonts.bold, 22));
  metrics.appendChild(makeParagraph(`Spacing: ${Object.values(SPACING).join(", ")} px`, fonts.regular, 860));
  metrics.appendChild(makeParagraph(`Radius: ${Object.values(RADIUS).join(", ")} px`, fonts.regular, 860));
  metrics.appendChild(makeParagraph(`Breakpoints: mobile ${BREAKPOINTS.mobile}, tablet ${BREAKPOINTS.tablet}, desktop ${BREAKPOINTS.desktop}, wide ${BREAKPOINTS.wide}`, fonts.regular, 860));
  metrics.appendChild(makeParagraph("Touch targets: minimum 44px; preferred 48px. Reduced motion removes non-essential movement.", fonts.regular, 860));
  tag(metrics, "foundation-section", "metrics");
  page.appendChild(metrics);

  page.backgrounds = [solid(COLORS["surface-050"])];
}

function componentTone(family, value) {
  if (family === "Button") {
    if (value === "Primary") return { bg: COLORS["teal-600"], fg: COLORS.white, border: COLORS["teal-600"] };
    if (value === "Danger") return { bg: COLORS["red-600"], fg: COLORS.white, border: COLORS["red-600"] };
    if (value === "Tertiary") return { bg: COLORS.white, fg: COLORS["teal-600"], border: COLORS.white };
  }
  if (["Danger", "Critical", "Error", "ValidationError", "Declined"].includes(value)) return { bg: COLORS["red-050"], fg: COLORS["red-600"], border: COLORS["red-600"] };
  if (["Warning", "Attention", "Urgent", "Stale", "Degraded", "InformationRequested"].includes(value)) return { bg: COLORS["amber-050"], fg: COLORS["amber-700"], border: COLORS["amber-500"] };
  if (["Success", "Live", "Accepted", "Completed", "Saved", "Online"].includes(value)) return { bg: COLORS["green-050"], fg: COLORS["green-600"], border: COLORS["green-600"] };
  if (["Information", "Sandbox", "Mocked", "Loading", "InProgress", "Submitted"].includes(value)) return { bg: COLORS["blue-050"], fg: COLORS["blue-600"], border: COLORS["blue-600"] };
  if (["Disabled", "Unavailable", "PermissionDenied", "Offline", "SessionExpired"].includes(value)) return { bg: COLORS["surface-050"], fg: COLORS["slate-600"], border: COLORS["line-200"] };
  return { bg: COLORS.white, fg: COLORS["ink-900"], border: COLORS["line-200"] };
}

function createVariantComponent(family, property, value, fonts, vars) {
  const component = figma.createComponent();
  component.name = `${property}=${value}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = 6;
  component.paddingTop = 14;
  component.paddingRight = 16;
  component.paddingBottom = 14;
  component.paddingLeft = 16;
  component.resize(family === "AppShell" ? 320 : 240, 80);
  component.cornerRadius = 12;
  component.strokeWeight = 1;

  const tone = componentTone(family, value);
  bindFill(component, vars.semanticVars["background/surface"], tone.bg);
  component.fills = [solid(tone.bg)];
  bindStroke(component, vars.semanticVars["border/default"], tone.border);
  component.strokes = [solid(tone.border)];

  const title = makeText(family, fonts.semibold, 14, tone.fg);
  const detail = makeText(`${property}: ${value}`, fonts.regular, 12, tone.fg);
  component.appendChild(title);
  component.appendChild(detail);
  try {
    const labelProperty = component.addComponentProperty("Label", "TEXT", family);
    title.componentPropertyReferences = { characters: labelProperty };
  } catch (_) {}
  tag(component, "component-variant", `${family}/${property}/${value}`);
  return component;
}

function createIconComponents(page, fonts) {
  const existing = page.children.find((node) => node.type === "COMPONENT_SET" && node.name === "HC/IconSlot");
  if (existing) existing.remove();
  const values = ["Default", "Calendar", "Alert", "Clinical", "Accessibility", "Integration"];
  const components = values.map((value) => {
    const component = figma.createComponent();
    component.name = `Purpose=${value}`;
    component.resize(44, 44);
    component.cornerRadius = 10;
    component.fills = [solid(COLORS["blue-050"])];
    component.strokes = [solid(COLORS["line-200"])];
    const label = makeText(value.slice(0, 1), fonts.bold, 16, COLORS["blue-600"]);
    label.x = 16;
    label.y = 10;
    component.appendChild(label);
    tag(component, "icon-component", value);
    page.appendChild(component);
    return component;
  });
  const set = figma.combineAsVariants(components, page);
  set.name = "HC/IconSlot";
  set.description = "Local icon slot. Replace nested instance with an approved Carbon icon. Icon-only controls require an accessible name.";
  set.layoutMode = "HORIZONTAL";
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  set.itemSpacing = 12;
  set.paddingTop = set.paddingRight = set.paddingBottom = set.paddingLeft = 12;
  set.x = 64;
  set.y = 180;
  tag(set, "component-set", "IconSlot");
  return set;
}

function createComponentSets(page, fonts, vars) {
  removeManaged(page);
  pageTitle(page, "HealthConnect Components", "Reusable local component starters. Canonical API and full variant expectations remain defined in design/components.json.", fonts);
  createIconComponents(page, fonts);

  let x = 64;
  let y = 360;
  let columnWidth = 760;
  let rowHeight = 0;

  for (const family of COMPONENT_FAMILIES) {
    const components = family.values.map((value) => {
      const component = createVariantComponent(family.name, family.property, value, fonts, vars);
      page.appendChild(component);
      return component;
    });
    const set = figma.combineAsVariants(components, page);
    set.name = `HC/${family.name}`;
    set.description = `GitHub issue #${family.issue}. Use design/components.json for complete properties, states, accessibility and safety notes.`;
    set.layoutMode = "HORIZONTAL";
    set.layoutWrap = "WRAP";
    set.primaryAxisSizingMode = "FIXED";
    set.counterAxisSizingMode = "AUTO";
    set.resize(700, Math.max(set.height, 100));
    set.itemSpacing = 12;
    set.counterAxisSpacing = 12;
    set.paddingTop = set.paddingRight = set.paddingBottom = set.paddingLeft = 12;
    set.x = x;
    set.y = y;
    tag(set, "component-set", family.name);

    rowHeight = Math.max(rowHeight, set.height);
    if (x > 64) {
      x = 64;
      y += rowHeight + 80;
      rowHeight = 0;
    } else {
      x += columnWidth;
    }
  }
  page.backgrounds = [solid(COLORS["surface-050"])];
}

function stateDescription(type) {
  const descriptions = {
    Loading: "Keep context visible, announce progress and provide text status.",
    Empty: "Explain why no records are present and identify a safe next action.",
    Error: "Use plain language, a reference ID and a retry or support path.",
    Offline: "Preserve safe drafts and disclose what is unavailable.",
    Degraded: "Prefer lower-bandwidth workflows and asynchronous alternatives.",
    PermissionDenied: "Do not reveal protected data; explain the approved escalation path.",
    SessionExpired: "Protect unsaved work where possible and require reauthentication.",
    Maintenance: "Disclose expected restoration time and emergency alternatives."
  };
  return descriptions[type];
}

function createStateCard(type, scope, fonts) {
  const card = makeAutoFrame(`${type}/${scope}`, "VERTICAL");
  setFixedWidth(card, scope === "Page" ? 540 : scope === "Panel" ? 360 : 280);
  const tone = componentTone("SystemState", type);
  card.fills = [solid(tone.bg)];
  card.strokes = [solid(tone.border)];
  card.appendChild(makeText(`${type} — ${scope}`, fonts.semibold, 16, tone.fg));
  card.appendChild(makeParagraph(stateDescription(type), fonts.regular, scope === "Page" ? 500 : scope === "Panel" ? 320 : 240, tone.fg, 12));
  const action = makeText(type === "PermissionDenied" ? "Contact authorised support" : "Retry / Continue safely", fonts.semibold, 12, tone.fg);
  card.appendChild(action);
  tag(card, "critical-state", `${type}/${scope}`);
  return card;
}

function createCriticalStatesPage(page, fonts) {
  removeManaged(page);
  pageTitle(page, "Critical System States", "Required page, panel and inline states for resilient, accessible and privacy-safe operation.", fonts);

  const matrix = makeAutoFrame("State Matrix", "HORIZONTAL");
  matrix.x = 64;
  matrix.y = 180;
  matrix.layoutWrap = "WRAP";
  matrix.counterAxisSpacing = 20;
  matrix.itemSpacing = 20;
  matrix.paddingTop = matrix.paddingRight = matrix.paddingBottom = matrix.paddingLeft = 0;
  matrix.fills = [];
  matrix.strokes = [];
  setFixedWidth(matrix, 1380);

  for (const type of ["Loading", "Empty", "Error", "Offline", "Degraded", "PermissionDenied", "SessionExpired", "Maintenance"]) {
    for (const scope of ["Page", "Panel", "Inline"]) matrix.appendChild(createStateCard(type, scope, fonts));
  }
  tag(matrix, "critical-state-matrix", "all-states");
  page.appendChild(matrix);
  page.backgrounds = [solid(COLORS["surface-050"])];
}

function exampleCard(title, body, fonts, tone = "information") {
  const card = makeAutoFrame(title, "VERTICAL");
  setFixedWidth(card, 420);
  const palette = tone === "danger" ? componentTone("SystemState", "Error") : tone === "warning" ? componentTone("SystemState", "Warning") : componentTone("SystemState", "Information");
  card.fills = [solid(palette.bg)];
  card.strokes = [solid(palette.border)];
  card.appendChild(makeText(title, fonts.semibold, 16, palette.fg));
  card.appendChild(makeParagraph(body, fonts.regular, 380, palette.fg, 13));
  tag(card, "accessibility-example", title);
  return card;
}

function createAccessibilityPage(page, fonts) {
  removeManaged(page);
  pageTitle(page, "Accessibility & Localisation", "WCAG-aligned interaction patterns, eleven written official languages and SASL/interpreter workflows.", fonts);

  const grid = makeAutoFrame("Accessibility Grid", "HORIZONTAL");
  grid.x = 64;
  grid.y = 180;
  grid.layoutWrap = "WRAP";
  grid.counterAxisSpacing = 20;
  grid.itemSpacing = 20;
  grid.paddingTop = grid.paddingRight = grid.paddingBottom = grid.paddingLeft = 0;
  grid.fills = [];
  grid.strokes = [];
  setFixedWidth(grid, 1360);

  const items = [
    ["Keyboard and focus", "Logical focus follows the visual workflow. Every interactive control has a visible focus ring and no keyboard trap."],
    ["Touch targets", "Minimum interactive target is 44 × 44px; 48 × 48px is preferred for clinical and mobile workflows."],
    ["Text expansion", "Labels and instructions support at least 200% text scaling and longer translated strings without clipping."],
    ["Non-colour status", "Urgency, validation, integration and clinical state combine text, iconography and colour."],
    ["Screen readers", "Controls expose accessible names, errors are associated with fields and dynamic status uses appropriate live regions."],
    ["Low bandwidth", "Video is not the only pathway. Reconnect, retry, draft and asynchronous alternatives are represented."],
    ["Low literacy", "Use short sentences, explicit next actions, familiar icons with labels and progressive disclosure."],
    ["SASL and interpreter", "South African Sign Language is handled through accessible video/interpreter workflow states, not written translation."],
    ["Charts and maps", "Every chart or map has a text summary and tabular alternative with data date and source."],
    ["Clinical alerts", "Advisory alerts identify source, limitations, required human action and stale/missing-data conditions."]
  ];
  for (const [title, body] of items) grid.appendChild(exampleCard(title, body, fonts));
  page.appendChild(grid);

  const languages = makeAutoFrame("Written Languages", "VERTICAL");
  languages.x = 64;
  languages.y = 1120;
  setFixedWidth(languages, 900);
  languages.appendChild(makeText("Written-language patterns", fonts.bold, 22));
  languages.appendChild(makeParagraph("English • Afrikaans • isiZulu • isiXhosa • Sepedi • Setswana • Sesotho • Xitsonga • siSwati • Tshivenda • isiNdebele", fonts.regular, 860));
  languages.appendChild(makeParagraph("Language labels should use approved native-language names and allow content expansion. SASL is represented separately through accessibility and interpreter services.", fonts.regular, 860));
  tag(languages, "localisation", "languages");
  page.appendChild(languages);
  page.backgrounds = [solid(COLORS["surface-050"])];
}

function integrationStrip(fonts) {
  const strip = makeAutoFrame("Integration Status", "HORIZONTAL");
  strip.itemSpacing = 8;
  strip.paddingTop = strip.paddingBottom = 8;
  strip.paddingLeft = strip.paddingRight = 8;
  for (const label of ["Entra — Mocked", "Azure SQL — Mocked", "Teams — Mocked", "WhatsApp — Mocked", "FHIR R4 — Mocked"]) {
    const badge = makeAutoFrame(label, "HORIZONTAL");
    badge.paddingTop = badge.paddingBottom = 6;
    badge.paddingLeft = badge.paddingRight = 9;
    badge.cornerRadius = 999;
    badge.fills = [solid(COLORS["blue-050"])];
    badge.strokes = [];
    badge.appendChild(makeText(label, fonts.semibold, 10, COLORS["blue-600"]));
    strip.appendChild(badge);
  }
  return strip;
}

function journeyFrame(item, index, fonts) {
  const frame = makeAutoFrame(`${String(index + 1).padStart(2, "0")} — ${item.name}`, "VERTICAL");
  setFixedSize(frame, 1280, 800);
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.itemSpacing = 24;
  frame.paddingTop = 40;
  frame.paddingRight = 48;
  frame.paddingBottom = 40;
  frame.paddingLeft = 48;
  frame.cornerRadius = 0;
  frame.clipsContent = true;
  frame.fills = [solid(COLORS["surface-050"])];
  frame.strokes = [];

  const header = makeAutoFrame("Journey Header", "VERTICAL");
  setFixedWidth(header, 1184);
  header.fills = [];
  header.strokes = [];
  header.paddingTop = header.paddingRight = header.paddingBottom = header.paddingLeft = 0;
  header.itemSpacing = 8;
  header.appendChild(makeText(`STEP ${index + 1} OF ${JOURNEYS.length}`, fonts.bold, 11, COLORS["teal-600"]));
  header.appendChild(makeText(item.name, fonts.bold, 32));
  header.appendChild(makeParagraph(item.body, fonts.regular, 900));
  frame.appendChild(header);

  const disclosure = exampleCard("Demonstration boundary", `Synthetic demonstration data only. ${item.integration}. No production clinical action is performed.`, fonts, "warning");
  setFixedWidth(disclosure, 700);
  frame.appendChild(disclosure);

  const workspace = makeAutoFrame("Representative Workspace", "HORIZONTAL");
  setFixedSize(workspace, 1184, 420);
  workspace.primaryAxisSizingMode = "FIXED";
  workspace.counterAxisSizingMode = "FIXED";
  workspace.itemSpacing = 16;
  workspace.fills = [solid(COLORS.white)];
  const primary = makeAutoFrame("Primary task", "VERTICAL");
  setFixedSize(primary, 720, 360);
  primary.primaryAxisSizingMode = "FIXED";
  primary.counterAxisSizingMode = "FIXED";
  primary.appendChild(makeText("Primary workflow", fonts.semibold, 20));
  primary.appendChild(makeParagraph(item.body, fonts.regular, 660));
  primary.appendChild(makeParagraph("Validation, permission, audit and integration-state annotations apply before connected implementation.", fonts.regular, 660, COLORS["slate-600"], 12));
  const support = makeAutoFrame("Support panel", "VERTICAL");
  setFixedSize(support, 400, 360);
  support.primaryAxisSizingMode = "FIXED";
  support.counterAxisSizingMode = "FIXED";
  support.appendChild(makeText("Safety and support", fonts.semibold, 18));
  support.appendChild(makeParagraph("Clinical decisions remain human-reviewed. Recording is disabled unless an approved policy and consent process exists.", fonts.regular, 340, COLORS["slate-600"], 12));
  support.appendChild(integrationStrip(fonts));
  workspace.appendChild(primary);
  workspace.appendChild(support);
  frame.appendChild(workspace);

  const footer = makeAutoFrame("Journey Footer", "HORIZONTAL");
  footer.primaryAxisAlignItems = "SPACE_BETWEEN";
  footer.counterAxisAlignItems = "CENTER";
  setFixedWidth(footer, 1184);
  footer.fills = [];
  footer.strokes = [];
  footer.paddingTop = footer.paddingRight = footer.paddingBottom = footer.paddingLeft = 0;
  footer.appendChild(makeText(`GitHub #${item.issue}`, fonts.semibold, 12, COLORS["slate-600"]));
  const cta = makeAutoFrame(index === JOURNEYS.length - 1 ? "Restart demo" : "Continue", "HORIZONTAL");
  cta.paddingTop = cta.paddingBottom = 12;
  cta.paddingLeft = cta.paddingRight = 18;
  cta.cornerRadius = 10;
  cta.fills = [solid(COLORS["teal-600"])];
  cta.strokes = [];
  cta.appendChild(makeText(index === JOURNEYS.length - 1 ? "Restart demo" : "Continue →", fonts.semibold, 14, COLORS.white));
  tag(cta, "journey-cta", item.name);
  footer.appendChild(cta);
  frame.appendChild(footer);

  tag(frame, "journey-frame", item.name);
  frame.exportSettings = [{ format: "PNG", constraint: { type: "SCALE", value: 1 } }];
  return { frame, cta };
}

async function createJourneysPage(page, fonts) {
  removeManaged(page);
  const entries = JOURNEYS.map((item, index) => journeyFrame(item, index, fonts));
  entries.forEach(({ frame }, index) => {
    frame.x = index * 1360;
    frame.y = 0;
    page.appendChild(frame);
  });
  entries.forEach(({ cta }, index) => {
    const target = entries[(index + 1) % entries.length].frame;
    try {
      cta.reactions = [{
        trigger: { type: "ON_CLICK" },
        actions: [{ type: "NODE", destinationId: target.id, navigation: "NAVIGATE", transition: null, preserveScrollPosition: false }]
      }];
    } catch (_) {
      cta.setSharedPluginData(NS, "prototype-target", target.id);
    }
  });
  page.backgrounds = [solid(COLORS["navy-900"])];
  return entries.map(({ frame, cta }) => ({ frameId: frame.id, ctaId: cta.id }));
}

function responsiveFrame(item, fonts) {
  const frame = makeAutoFrame(item.name, "VERTICAL");
  setFixedSize(frame, item.width, item.height);
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.paddingTop = 24;
  frame.paddingRight = 24;
  frame.paddingBottom = 24;
  frame.paddingLeft = 24;
  frame.itemSpacing = 16;
  frame.cornerRadius = 0;
  frame.clipsContent = true;
  frame.fills = [solid(COLORS["surface-050"])];
  frame.strokes = [];

  const header = makeAutoFrame("Header", "HORIZONTAL");
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  setFixedWidth(header, item.width - 48);
  header.fills = [];
  header.strokes = [];
  header.paddingTop = header.paddingRight = header.paddingBottom = header.paddingLeft = 0;
  const brand = makeAutoFrame("Brand", "HORIZONTAL");
  brand.paddingTop = brand.paddingRight = brand.paddingBottom = brand.paddingLeft = 0;
  brand.fills = [];
  brand.strokes = [];
  brand.appendChild(makeText("S", fonts.bold, 18, COLORS["teal-600"]));
  brand.appendChild(makeText("Secor HealthConnect", fonts.semibold, 14));
  header.appendChild(brand);
  header.appendChild(makeText("English • A11y", fonts.semibold, 11, COLORS["slate-600"]));
  frame.appendChild(header);

  frame.appendChild(makeText(item.role, fonts.bold, item.width < 500 ? 26 : 30));
  frame.appendChild(makeParagraph(`Responsive ${item.role.toLowerCase()} summary for GitHub issue #${item.issue}. Synthetic data only.`, fonts.regular, item.width - 48));

  const status = exampleCard("Connectivity", "Online • Lower-bandwidth fallback available • Integration states are disclosed", fonts);
  setFixedWidth(status, item.width - 48);
  frame.appendChild(status);

  const grid = makeAutoFrame("Summary Cards", item.width < 500 ? "VERTICAL" : "HORIZONTAL");
  grid.layoutWrap = item.width < 500 ? "NO_WRAP" : "WRAP";
  grid.counterAxisSpacing = 12;
  grid.itemSpacing = 12;
  grid.paddingTop = grid.paddingRight = grid.paddingBottom = grid.paddingLeft = 0;
  grid.fills = [];
  grid.strokes = [];
  setFixedWidth(grid, item.width - 48);
  for (const label of ["Priority work", "Upcoming care", "Alerts", "Quick action"]) {
    const card = makeAutoFrame(label, "VERTICAL");
    setFixedWidth(card, item.width < 500 ? item.width - 48 : Math.floor((item.width - 60) / 2));
    card.appendChild(makeText(label, fonts.semibold, 15));
    card.appendChild(makeParagraph("Representative synthetic content with explicit status and next action.", fonts.regular, card.width - 32, COLORS["slate-600"], 12));
    grid.appendChild(card);
  }
  frame.appendChild(grid);

  frame.appendChild(integrationStrip(fonts));
  tag(frame, "responsive-frame", item.name);
  frame.setSharedPluginData(NS, "github-issue", String(item.issue));
  frame.exportSettings = [{ format: "PNG", constraint: { type: "SCALE", value: 1 } }];
  return frame;
}

async function createResponsiveFrames(mainPage, fonts) {
  for (const child of [...mainPage.children]) {
    if (isManaged(child, "responsive-frame")) child.remove();
  }
  let maxY = 0;
  for (const child of mainPage.children) maxY = Math.max(maxY, child.y + child.height);
  let x = 0;
  let y = maxY + 240;
  let rowHeight = 0;
  const created = [];
  for (const item of RESPONSIVE) {
    const frame = responsiveFrame(item, fonts);
    frame.x = x;
    frame.y = y;
    mainPage.appendChild(frame);
    created.push(frame.id);
    x += item.width + 80;
    rowHeight = Math.max(rowHeight, item.height);
    if (x > 4200) {
      x = 0;
      y += rowHeight + 120;
      rowHeight = 0;
    }
  }
  return created;
}

function tagExistingPortals(mainPage) {
  const updated = [];
  for (const portal of PORTALS) {
    const frame = mainPage.children.find((node) => node.type === "FRAME" && node.name === portal.name);
    if (!frame) continue;
    frame.setSharedPluginData(NS, "github-issue", String(portal.issue));
    frame.setSharedPluginData(NS, "role", portal.role);
    frame.setSharedPluginData(NS, "viewport", portal.viewport);
    frame.setSharedPluginData(NS, "data-boundary", "Synthetic demonstration data only");
    frame.setSharedPluginData(NS, "integration-boundary", "Explicit Live/Sandbox/Mocked/Unavailable/Disabled status required");
    frame.setSharedPluginData(NS, "review-status", "Ready for formal review after shared-component migration");
    frame.exportSettings = [{ format: "PNG", constraint: { type: "SCALE", value: 1 } }];
    updated.push(frame.id);
  }
  return updated;
}

function handoffCard(item, fonts) {
  const card = makeAutoFrame(`Handoff/${item.name}`, "VERTICAL");
  setFixedWidth(card, 620);
  card.appendChild(makeText(item.name, fonts.semibold, 18));
  card.appendChild(makeText(`GitHub #${item.issue} • ${item.viewport || "Responsive"}`, fonts.semibold, 12, COLORS["teal-600"]));
  card.appendChild(makeParagraph(`Role: ${item.role}. Data fixture: synthetic only. Authorization boundary: server-side role, facility, patient and purpose context.`, fonts.regular, 580));
  card.appendChild(makeParagraph("Validation: loading, empty, error, offline, degraded and permission-denied states. Audit: sensitive read/change events. Integrations: disclose Live, Sandbox, Mocked, Unavailable or Disabled.", fonts.regular, 580, COLORS["slate-600"], 12));
  card.appendChild(makeText("Review decision: Pending product, clinical, security/privacy and accessibility approval", fonts.semibold, 12, COLORS["amber-700"]));
  tag(card, "handoff-card", item.name);
  return card;
}

function createHandoffPage(page, fonts) {
  removeManaged(page);
  pageTitle(page, "Developer Handoff", "Frame-to-issue mapping, implementation boundaries and review status for issues #11–#19.", fonts);

  const grid = makeAutoFrame("Handoff Grid", "HORIZONTAL");
  grid.x = 64;
  grid.y = 180;
  grid.layoutWrap = "WRAP";
  grid.counterAxisSpacing = 20;
  grid.itemSpacing = 20;
  grid.paddingTop = grid.paddingRight = grid.paddingBottom = grid.paddingLeft = 0;
  grid.fills = [];
  grid.strokes = [];
  setFixedWidth(grid, 1320);
  for (const portal of PORTALS) grid.appendChild(handoffCard(portal, fonts));
  for (const item of RESPONSIVE) grid.appendChild(handoffCard({ ...item, viewport: item.width < 500 ? "Mobile" : "Tablet" }, fonts));
  tag(grid, "handoff-grid", "portals");
  page.appendChild(grid);

  const boundaries = makeAutoFrame("Acceptance Boundaries", "VERTICAL");
  boundaries.x = 64;
  boundaries.y = 2500;
  setFixedWidth(boundaries, 1000);
  boundaries.appendChild(makeText("Acceptance boundaries", fonts.bold, 22));
  boundaries.appendChild(makeParagraph("The canvas bootstrap creates controlled structures and examples. It does not grant clinical, security, privacy, accessibility or product approval. Reviewers must inspect the resulting file, record findings and attach evidence to #11 and #28.", fonts.regular, 940));
  boundaries.appendChild(makeParagraph("GitHub Pages remains a synthetic demonstration environment. Connected Azure, Entra, Teams, WhatsApp and FHIR services require separate implementation and validation.", fonts.regular, 940));
  tag(boundaries, "handoff-boundary", "acceptance");
  page.appendChild(boundaries);
  page.backgrounds = [solid(COLORS["surface-050"])];
}

async function main() {
  if (figma.editorType !== "figma") throw new Error("This plugin must run in a Figma design file.");

  const fonts = await resolveFonts();
  const vars = await ensureCollections();
  await ensureStyles(fonts);

  const mainPage = figma.root.children.find((page) => page.name === "Secor HealthConnect MVP Demo") || figma.root.children[0];
  const journeysPage = ensurePage("02 Additional MVP Flows");
  const foundationsPage = ensurePage(PAGE_NAMES[0]);
  const componentsPage = ensurePage(PAGE_NAMES[1]);
  const statesPage = ensurePage(PAGE_NAMES[2]);
  const accessibilityPage = ensurePage(PAGE_NAMES[3]);
  const handoffPage = ensurePage(PAGE_NAMES[4]);

  createFoundationsPage(foundationsPage, fonts, vars);
  createComponentSets(componentsPage, fonts, vars);
  createCriticalStatesPage(statesPage, fonts);
  createAccessibilityPage(accessibilityPage, fonts);
  createHandoffPage(handoffPage, fonts);
  const journeyNodes = await createJourneysPage(journeysPage, fonts);
  const responsiveNodeIds = await createResponsiveFrames(mainPage, fonts);
  const updatedPortalIds = tagExistingPortals(mainPage);

  await figma.setCurrentPageAsync(handoffPage);
  figma.viewport.scrollAndZoomIntoView(handoffPage.children);

  const result = {
    collections: [vars.primitives.id, vars.semantic.id, vars.spacingRadius.id, vars.motionLayout.id],
    pages: [journeysPage.id, foundationsPage.id, componentsPage.id, statesPage.id, accessibilityPage.id, handoffPage.id],
    journeyNodes,
    responsiveNodeIds,
    updatedPortalIds,
    componentSets: componentsPage.children.filter((node) => node.type === "COMPONENT_SET").map((node) => ({ id: node.id, name: node.name })),
    message: "HealthConnect canvas bootstrap completed. Formal review and screenshot evidence remain required."
  };

  figma.closePlugin(JSON.stringify(result));
}

main().catch((error) => {
  figma.closePlugin(`HealthConnect canvas bootstrap failed: ${error instanceof Error ? error.message : String(error)}`);
});
