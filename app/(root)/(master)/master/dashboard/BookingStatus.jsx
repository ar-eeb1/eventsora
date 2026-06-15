"use client"
import { Label, Pie, PieChart } from "recharts"
import { CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React from "react"
export const description = "A chart"

const chartData = [
    { status: "pending", count: 10, fill: "var(--color-pending)" },
    { status: "confirmed", count: 29, fill: "var(--color-confirmed)" },
    { status: "rejected", count: 1, fill: "var(--color-rejected)" },
    { status: "cancelled", count: 2, fill: "var(--color-cancelled)" },
    { status: "completed", count: 80, fill: "var(--color-completed)" },
]

const chartConfig = {
    status: {
        label: "Status",
    },
    pending: {
        label: "Pending",
        color: "#f59e0b",
    },
    confirmed: {
        label: "Confirmed",
        color: "#22c55e",
    },
    rejected: {
        label: "Rejected",
        color: "#ef4444",
    },
    cancelled: {
        label: "Cancelled",
        color: "#6b7280",
    },
    completed: {
        label: "Completed",
        color: "#3b82f6",
    },

}

export function BookingStatus() {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])
    return (
        <div>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    100
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Bookings
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <div>
                <ul>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Pending</span>
                        <span className="rounded-full text-sm text-white p-1 px-2 bg-[#f59e0b]">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Confirmed</span>
                        <span className="rounded-full text-sm text-white p-1 px-2 bg-[#22c55e]">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Rejected</span>
                        <span className="rounded-full text-sm text-white p-1 px-2 bg-[#ef4444]">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Cancelled</span>
                        <span className="rounded-full text-sm text-white p-1 px-2 bg-[#6b7280]">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Completed</span>
                        <span className="rounded-full text-sm text-white p-1 px-2 bg-[#3b82f6]">0</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
