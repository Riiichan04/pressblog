"use client"

import { NotificationItem } from '@/common/types/notification';
import { cn } from '@/lib/utils';
import { Trans, useTranslation } from "react-i18next";

export default function NotificationComponent({ noti }: { noti: NotificationItem }) {
    const { t } = useTranslation('notification');

    const [rawKey, ...args] = (noti.content || '').split('|');
    const translateKey = rawKey.trim().replace('notification.', '');
    const safeArg = args.join('|') || '';
    return (

        <div className="flex items-start gap-3 w-full">
            <div className="flex-1 space-y-1">
                <p className={cn("text-sm leading-snug", !noti.isRead ? "font-medium" : "text-muted-foreground")}>
                    <Trans
                        t={t}
                        i18nKey={translateKey}
                        values={{ postName: safeArg }}
                        components={{ strong: <span className="font-semibold text-indigo-600" /> }}
                    />
                </p>
                <p className="text-xs text-muted-foreground/70">
                    {new Date(noti.createdAt).toLocaleDateString()}
                </p>
            </div>
            {!noti.isRead && (
                <div className="h-2 w-2 bg-indigo-500 rounded-full shrink-0 mt-2"></div>
            )}
        </div>



    );
}