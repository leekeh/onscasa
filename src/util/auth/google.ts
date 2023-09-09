import { storedAccessToken, storedRefreshToken } from "@store";
import { get } from "svelte/store";

// Scopes must match the scopes configured in the Google Developers Console.
const SCOPES = [
  "https://www.googleapis.com/auth/photoslibrary.readonly",
].join("_");


interface AuthenticationResponse {
  accessToken: string,
  refreshToken: string
};

const save = (accessToken: string, refreshToken: string) => {
  storedAccessToken.set(accessToken);
  storedRefreshToken.set(refreshToken);
};

const authenticate = async (authorizationCode: string): AuthenticationResponse => {
  const authenticationURL = new URL("https://oauth2.googleapis.com/token");
  authenticationURL.searchParams.append("client_id", `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`);
  authenticationURL.searchParams.append("client_secret", `${import.meta.env.VITE_GOOGLE_CLIENT_SECRET}`);
  authenticationURL.searchParams.append("code", `${authorizationCode}`);
  authenticationURL.searchParams.append("grant_type", "authorization_code");
  authenticationURL.searchParams.append("redirect_uri", `${import.meta.env.VITE_HOSTURL}`);

  const response = await fetch(authenticationURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  const body = await response.json();

  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token
  };
};

const authorizate = () => {
  const authorizationURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationURL.searchParams.append("client_id", `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`);
  authorizationURL.searchParams.append("redirect_uri", `${import.meta.env.VITE_HOSTURL}`);
  authorizationURL.searchParams.append("response_type", "code");
  authorizationURL.searchParams.append("scope", `${SCOPES}`);
  authorizationURL.searchParams.append("access_type", "offline");
  authorizationURL.searchParams.append("prompt", "consent");
  authorizationURL.searchParams.append("include_granted_scopes", "true");

  window.location.assign(authorizationURL);
};

const processAuthorizationCode = (params: string): (string|null) => {
  const code = new URLSearchParams(params).get("code")

  if (code) {
    return encodeURI(code)
  }

  return null;
};

const hasAuthorizationError = (params: string): boolean => {
  return new URLSearchParams(params).get("error") !== null
}

const hasAuthorizationSuccess = (params: string): boolean => {
  return processAuthorizationCode(params) !== null
}

export const getGoogleAuthToken = () => {
  if (hasAuthorizationError(window.location.search)) {
    console.log("User refused to authorizate :(");
    return
  }

  if (!get(storedAccessToken) && !hasAuthorizationSuccess(window.location.search)) {
    authorizate();
    return
  }

  const authorizationCode = processAuthorizationCode(window.location.search)

  authenticate(authorizationCode)
    .then((tokens) => {
      save(tokens.accessToken, tokens.refreshToken);
      // Redirect for now breaks the exchange between the authorization code and access token.
      // If you want to test it just navigate back to the root yourself
      // window.location.replace(import.meta.env.VITE_HOSTURL);
    })
    .catch((exception) => {
      console.log(`Failed to exchange authorization for authentication token ${exception}`);
    });
};
