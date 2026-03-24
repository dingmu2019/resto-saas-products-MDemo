import { ProductFeature } from '../../types';

export const mockFeatures: ProductFeature[] = [
  { id: 1, code: 'FEAT_POS_CORE', name: '核心收银功能', type: 'boolean', description: '基础点餐、收银、小票打印功能。' },
  { id: 2, code: 'FEAT_INV_BASIC', name: '基础库存管理', type: 'boolean', description: '商品库存追踪与预警。' },
  { id: 3, code: 'FEAT_INV_ADV', name: '高级进销存', type: 'boolean', description: '多仓库、供应商管理、采购入库。' },
  { id: 4, code: 'LIMIT_STORES', name: '门店数量上限', type: 'quota', description: '允许开设的最大门店数量。' },
  { id: 5, code: 'LIMIT_USERS', name: '用户数量上限', type: 'quota', description: '最大后台管理账号数量。' },
  { id: 6, code: 'FEAT_API_ACCESS', name: '开放 API 访问', type: 'boolean', description: '支持第三方系统集成。' },
  { id: 7, code: 'FEAT_CRM_BASIC', name: '基础会员管理', type: 'boolean', description: '会员资料、积分、等级。' },
  { id: 8, code: 'SLA_LEVEL', name: '服务等级协议', type: 'tier', description: '响应时间与支持渠道 (Standard, Silver, Gold)。' },
  { id: 9, code: 'FEAT_MOBILE_ORDERING', name: '移动点餐支持', type: 'boolean', description: '支持手机 App 或小程序点餐。' },
  { id: 10, code: 'FEAT_KDS_INTEGRATION', name: 'KDS 厨房系统集成', type: 'boolean', description: '与厨房显示系统同步订单。' },
  { id: 11, code: 'LIMIT_PRODUCTS', name: '产品数量上限', type: 'quota', description: '允许创建的最大产品 SKU 数量。' },
  { id: 12, code: 'FEAT_ANALYTICS_ADV', name: '高级报表分析', type: 'boolean', description: '多维度销售、库存及经营数据分析。' },
];
