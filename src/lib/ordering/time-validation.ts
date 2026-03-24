/**
 * Parse opening hours and validate selected time against them.
 * Lenient: if parsing fails, allow any time with a warning.
 */

interface TimeRange {
  open: number  // minutes from midnight
  close: number
}

function parseTime(str: string): number | null {
  // Handles "08.00", "08:00", "8.00", "08.30"
  const match = str.match(/(\d{1,2})[.:](\d{2})/)
  if (!match) return null
  const h = parseInt(match[1])
  const m = parseInt(match[2])
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

function extractTimeRanges(openingHours: string): TimeRange[] | null {
  // Match patterns like "08.00 - 21.00", "08:00-21:00"
  const rangeRegex = /(\d{1,2}[.:]\d{2})\s*[-–]\s*(\d{1,2}[.:]\d{2})/g
  const ranges: TimeRange[] = []
  let match

  while ((match = rangeRegex.exec(openingHours)) !== null) {
    const open = parseTime(match[1])
    const close = parseTime(match[2])
    if (open !== null && close !== null) {
      ranges.push({ open, close })
    }
  }

  return ranges.length > 0 ? ranges : null
}

export interface ValidationResult {
  valid: boolean
  warning?: string
}

export function isWithinOperatingHours(
  openingHours: string | null,
  selectedTime: string // "HH:MM" format
): ValidationResult {
  if (!openingHours) {
    return { valid: true, warning: 'Jam operasional tidak tersedia. Pastikan waktu yang dipilih sesuai.' }
  }

  const ranges = extractTimeRanges(openingHours)
  if (!ranges) {
    return { valid: true, warning: 'Jam operasional tidak dapat dibaca. Pastikan waktu yang dipilih sesuai.' }
  }

  const selectedMinutes = parseTime(selectedTime)
  if (selectedMinutes === null) {
    return { valid: false, warning: 'Format waktu tidak valid.' }
  }

  for (const range of ranges) {
    if (range.close > range.open) {
      // Normal range (e.g., 08:00 - 21:00)
      if (selectedMinutes >= range.open && selectedMinutes <= range.close) {
        return { valid: true }
      }
    } else {
      // Overnight range (e.g., 22:00 - 06:00)
      if (selectedMinutes >= range.open || selectedMinutes <= range.close) {
        return { valid: true }
      }
    }
  }

  return { valid: false, warning: 'Waktu yang dipilih di luar jam operasional.' }
}
