import { login, isLoggedIn, token } from "./google_authentication_repository";

export const initializeGoogleLogin = () => login()
export const isLoggedIntoGoogleAccount = () => isLoggedIn()
export const googleToken = () => token()
