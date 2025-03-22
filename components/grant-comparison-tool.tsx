"use client"

import { AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Grant, ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GrantComparisonToolProps {
  grants: Grant[]
  statuses: Record<string, ApplicationStatus>
}

export default function GrantComparisonTool({ grants, statuses }: GrantComparisonToolProps) {
    const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-200 dark:bg-gray-700"
      case "In Progress":
        return "bg-blue-200 dark:bg-blue-800"
      case "Applied":
        return "bg-amber-200 dark:bg-amber-800"
      case "Awarded":
        return "bg-green-200 dark:bg-green-800"
      case "Rejected":
        return "bg-red-200 dark:bg-red-800"
      default:
        return "bg-gray-200 dark:bg-gray-700"
    }
  }

    const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

    const isDeadlineUrgent = (deadline: string) => {
    const daysUntil = getDaysUntilDeadline(deadline)
    return daysUntil > 0 && daysUntil <= 7
  }

    const isDeadlinePast = (deadline: string) => {
    return getDaysUntilDeadline(deadline) < 0
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Feature</TableHead>
            {grants.map((grant) => (
              <TableHead key={grant.id}>{grant.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Category</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id}>
                <Badge variant="outline">{grant.category}</Badge>
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Amount</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id} className="font-semibold">
                ${grant.amount.toLocaleString()}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Deadline</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id}>
                <div className="flex items-center gap-2">
                  <span>{grant.deadline}</span>
                  {isDeadlineUrgent(grant.deadline) && (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    >
                      Urgent
                    </Badge>
                  )}
                  {isDeadlinePast(grant.deadline) && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Expired
                    </Badge>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Status</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id}>
                {statuses[grant.id] ? (
                  <Badge className={cn("px-2 py-1 text-xs", getStatusColor(statuses[grant.id]))}>
                    {statuses[grant.id]}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Not started</span>
                )}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Funding Source</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id}>{grant.fundingSource}</TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Eligibility</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id}>
                <ul className="list-disc list-inside text-sm">
                  {grant.eligibility.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Description</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id} className="text-sm">
                {grant.description}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Apply</TableCell>
            {grants.map((grant) => (
              <TableCell key={grant.id}>
                <Button size="sm" asChild>
                  <a href={grant.applicationLink} target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>

      <div className="bg-muted/30 p-4 rounded-md">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Comparison Notes</h4>
            <p className="text-sm text-muted-foreground">
              This comparison helps you evaluate which grants best match your needs. Consider factors like deadline
              proximity, funding amount, and eligibility requirements when making your decision.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

