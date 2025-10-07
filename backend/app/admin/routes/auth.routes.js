import express from "express";
import {
  startAdminRegistration,
  startAdminLogin,
  refreshAdminInformation,
  forgotAdminPassword,
  resetAdminPassword,
  twoFactorAuthenticationSetup,
  twoFactorAuthenticationVerify, 
  startAdminLogout,
} from "../controllers/auth.controller.js";

const router = express.Router();

/** REGISTER (admin only) */
router.post("/register", startAdminRegistration);

/** LOGIN (admin only) */
router.post("/login", startAdminLogin);

/** LOGOUT (admin only) */
router.post("/logout", startAdminLogout);

/** Refresh Admin Information (admin only) */
router.post("/refresh-admin-information", refreshAdminInformation);

/** FORGOT PASSWORD (admin only) */
router.post("/forgot-password", forgotAdminPassword);

/** RESET PASSWORD (admin only) */
router.post("/reset-password", resetAdminPassword);

/** 2FA (admin only) */
router.post("/2fa/setup", twoFactorAuthenticationSetup);
router.post("/2fa/verify", twoFactorAuthenticationVerify);

export default router;
