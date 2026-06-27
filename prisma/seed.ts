import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800',
    },
    {
      name: 'Animation',
      description: 'Pembuatan animasi 2D & 3D premium untuk kebutuhan promosi, storytelling, visual campaign, mascot design, dan explainer video.',
      basePrice: 7000000,
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800',
    },
    {
      name: 'Creative Visual',
      description: 'Pembuatan motion graphic, branding visual, design material media sosial, asset 3D, digital imaging, dan kebutuhan asset digital lainnya.',
      basePrice: 4000000,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
    },
  ];

  await prisma.service.deleteMany();
  for (const s of servicesData) {
    await prisma.service.create({
      data: {
        name: s.name,
        description: s.description,
        basePrice: s.basePrice,
        imageUrl: s.imageUrl,
      },
    });
  }
  console.log('Services seeded successfully.');

  // 3. Create Portfolios
  const portfoliosData = [
    {
      title: 'Ethereal Silence — Cinematic Short Film',
      category: 'Film Production',
      year: '2025',
      thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
      description: 'Sebuah film pendek sinematik bernuansa puitis yang mengeksplorasi hubungan manusia dengan alam bebas. Diproduksi dengan kamera bersensor anamorphic.',
      featured: true,
    },
    {
      title: 'Neon Odyssey — 3D Cyberpunk Trailer',
      category: 'Animation',
      year: '2026',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-flying-abstract-spheres-31915-large.mp4',
      description: 'Trailer animasi 3D cyberpunk futuristik yang menampilkan visualisasi kota metropolitan masa depan dengan neon glow, cybernetic assets, dan fast-paced editing.',
      featured: true,
    },
    {
      title: 'Metamorphosis — Dynamic Brand Motion',
      category: 'Motion Graphic',
      year: '2025',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-design-animation-of-colorful-shapes-31908-large.mp4',
      description: 'Motion graphic promosi untuk peluncuran brand teknologi modern, menggabungkan shape animation, typographic kinetic text, dan color palette dinamis.',
      featured: true,
    },
    {
      title: 'Lumina Digital — Interactive Visual Art',
      category: 'Creative Visual',
      year: '2026',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-colorful-laser-lights-background-43093-large.mp4',
      description: 'Project branding visual interaktif yang menggabungkan elemen 3D rendering dan digital painting abstrak untuk pameran seni kontemporer.',
      featured: false,
    },
    {
      title: 'The Silent Path — Commercial Brand Film',
      category: 'Film Production',
      year: '2026',
      thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-on-a-forest-path-41662-large.mp4',
      description: 'Iklan komersial bertema petualangan outdoor untuk brand pakaian gunung internasional. Berfokus pada keindahan lanskap pegunungan berkabut.',
      featured: false,
    },
  ];

  await prisma.portfolio.deleteMany(); // Clear old portfolios
  for (const p of portfoliosData) {
    await prisma.portfolio.create({ data: p });
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

  await prisma.offer.deleteMany(); // Clear old offers
  for (const o of offersData) {
    await prisma.offer.create({ data: o });
  }
  console.log('Offers seeded successfully.');

  // 5. Create Mock Consultations for Analytics Graph
  // We want to create consultations distributed over several months in 2026 (Jan - Jun)
  const consultationsData = [
    // June 2026
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
      duration: 'Cepat',
      location: 'Lokasi client',
      talent: false,
      equipment: false,
      specialRequest: 'Motion graphic logo & intro video YouTube, durasi 10 detik, deadline 3 hari.',
      estimatedPriceMin: 6500000,
      estimatedPriceMax: 8450000,
      negotiatedPrice: null,
      status: 'PENDING',
      notes: 'Menunggu review tim kreatif RTS untuk ketersediaan jadwal 3 hari.',
      createdAt: new Date('2026-06-24T09:15:00Z'),
    },
    {
      trackingCode: 'RTS-2026-K92P',
      clientName: 'Dewi Lestari',
      clientWhatsapp: '087654321098',
      clientEmail: 'dewi.lestari@fashionbrand.com',
      serviceType: 'Film Production',
      duration: 'Normal',
      location: 'Studio RTS',
      talent: true,
      equipment: true,
      specialRequest: 'Fashion lookbook video summer collection. Butuh model lokal dan outdoor set.',
      estimatedPriceMin: 8500000,
      estimatedPriceMax: 11050000,
      negotiatedPrice: 10000000,
      status: 'COMPLETED',
      notes: 'Project selesai dengan hasil memuaskan. Client memberikan feedback bintang 5.',
      createdAt: new Date('2026-06-02T11:00:00Z'),
    },

    // May 2026
    {
      trackingCode: 'RTS-2026-M82K',
      clientName: 'Joko Widodo (Mock)',
      clientWhatsapp: '081299998888',
      clientEmail: 'joko@gmail.com',
      serviceType: 'Animation',
      duration: 'Kompleks',
      location: 'Studio RTS',
      talent: false,
      equipment: false,
      specialRequest: 'Animasi edukasi 3D berdurasi 15 menit tentang sejarah nusantara.',
      estimatedPriceMin: 14000000,
      estimatedPriceMax: 18200000,
      negotiatedPrice: 16000000,
      status: 'COMPLETED',
      notes: 'Animasi diselesaikan tepat waktu. File master diserahkan.',
      createdAt: new Date('2026-05-10T16:00:00Z'),
    },
    {
      trackingCode: 'RTS-2026-A12X',
      clientName: 'Amelia Putri',
      clientWhatsapp: '085432109876',
      clientEmail: 'amelia@cafecreative.id',
      serviceType: 'Creative Visual',
      duration: 'Normal',
      location: 'Lokasi client',
      talent: true,
      equipment: false,
      specialRequest: 'Pembuatan IG Reels branding menu baru cafe di Surabaya.',
      estimatedPriceMin: 6000000,
      estimatedPriceMax: 7800000,
      negotiatedPrice: 6500000,
      status: 'COMPLETED',
      notes: 'Project selesai. Video reels sudah di-posting.',
      createdAt: new Date('2026-05-18T08:22:00Z'),
    },
    {
      trackingCode: 'RTS-2026-R88N',
      clientName: 'Rudi Hermawan',
      clientWhatsapp: '087788990011',
      clientEmail: 'rudi@tokomaju.com',
      serviceType: 'Film Production',
      duration: 'Cepat',
      location: 'Studio RTS',
      talent: false,
      equipment: true,
      specialRequest: 'Bumper video diskon lebaran.',
      estimatedPriceMin: 9500000,
      estimatedPriceMax: 12350000,
      negotiatedPrice: 9500000,
      status: 'APPROVED',
      notes: 'Approved. DP 50% telah diterima.',
      createdAt: new Date('2026-05-28T13:40:00Z'),
    },

    // April 2026
    {
      trackingCode: 'RTS-2026-D44J',
      clientName: 'Daniel Christian',
      clientWhatsapp: '081233445566',
      clientEmail: 'daniel@startup.co',
      serviceType: 'Animation',
      duration: 'Normal',
      location: 'Studio RTS',
      talent: false,
      equipment: false,
      specialRequest: 'Explainer video landing page startup logistik.',
      estimatedPriceMin: 7000000,
      estimatedPriceMax: 9100000,
      negotiatedPrice: 7500000,
      status: 'COMPLETED',
      notes: 'Revisi 2x dilakukan dan selesai.',
      createdAt: new Date('2026-04-12T10:05:00Z'),
    },
    {
      trackingCode: 'RTS-2026-Y22K',
      clientName: 'Yusuf Mansur',
      clientWhatsapp: '083322110099',
      clientEmail: null,
      serviceType: 'Film Production',
      duration: 'Kompleks',
      location: 'Luar kota',
      talent: true,
      equipment: true,
      specialRequest: 'Aftermovie event festival musik jazz di Yogyakarta.',
      estimatedPriceMin: 16000000,
      estimatedPriceMax: 20800000,
      negotiatedPrice: 19000000,
      status: 'COMPLETED',
      notes: 'Sukses diselesaikan. Video diunggah di YouTube official festival.',
      createdAt: new Date('2026-04-22T15:30:00Z'),
    },

    // March 2026
    {
      trackingCode: 'RTS-2026-H77U',
      clientName: 'Hendra Wijaya',
      clientWhatsapp: '081122334455',
      clientEmail: 'hendra@propertydev.com',
      serviceType: 'Creative Visual',
      duration: 'Kompleks',
      location: 'Studio RTS',
      talent: false,
      equipment: true,
      specialRequest: 'Visualisasi 3D rendering kompleks perumahan elite.',
      estimatedPriceMin: 10500000,
      estimatedPriceMax: 13650000,
      negotiatedPrice: 11500000,
      status: 'COMPLETED',
      notes: 'Selesai. Client puas dengan detail render arsitektur.',
      createdAt: new Date('2026-03-05T09:00:00Z'),
    },
    {
      trackingCode: 'RTS-2026-G11P',
      clientName: 'Gita Savitri',
      clientWhatsapp: '082233445566',
      clientEmail: 'gita@germany.de',
      serviceType: 'Film Production',
      duration: 'Normal',
      location: 'Studio RTS',
      talent: false,
      equipment: false,
      specialRequest: 'Dokumenter mini wawancara komunitas seni rupa.',
      estimatedPriceMin: 5000000,
      estimatedPriceMax: 6500000,
      negotiatedPrice: 5000000,
      status: 'COMPLETED',
      notes: 'Selesai tanpa kendala.',
      createdAt: new Date('2026-03-18T14:20:00Z'),
    },

    // February 2026
    {
      trackingCode: 'RTS-2026-F99O',
      clientName: 'Ferry Salim',
      clientWhatsapp: '085566778899',
      clientEmail: 'ferry@agency.com',
      serviceType: 'Animation',
      duration: 'Cepat',
      location: 'Studio RTS',
      talent: false,
      equipment: false,
      specialRequest: 'Animasi aset game mobile 2D.',
      estimatedPriceMin: 10500000,
      estimatedPriceMax: 13650000,
      negotiatedPrice: 12000000,
      status: 'COMPLETED',
      notes: 'Aset game diserahkan via cloud.',
      createdAt: new Date('2026-02-14T11:50:00Z'),
    },

    // January 2026
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

  await prisma.consultation.deleteMany(); // Clear old consultations
  for (const c of consultationsData) {
    await prisma.consultation.create({ data: c });
  }
  console.log('Consultations seeded successfully.');

  // 6. Seed Equipment
  await prisma.equipment.deleteMany();
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
  for (const eq of equipmentData) {
    await prisma.equipment.create({ data: eq });
  }
  console.log('Equipment seeded.');

  // 7. Seed Labor
  await prisma.labor.deleteMany();
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
  for (const lab of laborData) {
    await prisma.labor.create({ data: lab });
  }
  console.log('Labor seeded.');

  // 8. Seed Development Score Options
  await prisma.developmentScoreOption.deleteMany();
  const scoreOptions = [
    // Durasi Proyek
    { parameter: 'Durasi Proyek', optionLabel: '< 12 jam', score: 1 },
    { parameter: 'Durasi Proyek', optionLabel: '12 - 24 jam', score: 2 },
    { parameter: 'Durasi Proyek', optionLabel: '> 24 jam', score: 3 },
    // Jumlah Output
    { parameter: 'Jumlah Output', optionLabel: '1 Output', score: 1 },
    { parameter: 'Jumlah Output', optionLabel: '2 Output', score: 2 },
    { parameter: 'Jumlah Output', optionLabel: '> 2 Output', score: 3 },
    // Durasi Output
    { parameter: 'Durasi Output', optionLabel: '1-2 Menit', score: 1 },
    { parameter: 'Durasi Output', optionLabel: '2-3 Menit', score: 2 },
    { parameter: 'Durasi Output', optionLabel: '> 3 Menit', score: 3 },
    // Kompleksitas Konsep
    { parameter: 'Kompleksitas Konsep', optionLabel: 'Simple/informatif', score: 1 },
    { parameter: 'Kompleksitas Konsep', optionLabel: 'Storyline + Visual planning', score: 2 },
    { parameter: 'Kompleksitas Konsep', optionLabel: 'Konsep naratif + riset', score: 3 },
    // Kebutuhan Crew
    { parameter: 'Kebutuhan Crew', optionLabel: '1-2 orang', score: 1 },
    { parameter: 'Kebutuhan Crew', optionLabel: '3-4 orang', score: 2 },
    { parameter: 'Kebutuhan Crew', optionLabel: '> 4 orang', score: 3 },
    // Tingkat Teknis
    { parameter: 'Tingkat Teknis', optionLabel: '1-3 alat', score: 1 },
    { parameter: 'Tingkat Teknis', optionLabel: '3-4 alat', score: 2 },
    { parameter: 'Tingkat Teknis', optionLabel: '> 4 alat', score: 3 },
    // Rintangan Lokasi
    { parameter: 'Rintangan Lokasi', optionLabel: '1 lokasi', score: 1 },
    { parameter: 'Rintangan Lokasi', optionLabel: 'Beberapa lokasi', score: 3 },
    // Tekanan Deadline
    { parameter: 'Tekanan Deadline', optionLabel: '> 14 hari', score: 1 },
    { parameter: 'Tekanan Deadline', optionLabel: '7-14 hari', score: 2 },
    { parameter: 'Tekanan Deadline', optionLabel: '< 7 hari', score: 3 },
    // Person
    { parameter: 'Person', optionLabel: '1-20 orang', score: 1 },
    { parameter: 'Person', optionLabel: '20-50 orang', score: 2 },
    { parameter: 'Person', optionLabel: '> 50 orang', score: 3 },
  ];
  for (const opt of scoreOptions) {
    await prisma.developmentScoreOption.create({ data: opt });
  }
  console.log('Score options seeded.');

  // 9. Seed Development Category
  await prisma.developmentCategory.deleteMany();
  const devCategories = [
    { category: 'Proyek Ringan', minScore: 8, maxScore: 12, pricePerScore: 2000, profitPercentage: 0.10 },
    { category: 'Proyek Menengah', minScore: 13, maxScore: 18, pricePerScore: 5000, profitPercentage: 0.15 },
    { category: 'Proyek Besar', minScore: 19, maxScore: 24, pricePerScore: 10000, profitPercentage: 0.30 },
  ];
  for (const cat of devCategories) {
    await prisma.developmentCategory.create({ data: cat });
  }
  console.log('Development categories seeded.');

  // 10. Seed Variable Cost
  await prisma.variableCost.deleteMany();
  const varCosts = [
    { name: 'Akomodasi Sidoarjo', price: 11000 },
    { name: 'Akomodasi Luar Sidoarjo', price: 30000 },
  ];
  for (const vc of varCosts) {
    await prisma.variableCost.create({ data: vc });
  }
  console.log('Variable costs seeded.');

  // 11. Seed Content Asset Price
  await prisma.contentAssetPrice.deleteMany();
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
  for (const ap of assetPrices) {
    await prisma.contentAssetPrice.create({ data: ap });
  }
  console.log('Content asset prices seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

