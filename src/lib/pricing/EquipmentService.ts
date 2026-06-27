import { db } from '../db';

export class EquipmentService {
  /**
   * Fetch all equipment from database
   */
  static async getAllEquipment() {
    return await db.equipment.findMany({
      orderBy: { category: 'asc' },
    });
  }

  /**
   * Get specific equipment by name
   */
  static async getEquipmentByName(name: string) {
    return await db.equipment.findUnique({
      where: { name },
    });
  }

  /**
   * Map packages to their default equipment names
   */
  static getPackageEquipments(packageName: 'Basic' | 'Professional' | 'Custom'): string[] {
    switch (packageName) {
      case 'Basic':
        return ['Kamera ZV-E10', 'Mini Lighting', 'Mic MIXIO T11', 'Tripod Inbex'];
      case 'Professional':
        return ['iPhone 17 Pro', 'Drone DJI', 'Gimbal DJI RS 4 MINI', 'Mini Lighting', 'Mic HOLLY LAND MARK M2'];
      default:
        return [];
    }
  }

  /**
   * Calculate total equipment cost for a given duration
   */
  static async calculateEquipmentCost(
    packageType: 'Basic' | 'Professional' | 'Custom',
    customEquipmentNames: string[],
    durationHours: number
  ) {
    const selectedNames =
      packageType === 'Custom'
        ? customEquipmentNames
        : this.getPackageEquipments(packageType);

    if (selectedNames.length === 0) {
      return {
        totalCost: 0,
        items: [],
      };
    }

    const equipments = await db.equipment.findMany({
      where: {
        name: { in: selectedNames },
      },
    });

    const items = equipments.map((eq) => ({
      name: eq.name,
      category: eq.category,
      pricePerHour: eq.pricePerHour,
      cost: eq.pricePerHour * durationHours,
    }));

    const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

    return {
      totalCost,
      items,
    };
  }
}
