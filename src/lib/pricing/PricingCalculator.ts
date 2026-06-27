import { EquipmentService } from './EquipmentService';
import { LaborCostService } from './LaborCostService';
import { DevelopmentFeeService } from './DevelopmentFeeService';
import { VariableCostService } from './VariableCostService';
import { AssetPricingService } from './AssetPricingService';

export interface CreativeProductionInput {
  serviceRole: 'Videographer' | 'Photographer' | 'Editor';
  productionType: string;
  packageType: 'Basic' | 'Professional' | 'Custom';
  customEquipmentNames?: string[];
  durationHours: number;
  selectedOptionIds: string[];
  laborRoles: string[];
  location: string;
}

export interface ContentAssetInput {
  assetName: string;
  quantity: number;
}

export class PricingCalculator {
  /**
   * Calculate pricing for Creative Production (CP)
   */
  static async calculateCreativeProduction(input: CreativeProductionInput) {
    const isEditor = input.serviceRole === 'Editor';

    // 1. Calculate Equipment / Fixed Cost (skipped for Editor)
    const durationHours = input.durationHours || 1;
    const equipmentResult = isEditor
      ? { totalCost: 0, items: [] }
      : await EquipmentService.calculateEquipmentCost(
          input.packageType,
          input.customEquipmentNames || [],
          durationHours
        );

    // 2. Evaluate Development Fee & Complexity Category
    const complexityResult = await DevelopmentFeeService.evaluateProjectComplexity(
      input.selectedOptionIds
    );

    // 3. Calculate Labor Cost
    // We add the primary serviceRole itself to labor if not already present
    const allLaborRoles = [...input.laborRoles];
    if (input.serviceRole === 'Videographer' && !allLaborRoles.includes('Videografer')) {
      allLaborRoles.push('Videografer');
    } else if (input.serviceRole === 'Photographer' && !allLaborRoles.includes('Fotografer')) {
      allLaborRoles.push('Fotografer');
    } else if (input.serviceRole === 'Editor' && !allLaborRoles.includes('Editor')) {
      allLaborRoles.push('Editor');
    }
    
    const laborResult = await LaborCostService.calculateLaborCost(
      allLaborRoles,
      complexityResult.categoryName
    );

    // 4. Calculate Variable Cost (skipped for Editor)
    const variableResult = isEditor
      ? { name: 'N/A (Editor)', cost: 0 }
      : await VariableCostService.calculateVariableCost(input.location);

    // 5. Total Sums
    const fixedCost = equipmentResult.totalCost;
    const devFee = complexityResult.developmentFee;
    const laborCost = laborResult.totalCost;
    const variableCost = variableResult.cost;

    const subtotal = fixedCost + devFee + laborCost + variableCost;

    // 6. Profit Markup
    const profitMarkup = subtotal * complexityResult.profitPercentage;
    const finalMin = subtotal + profitMarkup;

    // Output range: Max is Min * 1.3 (+30% buffer range)
    const finalMax = finalMin * 1.3;

    // Round to nearest Rp 10.000 for client-friendly presentation
    const roundedMin = Math.round(finalMin / 10000) * 10000;
    const roundedMax = Math.round(finalMax / 10000) * 10000;

    return {
      category: complexityResult.categoryName,
      score: complexityResult.totalScore,
      breakdown: {
        fixedCost,
        developmentFee: devFee,
        laborCost,
        variableCost,
        subtotal,
        profitPercentage: complexityResult.profitPercentage,
        profitMarkup,
        estimatedMin: finalMin,
        estimatedMax: finalMax,
      },
      equipmentItems: equipmentResult.items,
      complexityBreakdown: complexityResult.breakdown,
      laborItems: laborResult.items,
      variableCostDetails: variableResult,
      estimatedPriceMin: roundedMin,
      estimatedPriceMax: roundedMax,
    };
  }

  /**
   * Calculate pricing for Content Asset (CA)
   */
  static async calculateContentAsset(input: ContentAssetInput) {
    const result = await AssetPricingService.calculateAssetCost(
      input.assetName,
      input.quantity
    );

    // Round to nearest Rp 10.000 for client-friendly presentation
    const roundedMin = Math.round(result.totalMin / 10000) * 10000;
    const roundedMax = Math.round(result.totalMax / 10000) * 10000;

    return {
      category: result.category,
      assetName: result.assetName,
      quantity: result.quantity,
      priceMin: result.priceMin,
      priceMax: result.priceMax,
      estimatedPriceMin: roundedMin || result.totalMin,
      estimatedPriceMax: roundedMax || result.totalMax,
      breakdown: {
        estimatedMin: result.totalMin,
        estimatedMax: result.totalMax,
      }
    };
  }
}
