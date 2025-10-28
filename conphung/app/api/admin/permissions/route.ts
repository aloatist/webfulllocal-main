import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { hasPermission } from '@/lib/permissions/check'
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  PERMISSION_CATEGORIES,
  getAllPermissions,
  getPermissionsByCategory,
} from '@/lib/permissions/definitions'

// GET /api/admin/permissions - Get all permissions and roles
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canView = await hasPermission('user.manage_permissions')
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') // 'full' or 'codes'

    if (format === 'codes') {
      // Return just permission codes
      return NextResponse.json({
        permissions: getAllPermissions(),
        roles: Object.keys(ROLE_PERMISSIONS),
      })
    }

    // Return full permissions with categories
    const categorized: Record<string, any[]> = {}

    for (const [categoryKey, categoryName] of Object.entries(PERMISSION_CATEGORIES)) {
      const perms = getPermissionsByCategory(categoryKey)
      categorized[categoryKey] = perms.map(code => ({
        code,
        name: PERMISSIONS[code as keyof typeof PERMISSIONS],
        category: categoryName,
      }))
    }

    // Return full data
    return NextResponse.json({
      permissions: Object.entries(PERMISSIONS).map(([code, name]) => ({
        code,
        name,
      })),
      categories: Object.entries(PERMISSION_CATEGORIES).map(([key, name]) => ({
        key,
        name,
        permissions: getPermissionsByCategory(key),
      })),
      roles: Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
        role,
        permissions: Array.from(permissions),
        count: permissions.length,
      })),
    })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
