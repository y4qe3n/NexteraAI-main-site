import { Link } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Logo } from "@/react-app/components/Logo";

type PlaceholderPageProps = {
  title: string;
  category?: string;
  contactEmail?: "support@nexteraai.co.za" | "legal@nexteraai.co.za";
  legal?: boolean;
};

export function PlaceholderPage({
  title,
  category = "Controlled Beta",
  contactEmail = "support@nexteraai.co.za",
  legal = false,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-10 md:py-14">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <Link to="/" className="text-sm font-semibold text-[#A1A1AA] underline-offset-4 hover:text-white hover:underline">
            Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-16">
          <Card className="w-full border border-[#624CAB]/30 bg-[#141218]/90 p-8 shadow-[0_0_80px_-30px_rgba(139,92,246,0.55)] md:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#C4B5FD]">
              <ShieldCheck className="h-3.5 w-3.5" />
              {category}
            </div>

            <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h1>

            <p className="mt-5 text-base leading-7 text-[#A1A1AA]">
              This page is being prepared for controlled beta customers.
            </p>

            {legal ? (
              <p className="mt-4 rounded-lg border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 p-4 text-sm leading-6 text-[#D8B4FE]">
                This document/page is provided for controlled beta review and may be updated before full public launch.
              </p>
            ) : null}

            <p className="mt-5 text-sm leading-6 text-[#A1A1AA]">
              For help while this resource is being finalized, contact{" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold text-[#C4B5FD] underline-offset-4 hover:text-white hover:underline">
                {contactEmail}
              </a>
              .
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-[#624CAB] text-white hover:bg-[#8B5CF6]">
                <a href={`mailto:${contactEmail}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact us
                </a>
              </Button>
              <Button asChild variant="outline" className="border-[#8B5CF6]/40 text-white hover:bg-[#8B5CF6]/10">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return home
                </Link>
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
