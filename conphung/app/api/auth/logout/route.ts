import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession(authOptions)
    
    if (session) {
      console.log('Logging out user:', session.user?.email)
    }
    
    // Return success - NextAuth will handle session clearing
    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    })
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
