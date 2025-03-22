"use client"

import { useState, useEffect } from "react"
import { Check, X, Palette, Sparkles, Radius, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/hooks/use-toast"
import type { ThemePreference } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ThemeCustomizerProps {
  preferences: ThemePreference
  onUpdate: (preferences: Partial<ThemePreference>) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

// Add type guards to ensure values are valid
const isPrimaryColor = (color: string): color is "purple" | "blue" | "green" | "red" => {
  return ["purple", "blue", "green", "red"].includes(color)
}

const isBorderRadius = (radius: string): radius is "none" | "small" | "medium" | "large" => {
  return ["none", "small", "medium", "large"].includes(radius)
}

const isAnimationSpeed = (speed: string): boolean => {
  return ["none", "slow", "medium", "fast"].includes(speed)
}

export default function ThemeCustomizer({
  preferences,
  onUpdate,
  variant = "default",
  size = "default",
  className,
}: ThemeCustomizerProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [localPreferences, setLocalPreferences] = useState<ThemePreference>({ ...preferences })
  const [activeTab, setActiveTab] = useState("colors")

  // Update local preferences when props change
  useEffect(() => {
    setLocalPreferences({ ...preferences })
  }, [preferences])

  // Color options
  const colorOptions = [
    { value: "purple", label: "Purple", color: "bg-[hsl(262,83%,58%)]" },
    { value: "blue", label: "Blue", color: "bg-[hsl(220,83%,58%)]" },
    { value: "green", label: "Green", color: "bg-[hsl(142,83%,58%)]" },
    { value: "red", label: "Red", color: "bg-[hsl(0,83%,58%)]" },
  ]

  // Animation speed examples
  const getAnimationDuration = (speed: string) => {
    switch (speed) {
      case "slow":
        return "duration-1000"
      case "medium":
        return "duration-500"
      case "fast":
        return "duration-300"
      default:
        return "duration-0"
    }
  }

  const handleApply = () => {
    onUpdate(localPreferences)
    setOpen(false)

    // Show toast notification after user action
    toast({
      title: "Theme updated",
      description: "Your theme preferences have been applied.",
      action: (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      ),
    })
  }

  const handleReset = () => {
    setLocalPreferences({ ...preferences })
  }

  const handleColorChange = (color: string) => {
    if (isPrimaryColor(color)) {
      setLocalPreferences((prev) => ({ ...prev, primaryColor: color }))
    }
  }

  const handleBorderRadiusChange = (radius: string) => {
    if (isBorderRadius(radius)) {
      setLocalPreferences((prev) => ({ ...prev, borderRadius: radius }))
    }
  }

  const handleAnimationChange = (speed: string) => {
    if (isAnimationSpeed(speed)) {
      setLocalPreferences((prev) => ({ ...prev, animation: speed }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={cn("relative", className)}>
          {size === "icon" ? (
            <>
              <Palette className="h-4 w-4" />
              <span className="sr-only">Customize theme</span>
            </>
          ) : (
            <>
              <Palette className="h-4 w-4 mr-2" />
              Customize Theme
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Customize Theme
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="radius" className="flex items-center gap-1">
              <Radius className="h-4 w-4" />
              <span className="hidden sm:inline">Radius</span>
            </TabsTrigger>
            <TabsTrigger value="animation" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Animation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className={cn(
                      "h-16 p-0 border-2 relative overflow-hidden transition-all",
                      localPreferences.primaryColor === option.value
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent",
                    )}
                    onClick={() => handleColorChange(option.value)}
                  >
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className={cn("w-8 h-8 rounded-full mb-1", option.color)}>
                        {localPreferences.primaryColor === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center h-full"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <span className="text-xs font-medium">{option.label}</span>
                    </div>
                    {localPreferences.primaryColor === option.value && (
                      <motion.div
                        layoutId="selectedColor"
                        className="absolute inset-0 border-2 border-primary rounded-md"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </Button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Preview</div>
                <div className="mt-2 flex gap-2">
                  <div
                    className={cn(
                      "w-full h-8 rounded-md transition-colors",
                      `bg-[hsl(${
                        localPreferences.primaryColor === "purple"
                          ? "262"
                          : localPreferences.primaryColor === "blue"
                            ? "220"
                            : localPreferences.primaryColor === "green"
                              ? "142"
                              : "0"
                      },83%,58%)]`,
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="radius" className="space-y-4">
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <RadioGroup
                value={localPreferences.borderRadius}
                onValueChange={handleBorderRadiusChange}
                className="grid grid-cols-4 gap-2"
              >
                <div>
                  <RadioGroupItem value="none" id="radius-none" className="sr-only" />
                  <Label
                    htmlFor="radius-none"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.borderRadius === "none" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 border-2 border-foreground/50 mb-1" />
                    <span className="text-xs font-medium">None</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="small" id="radius-small" className="sr-only" />
                  <Label
                    htmlFor="radius-small"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.borderRadius === "small" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 border-2 border-foreground/50 rounded-sm mb-1" />
                    <span className="text-xs font-medium">Small</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="medium" id="radius-medium" className="sr-only" />
                  <Label
                    htmlFor="radius-medium"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.borderRadius === "medium" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 border-2 border-foreground/50 rounded-md mb-1" />
                    <span className="text-xs font-medium">Medium</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="large" id="radius-large" className="sr-only" />
                  <Label
                    htmlFor="radius-large"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.borderRadius === "large" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 border-2 border-foreground/50 rounded-lg mb-1" />
                    <span className="text-xs font-medium">Large</span>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Preview</div>
                <div className="mt-2 flex gap-2">
                  <div
                    className={cn(
                      "w-full h-16 bg-primary transition-all",
                      localPreferences.borderRadius === "none"
                        ? "rounded-none"
                        : localPreferences.borderRadius === "small"
                          ? "rounded-sm"
                          : localPreferences.borderRadius === "medium"
                            ? "rounded-md"
                            : "rounded-lg",
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="animation" className="space-y-4">
            <div className="space-y-2">
              <Label>Animation Speed</Label>
              <RadioGroup
                value={localPreferences.animation}
                onValueChange={handleAnimationChange}
                className="grid grid-cols-4 gap-2"
              >
                <div>
                  <RadioGroupItem value="none" id="animation-none" className="sr-only" />
                  <Label
                    htmlFor="animation-none"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.animation === "none" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <X className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium">None</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="slow" id="animation-slow" className="sr-only" />
                  <Label
                    htmlFor="animation-slow"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.animation === "slow" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-muted-foreground animate-pulse duration-1000" />
                    </div>
                    <span className="text-xs font-medium">Slow</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="medium" id="animation-medium" className="sr-only" />
                  <Label
                    htmlFor="animation-medium"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.animation === "medium" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-muted-foreground animate-pulse duration-500" />
                    </div>
                    <span className="text-xs font-medium">Medium</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="fast" id="animation-fast" className="sr-only" />
                  <Label
                    htmlFor="animation-fast"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground transition-all",
                      localPreferences.animation === "fast" && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-muted-foreground animate-pulse duration-300" />
                    </div>
                    <span className="text-xs font-medium">Fast</span>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Preview</div>
                <div className="mt-2 flex justify-center p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={localPreferences.animation}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration:
                          localPreferences.animation === "slow"
                            ? 1
                            : localPreferences.animation === "medium"
                              ? 0.5
                              : localPreferences.animation === "fast"
                                ? 0.3
                                : 0,
                      }}
                      className={cn(
                        "w-16 h-16 bg-primary rounded-md flex items-center justify-center",
                        getAnimationDuration(localPreferences.animation),
                      )}
                    >
                      <Sparkles className="h-8 w-8 text-primary-foreground" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button className="gap-1.5" onClick={handleApply}>
            <Save className="h-4 w-4" />
            Apply Theme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

