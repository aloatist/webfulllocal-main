/**
 * Theme Customizer API
 * 
 * GET  /api/themes/customizer - Get customizer options
 * POST /api/themes/customizer - Save customizer options
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getCustomizerOptions, saveCustomizerOptions, ThemeCustomizerOptions } from '@/lib/theme/customizer';

/**
 * GET - Get customizer options
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    
    const options = await getCustomizerOptions(theme || undefined);
    
    return NextResponse.json({
      success: true,
      options,
    });
  } catch (error) {
    console.error('Error getting customizer options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get customizer options' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save customizer options
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { options, theme } = body;
    
    if (!options || typeof options !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Options are required' },
        { status: 400 }
      );
    }
    
    await saveCustomizerOptions(options as ThemeCustomizerOptions, theme);
    
    return NextResponse.json({
      success: true,
      message: 'Customizer options saved successfully',
    });
  } catch (error) {
    console.error('Error saving customizer options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save customizer options' },
      { status: 500 }
    );
  }
}

