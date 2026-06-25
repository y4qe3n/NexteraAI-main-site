export const PAYFAST_PLANS: Record<string, { name: string; amount: number; devicesLimit: number }> = {
  basic: { name: "NexteraAI Basic Monthly Subscription", amount: 2999, devicesLimit: 10 },
  pro: { name: "NexteraAI Pro Monthly Subscription", amount: 3999, devicesLimit: 25 },
  enterprise: { name: "NexteraAI Max Monthly Subscription", amount: 5999, devicesLimit: 50 },
  max: { name: "NexteraAI Max Monthly Subscription", amount: 5999, devicesLimit: 50 },
};

export const PAYFAST_ANNUAL_PLANS: Record<string, { name: string; amount: number; devicesLimit: number }> = {
  basic: { name: "NexteraAI Basic Annual Subscription", amount: 32388, devicesLimit: 10 },
  pro: { name: "NexteraAI Pro Annual Subscription", amount: 43188, devicesLimit: 25 },
  enterprise: { name: "NexteraAI Max Annual Subscription", amount: 61188, devicesLimit: 50 },
  max: { name: "NexteraAI Max Annual Subscription", amount: 61188, devicesLimit: 50 },
};

const REQUIRED_ITN_FIELDS = ["m_payment_id", "pf_payment_id", "payment_status", "amount"] as const;

export function encodePayfastValue(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

export function generatePayfastSignature(data: Record<string, string>, passphrase?: string): string {
  const orderedParams = Object.keys(data)
    .filter((key) => key !== "signature" && data[key] !== "" && data[key] !== undefined)
    .sort()
    .map((key) => `${key}=${encodePayfastValue(data[key])}`)
    .join("&");
  const sigString = passphrase
    ? `${orderedParams}&passphrase=${encodePayfastValue(passphrase)}`
    : orderedParams;
  return md5(sigString);
}

export function verifyPayfastITN(
  body: Record<string, string>,
  passphrase?: string
): { valid: boolean; data?: Record<string, string>; error?: string } {
  const missing = REQUIRED_ITN_FIELDS.filter((field) => !body[field]);
  if (missing.length > 0) {
    return { valid: false, error: `Missing required field: ${missing[0]}` };
  }

  const receivedSig = body.signature;
  if (!receivedSig) {
    return { valid: false, error: "Missing signature" };
  }

  const data = { ...body };
  delete data.signature;
  const expectedSig = generatePayfastSignature(data, passphrase);

  if (receivedSig !== expectedSig) {
    return { valid: false, error: "Signature mismatch" };
  }

  return { valid: true, data };
}

export function normalizePayfastPlan(plan: string | undefined): "basic" | "pro" | "enterprise" {
  const normalized = String(plan || "basic").toLowerCase();
  if (normalized === "max" || normalized === "enterprise") return "enterprise";
  if (normalized === "pro") return "pro";
  return "basic";
}

export function getPayfastPlanData(plan: string, billingPeriod: string) {
  const normalized = normalizePayfastPlan(plan);
  return billingPeriod === "annual" ? PAYFAST_ANNUAL_PLANS[normalized] : PAYFAST_PLANS[normalized];
}

export function normalizePayfastStatus(status: string | undefined): string {
  switch (String(status || "").toUpperCase()) {
    case "COMPLETE":
      return "completed";
    case "FAILED":
      return "failed";
    case "CANCELLED":
    case "CANCELED":
      return "cancelled";
    case "PENDING":
      return "pending";
    default:
      return String(status || "unknown").toLowerCase();
  }
}

export function isCompletedPayfastDuplicate(payment: { status?: string | null; pf_payment_id?: string | null; gateway_payment_id?: string | null } | null, pfPaymentId: string): boolean {
  if (!payment || !pfPaymentId) return false;
  return payment.status === "completed" && (payment.pf_payment_id === pfPaymentId || payment.gateway_payment_id === pfPaymentId);
}

// Simple MD5 implementation for PayFast signature.
function md5(input: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const words: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    words.push(
      (data[i] || 0) | ((data[i + 1] || 0) << 8) | ((data[i + 2] || 0) << 16) | ((data[i + 3] || 0) << 24)
    );
  }
  const bitLen = data.length * 8;
  words[data.length >> 2] |= 0x80 << ((data.length % 4) * 8);
  words[(((data.length + 8) >>> 6) << 4) + 14] = bitLen;
  const S = (s: number, v: number) => (v << s) | (v >>> (32 - s));
  for (let i = 0; i < words.length; i += 16) {
    let aa = a, bb = b, cc = c, dd = d;
    const w = words.slice(i, i + 16);
    while (w.length < 16) w.push(0);
    const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
    const G = (x: number, y: number, z: number) => (x & z) | (y & ~z);
    const H = (x: number, y: number, z: number) => x ^ y ^ z;
    const I = (x: number, y: number, z: number) => y ^ (x | ~z);
    const T = [
      0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,
      0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,
      0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,
      0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,
      0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,
      0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,
      0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,
      0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391
    ];
    const SH = [
      7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
      5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
      4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
      6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21
    ];
    for (let j = 0; j < 64; j++) {
      let f: number, g: number;
      if (j < 16) { f = F(bb, cc, dd); g = j; }
      else if (j < 32) { f = G(bb, cc, dd); g = (5 * j + 1) % 16; }
      else if (j < 48) { f = H(bb, cc, dd); g = (3 * j + 5) % 16; }
      else { f = I(bb, cc, dd); g = (7 * j) % 16; }
      const temp = dd;
      dd = cc;
      cc = bb;
      bb = (bb + S(SH[j], (aa + f + T[j] + (w[g] || 0)) >>> 0)) >>> 0;
      aa = temp;
    }
    a = (a + aa) >>> 0; b = (b + bb) >>> 0; c = (c + cc) >>> 0; d = (d + dd) >>> 0;
  }
  const hex = (n: number) => {
    const s = [];
    for (let i = 0; i < 4; i++) s.push(((n >> (i * 8)) & 0xff).toString(16).padStart(2, "0"));
    return s.join("");
  };
  return hex(a) + hex(b) + hex(c) + hex(d);
}
