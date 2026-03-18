import { BundleGroup, BundleOption } from '../../types';

export const mockBundleGroups: BundleGroup[] = [
  // QSR Starter Kit Groups
  { id: 1, bundleSkuId: 1041, name: 'Core Software', description: 'Select your software subscription tier', minSelections: 1, maxSelections: 1, sortOrder: 1, isMutuallyExclusive: true, allowMultipleQtyPerItem: false },
  { id: 2, bundleSkuId: 1041, name: 'Point of Sale Hardware', description: 'Choose your terminal and printer', minSelections: 1, maxSelections: 3, sortOrder: 2, isMutuallyExclusive: false, allowMultipleQtyPerItem: true },
  
  // Enterprise Mega Stack Groups
  { id: 3, bundleSkuId: 1081, name: 'Enterprise Software', description: 'Pro software is required for Enterprise', minSelections: 1, maxSelections: 1, sortOrder: 1, isMutuallyExclusive: true, allowMultipleQtyPerItem: false },
  { id: 4, bundleSkuId: 1081, name: 'Kitchen & FOH Hardware', description: 'Equip your entire restaurant', minSelections: 2, maxSelections: 10, sortOrder: 2, isMutuallyExclusive: false, allowMultipleQtyPerItem: true },
  { id: 5, bundleSkuId: 1081, name: 'Professional Services', description: 'Implementation and Support', minSelections: 0, maxSelections: 2, sortOrder: 3, isMutuallyExclusive: false, allowMultipleQtyPerItem: true },
];

export const mockBundleOptions: BundleOption[] = [
  // QSR Starter Kit - Software
  { id: 1, bundleSkuId: 1041, groupId: 1, componentSkuId: 1011, isDefault: true, pricingType: 'included', sortOrder: 1 }, // Basic Monthly included
  { id: 2, bundleSkuId: 1041, groupId: 1, componentSkuId: 1013, isDefault: false, pricingType: 'price_adjustment', pricingValue: 50.00, sortOrder: 2 }, // Upgrade to Pro for +$50
  
  // QSR Starter Kit - Hardware
  { id: 3, bundleSkuId: 1041, groupId: 2, componentSkuId: 1021, isDefault: true, pricingType: 'fixed_override', pricingValue: 399.00, sortOrder: 1 }, // Discounted Terminal
  { id: 4, bundleSkuId: 1041, groupId: 2, componentSkuId: 1031, isDefault: true, pricingType: 'fixed_override', pricingValue: 199.00, sortOrder: 2 }, // Discounted Printer
  
  // Enterprise Mega Stack - Software
  { id: 5, bundleSkuId: 1081, groupId: 3, componentSkuId: 1013, isDefault: true, pricingType: 'included', sortOrder: 1 }, // Pro Monthly included
  { id: 6, bundleSkuId: 1081, groupId: 3, componentSkuId: 1051, isDefault: true, pricingType: 'included', sortOrder: 2 }, // Analytics included
  
  // Enterprise Mega Stack - Hardware
  { id: 7, bundleSkuId: 1081, groupId: 4, componentSkuId: 1022, isDefault: true, pricingType: 'fixed_override', pricingValue: 450.00, sortOrder: 1 }, // White Terminal
  { id: 8, bundleSkuId: 1081, groupId: 4, componentSkuId: 1071, isDefault: true, pricingType: 'fixed_override', pricingValue: 600.00, sortOrder: 2 }, // KDS Screen
  { id: 9, bundleSkuId: 1081, groupId: 4, componentSkuId: 1032, isDefault: true, pricingType: 'fixed_override', pricingValue: 250.00, sortOrder: 3 }, // WiFi Printer
  
  // Enterprise Mega Stack - Services
  { id: 10, bundleSkuId: 1081, groupId: 5, componentSkuId: 1062, isDefault: false, pricingType: 'price_adjustment', pricingValue: -500.00, sortOrder: 1 }, // Discounted Annual Support
  { id: 11, bundleSkuId: 1081, groupId: 5, componentSkuId: 1061, isDefault: false, pricingType: 'included', sortOrder: 2 }, // Hourly Support (Tiered)
];
