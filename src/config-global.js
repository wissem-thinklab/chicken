import { paths } from "./router/paths";

export const CONFIG = {
    serverUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    appName: import.meta.env.VITE_APP_NAME || 'Chicken Game',
    auth: {
        method: import.meta.env.VITE_AUTH_METHOD || 'jwt',
        redirectUrl: paths.auth.signIn
    }
};
