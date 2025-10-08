import React from "react";
import { Link } from "react-router-dom";
import type { ForgotPasswordLinkProps } from "../../interfaces/formsInterface";

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  to = "/forgot-password",
  children = "Forgot Password?",
  className = "",
}) => {
  return (
    <div className="flex justify-end">
      <Link
        to={to}
        className={`text-sm text-blue-600 hover:underline transition ${className}`}
      >
        {children}
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;
