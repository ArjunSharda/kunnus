"use client"

import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Moon,
  Sun,
  Info,
  Download,
  Bell,
  BellOff,
  Keyboard,
  Calendar,
  Map,
  BarChart3,
  Grid,
  List,
  Columns,
  Settings,
  Share2,
  Printer,
  Save,
  Layers,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Palette,
  FolderPlus,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import GrantCard from "./grant-card"
import FilterPanel from "./filter-panel"
import KeyboardShortcutsHelp from "./keyboard-shortcuts-help"
import GrantCalendarView from "./grant-calendar-view"
import GrantMapView from "./grant-map-view"
import GrantStatistics from "./grant-statistics"
import GrantKanbanBoard from "./grant-kanban-board"
import GrantComparisonTool from "./grant-comparison-tool"
import CustomizeDashboard from "./customize-dashboard"
import ThemeCustomizer from "./theme-customizer"
import type {
  Grant,
  BookmarkFolder,
  ApplicationStatus,
  ViewMode,
  SortOption,
  SavedSearch,
  DashboardWidget,
  ThemePreference,
} from "@/lib/types"
import { sampleGrants } from "@/lib/sample-data"
import { generatePDF } from "@/lib/pdf-generator"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Number of grants to show per page
const ITEMS_PER_PAGE = 9

// Define a proper type for filters
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

export default function GrantFinder() {
  const { toast } = useToast()
  const [grants, setGrants] = useState<Grant[]>([])
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([])
  const [bookmarkedGrants, setBookmarkedGrants] = useState<string[]>([])
  const [grantStatuses, setGrantStatuses] = useState<Record<string, ApplicationStatus>>({})
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([{ id: "default", name: "All Bookmarks" }])
  const [activeFolder, setActiveFolder] = useState("default")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [highContrastMode, setHighContrastMode] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState<SortOption>("deadline-asc")
  const [selectedGrants, setSelectedGrants] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [compareGrants, setCompareGrants] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([
    { id: "upcoming", type: "upcoming-deadlines", title: "Upcoming Deadlines", enabled: true },
    { id: "stats", type: "statistics", title: "Grant Statistics", enabled: true },
    { id: "recent", type: "recent-activity", title: "Recent Activity", enabled: true },
  ])
  const [showDashboard, setShowDashboard] = useState(false)
  const [themePreference, setThemePreference] = useState<ThemePreference>({
    primaryColor: "purple",
    borderRadius: "medium",
    animation: "medium",
  })
  const [cardSize, setCardSize] = useState<"compact" | "normal" | "detailed">("normal")
  const [recentActivity, setRecentActivity] = useState<
    {
      action: string
      grantId: string
      timestamp: number
    }[]
  >([])

  // Calculate total pages based on filtered grants
  const totalPages = Math.ceil(filteredGrants.length / ITEMS_PER_PAGE)

  // Get current page of grants
  const currentGrants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredGrants.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredGrants, currentPage])

  // Track recent activity
  const addActivity = (action: string, grantId: string) => {
    const newActivity = {
      action,
      grantId,
      timestamp: Date.now(),
    }
    setRecentActivity((prev) => [newActivity, ...prev].slice(0, 20)) // Keep only last 20 activities
    localStorage.setItem("recentActivity", JSON.stringify([newActivity, ...recentActivity].slice(0, 20)))
  }

  // Define applyThemePreferences function here, before it's used in any arrays
  const applyThemePreferences = useCallback(() => {
    // Apply primary color
    document.documentElement.style.setProperty(
      "--primary-hue",
      themePreference.primaryColor === "purple"
        ? "262"
        : themePreference.primaryColor === "blue"
          ? "220"
          : themePreference.primaryColor === "green"
            ? "142"
            : themePreference.primaryColor === "red"
              ? "0"
              : "262",
    )

    // Apply border radius
    document.documentElement.style.setProperty(
      "--radius-factor",
      themePreference.borderRadius === "small"
        ? "0.375"
        : themePreference.borderRadius === "medium"
          ? "0.75"
          : themePreference.borderRadius === "large"
            ? "1.5"
            : themePreference.borderRadius === "none"
              ? "0"
              : "0.75",
    )

    // Apply animation speed
    document.documentElement.style.setProperty(
      "--animation-factor",
      themePreference.animation === "none"
        ? "0"
        : themePreference.animation === "slow"
          ? "0.5"
          : themePreference.animation === "medium"
            ? "0.3"
            : themePreference.animation === "fast"
              ? "0.15"
              : "0.3",
    )
  }, [themePreference]) // Add themePreference as a dependency

  // Initialize data and load saved state
  useEffect(() => {
    setGrants(sampleGrants)
    setFilteredGrants(sampleGrants)

    // Load saved state from localStorage
    const loadFromLocalStorage = () => {
      const savedBookmarks = localStorage.getItem("bookmarkedGrants")
      if (savedBookmarks) {
        setBookmarkedGrants(JSON.parse(savedBookmarks))
      }

      const savedStatuses = localStorage.getItem("grantStatuses")
      if (savedStatuses) {
        setGrantStatuses(JSON.parse(savedStatuses))
      }

      const savedFolders = localStorage.getItem("bookmarkFolders")
      if (savedFolders) {
        setBookmarkFolders(JSON.parse(savedFolders))
      }

      const savedNotifications = localStorage.getItem("notificationsEnabled")
      if (savedNotifications !== null) {
        setNotificationsEnabled(JSON.parse(savedNotifications))
      }

      const savedHighContrast = localStorage.getItem("highContrastMode")
      if (savedHighContrast !== null) {
        setHighContrastMode(JSON.parse(savedHighContrast))
      }

      const savedViewMode = localStorage.getItem("viewMode")
      if (savedViewMode) {
        setViewMode(JSON.parse(savedViewMode))
      }

      const savedSortOption = localStorage.getItem("sortOption")
      if (savedSortOption) {
        setSortOption(JSON.parse(savedSortOption))
      }

      const savedSearches = localStorage.getItem("savedSearches")
      if (savedSearches) {
        setSavedSearches(JSON.parse(savedSearches))
      }

      const savedDashboardWidgets = localStorage.getItem("dashboardWidgets")
      if (savedDashboardWidgets) {
        setDashboardWidgets(JSON.parse(savedDashboardWidgets))
      }

      const savedThemePreference = localStorage.getItem("themePreference")
      if (savedThemePreference) {
        setThemePreference(JSON.parse(savedThemePreference))
      }

      const savedCardSize = localStorage.getItem("cardSize")
      if (savedCardSize) {
        setCardSize(JSON.parse(savedCardSize))
      }

      const savedRecentActivity = localStorage.getItem("recentActivity")
      if (savedRecentActivity) {
        setRecentActivity(JSON.parse(savedRecentActivity))
      }
    }

    loadFromLocalStorage()

    // Check system preference for dark mode
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      }
    }

    // Apply theme preferences
    applyThemePreferences()

    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only activate shortcuts if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
      } else if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setActiveTab("bookmarked")
      } else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setActiveTab("all")
      } else if (e.key === "/" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setShowKeyboardShortcuts(true)
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        toggleDarkMode()
      } else if (e.key === "ArrowLeft" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (currentPage > 1) setCurrentPage(currentPage - 1)
      } else if (e.key === "ArrowRight" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
      } else if (e.key === "g" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setViewMode("grid")
      } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setViewMode("list")
      } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setViewMode("calendar")
      } else if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setViewMode("kanban")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    currentPage, 
    totalPages, 
    setCurrentPage, 
    setViewMode, 
    applyThemePreferences, 
    toggleDarkMode
  ])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bookmarkedGrants", JSON.stringify(bookmarkedGrants))
  }, [bookmarkedGrants])

  useEffect(() => {
    localStorage.setItem("grantStatuses", JSON.stringify(grantStatuses))
  }, [grantStatuses])

  useEffect(() => {
    localStorage.setItem("bookmarkFolders", JSON.stringify(bookmarkFolders))
  }, [bookmarkFolders])

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled))
  }, [notificationsEnabled])

  useEffect(() => {
    localStorage.setItem("highContrastMode", JSON.stringify(highContrastMode))
    if (highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrastMode])

  useEffect(() => {
    localStorage.setItem("viewMode", JSON.stringify(viewMode))
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem("sortOption", JSON.stringify(sortOption))
  }, [sortOption])

  useEffect(() => {
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches))
  }, [savedSearches])

  useEffect(() => {
    localStorage.setItem("dashboardWidgets", JSON.stringify(dashboardWidgets))
  }, [dashboardWidgets])

  useEffect(() => {
    localStorage.setItem("themePreference", JSON.stringify(themePreference))
    applyThemePreferences()
  }, [themePreference, applyThemePreferences])

  useEffect(() => {
    localStorage.setItem("cardSize", JSON.stringify(cardSize))
  }, [cardSize])

  // Check for upcoming deadlines and show notifications
  useEffect(() => {
    if (!notificationsEnabled) return

    const checkDeadlines = () => {
      const today = new Date()
      const upcomingGrants = grants.filter((grant) => {
        if (!bookmarkedGrants.includes(grant.id)) return false

        const deadlineDate = new Date(grant.deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return diffDays > 0 && diffDays <= 7
      })

      if (upcomingGrants.length > 0) {
        toast({
          title: "Upcoming Deadlines",
          description: `You have ${upcomingGrants.length} grant(s) with deadlines in the next 7 days.`,
          duration: 5000,
        })
      }
    }

    // Check once when component mounts
    checkDeadlines()

    // Set up daily check
    const interval = setInterval(checkDeadlines, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [grants, bookmarkedGrants, notificationsEnabled, toast])

  // Sort grants based on selected sort option
  const sortGrants = (grantsToSort: Grant[]) => {
    return [...grantsToSort].sort((a, b) => {
      switch (sortOption) {
        case "deadline-asc":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case "deadline-desc":
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
        case "amount-asc":
          return a.amount - b.amount
        case "amount-desc":
          return b.amount - a.amount
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
  }

  // Filter grants based on search query, active tab, and folder
  useEffect(() => {
    let results = grants

    // Apply search filter
    if (searchQuery) {
      results = results.filter(
        (grant) =>
          grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.fundingSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab === "bookmarked") {
      if (activeFolder === "default") {
        results = results.filter((grant) => bookmarkedGrants.includes(grant.id))
      } else {
        const folder = bookmarkFolders.find((f) => f.id === activeFolder)
        if (folder && folder.grantIds) {
          results = results.filter((grant) => folder.grantIds?.includes(grant.id))
        }
      }
    }

    // Sort results
    results = sortGrants(results)

    setFilteredGrants(results)

    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchQuery, grants, activeTab, bookmarkedGrants, activeFolder, bookmarkFolders, sortOption, sortGrants])

  // Toggle bookmark for a grant
  const toggleBookmark = (grantId: string) => {
    setBookmarkedGrants((prev) => {
      if (prev.includes(grantId)) {
        // Remove from all folders
        setBookmarkFolders((folders) =>
          folders.map((folder) => ({
            ...folder,
            grantIds: folder.grantIds?.filter((id) => id !== grantId),
          })),
        )

        addActivity("Removed bookmark", grantId)
        return prev.filter((id) => id !== grantId)
      } else {
        toast({
          title: "Grant Bookmarked",
          description: "You can find this grant in your bookmarks tab.",
          duration: 3000,
        })

        addActivity("Added bookmark", grantId)
        return [...prev, grantId]
      }
    })
  }

  // Update grant application status
  const updateGrantStatus = (grantId: string, status: ApplicationStatus) => {
    setGrantStatuses((prev) => ({
      ...prev,
      [grantId]: status,
    }))

    toast({
      title: "Status Updated",
      description: `Grant status set to ${status}`,
      duration: 3000,
    })

    addActivity(`Updated status to ${status}`, grantId)
  }

  // Add grant to folder
  const addGrantToFolder = (grantId: string, folderId: string) => {
    setBookmarkFolders((folders) =>
      folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            grantIds: [...(folder.grantIds || []), grantId],
          }
        }
        return folder
      }),
    )

    const folderName = bookmarkFolders.find((f) => f.id === folderId)?.name || "folder"

    toast({
      title: "Added to Folder",
      description: `Grant added to "${folderName}" successfully`,
      duration: 3000,
    })

    addActivity(`Added to folder "${folderName}"`, grantId)
  }

  // Create new folder
  const createNewFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: BookmarkFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      grantIds: [],
    }

    setBookmarkFolders((prev) => [...prev, newFolder])
    setNewFolderName("")

    toast({
      title: "Folder Created",
      description: `New folder "${newFolderName}" created successfully`,
      duration: 3000,
    })
  }

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }, [isDarkMode]) // Add isDarkMode as a dependency

  // Export bookmarked grants as CSV
  const exportBookmarkedGrants = (format: "csv" | "pdf") => {
    const bookmarked = grants.filter((grant) => bookmarkedGrants.includes(grant.id))

    if (format === "csv") {
      let csv = "Title,Category,Amount,Deadline,Status,Funding Source,Application Link\n"

      bookmarked.forEach((grant) => {
        const status = grantStatuses[grant.id] || "Not Started"
        csv += `"${grant.title}","${grant.category}","$${grant.amount}","${grant.deadline}","${status}","${grant.fundingSource}","${grant.applicationLink}"\n`
      })

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.setAttribute("hidden", "")
      a.setAttribute("href", url)
      a.setAttribute("download", "bookmarked-grants.csv")
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else if (format === "pdf") {
      generatePDF(bookmarked, grantStatuses)
    }

    toast({
      title: "Export Complete",
      description: `Your bookmarked grants have been exported as ${format.toUpperCase()}`,
      duration: 3000,
    })
  }

  // Apply filters from filter panel
  const applyFilters = (filters: FilterOptions) => {
    let filtered = grants

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((grant) => grant.category === filters.category)
    }

    if (filters.schoolType && filters.schoolType !== "all") {
      filtered = filtered.filter((grant) => grant.eligibility.includes(filters.schoolType))
    }

    if (filters.minAmount) {
      filtered = filtered.filter((grant) => grant.amount >= filters.minAmount)
    }

    if (filters.maxAmount) {
      filtered = filtered.filter((grant) => grant.amount <= filters.maxAmount)
    }

    if (filters.deadlineDays) {
      const today = new Date()
      filtered = filtered.filter((grant) => {
        const deadlineDate = new Date(grant.deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= filters.deadlineDays
      })
    }

    if (filters.hideExpired) {
      const today = new Date()
      filtered = filtered.filter((grant) => {
        const deadlineDate = new Date(grant.deadline)
        return deadlineDate >= today
      })
    }

    if (filters.bookmarkedOnly) {
      filtered = filtered.filter((grant) => bookmarkedGrants.includes(grant.id))
    }

    if (filters.statusFilter && filters.statusFilter !== "all") {
      filtered = filtered.filter((grant) => grantStatuses[grant.id] === filters.statusFilter)
    }

    // Sort results
    filtered = sortGrants(filtered)

    setFilteredGrants(filtered)
    setCurrentPage(1) // Reset to first page
  }

  // Save current search and filters
  const saveCurrentSearch = (name: string) => {
    if (!name.trim()) return

    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      query: searchQuery,
      filters: {}, // You would capture current filter state here
      timestamp: Date.now(),
    }

    setSavedSearches((prev) => [...prev, newSearch])

    toast({
      title: "Search Saved",
      description: `"${name}" has been saved to your searches`,
      duration: 3000,
    })
  }

  // Apply a saved search
  const applySavedSearch = (search: SavedSearch) => {
    setSearchQuery(search.query)
    // Apply other filters from search.filters

    toast({
      title: "Search Applied",
      description: `"${search.name}" has been applied`,
      duration: 3000,
    })
  }

  // Toggle selection of a grant
  const toggleSelectGrant = (grantId: string) => {
    setSelectedGrants((prev) => {
      if (prev.includes(grantId)) {
        return prev.filter((id) => id !== grantId)
      } else {
        return [...prev, grantId]
      }
    })
  }

  // Select all grants on current page
  const selectAllOnPage = () => {
    if (selectedGrants.length === currentGrants.length) {
      setSelectedGrants([])
    } else {
      setSelectedGrants(currentGrants.map((grant) => grant.id))
    }
  }

  // Bulk actions for selected grants
  const performBulkAction = (
    action: "bookmark" | "unbookmark" | "export" | "compare" | "addToFolder",
    folderId?: string,
  ) => {
    if (selectedGrants.length === 0) {
      toast({
        title: "No Grants Selected",
        description: "Please select at least one grant to perform this action",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    switch (action) {
      case "bookmark":
        setBookmarkedGrants((prev) => {
          const newBookmarks = [...prev]
          selectedGrants.forEach((id) => {
            if (!newBookmarks.includes(id)) {
              newBookmarks.push(id)
              addActivity("Added bookmark (bulk)", id)
            }
          })
          return newBookmarks
        })
        toast({
          title: "Grants Bookmarked",
          description: `${selectedGrants.length} grants have been bookmarked`,
          duration: 3000,
        })
        break

      case "unbookmark":
        setBookmarkedGrants((prev) => {
          const newBookmarks = prev.filter((id) => !selectedGrants.includes(id))
          selectedGrants.forEach((id) => {
            if (prev.includes(id)) {
              addActivity("Removed bookmark (bulk)", id)
            }
          })
          return newBookmarks
        })
        toast({
          title: "Bookmarks Removed",
          description: `${selectedGrants.length} grants have been removed from bookmarks`,
          duration: 3000,
        })
        break

      case "export":
        const selectedGrantsData = grants.filter((grant) => selectedGrants.includes(grant.id))
        let csv = "Title,Category,Amount,Deadline,Status,Funding Source,Application Link\n"

        selectedGrantsData.forEach((grant) => {
          const status = grantStatuses[grant.id] || "Not Started"
          csv += `"${grant.title}","${grant.category}","$${grant.amount}","${grant.deadline}","${status}","${grant.fundingSource}","${grant.applicationLink}"\n`
        })

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.setAttribute("hidden", "")
        a.setAttribute("href", url)
        a.setAttribute("download", "selected-grants.csv")
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        toast({
          title: "Export Complete",
          description: `${selectedGrants.length} grants have been exported as CSV`,
          duration: 3000,
        })
        break

      case "compare":
        if (selectedGrants.length < 2 || selectedGrants.length > 3) {
          toast({
            title: "Invalid Selection",
            description: "Please select 2 or 3 grants to compare",
            variant: "destructive",
            duration: 3000,
          })
          return
        }

        setCompareGrants(selectedGrants)
        setShowComparison(true)
        break

      case "addToFolder":
        if (!folderId) return

        setBookmarkFolders((folders) =>
          folders.map((folder) => {
            if (folder.id === folderId) {
              const existingIds = folder.grantIds || []
              const newIds = selectedGrants.filter((id) => !existingIds.includes(id))
              return {
                ...folder,
                grantIds: [...existingIds, ...newIds],
              }
            }
            return folder
          }),
        )

        const folderName = bookmarkFolders.find((f) => f.id === folderId)?.name || "folder"

        toast({
          title: "Added to Folder",
          description: `${selectedGrants.length} grants added to "${folderName}" successfully`,
          duration: 3000,
        })

        selectedGrants.forEach((id) => {
          addActivity(`Added to folder "${folderName}" (bulk)`, id)
        })
        break
    }

    // Clear selection after action
    setSelectedGrants([])
  }

  // Update dashboard widgets
  const updateDashboardWidgets = (widgets: DashboardWidget[]) => {
    setDashboardWidgets(widgets)

    toast({
      title: "Dashboard Updated",
      description: "Your dashboard layout has been updated",
      duration: 3000,
    })
  }

  // Update theme preferences
  const updateThemePreference = (preference: Partial<ThemePreference>) => {
    setThemePreference((prev) => ({
      ...prev,
      ...preference,
    }))

    toast({
      title: "Theme Updated",
      description: "Your theme preferences have been applied",
      duration: 3000,
    })
  }

  // Print current view
  const printCurrentView = () => {
    window.print()
  }

  // Share via system share API if available
  const shareGrants = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Grant Finder - Shared Grants",
          text: "Check out these education grants I found!",
          url: window.location.href,
        })
        .then(() => {
          toast({
            title: "Shared Successfully",
            description: "Your grants have been shared",
            duration: 3000,
          })
        })
        .catch(() => {
          toast({
            title: "Share Failed",
            description: "There was an error sharing your grants",
            variant: "destructive",
            duration: 3000,
          })
        })
    } else {
      // Fallback for browsers that don't support the Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Grant Finder link copied to clipboard",
        duration: 3000,
      })
    }
  }

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex items-center justify-center mt-8">
        <Pagination>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <span className="sr-only">First page</span>
            <ChevronLeft className="h-4 w-4 mr-1" />
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center mx-4">
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex"
          >
            <span className="sr-only">Last page</span>
            <ChevronRight className="h-4 w-4 mr-1" />
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Pagination>
      </div>
    )
  }

  // Render the appropriate view based on viewMode
  const renderGrantsView = () => {
    if (filteredGrants.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No grants found</h3>
          <p className="text-muted-foreground max-w-md">
            Try adjusting your search or filters to find more grant opportunities.
          </p>
        </div>
      )
    }

    switch (viewMode) {
      case "grid":
        return (
          <>
            <div
              className={cn(
                "grid gap-6",
                cardSize === "compact"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : cardSize === "detailed"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {currentGrants.map((grant) => (
                <GrantCard
                  key={grant.id}
                  grant={grant}
                  isBookmarked={bookmarkedGrants.includes(grant.id)}
                  onToggleBookmark={toggleBookmark}
                  status={grantStatuses[grant.id]}
                  onUpdateStatus={updateGrantStatus}
                  folders={bookmarkFolders.filter((f) => f.id !== "default")}
                  onAddToFolder={addGrantToFolder}
                  isSelected={selectedGrants.includes(grant.id)}
                  onToggleSelect={toggleSelectGrant}
                  size={cardSize}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        )

      case "list":
        return (
          <>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left w-10">
                      <Checkbox
                        checked={selectedGrants.length > 0 && selectedGrants.length === currentGrants.length}
                        onCheckedChange={selectAllOnPage}
                      />
                    </th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left hidden md:table-cell">Category</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Deadline</th>
                    <th className="p-3 text-left hidden md:table-cell">Status</th>
                    <th className="p-3 text-left w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGrants.map((grant) => (
                    <tr key={grant.id} className="border-t hover:bg-muted/20">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedGrants.includes(grant.id)}
                          onCheckedChange={() => toggleSelectGrant(grant.id)}
                        />
                      </td>
                      <td className="p-3 font-medium">{grant.title}</td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge variant="outline">{grant.category}</Badge>
                      </td>
                      <td className="p-3">${grant.amount.toLocaleString()}</td>
                      <td className="p-3">{grant.deadline}</td>
                      <td className="p-3 hidden md:table-cell">
                        {grantStatuses[grant.id] ? (
                          <Badge
                            className={cn(
                              "px-2 py-1 text-xs",
                              grantStatuses[grant.id] === "Not Started"
                                ? "bg-gray-200 dark:bg-gray-700"
                                : grantStatuses[grant.id] === "In Progress"
                                  ? "bg-blue-200 dark:bg-blue-800"
                                  : grantStatuses[grant.id] === "Applied"
                                    ? "bg-amber-200 dark:bg-amber-800"
                                    : grantStatuses[grant.id] === "Awarded"
                                      ? "bg-green-200 dark:bg-green-800"
                                      : grantStatuses[grant.id] === "Rejected"
                                        ? "bg-red-200 dark:bg-red-800"
                                        : "bg-gray-200 dark:bg-gray-700",
                            )}
                          >
                            {grantStatuses[grant.id]}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not started</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleBookmark(grant.id)}
                            aria-label={bookmarkedGrants.includes(grant.id) ? "Remove bookmark" : "Add bookmark"}
                          >
                            {bookmarkedGrants.includes(grant.id) ? (
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a href={grant.applicationLink} target="_blank" rel="noopener noreferrer">
                                  Apply
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setCompareGrants([grant.id])
                                  setShowComparison(true)
                                }}
                              >
                                Compare
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )

      case "calendar":
        return (
          <GrantCalendarView grants={filteredGrants} bookmarkedGrants={bookmarkedGrants} statuses={grantStatuses} />
        )

      case "kanban":
        return (
          <GrantKanbanBoard
            grants={filteredGrants.filter((grant) => bookmarkedGrants.includes(grant.id))}
            statuses={grantStatuses}
            onUpdateStatus={updateGrantStatus}
          />
        )

      case "map":
        return <GrantMapView grants={filteredGrants} bookmarkedGrants={bookmarkedGrants} />

      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 transition-colors duration-300",
        highContrastMode ? "high-contrast" : "",
      )}
    >
      {/* Back to Landing Page */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Dashboard View */}
      {showDashboard && (
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <Button variant="outline" size="sm" onClick={() => setShowDashboard(false)}>
              Close Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardWidgets
              .filter((w) => w.enabled)
              .map((widget) => {
                switch (widget.type) {
                  case "upcoming-deadlines":
                    return (
                      <Card key={widget.id}>
                        <CardHeader>
                          <CardTitle>{widget.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {grants
                            .filter((grant) => {
                              if (!bookmarkedGrants.includes(grant.id)) return false
                              const today = new Date()
                              const deadlineDate = new Date(grant.deadline)
                              const diffTime = deadlineDate.getTime() - today.getTime()
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                              return diffDays > 0 && diffDays <= 14
                            })
                            .slice(0, 5)
                            .map((grant) => {
                              const today = new Date()
                              const deadlineDate = new Date(grant.deadline)
                              const diffTime = deadlineDate.getTime() - today.getTime()
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                              return (
                                <div
                                  key={grant.id}
                                  className="flex items-center justify-between py-2 border-b last:border-0"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{grant.title}</p>
                                    <p className="text-xs text-muted-foreground">{grant.deadline}</p>
                                  </div>
                                  <Badge variant={diffDays <= 7 ? "destructive" : "outline"}>{diffDays} days</Badge>
                                </div>
                              )
                            })}
                          {grants.filter((grant) => {
                            if (!bookmarkedGrants.includes(grant.id)) return false
                            const today = new Date()
                            const deadlineDate = new Date(grant.deadline)
                            const diffTime = deadlineDate.getTime() - today.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            return diffDays > 0 && diffDays <= 14
                          }).length === 0 && <p className="text-muted-foreground text-sm">No upcoming deadlines</p>}
                        </CardContent>
                      </Card>
                    )

                  case "statistics":
                    return (
                      <Card key={widget.id}>
                        <CardHeader>
                          <CardTitle>{widget.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <GrantStatistics
                            grants={grants}
                            bookmarkedGrants={bookmarkedGrants}
                            statuses={grantStatuses}
                            minimal={true}
                          />
                        </CardContent>
                      </Card>
                    )

                  case "recent-activity":
                    return (
                      <Card key={widget.id}>
                        <CardHeader>
                          <CardTitle>{widget.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {recentActivity.slice(0, 5).map((activity, index) => {
                            const grant = grants.find((g) => g.id === activity.grantId)
                            if (!grant) return null

                            return (
                              <div key={index} className="flex items-start py-2 border-b last:border-0">
                                <div className="flex-1">
                                  <p className="text-sm">
                                    <span className="font-medium">{activity.action}</span>
                                    <span className="text-muted-foreground"> - {grant.title}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(activity.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                          {recentActivity.length === 0 && (
                            <p className="text-muted-foreground text-sm">No recent activity</p>
                          )}
                        </CardContent>
                      </Card>
                    )

                  default:
                    return null
                }
              })}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                <Settings className="h-4 w-4 mr-2" />
                Customize Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Customize Dashboard</DialogTitle>
                <DialogDescription>Choose which widgets to display on your dashboard.</DialogDescription>
              </DialogHeader>
              <CustomizeDashboard widgets={dashboardWidgets} onUpdate={updateDashboardWidgets} />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Main Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Grant Finder
            </h1>
            {!showDashboard && (
              <Button variant="outline" size="sm" onClick={() => setShowDashboard(true)}>
                Dashboard
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
            >
              {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </Button>

            <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Keyboard shortcuts">
                  <Keyboard className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Keyboard Shortcuts</DialogTitle>
                  <DialogDescription>Use these shortcuts to navigate quickly</DialogDescription>
                </DialogHeader>
                <KeyboardShortcutsHelp />
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={shareGrants}>Share Grants</DropdownMenuItem>
                <DropdownMenuItem onClick={printCurrentView}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Download className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportBookmarkedGrants("csv")}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportBookmarkedGrants("pdf")}>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Customize Theme</SheetTitle>
                  <SheetDescription>Personalize the appearance of Grant Finder</SheetDescription>
                </SheetHeader>
                <ThemeCustomizer preferences={themePreference} onUpdate={updateThemePreference} />
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                  <DropdownMenuRadioItem value="grid">
                    <Grid className="h-4 w-4 mr-2" />
                    Grid View
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="list">
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="calendar">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="kanban">
                    <Columns className="h-4 w-4 mr-2" />
                    Kanban Board
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="map">
                    <Map className="h-4 w-4 mr-2" />
                    Map View
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Card Size</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={cardSize} onValueChange={(value) => setCardSize(value as "compact" | "normal" | "detailed")}>
                  <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="normal">Normal</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="detailed">Detailed</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setHighContrastMode(!highContrastMode)}>
                  {highContrastMode ? "Disable" : "Enable"} High Contrast
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistics
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="flex items-center px-2 py-1.5 text-sm">View Full Statistics</div>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Grant Statistics</DialogTitle>
                            </DialogHeader>
                            <GrantStatistics
                              grants={grants}
                              bookmarkedGrants={bookmarkedGrants}
                              statuses={grantStatuses}
                            />
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search for grants by keyword, subject, or funding source..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Save Current Search</DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Search</DialogTitle>
                      <DialogDescription>Give your search a name to save it for later.</DialogDescription>
                    </DialogHeader>
                    <Input
                      placeholder="Search name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          saveCurrentSearch(newFolderName)
                          setNewFolderName("")
                        }}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {savedSearches.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Saved Searches</DropdownMenuLabel>
                    {savedSearches.map((search) => (
                      <DropdownMenuItem key={search.id} onClick={() => applySavedSearch(search)}>
                        {search.name}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {showFilters && (
          <div id="filter-panel" className="mb-6">
            <FilterPanel onApplyFilters={applyFilters} />
          </div>
        )}

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Grants</TabsTrigger>
            <TabsTrigger value="bookmarked">
              Bookmarked
              {bookmarkedGrants.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {bookmarkedGrants.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {activeTab === "bookmarked" && bookmarkedGrants.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Label htmlFor="folder-select" className="mr-2">
                Folder:
              </Label>
              <Select value={activeFolder} onValueChange={setActiveFolder}>
                <SelectTrigger id="folder-select" className="w-[180px]">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">All Bookmarks</SelectItem>
                  {bookmarkFolders
                    .filter((f) => f.id !== "default")
                    .map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>Create a new folder to organize your bookmarked grants.</DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                  <DialogFooter>
                    <Button onClick={createNewFolder}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </Tabs>
      </header>

      {/* Bulk Actions Bar */}
      {selectedGrants.length > 0 && (
        <div className="bg-muted/50 border rounded-lg p-2 mb-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{selectedGrants.length} grants selected</span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedGrants([])}>
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => performBulkAction("bookmark")}>
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmark All
            </Button>
            <Button variant="outline" size="sm" onClick={() => performBulkAction("unbookmark")}>
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Remove Bookmarks
            </Button>
            <Button variant="outline" size="sm" onClick={() => performBulkAction("export")}>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add to Folder
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {bookmarkFolders
                  .filter((f) => f.id !== "default")
                  .map((folder) => (
                    <DropdownMenuItem key={folder.id} onClick={() => performBulkAction("addToFolder", folder.id)}>
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                {bookmarkFolders.filter((f) => f.id !== "default").length === 0 && (
                  <DropdownMenuItem disabled>No folders available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => performBulkAction("compare")}
              disabled={selectedGrants.length < 2 || selectedGrants.length > 3}
            >
              <Layers className="h-4 w-4 mr-2" />
              Compare
            </Button>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="sort-select" className="text-sm">
            Sort by:
          </Label>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger id="sort-select" className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline-asc">Deadline (Soonest)</SelectItem>
              <SelectItem value="deadline-desc">Deadline (Latest)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("calendar")}
            aria-label="Calendar view"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("kanban")}
            aria-label="Kanban view"
          >
            <Columns className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("map")}
            aria-label="Map view"
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main>{renderGrantsView()}</main>

      {/* Grant Comparison Dialog */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Grant Comparison</DialogTitle>
            <DialogDescription>Compare details between grants side by side</DialogDescription>
          </DialogHeader>
          <GrantComparisonTool
            grants={grants.filter((grant) => compareGrants.includes(grant.id))}
            statuses={grantStatuses}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

