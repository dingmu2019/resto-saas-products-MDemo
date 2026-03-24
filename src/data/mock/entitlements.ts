import { ProductEntitlement } from '../../types';

export const mockEntitlements: ProductEntitlement[] = [
  {
    id: 1,
    skuId: 1001,
    featureCode: 'CORE_POS',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 2,
    skuId: 1001,
    featureCode: 'MAX_TERMINALS',
    entitlementType: 'quota',
    quotaValue: 5,
    status: 'active'
  },
  {
    id: 3,
    skuId: 1004,
    featureCode: 'INVENTORY_MGMT',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 4,
    skuId: 1013,
    featureCode: 'CRM_LOYALTY',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 5,
    skuId: 1016,
    featureCode: 'ADVANCED_ANALYTICS',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 6,
    skuId: 1019,
    featureCode: 'MULTI_STORE_MGMT',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 7,
    skuId: 1024,
    featureCode: 'KDS',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 8,
    skuId: 1027,
    featureCode: 'ONLINE_ORDERING',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 9,
    skuId: 1030,
    featureCode: 'MOBILE_ORDERING',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 10,
    skuId: 1033,
    featureCode: 'SELF_SERVICE_KIOSK',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 11,
    skuId: 1036,
    featureCode: 'DELIVERY_INTEGRATION',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 12,
    skuId: 1039,
    featureCode: 'FINANCIAL_REPORTING',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 13,
    skuId: 1041,
    featureCode: 'TAX_MGMT',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 14,
    skuId: 1049,
    featureCode: 'RESERVATION_SYSTEM',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 15,
    skuId: 1052,
    featureCode: 'EMPLOYEE_ATTENDANCE',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 16,
    skuId: 1055,
    featureCode: 'GIFT_CARD_SUPPORT',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 17,
    skuId: 1058,
    featureCode: 'CUSTOMER_FEEDBACK',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 18,
    skuId: 1061,
    featureCode: 'QUEUE_MGMT',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 19,
    skuId: 1064,
    featureCode: 'E_INVOICE_INTEGRATION',
    entitlementType: 'boolean',
    status: 'active'
  },
  {
    id: 20,
    skuId: 1067,
    featureCode: 'MOBILE_PAYMENT',
    entitlementType: 'boolean',
    status: 'active'
  }
];
