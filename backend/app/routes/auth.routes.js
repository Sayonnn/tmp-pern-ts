import express from "express";
import {
  startClientRegistration,
  startClientLogin,
  forgotClientPassword,
  resetClientPassword,
  twoFactorAuthenticationSetup,
  twoFactorAuthenticationVerify,
  refreshClientAccessToken,
  refreshClientInformation,
  startClientLogout,
} from "../controllers/auth.controller.js";

const router = express.Router();

/** REGISTER (client) */
router.post("/register", startClientRegistration);

/** LOGIN (client) */
router.post("/login", startClientLogin);

/** LOGOUT (client) */
router.post("/logout", startClientLogout);

/** Refresh Token (client) */
router.post("/refresh-access-token", refreshClientAccessToken);

/** Refresh Client Information (client) */
router.post("/refresh-client-information", refreshClientInformation);

/** FORGOT PASSWORD (client) */
router.post("/forgot-password", forgotClientPassword);

/** RESET PASSWORD (client) */
router.post("/reset-password", resetClientPassword);

/** 2FA (client) */
router.post("/2fa/setup", twoFactorAuthenticationSetup);
router.post("/2fa/verify", twoFactorAuthenticationVerify);

export default router;
