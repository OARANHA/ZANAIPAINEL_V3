"use client"

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AreaChartProps {
  data: any[]
  xAxisKey: string
  areas: Array<{
    dataKey: string
    fill: string
    stroke: string
    name: string
  }>
  height?: number
  className?: string
}

export function AreaChart({ data, xAxisKey, areas, height = 300, className }: AreaChartProps) {
  const chartConfig = areas.reduce((acc, area) => {
    acc[area.dataKey] = {
      label: area.name,
      color: area.stroke,
    }
    return acc
  }, {} as any)

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stroke={area.stroke}
            fill={area.fill}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  )
}