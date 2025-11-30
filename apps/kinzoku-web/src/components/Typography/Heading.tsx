import React, { JSX } from "react";
import TypographyProps from "./TypographyProps";

const Heading = ({
  className = "",
  children,
}: TypographyProps): JSX.Element => {
  return <div className={`${className}`}>{children}</div>;
};

export default Heading;
