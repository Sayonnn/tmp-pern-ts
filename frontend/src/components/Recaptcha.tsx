import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import type { RecaptchaProps } from "../interfaces/authInterface";
import useAppContext from "../hooks/useApp";
import { fetchData } from "../services/axios.service";

export interface RecaptchaRef {
  reset: () => void;
  getValue: () => string | null;
  checkSession: () => Promise<boolean>;
}

const Recaptcha = forwardRef<RecaptchaRef, RecaptchaProps>(({ onChange }, ref) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { configs } = useAppContext();
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const checkSession = async () => {
    try {
      const response = await fetchData({ url: "/recaptcha/check-session" });
      return response?.valid || false;
    } catch (error) {
      console.error("Failed to check reCAPTCHA session:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkExistingSession = async () => {
      setIsCheckingSession(true);
      const isValid = await checkSession();
      setHasValidSession(isValid);
      setIsCheckingSession(false);

      // If session is valid, automatically trigger onChange with session indicator
      if (isValid && onChange) {
        onChange("SESSION_VALID");
      }
    };

    checkExistingSession();
  }, []);

  useImperativeHandle(ref, () => ({
    reset: () => {
      recaptchaRef.current?.reset();
      // Re-check session after reset
      checkSession().then(isValid => {
        setHasValidSession(isValid);
        if (isValid && onChange) {
          onChange("SESSION_VALID");
        }
      });
    },
    getValue: () => {
      if (hasValidSession) return "SESSION_VALID";
      return recaptchaRef.current?.getValue() ?? null;
    },
    checkSession: checkSession,
  }));

  const handleChange = (token: string | null) => {
    if (onChange) {
      onChange(token);
    }
  };

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-md text-center text-gray-500 py-4">
          Checking verification status...
        </div>
      </div>
    );
  }

  // If user has valid session, show success message instead of reCAPTCHA
  if (hasValidSession) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-md bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Verification confirmed</span>
          </div>
          <p className="text-sm text-green-600 mt-1">You're verified for the next 30 minutes</p>
        </div>
      </div>
    );
  }

  // Show normal reCAPTCHA if no valid session
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-md">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={configs.recaptchaSiteKey}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});

export default Recaptcha;
