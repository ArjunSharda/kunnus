"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ThemePreference } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ThemeCustomizerProps {
  preferences: ThemePreference
  onUpdate: (preferences: Partial<ThemePreference>) => void
}

// Add type guards to ensure values are valid
const isPrimaryColor = (color: string): color is "purple" | "blue" | "green" | "red" => {
  return ["purple", "blue", "green", "red"].includes(color);
};

const isBorderRadius = (radius: string): radius is "none" | "small" | "medium" | "large" => {
  return ["none", "small", "medium", "large"].includes(radius);
};

const isAnimationSpeed = (speed: string): speed is "none" | "slow" | "medium" | "fast" => {
  return ["none", "slow", "medium", "fast"].includes(speed);
};

export default function ThemeCustomizer({ preferences, onUpdate }: ThemeCustomizerProps) {
  // Color options
  const colorOptions = [
    { value: "purple", label: "Purple", color: "bg-[hsl(262,83%,58%)]" },
    { value: "blue", label: "Blue", color: "bg-[hsl(220,83%,58%)]" },
    { value: "green", label: "Green", color: "bg-[hsl(142,83%,58%)]" },
    { value: "red", label: "Red", color: "bg-[hsl(0,83%,58%)]" },
  ]

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label>Primary Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className={cn(
                "h-10 p-0 border-2",
                preferences.primaryColor === option.value ? "border-primary" : "border-transparent",
              )}
              onClick={() => {
                if (isPrimaryColor(option.value)) {
                  onUpdate({ primaryColor: option.value });
                }
              }}
            >
              <div className="flex flex-col items-center justify-center w-full">
                <div className={cn("w-6 h-6 rounded-full mb-1", option.color)}>
                  {preferences.primaryColor === option.value && <Check className="w-4 h-4 text-white m-auto mt-1" />}
                </div>
                <span className="text-xs">{option.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Border Radius</Label>
        <RadioGroup
          value={preferences.borderRadius}
          onValueChange={(value) => {
            if (isBorderRadius(value)) {
              onUpdate({ borderRadius: value });
            }
          }}
          className="grid grid-cols-4 gap-2"
        >
          <div>
            <RadioGroupItem value="none" id="radius-none" className="sr-only" />
            <Label
              htmlFor="radius-none"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.borderRadius === "none" && "border-primary",
              )}
            >
              <div className="w-8 h-8 border-2 border-foreground/50 mb-1" />
              <span className="text-xs">None</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="small" id="radius-small" className="sr-only" />
            <Label
              htmlFor="radius-small"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.borderRadius === "small" && "border-primary",
              )}
            >
              <div className="w-8 h-8 border-2 border-foreground/50 rounded-sm mb-1" />
              <span className="text-xs">Small</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="medium" id="radius-medium" className="sr-only" />
            <Label
              htmlFor="radius-medium"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.borderRadius === "medium" && "border-primary",
              )}
            >
              <div className="w-8 h-8 border-2 border-foreground/50 rounded-md mb-1" />
              <span className="text-xs">Medium</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="large" id="radius-large" className="sr-only" />
            <Label
              htmlFor="radius-large"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.borderRadius === "large" && "border-primary",
              )}
            >
              <div className="w-8 h-8 border-2 border-foreground/50 rounded-lg mb-1" />
              <span className="text-xs">Large</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Animation Speed</Label>
        <RadioGroup
          value={preferences.animation}
          onValueChange={(value) => {
            if (isAnimationSpeed(value)) {
              onUpdate({ animation: value });
            }
          }}
          className="grid grid-cols-4 gap-2"
        >
          <div>
            <RadioGroupItem value="none" id="animation-none" className="sr-only" />
            <Label
              htmlFor="animation-none"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.animation === "none" && "border-primary",
              )}
            >
              <span className="text-xs">None</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="slow" id="animation-slow" className="sr-only" />
            <Label
              htmlFor="animation-slow"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.animation === "slow" && "border-primary",
              )}
            >
              <span className="text-xs">Slow</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="medium" id="animation-medium" className="sr-only" />
            <Label
              htmlFor="animation-medium"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.animation === "medium" && "border-primary",
              )}
            >
              <span className="text-xs">Medium</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="fast" id="animation-fast" className="sr-only" />
            <Label
              htmlFor="animation-fast"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground",
                preferences.animation === "fast" && "border-primary",
              )}
            >
              <span className="text-xs">Fast</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-4">
        <Button className="w-full" onClick={() => onUpdate(preferences)}>
          Apply Theme
        </Button>
      </div>
    </div>
  )
}

