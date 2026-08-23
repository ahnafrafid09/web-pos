import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  PrismaClient,
  UserRole,
  ProductType,
} from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'pos',
});

const prisma = new PrismaClient({
  adapter,
});

const tenantId = '90b97df0-427f-41ed-97a0-9462eb0ec3b1';

async function main() {
  // ==========================================
  // SEED SUPER ADMIN
  // ==========================================

  const password = await bcrypt.hash('admin123@#', 10);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: 'Platform Administrator',
        username: 'superadmin',
        email: 'admin@wartegpos.local',
        password,
        role: UserRole.SUPER_ADMIN,
        tenantId: null,
      },
    });

    console.log('✅ SUPER_ADMIN created');
    console.log({
      id: admin.id,
      username: admin.username,
      email: admin.email,
    });
  } else {
    console.log('ℹ️ SUPER_ADMIN already exists');
  }

  // ==========================================
  // SEED TENANT
  // ==========================================

  const tenant = await prisma.tenant.upsert({
    where: {
      id: tenantId,
    },
    update: {
      status: true,
    },
    create: {
      id: tenantId,
      name: 'Warteg Samara Bahari',
      slug: 'warteg-samara-bahari',
      status: true,
    },
  });

  console.log(`🌱 Seeding data untuk tenant: ${tenant.name}`);

  // ==========================================
  // SEED OWNER (tenantId diambil dari tenant di atas)
  // ==========================================

  const ownerPassword = await bcrypt.hash('password1239', 10);

  const existingOwner = await prisma.user.findFirst({
    where: {
      tenantId: tenant.id,
      role: UserRole.OWNER,
    },
  });

  if (!existingOwner) {
    const owner = await prisma.user.create({
      data: {
        name: 'Fina Nasirotul Umam',
        username: 'fina',
        email: 'fina@gmail.com',
        password: ownerPassword,
        role: UserRole.OWNER,
        tenantId: tenant.id,
      },
    });

    console.log('✅ OWNER created');
    console.log({
      id: owner.id,
      username: owner.username,
      email: owner.email,
      tenantId: owner.tenantId,
    });
  } else {
    console.log('ℹ️ OWNER already exists untuk tenant ini');
  }

  // ==========================================
  // SEED UNIT
  // ==========================================

  const units = [
    {
      name: 'Gram',
      code: 'g',
    },
    {
      name: 'Kilogram',
      code: 'kg',
    },
    {
      name: 'Milliliter',
      code: 'ml',
    },
    {
      name: 'Liter',
      code: 'l',
    },
    {
      name: 'Pieces',
      code: 'pcs',
    },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: {
        code: unit.code,
      },
      update: {
        name: unit.name,
      },
      create: unit,
    });
  }

  console.log('✅ Unit seeded');

  // ==========================================
  // SEED UNIT CONVERSION
  // ==========================================

  const gram = await prisma.unit.findUniqueOrThrow({
    where: {
      code: 'g',
    },
  });

  const kilogram = await prisma.unit.findUniqueOrThrow({
    where: {
      code: 'kg',
    },
  });

  const milliliter = await prisma.unit.findUniqueOrThrow({
    where: {
      code: 'ml',
    },
  });

  const liter = await prisma.unit.findUniqueOrThrow({
    where: {
      code: 'l',
    },
  });

  const pcs = await prisma.unit.findUniqueOrThrow({
    where: {
      code: 'pcs',
    },
  });

  const conversions = [
    // KG → GRAM
    {
      fromUnitId: kilogram.id,
      toUnitId: gram.id,
      factor: 1000,
    },

    // GRAM → KG
    {
      fromUnitId: gram.id,
      toUnitId: kilogram.id,
      factor: 0.001,
    },

    // LITER → ML
    {
      fromUnitId: liter.id,
      toUnitId: milliliter.id,
      factor: 1000,
    },

    // ML → LITER
    {
      fromUnitId: milliliter.id,
      toUnitId: liter.id,
      factor: 0.001,
    },
  ];

  for (const conversion of conversions) {
    await prisma.unitConversion.upsert({
      where: {
        fromUnitId_toUnitId: {
          fromUnitId: conversion.fromUnitId,
          toUnitId: conversion.toUnitId,
        },
      },
      update: {
        factor: conversion.factor,
      },
      create: conversion,
    });
  }

  console.log('✅ Unit conversion seeded');

  // ==========================================
  // SEED CATEGORY
  // ==========================================

  const categoryNames = [
    'Nasi',
    'Ayam',
    'Ikan',
    'Telur',
    'Sayur',
    'Gorengan',
    'Minuman',
    'Tambahan',
    'Bahan Baku',
  ];

  const categoryMap = new Map<string, string>();

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: {
        tenantId_name: {
          tenantId: tenant.id,
          name,
        },
      },
      update: {
        status: true,
      },
      create: {
        tenantId: tenant.id,
        name,
        status: true,
      },
    });

    categoryMap.set(name, category.id);
  }

  console.log('✅ Category seeded');

  // ==========================================
  // SEED PRODUCTS
  // Product hanya MENU / MERCHANDISE
  // ==========================================

  const products = [
    // ========================================
    // NASI
    // ========================================

    {
      category: 'Nasi',
      name: 'Nasi Putih',
      type: ProductType.MENU,
      sku: 'NASI-001',
      unit: 'Porsi',
      sellingPrice: 5000,
    },

    // ========================================
    // AYAM
    // ========================================

    {
      category: 'Ayam',
      name: 'Ayam Goreng',
      type: ProductType.MENU,
      sku: 'AYAM-001',
      unit: 'Potong',
      sellingPrice: 15000,
    },
    {
      category: 'Ayam',
      name: 'Ayam Bakar',
      type: ProductType.MENU,
      sku: 'AYAM-002',
      unit: 'Potong',
      sellingPrice: 17000,
    },
    {
      category: 'Ayam',
      name: 'Ayam Kecap',
      type: ProductType.MENU,
      sku: 'AYAM-003',
      unit: 'Potong',
      sellingPrice: 15000,
    },
    {
      category: 'Ayam',
      name: 'Ayam Balado',
      type: ProductType.MENU,
      sku: 'AYAM-004',
      unit: 'Potong',
      sellingPrice: 16000,
    },
    {
      category: 'Ayam',
      name: 'Ayam Rica-Rica',
      type: ProductType.MENU,
      sku: 'AYAM-005',
      unit: 'Potong',
      sellingPrice: 17000,
    },

    // ========================================
    // IKAN
    // ========================================

    {
      category: 'Ikan',
      name: 'Lele Goreng',
      type: ProductType.MENU,
      sku: 'IKAN-001',
      unit: 'Ekor',
      sellingPrice: 10000,
    },
    {
      category: 'Ikan',
      name: 'Lele Bakar',
      type: ProductType.MENU,
      sku: 'IKAN-002',
      unit: 'Ekor',
      sellingPrice: 12000,
    },
    {
      category: 'Ikan',
      name: 'Ikan Kembung Goreng',
      type: ProductType.MENU,
      sku: 'IKAN-003',
      unit: 'Ekor',
      sellingPrice: 12000,
    },
    {
      category: 'Ikan',
      name: 'Tongkol Balado',
      type: ProductType.MENU,
      sku: 'IKAN-004',
      unit: 'Potong',
      sellingPrice: 12000,
    },

    // ========================================
    // TELUR
    // ========================================

    {
      category: 'Telur',
      name: 'Telur Dadar',
      type: ProductType.MENU,
      sku: 'TELUR-001',
      unit: 'Porsi',
      sellingPrice: 7000,
    },
    {
      category: 'Telur',
      name: 'Telur Ceplok',
      type: ProductType.MENU,
      sku: 'TELUR-002',
      unit: 'Butir',
      sellingPrice: 6000,
    },
    {
      category: 'Telur',
      name: 'Telur Balado',
      type: ProductType.MENU,
      sku: 'TELUR-003',
      unit: 'Butir',
      sellingPrice: 7000,
    },

    // ========================================
    // SAYUR
    // ========================================

    {
      category: 'Sayur',
      name: 'Sayur Asem',
      type: ProductType.MENU,
      sku: 'SAYUR-001',
      unit: 'Porsi',
      sellingPrice: 5000,
    },
    {
      category: 'Sayur',
      name: 'Tumis Kangkung',
      type: ProductType.MENU,
      sku: 'SAYUR-002',
      unit: 'Porsi',
      sellingPrice: 6000,
    },
    {
      category: 'Sayur',
      name: 'Tumis Kacang Panjang',
      type: ProductType.MENU,
      sku: 'SAYUR-003',
      unit: 'Porsi',
      sellingPrice: 6000,
    },
    {
      category: 'Sayur',
      name: 'Capcay',
      type: ProductType.MENU,
      sku: 'SAYUR-004',
      unit: 'Porsi',
      sellingPrice: 8000,
    },
    {
      category: 'Sayur',
      name: 'Tumis Tauge',
      type: ProductType.MENU,
      sku: 'SAYUR-005',
      unit: 'Porsi',
      sellingPrice: 5000,
    },
    {
      category: 'Sayur',
      name: 'Oseng Buncis',
      type: ProductType.MENU,
      sku: 'SAYUR-006',
      unit: 'Porsi',
      sellingPrice: 6000,
    },

    // ========================================
    // GORENGAN
    // ========================================

    {
      category: 'Gorengan',
      name: 'Tempe Goreng',
      type: ProductType.MENU,
      sku: 'GRG-001',
      unit: 'Potong',
      sellingPrice: 2000,
    },
    {
      category: 'Gorengan',
      name: 'Tahu Goreng',
      type: ProductType.MENU,
      sku: 'GRG-002',
      unit: 'Potong',
      sellingPrice: 2000,
    },
    {
      category: 'Gorengan',
      name: 'Bakwan Sayur',
      type: ProductType.MENU,
      sku: 'GRG-003',
      unit: 'Buah',
      sellingPrice: 3000,
    },
    {
      category: 'Gorengan',
      name: 'Perkedel Kentang',
      type: ProductType.MENU,
      sku: 'GRG-004',
      unit: 'Buah',
      sellingPrice: 3000,
    },

    // ========================================
    // MINUMAN
    // ========================================

    {
      category: 'Minuman',
      name: 'Es Teh Manis',
      type: ProductType.MENU,
      sku: 'MINUM-001',
      unit: 'Gelas',
      sellingPrice: 5000,
    },
    {
      category: 'Minuman',
      name: 'Teh Manis Hangat',
      type: ProductType.MENU,
      sku: 'MINUM-002',
      unit: 'Gelas',
      sellingPrice: 4000,
    },
    {
      category: 'Minuman',
      name: 'Es Jeruk',
      type: ProductType.MENU,
      sku: 'MINUM-003',
      unit: 'Gelas',
      sellingPrice: 6000,
    },
    {
      category: 'Minuman',
      name: 'Jeruk Hangat',
      type: ProductType.MENU,
      sku: 'MINUM-004',
      unit: 'Gelas',
      sellingPrice: 5000,
    },
    {
      category: 'Minuman',
      name: 'Kopi Hitam',
      type: ProductType.MENU,
      sku: 'MINUM-005',
      unit: 'Gelas',
      sellingPrice: 5000,
    },
    {
      category: 'Minuman',
      name: 'Air Mineral',
      type: ProductType.MERCHANDISE,
      sku: 'MINUM-006',
      unit: 'Botol',
      sellingPrice: 4000,
    },

    // ========================================
    // TAMBAHAN
    // ========================================

    {
      category: 'Tambahan',
      name: 'Kerupuk',
      type: ProductType.MENU,
      sku: 'TAMBAH-001',
      unit: 'Bungkus',
      sellingPrice: 2000,
    },
    {
      category: 'Tambahan',
      name: 'Sambal Tambahan',
      type: ProductType.MENU,
      sku: 'TAMBAH-002',
      unit: 'Porsi',
      sellingPrice: 2000,
    },
    {
      category: 'Tambahan',
      name: 'Lalapan',
      type: ProductType.MENU,
      sku: 'TAMBAH-003',
      unit: 'Porsi',
      sellingPrice: 3000,
    },
  ];

  // ==========================================
  // CREATE / UPDATE PRODUCTS
  // ==========================================

  for (const item of products) {
    const categoryId = categoryMap.get(item.category);

    if (!categoryId) {
      throw new Error(`Category "${item.category}" tidak ditemukan`);
    }

    await prisma.product.upsert({
      where: {
        tenantId_sku: {
          tenantId: tenant.id,
          sku: item.sku,
        },
      },
      update: {
        categoryId,
        name: item.name,
        type: item.type,
        unit: item.unit,
        sellingPrice: item.sellingPrice,
        status: true,
      },
      create: {
        tenantId: tenant.id,
        categoryId,
        name: item.name,
        type: item.type,
        sku: item.sku,
        unit: item.unit,
        sellingPrice: item.sellingPrice,
        status: true,
      },
    });
  }

  console.log('✅ Product seeded');

  // ==========================================
  // SEED RAW MATERIALS
  // ==========================================

  const rawMaterials = [
    {
      name: 'Beras',
      sku: 'BB-001',
      unit: 'kg',
      averageCost: 15000,
    },
    {
      name: 'Ayam Mentah',
      sku: 'BB-002',
      unit: 'kg',
      averageCost: 35000,
    },
    {
      name: 'Telur Ayam',
      sku: 'BB-003',
      unit: 'pcs',
      averageCost: 2500,
    },
    {
      name: 'Minyak Goreng',
      sku: 'BB-004',
      unit: 'l',
      averageCost: 18000,
    },
    {
      name: 'Gula Pasir',
      sku: 'BB-005',
      unit: 'kg',
      averageCost: 18000,
    },
    {
      name: 'Garam',
      sku: 'BB-006',
      unit: 'g',
      averageCost: 5000,
    },
    {
      name: 'Bawang Merah',
      sku: 'BB-007',
      unit: 'g',
      averageCost: 30000,
    },
    {
      name: 'Bawang Putih',
      sku: 'BB-008',
      unit: 'g',
      averageCost: 35000,
    },
    {
      name: 'Cabai Merah',
      sku: 'BB-009',
      unit: 'g',
      averageCost: 50000,
    },
    {
      name: 'Cabai Rawit',
      sku: 'BB-010',
      unit: 'g',
      averageCost: 60000,
    },
  ];

  for (const item of rawMaterials) {
    const unit = await prisma.unit.findUniqueOrThrow({
      where: {
        code: item.unit,
      },
    });

    const rawMaterial = await prisma.rawMaterial.upsert({
      where: {
        tenantId_sku: {
          tenantId: tenant.id,
          sku: item.sku,
        },
      },
      update: {
        name: item.name,
        unitId: unit.id,
        averageCost: item.averageCost,
        status: true,
      },
      create: {
        tenantId: tenant.id,
        name: item.name,
        sku: item.sku,
        unitId: unit.id,
        averageCost: item.averageCost,
        status: true,
      },
    });

    // ========================================
    // CREATE STOCK
    // ========================================

    await prisma.stock.upsert({
      where: {
        rawMaterialId: rawMaterial.id,
      },
      update: {},
      create: {
        rawMaterialId: rawMaterial.id,
        quantity: 0,
        minimumStock: 0,
      },
    });
  }

  console.log('✅ Raw materials seeded');

  // ==========================================
  // SUMMARY
  // ==========================================

  console.log('================================');
  console.log('✅ SEED SELESAI');
  console.log(`🏪 Tenant: ${tenant.name} (${tenant.id})`);
  console.log(`📂 Category: ${categoryNames.length}`);
  console.log(`🍛 Product: ${products.length}`);
  console.log(`🧾 Raw materials: ${rawMaterials.length}`);
  console.log('📦 Stock raw material awal: 0');
  console.log('✅ Unit conversion seeded');
  console.log('================================');
}

main()
  .catch((error) => {
    console.error('❌ Seed gagal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
