import { TaxRegion, TaxRateMapping } from '../../types';

export const mockTaxRegions: TaxRegion[] = [
  { id: 1, parentId: null, regionCode: 'US', countryCode: 'US', name: 'United States', level: 'country', path: '/1/' },
  { id: 2, parentId: 1, regionCode: 'CA', countryCode: 'US', stateCode: 'CA', name: 'California', level: 'state', path: '/1/2/' },
  { id: 3, parentId: 1, regionCode: 'NY', countryCode: 'US', stateCode: 'NY', name: 'New York', level: 'state', path: '/1/3/' },
  { id: 4, parentId: null, regionCode: 'EU', countryCode: 'EU', name: 'European Union', level: 'country', path: '/4/' },
];

export const mockTaxRates: TaxRateMapping[] = [
  { id: 1, taxRegionId: 2, productType: 'software', taxType: 'SalesTax', taxRate: 0.0725, taxName: 'CA State Sales Tax', isTaxInclusive: false, isB2bExempt: true, effectiveDate: '2026-01-01' },
  { id: 2, taxRegionId: 2, productType: 'hardware', taxType: 'SalesTax', taxRate: 0.0725, taxName: 'CA State Sales Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2026-01-01' },
  { id: 3, taxRegionId: 4, productType: 'software', taxType: 'VAT', taxRate: 0.20, taxName: 'EU Digital VAT 20%', isTaxInclusive: true, isB2bExempt: true, effectiveDate: '2026-01-01' },
  { id: 4, taxRegionId: 4, productType: 'hardware', taxType: 'VAT', taxRate: 0.20, taxName: 'EU Standard VAT 20%', isTaxInclusive: true, isB2bExempt: false, effectiveDate: '2026-01-01' },
];
