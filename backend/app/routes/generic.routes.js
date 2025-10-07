import express from "express";
import { errorResponse, successResponse } from "../utils/response.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";
import { saveCookie, removeCookie } from "../utils/cookies.js";
const router = express.Router();

/*====================================
/* Refresh Token (Generic)
/*====================================*/
router.post("/refresh-token", (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return errorResponse(res, 401, "No refresh token found. Please log in again.");
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
});


/*====================================
/* Logs (Generic)
/*====================================*/
router.post("/logs", (req, res) => {
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
});

export default router;