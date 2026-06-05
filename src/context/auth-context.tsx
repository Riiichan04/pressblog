"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Cookies from "js-cookie";
import { AuthDto } from "@/common/types/auth";
import { PermissionType } from "@/common/constants/permissions";
import { ROLES, RoleType } from "@/common/constants/roles";

interface AuthContextType {
    user: AuthDto | null;
    login: (userData: AuthDto) => void;
    logout: () => void;
    updateUser: (updatedData: Partial<AuthDto>) => void;
    hasPermission: (permission: PermissionType | PermissionType[]) => boolean;
    hasRole: (role: RoleType | RoleType[]) => boolean;

    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [{ user, isLoading }, setAuthState] = useState<{
        user: AuthDto | null;
        isLoading: boolean;
    }>(() => {
        if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("user_data");
            const token = Cookies.get("token");
            if (savedUser && token) {
                try {
                    return { user: JSON.parse(savedUser), isLoading: false };
                } catch {
                    return { user: null, isLoading: false };
                }
            }
        }
        return { user: null, isLoading: false };
    });

    const login = useCallback((userData: AuthDto) => {
        if (!userData.jwtToken) return
        setAuthState({ user: userData, isLoading: false });
        Cookies.set("token", userData.jwtToken, { expires: 7 });
        localStorage.setItem("user_data", JSON.stringify(userData));
    }, []);

    const logout = () => {
        setAuthState({ user: null, isLoading: false });
        Cookies.remove("token");
        localStorage.removeItem("user_data");
        window.location.href = "/";
    };

    const updateUser = (updatedData: Partial<AuthDto>) => {
        setAuthState((prev) => {
            if (!prev.user) return prev;
            const newUser = { ...prev.user, ...updatedData };
            localStorage.setItem("user_data", JSON.stringify(newUser));

            return { ...prev, user: newUser };
        });
    };

    const hasPermission = (permission: PermissionType | PermissionType[]) => {
        if (!user) return false;

        if (user.role === ROLES.ADMIN || user.role === ROLES.ADMIN) return true;

        const permissionsToCheck = Array.isArray(permission) ? permission : [permission];

        return permissionsToCheck.some(p => user.permissions?.includes(p));
    };

    const hasRole = (role: RoleType | RoleType[]) => {
        if (!user) return false;

        const rolesToCheck = Array.isArray(role) ? role : [role];
        return rolesToCheck.includes(user.role as RoleType);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, hasPermission, hasRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};