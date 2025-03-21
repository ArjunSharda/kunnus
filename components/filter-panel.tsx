"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

// Define a proper type instead of using any
interface FilterOptions {
  category?: string;
  schoolType?: string;
  minAmount?: number;
  maxAmount?: number;
  deadlineDays?: number | null;
  hideExpired?: boolean;
  bookmarkedOnly?: boolean;
  urgentOnly?: boolean;
  statusFilter?: string;
}

interface FilterPanelProps {
  onApplyFilters: (filters: FilterOptions) => void
}

export default function FilterPanel({ onApplyFilters }: FilterPanelProps) {
  const [category, setCategory] = useState("all")
  const [schoolType, setSchoolType] = useState("all")
  const [amountRange, setAmountRange] = useState([0, 100000])
  const [deadlineDays, setDeadlineDays] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  const handleReset = () => {
    setCategory("all")
    setSchoolType("all")
    setAmountRange([0, 100000])
    setDeadlineDays(null)
    onApplyFilters({})
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      category,
      schoolType,
      minAmount: amountRange[0],
      maxAmount: amountRange[1],
      deadlineDays,
      hideExpired: Boolean(hideExpired),
      bookmarkedOnly: Boolean(bookmarkedOnly),
      urgentOnly: Boolean(urgentOnly),
      statusFilter,
    } as FilterOptions)
  }

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filter Grants</h3>
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="basic" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="STEM">STEM</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Literacy">Literacy</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Professional Development">Professional Development</SelectItem>
                <SelectItem value="Special Education">Special Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-type">School Type</Label>
            <Select value={schoolType} onValueChange={setSchoolType}>
              <SelectTrigger id="school-type">
                <SelectValue placeholder="Select school type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                <SelectItem value="Elementary">Elementary</SelectItem>
                <SelectItem value="Middle School">Middle School</SelectItem>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="K-12">K-12</SelectItem>
                <SelectItem value="Title I">Title I</SelectItem>
                <SelectItem value="Charter">Charter</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Funding Amount</Label>
            <div className="pt-6 px-2">
              <Slider value={amountRange} min={0} max={100000} step={1000} onValueChange={setAmountRange} />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${amountRange[0].toLocaleString()}</span>
                <span>${amountRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Deadline</Label>
            <RadioGroup
              value={deadlineDays?.toString() || ""}
              onValueChange={(value) => setDeadlineDays(value ? Number.parseInt(value) : null)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="deadline-any" />
                <Label htmlFor="deadline-any">Any time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7" id="deadline-week" />
                <Label htmlFor="deadline-week">Next 7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="deadline-month" />
                <Label htmlFor="deadline-month">Next 30 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="90" id="deadline-quarter" />
                <Label htmlFor="deadline-quarter">Next 90 days</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Custom Filters</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="filter-bookmarked-only" />
                <Label htmlFor="filter-bookmarked-only">Bookmarked only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="filter-hide-expired" />
                <Label htmlFor="filter-hide-expired">Hide expired grants</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="filter-urgent-only" />
                <Label htmlFor="filter-urgent-only">Show urgent only</Label>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}

