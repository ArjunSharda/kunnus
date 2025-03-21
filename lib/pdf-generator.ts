import type { Grant, ApplicationStatus } from "./types"

// This is a mock PDF generator function
// In a real application, you would use a library like jsPDF or pdfmake
export const generatePDF = (grants: Grant[], statuses: Record<string, ApplicationStatus>) => {
  // In a real implementation, this would generate a PDF
  // For now, we'll just create a simple text representation and download it

  let content = "GRANT FINDER - EXPORTED GRANTS\n\n"

  grants.forEach((grant, index) => {
    content += `GRANT #${index + 1}: ${grant.title}\n`
    content += `Category: ${grant.category}\n`
    content += `Amount: $${grant.amount.toLocaleString()}\n`
    content += `Deadline: ${grant.deadline}\n`
    content += `Status: ${statuses[grant.id] || "Not Started"}\n`
    content += `Funding Source: ${grant.fundingSource}\n`
    content += `Description: ${grant.description}\n`
    content += `Eligibility: ${grant.eligibility.join(", ")}\n`
    content += `Application Link: ${grant.applicationLink}\n\n`
    content += "---------------------------------------------\n\n"
  })

  // Create a blob and download it
  const blob = new Blob([content], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.setAttribute("hidden", "")
  a.setAttribute("href", url)
  a.setAttribute("download", "bookmarked-grants.pdf")
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}