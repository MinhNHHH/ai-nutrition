import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { AuthResponse, User } from '../types/auth';
import { apiClient } from './client';

// Ensure the browser can return to the app
WebBrowser.maybeCompleteAuthSession();

export const authService = {
    /**
     * Authenticate using Browser redirection flow
     */
    googleLogin: async (): Promise<AuthResponse> => {
        const baseURL = apiClient.defaults.baseURL;
        const authUrl = `${baseURL}/auth/login`;

        // Open the auth session in the system browser
        // const result = await WebBrowser.openAuthSessionAsync(authUrl, 'localhost:7777/auth');
        const result = await WebBrowser.openAuthSessionAsync(authUrl, 'myapp://auth');

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

    /**
     * Terminate session
     */
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout').catch(() => { });
    },

    /**
     * Get profile for authenticated user
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }
};
