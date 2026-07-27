/**
 * Utility functions for date formatting in Simple Bank
 */

/**
 * Formats an ISO date string into a human-readable Indonesian date format.
 * Examples:
 * - "2025-08-12T10:00:00Z" -> "12 Agustus 2025"
 * - null / "0001-01-01T00:00:00Z" / empty -> "-" or custom fallback
 */
export function formatDate(dateString?: string | null, fallback = '-'): string {
  if (!dateString) {
    return fallback
  }

  const trimmed = dateString.trim()
  if (
    trimmed === '' ||
    trimmed.startsWith('0001-01-01') ||
    trimmed.startsWith('1970-01-01')
  ) {
    return fallback
  }

  try {
    const date = new Date(trimmed)
    if (isNaN(date.getTime())) {
      return fallback
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch {
    return fallback
  }
}

/**
 * Formats date string with full time details (e.g., "12 Agustus 2025, 18:45")
 */
export function formatDateTime(dateString?: string | null, fallback = '-'): string {
  if (!dateString) {
    return fallback
  }

  const trimmed = dateString.trim()
  if (
    trimmed === '' ||
    trimmed.startsWith('0001-01-01') ||
    trimmed.startsWith('1970-01-01')
  ) {
    return fallback
  }

  try {
    const date = new Date(trimmed)
    if (isNaN(date.getTime())) {
      return fallback
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch {
    return fallback
  }
}
