import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

// GET: Fetch all master pricing data
export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [equipment, labor, scoreOptions, categories, variableCosts, assetPrices] = await Promise.all([
      db.equipment.findMany({ orderBy: { category: 'asc' } }),
      db.labor.findMany({ orderBy: { role: 'asc' } }),
      db.developmentScoreOption.findMany({ orderBy: { parameter: 'asc' } }),
      db.developmentCategory.findMany({ orderBy: { minScore: 'asc' } }),
      db.variableCost.findMany({ orderBy: { name: 'asc' } }),
      db.contentAssetPrice.findMany({ orderBy: { category: 'asc' } }),
    ]);

    return NextResponse.json({
      equipment,
      labor,
      scoreOptions,
      categories,
      variableCosts,
      assetPrices,
    });
  } catch (error) {
    console.error('Pricing Master GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch master pricing data' }, { status: 500 });
  }
}

// POST: Update or create master pricing data dynamically
export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, action, data } = body;

    if (!type || !action || !data) {
      return NextResponse.json({ error: 'Type, action, and data are required' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'equipment':
        if (action === 'update') {
          result = await db.equipment.update({
            where: { id: data.id },
            data: {
              name: data.name,
              category: data.category,
              provider: data.provider,
              purchasePrice: Number(data.purchasePrice),
              targetBep: Number(data.targetBep),
              pricePerHour: Number(data.pricePerHour),
            },
          });
        } else if (action === 'create') {
          result = await db.equipment.create({
            data: {
              name: data.name,
              category: data.category,
              provider: data.provider,
              purchasePrice: Number(data.purchasePrice),
              targetBep: Number(data.targetBep),
              pricePerHour: Number(data.pricePerHour),
            },
          });
        } else if (action === 'delete') {
          result = await db.equipment.delete({
            where: { id: data.id },
          });
        }
        break;

      case 'labor':
        if (action === 'update') {
          result = await db.labor.update({
            where: { id: data.id },
            data: {
              role: data.role,
              priceRingan: Number(data.priceRingan),
              priceMenengah: Number(data.priceMenengah),
              priceBesar: Number(data.priceBesar),
              chargeRingan: Number(data.chargeRingan),
              chargeMenengah: Number(data.chargeMenengah),
              chargeBesar: Number(data.chargeBesar),
            },
          });
        } else if (action === 'create') {
          result = await db.labor.create({
            data: {
              role: data.role,
              priceRingan: Number(data.priceRingan),
              priceMenengah: Number(data.priceMenengah),
              priceBesar: Number(data.priceBesar),
              chargeRingan: Number(data.chargeRingan),
              chargeMenengah: Number(data.chargeMenengah),
              chargeBesar: Number(data.chargeBesar),
            },
          });
        } else if (action === 'delete') {
          result = await db.labor.delete({
            where: { id: data.id },
          });
        }
        break;

      case 'category':
        if (action === 'update') {
          result = await db.developmentCategory.update({
            where: { id: data.id },
            data: {
              category: data.category,
              minScore: Number(data.minScore),
              maxScore: Number(data.maxScore),
              pricePerScore: Number(data.pricePerScore),
              profitPercentage: Number(data.profitPercentage),
            },
          });
        }
        break;

      case 'variable':
        if (action === 'update') {
          result = await db.variableCost.update({
            where: { id: data.id },
            data: {
              name: data.name,
              price: Number(data.price),
            },
          });
        }
        break;

      case 'asset':
        if (action === 'update') {
          result = await db.contentAssetPrice.update({
            where: { id: data.id },
            data: {
              name: data.name,
              category: data.category,
              priceMin: Number(data.priceMin),
              priceMax: Number(data.priceMax),
            },
          });
        } else if (action === 'create') {
          result = await db.contentAssetPrice.create({
            data: {
              name: data.name,
              category: data.category,
              priceMin: Number(data.priceMin),
              priceMax: Number(data.priceMax),
            },
          });
        } else if (action === 'delete') {
          result = await db.contentAssetPrice.delete({
            where: { id: data.id },
          });
        }
        break;

      case 'option':
        if (action === 'update') {
          result = await db.developmentScoreOption.update({
            where: { id: data.id },
            data: {
              parameter: data.parameter,
              optionLabel: data.optionLabel,
              score: Number(data.score),
            },
          });
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid master data type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Pricing Master POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update master pricing data' }, { status: 500 });
  }
}
