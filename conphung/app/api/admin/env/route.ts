import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getEnvConfig, saveEnvConfig, addEnvVariable, updateEnvVariable, deleteEnvVariable } from '@/lib/env/manager';
import { envConfigSchema, envVariableSchema } from '@/lib/env/types';

// GET /api/admin/env - Load environment variables
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Only ADMIN can access
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const config = await getEnvConfig();
    
    // Mask secret values
    config.variables = config.variables.map(variable => ({
      ...variable,
      value: variable.isSecret && variable.value ? '••••••••' : variable.value,
    }));
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading env config:', error);
    return NextResponse.json(
      { error: 'Failed to load environment configuration' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/env - Save environment variables
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only ADMIN can save
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate with Zod
    const validatedConfig = envConfigSchema.parse(body);
    
    // Filter out masked values (don't overwrite secrets if they're still masked)
    validatedConfig.variables = validatedConfig.variables.map(variable => {
      if (variable.isSecret && variable.value === '••••••••') {
        // Keep existing value, don't update
        return { ...variable, value: '' }; // Will be skipped in save
      }
      return variable;
    });
    
    // Save to .env file with backup
    await saveEnvConfig(validatedConfig, { createBackup: true });
    
    return NextResponse.json({ 
      success: true,
      message: 'Environment variables saved successfully. Server restart required to apply changes.',
      requiresRestart: true,
    });
  } catch (error: any) {
    console.error('Error saving env config:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to save environment configuration' },
      { status: 500 }
    );
  }
}

// POST /api/admin/env - Add new environment variable
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate with Zod
    const validatedVariable = envVariableSchema.parse(body);
    
    // Add to .env file
    await addEnvVariable(validatedVariable);
    
    return NextResponse.json({ 
      success: true,
      message: 'Environment variable added successfully',
    });
  } catch (error: any) {
    console.error('Error adding env variable:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to add environment variable' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/env - Delete environment variable
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'Variable key is required' },
        { status: 400 }
      );
    }
    
    // Delete from .env file
    await deleteEnvVariable(key);
    
    return NextResponse.json({ 
      success: true,
      message: 'Environment variable deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting env variable:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete environment variable' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/env - Update single environment variable
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { key, ...updates } = body;
    
    if (!key) {
      return NextResponse.json(
        { error: 'Variable key is required' },
        { status: 400 }
      );
    }
    
    // Update in .env file
    await updateEnvVariable(key, updates);
    
    return NextResponse.json({ 
      success: true,
      message: 'Environment variable updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating env variable:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to update environment variable' },
      { status: 500 }
    );
  }
}
