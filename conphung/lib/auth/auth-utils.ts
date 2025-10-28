import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'
import { Role } from '@prisma/client'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function checkRole(allowedRoles: Role[]) {
  const user = await getCurrentUser()
  if (!user) return false
  return allowedRoles.includes(user.role)
}

export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

export async function isAdmin() {
  return checkRole([Role.ADMIN])
}

export async function isEditor() {
  return checkRole([Role.ADMIN, Role.EDITOR])
}