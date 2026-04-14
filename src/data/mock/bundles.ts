import { BundleGroup, BundleOption } from '../../types';

export const mockBundleGroups: BundleGroup[] = [
  // Bundle 1100: 快餐专业版套装 (QSR Pro Bundle)
  {
    id: 1,
    bundleSkuId: 1100,
    groupName: '核心软件 (Core Software)',
    description: '选择您的 POS 软件订阅版本',
    minSelections: 1,
    maxSelections: 1,
    isMutuallyExclusive: true,
    sortOrder: 1,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { groupName: 'Core Software', description: 'Select your POS software subscription' },
      zh: { groupName: '核心软件', description: '选择您的 POS 软件订阅版本' }
    }
  },
  {
    id: 2,
    bundleSkuId: 1100,
    groupName: '收银终端 (POS Terminal)',
    description: '选择适合您店面的收银硬件',
    minSelections: 1,
    maxSelections: 1,
    isMutuallyExclusive: true,
    sortOrder: 2,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { groupName: 'POS Terminal', description: 'Select the hardware for your store' },
      zh: { groupName: '收银终端', description: '选择适合您店面的收银硬件' }
    }
  },
  {
    id: 3,
    bundleSkuId: 1100,
    groupName: '打印设备 (Printers)',
    description: '选择小票或标签打印机',
    minSelections: 1,
    maxSelections: 2,
    isMutuallyExclusive: false,
    sortOrder: 3,
    allowMultipleQtyPerItem: true,
    translations: {
      en: { groupName: 'Printers', description: 'Select receipt or label printers' },
      zh: { groupName: '打印设备', description: '选择小票或标签打印机' }
    }
  },

  // Bundle 1101: 快餐企业版套装 (QSR Enterprise Bundle)
  {
    id: 4,
    bundleSkuId: 1101,
    groupName: '企业级软件 (Enterprise Software)',
    description: '包含多店管理与高级报表',
    minSelections: 1,
    maxSelections: 1,
    isMutuallyExclusive: true,
    sortOrder: 1,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { groupName: 'Enterprise Software', description: 'Includes multi-store management and advanced reporting' },
      zh: { groupName: '企业级软件', description: '包含多店管理与高级报表' }
    }
  },
  {
    id: 5,
    bundleSkuId: 1101,
    groupName: '连锁管理模块 (Chain Management)',
    description: '总部集中管理功能',
    minSelections: 1,
    maxSelections: 1,
    isMutuallyExclusive: true,
    sortOrder: 2,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { groupName: 'Chain Management', description: 'Centralized HQ management functions' },
      zh: { groupName: '连锁管理模块', description: '总部集中管理功能' }
    }
  },
  {
    id: 6,
    bundleSkuId: 1101,
    groupName: '高级硬件套装 (Premium Hardware)',
    description: '高性能双屏收银终端',
    minSelections: 1,
    maxSelections: 1,
    isMutuallyExclusive: true,
    sortOrder: 3,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { groupName: 'Premium Hardware', description: 'High-performance dual-screen terminals' },
      zh: { groupName: '高级硬件套装', description: '高性能双屏收银终端' }
    }
  },
  {
    id: 7,
    bundleSkuId: 1101,
    groupName: '增值服务 (Value-added Services)',
    description: '提升运营效率的额外服务',
    minSelections: 0,
    maxSelections: 3,
    isMutuallyExclusive: false,
    sortOrder: 4,
    allowMultipleQtyPerItem: false,
    translations: {
      en: { groupName: 'Value-added Services', description: 'Extra services to boost operational efficiency' },
      zh: { groupName: '增值服务', description: '提升运营效率的额外服务' }
    }
  }
];

export const mockBundleOptions: BundleOption[] = [
  // QSR Pro Bundle (1100) Options
  { id: 1, bundleSkuId: 1100, groupId: 1, componentSkuId: 1001, isDefault: true,  sortOrder: 1 }, // Monthly
  { id: 2, bundleSkuId: 1100, groupId: 1, componentSkuId: 1002, isDefault: false, sortOrder: 2 }, // Annual
  { id: 3, bundleSkuId: 1100, groupId: 2, componentSkuId: 1080, isDefault: true,  sortOrder: 1 }, // Single Screen Std
  { id: 4, bundleSkuId: 1100, groupId: 2, componentSkuId: 1081, isDefault: false, sortOrder: 2 }, // Single Screen Pro
  { id: 5, bundleSkuId: 1100, groupId: 3, componentSkuId: 1085, isDefault: true,  sortOrder: 1 }, // Receipt Printer
  { id: 6, bundleSkuId: 1100, groupId: 3, componentSkuId: 1086, isDefault: false, sortOrder: 2 }, // Label Printer

  // QSR Enterprise Bundle (1101) Options
  { id: 7, bundleSkuId: 1101, groupId: 4, componentSkuId: 1011, isDefault: true,  sortOrder: 1 }, // Enterprise Monthly
  { id: 8, bundleSkuId: 1101, groupId: 4, componentSkuId: 1012, isDefault: false, sortOrder: 2 }, // Enterprise Annual
  { id: 9, bundleSkuId: 1101, groupId: 5, componentSkuId: 1014, isDefault: true,  sortOrder: 1 }, // HQ Manager
  { id: 10, bundleSkuId: 1101, groupId: 6, componentSkuId: 1082, isDefault: true,  sortOrder: 1 }, // Dual Screen Std
  { id: 11, bundleSkuId: 1101, groupId: 6, componentSkuId: 1083, isDefault: false, sortOrder: 2 }, // Dual Screen Pro
  { id: 12, bundleSkuId: 1101, groupId: 7, componentSkuId: 1023, isDefault: false, sortOrder: 1 }, // Installation
  { id: 13, bundleSkuId: 1101, groupId: 7, componentSkuId: 1024, isDefault: false, sortOrder: 2 }, // Training
  { id: 14, bundleSkuId: 1101, groupId: 7, componentSkuId: 1025, isDefault: false, sortOrder: 3 }  // Remote Support
];
