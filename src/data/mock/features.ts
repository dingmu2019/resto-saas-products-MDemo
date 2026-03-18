import { ProductEntitlement } from '../../types';

export const mockFeatures = [
  { id: 1, code: 'module_inventory', name: 'Basic Inventory', type: 'boolean', description: 'Standard inventory tracking.' },
  { id: 2, code: 'module_advanced_inventory', name: 'Advanced Inventory', type: 'boolean', description: 'Multi-location inventory and POs.' },
  { id: 3, code: 'max_store_limit', name: 'Max Store Limit', type: 'quota', description: 'Maximum number of stores allowed.' },
  { id: 4, code: 'max_users', name: 'Max Users', type: 'quota', description: 'Maximum number of staff accounts.' },
  { id: 5, code: 'api_access', name: 'API Access', type: 'boolean', description: 'Developer API access.' },
  { id: 6, code: 'custom_branding', name: 'Custom Branding', type: 'boolean', description: 'Remove RestoSuite logos from receipts.' },
  { id: 7, code: 'support_level', name: 'Support Level', type: 'tier', description: 'SLA and support tier (Standard, Priority, 24/7).' },
];

export const mockEntitlements: ProductEntitlement[] = [
  // Basic Monthly Entitlements
  { id: 1, skuId: 1011, featureCode: 'module_inventory', entitlementType: 'boolean', status: 'active' },
  { id: 2, skuId: 1011, featureCode: 'max_store_limit', entitlementType: 'quota', quotaValue: 1, status: 'active' },
  { id: 3, skuId: 1011, featureCode: 'max_users', entitlementType: 'quota', quotaValue: 5, status: 'active' },
  { id: 4, skuId: 1011, featureCode: 'support_level', entitlementType: 'tier', tierValue: 'Standard', status: 'active' },
  
  // Pro Monthly Entitlements (More features)
  { id: 5, skuId: 1013, featureCode: 'module_inventory', entitlementType: 'boolean', status: 'active' },
  { id: 6, skuId: 1013, featureCode: 'module_advanced_inventory', entitlementType: 'boolean', status: 'active' },
  { id: 7, skuId: 1013, featureCode: 'max_store_limit', entitlementType: 'quota', quotaValue: 5, status: 'active' },
  { id: 8, skuId: 1013, featureCode: 'max_users', entitlementType: 'quota', quotaValue: 25, status: 'active' },
  { id: 9, skuId: 1013, featureCode: 'api_access', entitlementType: 'boolean', status: 'active' },
  { id: 10, skuId: 1013, featureCode: 'custom_branding', entitlementType: 'boolean', status: 'active' },
  { id: 11, skuId: 1013, featureCode: 'support_level', entitlementType: 'tier', tierValue: 'Priority', status: 'active' },
];
