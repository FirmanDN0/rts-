import { db } from '../db';

export class AssetPricingService {
  /**
   * Fetch all content asset prices
   */
  static async getAllAssetPrices() {
    return await db.contentAssetPrice.findMany({
      orderBy: { category: 'asc' },
    });
  }

  /**
   * Calculate Content Asset Cost based on name and quantity
   */
  static async calculateAssetCost(assetName: string, quantity: number) {
    const asset = await db.contentAssetPrice.findUnique({
      where: { name: assetName },
    });

    if (!asset) {
      throw new Error(`Asset type not found: ${assetName}`);
    }

    const totalMin = asset.priceMin * quantity;
    const totalMax = asset.priceMax * quantity;

    return {
      assetName: asset.name,
      category: asset.category,
      priceMin: asset.priceMin,
      priceMax: asset.priceMax,
      quantity,
      totalMin,
      totalMax,
    };
  }
}
