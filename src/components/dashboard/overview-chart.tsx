"use client"

import { DailyViewStat } from "@/common/types/dashboard";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function OverviewChart(props: { data: DailyViewStat[] }) {
    const chartData = (props.data || []).map(item => {
        const dateObj = new Date(item.date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

        return {
            name: `${day}/${month}`,
            views: item.views
        };
    });

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e40af" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: 'black' }}
                />
                <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#1e40af"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}