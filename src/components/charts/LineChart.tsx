"use client"

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface LineChartProps {
  data: any[]
  xAxisKey: string
  lines: Array<{
    dataKey: string
    stroke: string
    name: string
  }>
  height?: number
  className?: string
}

export function LineChart({ data, xAxisKey, lines, height = 300, className }: LineChartProps) {
  const chartConfig = lines.reduce((acc, line) => {
    acc[line.dataKey] = {
      label: line.name,
      color: line.stroke,
    }
    return acc
  }, {} as any)

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}