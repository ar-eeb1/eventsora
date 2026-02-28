"use client"
import { Label, Pie, PieChart } from "recharts"
import { CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React, { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"

export const description = "A chart"

const chartConfig = {
    status: {
        label: "Status",
    },
    pending: {
        label: "Pending",
        color: "#fbbf24",
    },
    confirmed: {
        label: "Confirmed",
        color: "#22c55e",
    },
    "awaiting-payment": {
        label: "Awaiting Payment",
        color: "#f97316",
    },
    completed: {
        label: "Completed",
        color: "#2563eb",
    },
    cancelled: {
        label: "Cancelled",
        color: "#9ca3af",
    },
    unverified: {
        label: "Unverified",
        color: "#8b5cf6",
    },
};

export function BookingStatus() {
    const [chartData, setChartData] = useState([])
    const [totalCount, setTotalCount] = useState(0)

    const { data: bookingsStatus, loading } = useFetch('/api/provider/dashboard/bookings-status')

    useEffect(() => {
        if (bookingsStatus && bookingsStatus.success) {
            const requiredStatuses = ['pending', 'confirmed', 'awaiting-payment', 'completed', 'cancelled', 'unverified'];

            const newBookingStatus = requiredStatuses.map((status) => {
                const found = bookingsStatus.data.find((o) => o._id === status);
                return {
                    status: status,
                    count: found ? found.count : 0,
                    fill: `var(--color-${status.replace(/-/g, '')})`
                };
            });

            setChartData(newBookingStatus)
            const total = newBookingStatus.reduce((acc, curr) => acc + curr.count, 0)
            setTotalCount(total)
        }
    }, [bookingsStatus])

    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [chartData])
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
                                                    {totalCount}
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
                    {chartData.map((item) => (
                        <li key={item.status} className="flex justify-between items-center mb-3 text-sm">
                            <span className="capitalize">{item.status.replace(/-/g, ' ')}</span>
                            <span
                                className="rounded-full text-xs text-white p-1 px-2"
                                style={{ backgroundColor: chartConfig[item.status]?.color || '#6b7280' }}
                            >
                                {item.count}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
