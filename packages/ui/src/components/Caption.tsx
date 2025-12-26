import { JSX } from "react";
import { TypographyProps } from "../utils/utils";

export const Caption = ({
  className = "",
  children,
}: TypographyProps): JSX.Element => {
  return <div className={`${className}`}>{children}</div>;
};
