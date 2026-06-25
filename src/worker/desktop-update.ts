export type DesktopUpdateChannel = "pilot" | "internal" | "stable";

export type DesktopUpdateRequest = {
  target: string;
  arch: string;
  currentVersion: string;
  channel: string;
};

export type DesktopUpdateRelease = {
  version: string;
  notes: string;
  pub_date: string;
  channel: DesktopUpdateChannel;
  target: "windows";
  arch: "x86_64";
  url: string;
  signature: string;
};

const SUPPORTED_CHANNELS = new Set(["pilot", "internal", "stable"]);

export function normalizeDesktopUpdateRequest(input: Partial<DesktopUpdateRequest>) {
  const target = String(input.target || "").trim().toLowerCase();
  const arch = String(input.arch || "").trim().toLowerCase();
  const currentVersion = String(input.currentVersion || "").trim();
  const channel = String(input.channel || "pilot").trim().toLowerCase();

  if (target !== "windows") return { ok: false as const, status: 400, error: "Unsupported update target" };
  if (arch !== "x86_64") return { ok: false as const, status: 400, error: "Unsupported update architecture" };
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(currentVersion)) {
    return { ok: false as const, status: 400, error: "Invalid current version" };
  }
  if (!SUPPORTED_CHANNELS.has(channel)) return { ok: false as const, status: 400, error: "Unsupported update channel" };

  return {
    ok: true as const,
    value: { target, arch, currentVersion, channel: channel as DesktopUpdateChannel },
  };
}

export function compareSemver(a: string, b: string) {
  const parse = (value: string) => value.split("-")[0].split(".").map((part) => Number(part));
  const left = parse(a);
  const right = parse(b);
  for (let i = 0; i < 3; i += 1) {
    if ((left[i] || 0) > (right[i] || 0)) return 1;
    if ((left[i] || 0) < (right[i] || 0)) return -1;
  }
  return 0;
}

export function isSignedDesktopRelease(value: Partial<DesktopUpdateRelease> | null | undefined): value is DesktopUpdateRelease {
  return !!(
    value &&
    value.version &&
    value.url &&
    value.signature &&
    value.target === "windows" &&
    value.arch === "x86_64" &&
    value.url.startsWith("https://") &&
    value.signature.length >= 32
  );
}

export function selectDesktopUpdateRelease(
  request: { currentVersion: string; channel: DesktopUpdateChannel },
  releases: Partial<DesktopUpdateRelease>[],
) {
  const candidates = releases
    .filter(isSignedDesktopRelease)
    .filter((release) => release.channel === request.channel)
    .filter((release) => compareSemver(release.version, request.currentVersion) > 0)
    .sort((a, b) => compareSemver(b.version, a.version));

  return candidates[0] || null;
}

export function toTauriUpdateMetadata(release: DesktopUpdateRelease) {
  return {
    version: release.version,
    notes: release.notes,
    pub_date: release.pub_date,
    platforms: {
      "windows-x86_64": {
        signature: release.signature,
        url: release.url,
      },
    },
  };
}

