import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '@/common/types/notification';

interface NotificationState {
    unreadCount: number;
    notifications: NotificationItem[];
}

const initialState: NotificationState = {
    unreadCount: 0,
    notifications: [],
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setInitialUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
        incrementUnreadCount: (state) => {
            state.unreadCount += 1;
        },
        addNewNotification: (state, action: PayloadAction<NotificationItem>) => {
            state.notifications.unshift(action.payload);
        },
        markAsReadAction: (state, action: PayloadAction<number>) => {
            const noti = state.notifications.find(n => n.id === action.payload);
            if (noti && !noti.isRead) {
                noti.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsReadAction: (state) => {
            state.notifications.forEach(noti => {
                noti.isRead = true;
            });
            state.unreadCount = 0;
        },
    }
});

export const { setInitialUnreadCount, incrementUnreadCount, addNewNotification, markAllAsReadAction, markAsReadAction } = notificationSlice.actions;
export default notificationSlice.reducer;