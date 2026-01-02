export type Tab = "signin" | "signup";
export interface TabButtonProps {
  tab: Tab;
  activeTab: Tab;
  onClick: () => void;
  label: string;
  className?: string;
}
export declare function TabButton({
  tab,
  activeTab,
  onClick,
  label,
  className,
}: TabButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TabButton.d.ts.map
