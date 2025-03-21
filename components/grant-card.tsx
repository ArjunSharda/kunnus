"use client"

import { useState } from "react"
import {
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  School,
  Edit,
  FolderPlus,
  CheckCircle,
  Share2,
  FileText,
  MapPin,
  Building,
  Users,
  Award,
  AlertCircle,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Grant, BookmarkFolder, ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GrantCardProps {
  grant: Grant
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
  status?: ApplicationStatus
  onUpdateStatus: (id: string, status: ApplicationStatus) => void
  folders: BookmarkFolder[]
  onAddToFolder: (grantId: string, folderId: string) => void
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  size?: "compact" | "normal" | "detailed"
}

export default function GrantCard({
  grant,
  isBookmarked,
  onToggleBookmark,
  status = "Not Started",
  onUpdateStatus,
  folders,
  onAddToFolder,
  isSelected = false,
  onToggleSelect,
  size = "normal",
}: GrantCardProps) {
  const [expanded, setExpanded] = useState(size === "detailed")
  const [notes, setNotes] = useState(() => {
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem(`grant-notes-${grant.id}`)
      return savedNotes || ""
    }
    return ""
  })
  const [showNotes, setShowNotes] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const savedChecklist = localStorage.getItem(`grant-checklist-${grant.id}`)
      return savedChecklist
        ? JSON.parse(savedChecklist)
        : {
            "Research organization": false,
            "Prepare application": false,
            "Gather supporting documents": false,
            "Review requirements": false,
            "Submit application": false,
          }
    }
    return {
      "Research organization": false,
      "Prepare application": false,
      "Gather supporting documents": false,
      "Review requirements": false,
      "Submit application": false,
    }
  })
  const [showChecklist, setShowChecklist] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>(() => {
    if (typeof window !== "undefined") {
      const savedAttachments = localStorage.getItem(`grant-attachments-${grant.id}`)
      return savedAttachments ? JSON.parse(savedAttachments) : []
    }
    return []
  })

  const saveNotes = (value: string) => {
    setNotes(value)
    localStorage.setItem(`grant-notes-${grant.id}`, value)
  }

  const toggleChecklistItem = (item: string) => {
    const newChecklist = { ...checklist, [item]: !checklist[item] }
    setChecklist(newChecklist)
    localStorage.setItem(`grant-checklist-${grant.id}`, JSON.stringify(newChecklist))
  }

  const getStatusColor = () => {
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

  const getProgressPercentage = () => {
    const total = Object.keys(checklist).length
    if (total === 0) return 0

    const completed = Object.values(checklist).filter(Boolean).length
    return Math.round((completed / total) * 100)
  }

  // Calculate days until deadline
  const getDaysUntilDeadline = () => {
    const today = new Date()
    const deadlineDate = new Date(grant.deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDeadline = getDaysUntilDeadline()
  const isUrgent = daysUntilDeadline > 0 && daysUntilDeadline <= 7
  const isPast = daysUntilDeadline < 0

  // Add a mock attachment
  const addAttachment = () => {
    const newAttachment = {
      name: `Document-${Math.floor(Math.random() * 1000)}.pdf`,
      url: "#",
    }
    const updatedAttachments = [...attachments, newAttachment]
    setAttachments(updatedAttachments)
    localStorage.setItem(`grant-attachments-${grant.id}`, JSON.stringify(updatedAttachments))
  }

  // Remove an attachment
  const removeAttachment = (index: number) => {
    const updatedAttachments = [...attachments]
    updatedAttachments.splice(index, 1)
    setAttachments(updatedAttachments)
    localStorage.setItem(`grant-attachments-${grant.id}`, JSON.stringify(updatedAttachments))
  }

  // Share grant
  const shareGrant = () => {
    if (navigator.share) {
      navigator.share({
        title: grant.title,
        text: `Check out this grant: ${grant.title}`,
        url: grant.applicationLink,
      })
    } else {
      navigator.clipboard.writeText(grant.applicationLink)
      alert("Link copied to clipboard!")
    }
  }

  // Render compact card
  if (size === "compact") {
    return (
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          "dark:bg-opacity-10 backdrop-blur-sm",
          isSelected ? "ring-2 ring-primary" : "",
          isUrgent ? "border-l-4 border-l-amber-500" : "",
          isPast ? "border-l-4 border-l-red-500" : "",
        )}
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="text-xs">
              {grant.category}
            </Badge>
            <div className="flex items-center gap-1">
              {onToggleSelect && (
                <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(grant.id)} className="mr-1" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onToggleBookmark(grant.id)}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <CardTitle className="text-base line-clamp-1 mt-1">{grant.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="flex items-center gap-1 text-xs mb-1">
            <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="font-semibold">${grant.amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Calendar
              className={cn(
                "h-3 w-3",
                isUrgent ? "text-amber-600 dark:text-amber-400" : "",
                isPast ? "text-red-600 dark:text-red-400" : "text-red-600 dark:text-red-400",
              )}
            />
            <span>{grant.deadline}</span>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-end">
          <Button variant="default" size="sm" className="text-xs h-7 px-2" asChild>
            <a href={grant.applicationLink} target="_blank" rel="noopener noreferrer">
              Apply
            </a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Render detailed or normal card
  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        "dark:bg-opacity-10 backdrop-blur-sm",
        expanded ? "ring-2 ring-primary/50" : "",
        isSelected ? "ring-2 ring-primary" : "",
        isUrgent ? "border-l-4 border-l-amber-500" : "",
        isPast ? "border-l-4 border-l-red-500" : "",
      )}
    >
      <CardHeader className={cn("pb-2", size === "detailed" ? "pt-6" : "")}>
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {grant.category}
          </Badge>
          <div className="flex items-center gap-1">
            {onToggleSelect && (
              <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(grant.id)} className="mr-1" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleBookmark(grant.id)}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <CardTitle className={cn("line-clamp-2", size === "detailed" ? "text-2xl" : "text-xl")}>
          {grant.title}
        </CardTitle>
        <CardDescription className={cn("line-clamp-2", size === "detailed" ? "text-base mt-2" : "")}>
          {grant.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="font-semibold">${grant.amount.toLocaleString()}</span>

          {size === "detailed" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="ml-2">
                    {grant.fundingSource}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Funding Source</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Calendar
            className={cn(
              "h-4 w-4",
              isUrgent ? "text-amber-600 dark:text-amber-400" : "",
              isPast ? "text-red-600 dark:text-red-400" : "text-red-600 dark:text-red-400",
            )}
          />
          <span>
            Deadline: {grant.deadline}
            {isUrgent && (
              <Badge
                variant="outline"
                className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
              >
                {daysUntilDeadline} days left
              </Badge>
            )}
            {isPast && (
              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Expired
              </Badge>
            )}
          </span>
        </div>

        {isBookmarked && (
          <div className="flex items-center gap-2 mb-3">
            <Badge className={cn("px-2 py-1 text-xs", getStatusColor())}>{status}</Badge>

            <Select value={status} onValueChange={(value) => onUpdateStatus(grant.id, value as ApplicationStatus)}>
              <SelectTrigger className="h-7 text-xs ml-2">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Awarded">Awarded</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {size === "detailed" && (
          <div className="mt-6 mb-4">
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Application Progress</span>
              <span>{getProgressPercentage()}%</span>
            </div>
          </div>
        )}

        {(expanded || size === "detailed") && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            {size === "detailed" ? (
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="checklist">Checklist</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-1">
                      <School className="h-4 w-4" /> Eligibility
                    </h4>
                    <ul className="list-disc list-inside text-sm pl-1">
                      {grant.eligibility.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Funding Source</h4>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{grant.fundingSource}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">National</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Target Audience</h4>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">K-12 Educators</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Success Rate</h4>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Approximately 15-20% of applications are funded</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Important Notes</h4>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">
                        Applications must include a detailed budget and implementation timeline. Letters of support are
                        strongly recommended.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="checklist">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Application Checklist</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const allChecked = Object.values(checklist).every(Boolean)
                          const newChecklist = Object.fromEntries(
                            Object.entries(checklist).map(([key]) => [key, !allChecked]),
                          )
                          setChecklist(newChecklist)
                          localStorage.setItem(`grant-checklist-${grant.id}`, JSON.stringify(newChecklist))
                        }}
                      >
                        {Object.values(checklist).every(Boolean) ? "Uncheck All" : "Check All"}
                      </Button>
                    </div>

                    <Progress value={getProgressPercentage()} className="h-2 mb-4" />

                    {Object.keys(checklist).map((item) => (
                      <div key={item} className="flex items-start space-x-2 border-b pb-2">
                        <Checkbox
                          id={`${grant.id}-${item}`}
                          checked={checklist[item]}
                          onCheckedChange={() => toggleChecklistItem(item)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`${grant.id}-${item}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${checklist[item] ? "line-through text-muted-foreground" : ""}`}
                          >
                            {item}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {item === "Research organization" &&
                              "Review the funding organization's mission and priorities"}
                            {item === "Prepare application" && "Complete all required application forms"}
                            {item === "Gather supporting documents" &&
                              "Collect letters of support, budgets, and other required documents"}
                            {item === "Review requirements" && "Ensure all eligibility requirements are met"}
                            {item === "Submit application" && "Submit before the deadline"}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Attachments</h4>
                      {attachments.length > 0 ? (
                        <div className="space-y-2">
                          {attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted/50 rounded p-2">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-sm">{attachment.name}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No attachments yet</p>
                      )}
                      <Button variant="outline" size="sm" className="mt-2" onClick={addAttachment}>
                        <Paperclip className="h-4 w-4 mr-2" />
                        Add Attachment
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add your notes about this grant..."
                      value={notes}
                      onChange={(e) => saveNotes(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <div className="text-xs text-muted-foreground">
                      Last updated: {notes ? new Date().toLocaleString() : "Never"}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-1">
                    <School className="h-4 w-4" /> Eligibility
                  </h4>
                  <ul className="list-disc list-inside text-sm pl-1">
                    {grant.eligibility.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Funding Source</h4>
                  <p className="text-sm">{grant.fundingSource}</p>
                </div>

                {isBookmarked && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Application Checklist
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs mb-2"
                        onClick={() => setShowChecklist(!showChecklist)}
                      >
                        {showChecklist ? "Hide Checklist" : "Show Checklist"}
                      </Button>

                      {showChecklist && (
                        <div className="space-y-2 mt-2 animate-fadeIn">
                          <Progress value={getProgressPercentage()} className="h-2 mb-2" />
                          {Object.keys(checklist).map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${grant.id}-${item}`}
                                checked={checklist[item]}
                                onCheckedChange={() => toggleChecklistItem(item)}
                              />
                              <label
                                htmlFor={`${grant.id}-${item}`}
                                className={`text-sm ${checklist[item] ? "line-through text-muted-foreground" : ""}`}
                              >
                                {item}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {folders.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-1 flex items-center gap-1">
                          <FolderPlus className="h-4 w-4" /> Add to Folder
                        </h4>
                        <Select onValueChange={(value) => onAddToFolder(grant.id, value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select folder" />
                          </SelectTrigger>
                          <SelectContent>
                            {folders.map((folder) => (
                              <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    <Edit className="h-4 w-4" />
                    {notes ? "View/Edit Notes" : "Add Notes"}
                  </Button>

                  {showNotes && (
                    <div className="mt-3 animate-fadeIn">
                      <Textarea
                        placeholder="Add your notes about this grant..."
                        value={notes}
                        onChange={(e) => saveNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        {size !== "detailed" && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" /> Less Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" /> More Details
              </>
            )}
          </Button>
        )}

        <div className="flex items-center gap-2">
          {size === "detailed" && (
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={shareGrant}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}

          <Button variant="default" size="sm" className="flex items-center gap-1" asChild>
            <a href={grant.applicationLink} target="_blank" rel="noopener noreferrer">
              Apply <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

