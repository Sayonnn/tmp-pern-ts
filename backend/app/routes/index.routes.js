import express from "express";
import { config } from "../configs/index.js";
import adminAuthRoutes from "../admin/routes/auth.routes.js";
import adminMailRoutes from "../admin/routes/mail.routes.js";
import clientAuthRoutes from "./auth.routes.js";
import clientMailRoutes from "./mail.routes.js";
import genericRoutes from "./generic.routes.js";
const router = express.Router();

/** Admin Routes */
router.use("/" + config.app.appName + "-admin/auth", adminAuthRoutes);
router.use("/" + config.app.appName + "-admin/mailer", adminMailRoutes);

/** Client Routes */
router.use("/auth", clientAuthRoutes);
router.use("/mailer", clientMailRoutes);

/** Generic Routes */
router.use("/", genericRoutes);

export default router;