import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { restoreFromBackup } from '@/lib/env/manager';

// POST /api/admin/env/restore - Restore from backup
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
    const { filename } = body;
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }
    
    await restoreFromBackup(filename);
    
    return NextResponse.json({ 
      success: true,
      message: 'Restored from backup successfully',
      filename,
    });
  } catch (error: any) {
    console.error('Error restoring backup:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to restore from backup' },
      { status: 500 }
    );
  }
}
