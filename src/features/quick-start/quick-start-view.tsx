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
  Cpu,
  Sliders,
  Bot,
  Eye,
  FileSpreadsheet,
  Upload,
  Calendar,
  PhoneCall,
  ChevronRight,
  ShieldAlert,
  Download,
  Trash2,
} from "lucide-react";
import {
  QUICK_START_TEMPLATES,
  QuickStartTemplate,
  TemplateTypeKey,
} from "@/config/quick-start-templates";
import { useAppStore } from "@/stores/use-app-store";
import {
  LLM_MODELS_BY_PROVIDER,
  SUPPORTED_LANGUAGES,
  VOICE_CATALOG,
} from "@/config/constants";
import { AIAgent, LLMProvider, SupportedLanguage } from "@/types";
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
  const { addAgent, user, activeWorkspaceId, workspaces, addCampaign } = useAppStore();

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

  // Template-Specific Customization Fields
  const [specificField1, setSpecificField1] = useState("");
  const [specificField2, setSpecificField2] = useState("");
  const [specificToggle, setSpecificToggle] = useState(true);

  // Contacts Upload state (for templates like Followup, Feedback, Marketing)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedContactCount, setUploadedContactCount] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

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
        template.typeKey === "appointment-booking"
          ? "Appointment Booking"
          : template.typeKey === "feedback-ai"
          ? "Customer Support"
          : template.typeKey === "marketing-ai"
          ? "Lead Qualification"
          : template.typeKey === "followup-ai"
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
      knowledgeBaseIds: [],
      greetingMessage: template.greetingMessage,
      conversationInstructions: template.conversationInstructions,
      callTimeoutSeconds: 30,
      maxCallDurationSeconds: 600,
      humanTransferNumber: "+919840012345",
      fallbackBehavior: "Transfer to Human",
      endCallConditions: ["User hangs up", "Goal completed", "Explicit goodbye"],
      connectedIntegrations: template.connectedIntegrations,
      totalCalls: 0,
      successRate: 100,
      avgDurationSeconds: 0,
      assignedPhoneNumber: "+91 98402 71490",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAgent(newAgent);

    // If template requires contacts and is an outbound dialer, auto-seed a campaign draft
    if (template.specificConfig.requiresContactsUpload) {
      addCampaign({
        id: `cmp-init-${Date.now()}`,
        name: `${template.name} Initial Calling Batch`,
        description: `Automated campaign launched from ${template.name} quick start template.`,
        agentId: newId,
        agentName: newAgent.name,
        status: "Scheduled",
        totalContacts: template.specificConfig.defaultContactCount || 100,
        callsAttempted: 0,
        callsCompleted: 0,
        failedCalls: 0,
        answerRate: 0,
        successRate: 0,
        scheduledStart: "Today, Immediate",
        callingHoursStart: "09:30",
        callingHoursEnd: "19:30",
        timezone: "Asia/Kolkata (IST)",
        concurrency: 15,
        contactListName: template.specificConfig.sampleContactsFile || "contacts_cohort.csv",
        estimatedBudgetINR: (template.specificConfig.defaultContactCount || 100) * 4.5,
        spentINR: 0,
      });
    }

    toast.success(
      `Instant Deploy Success! "${newAgent.name}" is now live and published.`
    );
    router.push(`/agents/${newId}`);
  };

  // Open Template-Specific Customize Dialog
  const handleOpenCustomize = (template: QuickStartTemplate) => {
    setCustomizingTemplate(template);
    setCustomAgentName(template.name);
    setCustomGreeting(template.greetingMessage);
    setCustomVoiceId(template.voiceId);
    setCustomLanguage(template.language);
    setCustomCodeSwitching(template.codeSwitching);
    setCustomDirection(
      template.defaultDirection === "Both" ? "Both" : template.defaultDirection
    );
    setCustomLlmProvider(template.llmProvider);
    setCustomModel(template.model);

    // Load template-specific field defaults
    setSpecificField1(template.specificConfig.specificField1Default || "");
    setSpecificField2(template.specificConfig.specificField2Default || "");
    setSpecificToggle(
      template.specificConfig.specificToggleDefault !== undefined
        ? template.specificConfig.specificToggleDefault
        : true
    );

    // Reset contacts upload state
    if (template.specificConfig.requiresContactsUpload) {
      setUploadedFileName(template.specificConfig.sampleContactsFile || "contacts_cohort.csv");
      setUploadedContactCount(template.specificConfig.defaultContactCount || 150);
    } else {
      setUploadedFileName(null);
      setUploadedContactCount(0);
    }
  };

  // Handle mock file upload for contact lists
  const handleSimulateContactsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFileName(file.name);
      // Realistic random contacts count parsed from file size
      const count = Math.max(45, Math.floor(file.size / 48));
      setUploadedContactCount(count);
      toast.success(
        `Uploaded "${file.name}" with ${count.toLocaleString("en-IN")} verified contacts!`,
        {
          description: "Phone numbers validated with +91 format and TRAI DND check.",
        }
      );
    }, 600);
  };

  // Save Customized Agent
  const handleSaveCustomized = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizingTemplate) return;

    if (!customAgentName.trim()) {
      toast.error("Please enter a name for your AI voice agent.");
      return;
    }

    // Validation for contact lists if required
    if (customizingTemplate.specificConfig.requiresContactsUpload && !uploadedFileName) {
      toast.error("Please upload a CSV or Excel contacts file for this outbound template.");
      return;
    }

    const newId = `agt-tmpl-${Date.now()}`;
    const selectedVoice =
      VOICE_CATALOG.find((v) => v.id === customVoiceId) || VOICE_CATALOG[0];

    // Append customized brand name into greeting if brand was updated
    const finalGreeting = customGreeting.includes(customCompanyName)
      ? customGreeting
      : customGreeting.replace(/Zenviah|Apollo|Zenviah Retail/gi, customCompanyName);

    const newAgent: AIAgent = {
      id: newId,
      name: `${customAgentName.trim()} (${customCompanyName})`,
      description: `${customizingTemplate.description} Customized for ${customCompanyName}.`,
      avatarColor: customizingTemplate.accentColor,
      agentType:
        customizingTemplate.typeKey === "appointment-booking"
          ? "Appointment Booking"
          : customizingTemplate.typeKey === "feedback-ai"
          ? "Customer Support"
          : customizingTemplate.typeKey === "marketing-ai"
          ? "Lead Qualification"
          : customizingTemplate.typeKey === "followup-ai"
          ? "Payment Reminder"
          : "Technical Helpdesk",
      direction: customDirection,
      businessUseCase: customizingTemplate.businessUseCase,
      status: "Published",
      llmProvider: customLlmProvider,
      model: customModel,
      systemPrompt: `${customizingTemplate.systemPrompt}\n\n[TEMPLATE SPECIFIC RULE]\nBusiness entity: ${customCompanyName}.\n${customizingTemplate.specificConfig.specificField1Label || "Rule 1"}: ${specificField1}.\n${customizingTemplate.specificConfig.specificField2Label || "Rule 2"}: ${specificField2}.`,
      temperature: customizingTemplate.temperature,
      maxTokens: customizingTemplate.maxTokens,
      responseBehavior: customizingTemplate.responseBehavior,
      voiceProvider: selectedVoice.provider as AIAgent["voiceProvider"],
      voiceId: selectedVoice.id,
      voiceName: selectedVoice.name,
      voiceGender: selectedVoice.gender,
      language: customLanguage,
      codeSwitching: customCodeSwitching,
      speakingSpeed: selectedVoice.provider === "Sarvam AI" ? 1.0 : 1.05,
      interruptionSensitivity: "High",
      knowledgeBaseIds: [],
      greetingMessage: finalGreeting,
      conversationInstructions: customizingTemplate.conversationInstructions,
      callTimeoutSeconds: 30,
      maxCallDurationSeconds: 600,
      humanTransferNumber:
        customizingTemplate.typeKey === "followup-ai" && specificField1
          ? specificField1
          : "+919840012345",
      fallbackBehavior: "Transfer to Human",
      endCallConditions: ["User hangs up", "Goal completed", "Explicit goodbye"],
      connectedIntegrations: customizingTemplate.connectedIntegrations,
      totalCalls: 0,
      successRate: 100,
      avgDurationSeconds: 0,
      assignedPhoneNumber: "+91 98402 71490",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAgent(newAgent);

    // If template requires contacts, automatically initialize the campaign batch
    if (customizingTemplate.specificConfig.requiresContactsUpload && uploadedFileName) {
      addCampaign({
        id: `cmp-batch-${Date.now()}`,
        name: `${customAgentName} Outreach Batch`,
        description: `Targeting ${uploadedContactCount} contacts uploaded via ${uploadedFileName}.`,
        agentId: newId,
        agentName: newAgent.name,
        status: "Scheduled",
        totalContacts: uploadedContactCount,
        callsAttempted: 0,
        callsCompleted: 0,
        failedCalls: 0,
        answerRate: 0,
        successRate: 0,
        scheduledStart: "Today, Scheduled",
        callingHoursStart: "09:30",
        callingHoursEnd: "19:30",
        timezone: "Asia/Kolkata (IST)",
        concurrency: 20,
        contactListName: uploadedFileName,
        estimatedBudgetINR: uploadedContactCount * 4.5,
        spentINR: 0,
      });
    }

    setCustomizingTemplate(null);
    toast.success(`Agent "${newAgent.name}" deployed with your tailored template options!`);
    router.push(`/agents/${newId}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E8EAF0] bg-gradient-to-br from-[#111318] via-[#1A1D26] to-[#252A36] p-8 text-white shadow-elevated">
        <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#635BFF]/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 translate-y-1/3 rounded-full bg-[#8B7CFF]/15 blur-2xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#8B7CFF] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#8B7CFF]" />
            <span>Tailored Quick Start Blueprints</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Launch Pre-Configured AI Voice Agents in Seconds
          </h1>

          <p className="text-sm leading-relaxed text-[#A3A9B8]">
            Each template features purpose-built options: Inbound calendar synchronization for appointments, and bulk CSV/Excel contact lists with DND scrubbing for outbound feedback, marketing, and sales follow-ups.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#E8EAF0]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A36A]" />
              <span>Tailored Configuration Fields</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A36A]" />
              <span>CSV/Excel Contact Uploads for Outbound</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A36A]" />
              <span>Direct Calendar Sync for Inbound</span>
            </div>
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
          Showing <strong>{filteredTemplates.length}</strong> specialized templates for{" "}
          <strong className="text-[#171923]">{activeWorkspace.name}</strong>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => {
          const Icon = getTemplateIcon(template.iconName);
          const isPlaying = playingAudioId === template.id;
          const hasContactsUpload = template.specificConfig.requiresContactsUpload;

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
                      <h3 className="text-base font-bold text-[#171923]">
                        {template.name}
                      </h3>
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

                {/* Specialization Indicator Banner */}
                <div
                  className={`rounded-xl border p-3 text-xs space-y-1 ${
                    hasContactsUpload
                      ? "border-[#F59E0B]/30 bg-[#F59E0B]/5"
                      : "border-[#635BFF]/30 bg-[#635BFF]/5"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[#171923]">
                    {hasContactsUpload ? (
                      <>
                        <FileSpreadsheet className="h-3.5 w-3.5 text-[#D97706]" />
                        <span>Requires Outbound Contact List (CSV / Excel)</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-3.5 w-3.5 text-[#635BFF]" />
                        <span>Inbound On-Demand: Live Calendar Slot Booking</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-[#777E90]">
                    {hasContactsUpload
                      ? "Includes phone upload, DND filtering, and automated campaign batch scheduling."
                      : "No contact list needed. Responds directly to incoming caller scheduling queries."}
                  </p>
                </div>

                {/* Technical Stack Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777E90]">
                    Pre-Configured Architecture
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAF0] bg-white px-2 py-1 text-[11px] font-medium text-[#171923]">
                      <Cpu className="h-3 w-3 text-[#635BFF]" />
                      {template.llmProvider}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAF0] bg-white px-2 py-1 text-[11px] font-medium text-[#171923]">
                      <span>🗣️</span>
                      {template.voiceName.split(" ")[0]} ({template.voiceProvider})
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAF0] bg-white px-2 py-1 text-[11px] font-medium text-[#171923]">
                      <span>🇮🇳</span>
                      {template.language}
                    </span>
                  </div>
                </div>

                {/* Spoken Quote Audio Preview */}
                <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777E90]">
                      Sample Spoken Greeting
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handlePlayAudioSample(template.id, template.sampleAudioQuote)
                      }
                      className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-[#635BFF] border border-[#E8EAF0] hover:bg-[#635BFF]/5"
                    >
                      {isPlaying ? (
                        <>
                          <Square className="h-3 w-3 text-[#E5484D] fill-current" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 fill-current" />
                          <span>Preview Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs italic leading-relaxed text-[#4A5060] line-clamp-2">
                    “{template.sampleAudioQuote}”
                  </p>
                </div>

                {/* Key Capabilities */}
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
                    <span>View Blueprint & Logic</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tailored Customize Dialog */}
      <Dialog
        open={!!customizingTemplate}
        onOpenChange={(o) => !o && setCustomizingTemplate(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-[#635BFF]" />
              Customize Template: {customizingTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              {customizingTemplate?.tagline}
            </DialogDescription>
          </DialogHeader>

          {customizingTemplate && (
            <form onSubmit={handleSaveCustomized} className="space-y-5 py-2">
              {/* SECTION 1: Identity & Brand */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                  1. Agent Identity & Business Name
                </span>
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
                    <Label>Your Business / Clinic / Brand Name</Label>
                    <Input
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      placeholder="e.g., Apollo Health / Zenviah Retail"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Spoken Greeting Script</Label>
                  <Textarea
                    rows={2}
                    value={customGreeting}
                    onChange={(e) => setCustomGreeting(e.target.value)}
                  />
                </div>
              </div>

              {/* SECTION 2: Template-Specific Tailored Configuration */}
              <div className="rounded-2xl border border-[#635BFF]/30 bg-[#635BFF]/5 p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#635BFF]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#171923]">
                      {customizingTemplate.specificConfig.specificSettingsTitle}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#777E90] mt-0.5">
                    {customizingTemplate.specificConfig.specificSettingsDescription}
                  </p>
                </div>

                {/* Specific Dynamic Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {customizingTemplate.specificConfig.specificField1Label && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        {customizingTemplate.specificConfig.specificField1Label}
                      </Label>
                      {customizingTemplate.specificConfig.specificField1Type === "select" ? (
                        <select
                          value={specificField1}
                          onChange={(e) => setSpecificField1(e.target.value)}
                          className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                        >
                          {customizingTemplate.specificConfig.specificField1Options?.map(
                            (opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <Input
                          value={specificField1}
                          onChange={(e) => setSpecificField1(e.target.value)}
                          placeholder={
                            customizingTemplate.specificConfig.specificField1Placeholder
                          }
                          className="bg-white"
                        />
                      )}
                    </div>
                  )}

                  {customizingTemplate.specificConfig.specificField2Label && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        {customizingTemplate.specificConfig.specificField2Label}
                      </Label>
                      {customizingTemplate.specificConfig.specificField2Type === "select" ? (
                        <select
                          value={specificField2}
                          onChange={(e) => setSpecificField2(e.target.value)}
                          className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                        >
                          {customizingTemplate.specificConfig.specificField2Options?.map(
                            (opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <Input
                          value={specificField2}
                          onChange={(e) => setSpecificField2(e.target.value)}
                          placeholder={
                            customizingTemplate.specificConfig.specificField2Placeholder
                          }
                          className="bg-white"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Specific Toggle */}
                {customizingTemplate.specificConfig.specificToggleLabel && (
                  <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] bg-white p-3 text-xs">
                    <div>
                      <p className="font-semibold text-[#171923]">
                        {customizingTemplate.specificConfig.specificToggleLabel}
                      </p>
                      <p className="text-[11px] text-[#777E90]">
                        {customizingTemplate.specificConfig.specificToggleDescription}
                      </p>
                    </div>
                    <Switch
                      checked={specificToggle}
                      onCheckedChange={setSpecificToggle}
                    />
                  </div>
                )}
              </div>

              {/* SECTION 3: Contacts List Upload (ONLY FOR OUTBOUND TEMPLATES) */}
              {customizingTemplate.specificConfig.requiresContactsUpload ? (
                <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-[#D97706]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#171923]">
                        Target Calling Contacts (CSV / Excel)
                      </h4>
                    </div>
                    <span className="rounded-full bg-[#F59E0B]/20 px-2 py-0.5 text-[10px] font-bold text-[#D97706]">
                      Required for Outbound
                    </span>
                  </div>

                  <p className="text-[11px] text-[#777E90]">
                    {customizingTemplate.specificConfig.contactsUploadDescription}
                  </p>

                  {/* Upload Box */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-dashed border-[#F59E0B]/40 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706]">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div>
                        {uploadedFileName ? (
                          <>
                            <p className="text-xs font-semibold text-[#171923] flex items-center gap-1.5">
                              {uploadedFileName}
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#16A36A]" />
                            </p>
                            <p className="text-[11px] text-[#777E90]">
                              {uploadedContactCount.toLocaleString("en-IN")} validated phone numbers (TRAI DND Scrubbed)
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-medium text-[#171923]">
                              Upload customer contact sheet (.csv, .xlsx)
                            </p>
                            <p className="text-[11px] text-[#777E90]">
                              Must include Phone (+91) and Customer Name
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="contacts-file-input"
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-[#111318] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#222631]"
                      >
                        {isUploading ? "Verifying..." : "Browse File"}
                      </Label>
                      <input
                        id="contacts-file-input"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleSimulateContactsUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#16A36A]/20 bg-[#16A36A]/5 p-3 text-xs flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#16A36A]" />
                  <div>
                    <p className="font-semibold text-[#171923]">
                      No Contacts Upload Required
                    </p>
                    <p className="text-[11px] text-[#777E90]">
                      {customizingTemplate.name} is an on-demand inbound agent. It receives calls from your callers directly and synchronizes with your calendar in real time.
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 4: Voice & Speech Engine */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                  3. Voice Persona & Speech Model
                </span>
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
                    <Label>Direction</Label>
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

                <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3 text-xs">
                  <div>
                    <p className="font-semibold text-[#171923]">
                      Enable Tamil-English & Hindi-English Code-Switching
                    </p>
                    <p className="text-[11px] text-[#777E90]">
                      Naturally blends English business vocabulary into regional Indian speech.
                    </p>
                  </div>
                  <Switch
                    checked={customCodeSwitching}
                    onCheckedChange={setCustomCodeSwitching}
                  />
                </div>
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
                  <span>Deploy Tailored Agent</span>
                </Button>
              </DialogFooter>
            </form>
          )}
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

              {/* Template Specific Logic Box */}
              <div className="rounded-xl border border-[#635BFF]/30 bg-[#635BFF]/5 p-3.5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#171923]">
                  <Sparkles className="h-4 w-4 text-[#635BFF]" />
                  <span>{previewTemplate.specificConfig.specificSettingsTitle}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4A5060]">
                  <div>
                    <span className="font-semibold text-[#171923]">Contacts Input: </span>
                    {previewTemplate.specificConfig.requiresContactsUpload
                      ? "CSV / Excel Customer Sheet Required"
                      : "None (Inbound Real-Time Caller Stream)"}
                  </div>
                  <div>
                    <span className="font-semibold text-[#171923]">Default Rule: </span>
                    {previewTemplate.specificConfig.specificField1Default || "Standard"}
                  </div>
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
