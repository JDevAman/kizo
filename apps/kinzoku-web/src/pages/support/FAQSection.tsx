import { Card, CardContent } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { HelpCircle } from "lucide-react";
import { FAQ, Category } from "../../utils/types";

interface Props {
  faqs: FAQ[];
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  searchTerm: string;
}

export const FAQSection = ({
  faqs,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
}: Props) => {
  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === "general" || faq.category === selectedCategory) &&
      (searchTerm === "" ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-thin text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-400">
            Find answers to common questions
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`$ {
                selectedCategory === category.id
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                  : "border-slate-700 hover:border-cyan-500/50"
              }`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {filteredFaqs.map((faq, index) => (
            <Card key={index} className="bg-slate-900/30 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No results found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search terms or browse different categories
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
