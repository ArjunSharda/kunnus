import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
  })
}

export { formatDate }