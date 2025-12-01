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
        User: {
          select: {
            id: true,
            name: true,
            email: true,
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
        userId: true,
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if user has permission to edit
    // Allow ADMIN and EDITOR to edit any media, or allow user to edit their own media
    if (
      media.userId !== session.user.id &&
      !['ADMIN', 'EDITOR'].includes(session.user.role ?? '')
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
        User: {
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
        userId: true,
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if user has permission to delete
    // Allow ADMIN and EDITOR to delete any media, or allow user to delete their own media
    if (
      media.userId !== session.user.id &&
      !['ADMIN', 'EDITOR'].includes(session.user.role ?? '')
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if media is being used
    const [postCount, homestayCount, tourCount] = await Promise.all([
      prisma.post.count({ where: { featuredImageId: context.params.id } }),
      prisma.homestayMedia.count({ where: { mediaId: context.params.id } }),
      prisma.tourMedia.count({ where: { mediaId: context.params.id } }),
    ]);

    if (postCount > 0 || homestayCount > 0 || tourCount > 0) {
      const usage = [];
      if (postCount > 0) usage.push(`${postCount} bài viết`);
      if (homestayCount > 0) usage.push(`${homestayCount} homestay`);
      if (tourCount > 0) usage.push(`${tourCount} tour`);
      
      return NextResponse.json(
        { 
          error: 'Không thể xóa media đang được sử dụng',
          details: `Media này đang được sử dụng trong: ${usage.join(', ')}. Vui lòng gỡ bỏ khỏi các mục này trước khi xóa.`
        },
        { status: 400 }
      );
    }

    // Delete from Cloudinary when we have a stored public ID
    if (media.publicId && !media.publicId.startsWith('local:')) {
      try {
        await deleteFromCloudinary(media.publicId);
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: context.params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete media:', error);
    
    // Check for foreign key constraint error
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
      return NextResponse.json(
        { 
          error: 'Không thể xóa media',
          details: 'Media này đang được sử dụng ở nơi khác. Vui lòng gỡ bỏ trước khi xóa.'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
