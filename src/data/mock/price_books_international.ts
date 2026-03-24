import { PriceBook } from '../../types';

export const mockInternationalPriceBooks: PriceBook[] = [
  {
    id: 4,
    code: 'PB-SG-RETAIL',
    name: '新加坡零售价目表',
    currency: 'SGD',
    applicableRegions: ['SG'],
    type: 'standard',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'Singapore Retail Price Book' },
      zh: { name: '新加坡零售价目表' }
    }
  },
  {
    id: 5,
    code: 'PB-MY-RETAIL',
    name: '马来西亚零售价目表',
    currency: 'MYR',
    applicableRegions: ['MY'],
    type: 'standard',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'Malaysia Retail Price Book' },
      zh: { name: '马来西亚零售价目表' }
    }
  },
  {
    id: 6,
    code: 'PB-TH-RETAIL',
    name: '泰国零售价目表',
    currency: 'THB',
    applicableRegions: ['TH'],
    type: 'standard',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'Thailand Retail Price Book' },
      zh: { name: '泰国零售价目表' }
    }
  },
  {
    id: 7,
    code: 'PB-AU-RETAIL',
    name: '澳大利亚零售价目表',
    currency: 'AUD',
    applicableRegions: ['AU'],
    type: 'standard',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'Australia Retail Price Book' },
      zh: { name: '澳大利亚零售价目表' }
    }
  },
  {
    id: 8,
    code: 'PB-HK-RETAIL',
    name: '中国香港零售价目表',
    currency: 'HKD',
    applicableRegions: ['HK'],
    type: 'standard',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'Hong Kong Retail Price Book' },
      zh: { name: '中国香港零售价目表' }
    }
  }
];
