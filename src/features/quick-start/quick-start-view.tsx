"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  MessageSquareHeart,
  Megaphone,
  PhoneForwarded,
  SlidersHorizontal,
  Sparkles,
  Zap,
  Play,
  Square,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Globe2,
  Cpu,
  Volume2,
  Sliders,
  Bot,
  ExternalLink,
  PhoneCall,
  Eye,
  Wand2,
  ShieldCheck,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  QUICK_START_TEMPLATES,
  QuickStartTemplate,
} from "@/config/quick-start-templates";
import { useAppStore } from "@/stores/use-app-store";
import {
  LLM_MODELS_BY_PROVIDER,
  SUPPORTED_LANGUAGES,
  VOICE_CATALOG,
} from "@/config/constants";
import { AIAgent, LLMProvider, SupportedLanguage, VoiceProvider } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function QuickStartView() {
  const router = useRouter();
  const { addAgent, agents, user, activeWorkspaceId, workspaces } = useAppStore();

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const [activeCategory, setActiveCategory] = useState<string>("All Templates");
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Customize Dialog state
  const [customizingTemplate, setCustomizingTemplate] =
    useState<QuickStartTemplate | null>(null);
  const [customAgentName, setCustomAgentName] = useState("");
  const [customCompanyName, setCustomCompanyName] = useState(user.company || "Zenviah.ai");
  const [customGreeting, setCustomGreeting] = useState("");
  const [customVoiceId, setCustomVoiceId] = useState("sarvam-ananya-ta-en");
  const [customLanguage, setCustomLanguage] = useState<SupportedLanguage>("English (India)");
  const [customCodeSwitching, setCustomCodeSwitching] = useState(true);
  const [customDirection, setCustomDirection] = useState<AIAgent["direction"]>("Inbound");
  const [customLlmProvider, setCustomLlmProvider] = useState<LLMProvider>("Google Gemini");
  const [customModel, setCustomModel] = useState("gemini-2.0-flash");

  // Preview Dialog state
  const [previewTemplate, setPreviewTemplate] =
    useState<QuickStartTemplate | null>(null);

  const categories = [
    "All Templates",
    "Appointment Booking",
    "Feedback & CSAT",
    "Marketing & Outreach",
    "Nurturing & Follow-up",
    "Custom Engineering",
  ];

  const filteredTemplates =
    activeCategory === "All Templates"
      ? QUICK_START_TEMPLATES
      : QUICK_START_TEMPLATES.filter((t) => t.category === activeCategory);

  const getTemplateIcon = (iconName: QuickStartTemplate["iconName"]) => {
    switch (iconName) {
      case "CalendarCheck":
        return CalendarCheck;
      case "MessageSquareHeart":
        return MessageSquareHeart;
      case "Megaphone":
        return Megaphone;
      case "PhoneForwarded":
        return PhoneForwarded;
      case "SlidersHorizontal":
      default:
        return SlidersHorizontal;
    }
  };

  const handlePlayAudioSample = (id: string, text: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setPlayingAudioId(id);
    toast.info("Playing audio voice sample preview...");

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), 3500);
    }
  };

  // 1-Click Instant Deploy
  const handleQuickDeploy = (template: QuickStartTemplate) => {
    const newId = `agt-tmpl-${Date.now()}`;
    const newAgent: AIAgent = {
      id: newId,
      name: `${template.name} — ${user.company.split(" ")[0]} Desk`,
      description: template.description,
      avatarColor: template.accentColor,
      agentType:
        template.id === "template-appointment-booking"
          ? "Appointment Booking"
          : template.id === "template-feedback-ai"
          ? "Customer Support"
          : template.id === "template-marketing-ai"
          ? "Lead Qualification"
          : template.id === "template-followup-ai"
          ? "Payment Reminder"
          : "Technical Helpdesk",
      direction: template.defaultDirection,
      businessUseCase: template.businessUseCase,
      status: "Published",
      llmProvider: template.llmProvider,
      model: template.model,
      systemPrompt: template.systemPrompt,
      temperature: template.temperature,
      maxTokens: template.maxTokens,
      responseBehavior: template.responseBehavior,
      voiceProvider: template.voiceProvider,
      voiceId: template.voiceId,
      voiceName: template.voiceName,
      voiceGender: template.voiceGender,
      language: template.language,
      codeSwitching: template.codeSwitching,
      speakingSpeed: template.speakingSpeed,
      interruptionSensitivity: template.interruptionSensitivity,
      knowledgeBaseIds: ["kb-ecom-policies"],
      greetingMessage: template.greetingMessage,
      conversationInstructions: template.conversationInstructions,
      callTimeoutSeconds: 12,
      maxCallDurationSeconds: 600,
      humanTransferNumber: "+91 44 4812 9900",
      fallbackBehavior: "Transfer to Human",
      endCallConditions: ["Issue resolved", "Caller ends call", "Transferred to human supervisor"],
      connectedIntegrations: template.connectedIntegrations,
      totalCalls: 0,
      successRate: 95.0,
      avgDurationSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAgent(newAgent);
    toast.success(`Deployed "${newAgent.name}" in under 3 seconds!`, {
      action: {
        label: "Open & Test",
        onClick: () => router.push(`/agents/${newAgent.id}`),
      },
    });
  };

  // Open Customize Dialog
  const handleOpenCustomize = (template: QuickStartTemplate) => {
    setCustomizingTemplate(template);
    setCustomAgentName(`${template.name} — ${user.company.split(" ")[0] || "My Brand"}`);
    setCustomCompanyName(user.company || "Zenviah Partner");
    setCustomGreeting(template.greetingMessage);
    setCustomVoiceId(template.voiceId);
    setCustomLanguage(template.language);
    setCustomCodeSwitching(template.codeSwitching);
    setCustomDirection(template.defaultDirection);
    setCustomLlmProvider(template.llmProvider);
    setCustomModel(template.model);
  };

  // Save Customized Agent
  const handleSaveCustomized = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizingTemplate) return;

    if (!customAgentName.trim()) {
      toast.error("Please provide an agent name.");
      return;
    }

    const selectedVoiceObj =
      VOICE_CATALOG.find((v) => v.id === customVoiceId) || VOICE_CATALOG[0];

    const customizedPrompt = customizingTemplate.systemPrompt.replace(
      /Zenviah\.ai partner clinics|Zenviah Experience Team|Zenviah Retail|Zenviah Financial Solutions/g,
      customCompanyName
    );

    const newId = `agt-custom-${Date.now()}`;
    const newAgent: AIAgent = {
      id: newId,
      name: customAgentName.trim(),
      description: customizingTemplate.description,
      avatarColor: customizingTemplate.accentColor,
      agentType:
        customizingTemplate.id === "template-appointment-booking"
          ? "Appointment Booking"
          : customizingTemplate.id === "template-feedback-ai"
          ? "Customer Support"
          : customizingTemplate.id === "template-marketing-ai"
          ? "Lead Qualification"
          : customizingTemplate.id === "template-followup-ai"
          ? "Payment Reminder"
          : "Technical Helpdesk",
      direction: customDirection,
      businessUseCase: `${customCompanyName} — ${customizingTemplate.businessUseCase}`,
      status: "Published",
      llmProvider: customLlmProvider,
      model: customModel,
      systemPrompt: customizedPrompt,
      temperature: customizingTemplate.temperature,
      maxTokens: customizingTemplate.maxTokens,
      responseBehavior: customizingTemplate.responseBehavior,
      voiceProvider: selectedVoiceObj.provider,
      voiceId: selectedVoiceObj.id,
      voiceName: selectedVoiceObj.name,
      voiceGender: selectedVoiceObj.gender,
      language: customLanguage,
      codeSwitching: customCodeSwitching,
      speakingSpeed: customizingTemplate.speakingSpeed,
      interruptionSensitivity: customizingTemplate.interruptionSensitivity,
      knowledgeBaseIds: ["kb-ecom-policies"],
      greetingMessage: customGreeting,
      conversationInstructions: customizingTemplate.conversationInstructions,
      callTimeoutSeconds: 12,
      maxCallDurationSeconds: 600,
      humanTransferNumber: "+91 44 4812 9900",
      fallbackBehavior: "Transfer to Human",
      endCallConditions: ["Goal confirmed", "Caller finished turn", "Transferred"],
      connectedIntegrations: customizingTemplate.connectedIntegrations,
      totalCalls: 0,
      successRate: 95.0,
      avgDurationSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAgent(newAgent);
    setCustomizingTemplate(null);
    toast.success(`Agent "${newAgent.name}" created and published!`);
    router.push(`/agents/${newAgent.id}`);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E8EAF0] bg-gradient-to-br from-[#111318] via-[#161922] to-[#1C1F2B] p-7 text-white shadow-card lg:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#635BFF]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-[#8B7CFF]/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-[#8B7CFF] backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Pre-Configured Enterprise AI Voice Templates
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Launch Production AI Voice Agents{" "}
              <span className="bg-gradient-to-r from-[#8B7CFF] to-[#D5D9E4] bg-clip-text text-transparent">
                in 60 Seconds
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-[#A3A9B8]">
              Skip manual prompt writing and telephony setup. Pick a battle-tested template for appointment scheduling, CSAT feedback, marketing outreach, or payment follow-up, and deploy instantly to your workspace.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#CBD2E1]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#16A36A]" />
                Sub-300ms Turn Latency
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Globe2 className="h-4 w-4 text-[#8B7CFF]" />
                8 Indian Languages + Code-Switching
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#16A36A]" />
                DPDP & TRAI Compliant
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
            <Button
              size="lg"
              className="bg-[#635BFF] hover:bg-[#5249F5] shadow-brand font-semibold"
              onClick={() => router.push("/agents/new")}
            >
              <Wand2 className="h-4 w-4" />
              <span>Full 6-Step Custom Wizard</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 font-medium"
              onClick={() => router.push("/workflows")}
            >
              <Layers className="h-4 w-4" />
              <span>Visual Workflow Studio</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EAF0] pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#635BFF] text-white shadow-brand"
                  : "bg-white text-[#777E90] border border-[#E8EAF0] hover:text-[#171923] hover:border-[#D5D9E4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#777E90]">
          Showing <strong>{filteredTemplates.length}</strong> verified templates for{" "}
          <strong className="text-[#171923]">{activeWorkspace.name}</strong>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => {
          const Icon = getTemplateIcon(template.iconName);
          const isPlaying = playingAudioId === template.id;

          return (
            <Card
              key={template.id}
              className="group flex flex-col justify-between border-[#E8EAF0] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#635BFF]/50 hover:shadow-elevated"
            >
              <CardContent className="p-6 space-y-5">
                {/* Header row: Icon, Name, Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                      style={{ backgroundColor: template.accentColor }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#171923]">
                          {template.name}
                        </h3>
                      </div>
                      <p className="text-[11px] font-medium text-[#777E90]">
                        {template.category} • {template.defaultDirection}
                      </p>
                    </div>
                  </div>

                  <Badge variant={template.badgeVariant}>{template.badge}</Badge>
                </div>

                {/* Tagline & Description */}
                <div>
                  <p className="text-xs font-semibold text-[#171923]">
                    {template.tagline}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#777E90] line-clamp-3">
                    {template.description}
                  </p>
                </div>

                {/* Target Audience & Recommended Pill */}
                <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#777E90]">
                      Best for:
                    </span>
                    <span className="font-medium text-[#171923] truncate max-w-[200px]">
                      {template.targetAudience}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#777E90]">
                      Setup Time:
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#16A36A]">
                      <Clock className="h-3 w-3" />
                      ~{template.estimatedSetupMinutes} minute
                    </span>
                  </div>
                </div>

                {/* Technical Stack Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777E90]">
                    Pre-Configured Architecture
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAF0] bg-white px-2 py-1 text-[11px] font-medium text-[#171923]">
                      <Cpu className="h-3 w-3 text-[#635BFF]" />
                      {template.llmProvider} ({template.model.split("-").slice(0, 2).join("-")})
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAF0] bg-white px-2 py-1 text-[11px] font-medium text-[#171923]">
                      <Volume2 className="h-3 w-3 text-[#16A36A]" />
                      {template.voiceName.split(" ")[0]} ({template.voiceProvider})
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAF0] bg-white px-2 py-1 text-[11px] font-medium text-[#171923]">
                      <Globe2 className="h-3 w-3 text-[#0EA5E9]" />
                      {template.language}
                    </span>
                  </div>
                </div>

                {/* Interactive Audio Sample Preview Box */}
                <div className="rounded-xl border border-[#E8EAF0] bg-white p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#171923] flex items-center gap-1.5">
                      <Volume2 className="h-3.5 w-3.5 text-[#635BFF]" />
                      Sample Voice Greeting
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant={isPlaying ? "default" : "outline"}
                      className="h-7 text-xs px-2.5"
                      onClick={() =>
                        handlePlayAudioSample(template.id, template.sampleAudioQuote)
                      }
                    >
                      {isPlaying ? (
                        <>
                          <Square className="h-3 w-3" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 text-[#635BFF]" />
                          Listen
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] italic text-[#4A5060] line-clamp-2 leading-relaxed">
                    “{template.sampleAudioQuote}”
                  </p>
                </div>

                {/* Key Highlights Checklist */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777E90]">
                    Key Capabilities Included
                  </span>
                  <ul className="space-y-1 text-[11px] text-[#4A5060]">
                    {template.keyHighlights.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#16A36A]" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#E8EAF0]">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full font-semibold shadow-xs"
                      onClick={() => handleQuickDeploy(template)}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Quick Deploy</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-medium"
                      onClick={() => handleOpenCustomize(template)}
                    >
                      <Sliders className="h-3.5 w-3.5 text-[#635BFF]" />
                      <span>Customize</span>
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs text-[#777E90] hover:text-[#171923]"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Prompt, Webhooks & Blueprint</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Customize Dialog */}
      <Dialog
        open={!!customizingTemplate}
        onOpenChange={(o) => !o && setCustomizingTemplate(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-[#635BFF]" />
              Quick Configure: {customizingTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Tweak core identity, greeting, and language parameters before deploying to {activeWorkspace.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCustomized} className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Agent Name</Label>
                <Input
                  value={customAgentName}
                  onChange={(e) => setCustomAgentName(e.target.value)}
                  placeholder="e.g., Appointment Booking AI"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Your Business / Brand Name</Label>
                <Input
                  value={customCompanyName}
                  onChange={(e) => setCustomCompanyName(e.target.value)}
                  placeholder="e.g., Apollo Healthcare / Zenviah Retail"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Spoken Greeting Script</Label>
              <Textarea
                rows={3}
                value={customGreeting}
                onChange={(e) => setCustomGreeting(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Voice Persona</Label>
                <select
                  value={customVoiceId}
                  onChange={(e) => setCustomVoiceId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                >
                  {VOICE_CATALOG.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Primary Language</Label>
                <select
                  value={customLanguage}
                  onChange={(e) =>
                    setCustomLanguage(e.target.value as SupportedLanguage)
                  }
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Call Direction</Label>
                <select
                  value={customDirection}
                  onChange={(e) =>
                    setCustomDirection(e.target.value as AIAgent["direction"])
                  }
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                >
                  <option value="Inbound">Inbound</option>
                  <option value="Outbound">Outbound</option>
                  <option value="Both">Both (Inbound + Outbound)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>LLM Provider</Label>
                <select
                  value={customLlmProvider}
                  onChange={(e) => {
                    const p = e.target.value as LLMProvider;
                    setCustomLlmProvider(p);
                    setCustomModel(LLM_MODELS_BY_PROVIDER[p][0].id);
                  }}
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                >
                  <option value="Google Gemini">Google Gemini</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="Groq">Groq</option>
                  <option value="Azure OpenAI">Azure OpenAI</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Model</Label>
                <select
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                >
                  {LLM_MODELS_BY_PROVIDER[customLlmProvider].map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.latency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3 text-xs">
              <div>
                <p className="font-semibold text-[#171923]">
                  Enable Tamil-English & Hindi-English Code-Switching
                </p>
                <p className="text-[11px] text-[#777E90]">
                  Naturally blends English terms with regional Indian language vocabulary.
                </p>
              </div>
              <Switch
                checked={customCodeSwitching}
                onCheckedChange={setCustomCodeSwitching}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCustomizingTemplate(null)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <CheckCircle2 className="h-4 w-4" />
                <span>Create & Deploy Agent</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Template Full Blueprint Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={(o) => !o && setPreviewTemplate(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#635BFF]" />
              {previewTemplate?.name} — Architecture Blueprint
            </DialogTitle>
            <DialogDescription>
              {previewTemplate?.tagline} • {previewTemplate?.category}
            </DialogDescription>
          </DialogHeader>

          {previewTemplate && (
            <div className="space-y-5 py-2 text-xs">
              {/* Spoken Greeting */}
              <div className="space-y-1.5">
                <Label>First Spoken Greeting</Label>
                <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3 text-[#171923] font-medium leading-relaxed">
                  “{previewTemplate.greetingMessage}”
                </div>
              </div>

              {/* System Prompt Code Box */}
              <div className="space-y-1.5">
                <Label>Pre-Configured System Instructions</Label>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E8EAF0] bg-[#111318] p-3.5 font-mono text-[11px] leading-relaxed text-[#A3A9B8]">
                  {previewTemplate.systemPrompt}
                </div>
              </div>

              {/* Workflow Execution Pipeline */}
              <div className="space-y-1.5">
                <Label>Visual Workflow Pipeline Steps</Label>
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E8EAF0] p-3 bg-[#F8F9FC]">
                  {previewTemplate.workflowSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-[#171923] border border-[#E8EAF0] shadow-2xs">
                        {step}
                      </span>
                      {idx < previewTemplate.workflowSteps.length - 1 && (
                        <ChevronRight className="h-3.5 w-3.5 text-[#777E90]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Extracted Variables & Default Integrations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#E8EAF0] p-3 space-y-1.5">
                  <span className="font-bold text-[#171923]">
                    Extracted CRM Variables
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {previewTemplate.extractedFields.map((field) => (
                      <code
                        key={field}
                        className="rounded bg-[#635BFF]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#635BFF]"
                      >
                        {field}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#E8EAF0] p-3 space-y-1.5">
                  <span className="font-bold text-[#171923]">
                    Connected Connectors
                  </span>
                  <p className="text-[11px] text-[#777E90]">
                    {previewTemplate.connectedIntegrations.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewTemplate(null)}
            >
              Close
            </Button>
            {previewTemplate && (
              <Button
                onClick={() => {
                  const tmpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleQuickDeploy(tmpl);
                }}
              >
                <Zap className="h-4 w-4" />
                <span>Quick Deploy This Template</span>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

