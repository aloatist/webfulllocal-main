'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, Loader2 } from 'lucide-react'
import { clearAuthTokens } from '@/lib/auth/token-storage'

interface LogoutButtonProps {
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({ 
  className = '', 
  showIcon = true,
  children = 'Đăng xuất'
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      // Step 1: Clear local storage
      clearAuthTokens()
      
      // Step 2: Clear session storage
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear()
      }
      
      // Step 3: Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => {
        console.warn('Logout API call failed:', err)
      })
      
      // Step 4: Sign out from NextAuth
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      })
    } catch (error) {
      console.error('Logout error:', error)
      
      // Force redirect on error
      clearAuthTokens()
      window.location.href = '/login'
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Đang đăng xuất...
        </>
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}
