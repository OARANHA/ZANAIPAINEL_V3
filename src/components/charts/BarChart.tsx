"use client"

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartProps {
  data: any[]
  xAxisKey: string
  bars: Array<{
    dataKey: string
    fill: string
    name: string
  }>
  height?: number
  className?: string
}

export function BarChart({ data, xAxisKey, bars, height = 300, className }: BarChartProps) {
  const chartConfig = bars.reduce((acc, bar) => {
    acc[bar.dataKey] = {
      label: bar.name,
      color: bar.fill,
    }
    return acc
  }, {} as any)

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.fill}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}