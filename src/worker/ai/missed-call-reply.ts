import type { MissedCallReplyInput, MissedCallReplyResult } from "./types";

// Template categories based on context
const TEMPLATES = {
  firstContact: [
    "Hi! Sorry we missed your call at {time}. This is {business}. How can we help you today?",
    "Hello! We noticed your call to {business} at {time}. We're available now — reply here or we'll call you back shortly.",
    "Thanks for calling {business}! We missed you at {time}. Drop us a message and we'll get right back to you.",
  ],
  returningCaller: [
    "Hi again! Sorry we missed your call at {time}. We're following up from our last chat — how can we help?",
    "Welcome back! We missed your call to {business} at {time}. Is this about your previous enquiry?",
    "Hey! {business} here — sorry we missed you at {time}. Ready to pick up where we left off.",
  ],
  afterHours: [
    "Hi! {business} is currently closed but we got your call at {time}. We'll get back to you first thing tomorrow morning.",
    "Thanks for calling {business}! We're closed for the day but saw your call at {time}. We'll reach out tomorrow — or reply here and we'll respond ASAP.",
    "Hello! We missed your call at {time}. {business} opens at 8 AM — we'll call you back then. Reply URGENT if you need immediate help.",
  ],
  frequentCaller: [
    "Hi! Missed your call at {time}. We value your continued contact with {business}. What can we do for you?",
    "Hey! {business} here, sorry we missed you again at {time}. Let us know the best time to call back.",
    "Thanks for your patience! We missed your call at {time}. A team member will call you within 30 minutes.",
  ],
};

function isAfterHours(callTime: string): boolean {
  try {
    const d = new Date(callTime);
    const hour = (d.getUTCHours() + 2) % 24; // SAST
    return hour < 8 || hour >= 18;
  } catch {
    return false;
  }
}

function formatTime(callTime: string): string {
  try {
    const d = new Date(callTime);
    return d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "earlier today";
  }
}

function selectTemplateCategory(input: MissedCallReplyInput): string[] {
  const interactions = input.recentInteractions || [];

  if (isAfterHours(input.callTime)) {
    return TEMPLATES.afterHours;
  }
  if (interactions.length >= 3) {
    return TEMPLATES.frequentCaller;
  }
  if (interactions.length > 0) {
    return TEMPLATES.returningCaller;
  }
  return TEMPLATES.firstContact;
}

function fillTemplate(template: string, input: MissedCallReplyInput): string {
  const time = formatTime(input.callTime);
  return template
    .replace(/\{time\}/g, time)
    .replace(/\{business\}/g, input.businessName || "our team");
}

export function generateMissedCallReplies(input: MissedCallReplyInput): MissedCallReplyResult {
  const templates = selectTemplateCategory(input);
  const suggestedReplies = templates.map((t) => fillTemplate(t, input));

  const interactions = input.recentInteractions || [];
  const isAfter = isAfterHours(input.callTime);
  const category = isAfter
    ? "after-hours"
    : interactions.length >= 3
      ? "frequent-caller"
      : interactions.length > 0
        ? "returning-caller"
        : "first-contact";

  return {
    module: "missed_call_reply",
    severity: "info",
    riskScore: 0,
    isThreat: false,
    title: `Smart reply generated for missed call from ${input.callerNumber}`,
    description: `Generated ${suggestedReplies.length} reply options (${category} template). Business: ${input.businessName}`,
    action: `Send one of the suggested replies to ${input.callerNumber}`,
    sourceType: "missed_call",
    sourceId: input.callerNumber,
    rawInput: JSON.stringify(input),
    rawOutput: JSON.stringify({ category, suggestedReplies }),
    suggestedReplies,
  };
}
