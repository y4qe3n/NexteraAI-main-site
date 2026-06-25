import assert from "node:assert/strict";
import {
  normalizeDesktopUpdateRequest,
  selectDesktopUpdateRelease,
  toTauriUpdateMetadata,
  type DesktopUpdateRelease,
} from "../src/worker/desktop-update.ts";

const signedPilot: DesktopUpdateRelease = {
  version: "1.0.1",
  notes: "Internal pilot reliability update.",
  pub_date: "2026-06-24T00:00:00Z",
  channel: "pilot",
  target: "windows",
  arch: "x86_64",
  url: "https://updates.nexteraai.co.za/desktop/pilot/NexteraAI-Agent-1.0.1-x64.msi",
  signature: "a".repeat(88),
};

const request = normalizeDesktopUpdateRequest({
  target: "windows",
  arch: "x86_64",
  currentVersion: "1.0.0",
  channel: "pilot",
});
assert.equal(request.ok, true);

if (request.ok) {
  const update = selectDesktopUpdateRelease(request.value, [signedPilot]);
  assert.equal(update?.version, "1.0.1", "older current version should receive signed pilot update");
  const metadata = toTauriUpdateMetadata(update!);
  assert.equal(metadata.platforms["windows-x86_64"].signature, signedPilot.signature);
  assert.equal("private_key" in metadata, false, "metadata must not expose private keys");
}

const sameVersion = normalizeDesktopUpdateRequest({
  target: "windows",
  arch: "x86_64",
  currentVersion: "1.0.1",
  channel: "pilot",
});
if (sameVersion.ok) {
  assert.equal(selectDesktopUpdateRelease(sameVersion.value, [signedPilot]), null, "current version should return no update");
}

const stableRequest = normalizeDesktopUpdateRequest({
  target: "windows",
  arch: "x86_64",
  currentVersion: "1.0.0",
  channel: "stable",
});
if (stableRequest.ok) {
  assert.equal(selectDesktopUpdateRelease(stableRequest.value, [signedPilot]), null, "pilot release must not leak to stable");
}

const unsignedRelease = { ...signedPilot, signature: "" };
if (request.ok) {
  assert.equal(selectDesktopUpdateRelease(request.value, [unsignedRelease]), null, "unsigned releases must not be served");
}

assert.equal(normalizeDesktopUpdateRequest({ target: "darwin", arch: "x86_64", currentVersion: "1.0.0", channel: "pilot" }).ok, false);
assert.equal(normalizeDesktopUpdateRequest({ target: "windows", arch: "arm64", currentVersion: "1.0.0", channel: "pilot" }).ok, false);

console.log("desktop update endpoint tests passed");

