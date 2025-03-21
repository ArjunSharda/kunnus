"use client"

import { useMemo } from "react"
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
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Grant, ApplicationStatus } from "@/lib/types"

interface GrantStatisticsProps {
  grants: Grant[]
  bookmarkedGrants: string[]
  statuses: Record<string, ApplicationStatus>
  minimal?: boolean
}

export default function GrantStatistics({ grants, bookmarkedGrants, statuses, minimal = false }: GrantStatisticsProps) {
  // Calculate statistics by category
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

    // Calculate average amounts
    Object.values(stats).forEach((stat) => {
      stat.averageAmount = Math.round(stat.totalAmount / stat.count)
    })

    return Object.values(stats)
  }, [grants, bookmarkedGrants])

  // Calculate statistics by status
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

  // Calculate deadline statistics
  const deadlineStats = useMemo(() => {
    const today = new Date()
    const oneWeek = new Date()
    oneWeek.setDate(today.getDate() + 7)
    const oneMonth = new Date()
    oneMonth.setDate(today.getDate() + 30)

    const stats = {
      "This Week": 0,
      "This Month": 0,
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
      } else {
        stats["Later"] += 1
      }
    })

    return Object.entries(stats).map(([name, value]) => ({ name, value }))
  }, [grants, bookmarkedGrants])

  // Colors for charts
  const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57"]
  const STATUS_COLORS = {
    "Not Started": "#9CA3AF",
    "In Progress": "#60A5FA",
    Applied: "#FBBF24",
    Awarded: "#34D399",
    Rejected: "#EF4444",
  }

  const DEADLINE_COLORS = {
    "This Week": "#EF4444",
    "This Month": "#F59E0B",
    Later: "#10B981",
    Expired: "#6B7280",
  }

  // If minimal, show a simplified version
  if (minimal) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/30 rounded-md p-3">
            <p className="text-sm text-muted-foreground">Total Grants</p>
            <p className="text-2xl font-bold">{grants.length}</p>
          </div>
          <div className="bg-muted/30 rounded-md p-3">
            <p className="text-sm text-muted-foreground">Bookmarked</p>
            <p className="text-2xl font-bold">{bookmarkedGrants.length}</p>
          </div>
        </div>

        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusStats}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => (percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : "")}
                labelLine={false}
              >
                {statusStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{grants.length}</CardTitle>
            <CardDescription>Total Grants</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{bookmarkedGrants.length}</CardTitle>
            <CardDescription>Bookmarked Grants</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              ${grants.reduce((sum, grant) => sum + grant.amount, 0).toLocaleString()}
            </CardTitle>
            <CardDescription>Total Funding Available</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              ${Math.round(grants.reduce((sum, grant) => sum + grant.amount, 0) / grants.length).toLocaleString()}
            </CardTitle>
            <CardDescription>Average Grant Amount</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="status">Application Status</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Grants by Category</CardTitle>
              <CardDescription>Distribution of grants across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Total Grants" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="bookmarked" name="Bookmarked" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Status of your bookmarked grant applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Timeline of your bookmarked grant deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deadlineStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deadlineStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            DEADLINE_COLORS[entry.name as keyof typeof DEADLINE_COLORS] || COLORS[index % COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

