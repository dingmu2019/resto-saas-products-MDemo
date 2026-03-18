import { Category, Product, ProductSku, ProductMedia } from '../../types';

export const mockCategories: Category[] = [
  { id: 1, parentId: null, name: 'Software', code: 'SW', description: 'Core software licenses and subscriptions', isActive: true, level: 1, path: '/1/', sortOrder: 1 },
  { id: 2, parentId: null, name: 'Hardware', code: 'HW', description: 'Physical devices and accessories', isActive: true, level: 1, path: '/2/', sortOrder: 2 },
  { id: 3, parentId: null, name: 'Services', code: 'SVC', description: 'Professional services and support', isActive: true, level: 1, path: '/3/', sortOrder: 3 },
  { id: 4, parentId: null, name: 'Bundles', code: 'BNDL', description: 'Pre-packaged solutions', isActive: true, level: 1, path: '/4/', sortOrder: 4 },
  { id: 5, parentId: 1, name: 'Add-ons', code: 'SW-ADD', description: 'Software extensions and modules', isActive: true, level: 2, path: '/1/5/', sortOrder: 5 },
];

export const mockProducts: Product[] = [
  { id: 101, categoryId: 1, productCode: 'RS-CORE', name: 'RestoSuite POS', productType: 'software', description: 'Core Point of Sale software for restaurants' },
  { id: 102, categoryId: 2, productCode: 'HW-TERM-V1', name: 'RestoTerminal Classic', productType: 'hardware', description: 'Standard 15-inch touch terminal' },
  { id: 103, categoryId: 2, productCode: 'HW-PRN-01', name: 'Thermal Receipt Printer', productType: 'hardware', description: 'High-speed thermal printer with auto-cutter' },
  { id: 104, categoryId: 4, productCode: 'BNDL-QSR', name: 'QSR Starter Kit', productType: 'bundle', description: 'Everything you need to start a Quick Service Restaurant' },
  { id: 105, categoryId: 5, productCode: 'SW-ANA', name: 'Advanced Analytics', productType: 'software', description: 'Deep insights and reporting dashboards' },
  { id: 106, categoryId: 3, productCode: 'SVC-SUP', name: 'Premium Support', productType: 'service', description: '24/7 priority phone and remote support' },
  { id: 107, categoryId: 2, productCode: 'HW-KDS', name: 'Kitchen Display System', productType: 'hardware', description: 'Rugged 22-inch kitchen display screen' },
  { id: 108, categoryId: 4, productCode: 'BNDL-ENT', name: 'Enterprise Mega Stack', productType: 'bundle', description: 'Full-suite solution for large restaurant chains' },
];

export const mockSkus: ProductSku[] = [
  // Software SKUs
  { id: 1011, productId: 101, skuCode: 'RS-CORE-M', name: 'RestoSuite Basic (Monthly)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1012, productId: 101, skuCode: 'RS-CORE-A', name: 'RestoSuite Basic (Annual)', billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1013, productId: 101, skuCode: 'RS-PRO-M', name: 'RestoSuite Pro (Monthly)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 14, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  
  // Hardware SKUs
  { id: 1021, productId: 102, skuCode: 'HW-TERM-V1-BLK', name: 'RestoTerminal Classic (Black)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1022, productId: 102, skuCode: 'HW-TERM-V1-WHT', name: 'RestoTerminal Classic (White)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1031, productId: 103, skuCode: 'HW-PRN-USB', name: 'Thermal Printer (USB)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1032, productId: 103, skuCode: 'HW-PRN-WIFI', name: 'Thermal Printer (WiFi/LAN)', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },
  { id: 1071, productId: 107, skuCode: 'HW-KDS-22', name: 'KDS Screen 22"', billingModel: 'one_time', billingTerm: 'none', billingTiming: 'in_advance', trialDays: 0, uom: 'Unit', lifecycleStatus: 'active', isShippable: true, isSerialized: true },

  // Add-ons & Services
  { id: 1051, productId: 105, skuCode: 'SW-ANA-M', name: 'Analytics Add-on (Monthly)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 0, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1061, productId: 106, skuCode: 'SVC-SUP-HR', name: 'Support (Hourly Rate)', billingModel: 'usage_based', billingTerm: 'monthly', billingTiming: 'in_arrears', trialDays: 0, uom: 'Hour', lifecycleStatus: 'active', isShippable: false, isSerialized: false },
  { id: 1062, productId: 106, skuCode: 'SVC-SUP-ANN', name: 'Premium Support Retainer (Annual)', billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', trialDays: 0, uom: 'License', lifecycleStatus: 'active', isShippable: false, isSerialized: false },

  // Bundle SKUs
  { id: 1041, productId: 104, skuCode: 'BNDL-QSR-M', name: 'QSR Starter Kit (Monthly Subs)', billingModel: 'recurring', billingTerm: 'monthly', billingTiming: 'in_advance', trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false },
  { id: 1081, productId: 108, skuCode: 'BNDL-ENT-A', name: 'Enterprise Mega Stack (Annual)', billingModel: 'recurring', billingTerm: 'annual', billingTiming: 'in_advance', trialDays: 0, uom: 'Bundle', lifecycleStatus: 'active', isShippable: true, isSerialized: false },
];

export const mockMedia: ProductMedia[] = [
  { id: 1, productId: 101, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'en', title: 'POS Software Dashboard' },
  { id: 2, productId: 102, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'en', title: 'Terminal Hardware' },
  { id: 3, productId: 104, mediaType: 'image', url: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'en', title: 'QSR Starter Bundle' },
  { id: 4, productId: 107, mediaType: 'image', url: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'en', title: 'Kitchen Display System' },
  { id: 5, productId: 105, mediaType: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'en', title: 'Analytics Dashboard' },
  { id: 6, productId: 103, mediaType: 'image', url: 'https://images.unsplash.com/photo-1624969862644-791f3dc98927?auto=format&fit=crop&w=800&q=80', isMain: true, sortOrder: 1, locale: 'en', title: 'Receipt Printer' },
];
