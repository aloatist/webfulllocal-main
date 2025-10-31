import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getHomepageConfig, saveHomepageConfig } from '@/lib/homepage/sections';
import { homepageConfigSchema } from '@/lib/homepage/schema';

// GET /api/admin/homepage - Load homepage config
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const config = await getHomepageConfig();
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to load homepage configuration' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/homepage - Save homepage config
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate with Zod
    const validatedConfig = homepageConfigSchema.parse(body);
    
    // Save to database
    await saveHomepageConfig(validatedConfig, {
      updatedById: session.user?.id,
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Homepage configuration saved successfully'
    });
  } catch (error: any) {
    console.error('Error saving homepage config:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save homepage configuration' },
      { status: 500 }
    );
  }
}
