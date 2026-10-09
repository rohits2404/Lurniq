"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An Interactive Area Chart";

const chartConfig = {
    enrollments: {
        label: "Enrollments",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
    data: { date: string; enrollments: number }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
    const totalEnrollmentsNumber = React.useMemo(
        () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
        [data],
    );

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Total Enrollments</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Total Enrollments For The Last 30 Days:{" "}
                        {totalEnrollmentsNumber}
                    </span>
                    <span className="@[540px]/card:hidden">
                        Last 30 Days: {totalEnrollmentsNumber}
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    className="aspect-auto h-62.5 w-full"
                    config={chartConfig}
                >
                    <BarChart
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            interval={"preserveStartEnd"}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-37.5"
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                            },
                                        );
                                    }}
                                />
                            }
                        />

                        <Bar
                            dataKey="enrollments"
                            fill="var(--color-enrollments)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
