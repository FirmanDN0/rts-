import { PricingCalculator, CreativeProductionInput } from './PricingCalculator';
import { db } from '../db';

export class AiPricingEngine {
  /**
   * Parse a natural language prompt and calculate estimated pricing
   */
  static async parseAndCalculate(prompt: string) {
    const text = prompt.toLowerCase();
    
    // Default fallback values
    let serviceRole: 'Videographer' | 'Photographer' | 'Editor' = 'Videographer';
    let productionType = 'Company Profile';
    let packageType: 'Basic' | 'Professional' | 'Custom' = 'Basic';
    let durationHours = 8; // Default 1 shoot day (8 hours)
    let location = 'Sidoarjo';
    const laborRoles: string[] = [];
    const customEquipmentNames: string[] = [];

    // 1. Detect service role
    if (text.includes('foto') || text.includes('photo') || text.includes('kamera')) {
      serviceRole = 'Photographer';
      productionType = 'Photographer Session';
    }
    if (text.includes('edit') || text.includes('potong video') || text.includes('post-production')) {
      serviceRole = 'Editor';
      productionType = 'Editing Service';
    }
    if (text.includes('video') || text.includes('film') || text.includes('commercial') || text.includes('cinematic')) {
      serviceRole = 'Videographer';
      productionType = 'Commercial Video';
    }

    // Refine production type
    if (text.includes('company profile') || text.includes('profil perusahaan')) {
      productionType = 'Company Profile';
    } else if (text.includes('event') || text.includes('dokumentasi') || text.includes('acara')) {
      productionType = 'Dokumentasi Event';
    } else if (text.includes('social media') || text.includes('sosmed') || text.includes('reels') || text.includes('tiktok') || text.includes('instagram')) {
      productionType = 'Social Media Content';
    } else if (text.includes('iklan') || text.includes('promosi') || text.includes('commercial')) {
      productionType = 'Commercial Video';
    } else if (text.includes('animasi') || text.includes('animation') || text.includes('motion')) {
      productionType = 'Animation';
    }

    // 2. Detect location
    if (text.includes('luar sidoarjo') || text.includes('surabaya') || text.includes('gresik') || text.includes('jakarta') || text.includes('luar kota')) {
      location = 'Luar Sidoarjo';
    } else if (text.includes('sidoarjo') || text.includes('rts') || text.includes('studio')) {
      location = 'Sidoarjo';
    }

    // 3. Detect duration/hours
    if (text.includes('cepat') || text.includes('3 jam') || text.includes('4 jam') || text.includes('5 jam')) {
      durationHours = 4;
    } else if (text.includes('seharian') || text.includes('8 jam') || text.includes('12 jam') || text.includes('1 hari')) {
      durationHours = 10;
    } else if (text.includes('2 hari') || text.includes('24 jam') || text.includes('menginap') || text.includes('kompleks')) {
      durationHours = 20;
    } else if (text.includes('3 hari') || text.includes('lebih dari 24 jam')) {
      durationHours = 30;
    }

    // 4. Detect equipment keywords
    const dbEquipment = await db.equipment.findMany();
    let hasCustomEquipment = false;
    for (const eq of dbEquipment) {
      // check keywords
      const eqKeyword = eq.name.toLowerCase();
      if (text.includes(eqKeyword) || (eq.category === 'Drone' && text.includes('drone')) || (eq.category === 'Gimbal' && text.includes('gimbal')) || (eq.category === 'Mic' && text.includes('mic') || text.includes('audio'))) {
        customEquipmentNames.push(eq.name);
        hasCustomEquipment = true;
      }
    }

    if (hasCustomEquipment) {
      packageType = 'Custom';
    } else if (text.includes('profesional') || text.includes('pro') || text.includes('premium') || text.includes('drone')) {
      packageType = 'Professional';
    } else {
      packageType = 'Basic';
    }

    // 5. Detect extra crew / labor roles
    const dbLabor = await db.labor.findMany();
    for (const lab of dbLabor) {
      const roleKeyword = lab.role.toLowerCase();
      if (text.includes(roleKeyword) && roleKeyword !== serviceRole.toLowerCase()) {
        laborRoles.push(lab.role);
      }
    }

    // If editor or animator is mentioned
    if (text.includes('animator') || text.includes('animasi')) {
      if (!laborRoles.includes('Animator')) laborRoles.push('Animator');
    }
    if (text.includes('editor') || text.includes('editing')) {
      if (!laborRoles.includes('Editor')) laborRoles.push('Editor');
    }
    if (text.includes('talent') || text.includes('aktor') || text.includes('model')) {
      if (!laborRoles.includes('Talent Internal')) laborRoles.push('Talent Internal');
    }

    // 6. Map options to development score options based on parsed characteristics
    // We select typical option IDs from database
    const dbOptions = await db.developmentScoreOption.findMany();
    const selectedOptionIds: string[] = [];

    // Helper to find and push options
    const addOption = (param: string, labelKeyword: string) => {
      const match = dbOptions.find(
        o => o.parameter === param && o.optionLabel.toLowerCase().includes(labelKeyword)
      );
      if (match) selectedOptionIds.push(match.id);
    };

    // Duration mapping
    if (durationHours < 12) {
      addOption('Durasi Proyek', '< 12 jam');
    } else if (durationHours <= 24) {
      addOption('Durasi Proyek', '12 - 24 jam');
    } else {
      addOption('Durasi Proyek', '> 24 jam');
    }

    // Output number
    if (text.includes('banyak output') || text.includes('beberapa video') || text.includes('3 output')) {
      addOption('Jumlah Output', '> 2 output');
    } else if (text.includes('2 output') || text.includes('2 video')) {
      addOption('Jumlah Output', '2 output');
    } else {
      addOption('Jumlah Output', '1 output');
    }

    // Output duration
    if (text.includes('durasi panjang') || text.includes('long form') || text.includes('10 menit') || text.includes('5 menit')) {
      addOption('Durasi Output', '> 3 menit');
    } else if (text.includes('2 menit') || text.includes('3 menit')) {
      addOption('Durasi Output', '2-3 menit');
    } else {
      addOption('Durasi Output', '1-2 menit');
    }

    // Concept complexity
    if (text.includes('riset') || text.includes('naratif') || text.includes('storyboard') || text.includes('konsep matang')) {
      addOption('Kompleksitas Konsep', 'konsep naratif');
    } else if (text.includes('storyline') || text.includes('visual plan') || text.includes('naskah')) {
      addOption('Kompleksitas Konsep', 'storyline');
    } else {
      addOption('Kompleksitas Konsep', 'simple/informatif');
    }

    // Crew count
    const totalCrewNeeded = 1 + laborRoles.length;
    if (totalCrewNeeded <= 2) {
      addOption('Kebutuhan Crew', '1-2 orang');
    } else if (totalCrewNeeded <= 4) {
      addOption('Kebutuhan Crew', '3-4 orang');
    } else {
      addOption('Kebutuhan Crew', '> 4 orang');
    }

    // Technical level (amount of gear)
    const gearCount = packageType === 'Professional' ? 5 : packageType === 'Basic' ? 4 : customEquipmentNames.length;
    if (gearCount <= 3) {
      addOption('Tingkat Teknis', '1-3 alat');
    } else if (gearCount <= 4) {
      addOption('Tingkat Teknis', '3-4 alat');
    } else {
      addOption('Tingkat Teknis', '> 4 alat');
    }

    // Location obstacles
    if (location === 'Luar Sidoarjo' || text.includes('multi lokasi') || text.includes('berpindah')) {
      addOption('Rintangan Lokasi', 'beberapa lokasi');
    } else {
      addOption('Rintangan Lokasi', '1 lokasi');
    }

    // Deadline pressure
    if (text.includes('cepat') || text.includes('mendesak') || text.includes('urgen') || text.includes('minggu ini')) {
      addOption('Tekanan Deadline', '< 7 hari');
    } else if (text.includes('minggu depan') || text.includes('10 hari')) {
      addOption('Tekanan Deadline', '7-14 hari');
    } else {
      addOption('Tekanan Deadline', '> 14 hari');
    }

    // Persons in video
    if (text.includes('banyak orang') || text.includes('keramaian') || text.includes('orang banyak')) {
      addOption('Person', '> 50 orang');
    } else if (text.includes('tim') || text.includes('karyawan') || text.includes('beberapa orang')) {
      addOption('Person', '20-50 orang');
    } else {
      addOption('Person', '1-20 orang');
    }

    // Construct CP inputs
    const cpInput: CreativeProductionInput = {
      serviceRole,
      productionType,
      packageType,
      customEquipmentNames,
      durationHours,
      selectedOptionIds,
      laborRoles,
      location,
    };

    // Calculate CP using calculator
    const calculation = await PricingCalculator.calculateCreativeProduction(cpInput);

    return {
      aiAnalysis: {
        detectedRole: serviceRole,
        detectedType: productionType,
        detectedPackage: packageType,
        detectedLocation: location,
        detectedDuration: `${durationHours} jam`,
        detectedLabor: laborRoles,
        detectedEquipment: customEquipmentNames,
        confidenceScore: 0.92,
        explanation: `AI menganalisis kebutuhan Anda untuk proyek "${productionType}" dengan durasi shooting sekitar ${durationHours} jam di ${location}. Menggunakan paket alat "${packageType}" dan tambahan kru: ${laborRoles.join(', ') || 'tidak ada'}. Proyek Anda dikategorikan sebagai "${calculation.category}" dengan total score kompleksitas ${calculation.score}.`,
      },
      parsedInputs: cpInput,
      pricing: calculation,
    };
  }
}
