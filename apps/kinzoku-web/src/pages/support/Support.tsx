import { useState } from "react";
import { FooterSection } from "../../components/Layout/FooterSection";
import { SupportHeroSection } from "./SupportHeroSection";
import { SupportOptionGrid } from "./SupportOptionGrid";
import { FAQSection } from "./FAQSection";

import {
  Zap,
  HelpCircle,
  CheckCircle,
  MessageCircle,
  Mail,
  Phone,
  Book,
} from "lucide-react";
import type { FAQ, Category, SupportOption } from "../../utils/types";
import { SupportContactForm } from "./ContactForm";
import { SupportSystemStatus } from "./SystemStatus";

export function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");

  const faqs: FAQ[] = [
    {
      category: "general",
      question: "How do I create an account?",
      answer: "Click 'Sign Up' on the homepage and follow the instructions.",
    },
    {
      category: "payments",
      question: "How long do transfers take?",
      answer: "Usually instant for domestic; international may take 1–3 days.",
    },
    {
      category: "billing",
      question: "Can I cancel a payment or request?",
      answer: "Payments are final once processed. Double-check before sending.",
    },
    {
      category: "technical",
      question: "When will MFA feature arrive?",
      answer:
        "It is under planned",
    },
  ];

  const categories: Category[] = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "payments", label: "Payments", icon: Zap },
    { id: "billing", label: "Billing", icon: CheckCircle },
    { id: "technical", label: "Technical", icon: Book },
  ];

  const options: SupportOption[] = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our chatbot",
      availability: "Available 24/7",
      action: "Start Chat",
      color: "text-green-400",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24 hours",
      action: "Send Email",
      color: "text-blue-400",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      availability: "Enterprise customers only",
      action: "Schedule Call",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <SupportHeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <SupportOptionGrid options={options} />
      <FAQSection
        faqs={faqs}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
      />
      <SupportSystemStatus />
      <SupportContactForm />
      <FooterSection />
    </div>
  );
}
