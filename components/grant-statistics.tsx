"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Calendar, CheckCircle, Clock, DollarSign, BarChart2 } from "lucide-react"
import type { Grant, ApplicationStatus } from "@/lib/types"

interface GrantStatisticsProps {
  grants: Grant[]
  bookmarkedGrants: string[]
  statuses: Record<string, ApplicationStatus>
  minimal?: boolean
}

export default function GrantStatistics({ grants, bookmarkedGrants, statuses, minimal = false }: GrantStatisticsProps) {
  const [windowWidth, setWindowWidth] = useState(1200)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)

      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const getChartHeight = useCallback(() => {
    if (windowWidth < 640) return 250
    if (windowWidth < 1024) return 300
    return 350
  }, [windowWidth])

  const getFontSize = useCallback(
    (size: "sm" | "md" | "lg") => {
      if (size === "sm") {
        return windowWidth < 640 ? "text-xs" : "text-sm"
      } else if (size === "md") {
        return windowWidth < 640 ? "text-sm" : "text-base"
      } else {
        return windowWidth < 640 ? "text-lg" : windowWidth < 1024 ? "text-xl" : "text-2xl"
      }
    },
    [windowWidth],
  )

  const categoryStats = useMemo(() => {
    const stats = grants.reduce(
      (acc, grant) => {
        const category = grant.category
        if (!acc[category]) {
          acc[category] = {
            name: category,
            count: 0,
            bookmarked: 0,
            totalAmount: 0,
            averageAmount: 0,
          }
        }

        acc[category].count += 1
        acc[category].totalAmount += grant.amount

        if (bookmarkedGrants.includes(grant.id)) {
          acc[category].bookmarked += 1
        }

        return acc
      },
      {} as Record<
        string,
        { name: string; count: number; bookmarked: number; totalAmount: number; averageAmount: number }
      >,
    )

    Object.values(stats).forEach((stat) => {
      stat.averageAmount = Math.round(stat.totalAmount / stat.count)
    })

    return Object.values(stats).sort((a, b) => b.count - a.count)
  }, [grants, bookmarkedGrants])

  const statusStats = useMemo(() => {
    const stats = {
      "Not Started": 0,
      "In Progress": 0,
      Applied: 0,
      Awarded: 0,
      Rejected: 0,
    }

    bookmarkedGrants.forEach((grantId) => {
      const status = statuses[grantId] || "Not Started"
      stats[status] += 1
    })

    return Object.entries(stats).map(([name, value]) => ({ name, value }))
  }, [bookmarkedGrants, statuses])

  const deadlineStats = useMemo(() => {
    const today = new Date()
    const oneWeek = new Date()
    oneWeek.setDate(today.getDate() + 7)
    const oneMonth = new Date()
    oneMonth.setDate(today.getDate() + 30)
    const threeMonths = new Date()
    threeMonths.setDate(today.getDate() + 90)

    const stats = {
      "This Week": 0,
      "This Month": 0,
      "Next 3 Months": 0,
      Later: 0,
      Expired: 0,
    }

    grants.forEach((grant) => {
      if (!bookmarkedGrants.includes(grant.id)) return

      const deadlineDate = new Date(grant.deadline)

      if (deadlineDate < today) {
        stats["Expired"] += 1
      } else if (deadlineDate <= oneWeek) {
        stats["This Week"] += 1
      } else if (deadlineDate <= oneMonth) {
        stats["This Month"] += 1
      } else if (deadlineDate <= threeMonths) {
        stats["Next 3 Months"] += 1
      } else {
        stats["Later"] += 1
      }
    })

    return Object.entries(stats).map(([name, value]) => ({ name, value }))
  }, [grants, bookmarkedGrants])

  const amountDistribution = useMemo(() => {
    const distribution = [
      { name: "< $5K", value: 0 },
      { name: "$5K-$10K", value: 0 },
      { name: "$10K-$25K", value: 0 },
      { name: "$25K-$50K", value: 0 },
      { name: "> $50K", value: 0 },
    ]

    grants.forEach((grant) => {
      if (grant.amount < 5000) {
        distribution[0].value += 1
      } else if (grant.amount < 10000) {
        distribution[1].value += 1
      } else if (grant.amount < 25000) {
        distribution[2].value += 1
      } else if (grant.amount < 50000) {
        distribution[3].value += 1
      } else {
        distribution[4].value += 1
      }
    })

    return distribution
  }, [grants])

  const radarData = useMemo(() => {
    return categoryStats.slice(0, 5).map((stat) => ({
      category: stat.name,
      count: stat.count,
      bookmarked: stat.bookmarked,
      avgAmount: stat.averageAmount / 1000, 
    }))
  }, [categoryStats])


  const successRate = useMemo(() => {
    const applied = statusStats.find((s) => s.name === "Applied")?.value || 0
    const awarded = statusStats.find((s) => s.name === "Awarded")?.value || 0
    const rejected = statusStats.find((s) => s.name === "Rejected")?.value || 0

    const total = applied + awarded + rejected
    return total > 0 ? Math.round((awarded / total) * 100) : 0
  }, [statusStats])

  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#facc15",
    "#84cc16",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
  ]

  const STATUS_COLORS = {
    "Not Started": "#94a3b8",
    "In Progress": "#3b82f6",
    Applied: "#f59e0b",
    Awarded: "#10b981",
    Rejected: "#ef4444",
  }

  const DEADLINE_COLORS = {
    "This Week": "#ef4444",
    "This Month": "#f59e0b",
    "Next 3 Months": "#3b82f6",
    Later: "#10b981",
    Expired: "#6b7280",
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (minimal) {
    return (
      <div className="space-y-4 md:space-y-6 overflow-auto max-h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-card rounded-lg p-3 sm:p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Bookmarked</p>
              <Badge variant="outline" className="text-xs">
                {Math.round((bookmarkedGrants.length / grants.length) * 100)}%
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-1">{bookmarkedGrants.length}</p>
            <div className="text-xs text-muted-foreground mt-1">of {grants.length} total grants</div>
          </div>
          <div className="bg-card rounded-lg p-3 sm:p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <Badge
                variant={successRate > 50 ? "default" : successRate > 25 ? "outline" : "destructive"}
                className={`text-xs ${successRate > 50 ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                  successRate > 25 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}`}
              >
                {successRate}%
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-1">{statusStats.find((s) => s.name === "Awarded")?.value || 0}</p>
            <div className="text-xs text-muted-foreground mt-1">grants awarded</div>
          </div>
        </div>

        <div className="h-[160px] sm:h-[180px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusStats}
                cx="50%"
                cy="50%"
                innerRadius={windowWidth < 640 ? 40 : windowWidth < 1024 ? 60 : 80}
                outerRadius={windowWidth < 640 ? 70 : windowWidth < 1024 ? 90 : 120}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-2">
          {statusStats.map((status, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full mb-1"
                style={{
                  backgroundColor:
                    STATUS_COLORS[status.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length],
                }}
              />
              <span className="text-xs text-muted-foreground truncate w-full text-center">{status.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalFunding = grants.reduce((sum, grant) => sum + grant.amount, 0)
  const averageAmount = Math.round(totalFunding / grants.length)

  return (
    <div className="space-y-8 md:space-y-10 overflow-auto max-h-[calc(100vh-8rem)] pb-6 px-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="overflow-hidden border-l-4 border-l-primary">
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>Total Grants</CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-bold mt-1">{grants.length}</CardTitle>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <Badge variant="outline" className="text-xs">
                {categoryStats.length} Categories
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>Bookmarked</CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-bold mt-1">{bookmarkedGrants.length}</CardTitle>
              </div>
              <div className="bg-indigo-500/10 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-muted-foreground">
                {Math.round((bookmarkedGrants.length / grants.length) * 100)}% of total
              </span>
            </div>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>Total Funding</CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-bold mt-1">
                  ${(totalFunding / 1000).toFixed(0)}K
                </CardTitle>
              </div>
              <div className="bg-emerald-500/10 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-muted-foreground">${(averageAmount / 1000).toFixed(1)}K average</span>
            </div>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-bold mt-1">{successRate}%</CardTitle>
              </div>
              <div className="bg-amber-500/10 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-muted-foreground">
                {statusStats.find((s) => s.name === "Awarded")?.value || 0} awarded grants
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <TabsList className="grid min-w-[500px] grid-cols-4 mb-6 md:mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="status">Application Status</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <BarChart2 className="h-5 w-5" />
                  Grant Amount Distribution
                </CardTitle>
                <CardDescription>Distribution of grants by funding amount</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className={`h-[${getChartHeight()}px] w-full`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={amountDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Grants" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {amountDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <TrendingUp className="h-5 w-5" />
                  Category Comparison
                </CardTitle>
                <CardDescription>Top 5 categories by grant count and bookmarks</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className={`h-[${getChartHeight()}px] w-full`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                      <Radar name="Total Grants" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                      <Radar name="Bookmarked" dataKey="bookmarked" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <DollarSign className="h-5 w-5" />
                Funding by Category
              </CardTitle>
              <CardDescription>Average grant amount by category</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className={`h-[${getChartHeight()}px] w-full`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={categoryStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="averageAmount"
                      name="Average Amount ($)"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <BarChart2 className="h-5 w-5" />
                Grants by Category
              </CardTitle>
              <CardDescription>Distribution of grants across different categories</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className={`h-[${getChartHeight()}px] w-full`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="count" name="Total Grants" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="bookmarked" name="Bookmarked" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
                {categoryStats.slice(0, 6).map((category, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-2xl font-bold mt-1">{category.count}</p>
                      </div>
                      <Badge variant="outline">${(category.averageAmount / 1000).toFixed(1)}K avg</Badge>
                    </div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(category.bookmarked / category.count) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>{category.bookmarked} bookmarked</span>
                      <span>{Math.round((category.bookmarked / category.count) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <CheckCircle className="h-5 w-5" />
                  Application Status
                </CardTitle>
                <CardDescription>Status of your bookmarked grant applications</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className={`h-[${getChartHeight()}px] w-full`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={windowWidth < 640 ? 40 : windowWidth < 1024 ? 60 : 80}
                        outerRadius={windowWidth < 640 ? 70 : windowWidth < 1024 ? 90 : 120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        label={({ name, percent }) =>
                          percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                        }
                        labelLine={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "3 3" }}
                      >
                        {statusStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-4 mt-4">
                  {statusStats.map((status, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-4 h-4 rounded-full mb-2"
                        style={{
                          backgroundColor:
                            STATUS_COLORS[status.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium text-center">{status.name}</span>
                      <span className="text-2xl font-bold mt-1">{status.value}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {status.value > 0 ? `${Math.round((status.value / bookmarkedGrants.length) * 100)}%` : "0%"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <TrendingUp className="h-5 w-5" />
                  Application Progress
                </CardTitle>
                <CardDescription>Track your grant application journey</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-center h-[350px] md:h-[350px] w-full">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold">{successRate}%</div>
                        <div className="text-muted-foreground mt-2">Success Rate</div>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />

                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={
                          successRate > 75
                            ? "#10b981"
                            : successRate > 50
                              ? "#3b82f6"
                              : successRate > 25
                                ? "#f59e0b"
                                : "#ef4444"
                        }
                        strokeWidth="10"
                        strokeDasharray={`${successRate * 2.51} 251`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">Applied</h4>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
                        {statusStats.find((s) => s.name === "Applied")?.value || 0}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">Applications submitted and awaiting decision</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">Awarded</h4>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                        {statusStats.find((s) => s.name === "Awarded")?.value || 0}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">Successfully awarded grants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deadlines">
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Calendar className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Timeline of your bookmarked grant deadlines</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className={`h-[${getChartHeight()}px] w-full`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deadlineStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={windowWidth < 640 ? 40 : windowWidth < 1024 ? 60 : 80}
                        outerRadius={windowWidth < 640 ? 70 : windowWidth < 1024 ? 90 : 120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        label={({ name, percent }) =>
                          percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                        }
                        labelLine={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "3 3" }}
                      >
                        {deadlineStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              DEADLINE_COLORS[entry.name as keyof typeof DEADLINE_COLORS] ||
                              COLORS[index % COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mt-4">
                  {deadlineStats.map((deadline, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-4 h-4 rounded-full mb-2"
                        style={{
                          backgroundColor:
                            DEADLINE_COLORS[deadline.name as keyof typeof DEADLINE_COLORS] ||
                            COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium text-center">{deadline.name}</span>
                      <span className="text-2xl font-bold mt-1">{deadline.value}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {deadline.value > 0 ? `${Math.round((deadline.value / bookmarkedGrants.length) * 100)}%` : "0%"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Clock className="h-5 w-5" />
                  Deadline Urgency
                </CardTitle>
                <CardDescription>Prioritize your grant applications</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className={`h-[${getChartHeight()}px] w-full`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={deadlineStats.filter((d) => d.name !== "Expired")}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Grants"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 8, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-amber-500/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-500/10 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <h4 className="font-medium">Urgent Applications</h4>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                        {deadlineStats.find((d) => d.name === "This Week")?.value || 0} grants
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-3">
                      {deadlineStats.find((d) => d.name === "This Week")?.value
                        ? `You have ${deadlineStats.find((d) => d.name === "This Week")?.value} grant applications due this week. Prioritize these to meet the deadlines.`
                        : "No urgent grant applications due this week."}
                    </p>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${Math.min(100, ((deadlineStats.find((d) => d.name === "This Week")?.value || 0) / bookmarkedGrants.length) * 100 * 3)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <h4 className="font-medium">Planning Ahead</h4>
                      </div>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                        {(deadlineStats.find((d) => d.name === "This Month")?.value || 0) +
                          (deadlineStats.find((d) => d.name === "Next 3 Months")?.value || 0)}{" "}
                        grants
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-3">
                      Plan your application strategy for upcoming deadlines to maximize your success rate.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

