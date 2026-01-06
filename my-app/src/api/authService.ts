import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { AuthResponse, User } from '../types/auth';
import { apiClient } from './client';

WebBrowser.maybeCompleteAuthSession();

export const authService = {
    /**
     * Authenticate using Browser redirection flow
     */
    googleLogin: async (): Promise<AuthResponse> => {
        const baseURL = apiClient.defaults.baseURL;
        const authUrl = `${baseURL}/auth/login`;

        // Open the auth session in the system browser with preferEphemeralSession: true
        // This ensures cookies/cache are not persisted, forcing fresh login next time.
        const result = await WebBrowser.openAuthSessionAsync(authUrl, 'myapp://auth', {
            preferEphemeralSession: true,
        });

        if (result.type === 'success' && result.url) {
            // Parse the data from the deep link
            const { queryParams } = Linking.parse(result.url);

            if (queryParams?.data) {
                try {
                    const data = JSON.parse(decodeURIComponent(queryParams.data as string));
                    return data as AuthResponse;
                } catch (e) {
                    throw new Error('Failed to parse auth data from redirect');
                }
            }
        }
        throw new Error('Login cancelled or failed');
    },

    logout: async (): Promise<void> => {
        await WebBrowser.openBrowserAsync('https://accounts.google.com/Logout', {
            showInRecents: false,
        });
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }
};
