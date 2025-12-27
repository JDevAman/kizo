import { useState } from "react";
import {
  SupportHeroContent,
  FAQContent,
  SupportOptionGrid,
  SupportSystemStatus,
  SupportContactForm,
} from "@kizo/ui";
import { FooterSection } from "../../components/FooterSection";
import type { FAQ, Category, SupportOption } from "../../utils/types";
import {
  Zap,
  HelpCircle,
  CheckCircle,
  MessageCircle,
  Mail,
  Phone,
  Book,
} from "lucide-react";

export function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");

  /* ---------------- FAQ DATA ---------------- */

  const faqs: FAQ[] = [
    {
      category: "general",
      question: "How do I create an account?",
      answer: "Click 'Sign Up' on the homepage and follow the instructions.",
    },
    {
      category: "payments",
      question: "How long do transfers take?",
      answer:
        "Domestic transfers are instant; international transfers take 1–3 days.",
    },
    {
      category: "billing",
      question: "Can I cancel a payment?",
      answer:
        "Payments are final once processed. Please double-check before sending.",
    },
    {
      category: "technical",
      question: "When will MFA be available?",
      answer: "Multi-factor authentication is planned and coming soon.",
    },
  ];

  const categories: Category[] = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "payments", label: "Payments", icon: Zap },
    { id: "billing", label: "Billing", icon: CheckCircle },
    { id: "technical", label: "Technical", icon: Book },
  ];

  /* ---------------- SUPPORT OPTIONS ---------------- */

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

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-black">
      <SupportHeroContent
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <SupportOptionGrid options={options} />

      <FAQContent
        faqs={faqs}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
      />

      <SupportSystemStatus />
      <SupportContactForm />
      <FooterSection />
    </div>
  );
}
