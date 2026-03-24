import { BundleGroup, BundleOption } from '../../types';

export const mockBundleGroups: BundleGroup[] = [
  // Bundle 1100: 快餐全能创业套装 (Starter Kit)
  {
    id: 1,
    bundleSkuId: 1100,
    name: '核心软件 (Core Software)',
    description: '选择您的 POS 软件订阅',
    selectN: 1,
    sortOrder: 1,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Core Software', description: 'Select your POS software subscription' },
      zh: { name: '核心软件', description: '选择您的 POS 软件订阅' }
    }
  },
  {
    id: 2,
    bundleSkuId: 1100,
    name: '终端硬件 (Terminal Hardware)',
    description: '选择您的主收银终端',
    selectN: 1,
    sortOrder: 2,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Terminal Hardware', description: 'Select your main terminal' },
      zh: { name: '终端硬件', description: '选择您的主收银终端' }
    }
  },
  {
    id: 3,
    bundleSkuId: 1100,
    name: '支付处理 (Payment Processing)',
    description: '集成支付处理服务',
    selectN: 1,
    sortOrder: 3,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Payment Processing', description: 'Integrated payment services' },
      zh: { name: '支付处理', description: '集成支付处理服务' }
    }
  },

  // Bundle 1101: 正餐豪华数字化套装 (Essentials Kit)
  {
    id: 4,
    bundleSkuId: 1101,
    name: '专业版软件 (Pro Software)',
    description: '包含高级库存与报表功能',
    selectN: 1,
    sortOrder: 1,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Pro Software', description: 'Includes advanced inventory and reporting' },
      zh: { name: '专业版软件', description: '包含高级库存与报表功能' }
    }
  },
  {
    id: 5,
    bundleSkuId: 1101,
    name: '后厨管理 (Kitchen Management)',
    description: 'KDS 或后厨打印机',
    selectN: 1,
    sortOrder: 2,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Kitchen Management', description: 'KDS or Kitchen Printer' },
      zh: { name: '后厨管理', description: 'KDS 或后厨打印机' }
    }
  },
  {
    id: 6,
    bundleSkuId: 1101,
    name: '外卖与线上点餐 (Online Ordering)',
    description: '开启您的线上业务',
    selectN: 1,
    sortOrder: 3,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Online Ordering', description: 'Start your online business' },
      zh: { name: '外卖与线上点餐', description: '开启您的线上业务' }
    }
  },

  // Bundle 1104: 全渠道营销增长套装 (Growth Kit)
  {
    id: 7,
    bundleSkuId: 1104,
    name: '企业版软件 (Enterprise Software)',
    description: '多店连锁管理核心',
    selectN: 1,
    sortOrder: 1,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Enterprise Software', description: 'Multi-location management core' },
      zh: { name: '企业版软件', description: '多店连锁管理核心' }
    }
  },
  {
    id: 8,
    bundleSkuId: 1104,
    name: '营销与忠诚度 (Marketing & Loyalty)',
    description: '提升顾客复购率',
    selectN: 2,
    sortOrder: 2,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Marketing & Loyalty', description: 'Increase customer retention' },
      zh: { name: '营销与忠诚度', description: '提升顾客复购率' }
    }
  },
  {
    id: 9,
    bundleSkuId: 1104,
    name: '高级硬件套装 (Premium Hardware)',
    description: '全套高性能硬件',
    selectN: 3,
    sortOrder: 3,
    allowMultipleQtyPerItem: true,
    translations: {
      en: { name: 'Premium Hardware', description: 'Full set of high-performance hardware' },
      zh: { name: '高级硬件套装', description: '全套高性能硬件' }
    }
  },
  {
    id: 10,
    bundleSkuId: 1105,
    name: '基础软件 (Core Software)',
    description: '选择您的核心软件模块 (3选3)',
    selectN: 3,
    sortOrder: 1,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { name: 'Core Software', description: 'Select your core software modules (Choose 3)' },
      zh: { name: '基础软件', description: '选择您的核心软件模块 (3选3)' }
    }
  },
  {
    id: 11,
    bundleSkuId: 1105,
    name: '核心硬件 (Core Hardware)',
    description: '开店必备核心硬件设备',
    selectN: 5,
    sortOrder: 2,
    allowMultipleQtyPerItem: true,
    translations: {
      en: { name: 'Core Hardware', description: 'Essential core hardware for your store' },
      zh: { name: '核心硬件', description: '开店必备核心硬件设备' }
    }
  }
];

export const mockBundleOptions: BundleOption[] = [
  // Starter Kit (1100) Options
  { id: 1, bundleSkuId: 1100, groupId: 1, componentSkuId: 1001, isDefault: true, pricingType: 'included', sortOrder: 1 },
  { id: 2, bundleSkuId: 1100, groupId: 2, componentSkuId: 1080, isDefault: true, pricingType: 'fixed_override', pricingValue: 499, sortOrder: 1 },
  { id: 3, bundleSkuId: 1100, groupId: 2, componentSkuId: 1082, isDefault: false, pricingType: 'fixed_override', pricingValue: 699, sortOrder: 2 },
  { id: 4, bundleSkuId: 1100, groupId: 3, componentSkuId: 1088, isDefault: true, pricingType: 'included', sortOrder: 1 },

  // Essentials Kit (1101) Options
  { id: 5, bundleSkuId: 1101, groupId: 4, componentSkuId: 1002, isDefault: true, pricingType: 'included', sortOrder: 1 },
  { id: 6, bundleSkuId: 1101, groupId: 5, componentSkuId: 1016, isDefault: true, pricingType: 'fixed_override', pricingValue: 199, sortOrder: 1 },
  { id: 7, bundleSkuId: 1101, groupId: 5, componentSkuId: 1085, isDefault: false, pricingType: 'fixed_override', pricingValue: 249, sortOrder: 2 },
  { id: 8, bundleSkuId: 1101, groupId: 6, componentSkuId: 1019, isDefault: true, pricingType: 'included', sortOrder: 1 },

  // Growth Kit (1104) Options
  { id: 9, bundleSkuId: 1104, groupId: 7, componentSkuId: 1011, isDefault: true, pricingType: 'included', sortOrder: 1 },
  { id: 10, bundleSkuId: 1104, groupId: 8, componentSkuId: 1028, isDefault: true, pricingType: 'included', sortOrder: 1 },
  { id: 11, bundleSkuId: 1104, groupId: 8, componentSkuId: 1031, isDefault: true, pricingType: 'included', sortOrder: 2 },
  { id: 12, bundleSkuId: 1104, groupId: 9, componentSkuId: 1081, isDefault: true, pricingType: 'fixed_override', pricingValue: 599, sortOrder: 1 },
  { id: 13, bundleSkuId: 1104, groupId: 9, componentSkuId: 1083, isDefault: true, pricingType: 'fixed_override', pricingValue: 799, sortOrder: 2 },
  { id: 14, bundleSkuId: 1104, groupId: 9, componentSkuId: 1085, isDefault: true, pricingType: 'fixed_override', pricingValue: 249, sortOrder: 3 },

  // RestoSuite All-in-One Bundle (1105) Options
  // Software Group (groupId: 10)
  { id: 15, bundleSkuId: 1105, groupId: 10, componentSkuId: 1001, isDefault: true, pricingType: 'included', sortOrder: 1 },
  { id: 16, bundleSkuId: 1105, groupId: 10, componentSkuId: 1041, isDefault: true, pricingType: 'included', sortOrder: 2 },
  { id: 17, bundleSkuId: 1105, groupId: 10, componentSkuId: 1042, isDefault: true, pricingType: 'included', sortOrder: 3 },
  // Hardware Group (groupId: 11)
  { id: 18, bundleSkuId: 1105, groupId: 11, componentSkuId: 1080, isDefault: true, pricingType: 'fixed_override', pricingValue: 450, sortOrder: 1 },
  { id: 19, bundleSkuId: 1105, groupId: 11, componentSkuId: 1085, isDefault: true, pricingType: 'fixed_override', pricingValue: 180, sortOrder: 2 }, // Kitchen Printer
  { id: 20, bundleSkuId: 1105, groupId: 11, componentSkuId: 1085, isDefault: true, pricingType: 'fixed_override', pricingValue: 180, sortOrder: 3 }, // Receipt Printer
  { id: 21, bundleSkuId: 1105, groupId: 11, componentSkuId: 1086, isDefault: true, pricingType: 'fixed_override', pricingValue: 99, sortOrder: 4 },
  { id: 22, bundleSkuId: 1105, groupId: 11, componentSkuId: 1092, isDefault: true, pricingType: 'fixed_override', pricingValue: 50, sortOrder: 5 }
];
