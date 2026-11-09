import {
  AIAgent,
  CallDirection,
  LLMProvider,
  SupportedLanguage,
  VoiceProvider,
} from "@/types";

export type TemplateTypeKey =
  | "appointment-booking"
  | "feedback-ai"
  | "marketing-ai"
  | "followup-ai"
  | "custom-config";

export interface TemplateSpecificConfig {
  requiresContactsUpload: boolean;
  contactsUploadDescription?: string;
  sampleContactsFile?: string;
  defaultContactCount?: number;
  // Specific settings tags & labels
  specificSettingsTitle: string;
  specificSettingsDescription: string;
  // Dynamic fields specific to this template
  specificField1Label?: string;
  specificField1Placeholder?: string;
  specificField1Default?: string;
  specificField1Type?: "text" | "select" | "number";
  specificField1Options?: string[];
  
  specificField2Label?: string;
  specificField2Placeholder?: string;
  specificField2Default?: string;
  specificField2Type?: "text" | "select" | "number";
  specificField2Options?: string[];

  specificToggleLabel?: string;
  specificToggleDescription?: string;
  specificToggleDefault?: boolean;
}

export interface QuickStartTemplate {
  id: string;
  typeKey: TemplateTypeKey;
  name: string;
  category:
    | "Appointment Booking"
    | "Feedback & CSAT"
    | "Marketing & Outreach"
    | "Nurturing & Follow-up"
    | "Custom Engineering";
  tagline: string;
  description: string;
  iconName:
    | "CalendarCheck"
    | "MessageSquareHeart"
    | "Megaphone"
    | "PhoneForwarded"
    | "SlidersHorizontal";
  accentColor: string;
  badge: string;
  badgeVariant: "default" | "success" | "warning" | "secondary" | "dark";
  targetAudience: string;
  recommendedFor: string;
  defaultDirection: CallDirection | "Both";
  businessUseCase: string;
  // Default Agent Specifications
  llmProvider: LLMProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  responseBehavior: AIAgent["responseBehavior"];
  voiceProvider: VoiceProvider;
  voiceId: string;
  voiceName: string;
  voiceGender: "Female" | "Male" | "Neutral";
  language: SupportedLanguage;
  codeSwitching: boolean;
  speakingSpeed: number;
  interruptionSensitivity: "Low" | "Medium" | "High";
  greetingMessage: string;
  systemPrompt: string;
  conversationInstructions: string;
  sampleAudioQuote: string;
  keyHighlights: string[];
  extractedFields: string[];
  workflowSteps: string[];
  estimatedSetupMinutes: number;
  connectedIntegrations: string[];
  // Template-Specific tailored configuration
  specificConfig: TemplateSpecificConfig;
}

export const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  {
    id: "template-appointment-booking",
    typeKey: "appointment-booking",
    name: "Appointment Booking AI",
    category: "Appointment Booking",
    tagline: "Automated slot discovery, calendar sync & instant confirmation",
    description:
      "Inbound & on-demand conversational voice agent designed for healthcare clinics, B2B sales teams, salons, and diagnostic labs to check slot availability and book directly into calendars.",
    iconName: "CalendarCheck",
    accentColor: "#635BFF",
    badge: "Calendar Sync",
    badgeVariant: "default",
    targetAudience: "Clinics, Hospitals, Salons, B2B Sales & Service Centers",
    recommendedFor: "High-volume inbound appointment requests with two-way calendar conflict detection and instant WhatsApp / SMS confirmations.",
    defaultDirection: "Inbound",
    businessUseCase: "24/7 Inbound Slot Scheduling & Calendar Synchronization",
    llmProvider: "Google Gemini",
    model: "gemini-2.0-flash",
    temperature: 0.3,
    maxTokens: 450,
    responseBehavior: "Balanced & Conversational",
    voiceProvider: "Sarvam AI",
    voiceId: "sarvam-ananya-ta-en",
    voiceName: "Ananya (Indic Neural)",
    voiceGender: "Female",
    language: "English (India)",
    codeSwitching: true,
    speakingSpeed: 1.0,
    interruptionSensitivity: "High",
    greetingMessage:
      "Hello! Thank you for calling Apollo Care Clinic. I can help you schedule, reschedule, or check doctor consultation slots today. Which department or specialist would you like to visit?",
    systemPrompt: `You are an automated appointment scheduling voice specialist for Zenviah.ai partner clinics.
Your goal is to collect:
1) Department or Doctor name (e.g., Cardiology, General Physician, Dental, Pediatrics).
2) Preferred consultation date and time (morning or afternoon).
3) Caller's full name and registered phone number.
Always offer two open slot options (e.g. 10:30 AM or 3:00 PM).
Once the patient confirms their slot, summarize the appointment details and confirm that an instant WhatsApp & SMS confirmation link is dispatched.
Maintain an empathetic, patient, and reassuring healthcare tone.`,
    conversationInstructions:
      "Always verify the preferred slot with the caller. Never book without verbal confirmation.",
    sampleAudioQuote:
      "Hello! I've reserved your dental consultation slot for tomorrow at 10:30 AM. You will receive an SMS confirmation link momentarily.",
    keyHighlights: [
      "Inbound focused: No bulk contact list upload needed",
      "Two-way live sync with Google Calendar, Outlook 365 & Cal.com",
      "Dynamic date-time parsing in 8 Indian languages + English",
      "Instant SMS & WhatsApp confirmation link dispatch",
    ],
    extractedFields: ["department", "preferred_date", "preferred_time", "patient_phone"],
    workflowSteps: ["Inbound Call", "Department & Doctor Intent", "Calendar Availability API", "Confirm Slot", "Dispatch WhatsApp/SMS Confirmation"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-hubspot", "int-sheets"],
    specificConfig: {
      requiresContactsUpload: false,
      specificSettingsTitle: "Calendar & Clinic Scheduling Rules",
      specificSettingsDescription: "Configure your live calendar connection and default consultation buffers.",
      specificField1Label: "Calendar Integration Provider",
      specificField1Type: "select",
      specificField1Default: "Google Calendar",
      specificField1Options: ["Google Calendar", "Outlook 365", "Cal.com", "HubSpot Meetings", "Custom Webhook API"],
      specificField2Label: "Default Consultation Slot Duration",
      specificField2Type: "select",
      specificField2Default: "30 Minutes",
      specificField2Options: ["15 Minutes", "30 Minutes", "45 Minutes", "60 Minutes"],
      specificToggleLabel: "Auto-Send WhatsApp & SMS Confirmation Link",
      specificToggleDescription: "Immediately trigger an automated SMS/WhatsApp booking receipt upon verbal confirmation.",
      specificToggleDefault: true,
    },
  },
  {
    id: "template-feedback-ai",
    typeKey: "feedback-ai",
    name: "Feedback AI",
    category: "Feedback & CSAT",
    tagline: "Automated post-purchase & post-service CSAT voice surveys",
    description:
      "Outbound voice agent that calls customer cohorts post-delivery or post-service to capture structured 1-5 star ratings, speech NPS, and verbatim pain points with instant escalation.",
    iconName: "MessageSquareHeart",
    accentColor: "#16A36A",
    badge: "Contact Upload Ready",
    badgeVariant: "success",
    targetAudience: "E-Commerce, Hospitality, Food Delivery, Telecom & Field Service",
    recommendedFor: "Conducting automated outbound CSAT surveys with CSV/Excel contact uploads, capturing keypad/voice ratings, and escalating low ratings.",
    defaultDirection: "Outbound",
    businessUseCase: "Post-Delivery Customer Satisfaction (CSAT) & Instant Escalation",
    llmProvider: "OpenAI",
    model: "gpt-4o-mini",
    temperature: 0.2,
    maxTokens: 350,
    responseBehavior: "Concise & Fast",
    voiceProvider: "ElevenLabs",
    voiceId: "eleven-aarav-en-in",
    voiceName: "Aarav (Enterprise Executive)",
    voiceGender: "Male",
    language: "English (India)",
    codeSwitching: true,
    speakingSpeed: 1.05,
    interruptionSensitivity: "High",
    greetingMessage:
      "Hi there! This is Aarav from Zenviah Experience Team calling regarding your recent order delivery. Do you have 30 seconds to rate your experience on a scale of 1 to 5 stars?",
    systemPrompt: `You are an automated customer feedback voice agent for Zenviah.ai.
1) Ask the customer to rate their recent experience from 1 to 5 stars (accept voice or DTMF keypad input).
2) If rating is 4 or 5: Thank them warmly, ask what they liked best, and wish them a wonderful day.
3) If rating is 1, 2, or 3: Express sincere empathy, ask for the specific pain point (delay, damaged goods, or staff behavior), and offer to initiate an urgent supervisor callback or support ticket.
Always keep calls under 90 seconds.`,
    conversationInstructions:
      "Be polite, concise, and non-defensive. Never dispute negative feedback; log the verbatim issue.",
    sampleAudioQuote:
      "Thank you for the 5-star rating! We are thrilled your package arrived safely. Have a wonderful day ahead!",
    keyHighlights: [
      "Bulk CSV / Excel customer contact list upload supported",
      "Captures ratings via voice speech recognition + DTMF keypad digits",
      "Automatic real-time ticket escalation for ratings ≤ 2",
      "Instant sync to Google Sheets, Zendesk & CRM pipelines",
    ],
    extractedFields: ["csat_rating", "feedback_category", "sentiment", "escalation_flag"],
    workflowSteps: ["Upload Contact Cohort", "Outbound Survey Call", "Rate 1-5 Request", "Sentiment Analysis", "Log Score & Escalate"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-sheets", "int-n8n"],
    specificConfig: {
      requiresContactsUpload: true,
      contactsUploadDescription: "Upload a CSV/Excel file containing customer numbers, recent order IDs, and purchase dates for outbound surveying.",
      sampleContactsFile: "csat_customers_sample.csv",
      defaultContactCount: 150,
      specificSettingsTitle: "Feedback Survey & Escalation Thresholds",
      specificSettingsDescription: "Define how low scores are escalated to human supervisors.",
      specificField1Label: "Escalation Rating Threshold",
      specificField1Type: "select",
      specificField1Default: "Rating 2 or below",
      specificField1Options: ["Rating 1 only", "Rating 2 or below", "Rating 3 or below"],
      specificField2Label: "Post-Survey Data Destination",
      specificField2Type: "select",
      specificField2Default: "Google Sheets + CRM Webhook",
      specificField2Options: ["Google Sheets + CRM Webhook", "Zendesk Support Tickets", "Freshdesk CRM", "Internal Webhook Only"],
      specificToggleLabel: "Allow DTMF Keypad Rating (Press 1 to 5 on Dialpad)",
      specificToggleDescription: "Enables customers in noisy environments to tap keypad numbers instead of speaking.",
      specificToggleDefault: true,
    },
  },
  {
    id: "template-marketing-ai",
    typeKey: "marketing-ai",
    name: "Marketing AI",
    category: "Marketing & Outreach",
    tagline: "Promotional discount broadcasts, event invites & lead generation",
    description:
      "High-energy outbound voice campaign agent for festive sales, webinar registrations, product launches, and discount voucher delivery via WhatsApp.",
    iconName: "Megaphone",
    accentColor: "#F59E0B",
    badge: "Contact Upload Ready",
    badgeVariant: "warning",
    targetAudience: "Retail, D2C Brands, EdTech, Real Estate & SaaS Product Launches",
    recommendedFor: "Broadcasting limited-time promotional offers with bulk contact list uploads, instant WhatsApp coupon link dispatch, and TRAI DND scrubbing.",
    defaultDirection: "Outbound",
    businessUseCase: "Targeted Promotional Broadcast & Instant WhatsApp Voucher Dispatch",
    llmProvider: "Google Gemini",
    model: "gemini-2.0-flash",
    temperature: 0.35,
    maxTokens: 400,
    responseBehavior: "Concise & Fast",
    voiceProvider: "Sarvam AI",
    voiceId: "sarvam-meera-hi-en",
    voiceName: "Meera (Bharatiya HD)",
    voiceGender: "Female",
    language: "Hindi-English (Hinglish)",
    codeSwitching: true,
    speakingSpeed: 1.02,
    interruptionSensitivity: "High",
    greetingMessage:
      "Namaste! Main Zenviah Retail se Meera bol rahi hoon. Festive sale mein aapke liye special 30% discount voucher unlock hua hai. Kya main offer link aapke WhatsApp par share karoon?",
    systemPrompt: `You are Meera, a high-converting promotional voice concierge at Zenviah.ai.
Introduce the limited-time discount or exclusive offer with high energy and utmost respect.
Clearly articulate the benefit: 30% off on all collections valid till this Sunday.
Ask if the customer is interested in receiving the voucher code directly on their registered WhatsApp.
If yes: trigger the WhatsApp dispatch webhook immediately and confirm.
If no: politely thank them and end the call gracefully.
Strictly adhere to TRAI calling hours (09:00 - 19:30 IST) and DND guidelines.`,
    conversationInstructions:
      "Respect customer time. If caller says not interested, immediately apologize and end politely without being pushy.",
    sampleAudioQuote:
      "Namaste! Aapka special 30% discount coupon code aapke WhatsApp number par deliver ho gaya hai. Happy festive shopping!",
    keyHighlights: [
      "Bulk CSV / Excel leads upload with automated DND scrubbing",
      "One-click WhatsApp voucher / brochure webhook dispatch",
      "Strict TRAI commercial calling window enforcement (09:00 - 19:30 IST)",
      "Real-time opt-in tracking & conversion rate telemetry",
    ],
    extractedFields: ["interest_level", "whatsapp_optin", "coupon_code_dispatched"],
    workflowSteps: ["Upload Leads List", "TRAI DND Scrubbing", "Value Pitch Call", "WhatsApp Voucher Trigger", "Conversion Tagging"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-hubspot", "int-zapier"],
    specificConfig: {
      requiresContactsUpload: true,
      contactsUploadDescription: "Upload your target customer list (CSV/Excel) with fields: Phone, Customer Name, and Custom Promo Tag.",
      sampleContactsFile: "promotional_leads_sample.csv",
      defaultContactCount: 500,
      specificSettingsTitle: "Promotional Offer & Regulatory Guardrails",
      specificSettingsDescription: "Configure your discount hook, WhatsApp voucher link, and TRAI calling hours.",
      specificField1Label: "Voucher / Promo Code",
      specificField1Type: "text",
      specificField1Default: "FESTIVE30",
      specificField1Placeholder: "e.g., FESTIVE30 or WELCOME20",
      specificField2Label: "Maximum Outbound Concurrency (Parallel Calls)",
      specificField2Type: "select",
      specificField2Default: "25 Concurrent Channels",
      specificField2Options: ["10 Concurrent Channels", "25 Concurrent Channels", "50 Concurrent Channels", "100 Concurrent Channels"],
      specificToggleLabel: "Enforce TRAI 09:00 - 19:30 IST Calling Window",
      specificToggleDescription: "Automatically pauses outbound dialer outside official Indian commercial calling hours.",
      specificToggleDefault: true,
    },
  },
  {
    id: "template-followup-ai",
    typeKey: "followup-ai",
    name: "Followup AI",
    category: "Nurturing & Follow-up",
    tagline: "Smart lead nurturing, abandoned quote callbacks & renewal reminders",
    description:
      "Consultative outbound voice agent that calls qualified leads, demo attendees, abandoned cart customers, and expiring policy holders with personalized context.",
    iconName: "PhoneForwarded",
    accentColor: "#8B7CFF",
    badge: "Contact Upload Ready",
    badgeVariant: "default",
    targetAudience: "FinTech, Insurance, B2B SaaS, Automotive & Real Estate",
    recommendedFor: "Re-engaging warm prospects with bulk CSV contact lists, consultative objection clearing, payment link delivery, and sales rep transfer.",
    defaultDirection: "Outbound",
    businessUseCase: "Automated Quote Followup & Seamless Callback Scheduling",
    llmProvider: "Anthropic",
    model: "claude-3-5-sonnet",
    temperature: 0.25,
    maxTokens: 450,
    responseBehavior: "Detailed & Empathetic",
    voiceProvider: "ElevenLabs",
    voiceId: "eleven-kavya-multilingual",
    voiceName: "Kavya (Multilingual v2)",
    voiceGender: "Female",
    language: "English (India)",
    codeSwitching: true,
    speakingSpeed: 1.0,
    interruptionSensitivity: "Medium",
    greetingMessage:
      "Hello! This is Kavya calling from Zenviah Solutions regarding the quote you reviewed yesterday. Do you have two minutes to check if you had any questions regarding the coverage terms?",
    systemPrompt: `You are Kavya, an attentive and professional follow-up advisor at Zenviah.ai.
You are contacting leads who requested a proposal or quote recently.
Inquire if they have reviewed the document and if any questions remain regarding terms, pricing, or onboarding timelines.
Address common objections calmly and clearly.
If the prospect is ready: offer to send the secure Razorpay payment link or schedule a live screen-share with a senior account manager.
If the prospect is busy: promptly ask for a convenient callback time and schedule the calendar entry.
Always maintain an empathetic, consultative tone.`,
    conversationInstructions:
      "Empathetic, advisory tone. Never push aggressive sales tactics. Focus on clearing doubts and solving blockers.",
    sampleAudioQuote:
      "Thank you! I've scheduled a quick 10-minute walkthrough with our senior advisor for tomorrow at 4 PM IST. Have a great day!",
    keyHighlights: [
      "Bulk CSV / Excel qualified lead list upload supported",
      "Contextual objection handling tailored for high-ticket quotes",
      "Instant Razorpay / UPI payment link dispatch mid-call",
      "Direct transfer to human sales executive if high intent detected",
    ],
    extractedFields: ["proposal_status", "blocker_notes", "scheduled_callback", "payment_link_sent"],
    workflowSteps: ["Upload Warm Leads", "Contextual Recall", "Objection Handling", "Send Payment Link / Transfer", "CRM Deal Update"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-salesforce", "int-n8n"],
    specificConfig: {
      requiresContactsUpload: true,
      contactsUploadDescription: "Upload a CSV/Excel list containing Lead Name, Phone, Quote Amount, and Last Interaction Date.",
      sampleContactsFile: "abandoned_quotes_sample.csv",
      defaultContactCount: 85,
      specificSettingsTitle: "Follow-Up Context & Human Handoff",
      specificSettingsDescription: "Configure sales escalation triggers and payment link integrations.",
      specificField1Label: "Human Sales Transfer Phone (+91)",
      specificField1Type: "text",
      specificField1Default: "+91 98400 12345",
      specificField1Placeholder: "+91 98400 12345",
      specificField2Label: "Payment Gateway Connector",
      specificField2Type: "select",
      specificField2Default: "Razorpay Payment Links",
      specificField2Options: ["Razorpay Payment Links", "Cashfree Payments", "Stripe Invoice", "Custom UPI Webhook"],
      specificToggleLabel: "Warm Transfer to Live Rep on High Buying Intent",
      specificToggleDescription: "Instantly bridges call to your designated sales executive if prospect asks to finalize purchase.",
      specificToggleDefault: true,
    },
  },
  {
    id: "template-custom-config",
    typeKey: "custom-config",
    name: "Custom Config",
    category: "Custom Engineering",
    tagline: "Build a bespoke agent with custom prompt, tools & workflows",
    description:
      "Start with a flexible baseline template or open the full 6-Step Agent Wizard and visual React Flow builder for bespoke multi-turn enterprise logic.",
    iconName: "SlidersHorizontal",
    accentColor: "#111318",
    badge: "Full Flexibility",
    badgeVariant: "secondary",
    targetAudience: "Developers, Voice Architects & Complex Multi-turn Enterprise Workflows",
    recommendedFor: "Custom REST tool calling, bespoke SIP routing, private fine-tuned LLMs, and multi-agent handoffs.",
    defaultDirection: "Both",
    businessUseCase: "Custom Multi-Turn Voice Application",
    llmProvider: "Google Gemini",
    model: "gemini-2.0-flash",
    temperature: 0.3,
    maxTokens: 500,
    responseBehavior: "Balanced & Conversational",
    voiceProvider: "Sarvam AI",
    voiceId: "sarvam-ananya-ta-en",
    voiceName: "Ananya (Indic Neural)",
    voiceGender: "Female",
    language: "English (India)",
    codeSwitching: true,
    speakingSpeed: 1.0,
    interruptionSensitivity: "High",
    greetingMessage:
      "Hello! Welcome to your custom Zenviah.ai voice agent. How can I assist you with your request today?",
    systemPrompt: `You are a custom AI voice agent configured inside Zenviah.ai.
Follow your enterprise business guidelines, reference attached knowledge bases, and respond accurately to caller inputs in natural conversational speech.`,
    conversationInstructions:
      "Custom instructions defined by workspace operator. Adjust tone, guardrails, and timeouts to match your exact business requirements.",
    sampleAudioQuote:
      "Hello! Your custom voice pipeline is initialized and ready to process real-time voice streaming.",
    keyHighlights: [
      "Optional contacts: Choose between Inbound, Outbound, or Both",
      "Full flexibility across all 5 LLM providers & 5 neural TTS engines",
      "Direct deep-link to 6-Step Agent Wizard and Visual Workflow editor",
      "Custom REST webhooks and external database grounding",
    ],
    extractedFields: ["custom_field_1", "custom_field_2", "conversation_summary"],
    workflowSteps: ["Call Inbound / Outbound", "Custom Prompt Reasoning", "External REST API Tool", "Conditional Branching", "Final Handoff"],
    estimatedSetupMinutes: 2,
    connectedIntegrations: ["int-exotel", "int-n8n"],
    specificConfig: {
      requiresContactsUpload: false,
      specificSettingsTitle: "Custom Architecture & Advanced Tools",
      specificSettingsDescription: "Configure low-latency parameters, temperature, and advanced tool calling.",
      specificField1Label: "Primary Business Domain",
      specificField1Type: "text",
      specificField1Default: "Enterprise Telephony & Support",
      specificField1Placeholder: "e.g., Banking, Logistics, SaaS, Healthcare",
      specificField2Label: "LLM Reasoning Temperature (Creativity)",
      specificField2Type: "select",
      specificField2Default: "0.3 (Strict & Deterministic)",
      specificField2Options: ["0.1 (Strict & Precise)", "0.3 (Strict & Deterministic)", "0.6 (Balanced & Conversational)", "0.8 (Creative)"],
      specificToggleLabel: "Enable Custom Webhook & External API Tool Calling",
      specificToggleDescription: "Allows this agent to query your backend microservices mid-call to fetch live account records.",
      specificToggleDefault: true,
    },
  },
];
