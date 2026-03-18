import { TaxRegion, TaxRateMapping } from '../../types';

export const mockTaxRegions: TaxRegion[] = [
  { id: 1, parentId: null, regionCode: 'US', countryCode: 'US', name: '美国', level: 'country', path: '/1/' },
  { id: 2, parentId: 1, regionCode: 'CA', countryCode: 'US', stateCode: 'CA', name: '加利福尼亚州', level: 'state', path: '/1/2/' },
  { id: 3, parentId: 1, regionCode: 'NY', countryCode: 'US', stateCode: 'NY', name: '纽约州', level: 'state', path: '/1/3/' },
  { id: 4, parentId: null, regionCode: 'EU', countryCode: 'EU', name: '欧盟', level: 'country', path: '/4/' },
];

export const mockTaxRates: TaxRateMapping[] = [
  { id: 1, taxRegionId: 2, productType: 'software', taxType: 'SalesTax', taxRate: 0.0725, taxName: '加州销售税', isTaxInclusive: false, isB2bExempt: true, effectiveDate: '2026-01-01' },
  { id: 2, taxRegionId: 2, productType: 'hardware', taxType: 'SalesTax', taxRate: 0.0725, taxName: '加州销售税', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2026-01-01' },
  { id: 3, taxRegionId: 4, productType: 'software', taxType: 'VAT', taxRate: 0.20, taxName: '欧盟数字增值税 20%', isTaxInclusive: true, isB2bExempt: true, effectiveDate: '2026-01-01' },
  { id: 4, taxRegionId: 4, productType: 'hardware', taxType: 'VAT', taxRate: 0.20, taxName: '欧盟标准增值税 20%', isTaxInclusive: true, isB2bExempt: false, effectiveDate: '2026-01-01' },
];
