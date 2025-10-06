import { errorResponse, successResponse } from "../../utils/response.js";
import { registerAdmin, loginAdmin, forgotPassword, resetPassword, setupAdmin2FA, verifyAdmin2FA } from "../services/auth.service.js";
import { generateAccessToken, verifyToken } from "../../utils/jwt.js";
import { saveCookie } from "../../utils/cookies.js";

/* ===========================================
 * Register a new admin
 * =========================================== */
export const startAdminRegistration = async (req, res) => {
  try {
    const { email, password, super_admin, role, permissions, username } = req.body;

    if (!email || !password || !username) {
      return errorResponse(res, 400, "Email, password and username are required");
    }

    // Provide a default role if missing
    const finalRole = role || "admin";

    const { user, accessToken, refreshToken } = await registerAdmin(
      email,
      password,
      permissions,
      super_admin,
      username,
      finalRole
    );

    saveCookie(res, "refreshToken", refreshToken);

    return successResponse(res, "Register successful", { user, accessToken });
  } catch (err) {
    console.error("Register Error:", err);

    if (err instanceof Error) {
      return errorResponse(res, 400, err.message);
    }

    return errorResponse(res, 400, "Register failed, please try again");
  }
};

/* ===========================================
 * Login an admin
 * =========================================== */
export const startAdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(res, 400, "Username and password are required");
    }

    const { user, accessToken, refreshToken } = await loginAdmin(username, password);

    saveCookie(res, "refreshToken", refreshToken);

    return successResponse(res, "Login successful", { user, accessToken });
  } catch (err) {
    console.error("Login Error:", err);

    if (err.field && err.message) {
      return errorResponse(res, 400, err.message, err.field);
    }

    return errorResponse(res, 400, "Login failed, please try again");
  }
};

/* ===========================================
 * Refresh an admin's access token ( not used )
 * =========================================== */
export const refreshAdminAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, 401, "Refresh token missing. Please log in again.");
    }

    const decoded = verifyToken(refreshToken);
    const accessToken = generateAccessToken(decoded);

    return successResponse(res, "Refresh successful", {
      user: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
        permissions: decoded.permissions,
        created_at: decoded.created_at
      },
      accessToken,
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    return errorResponse(res, 403, "Refresh failed. Please log in again.");
  }
};

/* ===========================================
 * Refresh Admin Information in exchange of access token
 * =========================================== */
export const refreshAdminInformation = async (req, res) => {
  try {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
      return errorResponse(res, 401, "Access token missing. Please log in again.");
    }

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
 * Forgot Password (admin)
 * =========================================== */
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 400, "Email is required");

    const result = await forgotPassword(email);
    return successResponse(res, result.message);
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return errorResponse(res, 400, err.message);
  }
};

/* ===========================================
 * Reset Password (admin)
 * =========================================== */
export const resetAdminPassword = async (req, res) => {
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
 * Setup 2FA (admin)
 * =========================================== */
export const twoFactorAuthenticationSetup = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return errorResponse(res, 400, "Username required");

    const { qr, secret } = await setupAdmin2FA(username);
    return successResponse(res, "2FA setup generated", { qr, secret });
  } catch (err) {
    console.error("2FA Setup Error:", err);
    return errorResponse(res, 400, err.message);
  }
};

/* ===========================================
 * Verify 2FA token (admin)
 * =========================================== */
export const twoFactorAuthenticationVerify = async (req, res) => {
  try {
    const { token, secret } = req.body;
    if (!token || !secret)
      return errorResponse(res, 400, "Token and secret required");

    const verified = await verifyAdmin2FA(token, secret);
    if (!verified) return errorResponse(res, 400, "Invalid 2FA code");

    return successResponse(res, "2FA verification successful");
  } catch (err) {
    console.error("2FA Verify Error:", err);
    return errorResponse(res, 400, err.message);
  }
};
