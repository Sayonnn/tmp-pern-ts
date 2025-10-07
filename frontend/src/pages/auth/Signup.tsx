import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import TextInput from "../../components/inputs/Text.input";
import PasswordInput from "../../components/inputs/Password.input";
import LoginButton from "../../components/buttons/Login.button";
import ClientService from "../../services/api.service";
import GoogleButton from "../../components/buttons/Google.button";

function Signup() {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  /** Handle submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    setLoading(true);

    if (!username.trim()) setUsernameError("Username is required");
    if (!email.trim()) setEmailError("Email is required");
    if (!password.trim()) setPasswordError("Password is required");
    if (password !== confirmPassword) setConfirmPasswordError("Passwords do not match");

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setLoading(false);
      return;
    }

    try {
      await ClientService.auth.signup({ username, email, password });
      setLoading(false);
      notify && notify("Signup successful", "success");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setLoading(false);
      notify && notify(err.message || "Signup failed", "error");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Create Account</h1>

        <TextInput
          name="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          error={usernameError}
        />

        <TextInput
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          error={emailError}
        />

        <PasswordInput
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          error={passwordError}
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          error={confirmPasswordError}
        />

        <LoginButton loading={loading} label="Sign Up" />

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300"/>
          <span className="mx-2 text-gray-500 text-sm">or continue with</span>
          <hr className="flex-grow border-gray-300"/>
        </div>

        <GoogleButton onClick={() => {}} label="Sign Up with Google" />
      </form>
    </section>
  );
}

export default Signup;
