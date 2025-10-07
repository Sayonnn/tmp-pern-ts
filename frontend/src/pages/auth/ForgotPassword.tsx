import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import TextInput from "../../components/inputs/Text.input";
import LoginButton from "../../components/buttons/Login.button";

function ForgotPassword() {
  const navigate = useNavigate();
  const { notify } = useNotification();

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

    try {
      // TODO: Implement forgot password API
      setLoading(false);
      notify && notify("Password reset email sent", "success");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setLoading(false);
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

        {/* Optional 2FA or CAPTCHA placeholder */}
        <div className="bg-gray-200 h-16 flex items-center justify-center rounded text-sm text-gray-500">
          CAPTCHA / 2FA placeholder
        </div>

        <LoginButton loading={loading} label="Send Reset Link" />
      </form>
    </section>
  );
}

export default ForgotPassword;
