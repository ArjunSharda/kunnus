"use client"

import { useState } from "react"
import { MapPin, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Grant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GrantMapViewProps {
  grants: Grant[]
  bookmarkedGrants: string[]
}

// Mock locations for grants
const mockLocations: Record<string, { lat: number; lng: number; region: string }> = {
  STEM: { lat: 40.7128, lng: -74.006, region: "Northeast" },
  Arts: { lat: 34.0522, lng: -118.2437, region: "West" },
  Literacy: { lat: 41.8781, lng: -87.6298, region: "Midwest" },
  Technology: { lat: 37.7749, lng: -122.4194, region: "West" },
  "Professional Development": { lat: 39.9526, lng: -75.1652, region: "Northeast" },
  "Special Education": { lat: 29.7604, lng: -95.3698, region: "South" },
}

const regions = ["All Regions", "Northeast", "South", "Midwest", "West"]

export default function GrantMapView({ grants, bookmarkedGrants }: GrantMapViewProps) {
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter grants by region and search query
  const filteredGrants = grants.filter((grant) => {
    const grantRegion = mockLocations[grant.category]?.region || ""
    const matchesRegion = selectedRegion === "All Regions" || grantRegion === selectedRegion
    const matchesSearch =
      grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRegion && (searchQuery === "" || matchesSearch)
  })

  // Group grants by region
  const grantsByRegion = filteredGrants.reduce(
    (acc, grant) => {
      const region = mockLocations[grant.category]?.region || "Unknown"
      if (!acc[region]) {
        acc[region] = []
      }
      acc[region].push(grant)
      return acc
    },
    {} as Record<string, Grant[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search grants on map..."
            className="pl-10 w-full md:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map visualization (simplified) */}
        <div className="md:col-span-2 bg-muted/30 rounded-lg border h-[500px] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {/* This would be replaced with an actual map component */}
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Interactive Map</p>
              <p className="text-sm">Showing {filteredGrants.length} grants across the United States</p>
            </div>
          </div>

          {/* Mock map pins */}
          {Object.entries(mockLocations).map(([category, location]) => {
            const grantsInCategory = filteredGrants.filter((g) => g.category === category)
            if (grantsInCategory.length === 0) return null

            // Calculate position (this is just for visualization)
            const top = `${30 + (location.lat - 29) * 10}%`
            const left = `${20 + (location.lng + 125) * 0.2}%`

            return (
              <div
                key={category}
                className={cn(
                  "absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
                  "cursor-pointer transition-all hover:scale-110",
                )}
                style={{ top, left }}
                onClick={() => setSelectedGrant(grantsInCategory[0])}
              >
                <div
                  className={cn(
                    "rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-xs font-bold",
                    "shadow-md border-2 border-background",
                  )}
                >
                  {grantsInCategory.length}
                </div>
                <div className="absolute bottom-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary transform translate-y-1/2"></div>
                <div className="absolute -bottom-8 whitespace-nowrap text-xs font-medium bg-background/80 px-2 py-0.5 rounded">
                  {category}
                </div>
              </div>
            )
          })}
        </div>

        {/* Grants list by region */}
        <div className="space-y-4 h-[500px] overflow-y-auto pr-2">
          {selectedGrant ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge variant="outline">{selectedGrant.category}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedGrant(null)}>
                    Back to List
                  </Button>
                </div>
                <CardTitle className="mt-2">{selectedGrant.title}</CardTitle>
                <CardDescription>{selectedGrant.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amount:</span>
                    <span>${selectedGrant.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Deadline:</span>
                    <span>{selectedGrant.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Region:</span>
                    <span>{mockLocations[selectedGrant.category]?.region || "National"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Funding Source:</span>
                    <span>{selectedGrant.fundingSource}</span>
                  </div>

                  <Button className="w-full mt-4" asChild>
                    <a href={selectedGrant.applicationLink} target="_blank" rel="noopener noreferrer">
                      Apply Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(grantsByRegion).map(([region, regionGrants]) => (
              <div key={region}>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  {region}{" "}
                  <span className="text-sm font-normal text-muted-foreground">({regionGrants.length} grants)</span>
                </h3>
                <div className="space-y-2">
                  {regionGrants.map((grant) => (
                    <div
                      key={grant.id}
                      className={cn(
                        "p-3 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors",
                        bookmarkedGrants.includes(grant.id) ? "border-l-4 border-l-primary" : "",
                      )}
                      onClick={() => setSelectedGrant(grant)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{grant.title}</h4>
                        <Badge variant="outline">${grant.amount.toLocaleString()}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{grant.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {Object.keys(grantsByRegion).length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No grants found in this region.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

