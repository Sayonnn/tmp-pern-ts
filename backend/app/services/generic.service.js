import { startQuery } from "../utils/query.js";
import { config } from "../configs/index.js";

/* ===========================================
 * Enable 2FA for client
 * =========================================== */
export const enableTwoFA = async (username, secret) => {
  const sql = `
    UPDATE ${config.db.abbr}_clients
    SET twofa_enabled = TRUE, 
        twofa_secret = $1,
        updated_at = NOW()
    WHERE username = $2
    RETURNING id, username, twofa_enabled
  `;

  const result = await startQuery(sql, [secret, username]);
  if (result.rowCount === 0)
    throw { field: "username", message: `User ${username} not found` };

  return result.rows[0];
};

/* ===========================================
 * Disable 2FA for client
 * =========================================== */
export const disableTwoFA = async (username) => {
  const sql = `
    UPDATE ${config.db.abbr}_clients
    SET twofa_enabled = FALSE,
        twofa_secret = NULL,
        updated_at = NOW()
    WHERE username = $1
    RETURNING id, username, twofa_enabled
  `;

  const result = await startQuery(sql, [username]);
  if (result.rowCount === 0)
    throw { field: "username", message: `User ${username} not found` };

  return result.rows[0];
};

/* ===========================================
 * Get 2FA secret by username
 * =========================================== */
export const getTwoFASecret = async (username) => {
  const sql = `
    SELECT twofa_secret, twofa_enabled
    FROM ${config.db.abbr}_clients
    WHERE username = $1
  `;
  const result = await startQuery(sql, [username]);
  return result.rows[0] || null;
};
