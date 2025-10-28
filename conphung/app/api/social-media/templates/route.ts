import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { hasPermission } from '@/lib/permissions/check'

// GET /api/social-media/templates
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canView = await hasPermission('social_media.view')
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    const where: any = {}
    if (platform) where.platform = platform

    const templates = await prisma.socialMediaTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/social-media/templates
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canConnect = await hasPermission('social_media.connect')
  if (!canConnect) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { platform, name, content, isDefault, settings } = body

    // Validation
    if (!platform || !name || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, name, content' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults for this platform
    if (isDefault) {
      await prisma.socialMediaTemplate.updateMany({
        where: {
          platform,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      })
    }

    const template = await prisma.socialMediaTemplate.create({
      data: {
        id: nanoid(),
        platform,
        name,
        content,
        isDefault: isDefault || false,
        settings: settings || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
