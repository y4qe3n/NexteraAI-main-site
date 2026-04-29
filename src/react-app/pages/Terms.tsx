import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Logo } from "@/react-app/components/Logo";
import { ShieldCheck, FileText, CheckCircle } from "lucide-react";

const sections = [
  {
    title: "Acceptance & Scope",
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    body:
      "By using NexteraAI Security you agree to be bound by these Terms & Conditions, any supplemental terms posted on our website, and the Privacy Policy. These Terms cover access to the platform, simulations, automated AI modules, the knowledge base, and integrations with third-party services.",
  },
  {
    title: "Service Delivery",
    icon: <FileText className="w-6 h-6 text-primary" />,
    body:
      "We deliver AI-driven detection, response, and compliance modules (Endpoint Shield, Email Guard, Threat Radar, Access Control, POPIA compliance tooling, etc.) as described in our marketing, documentation, and Customer Portal. Availability targets are described in your subscription plan, and we reserve the right to temporarily suspend services for maintenance with notice.",
    bullets: [
      "Intelligent detection feeds and dashboard summaries are refreshed in real time.",
      "Devices, teams, and training modules are gated by your plan tier and device limits.",
      "We may rely on third-party APIs (e.g., SMS, email, OAuth) whose availability is outside our direct control.",
    ],
  },
  {
    title: "AI Feedback & Learning",
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    body:
      "You may label detections and export feedback for retraining. Feedback is used to improve context-aware responses, while respecting anonymized data handling described elsewhere. Do not upload personally identifiable information unless it is strictly necessary for investigation and you have the rights to do so.",
    bullets: [
      "Feedback may be exported from the dashboard via the “AI Feedback” section.",
      "Exported data is stored in your assigned R2 bucket and flagged once retrieved.",
      "We retain label history for auditing and model governance.",
    ],
  },
  {
    title: "Data & Privacy",
    icon: <FileText className="w-6 h-6 text-primary" />,
    body:
      "We collect the minimum data needed to run detections, send alerts, and enforce POPIA requirements. This includes user identifiers, login metadata, device fingerprints, and message payloads. All data is processed according to our Privacy Policy and South African data legislation.",
  },
  {
    title: "Payment & Billing",
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    body:
      "Subscription fees are billed in South African Rand (ZAR) based on the plan selected. Your organization’s plan determines device caps, simulations, and support SLA. We reserve the right to adjust pricing with 30 days notice. Failure to pay may suspend access.",
    bullets: [
      "Devices beyond your plan limit may be blocked until the plan is upgraded.",
      "Notifications (email/SMS/WhatsApp) may continue for overdue accounts to ensure you can remediate quickly.",
    ],
  },
  {
    title: "Termination & Changes",
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    body:
      "Either party can terminate with written notice. We may also terminate accounts that violate acceptable-use rules or present a security risk. Upon termination we delete production data after 30 days unless retention is required by law or explicit request.",
  },
];

export function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 md:py-16">
        <header className="space-y-4 text-center">
          <Logo className="mx-auto" />
          <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Legal</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="text-base text-muted-foreground">
            These terms describe how NexteraAI Security delivers AI protection, manages
            data, and works with your organization. Read them carefully before using the platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              Return to landing page
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Log in to your console</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title} className="border border-border/40 bg-card/50 shadow-2xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{section.body}</p>
                {section.bullets ? (
                  <ul className="grid gap-2 text-sm text-muted-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Card>
          ))}
        </section>

        <section className="space-y-4 rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/10 to-slate-900/70 p-6 shadow-xl md:p-8">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-primary">
            <ShieldCheck className="w-4 h-4" />
            Need clarity?
          </div>
          <h3 className="text-2xl font-semibold">Still have questions?</h3>
          <p className="text-sm text-muted-foreground">
            Reach out to our security team at any time. We are happy to walk you through these terms,
            provide clarifications on AI exports, or explain how we keep your data private and secure.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" size="sm" asChild>
              <Link to="/contact" className="text-white">
                Contact support
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white" asChild>
              <Link to="/pricing">Review plan limits</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
