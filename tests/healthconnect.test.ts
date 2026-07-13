import test from "node:test";
import assert from "node:assert/strict";
import { demoJourney, integrations, isRoleId, languages, portalHref, portals, roleIds } from "../src/lib/healthconnect";

test("all seven role portals are configured", () => {
  assert.equal(roleIds.length, 7);
  for (const role of roleIds) {
    const portal = portals[role];
    assert.equal(portal.id, role);
    assert.ok(portal.navigation.length >= 5);
    assert.equal(portal.metrics.length, 3);
    assert.ok(portal.queue.length >= 3);
    assert.ok(portal.actions.length >= 3);
  }
});

test("all eleven written language options are present", () => {
  assert.equal(languages.length, 11);
  assert.ok(languages.includes("English"));
  assert.ok(languages.includes("isiXhosa"));
  assert.ok(languages.includes("Tshivenda"));
});

test("portal routes are stable and statically addressable", () => {
  for (const role of roleIds) assert.equal(portalHref(role), `/portals/${role}/`);
  assert.equal(isRoleId("doctor"), true);
  assert.equal(isRoleId("unknown"), false);
});

test("public demo integrations never claim live production connectivity", () => {
  assert.equal(integrations.length, 5);
  for (const integration of integrations) assert.notEqual(integration.state, "Live");
});

test("cross-role journey covers patient, nurse, doctor, specialist and administration", () => {
  assert.deepEqual(demoJourney.map((step) => step.role), [
    "patient",
    "nurse",
    "doctor",
    "specialist",
    "administration",
  ]);
});
