import React from "react";
import { Link } from "react-router-dom";
import type { PrimaryLinkProps } from "../../interfaces/formsInterface";

const PrimaryLink: React.FC<PrimaryLinkProps> = ({ to, children, className = "" }) => {
  return (
    <Link
      to={to}
      className={`text-blue-600 hover:underline transition ${className}`}
    >
      {children}
    </Link>
  );
};

export default PrimaryLink;
