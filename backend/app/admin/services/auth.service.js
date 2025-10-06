import { startQuery } from "../../utils/query.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { config } from "../../configs/index.js";
import { generateTOTPSecret } from "../../utils/totp.js";

/* ===========================================
 * Register (admin)
 * =========================================== */
export const registerAdmin = async (
  email,
  password,
  permissions = {},
  super_admin = true,
  username,
  role = "admin"   
) => {
    /** Check Email Exists */
    const checkEmailSql = `SELECT id FROM ${config.db.abbr}_admins WHERE email = $1`;
    const existingEmail = await startQuery(checkEmailSql, [email]);

    if(existingEmail.rows.length > 0){
        throw { field: "email", message: "This email is already registered." };
    }

    /** Check Username Exists */
    const checkUsernameSql = `SELECT id FROM ${config.db.abbr}_admins WHERE username = $1`;
    const existingUsername = await startQuery(checkUsernameSql, [username]);
  
    if (existingUsername.rows.length > 0) {
      throw { field: "username", message: "This username is already registered." };
    }
  
    /** Hash Password */
    const hashedPassword = await hashPassword(password);

    /** Save Admin */
    const sql = `
      INSERT INTO ${config.db.abbr}_admins (email, password, super_admin, username, permissions, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, super_admin, username, permissions, role, created_at
    `;
    const params = [email, hashedPassword, super_admin, username, JSON.stringify(permissions), role];
    const result = await startQuery(sql, params);
    const user = result.rows[0];

    /** Generate Tokens */
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
};

/* ===========================================
 * Login (admin)
 * =========================================== */
export const loginAdmin = async (username, password) => {
    /** Check Username Exists */
    const checkUserSql = `SELECT id, email, password, permissions, super_admin, username, role, created_at FROM ${config.db.abbr}_admins WHERE username = $1`;
    const existing = await startQuery(checkUserSql, [username]);
  
    if (existing.rows.length === 0) {
      throw { field: "username", message: "This username does not exist." };
    }
  
    const user = existing.rows[0];

    /** Verify Password */
    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid){
        throw { field: "password", message: "Incorrect password" };
    }

    /** Generate Tokens */
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
}

/* ===========================================
 * Forgot Password (admin)
 * =========================================== */
export const forgotAdminPasswordService = async (email) => {
  const sql = `SELECT id, username, email FROM ${config.db.abbr}_admins WHERE email = $1`;
  const result = await startQuery(sql, [email]);

  if (result.rowCount === 0) {
    throw { field: "email", message: "No admin found with this email" };
  }

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

  return { message: "Password reset link sent to email" };
};

/* ===========================================
 * Reset Password (admin)
 * =========================================== */
export const resetAdminPasswordService = async (token, newPassword) => {
  const decoded = jwt.verify(token, config.jwt.secret);

  const sql = `SELECT id FROM ${config.db.abbr}_admins WHERE email = $1`;
  const result = await startQuery(sql, [decoded.email]);

  if (result.rowCount === 0) {
    throw { field: "token", message: "Invalid reset token or user not found" };
  }

  const hashedPassword = hashPassword(newPassword);
  
  /** Add email or account password verification in the future */

  const updateSql = `UPDATE ${config.db.abbr}_admins SET password = $1 WHERE id = $2`;
  await startQuery(updateSql, [hashedPassword, result.rows[0].id]);

  return { message: "Password reset successful. You can now log in." };
};

/* ===========================================
 * 2FA setup (admin)
 * =========================================== */
export const setupAdmin2FA = async (username) => {
  if (!username) throw { field: "username", message: "Username is required" };

  const secret = generateTOTPSecret(`appname (${username})`);

  // Create otpauth URL for QR generation ( fix also on frontend to recognize the path )
  const otpauthUrl = `otpauth://totp/appname (${username})?secret=${secret}&issuer=appname`;

  const qr = await generateQRCode(otpauthUrl);

  // Save secret to DB (so future logins can verify)
  const sql = `UPDATE ${config.db.abbr}_admins SET twofa_secret = $1 WHERE username = $2 RETURNING id`;
  const result = await startQuery(sql, [secret, username]);

  if (result.rowCount === 0) {
    throw { field: "username", message: "User not found for 2FA setup" };
  }

  return { qr, secret };
};

/* ===========================================
 * 2FA verify (admin)
 * =========================================== */
export const verifyAdmin2FA = async (token, secret) => {
  if (!token || !secret) throw { field: "token", message: "Token and secret are required" };

  const verified = verifyTOTP(token, secret);
  return verified;
};