import { db } from '../db';

export class LaborCostService {
  /**
   * Fetch all labor configurations from database
   */
  static async getAllLabor() {
    return await db.labor.findMany({
      orderBy: { role: 'asc' },
    });
  }

  /**
   * Calculate labor cost for selected roles and project complexity category
   */
  static async calculateLaborCost(roles: string[], categoryName: string) {
    if (roles.length === 0) {
      return {
        totalCost: 0,
        items: [],
      };
    }

    const labors = await db.labor.findMany({
      where: {
        role: { in: roles },
      },
    });

    const isMenengah = categoryName.includes('Menengah');
    const isBesar = categoryName.includes('Besar');

    const items = labors.map((lab) => {
      // Determine charge rate based on category
      let rate = lab.chargeRingan;
      let baseRate = lab.priceRingan;

      if (isBesar) {
        rate = lab.chargeBesar;
        baseRate = lab.priceBesar;
      } else if (isMenengah) {
        rate = lab.chargeMenengah;
        baseRate = lab.priceMenengah;
      }

      return {
        role: lab.role,
        baseRate,
        rate, // Client charge includes the 20% markup
      };
    });

    const totalCost = items.reduce((sum, item) => sum + item.rate, 0);

    return {
      totalCost,
      items,
    };
  }
}
