/**
 * RS256 JWT verification for tokens issued by the NexteraAI auth service.
 *
 * The auth service signs user-session JWTs with `JWT_PRIVATE_KEY`. This worker
 * verifies them with the matching `JWT_PUBLIC_KEY` (set as a wrangler secret).
 *
 * This file uses ONLY the Web Crypto API — no Node `crypto` module, no `jose`
 * dependency — so it works natively in Cloudflare Workers without any compat
 * flags.
 *
 * Source of truth for the claim shape:
 *   `g:\NexteraAI authentication service\src\worker\types.ts` -> JWTPayload
 *   `g:\NexteraAI authentication service\src\worker\auth\jwt.ts`
 */

export interface AuthServiceJWTClaims {
  user_id?: string;
  admin_id?: string;
  email: string;
  role: string;
  organization_id?: string;
  org_id?: string;
  token_type?: 'access' | 'admin';
  refresh_token_id?: string;
  iat: number;
  exp: number;
}

/** Strip PEM headers / whitespace and base64-decode to a Uint8Array. */
function pemToBinary(pem: string): Uint8Array {
  const stripped = pem.replace(
    /-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s+/g,
    ''
  );
  const binary = atob(stripped);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importPublicKey(pem: string): Promise<CryptoKey> {
  const der = pemToBinary(pem);
  return crypto.subtle.importKey(
    'spki',
    der.buffer as ArrayBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
}

function base64UrlDecodeToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(padded + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlDecodeToString(input: string): string {
  return new TextDecoder().decode(base64UrlDecodeToBytes(input));
}

/**
 * Verify an RS256 JWT against the supplied public key (PEM-encoded SPKI).
 *
 * Returns the parsed claims if:
 *   - Token has the expected three-part shape (header.payload.signature)
 *   - The header's `alg` is exactly `RS256` (defends against alg confusion)
 *   - The signature verifies against the public key
 *   - The `exp` claim is in the future
 *
 * Returns `null` for any failure. NEVER throws on bad input.
 */
export async function verifyAuthServiceJWT(
  token: string,
  publicKeyPem: string
): Promise<AuthServiceJWTClaims | null> {
  if (!token || !publicKeyPem) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;

  // Defend against alg confusion: only accept RS256
  let alg: string;
  try {
    const headerJson = JSON.parse(base64UrlDecodeToString(header));
    alg = String(headerJson?.alg ?? '');
  } catch {
    return null;
  }
  if (alg !== 'RS256') return null;

  let key: CryptoKey;
  try {
    key = await importPublicKey(publicKeyPem);
  } catch {
    return null;
  }

  const data = new TextEncoder().encode(`${header}.${payload}`);
  const sigBytes = base64UrlDecodeToBytes(signature);

  let isValid = false;
  try {
    isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      sigBytes.buffer as ArrayBuffer,
      data.buffer as ArrayBuffer
    );
  } catch {
    return null;
  }

  if (!isValid) return null;

  let claims: AuthServiceJWTClaims;
  try {
    claims = JSON.parse(base64UrlDecodeToString(payload)) as AuthServiceJWTClaims;
  } catch {
    return null;
  }

  // Check expiry
  const nowSec = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== 'number' || claims.exp < nowSec) {
    return null;
  }

  return claims;
}
