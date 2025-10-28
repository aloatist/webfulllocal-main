import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { getPermissionsForRole } from './definitions'
import type { Role } from '@prisma/client'

/**
 * Check if current user has a specific permission
 * @param permission Permission code to check
 * @returns true if user has permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  
  return checkUserPermission(session.user, permission)
}

/**
 * Check if a user object has a specific permission
 * @param user User object from session
 * @param permission Permission code to check
 * @returns true if user has permission
 */
export function checkUserPermission(
  user: { role: Role; permissions?: string[] },
  permission: string
): boolean {
  // Super admin has all permissions
  if (user.role === 'SUPER_ADMIN') return true
  
  // Check user's custom permissions
  if (user.permissions?.includes(permission)) return true
  
  // Check role's default permissions
  const rolePermissions = getPermissionsForRole(user.role)
  return rolePermissions.includes(permission)
}

/**
 * Require a permission - throws error if user doesn't have it
 * @param permission Permission code required
 * @throws Error if user doesn't have permission
 */
export async function requirePermission(permission: string): Promise<void> {
  const allowed = await hasPermission(permission)
  if (!allowed) {
    throw new Error(`Forbidden: Permission '${permission}' required`)
  }
}

/**
 * Check if current user has ALL of the specified permissions
 * @param permissions Array of permission codes
 * @returns true if user has all permissions
 */
export async function hasAllPermissions(permissions: string[]): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  
  return permissions.every(p => checkUserPermission(session.user, p))
}

/**
 * Check if current user has ANY of the specified permissions
 * @param permissions Array of permission codes
 * @returns true if user has at least one permission
 */
export async function hasAnyPermission(permissions: string[]): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  
  return permissions.some(p => checkUserPermission(session.user, p))
}

/**
 * Check if current user has a specific role
 * @param role Role to check
 * @returns true if user has the role
 */
export async function hasRole(role: Role): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  
  return session.user.role === role
}

/**
 * Check if current user has ANY of the specified roles
 * @param roles Array of roles
 * @returns true if user has at least one role
 */
export async function hasAnyRole(roles: Role[]): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  
  return roles.includes(session.user.role)
}

/**
 * Get all permissions for the current user
 * @returns Array of permission codes
 */
export async function getCurrentUserPermissions(): Promise<string[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []
  
  // Super admin has all permissions
  if (session.user.role === 'SUPER_ADMIN') {
    return Object.keys(await import('./definitions').then(m => m.PERMISSIONS))
  }
  
  // Combine role permissions and custom permissions
  const rolePermissions = getPermissionsForRole(session.user.role)
  const customPermissions = session.user.permissions || []
  
  return [...new Set([...rolePermissions, ...customPermissions])]
}
