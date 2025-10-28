import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { hasPermission } from '@/lib/permissions/check'

// GET /api/social-media/accounts - List all accounts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check permission
  const canView = await hasPermission('social_media.view')
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (platform) where.platform = platform
    if (isActive !== null) where.isActive = isActive === 'true'

    const accounts = await prisma.socialMediaAccount.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    // Don't send tokens to client
    const safeAccounts = accounts.map(acc => ({
      ...acc,
      accessToken: acc.accessToken ? '***HIDDEN***' : null,
      refreshToken: acc.refreshToken ? '***HIDDEN***' : null,
    }))

    return NextResponse.json({ accounts: safeAccounts })
  } catch (error) {
    console.error('Error fetching social media accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/social-media/accounts - Create new account
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check permission
  const canConnect = await hasPermission('social_media.connect')
  if (!canConnect) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      platform,
      accountName,
      accountId,
      accessToken,
      refreshToken,
      expiresAt,
      settings,
    } = body

    // Validation
    if (!platform || !accountName || !accountId) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, accountName, accountId' },
        { status: 400 }
      )
    }

    // Check if account already exists
    const existing = await prisma.socialMediaAccount.findFirst({
      where: {
        platform,
        accountId,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Account already connected' },
        { status: 409 }
      )
    }

    const account = await prisma.socialMediaAccount.create({
      data: {
        id: nanoid(),
        platform,
        accountName,
        accountId,
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        settings: settings || {},
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Don't send tokens to client
    const safeAccount = {
      ...account,
      accessToken: account.accessToken ? '***HIDDEN***' : null,
      refreshToken: account.refreshToken ? '***HIDDEN***' : null,
    }

    return NextResponse.json({ account: safeAccount }, { status: 201 })
  } catch (error) {
    console.error('Error creating social media account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
