import React from "react";
import type { LoginButtonProps } from "../../interfaces/formsInterface";

const SubmitButton: React.FC<LoginButtonProps> = ({ loading = false, label = "Login" }) => {
  return (
    <button  
      type="submit"
      disabled={loading}
      className="py-4 bg-sky-500 text-white rounded-lg shadow-md 
                 hover:bg-sky-600 disabled:opacity-50 transition-all w-full
                 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1 cursor-pointer"
    >
      {loading ? "Sending..." : label}
    </button>
  );
};

export default SubmitButton;
