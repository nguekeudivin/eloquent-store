import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { NextPageContext } from "next";

const TOKEN_COOKIE_KEY = "token";

export const getToken = (context?: NextPageContext) => {
  return getCookie(
    TOKEN_COOKIE_KEY,
    context ? { req: context.req, res: context.res } : undefined
  ) as string | undefined;
};

export const setToken = (token: string) => {
  setCookie(TOKEN_COOKIE_KEY, token, {
    maxAge: 24 * 60 * 60,
  });
};

export const deleteToken = () => {
  deleteCookie(TOKEN_COOKIE_KEY);
};
