import { Metadata } from "next";
import Link from "next/link";
import { Lock, Blocks, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Integrations (Coming Soon) | Zenviah.ai",
  description:
    "Enterprise Integrations marketplace for Zenviah.ai. Telephony trunks, CRMs, webhooks, and automation pipelines scheduled for an upcoming platform release.",
};

export default function IntegrationsPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#E8EAF0] bg-white shadow-subtle">
        <Blocks className="h-9 w-9 text-[#635BFF]" />
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#111318] text-[#8B7CFF] shadow-sm">
          <Lock className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <Badge variant="outline" className="border-[#635BFF]/30 bg-[#635BFF]/5 text-[#635BFF]">
          <Sparkles className="h-3 w-3 mr-1" />
          Future Platform Release
        </Badge>
        <Badge variant="secondary">In Active Development</Badge>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#171923]">
        Integration Marketplace
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#777E90]">
        Connect your cloud telephony providers (Exotel, Tata Tele, Twilio), Indian & global CRMs (HubSpot, Zoho, Salesforce), and automation pipelines (Make, n8n, Zapier) directly into your call workflows.
      </p>

      {/* Feature Preview Cards */}
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
        <Card className="border-[#E8EAF0] bg-white">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-[#171923]">Zero-Storage KMS Vault</p>
            <p className="mt-1 text-[11px] text-[#777E90]">
              Hardware Security Module (HSM) encrypted credentials. Third-party API keys never touch browser memory or client bundles.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E8EAF0] bg-white">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-[#171923]">Native Indian Telcos & CRMs</p>
            <p className="mt-1 text-[11px] text-[#777E90]">
              Built-in connectors for Exotel, Tata Tele Business, LeadSquared, and Zoho CRM with automated post-call record sync.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E8EAF0] bg-white">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-[#171923]">Real-time Event Webhooks</p>
            <p className="mt-1 text-[11px] text-[#777E90]">
              Signed HMAC-SHA256 webhooks for instant notifications on call started, speech transcribed, and call concluded events.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button asChild>
          <Link href="/quick-start">
            Explore Quick Start Templates
          </Link>
        </Button>
      </div>
    </div>
  );
}
