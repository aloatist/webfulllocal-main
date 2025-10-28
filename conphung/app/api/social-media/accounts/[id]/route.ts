import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions/check'

interface Context {
  params: {
    id: string
  }
}

// GET /api/social-media/accounts/[id] - Get single account
export async function GET(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canView = await hasPermission('social_media.view')
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const account = await prisma.socialMediaAccount.findUnique({
      where: { id: context.params.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Don't send tokens to client
    const safeAccount = {
      ...account,
      accessToken: account.accessToken ? '***HIDDEN***' : null,
      refreshToken: account.refreshToken ? '***HIDDEN***' : null,
    }

    return NextResponse.json({ account: safeAccount })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/social-media/accounts/[id] - Update account
export async function PATCH(request: NextRequest, context: Context) {
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
    const {
      accountName,
      accessToken,
      refreshToken,
      expiresAt,
      isActive,
      settings,
    } = body

    const account = await prisma.socialMediaAccount.findUnique({
      where: { id: context.params.id },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (accountName !== undefined) updateData.accountName = accountName
    if (accessToken !== undefined) updateData.accessToken = accessToken
    if (refreshToken !== undefined) updateData.refreshToken = refreshToken
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null
    if (isActive !== undefined) updateData.isActive = isActive
    if (settings !== undefined) updateData.settings = settings

    const updated = await prisma.socialMediaAccount.update({
      where: { id: context.params.id },
      data: updateData,
    })

    // Don't send tokens to client
    const safeAccount = {
      ...updated,
      accessToken: updated.accessToken ? '***HIDDEN***' : null,
      refreshToken: updated.refreshToken ? '***HIDDEN***' : null,
    }

    return NextResponse.json({ account: safeAccount })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/social-media/accounts/[id] - Delete account
export async function DELETE(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canDisconnect = await hasPermission('social_media.disconnect')
  if (!canDisconnect) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const account = await prisma.socialMediaAccount.findUnique({
      where: { id: context.params.id },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    await prisma.socialMediaAccount.delete({
      where: { id: context.params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
