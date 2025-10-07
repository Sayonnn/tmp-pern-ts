import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import TextInput from "../../components/inputs/Text.input";
import PasswordInput from "../../components/inputs/Password.input";
import useAuthContext from "../../hooks/useAuth";
import LoginButton from "../../components/buttons/Login.button";
import GoogleButton from "../../components/buttons/Google.button";
import PrimaryLink from "../../components/links/Primary.link";
import ForgotPasswordLink from "../../components/links/forgotPassword.link";
import Recaptcha, { type RecaptchaRef } from "../../components/Recaptcha";
import { postDatas } from "../../services/axios.service";

function Login() {  
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const recaptchaRef = useRef<RecaptchaRef>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("client");
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  /** Handle submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setUsernameError(null);
    setPasswordError(null);
    setLoading(true);

    if (!username.trim()) {
      setUsernameError("Username is required");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }
    if (!recaptchaToken) {
      notify && notify("Please complete the CAPTCHA", "error");
      setLoading(false);
      return;
    }

    try {
      /** Verify reCAPTCHA with backend */ 
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

      // Proceed with login
      const { status, message, field } = await login({ username, password, role });

      setLoading(false);

      if (!status) {
        if (field === "username") setUsernameError(message);
        else if (field === "password") setPasswordError(message);
        else notify && notify(message, "error");
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        return;
      }

      notify && notify(message, "success");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      setLoading(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      notify && notify(error.message || "Login failed", "error");
    }
  };
  
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Client Login</h1>

        <TextInput
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          error={usernameError}
        />

        <PasswordInput
          label="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          error={passwordError}
        />

        <TextInput type="text" name="role" value={role} onChange={() => {}} hidden/>

        <div className="flex justify-end">
          <ForgotPasswordLink />
        </div>
        
        <LoginButton loading={loading} label="Login"/>

  
        <Recaptcha
          ref={recaptchaRef}
          onChange={(token) => setRecaptchaToken(token)}
        />

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300"/>
          <span className="mx-2 text-gray-500 text-sm">or continue with</span>
          <hr className="flex-grow border-gray-300"/>
        </div>

        <GoogleButton onClick={() => {}} label="Login with Google"/>

        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <PrimaryLink to="/signup">Sign up</PrimaryLink>
        </div>
      </form>
    </section>
  );
}

export default Login;
