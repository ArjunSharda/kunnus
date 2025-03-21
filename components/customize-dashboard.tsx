"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { DashboardWidget } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CustomizeDashboardProps {
  widgets: DashboardWidget[]
  onUpdate: (widgets: DashboardWidget[]) => void
}

export default function CustomizeDashboard({ widgets, onUpdate }: CustomizeDashboardProps) {
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>(widgets)

  // Toggle widget enabled state
  const toggleWidget = (id: string) => {
    setLocalWidgets((prev) =>
      prev.map((widget) => (widget.id === id ? { ...widget, enabled: !widget.enabled } : widget)),
    )
  }

  // Move widget up in the list
  const moveWidgetUp = (index: number) => {
    if (index === 0) return

    const newWidgets = [...localWidgets]
    const temp = newWidgets[index]
    newWidgets[index] = newWidgets[index - 1]
    newWidgets[index - 1] = temp

    setLocalWidgets(newWidgets)
  }

  // Move widget down in the list
  const moveWidgetDown = (index: number) => {
    if (index === localWidgets.length - 1) return

    const newWidgets = [...localWidgets]
    const temp = newWidgets[index]
    newWidgets[index] = newWidgets[index + 1]
    newWidgets[index + 1] = temp

    setLocalWidgets(newWidgets)
  }

  // Save changes
  const saveChanges = () => {
    onUpdate(localWidgets)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {localWidgets.map((widget, index) => (
          <div
            key={widget.id}
            className={cn(
              "flex items-center justify-between p-3 border rounded-md",
              widget.enabled ? "bg-background" : "bg-muted/30",
            )}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <div>
                <Label htmlFor={`widget-${widget.id}`} className="font-medium">
                  {widget.title}
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => moveWidgetUp(index)} disabled={index === 0}>
                  Up
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveWidgetDown(index)}
                  disabled={index === localWidgets.length - 1}
                >
                  Down
                </Button>
              </div>
              <Switch
                id={`widget-${widget.id}`}
                checked={widget.enabled}
                onCheckedChange={() => toggleWidget(widget.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>
    </div>
  )
}

