"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Badge } from "@/components/ui/badge"
import type { Grant, ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GrantKanbanBoardProps {
  grants: Grant[]
  statuses: Record<string, ApplicationStatus>
  onUpdateStatus: (id: string, status: ApplicationStatus) => void
}

export default function GrantKanbanBoard({ grants, statuses, onUpdateStatus }: GrantKanbanBoardProps) {
  // Group grants by status
  const [columns, setColumns] = useState<Record<ApplicationStatus, Grant[]>>(() => {
    const initialColumns: Record<ApplicationStatus, Grant[]> = {
      "Not Started": [],
      "In Progress": [],
      Applied: [],
      Awarded: [],
      Rejected: [],
    }

    grants.forEach((grant) => {
      const status = statuses[grant.id] || "Not Started"
      initialColumns[status].push(grant)
    })

    return initialColumns
  })

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) return

    // Dropped in the same column at the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Get the source and destination columns
    const sourceColumn = columns[source.droppableId as ApplicationStatus]
    const destColumn = columns[destination.droppableId as ApplicationStatus]

    // Get the grant being dragged
    const grant = sourceColumn[source.index]

    // Create new columns
    const newColumns = { ...columns }

    // Remove from source column
    newColumns[source.droppableId as ApplicationStatus] = sourceColumn.filter((_, index) => index !== source.index)

    // Add to destination column
    newColumns[destination.droppableId as ApplicationStatus] = [
      ...destColumn.slice(0, destination.index),
      grant,
      ...destColumn.slice(destination.index),
    ]

    // Update state
    setColumns(newColumns)

    // Update status in parent component
    onUpdateStatus(grant.id, destination.droppableId as ApplicationStatus)
  }

  // Get column background color
  const getColumnColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 dark:bg-gray-800"
      case "In Progress":
        return "bg-blue-50 dark:bg-blue-900/20"
      case "Applied":
        return "bg-amber-50 dark:bg-amber-900/20"
      case "Awarded":
        return "bg-green-50 dark:bg-green-900/20"
      case "Rejected":
        return "bg-red-50 dark:bg-red-900/20"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  // Get badge color
  const getBadgeColor = (status: ApplicationStatus) => {
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(columns).map(([status, grantsInColumn]) => (
          <div key={status} className="flex flex-col h-full">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-sm">{status}</h3>
              <Badge className={cn("px-2 py-1 text-xs", getBadgeColor(status as ApplicationStatus))}>
                {grantsInColumn.length}
              </Badge>
            </div>

            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex-1 p-2 rounded-md min-h-[500px]",
                    getColumnColor(status as ApplicationStatus),
                    snapshot.isDraggingOver ? "ring-2 ring-primary/50" : "",
                  )}
                >
                  {grantsInColumn.map((grant, index) => (
                    <Draggable key={grant.id} draggableId={grant.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "mb-2 bg-background rounded-md shadow-sm border",
                            snapshot.isDragging ? "shadow-lg ring-2 ring-primary" : "",
                          )}
                        >
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline" className="text-xs">
                                {grant.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ${grant.amount.toLocaleString()}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm mb-1">{grant.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{grant.description}</p>
                            <div className="text-xs text-muted-foreground">Deadline: {grant.deadline}</div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {grantsInColumn.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">Drag grants here</div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

