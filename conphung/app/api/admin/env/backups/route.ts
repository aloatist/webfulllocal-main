import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { listBackups } from '@/lib/env/manager';

// GET /api/admin/env/backups - List all backups
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const backups = await listBackups();
    
    return NextResponse.json({ backups });
  } catch (error: any) {
    console.error('Error listing backups:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to list backups' },
      { status: 500 }
    );
  }
}
