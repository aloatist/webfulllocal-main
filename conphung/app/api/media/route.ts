import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user?.id || !role || !['ADMIN', 'EDITOR'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') ?? '1', 10), 1);
    const rawLimit = parseInt(searchParams.get('limit') ?? `${DEFAULT_LIMIT}`, 10);
    const limit = Math.min(Math.max(rawLimit, 1), MAX_LIMIT);
    const search = (searchParams.get('search') ?? '').trim();

    const where: Prisma.MediaWhereInput | undefined = search
      ? {
          OR: [
            { filename: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { alt: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { caption: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : undefined;

    const [total, media] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        include: {
          User: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user?.id || !role || !['ADMIN', 'EDITOR'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const alt = formData.get('alt');
    const caption = formData.get('caption');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const isCloudinaryConfigured =
      Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) &&
      Boolean(process.env.CLOUDINARY_API_KEY) &&
      Boolean(process.env.CLOUDINARY_API_SECRET);

    let url: string | undefined;
    let publicId: string | undefined;
    let width: number | null = null;
    let height: number | null = null;
    const mimeType = file.type || 'application/octet-stream';

    if (isCloudinaryConfigured) {
      try {
        const result = await uploadToCloudinary(buffer, {
          filename: file.name,
          folder: 'media',
        });
        url = result.secure_url;
        publicId = result.public_id;
        width = result.width ?? null;
        height = result.height ?? null;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, falling back to local storage:', cloudinaryError);
      }
    }

    if (!url || !publicId) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const extension = path.extname(file.name) || '';
      const baseName = path
        .basename(file.name, extension)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const uniqueName = `${baseName || 'media'}-${randomUUID()}${extension}`;
      const filePath = path.join(uploadsDir, uniqueName);
      await fs.writeFile(filePath, buffer);
      url = `/uploads/${uniqueName}`;
      publicId = `local:${uniqueName}`;
      width = null;
      height = null;
    }

    const media = await prisma.media.create({
      data: {
        id: nanoid(),
        filename: file.name,
        url,
        publicId,
        mimeType,
        size: typeof file.size === 'number' ? file.size : buffer.length,
        width,
        height,
        alt: typeof alt === 'string' ? alt : null,
        caption: typeof caption === 'string' ? caption : null,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        User: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('Failed to upload media:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload media',
      },
      { status: 500 },
    );
  }
}
