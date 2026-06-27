import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

// Public GET: Fetch all portfolios
export async function GET() {
  try {
    const portfolios = await db.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
  }
}

// Protected POST: Create a new portfolio project
export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, thumbnailUrl, videoUrl, description, category, year, featured } = body;

    // Validation
    if (!title || !thumbnailUrl || !videoUrl || !description || !category || !year) {
      return NextResponse.json(
        { error: 'Title, thumbnail, video URL, description, category, and year are required' },
        { status: 400 }
      );
    }

    const portfolio = await db.portfolio.create({
      data: {
        title,
        thumbnailUrl,
        videoUrl,
        description,
        category,
        year,
        featured: !!featured,
      },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 });
  }
}
