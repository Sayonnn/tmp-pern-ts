import speakeasy from "speakeasy";

export const generateTOTPSecret = (name) => {
  const token = speakeasy.generateSecret({ name });
  console.log(`Generated 2FA secret for ${name}`);
  return token.base32;
};

export const verifyTOTP = (token, secret) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token, 
    window: 1,
  });
};
