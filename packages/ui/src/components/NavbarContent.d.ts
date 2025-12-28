export interface NavItem {
    label: string;
    href: string;
}
interface NavbarContentProps {
    items: NavItem[];
    showAuthButtons?: boolean;
    signInHref?: string;
    signUpHref?: string;
    onSignIn?: () => void;
    onSignUp?: () => void;
    className?: string;
}
export declare function NavbarContent({ items, showAuthButtons, signInHref, signUpHref, onSignIn, onSignUp, className, }: NavbarContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NavbarContent.d.ts.map