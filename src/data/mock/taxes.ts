import { TaxRegion, TaxRateMapping } from '../../types';

export const mockTaxRegions: TaxRegion[] = [
  { id: 1, parentId: null, regionCode: 'SG', countryCode: 'SG', name: 'Singapore', level: 'country', path: '/1/', isActive: true, translations: { en: { name: 'Singapore' }, zh: { name: '新加坡' } } },
  { id: 2, parentId: null, regionCode: 'MY', countryCode: 'MY', name: 'Malaysia', level: 'country', path: '/2/', isActive: true, translations: { en: { name: 'Malaysia' }, zh: { name: '马来西亚' } } },
  { id: 3, parentId: null, regionCode: 'TH', countryCode: 'TH', name: 'Thailand', level: 'country', path: '/3/', isActive: true, translations: { en: { name: 'Thailand' }, zh: { name: '泰国' } } },
  { id: 4, parentId: null, regionCode: 'AU', countryCode: 'AU', name: 'Australia', level: 'country', path: '/4/', isActive: true, translations: { en: { name: 'Australia' }, zh: { name: '澳大利亚' } } },
  { id: 5, parentId: null, regionCode: 'HK', countryCode: 'CN', name: 'Hong Kong, China', level: 'country', path: '/5/', isActive: true, translations: { en: { name: 'Hong Kong, China' }, zh: { name: '中国香港' } } },
  { id: 6, parentId: null, regionCode: 'CN', countryCode: 'CN', name: 'Mainland China', level: 'country', path: '/6/', isActive: true, translations: { en: { name: 'Mainland China' }, zh: { name: '中国大陆' } } },
  
  // Added for complex/compound tax demonstration
  { id: 7, parentId: null, regionCode: 'CA', countryCode: 'CA', name: 'Canada', level: 'country', path: '/7/', isActive: true, translations: { en: { name: 'Canada' }, zh: { name: '加拿大' } } },
  { id: 8, parentId: 7, regionCode: 'CA-BC', countryCode: 'CA', stateCode: 'BC', name: 'British Columbia', level: 'state', path: '/7/8/', isActive: true, translations: { en: { name: 'British Columbia' }, zh: { name: '不列颠哥伦比亚省' } } },
  { id: 9, parentId: 7, regionCode: 'CA-ON', countryCode: 'CA', stateCode: 'ON', name: 'Ontario', level: 'state', path: '/7/9/', isActive: true, translations: { en: { name: 'Ontario' }, zh: { name: '安大略省' } } },
  
  { id: 10, parentId: null, regionCode: 'US', countryCode: 'US', name: 'United States', level: 'country', path: '/10/', isActive: true, translations: { en: { name: 'United States' }, zh: { name: '美国' } } },
  { id: 11, parentId: 10, regionCode: 'US-CA', countryCode: 'US', stateCode: 'CA', name: 'California', level: 'state', path: '/10/11/', isActive: true, translations: { en: { name: 'California' }, zh: { name: '加利福尼亚州' } } },
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

  // Canada - British Columbia (Compound Tax: 5% GST + 7% PST)
  { id: 25, taxRegionId: 8, productType: 'software', taxType: 'GST', taxRate: 0.05, taxName: 'Canada GST 5%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 26, taxRegionId: 8, productType: 'software', taxType: 'PST', taxRate: 0.07, taxName: 'BC PST 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 27, taxRegionId: 8, productType: 'hardware', taxType: 'GST', taxRate: 0.05, taxName: 'Canada GST 5%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 28, taxRegionId: 8, productType: 'hardware', taxType: 'PST', taxRate: 0.07, taxName: 'BC PST 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Canada - Ontario (Harmonized Sales Tax: 13% HST)
  { id: 29, taxRegionId: 9, productType: 'software', taxType: 'HST', taxRate: 0.13, taxName: 'Ontario HST 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 30, taxRegionId: 9, productType: 'hardware', taxType: 'HST', taxRate: 0.13, taxName: 'Ontario HST 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // US - California (State Tax 7.25%)
  { id: 31, taxRegionId: 11, productType: 'software', taxType: 'SalesTax', taxRate: 0.00, taxName: 'CA State Tax (SaaS Exempt)', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 32, taxRegionId: 11, productType: 'hardware', taxType: 'SalesTax', taxRate: 0.0725, taxName: 'CA State Tax 7.25%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
];
