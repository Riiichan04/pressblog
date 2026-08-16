"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/common/types/notification";
import {
    getNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead
} from "@/services/notification-service";
import { useAuth } from "@/context/auth-context";

interface NotificationContextType {
    unreadCount: number;
    notifications: NotificationItem[];
    isLoading: boolean;
    addNewNotification: (noti: NotificationItem) => void;
    handleMarkAllAsRead: () => Promise<void>;
    handleNotificationClick: (noti: NotificationItem) => Promise<void>;
    handleViewAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const router = useRouter();

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
            console.error("Error fetching initial notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm hứng event SSE (từ Listener)
    const addNewNotification = (newNoti: NotificationItem) => {
        setUnreadCount((prev) => prev + 1);
        setNotifications((prev) => [newNoti, ...prev]);
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await markAllAsRead();

            setUnreadCount(0);
            setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error when mark all as read", error);
        }
    };

    const handleNotificationClick = async (noti: NotificationItem) => {
        if (!noti.isRead) {
            try {
                await markAsRead(noti.id);

                setUnreadCount((prev) => Math.max(0, prev - 1));
                setNotifications((prev) =>
                    prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n)
                );
            } catch (error) {
                console.error("Error when click to notification", error);
            }
        }

        if (noti.targetUrl) {
            router.push(noti.targetUrl);
        }
    };

    const handleViewAll = () => {
        router.push('/notifications');
    };

    return (
        <NotificationContext.Provider
            value={{
                unreadCount,
                notifications,
                isLoading,
                addNewNotification,
                handleMarkAllAsRead,
                handleNotificationClick,
                handleViewAll
            }}
        >
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