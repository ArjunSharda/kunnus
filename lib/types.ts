export interface Grant {
  id: string
  title: string
  description: string
  amount: number
  deadline: string
  category: string
  eligibility: string[]
  fundingSource: string
  applicationLink: string
}

export type ApplicationStatus = "Not Started" | "In Progress" | "Applied" | "Awarded" | "Rejected"

export interface BookmarkFolder {
  id: string
  name: string
  grantIds?: string[]
}

export type ViewMode = "grid" | "list" | "calendar" | "kanban" | "map"

export type SortOption = "deadline-asc" | "deadline-desc" | "amount-asc" | "amount-desc" | "title-asc" | "title-desc"

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: Record<string, any>
  timestamp: number
}

export interface DashboardWidget {
  id: string
  type: "upcoming-deadlines" | "statistics" | "recent-activity"
  title: string
  enabled: boolean
}

export interface ThemePreference {
  primaryColor: "purple" | "blue" | "green" | "red"
  borderRadius: "none" | "small" | "medium" | "large"
  animation: "none" | "slow" | "medium" | "fast"
}