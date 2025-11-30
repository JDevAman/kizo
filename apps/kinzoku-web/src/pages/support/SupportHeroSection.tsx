import { Search } from "lucide-react";
import { InputField } from "../../components/Form/InputField";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const SupportHeroSection = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl lg:text-6xl font-thin text-white mb-6">
          How Can We{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Help?
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          Get the support you need, when you need it. Our team is here to help
          you succeed with KinzokuPay.
        </p>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <InputField
            type="text"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
        </div>
      </div>
    </section>
  );
};
