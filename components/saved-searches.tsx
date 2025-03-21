"use client"

import { useState } from "react"
import { Search, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SavedSearch } from "@/lib/types"

interface SavedSearchesProps {
  searches: SavedSearch[]
  onApply: (search: SavedSearch) => void
  onDelete: (id: string) => void
}

export default function SavedSearches({ searches, onApply, onDelete }: SavedSearchesProps) {
  const [filter, setFilter] = useState("")

  // Filter searches by name
  const filteredSearches = searches.filter((search) => search.name.toLowerCase().includes(filter.toLowerCase()))

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Filter saved searches..."
          className="pl-10"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filteredSearches.length > 0 ? (
        <div className="space-y-2">
          {filteredSearches.map((search) => (
            <div key={search.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{search.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {search.query ? `"${search.query}"` : "No query"}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Saved on {formatDate(search.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onDelete(search.id)} aria-label="Delete search">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onApply(search)}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No saved searches found.</p>
        </div>
      )}
    </div>
  )
}

