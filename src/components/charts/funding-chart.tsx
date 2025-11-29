"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { day: "Mon", amount: 5000 },
    { day: "Tue", amount: 12000 },
    { day: "Wed", amount: 8000 },
    { day: "Thu", amount: 15000 },
    { day: "Fri", amount: 22000 },
    { day: "Sat", amount: 18000 },
    { day: "Sun", amount: 25000 },
];

export function FundingChart() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Funding Velocity</CardTitle>
                <CardDescription>Daily capital inflow this week</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="day"
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
                                cursor={{ fill: "#f3f4f6" }}
                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]}
                            />
                            <Bar
                                dataKey="amount"
                                fill="#9333ea"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
