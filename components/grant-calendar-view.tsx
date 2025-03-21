"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Grant, ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GrantCalendarViewProps {
  grants: Grant[]
  bookmarkedGrants: string[]
  statuses: Record<string, ApplicationStatus>
}

export default function GrantCalendarView({ grants, bookmarkedGrants, statuses }: GrantCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate the number of days to show from the previous month
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate the total number of days to show (previous month + current month + next month)
    const totalDays = 42 // 6 rows of 7 days

    // Generate the array of dates
    const days: Date[] = []

    // Add days from the previous month
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()

    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push(new Date(year, month - 1, i))
    }

    // Add days from the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from the next month
    const remainingDays = totalDays - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    setCalendarDays(days)
  }, [currentDate])

  // Navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Navigate to the current month
  const goToCurrentMonth = () => {
    setCurrentDate(new Date())
  }

  // Get grants for a specific date
  const getGrantsForDate = (date: Date) => {
    return grants.filter((grant) => {
      const deadlineDate = new Date(grant.deadline)
      return (
        deadlineDate.getDate() === date.getDate() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Check if a date has grants
  const hasGrantsForDate = (date: Date) => {
    return getGrantsForDate(date).length > 0
  }

  // Check if a date has bookmarked grants
  const hasBookmarkedGrantsForDate = (date: Date) => {
    return getGrantsForDate(date).some((grant) => bookmarkedGrants.includes(grant.id))
  }

  // Format date as YYYY-MM-DD
  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  // Get the day of the week names
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get the month and year for the header
  const monthYearString = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{monthYearString}</h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
          Today
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Days of the week header */}
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center py-2 font-medium text-sm">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth()
          const isToday = date.toDateString() === new Date().toDateString()
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
          const hasGrants = hasGrantsForDate(date)
          const hasBookmarked = hasBookmarkedGrantsForDate(date)

          return (
            <div
              key={index}
              className={cn(
                "min-h-[100px] border rounded-md p-1 transition-colors",
                isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground",
                isToday ? "border-primary" : "border-border",
                isSelected ? "ring-2 ring-primary" : "",
                "hover:bg-muted/50 cursor-pointer",
              )}
              onClick={() => setSelectedDate(date)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isToday
                      ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                      : "",
                  )}
                >
                  {date.getDate()}
                </span>
                {hasBookmarked && <Bookmark className="h-4 w-4 text-primary" />}
              </div>

              {hasGrants && (
                <div className="mt-1 space-y-1">
                  {getGrantsForDate(date)
                    .slice(0, 2)
                    .map((grant) => (
                      <div
                        key={grant.id}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          bookmarkedGrants.includes(grant.id) ? "bg-primary/10 border-l-2 border-primary" : "bg-muted",
                        )}
                        title={grant.title}
                      >
                        {grant.title.length > 18 ? grant.title.substring(0, 16) + "..." : grant.title}
                      </div>
                    ))}

                  {getGrantsForDate(date).length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{getGrantsForDate(date).length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <Card className="mt-4 animate-fadeIn">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Grants for{" "}
              {selectedDate.toLocaleDateString("default", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>

            {getGrantsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getGrantsForDate(selectedDate).map((grant) => (
                  <div key={grant.id} className="flex items-start justify-between border-b pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{grant.title}</h4>
                        {bookmarkedGrants.includes(grant.id) && (
                          <Badge variant="outline" className="bg-primary/10">
                            Bookmarked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{grant.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">${grant.amount.toLocaleString()}</span>
                        <Badge variant="outline">{grant.category}</Badge>
                      </div>
                    </div>
                    <div>
                      {statuses[grant.id] && (
                        <Badge
                          className={cn(
                            "px-2 py-1 text-xs",
                            statuses[grant.id] === "Not Started"
                              ? "bg-gray-200 dark:bg-gray-700"
                              : statuses[grant.id] === "In Progress"
                                ? "bg-blue-200 dark:bg-blue-800"
                                : statuses[grant.id] === "Applied"
                                  ? "bg-amber-200 dark:bg-amber-800"
                                  : statuses[grant.id] === "Awarded"
                                    ? "bg-green-200 dark:bg-green-800"
                                    : statuses[grant.id] === "Rejected"
                                      ? "bg-red-200 dark:bg-red-800"
                                      : "bg-gray-200 dark:bg-gray-700",
                          )}
                        >
                          {statuses[grant.id]}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No grants due on this date.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

