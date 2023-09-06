import { google, Auth } from "googleapis";

export const getGoogleAuthToken = async () => {
  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
   * from the client_secret.json file. To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  const oauth2Client = new google.auth.OAuth2(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    import.meta.env.VITE_HOSTURL
  );

  // Scopes must match the scopes configured in the Google Developers Console.
  const scopes = ["https://www.googleapis.com/auth/photoslibrary.readonly"];

  // Generate a url that asks permissions for the Drive activity scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
  });
  try {
    window.location.replace(authorizationUrl);
    //TODO get the authorization token after redir
  } catch (e) {
    return "error";
  }
};
