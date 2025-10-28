import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { Role } from '@prisma/client'

type AuthResult =
  | { status: 200; user: { id: string; email?: string | null; role: Role } }
  | { status: 401 | 403; error: string }

export async function requireEditor(): Promise<AuthResult> {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    return { status: 401, error: 'Unauthorized' }
  }

  if (user.role !== Role.ADMIN && user.role !== Role.EDITOR) {
    return { status: 403, error: 'Forbidden' }
  }

  return { status: 200, user: { id: user.id, email: user.email, role: user.role } }
}

export async function requireAdmin(): Promise<AuthResult> {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    return { status: 401, error: 'Unauthorized' }
  }

  if (user.role !== Role.ADMIN) {
    return { status: 403, error: 'Forbidden' }
  }

  return { status: 200, user: { id: user.id, email: user.email, role: user.role } }
}
