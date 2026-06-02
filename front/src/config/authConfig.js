export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID || 'common'}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
};

// Scopes we request for Microsoft Graph API
export const loginRequest = {
  scopes: ["User.Read"]
};

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '000000000000-dummy.apps.googleusercontent.com';
