import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'

export async function GET(req: NextRequest, { params }: { params: { section: string } }) {
  const { section } = params
  const content = await prisma.homepageContent.findUnique({
    where: { section }
  })
  return NextResponse.json(content)
}

export async function PUT(req: NextRequest, { params }: { params: { section: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { section } = params
  const data = await req.json()
  
  const updated = await prisma.homepageContent.upsert({
    where: { section },
    update: data,
    create: { section, ...data }
  })
  
  return NextResponse.json(updated)
}
