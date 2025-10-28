import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

interface Context {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const media = await prisma.media.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { alt, caption } = json;

    const media = await prisma.media.findUnique({
      where: { id: context.params.id },
      select: {
        uploadedBy: { select: { id: true } },
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if user has permission to edit
    if (
      media.uploadedBy.id !== session.user.id &&
      !['ADMIN', 'EDITOR'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedMedia = await prisma.media.update({
      where: { id: context.params.id },
      data: {
        alt: typeof alt === 'string' ? alt : null,
        caption: typeof caption === 'string' ? caption : null,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    console.error('Failed to update media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const media = await prisma.media.findUnique({
      where: { id: context.params.id },
      select: {
        publicId: true,
        uploadedBy: { select: { id: true } },
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if user has permission to delete
    if (
      media.uploadedBy.id !== session.user.id &&
      !['ADMIN', 'EDITOR'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete from Cloudinary when we have a stored public ID
    if (media.publicId) {
      await deleteFromCloudinary(media.publicId);
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: context.params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
