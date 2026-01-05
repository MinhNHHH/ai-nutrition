import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    setAuth: (user: User, access_token: string) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            _hasHydrated: false,
            user: null,
            access_token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setAuth: (user, access_token) => set({
                user,
                access_token,
                isAuthenticated: true,
                error: null
            }),
            logout: () => set({
                user: null,
                access_token: null,
                isAuthenticated: false
            }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
