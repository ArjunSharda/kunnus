import type { Grant, ApplicationStatus } from "./types"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatDate } from "./utils"

// Helper function to get status color
const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "Not Started":
      return "#9CA3AF" // gray-400
    case "In Progress":
      return "#60A5FA" // blue-400
    case "Applied":
      return "#FBBF24" // amber-400
    case "Awarded":
      return "#34D399" // green-400
    case "Rejected":
      return "#F87171" // red-400
    default:
      return "#9CA3AF" // gray-400
  }
}

export const generatePDF = (grants: Grant[], statuses: Record<string, ApplicationStatus>) => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Add metadata
  doc.setProperties({
    title: "Grant Finder - Exported Grants",
    subject: "Grant Applications Summary",
    author: "Grant Finder App",
    creator: "Grant Finder App",
  })

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(44, 62, 80) // Dark blue-gray
  doc.text("Grant Finder - Exported Grants", 105, 20, { align: "center" })

  // Add date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  const today = new Date()
  doc.text(`Generated on: ${formatDate(today)}`, 105, 27, { align: "center" })

  // Add summary section
  doc.setFontSize(12)
  doc.setTextColor(44, 62, 80)
  doc.text("Summary", 14, 40)

  // Add summary table
  const statusCounts: Record<ApplicationStatus, number> = {
    "Not Started": 0,
    "In Progress": 0,
    Applied: 0,
    Awarded: 0,
    Rejected: 0,
  }

  // Count grants by status
  grants.forEach((grant) => {
    const status = statuses[grant.id] || "Not Started"
    statusCounts[status]++
  })

  // Create summary table
  autoTable(doc, {
    startY: 45,
    head: [["Status", "Count", "Total Amount"]],
    body: Object.entries(statusCounts).map(([status, count]) => {
      // Calculate total amount for this status
      const totalAmount = grants
        .filter((grant) => (statuses[grant.id] || "Not Started") === status)
        .reduce((sum, grant) => sum + grant.amount, 0)

      return [status, count.toString(), `$${totalAmount.toLocaleString()}`]
    }),
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 60, halign: "right" },
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { left: 14, right: 14 },
  })

  // Add grants details section
  doc.setFontSize(12)
  doc.setTextColor(44, 62, 80)
  doc.text("Grant Details", 14, doc.lastAutoTable.finalY + 15)

  // Create grants table with all details
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Grant", "Category", "Amount", "Deadline", "Status"]],
    body: grants.map((grant) => {
      const status = statuses[grant.id] || "Not Started"
      return [grant.title, grant.category, `$${grant.amount.toLocaleString()}`, grant.deadline, status]
    }),
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 30 },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { left: 14, right: 14 },
    didDrawCell: (data) => {
      // Color the status cell based on the status
      if (data.section === "body" && data.column.index === 4) {
        const status = data.cell.text[0] as ApplicationStatus
        const color = getStatusColor(status)

        // Draw a colored rectangle in the cell
        doc.setFillColor(color)
        doc.roundedRect(data.cell.x + 2, data.cell.y + data.cell.height / 2 - 3, data.cell.width - 4, 6, 2, 2, "F")

        // Add the status text in white
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, { align: "center" })

        // Reset text color
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)

        // Return true to prevent the default cell rendering
        return true
      }
    },
  })

  // Add detailed grant information
  let yPosition = doc.lastAutoTable.finalY + 15

  grants.forEach((grant, index) => {
    const status = statuses[grant.id] || "Not Started"

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Add grant title
    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text(`${index + 1}. ${grant.title}`, 14, yPosition)

    // Add status indicator
    const statusColor = getStatusColor(status)
    doc.setFillColor(statusColor)
    doc.roundedRect(14, yPosition + 4, 40, 6, 2, 2, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text(status, 34, yPosition + 8, { align: "center" })

    // Reset text color
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)

    // Add grant details
    yPosition += 15
    doc.text(`Category: ${grant.category}`, 14, yPosition)
    yPosition += 6
    doc.text(`Amount: $${grant.amount.toLocaleString()}`, 14, yPosition)
    yPosition += 6
    doc.text(`Deadline: ${grant.deadline}`, 14, yPosition)
    yPosition += 6

    if (grant.fundingSource) {
      doc.text(`Funding Source: ${grant.fundingSource}`, 14, yPosition)
      yPosition += 6
    }

    if (grant.applicationLink) {
      doc.text(`Application Link: ${grant.applicationLink}`, 14, yPosition)
      yPosition += 6
    }

    // Add description with word wrapping
    if (grant.description) {
      doc.text("Description:", 14, yPosition)
      yPosition += 6

      const splitDescription = doc.splitTextToSize(grant.description, 180)
      doc.text(splitDescription, 14, yPosition)
      yPosition += splitDescription.length * 5 + 5
    }

    // Add eligibility if available
    if (grant.eligibility && grant.eligibility.length > 0) {
      doc.text("Eligibility:", 14, yPosition)
      yPosition += 6

      grant.eligibility.forEach((item) => {
        doc.text(`• ${item}`, 20, yPosition)
        yPosition += 5
      })
      yPosition += 5
    }

    // Add separator
    doc.setDrawColor(200, 200, 200)
    doc.line(14, yPosition, 196, yPosition)
    yPosition += 10
  })

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
      align: "center",
    })
    doc.text("Generated by Grant Finder", doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, {
      align: "right",
    })
  }

  // Save the PDF
  doc.save("grant-finder-export.pdf")
}

// Helper function to format date if not already in utils.ts
function formatDate(date: Date): string {
   return date.toLocaleDateString('en-US', {
   year: 'numeric',
   month: 'long',
   day: 'numeric'
   })
 }

