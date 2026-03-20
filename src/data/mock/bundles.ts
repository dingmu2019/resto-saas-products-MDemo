import { BundleGroup, BundleOption } from '../../types';

export const mockBundleGroups: BundleGroup[] = [
  // QSR Starter Kit Groups
  { id: 1, bundleSkuId: 1041, name: '核心软件', description: '选择您的软件订阅版本', selectN: 1, sortOrder: 1, allowMultipleQtyPerItem: false },
  { id: 2, bundleSkuId: 1041, name: 'POS 收银硬件', description: '选择您的收银机和打印机', selectN: 3, sortOrder: 2, allowMultipleQtyPerItem: true },
  
  // Enterprise Mega Stack Groups
  { id: 3, bundleSkuId: 1081, name: '企业级软件', description: '企业版必须搭配专业版软件', selectN: 1, sortOrder: 1, allowMultipleQtyPerItem: false },
  { id: 4, bundleSkuId: 1081, name: '后厨与前厅硬件', description: '为您的整个餐厅配备硬件', selectN: 10, sortOrder: 2, allowMultipleQtyPerItem: true },
  { id: 5, bundleSkuId: 1081, name: '专业服务', description: '实施与技术支持服务', selectN: 2, sortOrder: 3, allowMultipleQtyPerItem: true },

  // Mobile Order Bundle (1091)
  { id: 6, bundleSkuId: 1091, name: '移动端软件', description: '移动端点餐核心软件', selectN: 1, sortOrder: 1, allowMultipleQtyPerItem: false },
  { id: 7, bundleSkuId: 1091, name: '移动外设', description: '便携式打印机等', selectN: 2, sortOrder: 2, allowMultipleQtyPerItem: true },

  // Kitchen Efficiency Bundle (1101)
  { id: 8, bundleSkuId: 1101, name: '厨房显示系统', description: 'KDS 核心组件', selectN: 2, sortOrder: 1, allowMultipleQtyPerItem: true },
  { id: 9, bundleSkuId: 1101, name: '配套打印', description: '厨房专用打印机', selectN: 1, sortOrder: 2, allowMultipleQtyPerItem: false },

  // FSR Premium Bundle (1111)
  { id: 10, bundleSkuId: 1111, name: '高端软件套装', description: '全功能正餐版', selectN: 1, sortOrder: 1, allowMultipleQtyPerItem: false },
  { id: 11, bundleSkuId: 1111, name: '高端硬件套装', description: '双屏 POS 终端', selectN: 1, sortOrder: 2, allowMultipleQtyPerItem: false },
  { id: 12, bundleSkuId: 1111, name: '尊享服务', description: '年度技术支持', selectN: 1, sortOrder: 3, allowMultipleQtyPerItem: false },
];

export const mockBundleOptions: BundleOption[] = [
  // QSR Starter Kit - Software
  { id: 1, bundleSkuId: 1041, groupId: 1, componentSkuId: 1011, isDefault: true, pricingType: 'included', sortOrder: 1 },
  { id: 2, bundleSkuId: 1041, groupId: 1, componentSkuId: 1013, isDefault: false, pricingType: 'price_adjustment', pricingValue: 50.00, sortOrder: 2 },
  
  // QSR Starter Kit - Hardware
  { id: 3, bundleSkuId: 1041, groupId: 2, componentSkuId: 1021, isDefault: true, pricingType: 'fixed_override', pricingValue: 399.00, sortOrder: 1 },
  { id: 4, bundleSkuId: 1041, groupId: 2, componentSkuId: 1031, isDefault: true, pricingType: 'fixed_override', pricingValue: 199.00, sortOrder: 2 },
  
  // Enterprise Mega Stack - Software
  { id: 5, bundleSkuId: 1081, groupId: 3, componentSkuId: 1013, isDefault: true, pricingType: 'included', sortOrder: 1 },
  { id: 6, bundleSkuId: 1081, groupId: 3, componentSkuId: 1051, isDefault: true, pricingType: 'included', sortOrder: 2 },
  
  // Enterprise Mega Stack - Hardware
  { id: 7, bundleSkuId: 1081, groupId: 4, componentSkuId: 1022, isDefault: true, pricingType: 'fixed_override', pricingValue: 450.00, sortOrder: 1 },
  { id: 8, bundleSkuId: 1081, groupId: 4, componentSkuId: 1071, isDefault: true, pricingType: 'fixed_override', pricingValue: 600.00, sortOrder: 2 },
  { id: 9, bundleSkuId: 1081, groupId: 4, componentSkuId: 1032, isDefault: true, pricingType: 'fixed_override', pricingValue: 250.00, sortOrder: 3 },
  
  // Enterprise Mega Stack - Services
  { id: 10, bundleSkuId: 1081, groupId: 5, componentSkuId: 1062, isDefault: false, pricingType: 'price_adjustment', pricingValue: -500.00, sortOrder: 1 },
  { id: 11, bundleSkuId: 1081, groupId: 5, componentSkuId: 1061, isDefault: false, pricingType: 'included', sortOrder: 2 },

  // Mobile Order Bundle - Software
  { id: 12, bundleSkuId: 1091, groupId: 6, componentSkuId: 1011, isDefault: true, pricingType: 'included', sortOrder: 1 },
  // Mobile Order Bundle - Hardware
  { id: 13, bundleSkuId: 1091, groupId: 7, componentSkuId: 1032, isDefault: true, pricingType: 'fixed_override', pricingValue: 220.00, sortOrder: 1 },

  // Kitchen Efficiency Bundle - Hardware
  { id: 14, bundleSkuId: 1101, groupId: 8, componentSkuId: 1071, isDefault: true, pricingType: 'fixed_override', pricingValue: 550.00, sortOrder: 1 },
  { id: 15, bundleSkuId: 1101, groupId: 9, componentSkuId: 1032, isDefault: true, pricingType: 'fixed_override', pricingValue: 240.00, sortOrder: 1 },

  // FSR Premium Bundle - Software
  { id: 16, bundleSkuId: 1111, groupId: 10, componentSkuId: 1013, isDefault: true, pricingType: 'included', sortOrder: 1 },
  // FSR Premium Bundle - Hardware
  { id: 17, bundleSkuId: 1111, groupId: 11, componentSkuId: 1022, isDefault: true, pricingType: 'fixed_override', pricingValue: 480.00, sortOrder: 1 },
  // FSR Premium Bundle - Services
  { id: 18, bundleSkuId: 1111, groupId: 12, componentSkuId: 1062, isDefault: true, pricingType: 'price_adjustment', pricingValue: -200.00, sortOrder: 1 },
];
