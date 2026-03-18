import { Category, Product, ProductSku, ProductMedia } from '../../types';

export const mockCategories: Category[] = [
  { id: 1, parentId: null, name: '软件', code: 'SW', description: '核心软件许可与订阅', isActive: true, level: 1, path: '/1/', sortOrder: 1 },
  { id: 2, parentId: null, name: '硬件', code: 'HW', description: '物理设备与配件', isActive: true, level: 1, path: '/2/', sortOrder: 2 },
  { id: 3, parentId: null, name: '服务', code: 'SVC', description: '专业服务与技术支持', isActive: true, level: 1, path: '/3/', sortOrder: 3 },
  { id: 4, parentId: null, name: '套餐', code: 'BNDL', description: '预打包解决方案', isActive: true, level: 1, path: '/4/', sortOrder: 4 },
  { id: 5, parentId: 1, name: '附加组件', code: 'SW-ADD', description: '软件扩展与模块', isActive: true, level: 2, path: '/1/5/', sortOrder: 5 },
];

export const mockProducts: Product[] = [
  { id: 101, categoryId: 1, productCode: 'RS-CORE', name: 'RestoSuite 餐饮系统', productType: 'software', description: '餐厅核心销售终端(POS)软件' },
  { id: 102, categoryId: 2, productCode: 'HW-TERM-V1', name: 'RestoTerminal 经典收银机', productType: 'hardware', description: '标准15英寸触摸屏收银终端' },
  { id: 103, categoryId: 2, productCode: 'HW-PRN-01', name: '热敏小票打印机', productType: 'hardware', description: '带自动切刀的高速热敏打印机' },
  { id: 104, categoryId: 4, productCode: 'BNDL-QSR', name: '快餐店(QSR)入门套装', productType: 'bundle', description: '开办快餐店所需的一切软硬件' },
  { id: 105, categoryId: 5, productCode: 'SW-ANA', name: '高级数据分析', productType: 'software', description: '深度洞察与数据报表看板' },
  { id: 106, categoryId: 3, productCode: 'SVC-SUP', name: '尊享技术支持', productType: 'service', description: '7x24小时优先电话与远程支持' },
  { id: 107, categoryId: 2, productCode: 'HW-KDS', name: '厨房显示系统(KDS)', productType: 'hardware', description: '坚固耐用的22英寸厨房显示屏' },
  { id: 108, categoryId: 4, productCode: 'BNDL-ENT', name: '企业级旗舰套装', productType: 'bundle', description: '适用于大型连锁餐厅的全套解决方案' },
];

export const mockSkus: ProductSku[] = [
  // Software SKUs
  { id: 1011, productId: 101, skuCode: 'RS-CORE-M', name: 'RestoSuite 基础版 (月付)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1012, productId: 101, skuCode: 'RS-CORE-A', name: 'RestoSuite 基础版 (年付)', billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1013, productId: 101, skuCode: 'RS-PRO-M', name: 'RestoSuite 专业版 (月付)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  
  // Hardware SKUs
  { id: 1021, productId: 102, skuCode: 'HW-TERM-V1-BLK', name: 'RestoTerminal 经典收银机 (黑色)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1022, productId: 102, skuCode: 'HW-TERM-V1-WHT', name: 'RestoTerminal 经典收银机 (白色)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1031, productId: 103, skuCode: 'HW-PRN-USB', name: '热敏打印机 (USB版)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1032, productId: 103, skuCode: 'HW-PRN-WIFI', name: '热敏打印机 (WiFi/网线版)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1071, productId: 107, skuCode: 'HW-KDS-22', name: 'KDS 厨房屏幕 22寸', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },

  // Add-ons & Services
  { id: 1051, productId: 105, skuCode: 'SW-ANA-M', name: '数据分析插件 (月付)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 0, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1061, productId: 106, skuCode: 'SVC-SUP-HR', name: '技术支持 (按小时计费)', billingModel: 'usage_based', billingTerm: 'monthly', billingTiming: 'in_arrears', trialDays: 0, uom: 'Hour', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1062, productId: 106, skuCode: 'SVC-SUP-ANN', name: '尊享技术支持包 (年付)', billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', trialDays: 0, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },

  // Bundle SKUs
  { id: 1041, productId: 104, skuCode: 'BNDL-QSR-M', name: '快餐店入门套装 (月付订阅)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false },
  { id: 1081, productId: 108, skuCode: 'BNDL-ENT-A', name: '企业级旗舰套装 (年付订阅)', billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false },
];

export const mockMedia: ProductMedia[] = [
  { id: 1, productId: 101, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: 'POS 软件看板' },
  { id: 2, productId: 102, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '收银硬件终端' },
  { id: 3, productId: 104, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '快餐店入门套装' },
  { id: 4, productId: 107, mediaType: 'image', url: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '厨房显示系统' },
  { id: 5, productId: 105, mediaType: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '数据分析看板' },
  { id: 6, productId: 103, mediaType: 'image', url: 'https://images.unsplash.com/photo-1624969862644-791f3dc98927?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'zh', title: '小票打印机' },
];
