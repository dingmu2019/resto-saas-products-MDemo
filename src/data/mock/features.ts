import { ProductEntitlement } from '../../types';

export const mockFeatures = [
  { id: 1, code: 'FEAT_POS_CORE', name: '核心收银功能', type: 'boolean', description: '基础点餐、收银、小票打印功能。' },
  { id: 2, code: 'FEAT_INV_BASIC', name: '基础库存管理', type: 'boolean', description: '商品库存追踪与预警。' },
  { id: 3, code: 'FEAT_INV_ADV', name: '高级进销存', type: 'boolean', description: '多仓库、供应商管理、采购入库。' },
  { id: 4, code: 'LIMIT_STORES', name: '门店数量上限', type: 'quota', description: '允许开设的最大门店数量。' },
  { id: 5, code: 'LIMIT_USERS', name: '用户数量上限', type: 'quota', description: '最大后台管理账号数量。' },
  { id: 6, code: 'FEAT_API_ACCESS', name: '开放 API 访问', type: 'boolean', description: '支持第三方系统集成。' },
  { id: 7, code: 'FEAT_CRM_BASIC', name: '基础会员管理', type: 'boolean', description: '会员资料、积分、等级。' },
  { id: 8, code: 'SLA_LEVEL', name: '服务等级协议', type: 'tier', description: '响应时间与支持渠道 (Standard, Silver, Gold)。' },
];

export const mockEntitlements: ProductEntitlement[] = [
  // RS-QSR-M (1011) Entitlements
  { id: 1, skuId: 1011, featureCode: 'FEAT_POS_CORE', entitlementType: 'boolean', status: 'active' },
  { id: 2, skuId: 1011, featureCode: 'FEAT_INV_BASIC', entitlementType: 'boolean', status: 'active' },
  { id: 3, skuId: 1011, featureCode: 'LIMIT_STORES', entitlementType: 'quota', quotaValue: 1, status: 'active' },
  { id: 4, skuId: 1011, featureCode: 'LIMIT_USERS', entitlementType: 'quota', quotaValue: 5, status: 'active' },
  { id: 5, skuId: 1011, featureCode: 'SLA_LEVEL', entitlementType: 'tier', tierValue: 'Standard', status: 'active' },
  
  // RS-QSR-A (1012) Entitlements (Same as monthly but maybe some bonus)
  { id: 6, skuId: 1012, featureCode: 'FEAT_POS_CORE', entitlementType: 'boolean', status: 'active' },
  { id: 7, skuId: 1012, featureCode: 'FEAT_INV_BASIC', entitlementType: 'boolean', status: 'active' },
  { id: 8, skuId: 1012, featureCode: 'LIMIT_STORES', entitlementType: 'quota', quotaValue: 1, status: 'active' },
  { id: 9, skuId: 1012, featureCode: 'LIMIT_USERS', entitlementType: 'quota', quotaValue: 10, status: 'active' }, // Bonus users for annual
  { id: 10, skuId: 1012, featureCode: 'SLA_LEVEL', entitlementType: 'tier', tierValue: 'Silver', status: 'active' }, // Better SLA for annual
];
