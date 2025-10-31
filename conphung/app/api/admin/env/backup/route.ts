import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { backupEnvFile } from '@/lib/env/manager';

// POST /api/admin/env/backup - Create a new backup
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const backupPath = await backupEnvFile();
    const filename = backupPath.split('/').pop();
    
    return NextResponse.json({ 
      success: true,
      message: 'Backup created successfully',
      filename,
      path: backupPath,
    });
  } catch (error: any) {
    console.error('Error creating backup:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to create backup' },
      { status: 500 }
    );
  }
}
