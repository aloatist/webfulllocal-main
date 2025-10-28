import { Prisma } from '@prisma/client'

export function toDecimal(value: number | string) {
  const numeric =
    typeof value === 'number' ? value : Number.parseFloat(String(value))

  if (Number.isNaN(numeric)) {
    throw new Error(`Invalid decimal value: ${value}`)
  }

  return new Prisma.Decimal(numeric)
}

export function toOptionalDecimal(
  value: number | string | null | undefined
) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  return toDecimal(value)
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export function ensureUniqueSlug(base: string, existingSlugs: Set<string>) {
  let slug = base
  let counter = 1

  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter += 1
  }

  existingSlugs.add(slug)
  return slug
}
