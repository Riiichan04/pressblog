export interface AuthDto {
    id: number;
    email: string;
    username: string;
    displayName: string | null;
    gender: number;
    avatar: string | null;
    description: string | null;
    isActive: boolean;
    isVerified: boolean;
    role: number;
    jwtToken: string | null;
}

export interface AuthResponse {
    result: boolean;
    message: string;
    authDto: AuthDto | null;
}