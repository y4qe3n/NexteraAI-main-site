import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Logo } from "@/react-app/components/Logo";
import { ContactForm } from "@/react-app/components/ContactForm";
import {
  Shield,
  Mail,
  Lock,
  FileCheck,
  Radar,
  Database,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
  Phone,
  PhoneOff,
  MapPin,
} from "lucide-react";

import { useNavigate } from "react-router";
import { useScrollAnimation, useStaggeredAnimation } from "@/react-app/hooks/useScrollAnimation";

// Scroll to top utility
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Scroll to section utility
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const features = [
  {
    icon: Shield,
    title: "Endpoint Shield",
    description:
      "Auto-scans devices for malware and ransomware. Blocks threats in real-time to prevent 80% of device-based attacks.",
  },
  {
    icon: Mail,
    title: "Email Guard",
    description:
      "Advanced phishing protection that filters emails, scans attachments, and flags SA-specific scams like SIM-swap lures.",
  },
  {
    icon: Lock,
    title: "Access Control",
    description:
      "Enforce MFA, audit logins, and manage passwords. Blocks 99% of credential stuffing attacks automatically.",
  },
  {
    icon: FileCheck,
    title: "POPIA Compliance Hub",
    description:
      "Guided compliance tools with data mapping, consent tracking, and breach logging. Avoid R10M fines.",
  },
  {
    icon: Radar,
    title: "Threat Radar",
    description:
      "Unified dashboard with real-time alerts via WhatsApp and SMS. Act fast without constant monitoring.",
  },
  {
    icon: Database,
    title: "Data Vault",
    description:
      "Automated encrypted backups with immutability. Quick recovery from ransomware with 3-2-1 backup strategy.",
  },
  {
    icon: PhoneOff,
    title: "Missed Call Follow-up",
    description:
      "Automatically SMS customers who couldn't reach you. Recover missed leads and boost response rates with zero effort.",
  },
];

const pricingTiers = [
  {
    name: "Basic",
    price: "R499",
    period: "/month",
    description: "Essential protection for small teams",
    features: [
      "Up to 10 devices",
      "Endpoint Shield",
      "Email Guard",
      "Basic MFA",
      "Monthly reports",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R999",
    period: "/month",
    description: "Complete security + lead recovery suite",
    features: [
      "Up to 25 devices",
      "All Basic features",
      "POPIA Compliance Hub",
      "Threat Radar dashboard",
      "Data Vault backups",
      "Missed Call Follow-up SMS",
      "WhatsApp alerts",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "R1,999",
    period: "/month",
    description: "Full protection + growth tools for larger orgs",
    features: [
      "Unlimited devices",
      "All Pro features",
      "Awareness Academy",
      "Advanced Missed Call analytics",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
      "On-site training",
    ],
    highlighted: false,
  },
];

const stats = [
  { value: "577", label: "Attacks per hour in SA" },
  { value: "78%", label: "Ransomware surge" },
  { value: "R43M", label: "Average breach cost" },
  { value: "70%", label: "SMMEs hit annually" },
];

// Animated Section Component
function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Animated Card Component
function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 overflow-visible ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();

  // Handler for buttons that need auth (redirect to login or show coming soon)
  const handleAction = (action: string) => {
    // For now, scroll to contact section or show coming soon
    if (action === 'audit' || action === 'pricing' || action === 'started') {
      scrollToSection('contact');
    } else if (action === 'dashboard') {
      navigate('/dashboard');
    } else if (action === 'learn-more') {
      scrollToSection('features');
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" className="text-white" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="text-white" onClick={() => handleAction('audit')}>
                Free Audit
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8 hover:scale-105 transition-transform cursor-pointer">
              <Zap className="w-4 h-4" />
              AI-Powered Cyber Hygiene as a Service
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
              Protect Your Business from{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 animate-gradient">
                South Africa's Rising Cyber Threats
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Affordable, AI-enhanced cybersecurity for Johannesburg SMMEs. Combat phishing, ransomware, and ensure POPIA compliance—all with set-it-and-forget-it protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-white text-base px-8 hover:scale-105 transition-transform" onClick={() => handleAction('audit')}>
                Get Your Free Security Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-white text-base px-8 hover:scale-105 transition-transform" onClick={() => handleAction('dashboard')}>
                View Dashboard Demo
              </Button>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedCard key={stat.label} delay={index * 100}>
                <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Complete Protection Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security tools designed specifically for South African small businesses
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedCard key={feature.title} delay={index * 100}>
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110 transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              </AnimatedCard>
            ))}
          </div>

          {/* Training feature */}
          <AnimatedSection delay={200} className="mt-6">
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-2">Awareness Academy</h3>
                  <p className="text-muted-foreground">
                    Short training videos, quizzes, and monthly phishing simulations to reduce human errors—the cause of 90% of breaches. Track completion and certify your staff.
                  </p>
                </div>
                <Button variant="outline" className="text-white flex-shrink-0 hover:scale-105 transition-transform" onClick={() => handleAction('learn-more')}>
                  Learn More
                </Button>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Why NexteraAI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Why Choose NexteraAI Security?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Users, title: "Built for SA SMMEs", desc: "Local focus with POPIA compliance, WhatsApp integration, and loadshedding-resilient cloud systems." },
                  { icon: TrendingUp, title: "Affordable & Scalable", desc: "Start at R499/month—a fraction of enterprise solutions. Scale as your business grows." },
                  { icon: Zap, title: "AI-Enhanced Protection", desc: "Smart threat prioritisation and automated responses keep you protected 24/7 without constant monitoring." }
                ].map((item, index) => (
                  <AnimatedCard key={item.title} delay={index * 100}>
                    <div className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors group-hover:scale-110 transform">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-white">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4 hover:scale-110 transition-transform">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold">POPIA Compliant</h3>
                  <p className="text-muted-foreground text-sm mt-2">
                    Full compliance toolkit to avoid fines up to R10M
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    "Data inventory mapping",
                    "Consent tracking & management",
                    "Auto opt-out via SMS",
                    "Breach notification templates",
                    "Exportable audit reports",
                    "Compliance scoring",
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3" style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include a free 30-minute security audit.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto py-8">
            {pricingTiers.map((tier, index) => (
              <AnimatedCard key={tier.name} delay={index * 150}>
                {tier.highlighted && (
                  <div className="relative -mb-3 mx-auto w-fit px-4 py-1.5 bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-bold rounded-full animate-pulse z-10 whitespace-nowrap shadow-lg shadow-primary/30 border border-white/20">
                    Most Popular
                  </div>
                )}
                {tier.name === "Enterprise" && (
                  <div className="relative -mb-3 mx-auto w-fit px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full z-10 whitespace-nowrap shadow-lg shadow-emerald/30 border border-white/20">
                    Best Value for Money
                  </div>
                )}
                <Card
                  className={`p-6 relative h-full ${
                    tier.highlighted
                      ? "bg-gradient-to-b from-primary/20 to-card border-primary/50 scale-105 hover:scale-110"
                      : tier.name === "Enterprise"
                      ? "bg-gradient-to-b from-emerald-500/10 to-card border-emerald-500/50 hover:border-emerald-500"
                      : "bg-card/50 border-border/50 hover:border-primary/50"
                  } transition-all duration-500 hover:shadow-lg hover:shadow-primary/20`}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="text-white w-full hover:scale-105 transition-transform"
                    variant={tier.highlighted ? "default" : "outline"}
                    onClick={() => handleAction('started')}
                  >
                    Get Started
                  </Button>
                </Card>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedSection delay={300}>
            <p className="text-center text-muted-foreground text-sm mt-8">
              Add-ons available: Extra devices R50/month • Missed Call SMS from R50/month • Deep Security Audit R2,000 • Annual billing saves 10%
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to Secure Your Business?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a free 30-minute security audit. We'll identify vulnerabilities and show you exactly how NexteraAI can protect your business.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatedCard delay={100}>
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:hello@nexara.ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          hello@nexara.ai
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href="tel:+27100001234" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          +27 10 000 1234
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          Sandton, Johannesburg<br />South Africa
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={200}>
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold">Free Security Audit Includes:</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      30-minute consultation call
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      Vulnerability assessment report
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      POPIA compliance checklist
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      Custom protection plan
                    </li>
                  </ul>
                </Card>
              </AnimatedCard>
            </div>

            {/* Contact Form */}
            <AnimatedSection delay={300} className="lg:col-span-3">
              <Card className="p-6 sm:p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
                <ContactForm 
                  source="landing_page" 
                  title="Request Your Free Security Audit"
                  buttonText="Schedule Free Audit"
                />
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo onClick={scrollToTop} />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <button onClick={() => scrollToSection('contact')} className="hover:text-foreground transition-colors">Contact</button>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 NexteraAI Security. Johannesburg, South Africa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
