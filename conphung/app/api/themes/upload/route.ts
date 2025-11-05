/**
 * Theme Upload API
 * 
 * POST /api/themes/upload
 * Upload a theme .zip file
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const THEMES_DIR = process.env.THEMES_DIR || 'templates';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('theme') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { success: false, error: 'File must be a .zip archive' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds maximum ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'tmp', `upload-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Save uploaded file
    const tempZipPath = path.join(tempDir, file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(tempZipPath, buffer);

    // Extract zip file
    const AdmZip = await import('adm-zip');
    const zip = new AdmZip(tempZipPath);
    const extractPath = path.join(tempDir, 'extracted');
    zip.extractAllTo(extractPath, true);

    // Find theme.json
    const extractedFiles = await fs.readdir(extractPath);
    let themeJsonPath: string | null = null;
    
    // Check root
    const rootThemeJson = path.join(extractPath, 'theme.json');
    try {
      await fs.access(rootThemeJson);
      themeJsonPath = rootThemeJson;
    } catch {
      // Check subdirectories
      for (const item of extractedFiles) {
        const itemPath = path.join(extractPath, item);
        const stat = await fs.stat(itemPath);
        if (stat.isDirectory()) {
          const subThemeJson = path.join(itemPath, 'theme.json');
          try {
            await fs.access(subThemeJson);
            themeJsonPath = subThemeJson;
            break;
          } catch {
            continue;
          }
        }
      }
    }

    if (!themeJsonPath) {
      // Cleanup
      await fs.rm(tempDir, { recursive: true, force: true });
      return NextResponse.json(
        { success: false, error: 'theme.json not found in zip file' },
        { status: 400 }
      );
    }

    // Read theme.json
    const themeJsonContent = await fs.readFile(themeJsonPath, 'utf-8');
    const themeConfig = JSON.parse(themeJsonContent);

    // Extract theme name (from folder name or theme.json name field)
    const themeDir = path.dirname(themeJsonPath);
    const themeName = path.basename(themeDir) !== 'extracted' 
      ? path.basename(themeDir)
      : themeConfig.name?.toLowerCase().replace(/\s+/g, '-') || 'theme-' + Date.now();

    // Validate theme name
    if (!/^[a-z0-9-]+$/.test(themeName)) {
      await fs.rm(tempDir, { recursive: true, force: true });
      return NextResponse.json(
        { success: false, error: 'Invalid theme name. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    // Check if theme already exists
    const finalThemePath = path.join(process.cwd(), THEMES_DIR, themeName);
    try {
      await fs.access(finalThemePath);
      await fs.rm(tempDir, { recursive: true, force: true });
      return NextResponse.json(
        { success: false, error: `Theme "${themeName}" already exists` },
        { status: 409 }
      );
    } catch {
      // Theme doesn't exist, proceed
    }

    // Move extracted theme to final location
    const sourceDir = path.dirname(themeJsonPath);
    await fs.mkdir(finalThemePath, { recursive: true });
    
    // Copy all files
    const copyRecursive = async (src: string, dest: string) => {
      const entries = await fs.readdir(src, { withFileTypes: true });
      await fs.mkdir(dest, { recursive: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          await copyRecursive(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    };

    await copyRecursive(sourceDir, finalThemePath);

    // Cleanup temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: `Theme "${themeName}" uploaded successfully`,
      themeName,
    });
  } catch (error) {
    console.error('Error uploading theme:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to upload theme' },
      { status: 500 }
    );
  }
}

