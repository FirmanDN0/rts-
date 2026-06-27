import { db } from '../db';

export class DevelopmentFeeService {
  /**
   * Fetch all complexity score options
   */
  static async getScoreOptions() {
    return await db.developmentScoreOption.findMany({
      orderBy: { parameter: 'asc' },
    });
  }

  /**
   * Fetch all categories
   */
  static async getCategories() {
    return await db.developmentCategory.findMany({
      orderBy: { minScore: 'asc' },
    });
  }

  /**
   * Calculate project score and map to category
   */
  static async evaluateProjectComplexity(selectedOptionIds: string[]) {
    // Retrieve the score options based on selections
    const options = await db.developmentScoreOption.findMany({
      where: {
        id: { in: selectedOptionIds },
      },
    });

    const totalScore = options.reduce((sum, opt) => sum + opt.score, 0);

    // Fetch categories to find matching one
    const categories = await db.developmentCategory.findMany();
    
    // Find matching category based on score
    // Default to the first category if none match
    let matchedCategory = categories[0];
    
    for (const cat of categories) {
      if (totalScore >= cat.minScore && totalScore <= cat.maxScore) {
        matchedCategory = cat;
        break;
      }
    }

    // In case score is below the minimum category, use Proyek Ringan
    // In case score is above the maximum category, use Proyek Besar
    if (categories.length > 0) {
      const sorted = [...categories].sort((a, b) => a.minScore - b.minScore);
      if (totalScore < sorted[0].minScore) {
        matchedCategory = sorted[0];
      } else if (totalScore > sorted[sorted.length - 1].maxScore) {
        matchedCategory = sorted[sorted.length - 1];
      }
    }

    const developmentFee = totalScore * (matchedCategory?.pricePerScore || 0);

    return {
      totalScore,
      categoryName: matchedCategory?.category || 'Proyek Ringan',
      pricePerScore: matchedCategory?.pricePerScore || 0,
      profitPercentage: matchedCategory?.profitPercentage || 0,
      developmentFee,
      breakdown: options.map(o => ({
        parameter: o.parameter,
        optionLabel: o.optionLabel,
        score: o.score,
      })),
    };
  }
}
