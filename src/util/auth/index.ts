import {
  login,
  processLoginResponse,
  isLoggedIn,
  token,
} from "./google_authentication_repository";

export const loginIntoGoogleAccount = () => login();
export const processGoogleAccountLogin = () => processLoginResponse();
export const isLoggedIntoGoogleAccount = () => isLoggedIn();
export const GoogleToken = () => token();
