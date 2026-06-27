import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [equipment, labor, scoreOptions, assetPrices] = await Promise.all([
      db.equipment.findMany({
        select: { id: true, name: true, category: true, pricePerHour: true },
        orderBy: { category: 'asc' },
      }),
      db.labor.findMany({
        select: { id: true, role: true },
        orderBy: { role: 'asc' },
      }),
      db.developmentScoreOption.findMany({
        select: { id: true, parameter: true, optionLabel: true, score: true },
        orderBy: { parameter: 'asc' },
      }),
      db.contentAssetPrice.findMany({
        select: { id: true, name: true, category: true, priceMin: true, priceMax: true },
        orderBy: { category: 'asc' },
      }),
    ]);

    return NextResponse.json({
      equipment,
      labor,
      scoreOptions,
      assetPrices,
    });
  } catch (error) {
    console.error('Public Pricing Master GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing options' }, { status: 500 });
  }
}
