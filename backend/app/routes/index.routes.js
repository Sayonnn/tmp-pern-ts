import express from "express";
import { config } from "../configs/index.js";
import adminAuthRoutes from "../admin/routes/auth.routes.js";
import adminMailRoutes from "../admin/routes/mail.routes.js";
import ClientAuthRoutes from "./auth.routes.js";
import ClientMailRoutes from "./mail.routes.js";
import logsRoutes from "./log.routes.js";
const router = express.Router();

/** Admin Routes */
router.use("/" + config.app.appName + "-admin/auth", adminAuthRoutes);
router.use("/" + config.app.appName + "-admin/mailer", adminMailRoutes);

/** Client Routes */
router.use("/auth", ClientAuthRoutes);
router.use("/mailer", ClientMailRoutes);

/** Monitoring Routes */
router.use("/logs", logsRoutes);

/** Refresh Token */
router.use("/refresh-token", (req, res) => {
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

export default router;