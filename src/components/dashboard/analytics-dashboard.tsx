'use client'

import { useState, useEffect } from 'react'
import { LineChart } from '@/components/charts/LineChart'
import { BarChart } from '@/components/charts/BarChart'
import { PieChart } from '@/components/charts/PieChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { StatCard } from '@/components/charts/StatCard'
import { Users, Activity, TrendingUp, DollarSign } from 'lucide-react'

// Sample data for charts
const sampleData = {
  lineChart: [
    { month: 'Jan', users: 400, revenue: 2400 },
    { month: 'Feb', users: 300, revenue: 1398 },
    { month: 'Mar', users: 200, revenue: 9800 },
    { month: 'Apr', users: 278, revenue: 3908 },
    { month: 'May', users: 189, revenue: 4800 },
    { month: 'Jun', users: 239, revenue: 3800 },
  ],
  barChart: [
    { name: 'Flowise', value: 400 },
    { name: 'Supabase', value: 300 },
    { name: 'Vercel', value: 200 },
    { name: 'Z.ai', value: 278 },
    { name: 'GitHub', value: 189 },
  ],
  pieChart: [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 200 },
  ],
  areaChart: [
    { day: 'Mon', traffic: 4000, conversions: 240 },
    { day: 'Tue', traffic: 3000, conversions: 139 },
    { day: 'Wed', traffic: 2000, conversions: 980 },
    { day: 'Thu', traffic: 2780, conversions: 390 },
    { day: 'Fri', traffic: 1890, conversions: 480 },
    { day: 'Sat', traffic: 2390, conversions: 380 },
    { day: 'Sun', traffic: 3490, conversions: 430 },
  ]
}

export function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="2,350"
          description="+12% from last month"
          trend={{ value: 12, isPositive: true }}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Active Sessions"
          value="1,234"
          description="+8% from last week"
          trend={{ value: 8, isPositive: true }}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Revenue"
          value="$45,231"
          description="+23% from last month"
          trend={{ value: 23, isPositive: true }}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Growth Rate"
          value="23.5%"
          description="+2.1% from last month"
          trend={{ value: 2.1, isPositive: true }}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={sampleData.lineChart}
          xAxisKey="month"
          lines={[
            { dataKey: 'users', stroke: '#8884d8', name: 'Users' },
            { dataKey: 'revenue', stroke: '#82ca9d', name: 'Revenue' }
          ]}
          height={300}
        />
        
        <BarChart
          data={sampleData.barChart}
          xAxisKey="name"
          bars={[
            { dataKey: 'value', fill: '#8884d8', name: 'Usage' }
          ]}
          height={300}
        />
        
        <PieChart
          data={sampleData.pieChart.map((item, index) => ({
            ...item,
            color: ['#0088FE', '#00C49F', '#FFBB28'][index]
          }))}
          height={300}
        />
        
        <AreaChart
          data={sampleData.areaChart}
          xAxisKey="day"
          areas={[
            { dataKey: 'traffic', fill: '#8884d8', stroke: '#8884d8', name: 'Traffic' },
            { dataKey: 'conversions', fill: '#82ca9d', stroke: '#82ca9d', name: 'Conversions' }
          ]}
          height={300}
        />
      </div>
    </div>
  )
}