import { useEffect, useRef } from "react";
import { useAuth } from "@/react-app/lib/AuthContext";

/**
 * Behind-the-scenes desktop-agent enrollment.
 *
 * On successful login (admin context becomes available) and when the locally
 * installed Tauri agent is reachable, this hook:
 *
 *  1. Calls the auth service to mint a one-time enrollment token bound to the
 *     user's organization (only org-owners may do this; other roles silently
 *     get a 403 and we no-op).
 *  2. Forwards the token to the local agent (loopback Tauri command, or the
 *     installed agent gateway if Tauri is not present) which exchanges it for
 *     a device JWT + long-lived credential and stores them in the OS keychain.
 *
 * The whole flow is opportunistic: any failure is logged to the console and
 * does not surface in the UI. The user never sees an enrollment prompt.
 */
export function useAgentEnrollment() {
  const { admin, loading } = useAuth();
  const enrolledRef = useRef(false);

  useEffect(() => {
    if (loading || !admin || enrolledRef.current) return;

    // Only attempt enrollment when the local agent is actually present.
    // Tauri exposes window.__TAURI__; when running in a normal browser it
    // is undefined and we skip silently.
    const isTauri =
      typeof window !== "undefined" && Boolean((window as any).__TAURI__);
    if (!isTauri) return;

    enrolledRef.current = true;

    void (async () => {
      try {
        const tokenRes = await fetch("/api/device-enrollment/token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expires_in_hours: 1 }),
        });

        if (!tokenRes.ok) {
          // 403 for non-owners is expected; only log other failures.
          if (tokenRes.status !== 403) {
            console.warn(
              "Agent enrollment token request failed:",
              tokenRes.status
            );
          }
          return;
        }

        const { token } = (await tokenRes.json()) as { token?: string };
        if (!token) return;

        const tauri = (window as any).__TAURI__;
        const invoke = tauri?.core?.invoke ?? tauri?.invoke;
        if (typeof invoke !== "function") {
          console.warn("Tauri invoke not available; cannot enrol agent.");
          return;
        }

        await invoke("register_device", {
          orgToken: token,
          apiEndpoint: "https://agent.nexteraai.co.za",
        });
      } catch (err) {
        console.warn("Silent agent enrollment failed:", err);
      }
    })();
  }, [admin, loading]);
}
