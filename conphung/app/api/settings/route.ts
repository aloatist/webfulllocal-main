import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

export const dynamic = 'force-dynamic';

// In-memory storage for settings (replace with database in production)
let settings: Record<string, string> = {}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const key = searchParams.get('key')

    // If specific key requested
    if (key) {
      return NextResponse.json({ 
        key, 
        value: settings[key] || null 
      })
    }

    // If category filter
    if (category) {
      const filtered = Object.entries(settings)
        .filter(([k]) => k.startsWith(`${category}_`))
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
      
      return NextResponse.json({ settings: filtered })
    }

    // Return all settings
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { key, value } = body

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      )
    }

    // Update setting
    settings[key] = value

    return NextResponse.json({ 
      success: true,
      key,
      value 
    })
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { settings: newSettings } = body

    if (!newSettings || typeof newSettings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      )
    }

    // Bulk update
    settings = { ...settings, ...newSettings }

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully' 
    })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
