import { Category, Product, ProductSku, ProductMedia } from '../../types';

export const mockCategories: Category[] = [
  // Level 1
  { id: 1, parentId: null, code: 'SOFTWARE', name: '软件订阅与云服务', description: 'Software & Cloud Services', isActive: true, level: 1, path: '/1/', sortOrder: 1 },
  { id: 2, parentId: null, code: 'HARDWARE', name: '智能硬件与外设', description: 'Smart Hardware & Devices', isActive: true, level: 1, path: '/2/', sortOrder: 2 },
  { id: 3, parentId: null, code: 'FINTECH', name: '金融与支付网关', description: 'Fintech & Payment Processing', isActive: true, level: 1, path: '/3/', sortOrder: 3 },
  { id: 4, parentId: null, code: 'SERVICES', name: '专业服务与耗材', description: 'Professional Services & Consumables', isActive: true, level: 1, path: '/4/', sortOrder: 4 },
  
  // Level 2 - Software
  { id: 11, parentId: 1, code: 'CORE_POS', name: '核心门店系统', description: 'Core POS', isActive: true, level: 2, path: '/1/11/', sortOrder: 1 },
  { id: 12, parentId: 1, code: 'DIGITAL_EXP', name: '数字化运营', description: 'Digital Guest Experience', isActive: true, level: 2, path: '/1/12/', sortOrder: 2 },
  { id: 13, parentId: 1, code: 'BACK_OFFICE', name: '后厨与供应链', description: 'Kitchen & Back-Office', isActive: true, level: 2, path: '/1/13/', sortOrder: 3 },
  
  // Level 3 - Core POS
  { id: 111, parentId: 11, code: 'QSR_EDITION', name: '快餐版', description: 'QSR Edition', isActive: true, level: 3, path: '/1/11/111/', sortOrder: 1 },
  { id: 112, parentId: 11, code: 'FSR_EDITION', name: '正餐版', description: 'FSR Edition', isActive: true, level: 3, path: '/1/11/112/', sortOrder: 2 },
  
  // Level 2 - Hardware
  { id: 21, parentId: 2, code: 'POS_TERMINALS', name: '收银与触控终端', description: 'POS Terminals', isActive: true, level: 2, path: '/2/21/', sortOrder: 1 },
  { id: 22, parentId: 2, code: 'PRINTERS_NET', name: '打印与网络设备', description: 'Printers & Networking', isActive: true, level: 2, path: '/2/22/', sortOrder: 2 },
];

export const mockProducts: Product[] = [
  { id: 101, categoryId: 111, productCode: 'RS-QSR-POS', name: 'RestoSuite 快餐版收银系统', productType: 'software', brand: 'RestoSuite', description: '专为快餐、茶饮设计的核心门店系统' },
  { id: 102, categoryId: 112, productCode: 'RS-FSR-POS', name: 'RestoSuite 正餐版收银系统', productType: 'software', brand: 'RestoSuite', description: '支持桌台管理、预订、扫码点餐的全功能系统' },
  { id: 103, categoryId: 111, productCode: 'RS-BND-QSR', name: 'RestoSuite 快餐套装', productType: 'bundle', brand: 'RestoSuite', description: '快餐店一站式解决方案' },
  { id: 104, categoryId: 112, productCode: 'RS-BND-FSR', name: 'RestoSuite 正餐套装', productType: 'bundle', brand: 'RestoSuite', description: '正餐店全功能数字化套装' },
  { id: 201, categoryId: 21, productCode: 'HW-POS-T1', name: '15.6寸单屏智能收银机', productType: 'hardware', brand: 'Sunmi', description: '高性能安卓收银终端' },
  { id: 202, categoryId: 21, productCode: 'HW-POS-T2', name: '15.6+10寸双屏智能收银机', productType: 'hardware', brand: 'Sunmi', description: '带客显屏的高级收银终端' },
  { id: 301, categoryId: 12, productCode: 'SW-LOYALTY', name: '会员与营销系统', productType: 'software', brand: 'RestoSuite', description: '积分、优惠券、自动化营销工具' },
  { id: 401, categoryId: 4, productCode: 'SVC-DEPLOY', name: '上门部署服务', productType: 'service', brand: 'RestoSuite', description: '专业工程师上门安装与调试' },
];

export const mockSkus: ProductSku[] = [
  // Software SKUs - QSR
  { 
    id: 1011, productId: 101, skuCode: 'RS-QSR-M', name: '快餐版 - 单店月付', 
    billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', 
    trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false,
    provisioningHandler: 'saas-qsr-provisioner'
  },
  { 
    id: 1012, productId: 101, skuCode: 'RS-QSR-A', name: '快餐版 - 单店年付', 
    billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', 
    trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false,
    provisioningHandler: 'saas-qsr-provisioner'
  },
  { 
    id: 1013, productId: 102, skuCode: 'RS-FSR-M', name: '正餐版 - 单店月付', 
    billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', 
    trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false,
    provisioningHandler: 'saas-fsr-provisioner'
  },
  
  // Hardware SKUs
  { 
    id: 1021, productId: 201, skuCode: 'HW-T1-BLK', name: '15.6寸单屏 - 午夜黑', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true,
    weightKg: 4.5, lengthCm: 45, widthCm: 30, heightCm: 40, hsCode: '84705000', countryOfOrigin: 'CN'
  },
  { 
    id: 1022, productId: 201, skuCode: 'HW-T1-WHT', name: '15.6寸单屏 - 珍珠白', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true,
    weightKg: 4.5, lengthCm: 45, widthCm: 30, heightCm: 40, hsCode: '84705000', countryOfOrigin: 'CN'
  },
  { 
    id: 1031, productId: 202, skuCode: 'HW-PRN-USB', name: '热敏打印机 - USB版', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true
  },
  { 
    id: 1032, productId: 202, skuCode: 'HW-PRN-WIFI', name: '热敏打印机 - WiFi版', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true
  },
  { 
    id: 1071, productId: 202, skuCode: 'HW-KDS-15', name: '15寸 KDS 厨房显示屏', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true
  },

  // Add-on Software
  { 
    id: 1051, productId: 301, skuCode: 'SW-ANALYTICS', name: '高级数据分析插件', 
    billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', 
    trialDays: 7, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false 
  },

  // Services
  { 
    id: 1061, productId: 401, skuCode: 'SVC-SUPPORT-H', name: '远程技术支持 (按小时)', 
    billingModel: 'usage_based', billingTerm: 'none', billingTiming: 'in_arrears', 
    trialDays: 0, uom: 'Hour', lifecycleStatus: 'active', isShippable: false, isSerialized: false 
  },
  { 
    id: 1062, productId: 401, skuCode: 'SVC-SUPPORT-A', name: '年度尊享技术支持', 
    billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false 
  },

  // Bundle SKUs
  { 
    id: 1041, productId: 103, skuCode: 'BND-QSR-START', name: 'QSR 创业入门套装', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false 
  },
  { 
    id: 1081, productId: 104, skuCode: 'BND-ENT-MEGA', name: '企业级全能数字化套装', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false 
  },
  { 
    id: 1091, productId: 103, skuCode: 'BND-MOBILE-ORDER', name: '移动点餐先锋套装', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false 
  },
  { 
    id: 1101, productId: 104, skuCode: 'BND-KITCHEN-EFF', name: '后厨效率提升套装', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false 
  },
  { 
    id: 1111, productId: 104, skuCode: 'BND-FSR-PREMIUM', name: 'FSR 高端尊享套装', 
    billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', 
    trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false 
  },
];

export const mockMedia: ProductMedia[] = [
  { id: 1, productId: 101, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '快餐版 POS 软件' },
  { id: 2, productId: 201, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '单屏收银机' },
  { id: 3, productId: 202, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '双屏收银机' },
];
