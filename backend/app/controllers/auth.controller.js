import { registerClient, loginClient, forgotPassword, resetPassword, setupClient2FA, verifyClient2FA } from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { generateAccessToken, verifyToken } from "../utils/jwt.js";
import { saveCookie } from "../utils/cookies.js";

/* ===========================================
 * Register a new client
 * =========================================== */
export const startClientRegistration = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) return errorResponse(res, 400, "Email, password and username are required");
    
        const { user, accessToken, refreshToken } = await registerClient(email, password, username);
        saveCookie(res, "refreshToken", refreshToken);
        return successResponse(res, "Register successful", { user, accessToken });
    } catch (err) {
        console.error("Register Error:", err);
        if (err.field && err.message) return errorResponse(res, 400, err.message, err.field);
        return errorResponse(res, 400, "Register failed, please try again");
    }
}
 
/* ===========================================
 * Login a client
 * =========================================== */
export const startClientLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return errorResponse(res, 400, "Username and password are required");

    const { user, accessToken, refreshToken } = await loginClient(username, password);
    saveCookie(res, "refreshToken", refreshToken);
    return successResponse(res, "Login successful", { user, accessToken });
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponse(res, 400, err.message || "Login failed, please try again");
  }
};

/* ===========================================
 * Refresh client's access token using refresh token ( not used )
 * =========================================== */
export const refreshClientAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, 401, "Refresh token missing. Please log in again.");
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // ⚠️ At this point you can either:
    //   a) trust decoded payload (fast, stateless, typical JWT flow)
    //   b) check DB if refresh token is still valid (revocation logic)

    // Generate new access token
    const accessToken = generateAccessToken(decoded);

    return successResponse(res, "Refresh successful", {
      user: { id: decoded.id, email: decoded.email,username: decoded.username, role: decoded.role,created_at: decoded.created_at },
      accessToken,
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);

    return errorResponse(res, 403, "Refresh failed. Please log in again.");
  } 
};

/* ===========================================
 * Refresh Client Information in exchange of access token
 * =========================================== */
export const refreshClientInformation = async (req, res) => {
  try {
    const accessToken = req.headers['authorization'].split(' ')[1];

    if (!accessToken) {
      return errorResponse(res, 401, "Access token missing. Please log in again.");
    }
    
    /** Verify access token */
    const decoded = verifyToken(accessToken);
    
    return successResponse(res, "Refresh successful", {
      user: decoded
    });
    
  } catch (err) {
    console.error("Refresh Token Error:", err);

    return errorResponse(res, 403, "Refresh failed. Please log in again.");
  }
};

/* ===========================================
 * Forgot Password (client)
 * =========================================== */
export const forgotClientPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 400, "Email required");

    const result = await forgotPassword(email);
    return successResponse(res, result.message);
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return errorResponse(res, 400, err.message);
  }
};

/* ===========================================
 * Reset Password (client)
 * =========================================== */
export const resetClientPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return errorResponse(res, 400, "Token and new password required");

    const result = await resetPassword(token, newPassword);
    return successResponse(res, result.message);
  } catch (err) {
    console.error("Reset Password Error:", err);
    return errorResponse(res, 400, err.message);
  }
};

/* ===========================================
 * 2FA setup (client)
 * =========================================== */
export const twoFactorAuthenticationSetup = async (req, res) => {
  try {
    const { username } = req.body;
    const { qr, secret } = await setupClient2FA(username);
    return successResponse(res, "2FA setup successful", { qr, secret });
  } catch (err) {
    console.error("2FA Setup Error:", err);
    return errorResponse(res, 400, err.message);
  }
};

/* ===========================================
 * 2FA verify (client)
 * =========================================== */
export const twoFactorAuthenticationVerify = async (req, res) => {
  try {
    const { token, secret } = req.body;
    const verified = await verifyClient2FA(token, secret);
    if (!verified) return errorResponse(res, 400, "Invalid 2FA code");
    return successResponse(res, "2FA verification successful");
  } catch (err) {
    console.error("2FA Verify Error:", err);
    return errorResponse(res, 400, err.message);
  }
};