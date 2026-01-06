import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            _hasHydrated: false,
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setAuth: (user, token) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
            },
            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
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
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
