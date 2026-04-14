import { ProductSku } from '../../types';

export const mockSoftwareSkus: ProductSku[] = [
  {
    id: 1001,
    productId: 101,
    skuCode: 'SKU-POS_SW-101-1',
    name: 'RestoPOS 快餐版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS QSR - Monthly' },
      zh: { name: 'RestoPOS 快餐版 - 月付版' }
    }
  },
  {
    id: 1002,
    productId: 101,
    skuCode: 'SKU-POS_SW-101-2',
    name: 'RestoPOS 快餐版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS QSR - Annual' },
      zh: { name: 'RestoPOS 快餐版 - 年付版' }
    }
  },
  {
    id: 1003,
    productId: 101,
    skuCode: 'SKU-POS_SW-101-3',
    name: 'RestoPOS 快餐版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS QSR - 3-Year' },
      zh: { name: 'RestoPOS 快餐版 - 三年版' }
    }
  },
  {
    id: 1004,
    productId: 102,
    skuCode: 'SKU-POS_SW-102-1',
    name: 'RestoPOS 正餐版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS FSR - Monthly' },
      zh: { name: 'RestoPOS 正餐版 - 月付版' }
    }
  },
  {
    id: 1005,
    productId: 102,
    skuCode: 'SKU-POS_SW-102-2',
    name: 'RestoPOS 正餐版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS FSR - Annual' },
      zh: { name: 'RestoPOS 正餐版 - 年付版' }
    }
  },
  {
    id: 1006,
    productId: 102,
    skuCode: 'SKU-POS_SW-102-3',
    name: 'RestoPOS 正餐版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS FSR - 3-Year' },
      zh: { name: 'RestoPOS 正餐版 - 三年版' }
    }
  },
  {
    id: 1007,
    productId: 103,
    skuCode: 'SKU-POS_SW-103-1',
    name: 'RestoPOS 零售版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Retail - Monthly' },
      zh: { name: 'RestoPOS 零售版 - 月付版' }
    }
  },
  {
    id: 1008,
    productId: 103,
    skuCode: 'SKU-POS_SW-103-2',
    name: 'RestoPOS 零售版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Retail - Annual' },
      zh: { name: 'RestoPOS 零售版 - 年付版' }
    }
  },
  {
    id: 1009,
    productId: 103,
    skuCode: 'SKU-POS_SW-103-3',
    name: 'RestoPOS 零售版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Retail - 3-Year' },
      zh: { name: 'RestoPOS 零售版 - 三年版' }
    }
  },
  {
    id: 1010,
    productId: 104,
    skuCode: 'SKU-POS_SW-104-1',
    name: 'RestoPOS 连锁总部 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 30,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Enterprise - Monthly' },
      zh: { name: 'RestoPOS 连锁总部 - 月付版' }
    }
  },
  {
    id: 1011,
    productId: 104,
    skuCode: 'SKU-POS_SW-104-2',
    name: 'RestoPOS 连锁总部 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 30,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Enterprise - Annual' },
      zh: { name: 'RestoPOS 连锁总部 - 年付版' }
    }
  },
  {
    id: 1012,
    productId: 104,
    skuCode: 'SKU-POS_SW-104-3',
    name: 'RestoPOS 连锁总部 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 30,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Enterprise - 3-Year' },
      zh: { name: 'RestoPOS 连锁总部 - 三年版' }
    }
  },
  {
    id: 1013,
    productId: 105,
    skuCode: 'SKU-POS_SW-105-1',
    name: 'RestoPOS 移动点餐 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Mobile - Monthly' },
      zh: { name: 'RestoPOS 移动点餐 - 月付版' }
    }
  },
  {
    id: 1014,
    productId: 105,
    skuCode: 'SKU-POS_SW-105-2',
    name: 'RestoPOS 移动点餐 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Mobile - Annual' },
      zh: { name: 'RestoPOS 移动点餐 - 年付版' }
    }
  },
  {
    id: 1015,
    productId: 105,
    skuCode: 'SKU-POS_SW-105-3',
    name: 'RestoPOS 移动点餐 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Mobile - 3-Year' },
      zh: { name: 'RestoPOS 移动点餐 - 三年版' }
    }
  },
  {
    id: 1016,
    productId: 106,
    skuCode: 'SKU-POS_SW-106-1',
    name: 'RestoPOS 自助点餐 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Kiosk - Monthly' },
      zh: { name: 'RestoPOS 自助点餐 - 月付版' }
    }
  },
  {
    id: 1017,
    productId: 106,
    skuCode: 'SKU-POS_SW-106-2',
    name: 'RestoPOS 自助点餐 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Kiosk - Annual' },
      zh: { name: 'RestoPOS 自助点餐 - 年付版' }
    }
  },
  {
    id: 1018,
    productId: 106,
    skuCode: 'SKU-POS_SW-106-3',
    name: 'RestoPOS 自助点餐 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Kiosk - 3-Year' },
      zh: { name: 'RestoPOS 自助点餐 - 三年版' }
    }
  },
  {
    id: 1019,
    productId: 131,
    skuCode: 'SKU-POS_SW-131-1',
    name: 'RestoPOS 咖啡茶饮版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Coffee & Tea - Monthly' },
      zh: { name: 'RestoPOS 咖啡茶饮版 - 月付版' }
    }
  },
  {
    id: 1020,
    productId: 131,
    skuCode: 'SKU-POS_SW-131-2',
    name: 'RestoPOS 咖啡茶饮版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Coffee & Tea - Annual' },
      zh: { name: 'RestoPOS 咖啡茶饮版 - 年付版' }
    }
  },
  {
    id: 1021,
    productId: 131,
    skuCode: 'SKU-POS_SW-131-3',
    name: 'RestoPOS 咖啡茶饮版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Coffee & Tea - 3-Year' },
      zh: { name: 'RestoPOS 咖啡茶饮版 - 三年版' }
    }
  },
  {
    id: 1022,
    productId: 132,
    skuCode: 'SKU-POS_SW-132-1',
    name: 'RestoPOS 酒吧版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Bar & Lounge - Monthly' },
      zh: { name: 'RestoPOS 酒吧版 - 月付版' }
    }
  },
  {
    id: 1023,
    productId: 132,
    skuCode: 'SKU-POS_SW-132-2',
    name: 'RestoPOS 酒吧版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Bar & Lounge - Annual' },
      zh: { name: 'RestoPOS 酒吧版 - 年付版' }
    }
  },
  {
    id: 1024,
    productId: 132,
    skuCode: 'SKU-POS_SW-132-3',
    name: 'RestoPOS 酒吧版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Bar & Lounge - 3-Year' },
      zh: { name: 'RestoPOS 酒吧版 - 三年版' }
    }
  },
  {
    id: 1025,
    productId: 133,
    skuCode: 'SKU-POS_SW-133-1',
    name: 'RestoPOS 烘焙版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Bakery - Monthly' },
      zh: { name: 'RestoPOS 烘焙版 - 月付版' }
    }
  },
  {
    id: 1026,
    productId: 133,
    skuCode: 'SKU-POS_SW-133-2',
    name: 'RestoPOS 烘焙版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Bakery - Annual' },
      zh: { name: 'RestoPOS 烘焙版 - 年付版' }
    }
  },
  {
    id: 1027,
    productId: 133,
    skuCode: 'SKU-POS_SW-133-3',
    name: 'RestoPOS 烘焙版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Bakery - 3-Year' },
      zh: { name: 'RestoPOS 烘焙版 - 三年版' }
    }
  },
  {
    id: 1028,
    productId: 134,
    skuCode: 'SKU-POS_SW-134-1',
    name: 'RestoPOS 美食广场版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Food Court - Monthly' },
      zh: { name: 'RestoPOS 美食广场版 - 月付版' }
    }
  },
  {
    id: 1029,
    productId: 134,
    skuCode: 'SKU-POS_SW-134-2',
    name: 'RestoPOS 美食广场版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Food Court - Annual' },
      zh: { name: 'RestoPOS 美食广场版 - 年付版' }
    }
  },
  {
    id: 1030,
    productId: 134,
    skuCode: 'SKU-POS_SW-134-3',
    name: 'RestoPOS 美食广场版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Food Court - 3-Year' },
      zh: { name: 'RestoPOS 美食广场版 - 三年版' }
    }
  },
  {
    id: 1031,
    productId: 135,
    skuCode: 'SKU-POS_SW-135-1',
    name: 'RestoPOS 酒店餐饮版 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Hotel Dining - Monthly' },
      zh: { name: 'RestoPOS 酒店餐饮版 - 月付版' }
    }
  },
  {
    id: 1032,
    productId: 135,
    skuCode: 'SKU-POS_SW-135-2',
    name: 'RestoPOS 酒店餐饮版 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Hotel Dining - Annual' },
      zh: { name: 'RestoPOS 酒店餐饮版 - 年付版' }
    }
  },
  {
    id: 1033,
    productId: 135,
    skuCode: 'SKU-POS_SW-135-3',
    name: 'RestoPOS 酒店餐饮版 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Hotel Dining - 3-Year' },
      zh: { name: 'RestoPOS 酒店餐饮版 - 三年版' }
    }
  },
  {
    id: 1034,
    productId: 136,
    skuCode: 'SKU-POS_SW-136-1',
    name: 'RestoPOS 供应链管理 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Supply Chain - Monthly' },
      zh: { name: 'RestoPOS 供应链管理 - 月付版' }
    }
  },
  {
    id: 1035,
    productId: 136,
    skuCode: 'SKU-POS_SW-136-2',
    name: 'RestoPOS 供应链管理 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Supply Chain - Annual' },
      zh: { name: 'RestoPOS 供应链管理 - 年付版' }
    }
  },
  {
    id: 1036,
    productId: 136,
    skuCode: 'SKU-POS_SW-136-3',
    name: 'RestoPOS 供应链管理 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Supply Chain - 3-Year' },
      zh: { name: 'RestoPOS 供应链管理 - 三年版' }
    }
  },
  {
    id: 1037,
    productId: 137,
    skuCode: 'SKU-POS_SW-137-1',
    name: 'RestoPOS 财务集成 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Finance Integration - Monthly' },
      zh: { name: 'RestoPOS 财务集成 - 月付版' }
    }
  },
  {
    id: 1038,
    productId: 137,
    skuCode: 'SKU-POS_SW-137-2',
    name: 'RestoPOS 财务集成 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Finance Integration - Annual' },
      zh: { name: 'RestoPOS 财务集成 - 年付版' }
    }
  },
  {
    id: 1039,
    productId: 137,
    skuCode: 'SKU-POS_SW-137-3',
    name: 'RestoPOS 财务集成 - 三年版',
    billingModel: 'recurring',
    billingTerm: 'triennial',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Finance Integration - 3-Year' },
      zh: { name: 'RestoPOS 财务集成 - 三年版' }
    }
  },
  {
    id: 1040,
    productId: 138,
    skuCode: 'SKU-POS_SW-138-1',
    name: 'RestoPOS 顾客忠诚度 - 月付版',
    billingModel: 'recurring',
    billingTerm: 'monthly',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Loyalty Program - Monthly' },
      zh: { name: 'RestoPOS 顾客忠诚度 - 月付版' }
    }
  },
  {
    id: 1041,
    productId: 146,
    skuCode: 'SKU-POS_SW-146-1',
    name: 'RestoPOS 扫码点餐 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Scan-to-Order - Annual' },
      zh: { name: 'RestoPOS 扫码点餐 - 年付版' }
    }
  },
  {
    id: 1042,
    productId: 147,
    skuCode: 'SKU-POS_SW-147-1',
    name: 'RestoPOS 厨房打印调度 - 年付版',
    billingModel: 'recurring',
    billingTerm: 'annual',
    billingTiming: 'in_advance',
    trialDays: 14,
    uom: 'License',
    lifecycleStatus: 'active',
    isShippable: false,
    isSerialized: false,
    translations: {
      en: { name: 'RestoPOS Kitchen Printing - Annual' },
      zh: { name: 'RestoPOS 厨房打印调度 - 年付版' }
    }
  }
];
