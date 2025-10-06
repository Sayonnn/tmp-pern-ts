import rateLimit from "express-rate-limiter";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 20,
    message: "Too many requests, please try again later.",
});