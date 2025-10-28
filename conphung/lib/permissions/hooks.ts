'use client'

import { useSession } from 'next-auth/react'
import { checkUserPermission } from './check'
import { getPermissionsForRole } from './definitions'
import type { Role } from '@prisma/client'

/**
 * Hook to check if current user has a permission
 * @param permission Permission code to check
 * @returns true if user has permission
 */
export function usePermission(permission: string): boolean {
  const { data: session } = useSession()
  
  if (!session?.user) return false
  
  return checkUserPermission(session.user, permission)
}

/**
 * Hook to check if current user has ALL of the specified permissions
 * @param permissions Array of permission codes
 * @returns true if user has all permissions
 */
export function useAllPermissions(permissions: string[]): boolean {
  const { data: session } = useSession()
  
  if (!session?.user) return false
  
  return permissions.every(p => checkUserPermission(session.user, p))
}

/**
 * Hook to check if current user has ANY of the specified permissions
 * @param permissions Array of permission codes
 * @returns true if user has at least one permission
 */
export function useAnyPermission(permissions: string[]): boolean {
  const { data: session } = useSession()
  
  if (!session?.user) return false
  
  return permissions.some(p => checkUserPermission(session.user, p))
}

/**
 * Hook to check if current user has a specific role
 * @param role Role to check
 * @returns true if user has the role
 */
export function useHasRole(role: Role): boolean {
  const { data: session } = useSession()
  
  if (!session?.user) return false
  
  return session.user.role === role
}

/**
 * Hook to check if current user has ANY of the specified roles
 * @param roles Array of roles
 * @returns true if user has at least one role
 */
export function useAnyRole(roles: Role[]): boolean {
  const { data: session } = useSession()
  
  if (!session?.user) return false
  
  return roles.includes(session.user.role)
}

/**
 * Hook to get all permissions for the current user
 * @returns Array of permission codes
 */
export function useUserPermissions(): string[] {
  const { data: session } = useSession()
  
  if (!session?.user) return []
  
  // Super admin has all permissions (handled in definitions)
  const rolePermissions = getPermissionsForRole(session.user.role)
  const customPermissions = session.user.permissions || []
  
  return [...new Set([...rolePermissions, ...customPermissions])]
}

/**
 * Hook to get current user's role
 * @returns User's role or null
 */
export function useUserRole(): Role | null {
  const { data: session } = useSession()
  
  return session?.user?.role || null
}

/**
 * Hook to check if user is admin or super admin
 * @returns true if user is admin/super admin
 */
export function useIsAdmin(): boolean {
  const { data: session } = useSession()
  
  if (!session?.user) return false
  
  return session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'
}

/**
 * Hook to check if user is authenticated
 * @returns true if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { data: session, status } = useSession()
  
  return status === 'authenticated' && !!session?.user
}
