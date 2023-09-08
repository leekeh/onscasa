import { googleAuthToken, googleAuthExpiration } from "@store";
import { get } from "svelte/store";

const storeAuth = () => {
  const accesToken = window.location.hash.split("&")[0].split("=")[1];
  googleAuthToken.set(accesToken);
  const expiresIn = +window.location.hash.split("&")[2].split("=")[1];
  googleAuthExpiration.set(new Date(new Date().getTime() + expiresIn * 1000));
  window.location.replace(import.meta.env.VITE_HOSTURL);
};

const redirToAuth = () => {
  // Scopes must match the scopes configured in the Google Developers Console.
  const scopes = [
    "https://www.googleapis.com/auth/photoslibrary.readonly",
  ].join("_");
  const authorizationUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?scope=${scopes}` +
    `&include_granted_scopes=true` +
    `&response_type=token` +
    `&redirect_uri=${import.meta.env.VITE_HOSTURL}` +
    `&client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}`;
  window.location.assign(authorizationUrl);
};

export const getGoogleAuthToken = () => {
  //If we just came back from a redirect, store the result
  if (window.location.hash) {
    storeAuth();
  } else if (!get(googleAuthToken) || get(googleAuthExpiration) < new Date()) {
    redirToAuth();
  }
};
