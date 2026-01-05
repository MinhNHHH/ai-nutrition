export interface User {
    id: string;
    email: string;
    username: string;
    profilePic?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
}

export interface AuthState {
    user: User | null;
    access_token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
