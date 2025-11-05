/**
 * Theme Preview API
 * 
 * GET /api/themes/preview?theme=name
 * Set preview theme cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PREVIEW_COOKIE_NAME = 'preview_theme';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    
    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme parameter is required' },
        { status: 400 }
      );
    }
    
    // Set preview cookie
    const cookieStore = await cookies();
    cookieStore.set(PREVIEW_COOKIE_NAME, theme, {
      path: '/',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
    });
    
    return NextResponse.json({
      success: true,
      message: `Preview theme "${theme}" enabled`,
      theme,
    });
  } catch (error) {
    console.error('Error setting preview theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set preview theme' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Clear preview cookie
    const cookieStore = await cookies();
    cookieStore.delete(PREVIEW_COOKIE_NAME);
    
    return NextResponse.json({
      success: true,
      message: 'Preview theme disabled',
    });
  } catch (error) {
    console.error('Error clearing preview theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear preview theme' },
      { status: 500 }
    );
  }
}

