import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

// Protected PUT: Update a consultation request (status, price, notes)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, negotiatedPrice, notes } = body;

    const existing = await db.consultation.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    // Validate status if provided
    const validStatuses = ['PENDING', 'REVIEW', 'NEGOTIATION', 'APPROVED', 'COMPLETED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await db.consultation.update({
      where: { id },
      data: {
        status: status !== undefined ? status : existing.status,
        negotiatedPrice: negotiatedPrice !== undefined ? (negotiatedPrice === null ? null : parseFloat(negotiatedPrice)) : existing.negotiatedPrice,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Consultation PUT error:', error);
    return NextResponse.json({ error: 'Failed to update consultation' }, { status: 500 });
  }
}
