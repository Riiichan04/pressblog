"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { incrementUnreadCount, addNewNotification } from "@/store/slices/notification-slice";

export default function NotificationListener() {
    const dispatch = useDispatch();
    const { t } = useTranslation('notification');

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) return;

        const ctrl = new AbortController();

        const connectStream = async () => {
            await fetchEventSource(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_VERSION}/notification/stream`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "text/event-stream",
                },
                signal: ctrl.signal,
                async onopen(res) {
                    if (res.ok && res.status === 200) {
                        console.log("SSE Connection Opened");
                    } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
                        console.log("SSE Client Error, closing...");
                        throw new Error("Client error");
                    }
                },
                onmessage(event) {
                    if (event.event === "new-notification") {
                        const newNoti = JSON.parse(event.data);

                        const [rawKey, ...args] = (newNoti.content || '').split('|');
                        const translateKey = rawKey.trim().replace('notification.', '');
                        const safeArg = args.join('|') || '';

                        toast.info(t('title'), {
                            description: t(translateKey, { postName: safeArg })
                        });

                        dispatch(incrementUnreadCount());
                        dispatch(addNewNotification(newNoti));

                    } else if (event.event === "connected") {
                        console.log("Server says:", event.data);
                    }
                },
                onclose() {
                    console.log("SSE Connection Closed by Server");
                },
                onerror(err) {
                    console.error("SSE Error:", err);
                    return 5000;
                }
            });
        };

        connectStream();

        return () => {
            ctrl.abort();
        };
    }, [dispatch, t]);

    return null;
}