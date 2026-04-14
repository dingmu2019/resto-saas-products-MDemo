import { TaxRateFlat } from '../../types';

export const mockTaxRates: TaxRateFlat[] = [
  // Singapore (GST 9%)
  { id: 1, countryCode: 'SG', productType: 'software', taxType: 'GST', combinedTaxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 2, countryCode: 'SG', productType: 'hardware', taxType: 'GST', combinedTaxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 3, countryCode: 'SG', productType: 'service', taxType: 'GST', combinedTaxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 4, countryCode: 'SG', productType: 'consumable', taxType: 'GST', combinedTaxRate: 0.09, taxName: 'Singapore GST 9%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Malaysia (SST - Sales 10%, Service 6%)
  { id: 5, countryCode: 'MY', productType: 'software', taxType: 'SalesTax', combinedTaxRate: 0.06, taxName: 'Malaysia Service Tax 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },
  { id: 6, countryCode: 'MY', productType: 'hardware', taxType: 'SalesTax', combinedTaxRate: 0.10, taxName: 'Malaysia Sales Tax 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },
  { id: 7, countryCode: 'MY', productType: 'service', taxType: 'SalesTax', combinedTaxRate: 0.06, taxName: 'Malaysia Service Tax 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },
  { id: 8, countryCode: 'MY', productType: 'consumable', taxType: 'SalesTax', combinedTaxRate: 0.10, taxName: 'Malaysia Sales Tax 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-03-01' },

  // Thailand (VAT 7%)
  { id: 9, countryCode: 'TH', productType: 'software', taxType: 'VAT', combinedTaxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 10, countryCode: 'TH', productType: 'hardware', taxType: 'VAT', combinedTaxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 11, countryCode: 'TH', productType: 'service', taxType: 'VAT', combinedTaxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 12, countryCode: 'TH', productType: 'consumable', taxType: 'VAT', combinedTaxRate: 0.07, taxName: 'Thailand VAT 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Australia (GST 10%)
  { id: 13, countryCode: 'AU', productType: 'software', taxType: 'GST', combinedTaxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 14, countryCode: 'AU', productType: 'hardware', taxType: 'GST', combinedTaxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 15, countryCode: 'AU', productType: 'service', taxType: 'GST', combinedTaxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 16, countryCode: 'AU', productType: 'consumable', taxType: 'GST', combinedTaxRate: 0.10, taxName: 'Australia GST 10%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Hong Kong (0%)
  { id: 17, countryCode: 'CN', stateCode: 'HK', productType: 'software', taxType: 'VAT', combinedTaxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 18, countryCode: 'CN', stateCode: 'HK', productType: 'hardware', taxType: 'VAT', combinedTaxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 19, countryCode: 'CN', stateCode: 'HK', productType: 'service', taxType: 'VAT', combinedTaxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 20, countryCode: 'CN', stateCode: 'HK', productType: 'consumable', taxType: 'VAT', combinedTaxRate: 0.00, taxName: 'Hong Kong No Tax', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Mainland China (VAT 13% Hardware, 6% Software/Service)
  { id: 21, countryCode: 'CN', productType: 'software', taxType: 'VAT', combinedTaxRate: 0.06, taxName: '中国增值税 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 22, countryCode: 'CN', productType: 'hardware', taxType: 'VAT', combinedTaxRate: 0.13, taxName: '中国增值税 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 23, countryCode: 'CN', productType: 'service', taxType: 'VAT', combinedTaxRate: 0.06, taxName: '中国增值税 6%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 24, countryCode: 'CN', productType: 'consumable', taxType: 'VAT', combinedTaxRate: 0.13, taxName: '中国增值税 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Canada - British Columbia (Compound Tax: 5% GST + 7% PST)
  { id: 25, countryCode: 'CA', stateCode: 'BC', productType: 'software', taxType: 'GST', combinedTaxRate: 0.05, taxName: 'Canada GST 5%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 26, countryCode: 'CA', stateCode: 'BC', productType: 'software', taxType: 'PST', combinedTaxRate: 0.07, taxName: 'BC PST 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 27, countryCode: 'CA', stateCode: 'BC', productType: 'hardware', taxType: 'GST', combinedTaxRate: 0.05, taxName: 'Canada GST 5%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 28, countryCode: 'CA', stateCode: 'BC', productType: 'hardware', taxType: 'PST', combinedTaxRate: 0.07, taxName: 'BC PST 7%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // Canada - Ontario (Harmonized Sales Tax: 13% HST)
  { id: 29, countryCode: 'CA', stateCode: 'ON', productType: 'software', taxType: 'HST', combinedTaxRate: 0.13, taxName: 'Ontario HST 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 30, countryCode: 'CA', stateCode: 'ON', productType: 'hardware', taxType: 'HST', combinedTaxRate: 0.13, taxName: 'Ontario HST 13%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },

  // US - California (State Tax 7.25%)
  { id: 31, countryCode: 'US', stateCode: 'CA', productType: 'software', taxType: 'SalesTax', combinedTaxRate: 0.00, taxName: 'CA State Tax (SaaS Exempt)', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
  { id: 32, countryCode: 'US', stateCode: 'CA', productType: 'hardware', taxType: 'SalesTax', combinedTaxRate: 0.0725, taxName: 'CA State Tax 7.25%', isTaxInclusive: false, isB2bExempt: false, effectiveDate: '2024-01-01' },
];
