import 'next-auth'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
    permissions?: string[]
    isActive?: boolean
  }

  interface Session {
    user: User & {
      id: string
      role: Role
      permissions?: string[]
      isActive?: boolean
    }
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    role: Role
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role: Role
  }
}

declare module '@auth/prisma-adapter/node_modules/@auth/core/adapters' {
  interface AdapterUser {
    role: Role
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
  }
}
