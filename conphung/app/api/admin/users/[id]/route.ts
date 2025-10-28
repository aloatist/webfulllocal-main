import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions/check'
import bcrypt from 'bcryptjs'

interface Context {
  params: {
    id: string
  }
}

// GET /api/admin/users/[id]
export async function GET(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canView = await hasPermission('user.view')
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: context.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            Post: true,
            TeamMember: true,
            SocialMediaPost: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canEdit = await hasPermission('user.edit')
  if (!canEdit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      role,
      permissions,
      isActive,
    } = body

    const user = await prisma.user.findUnique({
      where: { id: context.params.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent users from modifying themselves
    if (user.id === session.user.id && role !== undefined && role !== user.role) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      )
    }

    // Check role permission
    if (role !== undefined && role !== user.role) {
      const canManageRoles = await hasPermission('user.manage_roles')
      if (!canManageRoles) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot manage user roles' },
          { status: 403 }
        )
      }
    }

    // Check permissions permission
    if (permissions !== undefined) {
      const canManagePermissions = await hasPermission('user.manage_permissions')
      if (!canManagePermissions) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot manage user permissions' },
          { status: 403 }
        )
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (email !== undefined) {
      // Check if new email already exists
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: context.params.id },
        },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        )
      }

      updateData.email = email
    }
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10)
    }
    if (role !== undefined) updateData.role = role
    if (permissions !== undefined) updateData.permissions = permissions
    if (isActive !== undefined) updateData.isActive = isActive

    const updated = await prisma.user.update({
      where: { id: context.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canDelete = await hasPermission('user.delete')
  if (!canDelete) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Prevent users from deleting themselves
    if (context.params.id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete yourself' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: context.params.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id: context.params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
