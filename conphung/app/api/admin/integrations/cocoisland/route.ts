import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/tours/permissions'

const schema = z.object({
  siteUrl: z.string().url().min(1),
  apiBase: z.string().min(1),
  bookingThreshold: z.coerce.number().int().min(0),
})

const KEYS = {
  siteUrl: 'cocoisland.siteUrl',
  apiBase: 'cocoisland.apiBase',
  bookingThreshold: 'cocoisland.bookingThreshold',
} as const

async function getSetting(key: string) {
  const found = await prisma.setting.findUnique({ where: { key } })
  return found?.value ?? null
}

export async function GET() {
  const auth = await requireAdmin()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const [siteUrl, apiBase, bookingThreshold] = await Promise.all([
    getSetting(KEYS.siteUrl),
    getSetting(KEYS.apiBase),
    getSetting(KEYS.bookingThreshold),
  ])

  return NextResponse.json({
    siteUrl: siteUrl ?? '',
    apiBase: apiBase ?? '/api',
    bookingThreshold: bookingThreshold ? Number(bookingThreshold) : 5,
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const payload = await request.json()
    const data = schema.parse(payload)

    // @ts-ignore
    await prisma.$transaction([
      // @ts-ignore
      prisma.setting.upsert({
        where: { key: KEYS.siteUrl },
        create: { key: KEYS.siteUrl, value: data.siteUrl, type: 'string', group: 'cocoisland' },
        update: { value: data.siteUrl },
      }),
      // @ts-ignore
      prisma.setting.upsert({
        where: { key: KEYS.apiBase },
        create: { key: KEYS.apiBase, value: data.apiBase, type: 'string', group: 'cocoisland' },
        update: { value: data.apiBase },
      }),
      // @ts-ignore
      prisma.setting.upsert({
        where: { key: KEYS.bookingThreshold },
        create: { key: KEYS.bookingThreshold, value: String(data.bookingThreshold), type: 'number', group: 'cocoisland' },
        update: { value: String(data.bookingThreshold) },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'


