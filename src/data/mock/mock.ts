import { mockCategories } from './categories';
import { mockProducts } from './products_list';
import { mockSoftwareSkus } from './skus_software';
import { mockSoftwareProSkus } from './skus_software_pro';
import { mockHardwareSkus } from './skus_hardware';
import { mockServiceSkus } from './skus_services';
import { mockBundleSkus } from './skus_bundles';
import { mockPriceBooks } from './price_books';
import { mockInternationalPriceBooks } from './price_books_international';
import { mockRecurringPriceBookEntries } from './price_book_entries_recurring';
import { mockOneTimePriceBookEntries } from './price_book_entries_one_time';
import { mockInternationalPriceBookEntries } from './price_book_entries_international';
import { mockMedia } from './media';
import { mockEntitlements } from './entitlements';
import { mockBundleGroups, mockBundleOptions } from './bundles';
import { mockRules } from './rules';
import { mockTaxRates } from './taxes';
import { mockFeatures } from './features';

export const mockData = {
  categories: mockCategories,
  products: mockProducts,
  skus: [
    ...mockSoftwareSkus,
    ...mockSoftwareProSkus,
    ...mockHardwareSkus,
    ...mockServiceSkus,
    ...mockBundleSkus
  ],
  priceBooks: [
    ...mockPriceBooks,
    ...mockInternationalPriceBooks
  ],
  priceBookEntries: [
    ...mockRecurringPriceBookEntries,
    ...mockOneTimePriceBookEntries,
    ...mockInternationalPriceBookEntries
  ],
  media: mockMedia,
  entitlements: mockEntitlements,
  bundleGroups: mockBundleGroups,
  bundleOptions: mockBundleOptions,
  rules: mockRules,
  taxRates: mockTaxRates,
  features: mockFeatures
};
