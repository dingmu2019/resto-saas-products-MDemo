import { ProductEntitlement } from '../../types';

export const mockFeatures = [
  { id: 1, code: 'module_inventory', name: '基础库存', type: 'boolean', description: '标准库存追踪功能。' },
  { id: 2, code: 'module_advanced_inventory', name: '高级库存', type: 'boolean', description: '多门店库存与采购订单管理。' },
  { id: 3, code: 'max_store_limit', name: '门店数量上限', type: 'quota', description: '允许开设的最大门店数量。' },
  { id: 4, code: 'max_users', name: '用户数量上限', type: 'quota', description: '最大员工账号数量。' },
  { id: 5, code: 'api_access', name: 'API 访问权限', type: 'boolean', description: '开发者 API 接口访问权限。' },
  { id: 6, code: 'custom_branding', name: '自定义品牌', type: 'boolean', description: '从小票中移除 RestoSuite 品牌标识。' },
  { id: 7, code: 'support_level', name: '技术支持级别', type: 'tier', description: 'SLA 与支持级别 (标准, 优先, 7x24小时)。' },
];

export const mockEntitlements: ProductEntitlement[] = [
  // Basic Monthly Entitlements
  { id: 1, skuId: 1011, featureCode: 'module_inventory', entitlementType: 'boolean', status: 'active' },
  { id: 2, skuId: 1011, featureCode: 'max_store_limit', entitlementType: 'quota', quotaValue: 1, status: 'active' },
  { id: 3, skuId: 1011, featureCode: 'max_users', entitlementType: 'quota', quotaValue: 5, status: 'active' },
  { id: 4, skuId: 1011, featureCode: 'support_level', entitlementType: 'tier', tierValue: '标准', status: 'active' },
  
  // Pro Monthly Entitlements (More features)
  { id: 5, skuId: 1013, featureCode: 'module_inventory', entitlementType: 'boolean', status: 'active' },
  { id: 6, skuId: 1013, featureCode: 'module_advanced_inventory', entitlementType: 'boolean', status: 'active' },
  { id: 7, skuId: 1013, featureCode: 'max_store_limit', entitlementType: 'quota', quotaValue: 5, status: 'active' },
  { id: 8, skuId: 1013, featureCode: 'max_users', entitlementType: 'quota', quotaValue: 25, status: 'active' },
  { id: 9, skuId: 1013, featureCode: 'api_access', entitlementType: 'boolean', status: 'active' },
  { id: 10, skuId: 1013, featureCode: 'custom_branding', entitlementType: 'boolean', status: 'active' },
  { id: 11, skuId: 1013, featureCode: 'support_level', entitlementType: 'tier', tierValue: '优先', status: 'active' },
];
