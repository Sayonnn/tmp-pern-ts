import express from "express";
import { errorResponse } from "../utils/response";
import { verifyToken } from "../utils/jwt";
import { generateAccessToken } from "../utils/jwt";
import { generateRefreshToken } from "../utils/jwt";
import { saveCookie } from "../utils/cookie";
import { removeCookie } from "../utils/cookie";
import { successResponse } from "../utils/response";
const router = express.Router();

/*====================================
/* Refresh Token (Generic)
/*====================================*/
router.use("/refresh-token", (req, res) => {
    res.json({
        message: "Refresh token"
    })
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
        refreshToken: newRefreshToken
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
  
      // Optional: add context info
      const logMessage = context ? `[${context}] ${message}` : message;
  
      // For now, just log to console
      console.error("Frontend Log:", logMessage);
      if (stack) console.error(stack);
  
      // Future: save to DB, Sentry, or monitoring service
  
      res.status(200).json({ success: true, message: "Log received" });
    } catch (error) {
      console.error("API /logs Error:", error.message || error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });


export default router;