import { forwardRef, useImperativeHandle, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import type { RecaptchaProps } from "../interfaces/authInterface";
import useAppContext from "../hooks/useApp";

export interface RecaptchaRef {
  reset: () => void;
  getValue: () => string | null;
}

const Recaptcha = forwardRef<RecaptchaRef, RecaptchaProps>(({ onChange }, ref) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { configs } = useAppContext();

  useImperativeHandle(ref, () => ({
    reset: () => recaptchaRef.current?.reset(),
    getValue: () => recaptchaRef.current?.getValue() ?? null,
  }));

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-md">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={configs.recaptchaSiteKey}
          onChange={onChange}
        />
      </div>
    </div>
  );
});

export default Recaptcha;
