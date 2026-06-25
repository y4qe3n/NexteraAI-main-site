import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PAYFAST_ANNUAL_PLANS,
  PAYFAST_PLANS,
  generatePayfastSignature,
  isCompletedPayfastDuplicate,
  normalizePayfastStatus,
  verifyPayfastITN,
} from "../src/worker/payfast-core.ts";

function expectedSignature(data: Record<string, string>, passphrase?: string): string {
  const orderedParams = Object.keys(data)
    .filter((key) => key !== "signature" && data[key] !== "" && data[key] !== undefined)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
    .join("&");
  const signatureSource = passphrase
    ? `${orderedParams}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : orderedParams;
  return createHash("md5").update(signatureSource).digest("hex");
}

const sampleITN: Record<string, string> = {
  merchant_id: "10004002",
  merchant_key: "q1cd2rdny4a53",
  m_payment_id: "42",
  pf_payment_id: "PF-TEST-42",
  payment_status: "COMPLETE",
  amount: "2999.00",
  item_name: "NexteraAI Basic Monthly Subscription",
  custom_str1: "basic",
};

const passphrase = "payfast sandbox";
const signature = generatePayfastSignature(sampleITN, passphrase);

assert.equal(signature, expectedSignature(sampleITN, passphrase), "signature should sort parameters and encode passphrase consistently");
assert.equal(verifyPayfastITN({ ...sampleITN, signature }, passphrase).valid, true, "valid ITN signature should verify");
assert.equal(verifyPayfastITN({ ...sampleITN, signature: "wrong" }, passphrase).valid, false, "wrong ITN signature should be rejected");
assert.equal(verifyPayfastITN({ ...sampleITN, m_payment_id: "", signature }, passphrase).valid, false, "missing required fields should be rejected");

assert.equal(isCompletedPayfastDuplicate({ status: "completed", pf_payment_id: "PF-TEST-42" }, "PF-TEST-42"), true, "duplicate completed ITN should be detected");
assert.equal(isCompletedPayfastDuplicate({ status: "pending", pf_payment_id: "PF-TEST-42" }, "PF-TEST-42"), false, "pending payments should not be duplicate-complete");

assert.equal(normalizePayfastStatus("COMPLETE"), "completed", "COMPLETE should map to completed");
assert.equal(normalizePayfastStatus("FAILED"), "failed", "FAILED should map to failed");
assert.equal(normalizePayfastStatus("CANCELLED"), "cancelled", "CANCELLED should map to cancelled");

assert.equal(PAYFAST_PLANS.basic.amount, 2999, "Basic monthly amount should be R2,999");
assert.equal(PAYFAST_PLANS.pro.amount, 3999, "Pro monthly amount should be R3,999");
assert.equal(PAYFAST_PLANS.enterprise.amount, 5999, "Max monthly amount should be R5,999");
assert.equal(PAYFAST_PLANS.max.amount, 5999, "Max alias should be R5,999");
assert.equal(PAYFAST_ANNUAL_PLANS.basic.amount, 32388, "Basic annual amount should be configured");

const workerIndex = readFileSync(resolve("src/worker/index.ts"), "utf8");

assert.match(workerIndex, /isCompletedPayfastDuplicate\(payment, pfPaymentId\)[\s\S]*duplicate: true/, "webhook should short-circuit duplicate completed ITNs");
assert.match(workerIndex, /isCompletedPayfastDuplicate\(existingPayment, pfPaymentId\)[\s\S]*duplicate: true/, "notify should short-circuit duplicate completed ITNs");
assert.doesNotMatch(workerIndex, /const amountFromBody/, "client-supplied amount override should not be used");
assert.doesNotMatch(workerIndex, /SELECT \* FROM payments WHERE organization_id/, "customer payments endpoint should not expose raw payment columns");
assert.match(workerIndex, /SELECT id, gateway, amount, currency, status, plan, created_at, updated_at/, "customer payments endpoint should return safe payment columns");
assert.doesNotMatch(workerIndex, /console\.log\("PayFast ITN received/, "ITN route should not log raw provider payloads");

console.log("PayFast sandbox readiness checks passed.");
