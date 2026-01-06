export interface User {
    id: string;
    email: string;
    username: string;
    profilePic?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
