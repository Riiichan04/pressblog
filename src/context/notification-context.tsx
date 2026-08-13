"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { NotificationItem } from "@/common/types/notification";
import { getNotifications, getUnreadCount, resetUnreadCount } from "@/services/notification-service";

interface NotificationContextType {
    unreadCount: number;
    notifications: NotificationItem[];
    addNewNotification: (noti: NotificationItem) => void;
    resetUnread: () => void;
    isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchInitialData();
        } else {
            setUnreadCount(0);
            setNotifications([]);
        }
    }, [user]);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [unreadRes, listRes] = await Promise.all([
                getUnreadCount(),
                getNotifications(0, 10)
            ]);
            setUnreadCount(unreadRes.data.unreadCount);
            setNotifications(listRes.data.content); 
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addNewNotification = (newNoti: NotificationItem) => {
        setUnreadCount((prev) => prev + 1);
        setNotifications((prev) => [newNoti, ...prev]); 
    };

    const resetUnread = async () => {
        if (unreadCount === 0) return;
        setUnreadCount(0);
        try {
            await resetUnreadCount();
            setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error when reset unread:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ unreadCount, notifications, addNewNotification, resetUnread, isLoading }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};