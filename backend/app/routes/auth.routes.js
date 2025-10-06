import express from "express";
import {
  startClientRegistration,
  startClientLogin,
  forgotClientPassword,
  resetClientPassword,
  twoFactorAuthenticationSetup,
  twoFactorAuthenticationVerify,
} from "../controllers/auth.controller.js";

const router = express.Router();

/** REGISTER (client) */
router.post("/register", startClientRegistration);

/** LOGIN (client) */
router.post("/login", startClientLogin);

/** FORGOT PASSWORD (client) */
router.post("/forgot-password", forgotClientPassword);

/** RESET PASSWORD (client) */
router.post("/reset-password", resetClientPassword);

/** 2FA (client) */
router.post("/2fa/setup", twoFactorAuthenticationSetup);
router.post("/2fa/verify", twoFactorAuthenticationVerify);

export default router;
