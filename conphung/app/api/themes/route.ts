/**
 * Theme Management API
 * 
 * GET  /api/themes - List all themes
 * POST /api/themes - Activate theme
 * DELETE /api/themes?theme=name - Delete theme
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllThemes, setActiveTheme, themeExists, canDeleteTheme, getActiveTheme } from '@/config/theme';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

/**
 * GET /api/themes
 * List all available themes
 */
export async function GET(request: NextRequest) {
  try {
    const themes = await getAllThemes();
    
    return NextResponse.json({
      success: true,
      themes,
      count: themes.length,
    });
  } catch (error) {
    console.error('Error listing themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list themes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/themes
 * Activate a theme
 * Body: { theme: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication for admin routes
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { theme } = body;
    
    if (!theme || typeof theme !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Theme name is required' },
        { status: 400 }
      );
    }
    
    // Check if theme exists
    if (!(await themeExists(theme))) {
      return NextResponse.json(
        { success: false, error: `Theme "${theme}" not found` },
        { status: 404 }
      );
    }
    
    // Set active theme (stores in cookie)
    await setActiveTheme(theme);
    
    // Optional: Also save to database if you want persistence
    // await saveThemeToDatabase(theme);
    
    return NextResponse.json({
      success: true,
      message: `Theme "${theme}" activated successfully`,
      theme,
    });
  } catch (error) {
    console.error('Error activating theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to activate theme' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/themes?theme=name
 * Delete a theme
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    
    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme name is required' },
        { status: 400 }
      );
    }
    
    // Check if theme can be deleted
    if (!(await canDeleteTheme(theme))) {
      return NextResponse.json(
        { success: false, error: `Theme "${theme}" cannot be deleted (it's active or default theme)` },
        { status: 403 }
      );
    }
    
    // Check if theme exists
    if (!(await themeExists(theme))) {
      return NextResponse.json(
        { success: false, error: `Theme "${theme}" not found` },
        { status: 404 }
      );
    }
    
    // Delete theme directory
    const fs = await import('fs/promises');
    const path = await import('path');
    const { getThemePath } = await import('@/config/theme');
    
    const themePath = path.join(process.cwd(), getThemePath(theme));
    
    try {
      await fs.rm(themePath, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting theme directory:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete theme directory' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Theme "${theme}" deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}

