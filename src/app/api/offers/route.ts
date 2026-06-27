import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

// Public GET: Fetch active offers/announcements
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    // If requesting all, verify admin session
    if (all) {
      const isAuthorized = await checkAuth(request);
      if (isAuthorized) {
        const offers = await db.offer.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(offers);
      }
    }

    // Default: Return only active offers
    const offers = await db.offer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Offers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

// Protected POST: Create a new offer/announcement
export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, isActive } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const offer = await db.offer.create({
      data: {
        title,
        description,
        imageUrl,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Offers POST error:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
