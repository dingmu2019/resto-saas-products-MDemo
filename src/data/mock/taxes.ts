import { TaxRegion, TaxRateMapping } from '../../types';

export const mockTaxRegions: TaxRegion[] = [
  { id: 1, parentId: null, regionCode: 'SG', countryCode: 'SG', name: 'Singapore', level: 'country', path: '/1/', isActive: true, translations: { en: { name: 'Singapore' }, zh: { name: '新加坡' } } },
  { id: 2, parentId: null, regionCode: 'MY', countryCode: 'MY', name: 'Malaysia', level: 'country', path: '/2/', isActive: true, translations: { en: { name: 'Malaysia' }, zh: { name: '马来西亚' } } },
  { id: 3, parentId: null, regionCode: 'TH', countryCode: 'TH', name: 'Thailand', level: 'country', path: '/3/', isActive: true, translations: { en: { name: 'Thailand' }, zh: { name: '泰国' } } },
  { id: 4, parentId: null, regionCode: 'AU', countryCode: 'AU', name: 'Australia', level: 'country', path: '/4/', isActive: true, translations: { en: { name: 'Australia' }, zh: { name: '澳大利亚' } } },
  { id: 5, parentId: null, regionCode: 'HK', countryCode: 'CN', name: 'Hong Kong, China', level: 'country', path: '/5/', isActive: true, translations: { en: { name: 'Hong Kong, China' }, zh: { name: '中国香港' } } },
  { id: 6, parentId: null, regionCode: 'CN', countryCode: 'CN', name: 'Mainland China', level: 'country', path: '/6/', isActive: true, translations: { en: { name: 'Mainland China' }, zh: { name: '中国大陆' } } },
];

export const mockTaxRates: TaxRateMapping[] = [
  // Singapore (GST 9%)
  { id: 1, taxRegionId: 1, productType: 'software', taxType: 'GST', taxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 2, taxRegionId: 1, productType: 'hardware', taxType: 'GST', taxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 3, taxRegionId: 1, productType: 'service', taxType: 'GST', taxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 4, taxRegionId: 1, productType: 'consumable', taxType: 'GST', taxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Malaysia (SST - Sales 10%, Service 6%)
  { id: 5, taxRegionId: 2, productType: 'software', taxType: 'SalesTax', taxRate: 0.06, taxName: 'Malaysia Service Tax 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },
  { id: 6, taxRegionId: 2, productType: 'hardware', taxType: 'SalesTax', taxRate: 0.10, taxName: 'Malaysia Sales Tax 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },
  { id: 7, taxRegionId: 2, productType: 'service', taxType: 'SalesTax', taxRate: 0.06, taxName: 'Malaysia Service Tax 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },
  { id: 8, taxRegionId: 2, productType: 'consumable', taxType: 'SalesTax', taxRate: 0.10, taxName: 'Malaysia Sales Tax 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },

  // Thailand (VAT 7%)
  { id: 9, taxRegionId: 3, productType: 'software', taxType: 'VAT', taxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 10, taxRegionId: 3, productType: 'hardware', taxType: 'VAT', taxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 11, taxRegionId: 3, productType: 'service', taxType: 'VAT', taxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 12, taxRegionId: 3, productType: 'consumable', taxType: 'VAT', taxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Australia (GST 10%)
  { id: 13, taxRegionId: 4, productType: 'software', taxType: 'GST', taxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 14, taxRegionId: 4, productType: 'hardware', taxType: 'GST', taxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 15, taxRegionId: 4, productType: 'service', taxType: 'GST', taxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 16, taxRegionId: 4, productType: 'consumable', taxType: 'GST', taxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Hong Kong (0%)
  { id: 17, taxRegionId: 5, productType: 'software', taxType: 'VAT', taxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 18, taxRegionId: 5, productType: 'hardware', taxType: 'VAT', taxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 19, taxRegionId: 5, productType: 'service', taxType: 'VAT', taxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 20, taxRegionId: 5, productType: 'consumable', taxType: 'VAT', taxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Mainland China (VAT 13% Hardware, 6% Software/Service)
  { id: 21, taxRegionId: 6, productType: 'software', taxType: 'VAT', taxRate: 0.06, taxName: '中国增值税 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 22, taxRegionId: 6, productType: 'hardware', taxType: 'VAT', taxRate: 0.13, taxName: '中国增值税 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 23, taxRegionId: 6, productType: 'service', taxType: 'VAT', taxRate: 0.06, taxName: '中国增值税 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 24, taxRegionId: 6, productType: 'consumable', taxType: 'VAT', taxRate: 0.13, taxName: '中国增值税 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
];
