export const KEY_CONTEXTS = [
  {
    id: "iscx-ssh",
    title: "ISCX IDS sample – SSH/POP/HTTP flows",
    text: `Traffic snapshot from the ISCX 2012 dataset. Typical rows show SSH connections between internal hosts (192.168.x.x) and internal servers on port 22, POP traffic (port 110), DNS lookups, and HTTP requests to both domestic and international IPs. Labels in the CSV show these flows as Normal, so they are ideal baselines when classifying suspicious patterns.`,
    tags: ["traffic", "baseline", "ssh", "http", "normal"],
  },
  {
    id: "erebor-users",
    title: "Erebor local user inventory",
    text: `The Erebor dataset lists local user names (e.g., Bilbo, Frodo, Gandalf) with role hints. Use it to simulate user account activities or correlate logs when mapping suspected insider steps.`,
    tags: ["users", "inventory", "accounts"],
  },
  {
    id: "ala-permissions",
    title: "ALA event permissions (Microsoft Defender context)",
    text: `ALA Event permissions describe the Microsoft Defender ATP hunting event types allowed for different roles. It is useful when the AI recommends which Defender playbooks or hunting queries to run based on event IDs (AlertId, FileThreatClass).`,
    tags: ["permissions", "defender", "hunting"],
  },
  {
    id: "south-africa-popia",
    title: "POPIA guidance",
    text: `POPIA requires the preservation of personal information for legitimate purposes, data minimization, and breach notification within 72 hours. Align any phishing or compliance recommendations with these principles, emphasising security automation that captures consent logs and data subject requests.`,
    tags: ["popia", "compliance", "guidance"],
  },
];

export function findRelevantContexts(query: string) {
  const normalized = query.toLowerCase();
  const matches = KEY_CONTEXTS
    .map((context) => {
      const score = context.tags.reduce((scoreAcc, tag) => {
        return normalized.includes(tag) ? scoreAcc + 1 : scoreAcc;
      }, 0);
      return { ...context, score };
    })
    .sort((a, b) => b.score - a.score);
  if (matches[0]?.score === 0) {
    return KEY_CONTEXTS.slice(0, 2);
  }
  return matches.slice(0, 2);
}
