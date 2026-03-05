import { AuthResponse } from "@/common/types/auth"
import { LoginValues } from "@/schemas/login-schema"
import { RegisterValues } from "@/schemas/register-schema"
import axios from 'axios'

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}${process.env.NEXT_PUBLIC_API_VERSION || ""}`

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