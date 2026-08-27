import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Load .env manually for standalone script execution
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        process.env[match[1]] = value;
      }
    });
  }
} catch (e) {}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPasswordHash,
    },
  });
  console.log(`Admin user created/updated: ${admin.username}`);

  // 2. Create Services
  const servicesData = [
    {
      name: 'Film Production',
      description: 'Membantu produksi film, dokumenter, commercial, hingga aftermovie mulai dari konsep scriptwriting, shooting, hingga editing dan color grading.',
      basePrice: 5000000,
      imageUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787791652/rts/services/service_film_production.jpg',
    },
    {
      name: 'Animation',
      description: 'Pembuatan animasi 2D & 3D premium untuk kebutuhan promosi, storytelling, visual campaign, mascot design, dan explainer video.',
      basePrice: 7000000,
      imageUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792149/rts/services/service_animation.jpg',
    },
    {
      name: 'Creative Visual',
      description: 'Pembuatan motion graphic, branding visual, design material media sosial, asset 3D, digital imaging, dan kebutuhan asset digital lainnya.',
      basePrice: 4000000,
      imageUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792150/rts/services/service_creative_visual.jpg',
    },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data: s });
    } else {
      await prisma.service.create({ data: s });
    }
  }
  console.log('Services seeded successfully.');

  // 3. Create Portfolios
  const portfoliosData = [
    {
      title: 'Ethereal Silence — Cinematic Short Film',
      category: 'Film Production',
      year: '2025',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792151/rts/portfolio/portfolio_ethereal_silence___cinematic_s.jpg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
      description: 'Sebuah film pendek sinematik bernuansa puitis yang mengeksplorasi hubungan manusia dengan alam bebas. Diproduksi dengan kamera bersensor anamorphic.',
      featured: true,
    },
    {
      title: 'Neon Odyssey — 3D Cyberpunk Trailer',
      category: 'Animation',
      year: '2026',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792152/rts/portfolio/portfolio_neon_odyssey___3d_cyberpunk_tr.jpg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-flying-abstract-spheres-31915-large.mp4',
      description: 'Trailer animasi 3D cyberpunk futuristik yang menampilkan visualisasi kota metropolitan masa depan dengan neon glow, cybernetic assets, dan fast-paced editing.',
      featured: true,
    },
    {
      title: 'Metamorphosis — Dynamic Brand Motion',
      category: 'Motion Graphic',
      year: '2025',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792154/rts/portfolio/portfolio_metamorphosis___dynamic_brand_.jpg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-design-animation-of-colorful-shapes-31908-large.mp4',
      description: 'Motion graphic promosi untuk peluncuran brand teknologi modern, menggabungkan shape animation, typographic kinetic text, dan color palette dinamis.',
      featured: true,
    },
    {
      title: 'Lumina Digital — Interactive Visual Art',
      category: 'Creative Visual',
      year: '2026',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792156/rts/portfolio/portfolio_lumina_digital___interactive_v.jpg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-colorful-laser-lights-background-43093-large.mp4',
      description: 'Project branding visual interaktif yang menggabungkan elemen 3D rendering dan digital painting abstrak untuk pameran seni kontemporer.',
      featured: false,
    },
    {
      title: 'The Silent Path — Commercial Brand Film',
      category: 'Film Production',
      year: '2026',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792157/rts/portfolio/portfolio_the_silent_path___commercial_b.jpg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-on-a-forest-path-41662-large.mp4',
      description: 'Iklan komersial bertema petualangan outdoor untuk brand pakaian gunung internasional. Berfokus pada keindahan lanskap pegunungan berkabut.',
      featured: false,
    },
  ];

  for (const p of portfoliosData) {
    const existing = await prisma.portfolio.findFirst({ where: { title: p.title } });
    if (existing) {
      await prisma.portfolio.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.portfolio.create({ data: p });
    }
  }
  console.log('Portfolios seeded successfully.');

  // 4. Create Mock Offers
  const offersData = [
    {
      title: 'Open Collaboration Project 2026',
      description: 'Kami membuka kesempatan kolaborasi bagi kreator lokal, sutradara independen, dan produser musik untuk memproduksi karya bersama RTS. Submit portofoliomu sekarang!',
      isActive: true,
    },
    {
      title: 'Paket Cinematic Commercial Promo',
      description: 'Diskon 15% untuk produksi film komersial produk (social media campaign) selama bulan Juni dan Juli 2026. Lengkap dengan talent, lighting set, dan social media format.',
      isActive: true,
    },
  ];

  for (const o of offersData) {
    const existing = await prisma.offer.findFirst({ where: { title: o.title } });
    if (existing) {
      await prisma.offer.update({ where: { id: existing.id }, data: o });
    } else {
      await prisma.offer.create({ data: o });
    }
  }
  console.log('Offers seeded successfully.');

  // 5. Create Mock Consultations for Analytics Graph
  const consultationsData = [
    {
      trackingCode: 'RTS-2026-X84B',
      clientName: 'Budi Santoso',
      clientWhatsapp: '081234567890',
      clientEmail: 'budi@gmail.com',
      serviceType: 'Animation',
      duration: 'Normal',
      location: 'Studio RTS',
      talent: false,
      equipment: true,
      specialRequest: 'Butuh tambahan sound design orisinil dan dubber bahasa Inggris.',
      estimatedPriceMin: 9000000,
      estimatedPriceMax: 11700000,
      negotiatedPrice: 10500000,
      status: 'APPROVED',
      notes: 'Client setuju dengan penyesuaian harga dan tambahan equipment. Produksi dimulai minggu depan.',
      createdAt: new Date('2026-06-15T10:00:00Z'),
    },
    {
      trackingCode: 'RTS-2026-W39M',
      clientName: 'Siti Rahma',
      clientWhatsapp: '082345678901',
      clientEmail: 'siti.rahma@enterprise.co.id',
      serviceType: 'Film Production',
      duration: 'Kompleks',
      location: 'Luar kota',
      talent: true,
      equipment: true,
      specialRequest: 'Shooting video profil perusahaan berlokasi di tambang batu bara Kalimantan.',
      estimatedPriceMin: 15000000,
      estimatedPriceMax: 19500000,
      negotiatedPrice: 18000000,
      status: 'NEGOTIATION',
      notes: 'Sedang bernegosiasi terkait akomodasi kru di lokasi tambang.',
      createdAt: new Date('2026-06-20T14:30:00Z'),
    },
    {
      trackingCode: 'RTS-2026-T19Y',
      clientName: 'Rian Wijaya',
      clientWhatsapp: '083456789012',
      clientEmail: 'rian@visualcreative.id',
      serviceType: 'Creative Visual',
      duration: 'Singkat',
      location: 'Studio RTS',
      talent: false,
      equipment: false,
      specialRequest: 'Motion graphic kinetic typography untuk rilis produk baru (3 varian durasi).',
      estimatedPriceMin: 4000000,
      estimatedPriceMax: 5200000,
      negotiatedPrice: 4500000,
      status: 'PENDING',
      notes: 'Formulir konsultasi baru masuk via web.',
      createdAt: new Date('2026-06-22T09:15:00Z'),
    },
    {
      trackingCode: 'RTS-2026-K71P',
      clientName: 'Dina Lestari',
      clientWhatsapp: '084567890123',
      clientEmail: 'dina@eventorganizer.com',
      serviceType: 'Film Production',
      duration: 'Normal',
      location: 'Dalam kota',
      talent: false,
      equipment: true,
      specialRequest: 'Dokumentasi aftermovie konser jazz 2 hari.',
      estimatedPriceMin: 8000000,
      estimatedPriceMax: 10400000,
      negotiatedPrice: 8500000,
      status: 'APPROVED',
      notes: 'DP 50% sudah diterima.',
      createdAt: new Date('2026-05-10T16:00:00Z'),
    },
    {
      trackingCode: 'RTS-2026-M42Q',
      clientName: 'Hendra Gunawan',
      clientWhatsapp: '085678901234',
      clientEmail: 'hendra@techstartup.io',
      serviceType: 'Animation',
      duration: 'Kompleks',
      location: 'Studio RTS',
      talent: false,
      equipment: false,
      specialRequest: 'Animasi 3D explain video fitur aplikasi fintech.',
      estimatedPriceMin: 12000000,
      estimatedPriceMax: 15600000,
      negotiatedPrice: 13500000,
      status: 'APPROVED',
      notes: 'Sedang proses storyboard render.',
      createdAt: new Date('2026-05-24T11:20:00Z'),
    },
    {
      trackingCode: 'RTS-2026-L88R',
      clientName: 'Maya Kusuma',
      clientWhatsapp: '086789012345',
      clientEmail: 'maya@culinarybrand.com',
      serviceType: 'Creative Visual',
      duration: 'Normal',
      location: 'Studio RTS',
      talent: true,
      equipment: true,
      specialRequest: 'Foto produk makanan dan reel menu baru 10 items.',
      estimatedPriceMin: 6000000,
      estimatedPriceMax: 7800000,
      negotiatedPrice: 6000000,
      status: 'COMPLETED',
      notes: 'Final render sudah di-deliver ke klien via Google Drive.',
      createdAt: new Date('2026-04-12T13:45:00Z'),
    },
    {
      trackingCode: 'RTS-2026-N23S',
      clientName: 'Farhan Pratama',
      clientWhatsapp: '087890123456',
      clientEmail: 'farhan@automotive.id',
      serviceType: 'Film Production',
      duration: 'Kompleks',
      location: 'Luar kota',
      talent: true,
      equipment: true,
      specialRequest: 'TV Commercial peluncuran motor sport baru.',
      estimatedPriceMin: 20000000,
      estimatedPriceMax: 26000000,
      negotiatedPrice: 22500000,
      status: 'COMPLETED',
      notes: 'Klien sangat puas, project closing invoice lunas.',
      createdAt: new Date('2026-04-28T15:10:00Z'),
    },
    {
      trackingCode: 'RTS-2026-P55T',
      clientName: 'Agus Setiawan',
      clientWhatsapp: '088901234567',
      clientEmail: 'agus@govagency.go.id',
      serviceType: 'Animation',
      duration: 'Normal',
      location: 'Studio RTS',
      talent: false,
      equipment: false,
      specialRequest: 'Iklan layanan masyarakat animasi 2D tentang kesehatan.',
      estimatedPriceMin: 7000000,
      estimatedPriceMax: 9100000,
      negotiatedPrice: 7500000,
      status: 'COMPLETED',
      notes: 'Laporan pertanggungjawaban selesai.',
      createdAt: new Date('2026-03-05T09:00:00Z'),
    },
    {
      trackingCode: 'RTS-2026-J02L',
      clientName: 'Julia Robert',
      clientWhatsapp: '081234599990',
      clientEmail: 'julia@robert.com',
      serviceType: 'Film Production',
      duration: 'Kompleks',
      location: 'Luar kota',
      talent: true,
      equipment: true,
      specialRequest: 'Short movie branding produk skincare premium.',
      estimatedPriceMin: 16000000,
      estimatedPriceMax: 20800000,
      negotiatedPrice: 20000000,
      status: 'COMPLETED',
      notes: 'Project awal tahun selesai dengan luar biasa.',
      createdAt: new Date('2026-01-20T10:00:00Z'),
    }
  ];

  for (const c of consultationsData) {
    await prisma.consultation.upsert({
      where: { trackingCode: c.trackingCode },
      update: c,
      create: c,
    });
  }
  console.log('Consultations seeded successfully.');

  // 6. Seed Equipment
  const equipmentData = [
    { name: 'Kamera SONY A6400', category: 'Kamera', provider: 'Favian', purchasePrice: 13000000, targetBep: 450, pricePerHour: 28889 },
    { name: 'Kamera ZV-E10', category: 'Kamera', provider: 'Rico', purchasePrice: 10000000, targetBep: 450, pricePerHour: 22222 },
    { name: 'HP iPhone 13', category: 'Kamera', provider: 'Rahardian', purchasePrice: 7500000, targetBep: 450, pricePerHour: 16667 },
    { name: 'iPhone 17 Pro', category: 'Kamera', provider: 'Favian', purchasePrice: 21000000, targetBep: 450, pricePerHour: 46667 },
    { name: 'Drone DJI', category: 'Drone', provider: 'Rico', purchasePrice: 7000000, targetBep: 350, pricePerHour: 20000 },
    { name: 'Drone DJI Spark', category: 'Drone', provider: 'Ghulam', purchasePrice: 4500000, targetBep: 350, pricePerHour: 12857 },
    { name: 'Mic MIXIO T11', category: 'Mic', provider: 'Rahardian', purchasePrice: 359000, targetBep: 100, pricePerHour: 3590 },
    { name: 'Mic HOLLY LAND MARK M2', category: 'Mic', provider: 'Rico', purchasePrice: 1600000, targetBep: 100, pricePerHour: 16000 },
    { name: 'Gimbal DJI RS 4 MINI', category: 'Gimbal', provider: 'Favian', purchasePrice: 6300000, targetBep: 350, pricePerHour: 18000 },
    { name: 'Reflektor', category: 'Reflektor', provider: 'Favian', purchasePrice: 50000, targetBep: 50, pricePerHour: 1000 },
    { name: 'Tripod Inbex', category: 'Tripod', provider: 'Rayyan', purchasePrice: 150000, targetBep: 50, pricePerHour: 3000 },
    { name: 'Mini Lighting', category: 'Lighting', provider: 'Favian', purchasePrice: 120000, targetBep: 50, pricePerHour: 2400 },
  ];

  await prisma.equipment.createMany({ data: equipmentData, skipDuplicates: true });
  console.log('Equipment seeded successfully.');

  // 7. Seed Labor
  const laborData = [
    { role: 'Fotografer', priceRingan: 15000, priceMenengah: 40000, priceBesar: 90000, chargeRingan: 18000, chargeMenengah: 48000, chargeBesar: 108000 },
    { role: 'Videografer', priceRingan: 15000, priceMenengah: 55000, priceBesar: 100000, chargeRingan: 18000, chargeMenengah: 66000, chargeBesar: 120000 },
    { role: 'Desainer', priceRingan: 15000, priceMenengah: 30000, priceBesar: 50000, chargeRingan: 18000, chargeMenengah: 36000, chargeBesar: 60000 },
    { role: 'Editor', priceRingan: 15000, priceMenengah: 55000, priceBesar: 125000, chargeRingan: 18000, chargeMenengah: 66000, chargeBesar: 150000 },
    { role: 'Animator', priceRingan: 50000, priceMenengah: 75000, priceBesar: 250000, chargeRingan: 60000, chargeMenengah: 90000, chargeBesar: 300000 },
    { role: 'Crew', priceRingan: 15000, priceMenengah: 30000, priceBesar: 60000, chargeRingan: 18000, chargeMenengah: 36000, chargeBesar: 72000 },
    { role: 'Talent Internal', priceRingan: 15000, priceMenengah: 60000, priceBesar: 75000, chargeRingan: 18000, chargeMenengah: 72000, chargeBesar: 90000 },
    { role: 'Talent External', priceRingan: 0, priceMenengah: 0, priceBesar: 100000, chargeRingan: 0, chargeMenengah: 0, chargeBesar: 120000 },
    { role: 'Drone Pilot', priceRingan: 0, priceMenengah: 50000, priceBesar: 125000, chargeRingan: 0, chargeMenengah: 60000, chargeBesar: 150000 },
    { role: 'Admin', priceRingan: 20000, priceMenengah: 50000, priceBesar: 75000, chargeRingan: 24000, chargeMenengah: 60000, chargeBesar: 90000 },
    { role: 'Tenaga Pemateri', priceRingan: 100000, priceMenengah: 200000, priceBesar: 320000, chargeRingan: 120000, chargeMenengah: 240000, chargeBesar: 384000 },
  ];

  await prisma.labor.createMany({ data: laborData, skipDuplicates: true });
  console.log('Labor seeded successfully.');

  // 8. Seed Development Score Options
  const scoreOptions = [
    { parameter: 'Durasi Proyek', optionLabel: '< 12 jam', score: 1 },
    { parameter: 'Durasi Proyek', optionLabel: '12 - 24 jam', score: 2 },
    { parameter: 'Durasi Proyek', optionLabel: '> 24 jam', score: 3 },
    { parameter: 'Jumlah Output', optionLabel: '1 Output', score: 1 },
    { parameter: 'Jumlah Output', optionLabel: '2 Output', score: 2 },
    { parameter: 'Jumlah Output', optionLabel: '> 2 Output', score: 3 },
    { parameter: 'Durasi Output', optionLabel: '1-2 Menit', score: 1 },
    { parameter: 'Durasi Output', optionLabel: '2-3 Menit', score: 2 },
    { parameter: 'Durasi Output', optionLabel: '> 3 Menit', score: 3 },
    { parameter: 'Kompleksitas Konsep', optionLabel: 'Simple/informatif', score: 1 },
    { parameter: 'Kompleksitas Konsep', optionLabel: 'Storyline + Visual planning', score: 2 },
    { parameter: 'Kompleksitas Konsep', optionLabel: 'Konsep naratif + riset', score: 3 },
    { parameter: 'Kebutuhan Crew', optionLabel: '1-2 orang', score: 1 },
    { parameter: 'Kebutuhan Crew', optionLabel: '3-4 orang', score: 2 },
    { parameter: 'Kebutuhan Crew', optionLabel: '> 4 orang', score: 3 },
    { parameter: 'Tingkat Teknis', optionLabel: '1-3 alat', score: 1 },
    { parameter: 'Tingkat Teknis', optionLabel: '3-4 alat', score: 2 },
    { parameter: 'Tingkat Teknis', optionLabel: '> 4 alat', score: 3 },
    { parameter: 'Rintangan Lokasi', optionLabel: '1 lokasi', score: 1 },
    { parameter: 'Rintangan Lokasi', optionLabel: 'Beberapa lokasi', score: 3 },
    { parameter: 'Tekanan Deadline', optionLabel: '> 14 hari', score: 1 },
    { parameter: 'Tekanan Deadline', optionLabel: '7-14 hari', score: 2 },
    { parameter: 'Tekanan Deadline', optionLabel: '< 7 hari', score: 3 },
    { parameter: 'Person', optionLabel: '1-20 orang', score: 1 },
    { parameter: 'Person', optionLabel: '20-50 orang', score: 2 },
    { parameter: 'Person', optionLabel: '> 50 orang', score: 3 },
  ];

  await prisma.developmentScoreOption.createMany({ data: scoreOptions, skipDuplicates: true });
  console.log('Score options seeded successfully.');

  // 9. Seed Development Category
  const devCategories = [
    { category: 'Proyek Ringan', minScore: 8, maxScore: 12, pricePerScore: 2000, profitPercentage: 0.10 },
    { category: 'Proyek Menengah', minScore: 13, maxScore: 18, pricePerScore: 5000, profitPercentage: 0.15 },
    { category: 'Proyek Besar', minScore: 19, maxScore: 24, pricePerScore: 10000, profitPercentage: 0.30 },
  ];

  await prisma.developmentCategory.createMany({ data: devCategories, skipDuplicates: true });
  console.log('Development categories seeded successfully.');

  // 10. Seed Variable Cost
  const varCosts = [
    { name: 'Akomodasi Sidoarjo', price: 11000 },
    { name: 'Akomodasi Luar Sidoarjo', price: 30000 },
  ];

  await prisma.variableCost.createMany({ data: varCosts, skipDuplicates: true });
  console.log('Variable costs seeded successfully.');

  // 11. Seed Content Asset Price
  const assetPrices = [
    { category: 'Desain Grafis', name: 'Media Dokumen & Cetak Polos', priceMin: 2500, priceMax: 7500 },
    { category: 'Desain Grafis', name: 'Media Informasi & Promosi', priceMin: 5000, priceMax: 50000 },
    { category: 'Desain Grafis', name: 'Media Sosial & Konten Digital', priceMin: 3500, priceMax: 32000 },
    { category: 'Desain Grafis', name: 'Media Publikasi High-Impact', priceMin: 45000, priceMax: 65000 },
    { category: 'Desain Grafis', name: 'Media Identitas', priceMin: 100000, priceMax: 500000 },
    { category: 'Editing Video', name: 'Short-Form Video (Basic)', priceMin: 12000, priceMax: 45000 },
    { category: 'Editing Video', name: 'Short-Form Video (Advanced/Trend)', priceMin: 45500, priceMax: 120000 },
    { category: 'Editing Video', name: 'Long-Form Video (Standard)', priceMin: 55000, priceMax: 200000 },
    { category: 'Editing Video', name: 'Long-Form Video (Unique)', priceMin: 75000, priceMax: 500000 },
    { category: 'Editing Video', name: 'Commercial / Promotional Video', priceMin: 120000, priceMax: 1200000 },
  ];

  await prisma.contentAssetPrice.createMany({ data: assetPrices, skipDuplicates: true });
  console.log('Content asset prices seeded successfully.');

  // 12. Seed Catalog Items
  const catalogItemsData = [
    {
      title: 'Commercial Brand Film / TVC',
      slug: 'commercial-brand-film-tvc',
      category: 'Film & Commercial',
      badge: 'BEST SELLER',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792159/rts/catalog/catalog_commercial-brand-film-tvc.jpg',
      sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-on-a-forest-path-41662-large.mp4',
      shortDesc: 'Produksi video iklan komersial produk/brand berstandar sinematik tinggi untuk digital ads & campaign media sosial.',
      fullDesc: 'Paket produksi komersial menyeluruh dirancang untuk menaikkan citra brand dan konversi penjualan. RTS menangani seluruh tahapan mulai dari perumusan treatment visual, naskah narasi, shooting dengan kamera bioskop 4K, hingga tata warna sinematik dan tata suara orisinil.',
      price: 8500000,
      priceUnit: 'per project',
      estimatedDays: '7 - 10 Hari Kerja',
      deliverables: JSON.stringify([
        '1x Master Video 4K Cinematic (60-90 detik)',
        '3x Cutdown Vertikal (15-30 detik untuk Reels/TikTok/Shorts)',
        'Color Grading Sinematik High-End',
        'Sound Design & Audio Mastering',
        'Lisensi Musik Komersial Legal',
        'Full High-Res Master Files (ProRes & MP4)',
      ]),
      gearSpecs: 'Cinema Camera 4K, Prime Lens Set, Wireless Audio Pro, Aputure Lighting Set, Gimbal Stabilizer',
      revisions: '2x Revisi Mayor, Unlimited Minor',
      addonsJson: JSON.stringify([
        { name: 'Drone Aerial 4K Cinematography', price: 1200000 },
        { name: 'Professional Voice Over Artist', price: 750000 },
        { name: 'Talent / Model Casting (2 Orang)', price: 1500000 },
        { name: 'Express Delivery (3 Hari Jadi)', price: 1800000 },
      ]),
      isFeatured: true,
      isActive: true,
      order: 1,
    },
    {
      title: 'Cinematic Company Profile',
      slug: 'cinematic-company-profile',
      category: 'Film & Commercial',
      badge: 'ENTERPRISE',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792160/rts/catalog/catalog_cinematic-company-profile.jpg',
      sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
      shortDesc: 'Profil perusahaan visual sinematik untuk membangun kredibilitas, presentasi investor, dan branding korporat.',
      fullDesc: 'Tampilkan identitas, visi misi, dan fasilitas perusahaan Anda secara megah dan profesional. Menggabungkan wawancara pimpinan, visual operasional dinamis, grafis infografis modern, serta tata suara sinematik.',
      price: 12000000,
      priceUnit: 'per project',
      estimatedDays: '10 - 14 Hari Kerja',
      deliverables: JSON.stringify([
        '1x Master Video Profil 3-5 Menit (4K)',
        'Scriptwriting & Storyboard Direction',
        'Wawancara Direksi & Tim Kunci',
        'Motion Graphic Infografis & Lower Thirds',
        'Master Subtitle Bilingual (ID & EN)',
        '1x Teaser Highlight 60 Detik',
      ]),
      gearSpecs: 'Multi-Camera 4K Setup, Boom & Lav Mic Wireless, Studio Key/Fill/Hair Lighting, Slider & Gimbal',
      revisions: '3x Revisi Mayor, Unlimited Minor',
      addonsJson: JSON.stringify([
        { name: 'Drone Aerial 4K Cinematic Shot', price: 1200000 },
        { name: 'Dokumentasi Foto High-Res 30 Foto Pilihan', price: 1500000 },
        { name: 'Bilingual English Native Voice Over', price: 1200000 },
      ]),
      isFeatured: true,
      isActive: true,
      order: 2,
    },
    {
      title: '3D Product Animation & Commercial',
      slug: '3d-product-animation-commercial',
      category: 'Animation',
      badge: 'POPULAR',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792161/rts/catalog/catalog_3d-product-animation-commercial.jpg',
      sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-flying-abstract-spheres-31915-large.mp4',
      shortDesc: 'Animasi 3D produk realistis dengan efek pencahayaan, raytracing, dan sudut dinamis tanpa batas fisik.',
      fullDesc: 'Solusi ideal untuk menampilkan produk elektronik, fashion, kosmetik, botol/kemasan, dan manufaktur dengan visual fotorealistik mutakhir. Mampu memperlihatkan bagian dalam produk (X-ray/explode view) yang tidak bisa direkam kamera biasa.',
      price: 9500000,
      priceUnit: 'per video',
      estimatedDays: '10 - 14 Hari Kerja',
      deliverables: JSON.stringify([
        '1x 3D Video Animasi Produk (30-60 detik 4K)',
        '3D Modeling & Realistic Texturing Shader',
        'Cinematic Lighting & Dynamic Camera Movements',
        'Dynamic Particle & Physics Visual FX',
        'Export format Horizontal (16:9) & Vertikal (9:16)',
      ]),
      gearSpecs: 'Blender & Cinema 4D Suite, Octane / Redshift Raytracing Renderer',
      revisions: '2x Revisi Storyboard, 2x Revisi Final Render',
      addonsJson: JSON.stringify([
        { name: 'Custom 3D Environment / World Building', price: 2000000 },
        { name: 'Tambahan 1 Varian Produk 3D', price: 1500000 },
        { name: 'Fast Render Express Priority', price: 2000000 },
      ]),
      isFeatured: true,
      isActive: true,
      order: 3,
    },
    {
      title: '2D Explainer & Storytelling Animation',
      slug: '2d-explainer-storytelling-animation',
      category: 'Animation',
      badge: null,
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792163/rts/catalog/catalog_2d-explainer-storytelling-animation.jpg',
      sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-design-animation-of-colorful-shapes-31908-large.mp4',
      shortDesc: 'Animasi 2D informatif dan engaging untuk edukasi layanan, aplikasi digital, campaign, atau presentasi SOP.',
      fullDesc: 'Jelaskan konsep bisnis atau alur produk Anda dengan cara yang menyenangkan, mudah dipahami, dan berdaya ingat tinggi. Dilengkapi dengan ilustrasi kustom orisinil dan narasi suara profesional.',
      price: 6500000,
      priceUnit: 'per video',
      estimatedDays: '7 - 10 Hari Kerja',
      deliverables: JSON.stringify([
        '1x 2D Explainer Video (Durasi hingga 60 detik)',
        'Karakter Kustom & Scene Illustration Desain',
        'Full Voice Over Bahasa Indonesia Profesional',
        'Sound Effects & Background Music Berlisensi',
        'Storyboard Sketsa & Draft Alur Lengkap',
      ]),
      gearSpecs: 'Adobe After Effects, Illustrator Vector Studio',
      revisions: '2x Revisi Mayor (Naskah & Animasi)',
      addonsJson: JSON.stringify([
        { name: 'Tambahan Durasi +30 Detik', price: 1500000 },
        { name: 'Karakter Maskot Kustom Tambahan', price: 800000 },
        { name: 'Subtitle Bahasa Inggris (SRT)', price: 300000 },
      ]),
      isFeatured: false,
      isActive: true,
      order: 4,
    },
    {
      title: 'Social Media Reels Growth Pack (10 Videos)',
      slug: 'social-media-reels-growth-pack',
      category: 'Motion Graphic',
      badge: 'BEST SELLER',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792165/rts/catalog/catalog_social-media-reels-growth-pack.jpg',
      sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-design-animation-of-colorful-shapes-31908-large.mp4',
      shortDesc: 'Paket editing 10 konten video pendek vertikal ber-pacing cepat untuk meledakkan reach di IG Reels & TikTok.',
      fullDesc: 'Dioptimalkan untuk retensi audiens dengan hook di 3 detik awal, tipografi kinetik menarik, sound effects dinamis, dan grading warna modern. Cocok untuk brand, influencer, dan bisnis retail.',
      price: 4500000,
      priceUnit: 'per paket (10 video)',
      estimatedDays: '5 - 7 Hari Kerja',
      deliverables: JSON.stringify([
        '10x Video Vertikal (15-60 detik 1080x1920)',
        'Dynamic Kinetic Captions / Auto-Subtitles Menarik',
        'Sound FX, B-Roll Integration & Trending Audio',
        'Hook Optimization & Color Correction',
        'Cover Thumbnail Eye-Catching untuk Setiap Video',
      ]),
      gearSpecs: 'Adobe Premiere Pro, After Effects Typography Module',
      revisions: '1x Revisi per video',
      addonsJson: JSON.stringify([
        { name: 'Tambahan 5 Video (Total 15 Video)', price: 1800000 },
        { name: 'Animasi Logo Intro/Outro Kustom', price: 600000 },
      ]),
      isFeatured: true,
      isActive: true,
      order: 5,
    },
    {
      title: 'Dynamic Brand Motion & Kinetic Intro',
      slug: 'dynamic-brand-motion-kinetic-intro',
      category: 'Motion Graphic',
      badge: 'FAST TRACK',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792166/rts/catalog/catalog_dynamic-brand-motion-kinetic-intro.jpg',
      sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-colorful-laser-lights-background-43093-large.mp4',
      shortDesc: 'Animasi identitas visual dinamis, logo bumper, stinger intro, dan template gerak tipografi modern.',
      fullDesc: 'Tingkatkan standar konten video YouTube, presentasi, dan event Anda dengan bumper animasi logo berkualitas studio. Menampilkan transisi mulus dengan efek audio yang berkarakter.',
      price: 3500000,
      priceUnit: 'per project',
      estimatedDays: '3 - 5 Hari Kerja',
      deliverables: JSON.stringify([
        '1x Animasi Logo / Stinger Bumper (5-10 detik)',
        '3x Motion Typography Template / Lower Thirds',
        'Format Alpha Channel Transparan (ProRes 4444) & MP4',
        'Sound FX Orisinil & Audio Mixing',
      ]),
      gearSpecs: 'Adobe After Effects & Cinema 4D Lite',
      revisions: '2x Revisi',
      addonsJson: JSON.stringify([
        { name: '3D Extruded Metallic Logo Rendering', price: 1000000 },
      ]),
      isFeatured: false,
      isActive: true,
      order: 6,
    },
    {
      title: 'Event Aftermovie & Cinematic Highlight',
      slug: 'event-aftermovie-cinematic-highlight',
      category: 'Film & Commercial',
      badge: 'POPULAR',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792170/rts/catalog/catalog_event-aftermovie-cinematic-highlight.jpg',
      sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
      shortDesc: 'Dokumentasi acara berformat film pendek untuk konser musik, konferensi korporat, gathering, dan festival.',
      fullDesc: 'Abadikan kemeriahan, emosi, dan momen berharga acara Anda menjadi video aftermovie yang memukau. Tim videografer RTS siap menangkap momen terbaik dengan berbagai sudut kamera dan tata suara lapangan yang jernih.',
      price: 7000000,
      priceUnit: 'per event (1 hari)',
      estimatedDays: '4 - 6 Hari Kerja',
      deliverables: JSON.stringify([
        '1x Master Aftermovie Sinematik (2-3 Menit 4K)',
        '1x Teaser Highlight 60 Detik (Format Reels)',
        '2 Orang Videografer Profesional di Lokasi',
        'Perekaman Audio Multi-Track & Ambient Sound',
        'Color Grading Sinematik Vibrant',
      ]),
      gearSpecs: '2x Cinema Camera 4K, DJI Ronin RS3 Pro Gimbal, Zoom Audio Recorder',
      revisions: '2x Revisi Mayor',
      addonsJson: JSON.stringify([
        { name: 'Drone Operator on Location (4K Aerial)', price: 1200000 },
        { name: 'Live Same-Day Edit (SDE) Highlight Reels', price: 1500000 },
        { name: 'Dokumentasi Foto 50+ Edited Photos', price: 1200000 },
      ]),
      isFeatured: true,
      isActive: true,
      order: 7,
    },
    {
      title: 'Brand Identity Visual Kit & Social Grid',
      slug: 'brand-identity-visual-kit-social-grid',
      category: 'Content Asset',
      badge: null,
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792171/rts/catalog/catalog_brand-identity-visual-kit-social-grid.jpg',
      sampleVideoUrl: null,
      shortDesc: 'Asset grafis visual, template feed media sosial, dan pedoman identitas estetika brand bisnis Anda.',
      fullDesc: 'Rancangan visual lengkap yang konsisten dan menarik untuk feed Instagram, materi promosi banner, dan panduan palet warna agar brand Anda tampil terpercaya di mata audiens.',
      price: 2800000,
      priceUnit: 'per paket',
      estimatedDays: '3 - 5 Hari Kerja',
      deliverables: JSON.stringify([
        '9x Instagram Feed Grid Visual Design (Puzzle/Carousel)',
        '5x Instagram Story Template Siap Pakai',
        'Brand Color Palette, Font Pairing & Guide PDF',
        'File Master Vector (AI / PSD / Figma) & Export PNG/JPG',
      ]),
      gearSpecs: 'Adobe Photoshop, Illustrator, Figma Cloud',
      revisions: '3x Revisi Desain',
      addonsJson: JSON.stringify([
        { name: 'Desain Poster Cetak High-Res Ukuran A1/A2', price: 500000 },
        { name: 'Motion Graphic Animated Post (1 Postingan)', price: 600000 },
      ]),
      isFeatured: false,
      isActive: true,
      order: 8,
    },
    {
      title: 'Cinema Gear & Crew Production Setup',
      slug: 'cinema-gear-crew-production-setup',
      category: 'Production Gear',
      badge: 'ENTERPRISE',
      thumbnailUrl: 'https://res.cloudinary.com/qnwklkqx/image/upload/v1787792173/rts/catalog/catalog_cinema-gear-crew-production-setup.jpg',
      sampleVideoUrl: null,
      shortDesc: 'Paket perlengkapan kamera bioskop, lensa, lighting pro, dan kru teknis RTS untuk kebutuhan shooting mandiri.',
      fullDesc: 'Solusi lengkap bagi sutradara, agensi luar, atau production team yang membutuhkan kamera bioskop 4K, sistem monitor nirkabel, rig gimbal, dan operator asisten peralatan terlatih di area Surabaya dan sekitarnya.',
      price: 3500000,
      priceUnit: 'per shift (8 jam)',
      estimatedDays: 'Sesuai Jadwal Shooting',
      deliverables: JSON.stringify([
        '1x Cinema Camera Body 4K 10-bit 4:2:2',
        'Set Lensa Prime & Zoom Sinematik (16-35, 24-70, 85mm)',
        'Wireless Video Transmitter & Wireless Director Monitor',
        'DJI Ronin RS3 Pro Gimbal Setup & Follow Focus',
        '1x Asisten Peralatan / Gaffer Teknis RTS di Lokasi',
      ]),
      gearSpecs: 'Sony 4K Cine, Hollyland Mars 4K, DJI Ronin RS3 Pro, V-Mount Batteries',
      revisions: 'N/A (Layanan Operasional Peralatan)',
      addonsJson: JSON.stringify([
        { name: 'DJI Mavic Air 3 Drone + Pilot Bersertifikat', price: 1500000 },
        { name: 'Aputure 300d II + Light Dome Studio Lighting', price: 800000 },
        { name: 'Sound Recordist + Boom & Wireless Lav Mic', price: 900000 },
      ]),
      isFeatured: false,
      isActive: true,
      order: 9,
    },
  ];

  await prisma.catalogItem.createMany({ data: catalogItemsData, skipDuplicates: true });
  console.log('Catalog items seeded successfully.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
