import { TaxRegion, TaxRateMapping } from '../../types';

export const mockTaxRegions: TaxRegion[] = [
  { id: 1, parentId: null, regionCode: 'US', countryCode: 'US', name: 'United States', level: 'country', path: '/1/', isActive: true },
  { id: 2, parentId: 1, regionCode: 'CA', countryCode: 'US', stateCode: 'CA', name: 'California', level: 'state', path: '/1/2/', isActive: true },
  { id: 3, parentId: 2, regionCode: 'LA', countryCode: 'US', stateCode: 'CA', cityCode: 'Los Angeles', name: 'Los Angeles', level: 'city', path: '/1/2/3/', isActive: true },
  { id: 4, parentId: 1, regionCode: 'NY', countryCode: 'US', stateCode: 'NY', name: 'New York', level: 'state', path: '/1/4/', isActive: true },
  { id: 5, parentId: null, regionCode: 'EU', countryCode: 'EU', name: 'European Union', level: 'country', path: '/5/', isActive: true },
  { id: 6, parentId: 5, regionCode: 'DE', countryCode: 'DE', name: 'Germany', level: 'country', path: '/5/6/', isActive: true },
  { id: 7, parentId: null, regionCode: 'CN', countryCode: 'CN', name: 'China', level: 'country', path: '/7/', isActive: true },
  { id: 8, parentId: 7, regionCode: 'GD', countryCode: 'CN', stateCode: 'GD', name: 'Guangdong', level: 'state', path: '/7/8/', isActive: true },
  { id: 9, parentId: 8, regionCode: 'SZ', countryCode: 'CN', stateCode: 'GD', cityCode: 'Shenzhen', name: 'Shenzhen', level: 'city', path: '/7/8/9/', isActive: true },
];

export const mockTaxRates: TaxRateMapping[] = [
  { id: 1, taxRegionId: 2, productType: 'software', taxType: 'SalesTax', taxRate: 0.0725, taxName: '加州销售税', isTaxInclusive: false, isB2bExempt: true, effectiveDate: '2026-01-01' },
  { id: 2, taxRegionId: 2, productType: 'hardware', taxType: 'SalesTax', taxRate: 0.0725, taxName: '加州销售税', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2026-01-01' },
  { id: 3, taxRegionId: 4, productType: 'software', taxType: 'VAT', taxRate: 0.20, taxName: '欧盟数字增值税 20%', isTaxInclusive: true, isB2bExempt: true, effectiveDate: '2026-01-01' },
  { id: 4, taxRegionId: 4, productType: 'hardware', taxType: 'VAT', taxRate: 0.20, taxName: '欧盟标准增值税 20%', isTaxInclusive: true, isB2bExempt: false, effectiveDate: '2026-01-01' },
];
