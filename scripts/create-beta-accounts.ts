/**
 * NexteraAI Controlled Beta Account Creation Script
 * 
 * Creates test accounts on the auth service for controlled beta testing.
 * Calls the same /api/public/auth/register endpoint used by real customers.
 * 
 * SECURITY:
 * - Passwords must be provided via environment variables (never hardcoded)
 * - No passwords, hashes, tokens, or secrets are printed
 * - Idempotent: skips accounts that already exist (409 response)
 * 
 * USAGE:
 *   BETA_PASSWORD_BASIC="..." BETA_PASSWORD_PRO="..." BETA_PASSWORD_MAX="..." \
 *   AUTH_SERVICE_URL="https://admin.nexteraai.co.za" \
 *   node --experimental-strip-types scripts/create-beta-accounts.ts
 * 
 * Or with a single shared password:
 *   BETA_PASSWORD="..." AUTH_SERVICE_URL="https://admin.nexteraai.co.za" \
 *   node --experimental-strip-types scripts/create-beta-accounts.ts
 */

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'https://admin.nexteraai.co.za';

interface BetaAccount {
  email: string;
  name: string;
  businessName: string;
  plan: 'basic' | 'pro' | 'enterprise';
  passwordEnvVar: string;
}

const ACCOUNTS: BetaAccount[] = [
  {
    email: 'yaqeenw2007+basic-beta@gmail.com',
    name: 'Basic Beta Tester',
    businessName: 'NexteraAI Basic Beta Test',
    plan: 'basic',
    passwordEnvVar: 'BETA_PASSWORD_BASIC',
  },
  {
    email: 'yaqeenw2007+pro-beta@gmail.com',
    name: 'Pro Beta Tester',
    businessName: 'NexteraAI Pro Beta Test',
    plan: 'pro',
    passwordEnvVar: 'BETA_PASSWORD_PRO',
  },
  {
    email: 'yaqeenw2007+max-beta@gmail.com',
    name: 'Max Beta Tester',
    businessName: 'NexteraAI Max Beta Test',
    plan: 'enterprise',
    passwordEnvVar: 'BETA_PASSWORD_MAX',
  },
];

async function createAccount(account: BetaAccount): Promise<void> {
  const password = process.env[account.passwordEnvVar] || process.env.BETA_PASSWORD;

  if (!password) {
    console.error(`  SKIP: ${account.email} — no password set (provide ${account.passwordEnvVar} or BETA_PASSWORD)`);
    return;
  }

  if (password.length < 12) {
    console.error(`  SKIP: ${account.email} — password must be at least 12 characters`);
    return;
  }

  const registerUrl = `${AUTH_URL}/api/public/auth/register`;

  try {
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: account.businessName,
        email: account.email,
        password: password,
        name: account.name,
        plan: account.plan,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const data = await response.json() as any;
      console.log(`  CREATED: ${account.email}`);
      console.log(`    Organization: ${data.organization?.name || account.businessName}`);
      console.log(`    Plan: ${account.plan}`);
      console.log(`    Role: org-owner`);
    } else if (response.status === 409) {
      console.log(`  EXISTS: ${account.email} — account already exists (skipped)`);
    } else {
      const errorData = await response.json().catch(() => ({})) as any;
      console.error(`  FAILED: ${account.email} — HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error(`  ERROR: ${account.email} — ${error.message || error}`);
  }
}

async function main() {
  console.log('NexteraAI Controlled Beta Account Creation');
  console.log('==========================================');
  console.log(`Auth service: ${AUTH_URL}`);
  console.log('');

  if (!process.env.BETA_PASSWORD && !process.env.BETA_PASSWORD_BASIC) {
    console.error('ERROR: No passwords provided.');
    console.error('Set BETA_PASSWORD (shared) or individual BETA_PASSWORD_BASIC, BETA_PASSWORD_PRO, BETA_PASSWORD_MAX env vars.');
    console.error('Passwords must be at least 12 characters.');
    process.exit(1);
  }

  for (const account of ACCOUNTS) {
    await createAccount(account);
  }

  console.log('');
  console.log('Done. Accounts are accessible via the main site login at https://www.nexteraai.co.za/login');
  console.log('No passwords, hashes, tokens, or secrets were printed.');
}

main().catch((err) => {
  console.error('Script failed:', err.message || err);
  process.exit(1);
});
