import { startQuery } from "../utils/query.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { config } from "../configs/index.js";
import { generateTOTPSecret, verifyTOTP } from "../utils/totp.js";
import { generateQRCode } from "../utils/qrcode.js";
import jwt from "jsonwebtoken";
import sendEmail  from "./mail.service.js";

/* ===========================================
 * Register (client)
 * =========================================== */
export const registerClient = async (email, password, username) => {
  // Check Email
  const checkEmailSql = `SELECT id FROM ${config.db.abbr}_clients WHERE email = $1`;
  const existingEmail = await startQuery(checkEmailSql, [email]);
  if (existingEmail.rows.length > 0)
    throw { field: "email", message: "This email is already registered." };

  // Check Username
  const checkUsernameSql = `SELECT id FROM ${config.db.abbr}_clients WHERE username = $1`;
  const existingUsername = await startQuery(checkUsernameSql, [username]);
  if (existingUsername.rows.length > 0)
    throw { field: "username", message: "This username is already registered." };

  // Hash Password
  const hashedPassword = await hashPassword(password);

  // Save Client
  const sql = `
    INSERT INTO ${config.db.abbr}_clients (email, password, username, role)
    VALUES ($1, $2, $3, 'client')
    RETURNING id, email, username, role, created_at
  `;
  const result = await startQuery(sql, [email, hashedPassword, username]);
  const user = result.rows[0];

  // Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

/* ===========================================
 * Login (client)
 * =========================================== */
export const loginClient = async (username, password) => {
  const sql = `SELECT id, email, password, username, role, twofa_secret, created_at FROM ${config.db.abbr}_clients WHERE username = $1`;
  const result = await startQuery(sql, [username]);

  if (result.rowCount === 0)
    throw { field: "username", message: "Username does not exist." };

  const user = result.rows[0];
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid)
    throw { field: "password", message: "Incorrect password" };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

/* ===========================================
 * Forgot Password (client)
 * =========================================== */
export const forgotPassword = async (email) => {
  const sql = `SELECT id, username, email FROM ${config.db.abbr}_clients WHERE email = $1`;
  const result = await startQuery(sql, [email]);

  if (result.rowCount === 0)
    throw { field: "email", message: "No client found with this email" };

  const user = result.rows[0];
  const resetToken = generateAccessToken(user);
  const resetLink = `${config.app.frontendUrl}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    name: user.username,
    link: resetLink,
    subject: "Password Reset Request",
    template: "resetPassword",
  });

  return { message: "Password reset link sent to your email." };
};

/* ===========================================
 * Reset Password (client)
 * =========================================== */
export const resetPassword = async (token, newPassword) => {
  const decoded = jwt.verify(token, config.jwt.secret);
  const sql = `SELECT id FROM ${config.db.abbr}_clients WHERE email = $1`;
  const result = await startQuery(sql, [decoded.email]);

  if (result.rowCount === 0)
    throw { field: "token", message: "Invalid token or user not found" };

  const hashedPassword = await hashPassword(newPassword);
  const updateSql = `UPDATE ${config.db.abbr}_clients SET password = $1 WHERE id = $2`;
  await startQuery(updateSql, [hashedPassword, result.rows[0].id]);

  return { message: "Password reset successful. You can now log in." };
};

/* ===========================================
 * 2FA Setup (client)
 * =========================================== */
export const setupClient2FA = async (username) => {
  if (!username) throw { field: "username", message: "Username is required" };

  const secret = generateTOTPSecret(`appname (${username})`);
  const otpauthUrl = `otpauth://totp/appname (${username})?secret=${secret}&issuer=appname`;
  const qr = await generateQRCode(otpauthUrl);

  const sql = `UPDATE ${config.db.abbr}_clients SET twofa_secret = $1 WHERE username = $2 RETURNING id`;
  const result = await startQuery(sql, [secret, username]);
  if (result.rowCount === 0)
    throw { field: "username", message: "User not found for 2FA setup" };

  return { qr, secret };
};

/* ===========================================
 * 2FA Verify (client)
 * =========================================== */
export const verifyClient2FA = async (token, secret) => {
  if (!token || !secret)
    throw { field: "token", message: "Token and secret are required" };
  return verifyTOTP(token, secret);
};
