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
export declare function FAQContent({ faqs, categories, selectedCategory, onCategoryChange, searchTerm, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FAQContent.d.ts.map