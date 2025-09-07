import { startQuery } from "../../utils/query.js";
import { hashPassword } from "../../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

export const registerAdmin = async (email, password, username) => {
    /** Check Email Exists */
    const checkEmailSql= `SELECT id FROM uge_admins WHERE email = $1 RETURNING id,email,role,username, permission, created_at`;
    const existing = await startQuery(checkEmailSql, [email]);

    if(existing.rows.length > 0){
        throw { field: "email", message: "This email is already registered." };
    }

    const checkUsernameSql = "SELECT id FROM uge_admins WHERE username = $1";
    const existingUsername = await startQuery(checkUsernameSql, [username]);
  
    if (existingUsername.rows.length > 0) {
      throw { field: "username", message: "This username is already registered." };
    }
  
    /** Hash Password */
    const hashedPassword = await hashPassword(password);

    /** Save Admin */
   const sql = `
    INSERT INTO uge_admins (email, password, username, role)
    VALUES ($1, $2, $3, 'admin')
    RETURNING id, email, role, username, created_at
   `
   const params = [email, hashedPassword, username];
   const result = await startQuery(sql, params);
   const user = result.rows[0];

   /** Generate Tokens */
   const accessToken = generateAccessToken(user);
   const refreshToken = generateRefreshToken(user);

   return { user, accessToken, refreshToken };
} 

export const loginAdmin = async (email, password) => {
    /** Check Email Exists */
    const checkEmailSql= `SELECT id FROM uge_admins WHERE email = $1 RETURNING id,email,role,username, permission, created_at`;
    const existing = await startQuery(checkEmailSql, [email]);

    if(existing.row.length === 0){
        throw { field: "email", message: "Email not found" };
    }

    const user = existing.rows[0];

    /** Verify Password */
    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid){
        throw { field: "password", message: "Invalid password" };
    }

    /** Generate Tokens */
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
}
