import { registerClient, loginClient, forgotPassword, resetPassword,logoutClient } from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {  verifyToken } from "../utils/jwt.js";
import { saveCookie } from "../utils/cookies.js";

/* ===========================================
 * Register a new client 
 * =========================================== */
export const startClientRegistration = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) return errorResponse(res, 400, "Email, password and username are required");
    
        const { user, accessToken, refreshToken } = await registerClient(email, password, username);
        // 7 days
        saveCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
        // 1 hour
        saveCookie(res, "accessToken", accessToken, 1 * 60 * 60 * 1000);
        /** set deafult 2fa cheacker if 2fa is enabled */
        if(user?.twofa_enabled){
          saveCookie(res,"is2FACompleted",false)
        }
        
        return successResponse(res, "Register successful", { user });
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
    // 7 days
    saveCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
    // 1 hour
    saveCookie(res, "accessToken", accessToken, 1 * 60 * 60 * 1000);
    /** set deafult 2fa cheacker if 2fa is enabled */
    if(user?.twofa_enabled){
      saveCookie(res,"is2FACompleted",false)
    }

    return successResponse(res, "Login successful", { user });
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponse(res, 400, err.message || "Login failed, please try again");
  }
};

/* ===========================================
 * Refresh Client Information in exchange of access token
 * =========================================== */
export const refreshClientInformation = async (req, res) => {
  try {
    // const accessToken = req.headers['authorization'].split(' ')[1];
    /** we rotate the tokens in the backend only */
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) return errorResponse(res, 401, "Access token missing. Please log in again.");
    
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
    const { token, password } = req.body;
    if (!token || !password)
      return errorResponse(res, 400, "Token and new password required");

    const result = await resetPassword(token, password);
    return successResponse(res, result.message);
  } catch (err) {
    console.error("Reset Password Error:", err);
    return errorResponse(res, 400, err.message);
  }
};

/* ===========================================
 * Logout a client
 * =========================================== */
export const startClientLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        await logoutClient(refreshToken);
      } catch (err) {
        console.warn("Failed to revoke client refresh token:", err);
      }
    }

    removeCookie(res, "accessToken");
    removeCookie(res, "refreshToken");

    return successResponse(res, "Logout successful");
  } catch (err) {
    console.error("Logout Error:", err);
    try { removeCookie(res, "accessToken"); removeCookie(res, "refreshToken"); } catch {}
    return errorResponse(res, 500, "Logout failed. Please try again.");
  }
};