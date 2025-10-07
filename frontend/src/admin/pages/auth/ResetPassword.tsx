import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNotification } from "../../../hooks/useNotification";
import PasswordInput from "../../../components/inputs/Password.input";
import LoginButton from "../../../components/buttons/Login.button";
import AdminService from "../../services/api.service";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setConfirmPasswordError(null);
    setLoading(true);

    if (!password.trim()) setPasswordError("Password is required");
    if (password !== confirmPassword) setConfirmPasswordError("Passwords do not match");
    if (!password || password !== confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      await AdminService.auth.resetPassword({token, password });
      setLoading(false);
      notify && notify("Password reset successful!", "success");
      navigate("/login");
    } catch (err: any) {
      setLoading(false);
      notify && notify(err.message || "Failed to reset password", "error");
    }
  };

  if(!token) {
    window.location.href = "/login";
    return;
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Reset Password</h1>

        <PasswordInput
          name="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          error={passwordError}
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          error={confirmPasswordError}
        />

        <LoginButton loading={loading} label="Reset Password" />
      </form>
    </section>
  );
}

export default ResetPassword;
