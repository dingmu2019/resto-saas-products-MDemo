import { ProductSku } from '../../types';

export const mockBundleSkus: ProductSku[] = [
  {
    id: 1100,
    productId: 151,
    skuCode: 'SKU-BND-QSR-PRO',
    name: '快餐专业版套装 (QSR Pro Bundle)',
    billingModel: 'one_time',
    billingTerm: 'none',
    billingTiming: 'in_advance',
    trialDays: 0,
    uom: 'Bundle',
    lifecycleStatus: 'active',
    isShippable: true,
    isSerialized: false,
    translations: {
      en: { name: 'Quick Service Pro Bundle' },
      zh: { name: '快餐专业版套装' }
    }
  },
  {
    id: 1101,
    productId: 151,
    skuCode: 'SKU-BND-QSR-ENT',
    name: '快餐企业版套装 (QSR Enterprise Bundle)',
    billingModel: 'one_time',
    billingTerm: 'none',
    billingTiming: 'in_advance',
    trialDays: 0,
    uom: 'Bundle',
    lifecycleStatus: 'active',
    isShippable: true,
    isSerialized: false,
    translations: {
      en: { name: 'Quick Service Enterprise Bundle' },
      zh: { name: '快餐企业版套装' }
    }
  },
  {
    id: 1102,
    productId: 153,
    skuCode: 'SKU-BND-153-1',
    name: '移动点餐先锋套装 - 标准版',
    billingModel: 'one_time',
    billingTerm: 'none',
    billingTiming: 'in_advance',
    trialDays: 0,
    uom: 'Bundle',
    lifecycleStatus: 'active',
    isShippable: true,
    isSerialized: false,
    translations: {
      en: { name: 'Mobile Ordering Bundle - Standard' },
      zh: { name: '移动点餐先锋套装 - 标准版' }
    }
  },
  {
    id: 1103,
    productId: 154,
    skuCode: 'SKU-BND-154-1',
    name: '后厨效率提升套装 - 标准版',
    billingModel: 'one_time',
    billingTerm: 'none',
    billingTiming: 'in_advance',
    trialDays: 0,
    uom: 'Bundle',
    lifecycleStatus: 'active',
    isShippable: true,
    isSerialized: false,
    translations: {
      en: { name: 'Kitchen Efficiency Bundle - Standard' },
      zh: { name: '后厨效率提升套装 - 标准版' }
    }
  },
  {
    id: 1104,
    productId: 155,
    skuCode: 'SKU-BND-155-1',
    name: '全渠道营销增长套装 - 标准版',
    billingModel: 'one_time',
    billingTerm: 'none',
    billingTiming: 'in_advance',
    trialDays: 0,
    uom: 'Bundle',
    lifecycleStatus: 'active',
    isShippable: true,
    isSerialized: false,
    translations: {
      en: { name: 'Omnichannel Growth Bundle - Standard' },
      zh: { name: '全渠道营销增长套装 - 标准版' }
    }
  },
  {
    id: 1105,
    productId: 157,
    skuCode: 'SKU-BND-148-1',
    name: 'RestoSuite 餐饮全能开店套餐 - 旗舰版',
    billingModel: 'one_time',
    billingTerm: 'none',
    billingTiming: 'in_advance',
    trialDays: 0,
    uom: 'Bundle',
    lifecycleStatus: 'active',
    isShippable: true,
    isSerialized: false,
    translations: {
      en: { name: 'RestoSuite F&B All-in-One Bundle - Ultimate' },
      zh: { name: 'RestoSuite 餐饮全能开店套餐 - 旗舰版' }
    }
  }
];
