import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { HelpCircle } from "lucide-react";

interface FAQ {
  category: string;
  question: string;
  answer: string;
}

interface Category {
  id: string;
  label: string;
  icon: any;
}

interface Props {
  faqs: FAQ[];
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange?: (val: string) => void;
  searchTerm?: string;
}

export function FAQContent({
  faqs,
  categories,
  selectedCategory = "general",
  onCategoryChange,
  searchTerm = "",
}: Props) {
  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === "general" || faq.category === selectedCategory) &&
      (!searchTerm ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((c) => (
            <Button
              key={c.id}
              variant={selectedCategory === c.id ? "default" : "outline"}
              onClick={() => onCategoryChange?.(c.id)}
            >
              <c.icon className="w-4 h-4 mr-2" />
              {c.label}
            </Button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((faq, i) => (
            <Card key={i} className="bg-slate-900/30 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-400">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No results found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
