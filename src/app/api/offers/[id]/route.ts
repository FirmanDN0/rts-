import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

// Protected PUT: Update an offer
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, imageUrl, isActive } = body;

    const existing = await db.offer.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    const updated = await db.offer.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        isActive: isActive !== undefined ? !!isActive : existing.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Offers PUT error:', error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

// Protected DELETE: Delete an offer
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.offer.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    await db.offer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Offers DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
