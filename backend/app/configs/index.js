import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT || 5000, 
    env: process.env.NODE_ENV || "development",
    db:{
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        abbr: process.env.DB_ABBR
    },
    jwt:{
        secret: process.env.JWT_SECRET,
        access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        algorithm: process.env.JWT_ALGORITHM
    },
    redis:{},
    mail:{
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    },
    app:{
        appUrl: process.env.APP_URL,
        appName: process.env.APP_NAME,
        coolName: process.env.APP_COOL_NAME,
        abbr: process.env.DB_ABBR,
        emailHeader: process.env.EMAIL_HEADER
    },
    recaptcha:{
        url: process.env.RECAPTCHA_URI,
        secretKey: process.env.RECAPTCHA_SECRET_KEY,
        siteKey: process.env.RECAPTCHA_SITE_KEY
    }
}