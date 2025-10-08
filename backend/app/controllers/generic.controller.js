import {
	generateAccessToken,
	generateRefreshToken,
	verifyToken,
} from "../utils/jwt.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { config } from "../configs/index.js";
import { generateTOTPSecret, verifyTOTP } from "../utils/totp.js";
import { generateQRCode } from "../utils/qrcode.js";
import { enableTwoFA, disableTwoFA, getTwoFASecret } from "../services/generic.service.js";
import { saveCookie, removeCookie } from "../utils/cookies.js";

/*====================================
/* Refresh Token (Generic) 
/*====================================*/
export async function refreshToken(req, res) {
	try {
		const refreshToken = req.cookies?.refreshToken;
		if (!refreshToken) {
			return errorResponse(
				res,
				401,
				"No refresh token found. Please log in again."
			);
		}

		const decoded = verifyToken(refreshToken);
		const newAccessToken = generateAccessToken(decoded);
		const newRefreshToken = generateRefreshToken(decoded);

		saveCookie(res, "accessToken", newAccessToken, 1 * 60 * 60 * 1000);
		saveCookie(res, "refreshToken", newRefreshToken, 7 * 24 * 60 * 60 * 1000);

		return successResponse(res, "Access token refreshed", {
			user: decoded,
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	} catch (err) {
		removeCookie(res, "refreshToken");
		removeCookie(res, "accessToken");
		return errorResponse(res, 403, "Session expired. Please log in again.");
	}
}

/*====================================
/* Logs (Generic)
/*====================================*/
export async function logs(req, res) {
	try {
		const { message, stack, context } = req.body;

		if (!message) {
			return res.status(400).json({ error: "Log message is required" });
		}

		const logMessage = context ? `[${context}] ${message}` : message;
		console.error("Frontend Log:", logMessage);
		if (stack) console.error(stack);

		res.status(200).json({ success: true, message: "Log received" });
	} catch (error) {
		console.error("API /logs Error:", error.message || error);
		res.status(500).json({ error: error.message || "Internal Server Error" });
	}
} 

/*====================================
/* recaptcha (Generic)
/*====================================*/
export async function recaptcha(req, res) {
	try {
		const { token } = req.body;

		if (!token) {
			return res.status(400).json({ error: "Recaptcha token is required" });
		}

		const secretKey = config.recaptcha.secretKey;
		if (!secretKey) {
			return res.status(500).json({ error: "Recaptcha secret key not set" });
		}

		const response = await fetch(
			`${config.recaptcha.url}?secret=${secretKey}&response=${token}`,
			{ method: "POST" }
		);

		const data = await response.json();

		if (!data.success) {
			return res.status(400).json({ error: "Recaptcha verification failed" });
		}

		res
			.status(200)
			.json({ success: true, message: "Recaptcha verified successfully" });
	} catch (error) {
		console.error("API /recaptcha Error:", error.message || error);
		res.status(500).json({ error: error.message || "Internal Server Error" });
	}
}

/*====================================
/* 2FA SETUP
/*====================================*/
export async function twoFASetup(req, res) {
	try {
		const { username } = req.body;
		if (!username) return errorResponse(res, 400, "Username is required");

		const secret = generateTOTPSecret(username);
		const otpauthUrl = `otpauth://totp/${encodeURIComponent(
			username
		)}?secret=${secret}&issuer=MyApp`;
		const qrCodeDataURL = await generateQRCode(otpauthUrl);

		return successResponse(res, "2FA secret generated successfully", {
			secret,
			qrCodeDataURL,
		});
	} catch (error) {
		console.error("API /2fa/setup Error:", error);
		return errorResponse(res, 500, error.message || "Internal Server Error");
	}
}

/*====================================
/* 2FA VERIFY
/*====================================*/
export async function twoFAVerify(req, res) {
	try {
		const { token, secret, username,role } = req.body;
		if (!token || !secret || !username)
			return errorResponse(
				res,
				400,
				"Token, secret, and username are required"
			);

		const verified = verifyTOTP(token, secret);
		if (!verified) return errorResponse(res, 400, "Invalid or expired token");

		const updatedUser = await enableTwoFA(username, secret,role);
		return successResponse(res, "2FA verified and enabled successfully", {
			user: updatedUser,
		});
	} catch (error) {
		console.error("API /2fa/verify Error:", error);
		return errorResponse(res, 500, error.message || "Internal Server Error");
	}
}

/*====================================
/* GET 2FA Datas
/*====================================*/
export async function TwoFADatas(req, res) {
	try {
		const { username,role } = req.body;
		if (!username) return errorResponse(res, 400, "Username required");

		const updatedUser = await getTwoFASecret(username,role);
		return successResponse(res, "2FA disabled successfully", updatedUser);
	} catch (error) {
		console.error("API /2fa/disable Error:", error);
		return errorResponse(res, 500, error.message || "Internal Server Error");
	}
}

/*====================================
/* 2FA DISABLE
/*====================================*/
export async function twoFADisable(req, res) {
	try {
		const { username,role } = req.body;
		if (!username) return errorResponse(res, 400, "Username required");

		const updatedUser = await disableTwoFA(username,role);
		return successResponse(res, "2FA disabled successfully", updatedUser);
	} catch (error) {
		console.error("API /2fa/disable Error:", error);
		return errorResponse(res, 500, error.message || "Internal Server Error");
	}
}
