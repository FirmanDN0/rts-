  import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';
import { calculateEstimate, CalculatorInputs } from '@/lib/calculator';
import { PricingCalculator } from '@/lib/pricing/PricingCalculator';
import { AiPricingEngine } from '@/lib/pricing/AiPricingEngine';

// Helper to generate a unique tracking code
async function generateTrackingCode(): Promise<string> {
  const year = new Date().getFullYear();
  let code = '';
  let exists = true;

  while (exists) {
    // Generate a 4-character alphanumeric string (e.g. X84B)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // excluded easily confused characters like O, 0, I, 1
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `RTS-${year}-${suffix}`;

    // Verify uniqueness
    const record = await db.consultation.findUnique({
      where: { trackingCode: code },
    });
    if (!record) {
      exists = false;
    }
  }

  return code;
}

// Protected GET: Fetch all consultations
export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const consultations = await db.consultation.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Consultation GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}

// Public POST: Submit a new consultation request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientWhatsapp,
      clientEmail,
      specialRequest,
      consultationType, // 'CP', 'CA', or undefined (legacy)
      aiPrompt, // optional string for AI pricing engine
    } = body;

    // Validation
    if (!clientName || !clientWhatsapp) {
      return NextResponse.json(
        { error: 'Name and WhatsApp number are required' },
        { status: 400 }
      );
    }

    let estimatedPriceMin = 0;
    let estimatedPriceMax = 0;
    let serviceType = '';
    let duration = '';
    let location = '';
    let talent = false;
    let equipment = false;
    let serviceRole: string | null = null;
    let productionType: string | null = null;
    let durationHours: number | null = null;
    let optionsJson: string | null = null;
    let calculationJson: string | null = null;
    let aiAnalysisResult: any = null;

    if (aiPrompt) {
      // 1. AI Pricing Engine Path
      const aiResult = await AiPricingEngine.parseAndCalculate(aiPrompt);
      aiAnalysisResult = aiResult.aiAnalysis;
      
      serviceType = aiResult.parsedInputs.serviceRole;
      duration = `${aiResult.parsedInputs.durationHours} Jam`;
      location = aiResult.parsedInputs.location;
      talent = aiResult.parsedInputs.laborRoles.includes('Talent Internal') || aiResult.parsedInputs.laborRoles.includes('Talent External');
      equipment = aiResult.parsedInputs.packageType !== 'Custom' || !!(aiResult.parsedInputs.customEquipmentNames && aiResult.parsedInputs.customEquipmentNames.length > 0);
      
      estimatedPriceMin = aiResult.pricing.estimatedPriceMin;
      estimatedPriceMax = aiResult.pricing.estimatedPriceMax;

      serviceRole = aiResult.parsedInputs.serviceRole;
      productionType = aiResult.parsedInputs.productionType;
      durationHours = aiResult.parsedInputs.durationHours;
      
      optionsJson = JSON.stringify(aiResult.parsedInputs);
      calculationJson = JSON.stringify({
        ...aiResult.pricing,
        aiAnalysis: aiResult.aiAnalysis,
      });

    } else if (consultationType === 'CP') {
      // 2. Creative Production (CP) Path
      const {
        serviceRole: cpRole,
        productionType: cpProdType,
        packageType,
        customEquipmentNames,
        durationHours: cpHours,
        selectedOptionIds,
        laborRoles,
        location: cpLocation,
      } = body;

      if (!cpRole || !cpProdType || !cpLocation) {
        return NextResponse.json(
          { error: 'Role, production type, and location are required for CP' },
          { status: 400 }
        );
      }

      const calculation = await PricingCalculator.calculateCreativeProduction({
        serviceRole: cpRole,
        productionType: cpProdType,
        packageType,
        customEquipmentNames,
        durationHours: Number(cpHours || 1),
        selectedOptionIds: selectedOptionIds || [],
        laborRoles: laborRoles || [],
        location: cpLocation,
      });

      serviceType = cpRole;
      duration = `${cpHours} Jam`;
      location = cpLocation;
      talent = laborRoles?.includes('Talent Internal') || laborRoles?.includes('Talent External') || false;
      equipment = packageType !== 'Custom' || (customEquipmentNames && customEquipmentNames.length > 0);

      estimatedPriceMin = calculation.estimatedPriceMin;
      estimatedPriceMax = calculation.estimatedPriceMax;

      serviceRole = cpRole;
      productionType = cpProdType;
      durationHours = Number(cpHours);
      optionsJson = JSON.stringify({ selectedOptionIds, laborRoles, customEquipmentNames, packageType });
      calculationJson = JSON.stringify(calculation);

    } else if (consultationType === 'CA') {
      // 3. Content Asset (CA) Path
      const { assetName, quantity } = body;

      if (!assetName || !quantity) {
        return NextResponse.json(
          { error: 'Asset name and quantity are required for CA' },
          { status: 400 }
        );
      }

      const calculation = await PricingCalculator.calculateContentAsset({
        assetName,
        quantity: Number(quantity),
      });

      serviceType = 'Content Asset';
      duration = `${quantity} Asset`;
      location = 'N/A (Digital Asset)';
      talent = false;
      equipment = false;

      estimatedPriceMin = calculation.estimatedPriceMin;
      estimatedPriceMax = calculation.estimatedPriceMax;

      productionType = assetName;
      durationHours = null;
      optionsJson = JSON.stringify({ assetName, quantity });
      calculationJson = JSON.stringify(calculation);

    } else {
      // 4. Legacy Path (Fallback to prevent breaking existing code)
      const {
        serviceType: legacyServiceType,
        duration: legacyDuration,
        location: legacyLocation,
        talent: legacyTalent,
        equipment: legacyEquipment,
      } = body;

      if (!legacyServiceType || !legacyDuration || !legacyLocation) {
        return NextResponse.json(
          { error: 'Service type, duration, and location are required' },
          { status: 400 }
        );
      }

      const inputs: CalculatorInputs = {
        serviceType: legacyServiceType,
        duration: legacyDuration,
        location: legacyLocation,
        talent: !!legacyTalent,
        equipment: !!legacyEquipment,
      };

      const estimate = calculateEstimate(inputs);

      // Fetch base price check
      const dbService = await db.service.findFirst({
        where: { name: { contains: legacyServiceType } },
      });

      if (dbService) {
        const defaultBase = legacyServiceType === 'Animation' ? 7000000 : legacyServiceType === 'Film Production' ? 5000000 : 4000000;
        const scale = dbService.basePrice / defaultBase;
        estimate.minPrice = estimate.minPrice * scale;
        estimate.maxPrice = estimate.maxPrice * scale;
      }

      serviceType = legacyServiceType;
      duration = legacyDuration;
      location = legacyLocation;
      talent = !!legacyTalent;
      equipment = !!legacyEquipment;
      estimatedPriceMin = estimate.minPrice;
      estimatedPriceMax = estimate.maxPrice;
    }

    const trackingCode = await generateTrackingCode();

    const newConsultation = await db.consultation.create({
      data: {
        trackingCode,
        clientName,
        clientWhatsapp,
        clientEmail: clientEmail || null,
        serviceType,
        duration,
        location,
        talent,
        equipment,
        specialRequest: specialRequest || null,
        estimatedPriceMin,
        estimatedPriceMax,
        status: 'PENDING',
        consultationType: consultationType || (aiPrompt ? 'AI' : null),
        serviceRole,
        productionType,
        durationHours,
        optionsJson,
        calculationJson,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully',
      trackingCode,
      consultation: newConsultation,
      aiAnalysis: aiAnalysisResult,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Consultation POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit consultation request' }, { status: 500 });
  }
}
