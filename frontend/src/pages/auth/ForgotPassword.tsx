import { useRef, useState } from "react";
import { useNotification } from "../../hooks/useNotification";
import TextInput from "../../components/inputs/Text.input";
import SubmitButton from "../../components/buttons/Submit.button";
import Recaptcha, { type RecaptchaRef } from "../../components/Recaptcha";
import ClientService from "../../services/api.service";
import { postDatas } from "../../services/axios.service";

function ForgotPassword() {
  const { notify } = useNotification();

  const recaptchaRef = useRef<RecaptchaRef>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(null);
    setLoading(true);

    if (!email.trim()) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    }

    if (!recaptchaToken) {
      notify && notify("Please complete the CAPTCHA", "error");
      setLoading(false);
      return;
    }

    try {
      // Verify reCAPTCHA with backend
      const recaptchaRes = await postDatas({
        url: "/recaptcha",
        data: { token: recaptchaToken },
      });

      if (!recaptchaRes.success) {
        notify && notify("CAPTCHA verification failed", "error");
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        setLoading(false);
        return;
      }

      // Proceed with forgot password
      await ClientService.auth.forgotPassword({ email });
      setLoading(false);
      notify && notify("Password reset email sent, please check your email", "success");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } catch (err: any) {
      setLoading(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      notify && notify(err.message || "Failed to send reset email", "error");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Forgot Password</h1>

        <TextInput
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          error={emailError}
        />

        <Recaptcha
          ref={recaptchaRef}
          onChange={(token) => setRecaptchaToken(token)}
        />

        <SubmitButton loading={loading} label="Send Reset Link" />
      </form>
    </section>
  );
}

export default ForgotPassword;
