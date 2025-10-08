import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthContext from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import SubmitButton from "../../components/buttons/Submit.button";
import TextInput from "../../components/inputs/Text.input";
import NotFound from "../defaults/NotFound";
import ClientService from "../../services/api.service";
import { setStorage } from "../../utils/storage.handler";

const TwoFA: React.FC = () => {
	const { user, require2FA, setRequire2FA, setIs2FADone, accessToken } = useAuthContext();
	const navigate = useNavigate();
	const { notify } = useNotification();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const [qrCode, setQrCode] = useState<string | null>(null);
	const [secret, setSecret] = useState("");
	const [verificationToken, setVerificationToken] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [isSetupMode, setIsSetupMode] = useState(false);
	const [tokenError, setTokenError] = useState<string | null>(null);

	useEffect(() => {
		if (require2FA) {
			setIsSetupMode(true);
		} else {
			setIsSetupMode(false);
		}
		/** when loaded 
		 * check if there is user 2fa key exist
		 * if exist, set isSetupMode to false
		 * else set isSetupMode to true
		*/
		const check2FA = async () => {
			try {
				if(!user) return;
				const data = await ClientService.auth.twoFAValidate({username: user.username, role: "client"})
				if(data){
					setSecret(data.twofa_secret);
					setIsSetupMode(!data.twofa_enabled);
				}
			} catch (error) {
				console.error("error validate: ", error);
			}
		}

		check2FA();
	}, [require2FA,user]);

	const handleSetup = async (): Promise<void> => {
		if (!user?.username) {
			notify && notify("User not authenticated", "error");
			return;
		}
 
		setLoading(true);
		setMessage("");

		try {
			const data = await ClientService.auth.twoFASetup({
				username: user.username,
				role: "client",
			})

			console.log("data setup: ", data);

			if (data.status && data.qrCodeDataURL && data.secret) {
				setQrCode(data.qrCodeDataURL);
				setSecret(data.secret);
				setMessage(
					"Scan this QR code with Google Authenticator or any TOTP app."
				);
			} else {
				setMessage(data.message || "Failed to generate QR code.");
				notify && notify(data.message || "Setup failed", "error");
			}
		} catch (err: unknown) {
			const error = err as Error;
			setMessage(error.message || "Setup failed");
			notify && notify(error.message || "Setup failed", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleVerify = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		setTokenError(null);
		setMessage("");

		if (!verificationToken.trim()) {
			setTokenError("Token is required");
			return;
		}

		if (verificationToken.length !== 6 || !/^\d{6}$/.test(verificationToken)) {
			setTokenError("Token must be exactly 6 digits");
			return;
		}

		setLoading(true);
		try {
			const data = await ClientService.auth.twoFAVerify({
				token: verificationToken,
				secret,
				username: user?.username!,
				role: "client",
			});

			console.log("data verify: ", data);

			if (data.status) {
				setMessage("Token verified successfully! Redirecting...");
				notify && notify("2FA verified successfully!", "success");
				setRequire2FA(false);
				if (accessToken) {
					setStorage("authToken", accessToken);
				}
				/** mark 2fa process as done */
				setIs2FADone(true);
				setTimeout(() => navigate("/dashboard"), 1000);
			} else {
				setMessage(data.message || "Invalid token.");
				setTokenError(data.message || "Invalid token. Please try again.");
				notify && notify(data.message || "Invalid token", "error");
			}
		} catch (err: unknown) {
			const error = err as Error;
			const errorMessage = error.message || "Verification failed";
			setMessage(errorMessage);
			setTokenError(errorMessage);
			notify && notify(errorMessage, "error");
		} finally {
			setLoading(false);
		}
	};

	const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 6);
		setVerificationToken(value);
		setTokenError(null);
	};

	const handleCancel = () => {
		notify && notify("2FA setup cancelled", "info");
		navigate("/login");
	};

	/** Prevent direct access without token parameter */
	if (!token) {
		return <NotFound />;
	}

	/** Prevent access if user is not authenticated */
	if (!user) {
		return <NotFound />;
	}

	return (
		<section className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-2xl font-bold text-center mb-2">
					{isSetupMode
						? "Setup Two-Factor Authentication"
						: "Verify Your Identity"}
				</h1>
				<p className="text-sm text-gray-600 text-center mb-6">
					{isSetupMode
						? "Secure your account with 2FA"
						: "Enter the 6-digit code from your authenticator app"}
				</p>

				<div className="flex flex-col gap-4">
					{!qrCode && isSetupMode ? (
						<>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
								<p className="text-sm text-blue-800">
									Two-factor authentication adds an extra layer of security to
									your account. You'll need an authenticator app like Google
									Authenticator, Authy, or Microsoft Authenticator.
								</p>
							</div>
							<SubmitButton
								loading={loading}
								label="Generate 2FA QR Code"
								onClick={handleSetup}
							/>
						</>
					) : qrCode ? (
						<>
							<div className="flex flex-col items-center gap-4">
								<img
									src={qrCode}
									alt="2FA QR Code"
									className="w-48 h-48 rounded-lg border-2 border-gray-200"
								/>
								<div className="bg-gray-50 rounded-lg p-3 w-full">
									<p className="text-xs text-gray-600 text-center mb-1">
										Secret Key (manual entry):
									</p>
									<p className="text-sm font-mono text-center break-all select-all">
										{secret}
									</p>
								</div>
							</div>

							<form
								onSubmit={handleVerify}
								className="flex flex-col gap-4 mt-4"
							>
								<TextInput
									label="Enter 6-digit code"
									name="token"
									type="text"
									value={verificationToken}
									onChange={handleTokenChange}
									placeholder="000000"
									error={tokenError}
									maxLength={6}
									inputMode="numeric"
									pattern="[0-9]*"
								/>
								<SubmitButton
									loading={loading}
									label={loading ? "Verifying..." : "Verify & Continue"}
									disabled={verificationToken.length !== 6}
								/>
							</form>
						</>
					) : (
						// Existing 2FA verification (user already has 2FA enabled)
						<form onSubmit={handleVerify} className="flex flex-col gap-4">
							<TextInput
								label="Enter 6-digit code"
								name="token"
								type="text"
								value={verificationToken}
								onChange={handleTokenChange}
								placeholder="000000"
								error={tokenError}
								maxLength={6}
								inputMode="numeric"
								pattern="[0-9]*"
							/>
							<SubmitButton
								loading={loading}
								label={loading ? "Verifying..." : "Verify & Continue"}
								disabled={verificationToken.length !== 6}
							/>
						</form>
					)}

					{message && (
						<div
							className={`text-center text-sm p-3 rounded-lg ${
								message.includes("successfully")
									? "bg-green-50 text-green-700 border border-green-200"
									: message.includes("Invalid") || message.includes("failed")
									? "bg-red-50 text-red-700 border border-red-200"
									: "bg-blue-50 text-blue-700 border border-blue-200"
							}`}
						>
							{message}
						</div>
					)}

					<button
						type="button"
						onClick={handleCancel}
						className="text-sm text-gray-500 hover:text-gray-700 text-center mt-2"
						disabled={loading}
					>
						Cancel and return to login
					</button>
				</div>
			</div>
		</section>
	);
};

export default TwoFA;
