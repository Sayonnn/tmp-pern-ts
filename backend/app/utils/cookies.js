export const saveCookie = (res, name, value) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 /* 7 days */
      });
}

export const removeCookie = (res, name) => {
    res.cookie(name, "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0
    });
}