export interface Category {
  id: number;
  parentId: number | null;
  code: string;
  name: string;
  description?: string;
  translations?: Record<string, { name: string; description: string }>;
  level: number;
  path: string;
  sortOrder: number;
  isActive: boolean;
}

export interface TaxRateFlat {
  id: number;
  countryCode: string;
  stateCode?: string;
  postalCodePattern?: string;
  productType: 'software' | 'hardware' | 'service' | 'consumable' | 'bundle';
  taxType: 'VAT' | 'GST' | 'SalesTax' | 'PST' | 'HST' | 'QST';
  combinedTaxRate: number;
  taxName: string;
  isTaxInclusive: boolean;
  isB2bExempt: boolean;
  effectiveDate: string;
  endDate?: string;
}

export interface Product {
  id: number;
  categoryId: number;
  productCode: string;
  name: string;
  productType: 'software' | 'hardware' | 'service' | 'consumable' | 'bundle';
  brand?: string;
  description?: string;
  translations?: {
    en: { name: string; description?: string };
    zh: { name: string; description?: string };
  };
}

export interface ProductSku {
  id: number;
  productId: number;
  skuCode: string;
  name: string;
  billingModel: 'recurring' | 'one_time' | 'usage_based' | 'hybrid';
  billingTerm: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual' | 'biennial' | 'triennial' | 'custom' | 'none';
  billingTiming: 'in_advance' | 'in_arrears';
  trialDays: number;
  uom: string;
  lifecycleStatus: 'draft' | 'active' | 'eos' | 'eol' | 'retired';
  standardTaxCode?: string;
  isShippable: boolean;
  isSerialized: boolean;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  hsCode?: string;
  countryOfOrigin?: string;
  provisioningHandler?: string;
  specifications?: any;
  translations?: {
    en: { name: string; description?: string };
    zh: { name: string; description?: string };
  };
  launchDate?: string;
  eosDate?: string;
}

export interface ProductMedia {
  id: number;
  productId?: number;
  skuId?: number;
  mediaType: 'image' | 'video' | 'document' | '3d_model';
  url: string;
  thumbnailUrl?: string;
  isMain: boolean;
  sortOrder: number;
  locale: string;
  title?: string;
  translations?: {
    en: { title?: string };
    zh: { title?: string };
  };
}

export interface ProductFeature {
  id: number;
  code: string;
  name: string;
  type: 'boolean' | 'quota' | 'tier';
  description?: string;
  translations?: {
    en: { name: string; description?: string };
    zh: { name: string; description?: string };
  };
}

export interface ProductEntitlement {
  id: number;
  skuId: number;
  featureCode: string;
  entitlementType: 'boolean' | 'quota' | 'tier';
  quotaValue?: number;
  tierValue?: string;
  status: 'active' | 'inactive';
}

export interface BundleGroup {
  id: number;
  bundleSkuId: number;
  groupName: string;
  description?: string;
  sortOrder: number;
  minSelections: number;
  maxSelections: number;
  allowMultipleQtyPerItem: boolean;
  isMutuallyExclusive: boolean;
  translations?: {
    en: { groupName: string; description?: string };
    zh: { groupName: string; description?: string };
  };
}

export interface BundleOption {
  id: number;
  bundleSkuId: number;
  groupId: number;
  componentSkuId: number;
  isDefault: boolean;
  sortOrder: number;
}

export interface ProductRule {
  id: number;
  sourceSkuId: number;
  targetSkuId: number;
  ruleType: 'requires' | 'excludes' | 'recommends' | 'compatible_with';
  message?: string;
  translations?: {
    en: { message?: string };
    zh: { message?: string };
  };
}

export interface PriceBook {
  id: number;
  code: string;
  name: string;
  currency: string;
  applicableRegions?: string[];
  translations?: {
    en: { name: string };
    zh: { name: string };
  };
  priceDisplayPrecision: number;
  type: 'standard' | 'channel' | 'promotional' | 'custom';
  partnerTier?: string;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
}

export interface PriceBookEntry {
  id: number;
  priceBookId: number;
  skuId: number;
  parentSkuId?: number;
  pricingStrategy: 'flat_fee' | 'per_unit' | 'tiered' | 'volume' | 'percentage';
  listPrice: number;
  standaloneSellingPrice?: number;
  billingModelOverride?: 'one_time' | 'recurring' | 'usage_based';
  minCommitmentMonths?: number;
  earlyTerminationPolicy?: 'none' | 'flat_fee' | 'remaining_balance' | 'fixed_months';
  etfAmountOrPercent?: number;
  bundleAdjustmentAmount?: number;
  estimatedUnitCost?: number;
  minPrice?: number;
  maxDiscountRate?: number;
  msrp?: number;
  tierConfig?: any;
  validFrom: string;
  validTo?: string;
}
