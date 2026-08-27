import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// Protected PUT: Update a catalog item
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    // @ts-ignore
    const existing = await db.catalogItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Catalog item not found' }, { status: 404 });
    }

    // If image is replaced with a new one, clean up old Cloudinary image
    if (thumbnailUrl && existing.thumbnailUrl && thumbnailUrl !== existing.thumbnailUrl) {
      await deleteFromCloudinary(existing.thumbnailUrl);
    }

    const deliverablesStr =
      deliverables !== undefined
        ? Array.isArray(deliverables)
          ? JSON.stringify(deliverables)
          : typeof deliverables === 'string'
          ? deliverables
          : JSON.stringify([])
        : existing.deliverables;

    const addonsStr =
      addonsJson !== undefined
        ? Array.isArray(addonsJson)
          ? JSON.stringify(addonsJson)
          : typeof addonsJson === 'string'
          ? addonsJson
          : JSON.stringify([])
        : existing.addonsJson;

    // @ts-ignore
    const updated = await db.catalogItem.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug: slug !== undefined ? slug : existing.slug,
        category: category !== undefined ? category : existing.category,
        badge: badge !== undefined ? (badge === '' ? null : badge) : existing.badge,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
        sampleVideoUrl: sampleVideoUrl !== undefined ? (sampleVideoUrl === '' ? null : sampleVideoUrl) : existing.sampleVideoUrl,
        shortDesc: shortDesc !== undefined ? shortDesc : existing.shortDesc,
        fullDesc: fullDesc !== undefined ? fullDesc : existing.fullDesc,
        price: price !== undefined ? parseFloat(price.toString()) : existing.price,
        priceUnit: priceUnit !== undefined ? priceUnit : existing.priceUnit,
        estimatedDays: estimatedDays !== undefined ? estimatedDays : existing.estimatedDays,
        deliverables: deliverablesStr,
        gearSpecs: gearSpecs !== undefined ? gearSpecs : existing.gearSpecs,
        revisions: revisions !== undefined ? revisions : existing.revisions,
        addonsJson: addonsStr,
        isFeatured: isFeatured !== undefined ? !!isFeatured : existing.isFeatured,
        isActive: isActive !== undefined ? !!isActive : existing.isActive,
        order: order !== undefined ? parseInt(order.toString(), 10) : existing.order,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Catalog PUT error:', error);
    return NextResponse.json({ error: 'Failed to update catalog item' }, { status: 500 });
  }
}

// Protected DELETE: Delete a catalog item
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // @ts-ignore
    const existing = await db.catalogItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Catalog item not found' }, { status: 404 });
    }

    // Automatically remove image from Cloudinary
    if (existing.thumbnailUrl) {
      await deleteFromCloudinary(existing.thumbnailUrl);
    }

    // @ts-ignore
    await db.catalogItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Catalog item deleted successfully' });
  } catch (error) {
    console.error('Catalog DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete catalog item' }, { status: 500 });
  }
}
