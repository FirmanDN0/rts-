import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

// Public GET: Fetch all services
export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { basePrice: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// Protected PUT: Update a specific service base cost and description
export async function PUT(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, basePrice, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const existing = await db.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updated = await db.service.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        description: description !== undefined ? description : existing.description,
        basePrice: basePrice !== undefined ? parseFloat(basePrice) : existing.basePrice,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Services PUT error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}
