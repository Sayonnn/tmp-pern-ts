import speakeasy from "speakeasy";

export const verifyTOTP = (token, secret) => {
    const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1,
    });

    return verified;
}

export const generateTOTPSecret = (name) => {
    const token = speakeasy.generateSecret({ name });
    const secret = token.base32;

    return secret;
}
     