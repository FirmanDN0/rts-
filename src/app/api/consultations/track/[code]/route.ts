import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public GET: Fetch consultation details by tracking code
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ error: 'Tracking code is required' }, { status: 400 });
    }

    const consultation = await db.consultation.findUnique({
      where: { trackingCode: code.toUpperCase() },
    });

    if (!consultation) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Exclude internal admin notes for client confidentiality
    const clientData = {
      trackingCode: consultation.trackingCode,
      clientName: consultation.clientName,
      serviceType: consultation.serviceType,
      duration: consultation.duration,
      location: consultation.location,
      talent: consultation.talent,
      equipment: consultation.equipment,
      specialRequest: consultation.specialRequest,
      estimatedPriceMin: consultation.estimatedPriceMin,
      estimatedPriceMax: consultation.estimatedPriceMax,
      negotiatedPrice: consultation.negotiatedPrice,
      status: consultation.status,
      createdAt: consultation.createdAt,
    };

    return NextResponse.json(clientData);
  } catch (error) {
    console.error('Track project GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve project status' }, { status: 500 });
  }
}
