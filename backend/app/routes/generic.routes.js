import express from "express";
import { logs, recaptcha, refreshToken, twoFASetup, twoFAVerify, twoFADisable, TwoFAValidate } from "../controllers/generic.controller.js";
const router = express.Router();
 
/*====================================
/* Refresh Token (Generic)
/*====================================*/
router.post("/refresh-token", refreshToken );

/*====================================
/* Logs (Generic)
/*====================================*/
router.post("/logs",logs );

/*====================================
/* recaptcha (Generic)
/*====================================*/
router.post("/recaptcha", recaptcha);

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