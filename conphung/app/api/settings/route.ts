import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { defaultSettings } from '@/lib/settings/types';

export const dynamic = 'force-dynamic';

// GET - Load settings from database or return defaults
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const key = searchParams.get('key');

    // If specific key requested
    if (key) {
      const setting = await prisma.setting.findUnique({
        where: { key },
      });
      return NextResponse.json({ 
        key, 
        value: setting?.value || null 
      });
    }

    // Load all settings from database
    const dbSettings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    
    // Convert to key-value map
    dbSettings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    // Merge with defaults for missing keys
    const mergedSettings: Record<string, string> = {};
    defaultSettings.forEach(defSetting => {
      mergedSettings[defSetting.key] = settingsMap[defSetting.key] || defSetting.value;
    });

    // If category filter
    if (category) {
      const filtered: Record<string, string> = {};
      Object.keys(mergedSettings).forEach(k => {
        if (k.startsWith(`${category}_`)) {
          filtered[k] = mergedSettings[k];
        }
      });
      return NextResponse.json({ settings: filtered });
    }

    // Return all settings
    return NextResponse.json({ settings: mergedSettings });
  } catch (error) {
    console.error('Settings GET error:', error);
    // Fallback to defaults if DB error
    const defaults: Record<string, string> = {};
    defaultSettings.forEach(s => {
      defaults[s.key] = s.value;
    });
    return NextResponse.json({ settings: defaults });
  }
}

// PUT - Save settings to database
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings: newSettings } = body;

    if (!newSettings || typeof newSettings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Get setting definitions to determine type and group
    const settingDefs = defaultSettings.reduce((acc, s) => {
      acc[s.key] = s;
      return acc;
    }, {} as Record<string, typeof defaultSettings[0]>);

    // Save each setting to database
    const promises = Object.entries(newSettings).map(async ([key, value]) => {
      const def = settingDefs[key];
      if (!def) {
        console.warn(`Unknown setting key: ${key}`);
        return;
      }

      // Upsert setting
      await prisma.setting.upsert({
        where: { key },
        update: {
          value: String(value),
          type: def.type,
          group: def.category,
          updatedAt: new Date(),
        },
        create: {
          key,
          value: String(value),
          type: def.type,
          group: def.category,
        },
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// POST - Update single setting (legacy support)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    // Find setting definition
    const def = defaultSettings.find(s => s.key === key);
    if (!def) {
      return NextResponse.json(
        { error: 'Unknown setting key' },
        { status: 400 }
      );
    }

    // Upsert setting
    await prisma.setting.upsert({
      where: { key },
      update: {
        value: String(value),
        type: def.type,
        group: def.category,
        updatedAt: new Date(),
      },
      create: {
        key,
        value: String(value),
        type: def.type,
        group: def.category,
      },
    });

    return NextResponse.json({ 
      success: true,
      key,
      value 
    });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}
