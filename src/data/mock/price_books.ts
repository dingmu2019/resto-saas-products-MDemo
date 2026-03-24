import { PriceBook } from '../../types';

export const mockPriceBooks: PriceBook[] = [
  {
    id: 1,
    code: 'PB-CN-RETAIL',
    name: '中国区零售价目表',
    currency: 'CNY',
    applicableRegions: ['CN'],
    type: 'standard',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'China Retail Price Book' },
      zh: { name: '中国区零售价目表' }
    }
  },
  {
    id: 2,
    code: 'PB-CN-PARTNER',
    name: '中国区合作伙伴价目表',
    currency: 'CNY',
    applicableRegions: ['CN'],
    type: 'channel',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'China Partner Price Book' },
      zh: { name: '中国区合作伙伴价目表' }
    }
  },
  {
    id: 3,
    code: 'PB-US-RETAIL',
    name: '美国区零售价目表',
    currency: 'USD',
    applicableRegions: ['US'],
    type: 'standard',
    isActive: true,
    priceDisplayPrecision: 2,
    validFrom: '2024-01-01T00:00:00Z',
    translations: {
      en: { name: 'US Retail Price Book' },
      zh: { name: '美国区零售价目表' }
    }
  }
];
