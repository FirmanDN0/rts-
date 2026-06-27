import { db } from '../db';

export class VariableCostService {
  /**
   * Fetch all variable costs
   */
  static async getAllVariableCosts() {
    return await db.variableCost.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Calculate variable cost based on location/accommodation
   */
  static async calculateVariableCost(locationName: string) {
    // Check if location contains Sidoarjo
    const isLuarSidoarjo = !locationName.toLowerCase().includes('sidoarjo') || locationName.toLowerCase().includes('luar');
    const targetName = isLuarSidoarjo ? 'Akomodasi Luar Sidoarjo' : 'Akomodasi Sidoarjo';

    const costRecord = await db.variableCost.findUnique({
      where: { name: targetName },
    });

    return {
      name: costRecord?.name || targetName,
      cost: costRecord?.price || (isLuarSidoarjo ? 30000 : 11000),
    };
  }
}
