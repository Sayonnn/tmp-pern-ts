import { config } from "./index.js";

export const cookieConfig = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict",
}