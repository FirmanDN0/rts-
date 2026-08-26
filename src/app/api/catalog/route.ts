import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

// Public GET: Fetch catalog items with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featuredOnly = searchParams.get('featured') === 'true';
    const all = searchParams.get('all') === 'true'; // For admin to view inactive items too

    const where: any = {};

    if (!all) {
      where.isActive = true;
    }

    if (category && category !== 'All' && category !== 'Semua') {
      where.category = category;
    }

    if (featuredOnly) {
      where.isFeatured = true;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
        { fullDesc: { contains: search, mode: 'insensitive' } },
        { deliverables: { contains: search, mode: 'insensitive' } },
        { gearSpecs: { contains: search, mode: 'insensitive' } },
      ];
    }

    // @ts-ignore
    const items = await db.catalogItem.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Catalog GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch catalog items' }, { status: 500 });
  }
}

// Protected POST: Create a new catalog item
export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      category,
      badge,
      thumbnailUrl,
      sampleVideoUrl,
      shortDesc,
      fullDesc,
      price,
      priceUnit,
      estimatedDays,
      deliverables,
      gearSpecs,
      revisions,
      addonsJson,
      isFeatured,
      isActive,
      order,
    } = body;

    // Validation
    if (!title || !thumbnailUrl || !shortDesc || !fullDesc || price === undefined || !category) {
      return NextResponse.json(
        { error: 'Title, category, thumbnail, short desc, full desc, and price are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const safeSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    // Format deliverables as JSON string if array
    const deliverablesStr = Array.isArray(deliverables)
      ? JSON.stringify(deliverables)
      : typeof deliverables === 'string'
      ? deliverables
      : JSON.stringify([]);

    // Format addons as JSON string if array
    const addonsStr = Array.isArray(addonsJson)
      ? JSON.stringify(addonsJson)
      : typeof addonsJson === 'string'
      ? addonsJson
      : JSON.stringify([]);

    // @ts-ignore
    const newItem = await db.catalogItem.create({
      data: {
        title,
        slug: safeSlug,
        category,
        badge: badge || null,
        thumbnailUrl,
        sampleVideoUrl: sampleVideoUrl || null,
        shortDesc,
        fullDesc,
        price: parseFloat(price.toString()),
        priceUnit: priceUnit || 'per project',
        estimatedDays: estimatedDays || '5 - 7 Hari Kerja',
        deliverables: deliverablesStr,
        gearSpecs: gearSpecs || null,
        revisions: revisions || '2x Revisi Mayor',
        addonsJson: addonsStr,
        isFeatured: isFeatured !== undefined ? !!isFeatured : false,
        isActive: isActive !== undefined ? !!isActive : true,
        order: order !== undefined ? parseInt(order.toString(), 10) : 0,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Catalog POST error:', error);
    return NextResponse.json({ error: 'Failed to create catalog item' }, { status: 500 });
  }
}
