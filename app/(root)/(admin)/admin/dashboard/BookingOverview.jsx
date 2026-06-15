"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"

export const description = "A bar chart"

// const chartData = [
//     { month: "January", bookings: 186 },
//     { month: "February", bookings: 305 },
//     { month: "March", bookings: 237 },
//     { month: "April", bookings: 73 },
//     { month: "May", bookings: 209 },
//     { month: "June", bookings: 214 },
//     { month: "July", bookings: 134 },
//     { month: "August", bookings: 511 },
//     { month: "September", bookings: 31 },
//     { month: "October", bookings: 123 },
//     { month: "November", bookings: 214 },
//     { month: "December", bookings: 124 },
// ]

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const chartConfig = {
    amount: {
        label: "Revenue",
        color: "var(--chart-1)",
    },
}


export function BookingOverview() {
    const [chartData, setChartData] = useState([])

    const { data: monthlyBookingRevenue, loading } = useFetch('/api/admin/dashboard/monthly-bookings')

    useEffect(() => {
        if (monthlyBookingRevenue?.success) {
            const getChartData = months.map((month, index) => {
                const monthData = monthlyBookingRevenue.data.find(
                    item => item._id.month === index + 1
                )

                return {
                    month: month,
                    amount: monthData ? monthData.totalRevenue : 0
                }
            })

            setChartData(getChartData)
        }
    }, [monthlyBookingRevenue])
    return (
        <div>

            <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />

                </BarChart>
            </ChartContainer>

        </div>
    )
}
