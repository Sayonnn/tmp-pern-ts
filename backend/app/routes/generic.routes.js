import express from "express";
import { logs, recaptcha, checkRecaptchaSession, refreshToken, twoFASetup, twoFAVerify, twoFADisable, TwoFAValidate, getAccessToken } from "../controllers/generic.controller.js";
const router = express.Router();
 
/*====================================
/* Refresh Token (Generic)
/*====================================*/
router.post("/refresh-token", refreshToken );

/*====================================
/* Get Access Token (Generic)
/*====================================*/
router.get("/get-access-token", getAccessToken );

/*====================================
/* get 2fa proof
/*====================================*/
router.get("/get-2fa-proof",get2FAProof);

/*====================================
/* set 2fa proof
/*====================================*/
router.post("/set-2fa-proof",set2FAProof);

/* Logs (Generic) */
/*====================================*/
router.post("/logs",logs );

/*====================================
/* recaptcha (Generic)
/*====================================*/
router.post("/recaptcha", recaptcha);

/*====================================
/* Check reCAPTCHA Session (Generic)
/*====================================*/
router.get("/recaptcha/check-session", checkRecaptchaSession);

/*====================================
/* 2FA SETUP
/*====================================*/
router.post("/2fa/setup", twoFASetup);

/*====================================
/* 2FA VERIFY 
/*====================================*/
router.post("/2fa/verify", twoFAVerify);

/*====================================
/* 2FA Datas
/*====================================*/
router.post("/2fa/validate", TwoFAValidate);

/*====================================
/* 2FA DISABLE
/*====================================*/
router.post("/2fa/disable", twoFADisable);

export default router;