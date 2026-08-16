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
    }
});

export const { setInitialUnreadCount, incrementUnreadCount, addNewNotification } = notificationSlice.actions;
export default notificationSlice.reducer;