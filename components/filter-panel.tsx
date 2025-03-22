"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import type { CheckedState } from "@radix-ui/react-checkbox"

interface FilterOptions {
  category?: string
  schoolType?: string
  minAmount?: number
  maxAmount?: number
  deadlineDays?: number | null
  hideExpired?: boolean
  bookmarkedOnly?: boolean
  urgentOnly?: boolean
  statusFilter?: string
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
    const [hideExpired, setHideExpired] = useState(false)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (checked: CheckedState) => {
      setter(checked === true)
    }
  }

    const handleApplyFilters = () => {
        const filters: FilterOptions = {};
    
        if (category !== "all") {
      filters.category = category;
    }
    
        if (schoolType !== "all") {
      filters.schoolType = schoolType;
    }
    
        if (amountRange[0] > 0) {
      filters.minAmount = amountRange[0];
    }
    
    if (amountRange[1] < 100000) {
      filters.maxAmount = amountRange[1];
    }
    
        if (deadlineDays !== null) {
      filters.deadlineDays = deadlineDays;
    }
    
        if (hideExpired) {
      filters.hideExpired = true;
    }
    
    if (bookmarkedOnly) {
      filters.bookmarkedOnly = true;
    }
    
    if (urgentOnly) {
      filters.urgentOnly = true;
    }
    
        if (statusFilter !== "all") {
      filters.statusFilter = statusFilter;
    }
    
    console.log("Applying filters from panel:", filters);
    onApplyFilters(filters);
  };

    const handleReset = () => {
    setCategory("all");
    setSchoolType("all");
    setAmountRange([0, 100000]);
    setDeadlineDays(null);
    setHideExpired(false);
    setBookmarkedOnly(false);
    setUrgentOnly(false);
    setStatusFilter("all");
    
        onApplyFilters({});
  };

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filter Grants</h3>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
        <TabsContent value="basic">
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

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <RadioGroup
                value={deadlineDays?.toString() || ""}
                onValueChange={(value) => {
                  console.log("Deadline days changed to:", value)
                  setDeadlineDays(value ? Number.parseInt(value, 10) : null)
                }}
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
                  <Checkbox
                    id="filter-bookmarked-only"
                    checked={bookmarkedOnly}
                    onCheckedChange={handleCheckboxChange(setBookmarkedOnly)}
                  />
                  <Label htmlFor="filter-bookmarked-only">Bookmarked only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-hide-expired"
                    checked={hideExpired}
                    onCheckedChange={handleCheckboxChange(setHideExpired)}
                  />
                  <Label htmlFor="filter-hide-expired">Hide expired grants</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-urgent-only"
                    checked={urgentOnly}
                    onCheckedChange={handleCheckboxChange(setUrgentOnly)}
                  />
                  <Label htmlFor="filter-urgent-only">Show urgent only</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Application Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="notStarted">Not Started</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="awarded">Awarded</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}
