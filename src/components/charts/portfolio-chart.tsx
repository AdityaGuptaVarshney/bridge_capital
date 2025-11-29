"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { month: "Jan", value: 10000 },
    { month: "Feb", value: 15000 },
    { month: "Mar", value: 12000 },
    { month: "Apr", value: 25000 },
    { month: "May", value: 32000 },
    { month: "Jun", value: 45000 },
    { month: "Jul", value: 55000 },
];

export function PortfolioChart() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Portfolio Growth</CardTitle>
                <CardDescription>Your investment value over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                tickFormatter={(value) => `₹${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Value"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
