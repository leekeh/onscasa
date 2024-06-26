import { createSecureStore } from "@storage";
import type { AuthenticationResponse } from "./types";
import { Result, Failure, Success } from "@types";

const storedAccessToken = createSecureStore<string>("access_token");
const storedRefreshToken = createSecureStore<string>("refresh_token");

// Scopes must match the scopes configured in the Google Developers Console.
const SCOPES = ["https://www.googleapis.com/auth/photoslibrary.readonly"].join(
  "_"
);

const save = (accessToken: string, refreshToken: string): void => {
  console.log(`Saving access token & refresh token...`);
  storedAccessToken.set(accessToken);
  storedRefreshToken.set(refreshToken);
};

const authenticate = async (
  authorizationCode: string
): Promise<AuthenticationResponse> => {
  const url = new URL("https://oauth2.googleapis.com/token");
  Object.entries({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    redirect_uri: import.meta.env.VITE_HOSTURL,
    code: authorizationCode,
    grant_type: "authorization_code",
  }).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const body = await response.json();

  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
  };
};

const requestAuthorizationCode = (): void => {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  Object.entries({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_HOSTURL,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
  }).forEach(([key, value]) => url.searchParams.append(key, value));

  window.location.assign(url);
};

const processAuthorizationCode = (params: string): string | null => {
  const code = new URLSearchParams(params).get("code");

  return code ? encodeURI(code) : null;
};

const hasAuthorizationError = (params: string): boolean =>
  new URLSearchParams(params).get("error") !== null;

const requestAccessToken = async (code: string): Promise<Result<void>> => {
  try {
    const result = await authenticate(code);

    if (result.accessToken === undefined)
      return new Failure("Got an invalid access token!");

    save(result.accessToken, result.refreshToken);

    return new Success();
  } catch (e) {
    return new Failure("Got an invalid access token!");
  }
};

export const login = (): void => {
  requestAuthorizationCode();
};

export const processLoginResponse = async (): Promise<void> => {
  if (hasAuthorizationError(window.location.search)) {
    console.log("User refused to authenticate :(");
    return;
  }

  const authorizationCode = processAuthorizationCode(window.location.search);
  if (authorizationCode === null) return;

  const result = await requestAccessToken(authorizationCode);

  if (result instanceof Success) {
    window.location.replace(import.meta.env.VITE_HOSTURL);
    return;
  }

  console.log(`Failed to exchange authorization for authentication token`);
};

export const isLoggedIn = (): boolean => token() !== null;

export const refreshToken = async (): Promise<Result<void>> => {
  const refreshToken = storedRefreshToken.state;

  if (refreshToken === null) return new Failure("No refresh token stored");

  return await requestAccessToken(refreshToken);
};

export const token = (): string | null => storedAccessToken.state;
