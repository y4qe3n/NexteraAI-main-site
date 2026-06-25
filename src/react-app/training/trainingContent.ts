import type { TrainingModule } from "./trainingTypes";

const now = "2026-06-25T00:00:00.000Z";

export const trainingModules: TrainingModule[] = [
  {
    id: "mod_phishing_basics",
    slug: "phishing-basics",
    title: "Phishing Basics",
    description: "Help staff spot suspicious emails, links, OTP requests, and urgent payment changes before anyone clicks.",
    category: "Phishing",
    estimatedMinutes: 24,
    difficulty: "Basic",
    recommendedFor: ["All staff", "Finance", "Reception", "Managers"],
    createdAt: now,
    updatedAt: now,
    lessons: [
      {
        id: "phishing-intro",
        title: "Pause before clicking",
        order: 1,
        contentBlocks: [
          {
            heading: "Intro",
            body: "Phishing is when someone pretends to be a trusted person or company to trick staff into clicking a link, opening a file, approving a payment, or sharing information.",
          },
          {
            heading: "Why this matters",
            body: "South African small businesses process invoices, supplier changes, courier messages, tax notices, and customer data every day. Attackers use busy moments, month-end pressure, and familiar brands to make staff act quickly.",
          },
          {
            heading: "Real-world example",
            body: "A finance assistant receives a message that appears to be from a regular supplier asking for payment to a new bank account. The sender address is one letter different from the real supplier domain.",
          },
        ],
        checklistItems: [
          "Pause when a message creates urgency or fear.",
          "Check the sender address and domain carefully.",
          "Confirm bank detail changes through a known phone number or approved process.",
          "Report suspicious messages to your manager or IT contact.",
        ],
      },
      {
        id: "phishing-sa-examples",
        title: "Common South African examples",
        order: 2,
        contentBlocks: [
          {
            heading: "Fake tax and refund messages",
            body: "A message may claim to be from SARS and ask you to click for a refund, settlement, or urgent case update. Treat unexpected tax links with care and use official channels instead.",
          },
          {
            heading: "Parcel and bank scams",
            body: "Attackers may impersonate courier services, Takealot-style parcel notices, banks, or mobile providers. A request for an OTP, card detail, password, or login from a message is a serious warning sign.",
          },
          {
            heading: "Supplier invoice fraud",
            body: "Fake invoices and changed banking details are common business risks. Never rely on email alone for payment-detail changes, even when the logo and signature look familiar.",
          },
        ],
        checklistItems: [
          "Do not share OTPs, passwords, card details, or recovery codes.",
          "Do not sign in from a link in an unexpected message.",
          "Verify suspicious SARS or bank messages through official channels.",
          "Use an approved internal reporting process for suspicious payment requests.",
        ],
      },
      {
        id: "phishing-warning-signs",
        title: "Warning signs",
        order: 3,
        contentBlocks: [
          {
            heading: "Warning signs",
            body: "Look for urgent or threatening language, mismatched domains, public email accounts pretending to be suppliers, shortened links, unexpected attachments, generic greetings, poor grammar, and requests for sensitive information.",
          },
          {
            heading: "What staff should do",
            body: "Hover over links where possible, verify with a trusted contact, and report. Do not forward suspicious attachments to colleagues. If in doubt, preserve the message and ask for help.",
          },
          {
            heading: "Safe reporting",
            body: "Your business may have its own reporting mailbox or manager escalation path. For public impersonation examples, official channels such as bank fraud lines or SARS phishing reporting can also help.",
          },
        ],
        checklistItems: [
          "Hover over links before opening them.",
          "Do not enter passwords from an email or SMS link.",
          "Do not approve payment changes from email alone.",
          "Keep the suspicious message available for review.",
        ],
      },
    ],
    quiz: [
      {
        id: "phish-q1",
        question: "What is the safest first step when an email asks for urgent payment to a new bank account?",
        options: [
          { id: "a", label: "Pay immediately because it says urgent" },
          { id: "b", label: "Confirm through a known phone number or approved process" },
          { id: "c", label: "Forward the attachment to the whole team" },
        ],
        correctOptionId: "b",
        explanation: "Bank detail changes should be verified through a trusted channel, not by replying to the suspicious email.",
      },
      {
        id: "phish-q2",
        question: "Which detail is a phishing warning sign?",
        options: [
          { id: "a", label: "A domain with one letter changed" },
          { id: "b", label: "A message from your normal internal helpdesk address" },
          { id: "c", label: "A calendar reminder you created" },
        ],
        correctOptionId: "a",
        explanation: "Attackers often register lookalike domains that are easy to miss when staff are busy.",
      },
      {
        id: "phish-q3",
        question: "What should staff do before opening a suspicious link?",
        options: [
          { id: "a", label: "Hover or inspect the link and verify the source" },
          { id: "b", label: "Click quickly to see what happens" },
          { id: "c", label: "Forward the link to more colleagues" },
        ],
        correctOptionId: "a",
        explanation: "Checking the destination and verifying the sender helps prevent fake-login and payment scams.",
      },
      {
        id: "phish-q4",
        question: "Which request should be treated as high risk?",
        options: [
          { id: "a", label: "A bank or tax message asking for an OTP by SMS or email" },
          { id: "b", label: "A manager asking you to join a scheduled meeting" },
          { id: "c", label: "A supplier sending a previously agreed invoice from the normal address" },
        ],
        correctOptionId: "a",
        explanation: "Legitimate services should not ask staff to share OTPs, passwords, or recovery codes through messages.",
      },
    ],
  },
  {
    id: "mod_password_safety",
    slug: "password-safety",
    title: "Password Safety",
    description: "Build safer password habits with passphrases, password managers, MFA, and practical account protection steps.",
    category: "Passwords",
    estimatedMinutes: 22,
    difficulty: "Basic",
    recommendedFor: ["All staff", "Admin users", "Remote teams"],
    createdAt: now,
    updatedAt: now,
    lessons: [
      {
        id: "passwords-intro",
        title: "Why passwords still matter",
        order: 1,
        contentBlocks: [
          {
            heading: "Intro",
            body: "Password safety is about using unique, long passwords and protecting important accounts with multi-factor authentication where available.",
          },
          {
            heading: "Why this matters",
            body: "If one reused password is stolen, attackers may try it on email, banking, accounting, payroll, supplier portals, and social media accounts.",
          },
          {
            heading: "Real-world example",
            body: "A staff member reuses a password from an old shopping account. When that service is breached, the same password is tried against the business email account.",
          },
        ],
        checklistItems: [
          "Use a unique password for each work account.",
          "Do not reuse personal passwords for business accounts.",
          "Enable MFA where available.",
          "Never share passwords over WhatsApp, email, or chat.",
        ],
      },
      {
        id: "passwords-modern-rules",
        title: "Modern password rules",
        order: 2,
        contentBlocks: [
          {
            heading: "Length beats tricks",
            body: "Long passphrases are easier to remember and harder to guess than short passwords with predictable symbol swaps. Aim for at least 12 to 16 characters where the system allows it.",
          },
          {
            heading: "Unique every time",
            body: "The safest business habit is one unique password per account. A strong password used everywhere becomes weak the moment one service is breached.",
          },
          {
            heading: "Change when there is a reason",
            body: "Routine forced changes can lead to weaker patterns. Change passwords immediately when there is a breach, suspicious login, staff exit, or shared-password exposure.",
          },
        ],
        checklistItems: [
          "Use long passphrases instead of short complex patterns.",
          "Avoid business name, birth date, season, and year patterns.",
          "Change passwords after a breach or suspicious login.",
          "Report odd login alerts quickly.",
        ],
      },
      {
        id: "passwords-manager-mfa",
        title: "Password managers and MFA",
        order: 3,
        contentBlocks: [
          {
            heading: "Password managers",
            body: "An approved password manager can generate and store unique passwords, reduce reuse, and help staff avoid unsafe spreadsheets or shared notes.",
          },
          {
            heading: "MFA",
            body: "Multi-factor authentication adds a second proof when signing in. Use it for email, banking, cloud storage, payroll, accounting, and admin accounts wherever possible.",
          },
          {
            heading: "Business actions",
            body: "Managers should set password policies in business tools, review admin access, remove old accounts, and train staff to report suspicious sign-in prompts.",
          },
        ],
        checklistItems: [
          "Use an approved password manager if your business has one.",
          "Protect the password manager itself with MFA.",
          "Review shared and admin accounts regularly.",
          "Remove access when a staff member leaves.",
        ],
      },
    ],
    quiz: [
      {
        id: "pass-q1",
        question: "What is the safest password habit?",
        options: [
          { id: "a", label: "Use one strong password everywhere" },
          { id: "b", label: "Use unique passwords and MFA where available" },
          { id: "c", label: "Save passwords in a shared spreadsheet" },
        ],
        correctOptionId: "b",
        explanation: "Unique passwords reduce damage if one account is compromised, and MFA adds another layer of protection.",
      },
      {
        id: "pass-q2",
        question: "What should staff consider first when creating a safer password?",
        options: [
          { id: "a", label: "Length and uniqueness" },
          { id: "b", label: "Using the company name with the current year" },
          { id: "c", label: "Reusing a familiar password with one extra symbol" },
        ],
        correctOptionId: "a",
        explanation: "Long, unique passphrases are stronger than short predictable passwords.",
      },
      {
        id: "pass-q3",
        question: "When should a password be changed immediately?",
        options: [
          { id: "a", label: "When there is a breach, suspicious login, or staff access change" },
          { id: "b", label: "Only on the first Monday of each month" },
          { id: "c", label: "Never, once it is memorised" },
        ],
        correctOptionId: "a",
        explanation: "A real risk event is a clear reason to change credentials and review account access.",
      },
      {
        id: "pass-q4",
        question: "Where should staff avoid sharing passwords?",
        options: [
          { id: "a", label: "Email and chat messages" },
          { id: "b", label: "An approved password manager" },
          { id: "c", label: "A protected MFA prompt" },
        ],
        correctOptionId: "a",
        explanation: "Passwords should not be sent through normal messaging channels.",
      },
    ],
  },
  {
    id: "mod_popia_awareness",
    slug: "popia-awareness",
    title: "POPIA Awareness",
    description: "Understand personal information handling basics and when to escalate privacy concerns.",
    category: "POPIA",
    estimatedMinutes: 26,
    difficulty: "Basic",
    recommendedFor: ["All staff", "Managers", "Customer-facing teams"],
    createdAt: now,
    updatedAt: now,
    lessons: [
      {
        id: "popia-intro",
        title: "Personal information needs care",
        order: 1,
        contentBlocks: [
          {
            heading: "Intro",
            body: "POPIA is South Africa's Protection of Personal Information Act. Staff awareness supports safer handling of customer, supplier, and employee information.",
          },
          {
            heading: "What counts as personal information",
            body: "Personal information can include names, phone numbers, email addresses, ID numbers, addresses, payment details, staff information, and photos when they identify a person.",
          },
          {
            heading: "Why this matters",
            body: "A small mistake, such as emailing customer information to the wrong address, can create privacy, trust, operational, and legal obligations for the business.",
          },
        ],
        checklistItems: [
          "Only access personal information needed for your role.",
          "Check recipients before sending personal information.",
          "Escalate suspected privacy incidents quickly.",
          "Do not treat dashboard training as legal advice.",
        ],
      },
      {
        id: "popia-eight-conditions",
        title: "The eight POPIA conditions",
        order: 2,
        contentBlocks: [
          {
            heading: "The conditions",
            body: "POPIA is built around eight conditions: Accountability, Processing Limitation, Purpose Specification, Further Processing Limitation, Information Quality, Openness, Security Safeguards, and Data Subject Participation.",
          },
          {
            heading: "What this means for staff",
            body: "In daily work, this means collecting only what is needed, using information for a clear purpose, keeping it accurate, protecting it, and helping people understand how their information is handled.",
          },
          {
            heading: "Security safeguards",
            body: "Basic safeguards include strong account access, MFA where possible, updates, backups, careful sharing, and quick reporting when something goes wrong.",
          },
        ],
        checklistItems: [
          "Collect only the information needed for the task.",
          "Use customer or staff information only for the business purpose given.",
          "Keep records accurate and up to date.",
          "Protect information from unnecessary access.",
        ],
      },
      {
        id: "popia-first-steps",
        title: "Practical first steps",
        order: 3,
        contentBlocks: [
          {
            heading: "First steps",
            body: "A business should know who its Information Officer is, where personal information is stored, what notices customers see, and how suspected incidents are escalated.",
          },
          {
            heading: "Common mistakes",
            body: "Common small-business mistakes include collecting too much data, keeping old information too long, having no privacy notice, having no breach plan, and forgetting that staff information also needs care.",
          },
          {
            heading: "Real-world example",
            body: "An employee sends a spreadsheet with customer ID numbers to the wrong supplier. The team should escalate quickly instead of trying to hide the mistake.",
          },
        ],
        checklistItems: [
          "Know who receives privacy or POPIA questions in your business.",
          "Keep a simple breach-escalation process.",
          "Review old customer and staff data periodically.",
          "Ask before sending personal information outside the business.",
        ],
      },
    ],
    quiz: [
      {
        id: "popia-q1",
        question: "What should staff do after sending personal information to the wrong recipient?",
        options: [
          { id: "a", label: "Ignore it if the file was small" },
          { id: "b", label: "Escalate through the business process quickly" },
          { id: "c", label: "Post about it publicly" },
        ],
        correctOptionId: "b",
        explanation: "Fast escalation helps the business assess and respond to privacy risk.",
      },
      {
        id: "popia-q2",
        question: "Which law is this awareness module focused on?",
        options: [
          { id: "a", label: "POPIA" },
          { id: "b", label: "A foreign privacy law only" },
          { id: "c", label: "An internal password policy only" },
        ],
        correctOptionId: "a",
        explanation: "This module focuses on South Africa's Protection of Personal Information Act.",
      },
      {
        id: "popia-q3",
        question: "How many conditions are commonly used to explain POPIA processing responsibilities?",
        options: [
          { id: "a", label: "Two" },
          { id: "b", label: "Eight" },
          { id: "c", label: "Twenty-four" },
        ],
        correctOptionId: "b",
        explanation: "POPIA is commonly explained through eight conditions for lawful processing.",
      },
      {
        id: "popia-q4",
        question: "Does awareness training alone prove POPIA compliance?",
        options: [
          { id: "a", label: "No, it supports readiness but does not replace formal review" },
          { id: "b", label: "Yes, training alone is enough" },
          { id: "c", label: "Only if everyone scores 100%" },
        ],
        correctOptionId: "a",
        explanation: "Training supports awareness; it does not replace legal advice, formal review, or incident obligations.",
      },
    ],
  },
  {
    id: "mod_suspicious_attachments",
    slug: "suspicious-attachments",
    title: "Suspicious Attachments",
    description: "Teach staff when to avoid opening documents, archives, and unexpected invoice files.",
    category: "Email",
    estimatedMinutes: 18,
    difficulty: "Basic",
    recommendedFor: ["Finance", "Reception", "Operations", "All staff"],
    createdAt: now,
    updatedAt: now,
    lessons: [
      {
        id: "attachments-intro",
        title: "Do not open every invoice",
        order: 1,
        contentBlocks: [
          {
            heading: "Intro",
            body: "Attackers hide risk in attachments that look like invoices, delivery notes, tender documents, CVs, parcel notices, or supplier statements.",
          },
          {
            heading: "Why this matters",
            body: "Small teams often open documents quickly to keep work moving. A fake invoice or attachment can lead to stolen credentials, a compromised mailbox, or a wider incident.",
          },
          {
            heading: "Real-world example",
            body: "A message arrives with an attachment named Invoice.pdf.exe. It looks like an invoice at a glance, but the extra extension is a warning sign.",
          },
        ],
        checklistItems: [
          "Slow down when a file is unexpected.",
          "Look for double extensions like .pdf.exe.",
          "Do not enable macros from unknown documents.",
          "Verify unusual invoice or tender files through a trusted channel.",
        ],
      },
      {
        id: "attachments-warning-signs",
        title: "Attachment warning signs",
        order: 2,
        contentBlocks: [
          {
            heading: "Warning signs",
            body: "Be careful with unexpected ZIP files, password-protected archives, files that ask you to enable editing or macros, and messages that pressure you to open a file urgently.",
          },
          {
            heading: "What staff should do",
            body: "Confirm the sender using a trusted channel. Do not forward suspicious attachments to colleagues. Use the approved reporting process and keep the original message available for review.",
          },
          {
            heading: "Safe handling",
            body: "If a document looks suspicious, do not try to test it yourself. Ask the manager or IT contact to review it through the business process.",
          },
        ],
        checklistItems: [
          "Do not open unexpected ZIP or password-protected files.",
          "Do not bypass warnings because a message sounds urgent.",
          "Do not forward suspicious attachments to the team.",
          "Report the message with context.",
        ],
      },
    ],
    quiz: [
      {
        id: "attach-q1",
        question: "What should staff do with an unexpected password-protected ZIP file?",
        options: [
          { id: "a", label: "Open it immediately" },
          { id: "b", label: "Verify the sender through a trusted channel first" },
          { id: "c", label: "Forward it to colleagues" },
        ],
        correctOptionId: "b",
        explanation: "Unexpected protected archives are a common way to pressure staff and avoid normal checks.",
      },
      {
        id: "attach-q2",
        question: "Which attachment name is most suspicious?",
        options: [
          { id: "a", label: "Invoice.pdf.exe from an unexpected sender" },
          { id: "b", label: "Agenda.pdf from a meeting you requested" },
          { id: "c", label: "Approved price list from the normal supplier address" },
        ],
        correctOptionId: "a",
        explanation: "Double extensions can hide executable files behind familiar document names.",
      },
      {
        id: "attach-q3",
        question: "What should staff avoid doing with a suspicious attachment?",
        options: [
          { id: "a", label: "Forwarding it to colleagues to ask what they think" },
          { id: "b", label: "Reporting it through the approved process" },
          { id: "c", label: "Keeping the original message available for review" },
        ],
        correctOptionId: "a",
        explanation: "Forwarding suspicious files can spread risk. Preserve and report instead.",
      },
    ],
  },
  {
    id: "mod_alert_response",
    slug: "alert-response",
    title: "What To Do When You Receive an Alert",
    description: "Give staff a calm checklist for NexteraAI warnings, suspicious activity, and escalation.",
    category: "Alerts",
    estimatedMinutes: 22,
    difficulty: "Basic",
    recommendedFor: ["All staff", "Managers", "Device users"],
    createdAt: now,
    updatedAt: now,
    lessons: [
      {
        id: "alerts-foundations",
        title: "Cybersecurity basics for alerts",
        order: 1,
        contentBlocks: [
          {
            heading: "Intro",
            body: "Cybersecurity protects the confidentiality, integrity, and availability of business information and systems. These three ideas help staff understand why alerts matter.",
          },
          {
            heading: "Confidentiality",
            body: "Confidentiality means keeping information away from people who should not access it, such as customer ID numbers, employee records, passwords, and payment information.",
          },
          {
            heading: "Integrity and availability",
            body: "Integrity means information stays accurate and trustworthy. Availability means staff can access the systems and data they need to keep the business running.",
          },
        ],
        checklistItems: [
          "Think about what information or system might be affected.",
          "Do not ignore repeated warnings.",
          "Record the time and affected device or account.",
          "Escalate through the business process.",
        ],
      },
      {
        id: "alerts-intro",
        title: "Use alerts as a decision-support signal",
        order: 2,
        contentBlocks: [
          {
            heading: "Intro",
            body: "A NexteraAI alert is a signal that something needs attention. Staff should stay calm, preserve context, and escalate through the approved process.",
          },
          {
            heading: "Why this matters",
            body: "Rushed responses can make incidents worse. A clear checklist helps staff avoid deleting evidence, forwarding suspicious files, or ignoring warnings.",
          },
          {
            heading: "What staff should do",
            body: "Stop the risky action, take note of what happened, and contact the manager or IT contact. Use the dashboard alert as a decision-support signal, not a legal determination.",
          },
        ],
        checklistItems: [
          "Do not delete suspicious files unless instructed.",
          "Do not forward suspicious content to colleagues.",
          "Record what you clicked, downloaded, or changed.",
          "Ask for help early.",
        ],
      },
      {
        id: "alerts-business-actions",
        title: "Good habits reduce alert impact",
        order: 3,
        contentBlocks: [
          {
            heading: "Everyday protections",
            body: "The most useful first steps are still practical: enable MFA, keep devices updated, use backups, use a password manager where approved, and train staff regularly.",
          },
          {
            heading: "Small business examples",
            body: "A restaurant, salon, mechanic, or retail shop may not have a full IT team, but staff can still protect accounts, pause suspicious actions, and escalate quickly when something looks wrong.",
          },
          {
            heading: "Escalation",
            body: "Escalation is not blame. It gives the business time to protect customers, staff, systems, and records before a small issue becomes a bigger incident.",
          },
        ],
        checklistItems: [
          "Use MFA on key accounts.",
          "Keep work devices updated.",
          "Back up important business data.",
          "Practice the escalation process before an incident.",
        ],
      },
    ],
    quiz: [
      {
        id: "alert-q1",
        question: "How should staff treat a NexteraAI dashboard alert?",
        options: [
          { id: "a", label: "As a decision-support signal to investigate or escalate" },
          { id: "b", label: "As a legal determination" },
          { id: "c", label: "As proof that nothing needs action" },
        ],
        correctOptionId: "a",
        explanation: "Alerts support business decisions and escalation; they do not replace legal or incident-response obligations.",
      },
      {
        id: "alert-q2",
        question: "In the confidentiality, integrity, and availability model, what does availability mean?",
        options: [
          { id: "a", label: "People can access needed systems and data when required" },
          { id: "b", label: "Passwords are shared widely" },
          { id: "c", label: "Old customer data is kept forever" },
        ],
        correctOptionId: "a",
        explanation: "Availability means the business can keep using the systems and data it needs.",
      },
      {
        id: "alert-q3",
        question: "Which action is a strong first step for reducing account risk?",
        options: [
          { id: "a", label: "Enable MFA where available" },
          { id: "b", label: "Ignore software updates" },
          { id: "c", label: "Use the same password for every service" },
        ],
        correctOptionId: "a",
        explanation: "MFA is one of the most practical first steps for protecting important accounts.",
      },
    ],
  },
  {
    id: "mod_safe_browsing",
    slug: "safe-browsing",
    title: "Safe Browsing",
    description: "Practical habits for links, fake login pages, and downloads.",
    category: "Browsing",
    estimatedMinutes: 12,
    difficulty: "Basic",
    recommendedFor: ["All staff"],
    lessons: [],
    quiz: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mod_social_engineering",
    slug: "social-engineering",
    title: "Social Engineering",
    description: "Recognise pressure tactics in calls, WhatsApp messages, and supplier requests.",
    category: "Social Engineering",
    estimatedMinutes: 17,
    difficulty: "Intermediate",
    recommendedFor: ["Managers", "Finance", "Reception"],
    lessons: [],
    quiz: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mod_device_hygiene",
    slug: "device-hygiene",
    title: "Device Hygiene",
    description: "Keep work laptops and phones safer with updates, screen locks, and reporting habits.",
    category: "Devices",
    estimatedMinutes: 13,
    difficulty: "Basic",
    recommendedFor: ["All staff", "Remote teams"],
    lessons: [],
    quiz: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mod_ransomware_awareness",
    slug: "ransomware-awareness",
    title: "Ransomware Awareness",
    description: "Understand early warning signs and why backups, reporting, and calm escalation matter.",
    category: "Ransomware",
    estimatedMinutes: 18,
    difficulty: "Intermediate",
    recommendedFor: ["Managers", "Finance", "Operations"],
    lessons: [],
    quiz: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mod_remote_work_security",
    slug: "remote-work-security",
    title: "Remote Work Security",
    description: "Reduce risk when staff work from home, shared spaces, or client sites.",
    category: "Remote Work",
    estimatedMinutes: 15,
    difficulty: "Basic",
    recommendedFor: ["Remote teams", "Managers", "All staff"],
    lessons: [],
    quiz: [],
    createdAt: now,
    updatedAt: now,
  },
];

export function getTrainingModuleBySlug(slug: string) {
  return trainingModules.find((module) => module.slug === slug) ?? null;
}

export function calculateQuizScore(module: TrainingModule, answers: Record<string, string>) {
  if (module.quiz.length === 0) return 0;
  const correct = module.quiz.filter((question) => answers[question.id] === question.correctOptionId).length;
  return Math.round((correct / module.quiz.length) * 100);
}

export const passThreshold = 80;
