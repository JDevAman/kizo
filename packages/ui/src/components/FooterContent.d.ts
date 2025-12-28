interface FooterLink {
    label: string;
    onClick?: () => void;
    href?: string;
}
interface FooterContentProps {
    links?: FooterLink[];
}
export declare function FooterContent({ links }: FooterContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FooterContent.d.ts.map