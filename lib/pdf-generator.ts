import type { Grant, ApplicationStatus } from "./types"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatDate } from "./utils"

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "Not Started":
      return "#9CA3AF"
    case "In Progress":
      return "#60A5FA"
    case "Applied":
      return "#FBBF24"
    case "Awarded":
      return "#34D399"
    case "Rejected":
      return "#F87171" 
    default:
      return "#9CA3AF"
  }
}

export const generatePDF = (grants: Grant[], statuses: Record<string, ApplicationStatus>) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  doc.setProperties({
    title: "Grant Finder - Exported Grants",
    subject: "Grant Applications Summary",
    author: "Grant Finder App",
    creator: "Grant Finder App",
  })

  doc.setFontSize(20)
  doc.setTextColor(44, 62, 80)
  doc.text("Grant Finder - Exported Grants", 105, 20, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  const today = new Date()
  doc.text(`Generated on: ${formatDate(today)}`, 105, 27, { align: "center" })

  doc.setFontSize(12)
  doc.setTextColor(44, 62, 80)
  doc.text("Summary", 14, 40)

  const statusCounts: Record<ApplicationStatus, number> = {
    "Not Started": 0,
    "In Progress": 0,
    Applied: 0,
    Awarded: 0,
    Rejected: 0,
  }

  grants.forEach((grant) => {
    const status = statuses[grant.id] || "Not Started"
    statusCounts[status]++
  })

  autoTable(doc, {
    startY: 45,
    head: [["Status", "Count", "Total Amount"]],
    body: Object.entries(statusCounts).map(([status, count]) => {
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

  doc.setFontSize(12)
  doc.setTextColor(44, 62, 80)
  doc.text("Grant Details", 14, doc.lastAutoTable.finalY + 15)

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
      if (data.section === "body" && data.column.index === 4) {
        const status = data.cell.text[0] as ApplicationStatus
        const color = getStatusColor(status)

        doc.setFillColor(color)
        doc.roundedRect(data.cell.x + 2, data.cell.y + data.cell.height / 2 - 3, data.cell.width - 4, 6, 2, 2, "F")

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, { align: "center" })

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)

        return true
      }
    },
  })

  // Add detailed grant information
  let yPosition = doc.lastAutoTable.finalY + 15

  grants.forEach((grant, index) => {
    const status = statuses[grant.id] || "Not Started"

    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text(`${index + 1}. ${grant.title}`, 14, yPosition)

    const statusColor = getStatusColor(status)
    doc.setFillColor(statusColor)
    doc.roundedRect(14, yPosition + 4, 40, 6, 2, 2, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text(status, 34, yPosition + 8, { align: "center" })

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)

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

    if (grant.description) {
      doc.text("Description:", 14, yPosition)
      yPosition += 6

      const splitDescription = doc.splitTextToSize(grant.description, 180)
      doc.text(splitDescription, 14, yPosition)
      yPosition += splitDescription.length * 5 + 5
    }

    if (grant.eligibility && grant.eligibility.length > 0) {
      doc.text("Eligibility:", 14, yPosition)
      yPosition += 6

      grant.eligibility.forEach((item) => {
        doc.text(`• ${item}`, 20, yPosition)
        yPosition += 5
      })
      yPosition += 5
    }

    doc.setDrawColor(200, 200, 200)
    doc.line(14, yPosition, 196, yPosition)
    yPosition += 10
  })

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

  doc.save("grant-finder-export.pdf")
}

