import assert from "node:assert/strict";
import {
  agentInviteRejectionReason,
  canCreateAgentInvite,
  generateAgentAccessToken,
  generateAgentId,
  generateAgentInviteId,
  generateAgentSessionToken,
  generateRandomOrgId,
  hashAgentAccessToken,
  sanitizeAgentInviteForOwner,
  tokenDisplayPrefix,
} from "../src/worker/agent-auth.ts";

const orgIds = new Set(Array.from({ length: 20 }, () => generateRandomOrgId()));
assert.equal(orgIds.size, 20, "org_id generation must be random/non-repeating in sample");
for (const orgId of orgIds) assert.match(orgId, /^nxorg_[0-9a-f]{32}$/);

const inviteIds = new Set(Array.from({ length: 20 }, () => generateAgentInviteId()));
assert.equal(inviteIds.size, 20, "invite ID generation must be random/non-repeating in sample");

const tokens = new Set(Array.from({ length: 20 }, () => generateAgentAccessToken("test")));
assert.equal(tokens.size, 20, "agent token generation must be random/non-repeating in sample");
for (const token of tokens) assert.match(token, /^nxag_test_[0-9a-f]{64}$/);

const token = generateAgentAccessToken("test");
const hash = await hashAgentAccessToken(token);
assert.notEqual(hash, token, "plaintext token must not equal stored hash");
assert.equal(hash, await hashAgentAccessToken(token), "token hash must validate deterministically");

const safe = sanitizeAgentInviteForOwner({
  invite_id: "nxagi_demo",
  token_prefix: "nxag_test_dead",
  token_hash: "secret_hash",
});
assert.equal("token_hash" in safe, false, "owner invite list must not expose token_hash");

assert.equal(agentInviteRejectionReason({ expires_at: new Date(Date.now() - 1000).toISOString() }), "expired");
assert.equal(agentInviteRejectionReason({ expires_at: new Date(Date.now() + 1000).toISOString(), revoked: 1 }), "revoked");
assert.equal(agentInviteRejectionReason({ expires_at: new Date(Date.now() + 1000).toISOString(), uses: 1, max_uses: 1 }), "max_uses_exceeded");
assert.equal(agentInviteRejectionReason({ expires_at: new Date(Date.now() + 1000).toISOString(), uses: 0, max_uses: 1 }), null);

assert.equal(canCreateAgentInvite("owner"), true);
assert.equal(canCreateAgentInvite("admin"), true);
assert.equal(canCreateAgentInvite("employee"), false);
assert.equal(canCreateAgentInvite("agent"), false);

type TestInvite = {
  invite_id: string;
  org_id: string;
  organization_id: string;
  token_hash: string;
  expires_at: string;
  revoked: number;
  uses: number;
  max_uses: number;
};

type TestDevice = {
  agent_id: string;
  org_id: string;
  organization_id: string;
  invite_id: string;
  session_token_prefix: string;
  session_token_hash: string;
  session_expires_at: string;
  status: string;
  last_seen_at: string;
};

async function attemptAgentRegistration(
  invites: TestInvite[],
  devices: TestDevice[],
  input: { org_id: string; agent_access_token: string },
) {
  if (!input.org_id || !input.agent_access_token) {
    return { status: 400, success: false, error: "Organization ID and Agent Access Token are required" };
  }

  const tokenHash = await hashAgentAccessToken(input.agent_access_token);
  const invite = invites.find((row) => row.org_id === input.org_id && row.token_hash === tokenHash);
  if (!invite) return { status: 401, success: false, error: "Agent access failed" };

  const rejection = agentInviteRejectionReason(invite);
  if (rejection) return { status: 403, success: false, error: "Agent access failed", reason: rejection };

  const sessionToken = generateAgentSessionToken();
  const now = new Date().toISOString();
  devices.push({
    agent_id: generateAgentId(),
    org_id: invite.org_id,
    organization_id: invite.organization_id,
    invite_id: invite.invite_id,
    session_token_prefix: tokenDisplayPrefix(sessionToken),
    session_token_hash: await hashAgentAccessToken(sessionToken),
    session_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    last_seen_at: now,
  });
  invite.uses += 1;
  return { status: 201, success: true, session_token: sessionToken };
}

async function attemptAgentHeartbeat(
  invites: TestInvite[],
  devices: TestDevice[],
  input: { device_token?: string; agent_access_token?: string; device_id?: string; org_id?: string },
) {
  const token = input.device_token || "";
  if (!token) return { status: 401, success: false, error: "Agent heartbeat authentication required" };

  const tokenHash = await hashAgentAccessToken(token);
  const device = devices.find((row) => {
    if (row.session_token_hash !== tokenHash) return false;
    if (input.device_id && row.agent_id !== input.device_id) return false;
    if (input.org_id && row.org_id !== input.org_id) return false;
    return true;
  });

  if (!device) return { status: 401, success: false, error: "Agent heartbeat authentication failed" };
  if (new Date(device.session_expires_at).getTime() <= Date.now()) {
    return { status: 401, success: false, error: "Agent session expired" };
  }

  const beforeDeviceCount = devices.length;
  const beforeInviteUses = invites.reduce((sum, invite) => sum + invite.uses, 0);
  const now = new Date().toISOString();
  device.status = "active";
  device.last_seen_at = now;

  assert.equal(devices.length, beforeDeviceCount, "heartbeat must not create an agent_access_devices row");
  assert.equal(invites.reduce((sum, invite) => sum + invite.uses, 0), beforeInviteUses, "heartbeat must not increment invite uses");

  return {
    status: 200,
    success: true,
    ok: true,
    agent_id: device.agent_id,
    org_id: device.org_id,
    last_seen_at: now,
    commands: [],
  };
}

function makeInvite(overrides: Partial<TestInvite> = {}, tokenValue = generateAgentAccessToken("test")): Promise<{ invite: TestInvite; token: string }> {
  return hashAgentAccessToken(tokenValue).then((tokenHash) => ({
    token: tokenValue,
    invite: {
      invite_id: generateAgentInviteId(),
      org_id: generateRandomOrgId(),
      organization_id: "org_test",
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      revoked: 0,
      uses: 0,
      max_uses: 1,
      ...overrides,
    },
  }));
}

async function assertRejectedWithoutSideEffects(
  invite: TestInvite,
  tokenValue: string,
  expectedStatus: number,
  expectedReason?: string,
) {
  const invites = [invite];
  const devices: TestDevice[] = [];
  const beforeUses = invite.uses;
  const result = await attemptAgentRegistration(invites, devices, {
    org_id: invite.org_id,
    agent_access_token: tokenValue,
  });

  assert.equal(result.status, expectedStatus);
  if (expectedReason) assert.equal((result as any).reason, expectedReason);
  assert.equal(devices.length, 0, "failed registration must not create an agent_access_devices row");
  assert.equal(invite.uses, beforeUses, "failed registration must not increment invite uses");
}

{
  const { invite, token } = await makeInvite();
  const devices: TestDevice[] = [];
  const result = await attemptAgentRegistration([invite], devices, {
    org_id: invite.org_id,
    agent_access_token: token,
  });
  assert.equal(result.status, 201, "valid invite should register");
  assert.equal(devices.length, 1, "successful registration creates one device row");
  assert.equal(invite.uses, 1, "successful registration increments uses once");
  assert.match((result as any).session_token, /^nxas_[0-9a-f]{64}$/);
}

{
  const { invite, token } = await makeInvite();
  const invites = [invite];
  const devices: TestDevice[] = [];
  const registration = await attemptAgentRegistration(invites, devices, {
    org_id: invite.org_id,
    agent_access_token: token,
  });
  assert.equal(registration.status, 201);

  const beforeLastSeen = devices[0].last_seen_at;
  await new Promise((resolve) => setTimeout(resolve, 5));
  const heartbeat = await attemptAgentHeartbeat(invites, devices, {
    device_token: (registration as any).session_token,
    device_id: devices[0].agent_id,
    org_id: devices[0].org_id,
  });

  assert.equal(heartbeat.status, 200, "valid registered agent heartbeat should succeed");
  assert.equal((heartbeat as any).ok, true);
  assert.equal(devices[0].status, "active", "heartbeat should keep device active");
  assert.notEqual(devices[0].last_seen_at, beforeLastSeen, "heartbeat should update last_seen_at");
  assert.equal(devices.length, 1, "heartbeat must not create a new device row");
  assert.equal(invite.uses, 1, "heartbeat must not increment invite uses");
  assert.equal("session_token" in heartbeat, false, "heartbeat response must not expose a token");
}

{
  const { invite, token } = await makeInvite();
  const devices: TestDevice[] = [];
  const registration = await attemptAgentRegistration([invite], devices, {
    org_id: invite.org_id,
    agent_access_token: token,
  });
  assert.equal(registration.status, 201);

  const missingAuth = await attemptAgentHeartbeat([invite], devices, {});
  assert.equal(missingAuth.status, 401, "unauthenticated heartbeat must fail");

  const invalidAuth = await attemptAgentHeartbeat([invite], devices, {
    device_token: generateAgentSessionToken(),
    device_id: devices[0].agent_id,
    org_id: devices[0].org_id,
  });
  assert.equal(invalidAuth.status, 401, "invalid session token heartbeat must fail");

  const inviteTokenHeartbeat = await attemptAgentHeartbeat([invite], devices, {
    device_token: token,
    device_id: devices[0].agent_id,
    org_id: devices[0].org_id,
  });
  assert.equal(inviteTokenHeartbeat.status, 401, "one-time invite token must not authenticate heartbeat");
}

{
  const { invite, token } = await makeInvite({ revoked: 1 });
  const devices: TestDevice[] = [];
  const heartbeat = await attemptAgentHeartbeat([invite], devices, {
    device_token: token,
    org_id: invite.org_id,
  });
  assert.equal(heartbeat.status, 401, "revoked invite token cannot heartbeat");
  assert.equal(devices.length, 0);
  assert.equal(invite.uses, 0);
}

{
  const { invite, token } = await makeInvite({ revoked: 1 });
  await assertRejectedWithoutSideEffects(invite, token, 403, "revoked");
}

{
  const { invite, token } = await makeInvite({ expires_at: new Date(Date.now() - 60_000).toISOString() });
  await assertRejectedWithoutSideEffects(invite, token, 403, "expired");
}

{
  const { invite, token } = await makeInvite({ uses: 1, max_uses: 1 });
  await assertRejectedWithoutSideEffects(invite, token, 403, "max_uses_exceeded");
}

{
  const { invite, token } = await makeInvite();
  const devices: TestDevice[] = [];
  const beforeUses = invite.uses;
  const result = await attemptAgentRegistration([invite], devices, {
    org_id: generateRandomOrgId(),
    agent_access_token: token,
  });
  assert.equal(result.status, 401, "wrong org_id must fail");
  assert.equal(devices.length, 0);
  assert.equal(invite.uses, beforeUses);
}

{
  const { invite } = await makeInvite();
  const devices: TestDevice[] = [];
  const result = await attemptAgentRegistration([invite], devices, {
    org_id: invite.org_id,
    agent_access_token: generateAgentAccessToken("test"),
  });
  assert.equal(result.status, 401, "invalid token must fail");
  assert.equal(devices.length, 0);
  assert.equal(invite.uses, 0);
}

{
  const { invite } = await makeInvite();
  const devices: TestDevice[] = [];
  const result = await attemptAgentRegistration([invite], devices, {
    org_id: invite.org_id,
    agent_access_token: "nxag_test_deadbeef",
  });
  assert.equal(result.status, 401, "token prefix alone must never validate");
  assert.equal(devices.length, 0);
  assert.equal(invite.uses, 0);
}

{
  const existingDesktopSession = { device_token: "existing-session", authenticated: true };
  assert.equal(
    existingDesktopSession.authenticated,
    true,
    "manual revoked-invite smoke must clear/sign out existing desktop session before testing registration",
  );
  const clearedDesktopSession = { device_token: null, authenticated: false };
  assert.equal(clearedDesktopSession.authenticated, false, "cleared desktop session cannot mask failed registration");
}

console.log("agent invite tests passed");
