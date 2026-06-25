export const AGENT_TOKEN_PREFIX_LIVE = "nxag_live_";
export const AGENT_TOKEN_PREFIX_TEST = "nxag_test_";

export type AgentInviteStatusInput = {
  expires_at: string;
  revoked?: number | boolean | null;
  uses?: number | null;
  max_uses?: number | null;
};

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function randomHex(bytes = 16) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return bytesToHex(data);
}

export function generateRandomOrgId() {
  return `nxorg_${randomHex(16)}`;
}

export function generateAgentInviteId() {
  return `nxagi_${randomHex(16)}`;
}

export function generateAgentId() {
  return `nxagent_${randomHex(16)}`;
}

export function generateAgentAccessToken(envName = "live") {
  const prefix = envName === "test" ? AGENT_TOKEN_PREFIX_TEST : AGENT_TOKEN_PREFIX_LIVE;
  return `${prefix}${randomHex(32)}`;
}

export function generateAgentSessionToken() {
  return `nxas_${randomHex(32)}`;
}

export function tokenDisplayPrefix(token: string) {
  return token.slice(0, token.startsWith(AGENT_TOKEN_PREFIX_TEST) ? 18 : 18);
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function hashAgentAccessToken(token: string) {
  return sha256Hex(token);
}

export function canCreateAgentInvite(role?: string | null) {
  const normalized = String(role || "").toLowerCase().replace(/-/g, "_");
  return ["admin", "owner", "manager", "org_owner", "org_manager"].includes(normalized);
}

export function agentInviteRejectionReason(invite: AgentInviteStatusInput, now = Date.now()) {
  if (Number(invite.revoked || 0) === 1) return "revoked";
  if (new Date(invite.expires_at).getTime() <= now) return "expired";
  if (Number(invite.uses || 0) >= Number(invite.max_uses || 1)) return "max_uses_exceeded";
  return null;
}

export function sanitizeAgentInviteForOwner<T extends Record<string, any>>(invite: T) {
  const { token_hash: _tokenHash, ...safeInvite } = invite;
  return safeInvite;
}
