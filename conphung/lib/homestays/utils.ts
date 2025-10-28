export function sanitizeMediaUrl(value: string | null | undefined) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (trimmed.length === 0) return undefined
  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`
  }
  return trimmed
}
