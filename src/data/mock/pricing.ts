import { PriceBook, PriceBookEntry } from '../../types';

export const mockPriceBooks: PriceBook[] = [
  { id: 1, code: 'PB-STD-USD', name: 'Global Standard (USD)', currency: 'USD', type: 'standard', priceDisplayPrecision: 2, isActive: true, validFrom: '2026-01-01T00:00:00Z' },
  { id: 2, code: 'PB-STD-CNY', name: '中国区标准价格 (CNY)', currency: 'CNY', type: 'standard', priceDisplayPrecision: 2, isActive: true, validFrom: '2026-01-01T00:00:00Z' },
  { id: 3, code: 'PB-PARTNER-USD', name: 'Tier 1 Partner (USD)', currency: 'USD', type: 'channel', priceDisplayPrecision: 2, isActive: true, validFrom: '2026-01-01T00:00:00Z' },
];

export const mockPriceBookEntries: PriceBookEntry[] = [
  // USD Standard
  { id: 1, priceBookId: 1, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 99.00, minPrice: 89.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 2, priceBookId: 1, skuId: 1012, pricingStrategy: 'flat_fee', listPrice: 990.00, minPrice: 800.00, maxDiscountRate: 0.20, validFrom: '2026-01-01T00:00:00Z' },
  { id: 3, priceBookId: 1, skuId: 2011, pricingStrategy: 'per_unit', listPrice: 599.00, minPrice: 549.00, msrp: 699.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 4, priceBookId: 1, skuId: 2021, pricingStrategy: 'per_unit', listPrice: 799.00, minPrice: 749.00, msrp: 899.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 5, priceBookId: 1, skuId: 4011, pricingStrategy: 'flat_fee', listPrice: 200.00, minPrice: 150.00, maxDiscountRate: 0.25, validFrom: '2026-01-01T00:00:00Z' },

  // CNY Standard
  { id: 11, priceBookId: 2, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 699.00, minPrice: 599.00, maxDiscountRate: 0.15, validFrom: '2026-01-01T00:00:00Z' },
  { id: 12, priceBookId: 2, skuId: 1012, pricingStrategy: 'flat_fee', listPrice: 6990.00, minPrice: 5990.00, maxDiscountRate: 0.20, validFrom: '2026-01-01T00:00:00Z' },
  { id: 13, priceBookId: 2, skuId: 2011, pricingStrategy: 'per_unit', listPrice: 3999.00, minPrice: 3599.00, msrp: 4599.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 14, priceBookId: 2, skuId: 2021, pricingStrategy: 'per_unit', listPrice: 5599.00, minPrice: 4999.00, msrp: 6599.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 15, priceBookId: 2, skuId: 4011, pricingStrategy: 'flat_fee', listPrice: 1200.00, minPrice: 1000.00, maxDiscountRate: 0.20, validFrom: '2026-01-01T00:00:00Z' },
];
