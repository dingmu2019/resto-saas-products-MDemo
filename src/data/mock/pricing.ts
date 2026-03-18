import { PriceBook, PriceBookEntry } from '../../types';

export const mockPriceBooks: PriceBook[] = [
  { id: 1, code: 'STD-USD', name: '标准美元价格本', currency: 'USD', type: 'standard', priceDisplayPrecision: 2, isActive: true, validFrom: '2026-01-01T00:00:00Z' },
  { id: 2, code: 'STD-EUR', name: '标准欧元价格本', currency: 'EUR', type: 'standard', priceDisplayPrecision: 2, isActive: true, validFrom: '2026-01-01T00:00:00Z' },
  { id: 3, code: 'PRT-T1', name: '一级代理商价格本', currency: 'USD', type: 'channel', priceDisplayPrecision: 2, isActive: true, validFrom: '2026-01-01T00:00:00Z' },
];

export const mockPriceBookEntries: PriceBookEntry[] = [
  // USD Pricing
  { id: 1, priceBookId: 1, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 79.00, minPrice: 69.00, maxDiscountRate: 0.15, validFrom: '2026-01-01T00:00:00Z' },
  { id: 2, priceBookId: 1, skuId: 1012, pricingStrategy: 'flat_fee', listPrice: 790.00, minPrice: 700.00, maxDiscountRate: 0.15, validFrom: '2026-01-01T00:00:00Z' },
  { id: 3, priceBookId: 1, skuId: 1013, pricingStrategy: 'flat_fee', listPrice: 149.00, minPrice: 129.00, maxDiscountRate: 0.15, validFrom: '2026-01-01T00:00:00Z' },
  { id: 4, priceBookId: 1, skuId: 1021, pricingStrategy: 'per_unit', listPrice: 499.00, minPrice: 450.00, msrp: 599.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 5, priceBookId: 1, skuId: 1022, pricingStrategy: 'per_unit', listPrice: 549.00, minPrice: 499.00, msrp: 649.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 6, priceBookId: 1, skuId: 1031, pricingStrategy: 'per_unit', listPrice: 249.00, minPrice: 220.00, msrp: 299.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 7, priceBookId: 1, skuId: 1032, pricingStrategy: 'per_unit', listPrice: 299.00, minPrice: 270.00, msrp: 349.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  { id: 8, priceBookId: 1, skuId: 1041, pricingStrategy: 'flat_fee', listPrice: 99.00, minPrice: 99.00, maxDiscountRate: 0.00, validFrom: '2026-01-01T00:00:00Z' }, // Bundle base price
  { id: 9, priceBookId: 1, skuId: 1051, pricingStrategy: 'flat_fee', listPrice: 49.00, minPrice: 39.00, maxDiscountRate: 0.20, validFrom: '2026-01-01T00:00:00Z' },
  { 
    id: 10, 
    priceBookId: 1, 
    skuId: 1061, 
    pricingStrategy: 'tiered', 
    listPrice: 150.00, 
    minPrice: 100.00, 
    maxDiscountRate: 0.00, 
    tierConfig: [
      { minQty: 1, maxQty: 10, price: 150.00 },
      { minQty: 11, maxQty: 50, price: 120.00 },
      { minQty: 51, maxQty: 9999, price: 100.00 }
    ],
    validFrom: '2026-01-01T00:00:00Z' 
  },
  { id: 11, priceBookId: 1, skuId: 1062, pricingStrategy: 'flat_fee', listPrice: 2400.00, minPrice: 2000.00, maxDiscountRate: 0.20, validFrom: '2026-01-01T00:00:00Z' },
  { id: 12, priceBookId: 1, skuId: 1071, pricingStrategy: 'per_unit', listPrice: 799.00, minPrice: 700.00, msrp: 899.00, maxDiscountRate: 0.15, validFrom: '2026-01-01T00:00:00Z' },
  { id: 13, priceBookId: 1, skuId: 1081, pricingStrategy: 'flat_fee', listPrice: 299.00, minPrice: 299.00, maxDiscountRate: 0.00, validFrom: '2026-01-01T00:00:00Z' }, // Enterprise Bundle base price

  // EUR Pricing (Slightly higher due to VAT inclusive expectations or market rates)
  { id: 14, priceBookId: 2, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 89.00, minPrice: 79.00, maxDiscountRate: 0.15, validFrom: '2026-01-01T00:00:00Z' },
  { id: 15, priceBookId: 2, skuId: 1021, pricingStrategy: 'per_unit', listPrice: 549.00, minPrice: 499.00, msrp: 649.00, maxDiscountRate: 0.10, validFrom: '2026-01-01T00:00:00Z' },
  
  // Partner Pricing (Deep discounts on Hardware)
  { id: 16, priceBookId: 3, skuId: 1021, pricingStrategy: 'per_unit', listPrice: 399.00, minPrice: 350.00, maxDiscountRate: 0.00, validFrom: '2026-01-01T00:00:00Z' },
  { id: 17, priceBookId: 3, skuId: 1031, pricingStrategy: 'per_unit', listPrice: 199.00, minPrice: 180.00, maxDiscountRate: 0.00, validFrom: '2026-01-01T00:00:00Z' },
];
