import { JSX } from "react";
import { TypographyProps } from "../utils/utils.js";

export const Subheading = ({
  className = "",
  children,
}: TypographyProps): JSX.Element => {
  return <div className={`${className}`}>{children}</div>;
};

