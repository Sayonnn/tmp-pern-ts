import { cookieConfig } from "../configs/cookie.js";

export const saveCookie = (res, name, value, maxAge) => {
    res.cookie(name, value, {...cookieConfig, maxAge});
}

export const removeCookie = (res, name) => {
    res.clearCookie(name, cookieConfig);
}