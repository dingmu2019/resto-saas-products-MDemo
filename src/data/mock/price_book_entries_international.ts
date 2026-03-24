import { PriceBookEntry } from '../../types';

export const mockInternationalPriceBookEntries: PriceBookEntry[] = [
  // Singapore (PB 4)
  { id: 2001, priceBookId: 4, skuId: 1001, pricingStrategy: 'flat_fee', listPrice: 66, minPrice: 50, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2002, priceBookId: 4, skuId: 1002, pricingStrategy: 'flat_fee', listPrice: 660, minPrice: 500, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2003, priceBookId: 4, skuId: 1003, pricingStrategy: 'flat_fee', listPrice: 2025, minPrice: 1800, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2004, priceBookId: 4, skuId: 1007, pricingStrategy: 'flat_fee', listPrice: 675, minPrice: 600, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2005, priceBookId: 4, skuId: 1009, pricingStrategy: 'flat_fee', listPrice: 175, minPrice: 150, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2006, priceBookId: 4, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 135, minPrice: 100, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2007, priceBookId: 4, skuId: 1023, pricingStrategy: 'flat_fee', listPrice: 270, minPrice: 200, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2008, priceBookId: 4, skuId: 1027, pricingStrategy: 'flat_fee', listPrice: 2700, minPrice: 2400, validFrom: '2024-01-01T00:00:00Z' },

  // Malaysia (PB 5)
  { id: 2011, priceBookId: 5, skuId: 1001, pricingStrategy: 'flat_fee', listPrice: 230, minPrice: 180, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2012, priceBookId: 5, skuId: 1002, pricingStrategy: 'flat_fee', listPrice: 2300, minPrice: 1800, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2013, priceBookId: 5, skuId: 1003, pricingStrategy: 'flat_fee', listPrice: 7050, minPrice: 6000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2014, priceBookId: 5, skuId: 1007, pricingStrategy: 'flat_fee', listPrice: 2350, minPrice: 2000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2015, priceBookId: 5, skuId: 1009, pricingStrategy: 'flat_fee', listPrice: 600, minPrice: 500, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2016, priceBookId: 5, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 465, minPrice: 400, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2017, priceBookId: 5, skuId: 1023, pricingStrategy: 'flat_fee', listPrice: 935, minPrice: 800, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2018, priceBookId: 5, skuId: 1027, pricingStrategy: 'flat_fee', listPrice: 9400, minPrice: 8000, validFrom: '2024-01-01T00:00:00Z' },

  // Thailand (PB 6)
  { id: 2021, priceBookId: 6, skuId: 1001, pricingStrategy: 'flat_fee', listPrice: 1760, minPrice: 1400, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2022, priceBookId: 6, skuId: 1002, pricingStrategy: 'flat_fee', listPrice: 17600, minPrice: 14000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2023, priceBookId: 6, skuId: 1003, pricingStrategy: 'flat_fee', listPrice: 54000, minPrice: 48000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2024, priceBookId: 6, skuId: 1007, pricingStrategy: 'flat_fee', listPrice: 18000, minPrice: 16000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2025, priceBookId: 6, skuId: 1009, pricingStrategy: 'flat_fee', listPrice: 4650, minPrice: 4000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2026, priceBookId: 6, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 3560, minPrice: 3000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2027, priceBookId: 6, skuId: 1023, pricingStrategy: 'flat_fee', listPrice: 7160, minPrice: 6000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2028, priceBookId: 6, skuId: 1027, pricingStrategy: 'flat_fee', listPrice: 72000, minPrice: 64000, validFrom: '2024-01-01T00:00:00Z' },

  // Australia (PB 7)
  { id: 2031, priceBookId: 7, skuId: 1001, pricingStrategy: 'flat_fee', listPrice: 75, minPrice: 60, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2032, priceBookId: 7, skuId: 1002, pricingStrategy: 'flat_fee', listPrice: 750, minPrice: 600, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2033, priceBookId: 7, skuId: 1003, pricingStrategy: 'flat_fee', listPrice: 2250, minPrice: 2000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2034, priceBookId: 7, skuId: 1007, pricingStrategy: 'flat_fee', listPrice: 750, minPrice: 650, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2035, priceBookId: 7, skuId: 1009, pricingStrategy: 'flat_fee', listPrice: 195, minPrice: 160, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2036, priceBookId: 7, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 150, minPrice: 120, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2037, priceBookId: 7, skuId: 1023, pricingStrategy: 'flat_fee', listPrice: 300, minPrice: 250, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2038, priceBookId: 7, skuId: 1027, pricingStrategy: 'flat_fee', listPrice: 3000, minPrice: 2600, validFrom: '2024-01-01T00:00:00Z' },

  // Hong Kong (PB 8)
  { id: 2041, priceBookId: 8, skuId: 1001, pricingStrategy: 'flat_fee', listPrice: 380, minPrice: 300, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2042, priceBookId: 8, skuId: 1002, pricingStrategy: 'flat_fee', listPrice: 3800, minPrice: 3000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2043, priceBookId: 8, skuId: 1003, pricingStrategy: 'flat_fee', listPrice: 11700, minPrice: 10000, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2044, priceBookId: 8, skuId: 1007, pricingStrategy: 'flat_fee', listPrice: 3900, minPrice: 3500, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2045, priceBookId: 8, skuId: 1009, pricingStrategy: 'flat_fee', listPrice: 1000, minPrice: 850, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2046, priceBookId: 8, skuId: 1011, pricingStrategy: 'flat_fee', listPrice: 770, minPrice: 650, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2047, priceBookId: 8, skuId: 1023, pricingStrategy: 'flat_fee', listPrice: 1550, minPrice: 1300, validFrom: '2024-01-01T00:00:00Z' },
  { id: 2048, priceBookId: 8, skuId: 1027, pricingStrategy: 'flat_fee', listPrice: 15600, minPrice: 14000, validFrom: '2024-01-01T00:00:00Z' }
];
