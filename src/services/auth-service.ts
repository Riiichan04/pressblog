import { apiUrl } from "@/common/constants/api-url"
import { AuthResponse } from "@/common/types/auth"
import { LoginValues } from "@/schemas/login-schema"
import { RegisterValues } from "@/schemas/register-schema"
import axios from 'axios'
import apiClient from "./api-client"

export const handleLogin = async (data: LoginValues) => {
    const { email, password } = data
    const response = await axios.post<AuthResponse>(`${apiUrl}/auth/login`, { email, password })
    return response.data
}

export const handleRegister = async (data: RegisterValues) => {
    const { email, username, password } = data
    const response = await axios.post<AuthResponse>(`${apiUrl}/auth/register`, { email, username, password })
    return response.data
}

export const sendResetPasswordOtp = async (email: string) => {
    const response = await axios.post(`${apiUrl}/verify/send/reset-password`, email, {
        headers: { "Content-Type": "application/json" }
    });
    return response.data;
};

export const sendVerifyAccountOtp = async (email: string) => {
    const response = await apiClient.post(`/verify/send/account`, email, {
        headers: { "Content-Type": "application/json" }
    });
    return response.data;
};

export const verifyResetPassword = async (data: { email: string; code: string; newPassword?: string }) => {
    const response = await axios.post(`${apiUrl}/verify/reset-password`, data);
    return response.data;
};

export const verifyAccount = async (data: { email: string; code: string }) => {
    const response = await apiClient.post(`/verify/account`, data);
    return response.data;
};