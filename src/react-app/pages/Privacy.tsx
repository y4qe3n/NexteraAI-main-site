import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Logo } from "@/react-app/components/Logo";
import { ShieldCheck, FileText, Lock, Eye, Users, Globe, Database, Bell, Cookie, Mail } from "lucide-react";

const sections = [
  {
    id: "definitions",
    title: "1. Definitions",
    icon: <FileText className="w-5 h-5 text-primary" />,
    content: null,
    bullets: [
      { term: "Personal Information", def: "Has the meaning given in POPIA: information relating to an identifiable, living natural person or (where applicable) an identifiable existing juristic person, including but not limited to name, email, telephone numbers, location, financial information, online identifiers, etc." },
      { term: "Data Subject", def: "The person or entity to whom the Personal Information relates." },
      { term: "Responsible Party", def: "The entity that determines the purpose and means of processing Personal Information (in most cases, our Clients)." },
      { term: "Operator / Processor", def: "The entity that processes Personal Information on behalf of the Responsible Party (in our case, NexteraAI acts as Operator/Processor for Client Data)." },
      { term: "Client Data", def: "Personal Information that our Clients upload or instruct us to process through the Services (e.g. customer contact details for SMS follow-ups, email lists for phishing protection)." },
    ],
  },
  {
    id: "scope",
    title: "2. Scope of this Privacy Policy",
    icon: <Eye className="w-5 h-5 text-primary" />,
    content: "This Policy applies to:",
    list: [
      "Personal Information we collect directly from you (e.g. when you register an Account, contact support, or subscribe to updates).",
      "Personal Information we process on behalf of our Clients as Operator (Client Data).",
      "Personal Information collected via our website, dashboard, emails, or other interactions.",
    ],
    footer: "It does not apply to Personal Information processed by our Clients as Responsible Parties — they must provide their own privacy notices to their data subjects.",
  },
  {
    id: "collection",
    title: "3. Information We Collect",
    icon: <Database className="w-5 h-5 text-primary" />,
    content: "We collect two main categories:",
    subsections: [
      {
        heading: "A. Information we collect directly (as Responsible Party)",
        items: [
          "Account registration: name, business name, email, telephone, physical address, payment details.",
          "Support & communications: messages, tickets, call recordings (if applicable).",
          "Website usage: IP address, browser type, pages visited, cookies & similar technologies (see section 10).",
          "Marketing: if you subscribe to newsletters or updates.",
        ],
      },
      {
        heading: "B. Information we process on behalf of Clients (as Operator)",
        items: [
          "Customer contact details (phone numbers, emails, names) for SMS follow-ups, phishing protection, POPIA tools.",
          "Device & email metadata for security monitoring.",
          "Any other Data uploaded or generated through the Services.",
        ],
        footer: "We only process this Client Data on your documented instructions as our Client (the Responsible Party).",
      },
    ],
  },
  {
    id: "purpose",
    title: "4. Purpose of Processing & Lawful Basis",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    content: "We process Personal Information for the following purposes (and only to the extent lawful under POPIA):",
    list: [
      "To provide, maintain and improve the Services (contractual necessity / legitimate interest).",
      "Account management, billing and payments (contract).",
      "Security, fraud prevention & cybersecurity protection (legitimate interest / legal obligation).",
      "Compliance with POPIA and other laws (legal obligation).",
      "Support, training and communication (contract / consent).",
      "Aggregated analytics (anonymised \u2013 legitimate interest).",
    ],
    footer: "We rely on: your consent (where required, e.g. direct marketing); performance of a contract (providing Services); legitimate interests (where balanced and not overridden by your rights); and legal obligations (e.g. breach notifications).",
  },
  {
    id: "sharing",
    title: "5. Sharing & Disclosure of Personal Information",
    icon: <Users className="w-5 h-5 text-primary" />,
    content: "We do not sell Personal Information. We may share it only:",
    list: [
      "With service providers (sub-processors) who assist us (e.g. cloud hosting in South Africa or adequate jurisdictions, payment gateways like PayFast, SMS providers) — bound by strict agreements.",
      "To comply with law, court orders or regulator requests.",
      "In connection with business transfers (merger/acquisition) with equivalent protections.",
      "To protect our rights, safety or property.",
    ],
    footer: "For Client Data: we only disclose on your instructions as Responsible Party, except where required by law.",
  },
  {
    id: "transfers",
    title: "6. Cross-Border Transfers",
    icon: <Globe className="w-5 h-5 text-primary" />,
    content: "Some sub-processors or cloud infrastructure may be located outside South Africa. We ensure transfers comply with POPIA s 72 (e.g. binding agreements, adequacy decisions, or your consent). Most data remains hosted in South Africa or equivalent jurisdictions.",
  },
  {
    id: "security",
    title: "7. Security of Personal Information",
    icon: <Lock className="w-5 h-5 text-primary" />,
    content: "We implement reasonable technical and organisational measures (encryption, access controls, firewalls, regular audits, secure data centres) to protect against unauthorised access, loss, misuse or alteration. However, no method is 100% secure \u2014 we cannot guarantee absolute security.",
    footer: "In case of a confirmed data breach affecting your Personal Information, we will notify you and the Information Regulator as required by POPIA.",
  },
  {
    id: "retention",
    title: "8. Retention of Personal Information",
    icon: <Database className="w-5 h-5 text-primary" />,
    content: "We retain Personal Information only as long as necessary for the purposes above or as required by law:",
    list: [
      "Account data: duration of subscription + 7 years for tax/audit.",
      "Client Data: until you instruct deletion or termination + 30 days (as per Terms of Service).",
      "Logs & security data: up to 12\u201324 months.",
    ],
    footer: "Thereafter, we securely delete or anonymise.",
  },
  {
    id: "rights",
    title: "9. Your Rights as Data Subject (under POPIA)",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    content: "You have the right to:",
    list: [
      "Be informed about processing.",
      "Access your Personal Information.",
      "Request correction/deletion (subject to legal retention).",
      "Object to processing (including for direct marketing).",
      "Not be subject to automated decisions with legal effect.",
      "Lodge a complaint with the Information Regulator.",
    ],
    footer: "To exercise rights: email privacy@nexteraai.co.za with proof of identity. We respond within reasonable time (usually 30 days). Some requests may incur a reasonable fee if excessive. For Client Data: direct your data subjects to contact you (the Responsible Party), as we act only on your instructions.",
  },
  {
    id: "cookies",
    title: "10. Cookies & Similar Technologies",
    icon: <Cookie className="w-5 h-5 text-primary" />,
    content: "Our website and dashboard use cookies, pixels and similar technologies for functionality, analytics and security. You can manage preferences via our cookie banner. We use strictly necessary cookies (session management, authentication), analytics cookies (anonymised usage data to improve the Services), and security cookies (CSRF protection, rate limiting).",
  },
  {
    id: "changes",
    title: "11. Changes to this Privacy Policy",
    icon: <Bell className="w-5 h-5 text-primary" />,
    content: "We may update this Policy to reflect legal changes, new features or practices. We will notify you via email or dashboard notice at least 30 days before material changes. Continued use constitutes acceptance.",
  },
  {
    id: "contact",
    title: "12. Contact Us",
    icon: <Mail className="w-5 h-5 text-primary" />,
    content: null,
    contactInfo: true,
  },
];

export function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 md:py-16">
        <header className="space-y-4 text-center">
          <Logo className="mx-auto" />
          <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Legal</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            NexteraAI Security is committed to protecting your Personal Information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and applicable South African law.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              Return to landing page
            </Link>
            <Link to="/terms" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              Terms of Service
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Log in to your console</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id} id={section.id} className="border border-border/40 bg-card/50 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>

              {section.content && (
                <p className="text-sm text-muted-foreground mb-3">{section.content}</p>
              )}

              {"bullets" in section && section.bullets && (
                <dl className="space-y-2 text-sm">
                  {section.bullets.map((b) => (
                    <div key={b.term}>
                      <dt className="font-semibold text-white inline">&ldquo;{b.term}&rdquo;</dt>
                      <dd className="text-muted-foreground inline"> &ndash; {b.def}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {"list" in section && section.list && (
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {"subsections" in section && section.subsections && section.subsections.map((sub, idx) => (
                <div key={idx} className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-2">{sub.heading}</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {sub.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {"footer" in sub && sub.footer && (
                    <p className="text-xs text-muted-foreground mt-2 italic">{sub.footer}</p>
                  )}
                </div>
              ))}

              {"footer" in section && section.footer && (
                <p className="text-xs text-muted-foreground mt-3 italic">{section.footer}</p>
              )}

              {"contactInfo" in section && section.contactInfo && (
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-semibold text-white">Information Officer / Privacy Enquiries</p>
                    <p>Email: <a href="mailto:privacy@nexteraai.co.za" className="text-primary hover:underline">privacy@nexteraai.co.za</a></p>
                    <p>Postal: NexteraAI Security, Johannesburg, South Africa</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Information Regulator (for complaints)</p>
                    <p>
                      <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://inforegulator.org.za</a>
                      {" | "}
                      <a href="mailto:complaints.IR@justice.gov.za" className="text-primary hover:underline">complaints.IR@justice.gov.za</a>
                    </p>
                  </div>
                  <p className="text-xs italic">Last updated: 4 March 2026</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <footer className="text-center text-xs text-muted-foreground pt-6 border-t border-border/30">
          &copy; 2026 NexteraAI Security. Johannesburg, South Africa. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
