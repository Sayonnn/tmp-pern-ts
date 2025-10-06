import jwt from "jsonwebtoken";
import { config } from "../configs/index.js";

/* =========================================
 * Helper: Build minimal + safe JWT payload
 * ========================================= */
const buildPayload = (user) => {
  if (!user) throw new Error("User not provided for token generation.");

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
    super_admin: !!user.super_admin,
    provider: user.provider || "local",
    is_verified: !!user.is_verified,
    twofa_enabled: !!user.twofa_enabled,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  // Remove undefined values (cleanup)
  for (const key in payload) {
    if (payload[key] === undefined) delete payload[key];
  }

  return payload;
};

/* =========================================
 * Generate a JWT Token (generic)
 * ========================================= */
const generateToken = (user, expiresIn) => {
  const payload = buildPayload(user);

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn,
    algorithm: config.jwt.algorithm || "HS256",
  });
};

/* =========================================
 * Access Token (default: 1h)
 * ========================================= */
export const generateAccessToken = (user) =>
  generateToken(user, config.jwt.access_token_expires_in || "1h");

/* =========================================
 * Refresh Token (default: 7d)
 * ========================================= */
export const generateRefreshToken = (user) =>
  generateToken(user, config.jwt.refresh_token_expires_in || "7d");

/* =========================================
 * Verify a JWT and return the decoded payload
 * ========================================= */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch {
    throw new Error("Invalid or expired token");
  }
};
