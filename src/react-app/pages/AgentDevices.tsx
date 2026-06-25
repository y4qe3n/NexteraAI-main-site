import { useEffect, useState } from "react";

type AgentInvite = {
  invite_id: string;
  org_id: string;
  token_prefix: string;
  expires_at: string;
  max_uses: number;
  uses: number;
  revoked: boolean;
  created_at: string;
};

type AgentDevice = {
  agent_id: string;
  device_name?: string;
  status?: string;
  last_seen_at?: string;
  agent_version?: string;
  app_version?: string;
};

export function AgentDevicesPage() {
  const [invites, setInvites] = useState<AgentInvite[]>([]);
  const [devices, setDevices] = useState<AgentDevice[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadAgentAccess() {
    setError(null);
    const cacheBust = Date.now();
    const [inviteRes, deviceRes] = await Promise.all([
      fetch(`/api/owner/agent-invites?t=${cacheBust}`, { credentials: "include", cache: "no-store" }),
      fetch(`/api/owner/agent-devices?t=${cacheBust}`, { credentials: "include", cache: "no-store" }),
    ]);

    if (!inviteRes.ok) {
      const data = await inviteRes.json().catch(() => ({}));
      throw new Error(data.error || "Unable to load agent invites");
    }
    if (!deviceRes.ok) {
      const data = await deviceRes.json().catch(() => ({}));
      throw new Error(data.error || "Unable to load agent devices");
    }

    const inviteData = await inviteRes.json();
    const deviceData = await deviceRes.json();
    setInvites(inviteData.invites || []);
    setDevices(deviceData.devices || []);
  }

  useEffect(() => {
    loadAgentAccess().catch((err) => setError(err instanceof Error ? err.message : "Unable to load agent access"));
  }, []);

  async function createInvite() {
    setLoading(true);
    setToken(null);
    setError(null);
    try {
      const res = await fetch("/api/owner/agent-invites", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ max_uses: 1, expires_hours: 72 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to create agent invite");
      setToken(data.agent_access_token);
      await loadAgentAccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create agent invite");
    } finally {
      setLoading(false);
    }
  }

  async function revokeInvite(inviteId: string) {
    setError(null);
    const res = await fetch(`/api/owner/agent-invites/${encodeURIComponent(inviteId)}/revoke`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Unable to revoke invite");
      return;
    }
    await loadAgentAccess();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Agents & Devices</h1>
        <p className="mt-2 text-sm text-[#A89CC8]">
          Generate one-time desktop agent access from your NexteraAI owner dashboard.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-[#2A2144] bg-[#100D1C] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-white">Agent access</h2>
            <p className="text-sm text-[#A89CC8]">
              Plaintext tokens are shown once. Store only the Organization ID and token in the desktop agent.
            </p>
          </div>
          <button
            onClick={createInvite}
            disabled={loading}
            className="rounded-md bg-[#7C5CFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Generate invite"}
          </button>
        </div>

        {token && (
          <div className="mt-4 rounded-md border border-amber-400/30 bg-amber-950/20 p-4">
            <p className="text-sm font-medium text-amber-100">Copy this token now. It will not be shown again.</p>
            <code className="mt-2 block break-all rounded bg-black/40 p-3 text-xs text-amber-50">{token}</code>
          </div>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#A89CC8]">
              <tr>
                <th className="py-2 pr-4">Organization ID</th>
                <th className="py-2 pr-4">Token prefix</th>
                <th className="py-2 pr-4">Uses</th>
                <th className="py-2 pr-4">Expires</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="text-[#E0D4FF]">
              {invites.map((invite) => (
                <tr key={invite.invite_id} className="border-t border-[#2A2144]">
                  <td className="py-3 pr-4 font-mono text-xs">{invite.org_id}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{invite.token_prefix}</td>
                  <td className="py-3 pr-4">{invite.uses}/{invite.max_uses}</td>
                  <td className="py-3 pr-4">{new Date(invite.expires_at).toLocaleString()}</td>
                  <td className="py-3 pr-4">{invite.revoked ? "revoked" : "active"}</td>
                  <td className="py-3 pr-4">
                    {!invite.revoked && (
                      <button onClick={() => revokeInvite(invite.invite_id)} className="text-xs text-[#CDBEFF]">
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {invites.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#A89CC8]">No agent invites yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-[#2A2144] bg-[#100D1C] p-5">
        <h2 className="text-lg font-medium text-white">Registered devices</h2>
        <div className="mt-4 grid gap-3">
          {devices.map((device) => (
            <div key={device.agent_id} className="rounded-md border border-[#2A2144] p-4">
              <p className="font-medium text-white">{device.device_name || "NexteraAI Desktop Agent"}</p>
              <p className="mt-1 text-xs text-[#A89CC8]">{device.agent_id}</p>
              <p className="mt-2 text-sm text-[#CDBEFF]">
                {device.status || "active"} - Last seen {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : "pending"}
              </p>
            </div>
          ))}
          {devices.length === 0 && <p className="text-sm text-[#A89CC8]">No desktop agents have registered yet.</p>}
        </div>
      </section>
    </div>
  );
}
