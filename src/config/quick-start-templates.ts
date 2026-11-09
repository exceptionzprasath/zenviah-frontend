import {
  AIAgent,
  CallDirection,
  LLMProvider,
  SupportedLanguage,
  VoiceProvider,
} from "@/types";
import {
  CalendarCheck,
  MessageSquareHeart,
  Megaphone,
  PhoneForwarded,
  SlidersHorizontal,
} from "lucide-react";

export interface QuickStartTemplate {
  id: string;
  name: string;
  category: "Appointment Booking" | "Feedback & CSAT" | "Marketing & Outreach" | "Nurturing & Follow-up" | "Custom Engineering";
  tagline: string;
  description: string;
  iconName: "CalendarCheck" | "MessageSquareHeart" | "Megaphone" | "PhoneForwarded" | "SlidersHorizontal";
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
}

export const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  {
    id: "template-appointment-booking",
    name: "Appointment Booking AI",
    category: "Appointment Booking",
    tagline: "Automated slot discovery, calendar sync & instant confirmation",
    description:
      "Conversational voice agent designed for healthcare clinics, B2B sales teams, diagnostic labs, and service centers to book, reschedule, or cancel appointments in seconds.",
    iconName: "CalendarCheck",
    accentColor: "#635BFF",
    badge: "Most Popular",
    badgeVariant: "default",
    targetAudience: "Clinics, Hospitals, Salons, B2B Sales & Service Centers",
    recommendedFor: "High-volume appointment scheduling with calendar conflict prevention and instant WhatsApp / SMS confirmations.",
    defaultDirection: "Inbound",
    businessUseCase: "24/7 Automated Slot Scheduling & Calendar Synchronization",
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
      "Two-way sync with Google Calendar, Outlook 365 & HubSpot",
      "Dynamic date-time parsing in 8 Indian languages + English",
      "Real-time conflict detection & instant reschedule options",
      "Instant SMS & WhatsApp confirmation webhook trigger",
    ],
    extractedFields: ["department", "preferred_date", "preferred_time", "patient_phone"],
    workflowSteps: ["Inbound Call", "Greet & Department Intent", "Calendar Availability API", "Confirm Slot", "Dispatch WhatsApp/SMS Confirmation"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-hubspot", "int-sheets"],
  },
  {
    id: "template-feedback-ai",
    name: "Feedback AI",
    category: "Feedback & CSAT",
    tagline: "Automated post-purchase & post-service CSAT voice surveys",
    description:
      "High-response voice agent that conducts 45-second CSAT and NPS surveys after deliveries or service completions, capturing structured ratings and verbatim reasons.",
    iconName: "MessageSquareHeart",
    accentColor: "#16A36A",
    badge: "High Response",
    badgeVariant: "success",
    targetAudience: "E-Commerce, Hospitality, Food Delivery, Telecom & Field Service",
    recommendedFor: "Capturing 1-5 star ratings via speech or DTMF keypad, identifying dissatisfied customers, and escalating low ratings in real time.",
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
      "Captures ratings via voice speech recognition + DTMF keypad digits",
      "Automatic real-time ticket escalation for ratings ≤ 2",
      "Sentiment analysis & verbatim keyword tagging",
      "Automated export to Google Sheets, Zendesk & CRM",
    ],
    extractedFields: ["csat_rating", "feedback_category", "sentiment", "escalation_flag"],
    workflowSteps: ["Outbound Call", "Rate 1-5 Request", "Capture Voice / Keypad", "Sentiment Analysis", "Log Score & Escalate"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-sheets", "int-n8n"],
  },
  {
    id: "template-marketing-ai",
    name: "Marketing AI",
    category: "Marketing & Outreach",
    tagline: "Promotional discount broadcasts, event invites & lead generation",
    description:
      "Energetic, respectful outbound voice agent for flash sales, festive discount promotions, webinar registrations, and high-conversion commercial announcements.",
    iconName: "Megaphone",
    accentColor: "#F59E0B",
    badge: "High Conversion",
    badgeVariant: "warning",
    targetAudience: "Retail, D2C Brands, EdTech, Real Estate & SaaS Product Launches",
    recommendedFor: "Broadcasting limited-time promotional offers with instant WhatsApp coupon link dispatch while staying fully TRAI & DND compliant.",
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
      "Namaste! Main Zenviah Retail se Meera bol rahi hoon. Diwali festive sale mein aapke liye special 30% discount voucher unlock hua hai. Kya main offer link aapke WhatsApp par share karoon?",
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
      "One-click WhatsApp voucher / brochure webhook dispatch",
      "Strict TRAI commercial calling window enforcement (09:00 - 19:30 IST)",
      "Automatic DND registry scrubbing via Exotel / Airtel IQ",
      "Real-time opt-in tracking & conversion rate analytics",
    ],
    extractedFields: ["interest_level", "whatsapp_optin", "coupon_code_dispatched"],
    workflowSteps: ["Outbound Call", "Value Pitch", "Opt-in Check", "WhatsApp Webhook", "Conversion Tagging"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-hubspot", "int-zapier"],
  },
  {
    id: "template-followup-ai",
    name: "Followup AI",
    category: "Nurturing & Follow-up",
    tagline: "Smart lead nurturing, abandoned quote callbacks & renewal reminders",
    description:
      "Attentive and polite conversational advisor that follows up on unfinished website checkouts, unaccepted proposal quotes, and upcoming policy or EMI renewals.",
    iconName: "PhoneForwarded",
    accentColor: "#8B7CFF",
    badge: "Revenue Driver",
    badgeVariant: "default",
    targetAudience: "FinTech, Insurance, B2B SaaS, Automotive & Real Estate",
    recommendedFor: "Re-engaging warm prospects who reviewed pricing, answering common objections, and scheduling callbacks with senior sales reps.",
    defaultDirection: "Both",
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
      "Hello! This is Kavya calling from Zenviah Financial Solutions regarding the proposal quote you reviewed yesterday. Do you have two minutes to check if you had any questions regarding the coverage?",
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
      "Consultative objection handling tailored for high-ticket quotes",
      "Integrated callback scheduler with timezone intelligence",
      "Instant Razorpay / UPI payment link dispatch mid-call",
      "CRM deal stage auto-update in Salesforce, Zoho & HubSpot",
    ],
    extractedFields: ["proposal_status", "blocker_notes", "scheduled_callback", "payment_link_sent"],
    workflowSteps: ["Context Reference", "Objection Handling", "Action Offer", "Schedule Callback / Pay", "CRM Update"],
    estimatedSetupMinutes: 1,
    connectedIntegrations: ["int-exotel", "int-salesforce", "int-n8n"],
  },
  {
    id: "template-custom-config",
    name: "Custom Config",
    category: "Custom Engineering",
    tagline: "Build a blank-slate agent with custom prompt, tools & workflows",
    description:
      "Start with a customizable baseline template or dive into the full 6-Step Agent Wizard and visual React Flow builder for bespoke multi-turn enterprise logic.",
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
      "Full flexibility across all 5 LLM providers & 5 neural TTS engines",
      "Visual node-based routing in the React Flow Workflow Builder",
      "Custom JSON mid-call HTTP REST API webhooks",
      "Connect custom Knowledge Base RAG documents",
    ],
    extractedFields: ["custom_var_1", "custom_var_2"],
    workflowSteps: ["Custom Trigger", "Prompt LLM", "Tool Call", "Branch", "End Session"],
    estimatedSetupMinutes: 2,
    connectedIntegrations: ["int-exotel", "int-hubspot"],
  },
];

