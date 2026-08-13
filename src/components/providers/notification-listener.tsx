"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { toast } from "sonner";
// import { useDispatch } from "react-redux";   // For badge (if impl)

export default function NotificationListener() {
    // const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) return;

        const ctrl = new AbortController();

        const connectStream = async () => {
            await fetchEventSource(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_VERSION}/notifications/stream`, {
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

                        toast.info(`${newNoti.content}`);

                        // dispatch(incrementUnreadCount());
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
    }, []);

    return null; 
}