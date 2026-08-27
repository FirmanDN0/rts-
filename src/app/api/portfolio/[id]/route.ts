import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// Protected PUT: Update a portfolio project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, thumbnailUrl, videoUrl, description, category, year, featured } = body;

    // Check if portfolio exists
    const existing = await db.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // If image was replaced with a new one, clean up old Cloudinary image
    if (thumbnailUrl && existing.thumbnailUrl && thumbnailUrl !== existing.thumbnailUrl) {
      await deleteFromCloudinary(existing.thumbnailUrl);
    }

    const updated = await db.portfolio.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        description: description !== undefined ? description : existing.description,
        category: category !== undefined ? category : existing.category,
        year: year !== undefined ? year : existing.year,
        featured: featured !== undefined ? !!featured : existing.featured,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Portfolio PUT error:', error);
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
  }
}

// Protected DELETE: Delete a portfolio project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Automatically remove image from Cloudinary
    if (existing.thumbnailUrl) {
      await deleteFromCloudinary(existing.thumbnailUrl);
    }

    await db.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Portfolio DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 });
  }
}
