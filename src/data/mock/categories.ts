import { Category } from '../../types';

export const mockCategories: Category[] = [
  {
    id: 1,
    parentId: null,
    code: 'SOFTWARE',
    name: '软件订阅与云服务',
    description: 'Software & Cloud Services',
    isActive: true,
    level: 1,
    path: '/1/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Software & Cloud Services',
        description: 'Software & Cloud Services'
      },
      zh: {
        name: '软件订阅与云服务',
        description: '软件订阅与云服务'
      }
    }
  },
  {
    id: 11,
    parentId: 1,
    code: 'CORE_POS',
    name: '核心门店系统',
    description: 'Core POS',
    isActive: true,
    level: 2,
    path: '/1/11/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Core POS',
        description: 'Core POS'
      },
      zh: {
        name: '核心门店系统',
        description: '核心门店系统'
      }
    }
  },
  {
    id: 111,
    parentId: 11,
    code: 'QSR_EDITION',
    name: '快餐版',
    description: 'QSR Edition',
    isActive: true,
    level: 3,
    path: '/1/11/111/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'QSR Edition',
        description: 'QSR Edition'
      },
      zh: {
        name: '快餐版',
        description: '快餐版'
      }
    }
  },
  {
    id: 112,
    parentId: 11,
    code: 'FSR_EDITION',
    name: '正餐版',
    description: 'FSR Edition',
    isActive: true,
    level: 3,
    path: '/1/11/112/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'FSR Edition',
        description: 'FSR Edition'
      },
      zh: {
        name: '正餐版',
        description: '正餐版'
      }
    }
  },
  {
    id: 12,
    parentId: 1,
    code: 'DIGITAL_EXP',
    name: '数字化运营',
    description: 'Digital Guest Experience',
    isActive: true,
    level: 2,
    path: '/1/12/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Digital Guest Experience',
        description: 'Digital Guest Experience'
      },
      zh: {
        name: '数字化运营',
        description: '数字化运营'
      }
    }
  },
  {
    id: 121,
    parentId: 12,
    code: 'ONLINE_ORDERING',
    name: '线上点餐',
    description: 'Online Ordering',
    isActive: true,
    level: 3,
    path: '/1/12/121/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Online Ordering',
        description: 'Online Ordering'
      },
      zh: {
        name: '线上点餐',
        description: '线上点餐'
      }
    }
  },
  {
    id: 122,
    parentId: 12,
    code: 'LOYALTY_MARKETING',
    name: '会员与营销',
    description: 'Loyalty & Marketing',
    isActive: true,
    level: 3,
    path: '/1/12/122/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Loyalty & Marketing',
        description: 'Loyalty & Marketing'
      },
      zh: {
        name: '会员与营销',
        description: '会员与营销'
      }
    }
  },
  {
    id: 13,
    parentId: 1,
    code: 'BACK_OFFICE',
    name: '后厨与供应链',
    description: 'Kitchen & Back-Office',
    isActive: true,
    level: 2,
    path: '/1/13/',
    sortOrder: 3,
    translations: {
      en: {
        name: 'Kitchen & Back-Office',
        description: 'Kitchen & Back-Office'
      },
      zh: {
        name: '后厨与供应链',
        description: '后厨与供应链'
      }
    }
  },
  {
    id: 131,
    parentId: 13,
    code: 'KDS',
    name: '厨房显控',
    description: 'KDS',
    isActive: true,
    level: 3,
    path: '/1/13/131/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'KDS',
        description: 'KDS'
      },
      zh: {
        name: '厨房显控',
        description: '厨房显控'
      }
    }
  },
  {
    id: 132,
    parentId: 13,
    code: 'INVENTORY',
    name: '进销存管理',
    description: 'Inventory',
    isActive: true,
    level: 3,
    path: '/1/13/132/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Inventory',
        description: 'Inventory'
      },
      zh: {
        name: '进销存管理',
        description: '进销存管理'
      }
    }
  },
  {
    id: 2,
    parentId: null,
    code: 'HARDWARE',
    name: '智能硬件与外设',
    description: 'Smart Hardware & Devices',
    isActive: true,
    level: 1,
    path: '/2/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Smart Hardware & Devices',
        description: 'Smart Hardware & Devices'
      },
      zh: {
        name: '智能硬件与外设',
        description: '智能硬件与外设'
      }
    }
  },
  {
    id: 21,
    parentId: 2,
    code: 'POS_TERMINALS',
    name: '收银与触控终端',
    description: 'POS Terminals',
    isActive: true,
    level: 2,
    path: '/2/21/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'POS Terminals',
        description: 'POS Terminals'
      },
      zh: {
        name: '收银与触控终端',
        description: '收银与触控终端'
      }
    }
  },
  {
    id: 211,
    parentId: 21,
    code: 'COUNTERTOP_POS',
    name: '桌面收银机',
    description: 'Countertop POS',
    isActive: true,
    level: 3,
    path: '/2/21/211/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Countertop POS',
        description: 'Countertop POS'
      },
      zh: {
        name: '桌面收银机',
        description: '桌面收银机'
      }
    }
  },
  {
    id: 212,
    parentId: 21,
    code: 'MOBILE_KIOSK',
    name: '移动与自助设备',
    description: 'Mobile & Kiosk',
    isActive: true,
    level: 3,
    path: '/2/21/212/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Mobile & Kiosk',
        description: 'Mobile & Kiosk'
      },
      zh: {
        name: '移动与自助设备',
        description: '移动与自助设备'
      }
    }
  },
  {
    id: 22,
    parentId: 2,
    code: 'PRINTERS_NET',
    name: '打印与网络设备',
    description: 'Printers & Networking',
    isActive: true,
    level: 2,
    path: '/2/22/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Printers & Networking',
        description: 'Printers & Networking'
      },
      zh: {
        name: '打印与网络设备',
        description: '打印与网络设备'
      }
    }
  },
  {
    id: 221,
    parentId: 22,
    code: 'PRINTERS',
    name: '打印机',
    description: 'Printers',
    isActive: true,
    level: 3,
    path: '/2/22/221/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Printers',
        description: 'Printers'
      },
      zh: {
        name: '打印机',
        description: '打印机'
      }
    }
  },
  {
    id: 222,
    parentId: 22,
    code: 'NETWORKING',
    name: '网络基建',
    description: 'Networking',
    isActive: true,
    level: 3,
    path: '/2/22/222/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Networking',
        description: 'Networking'
      },
      zh: {
        name: '网络基建',
        description: '网络基建'
      }
    }
  },
  {
    id: 3,
    parentId: null,
    code: 'FINTECH',
    name: '金融与支付网关',
    description: 'Fintech & Payment Processing',
    isActive: true,
    level: 1,
    path: '/3/',
    sortOrder: 3,
    translations: {
      en: {
        name: 'Fintech & Payment Processing',
        description: 'Fintech & Payment Processing'
      },
      zh: {
        name: '金融与支付网关',
        description: '金融与支付网关'
      }
    }
  },
  {
    id: 31,
    parentId: 3,
    code: 'PAYMENT_RATES',
    name: '支付费率与服务',
    description: 'Payment Rates',
    isActive: true,
    level: 2,
    path: '/3/31/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Payment Rates',
        description: 'Payment Rates'
      },
      zh: {
        name: '支付费率与服务',
        description: '支付费率与服务'
      }
    }
  },
  {
    id: 311,
    parentId: 31,
    code: 'CC_PROCESSING',
    name: '信用卡收单',
    description: 'Credit Card Processing',
    isActive: true,
    level: 3,
    path: '/3/31/311/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Credit Card Processing',
        description: 'Credit Card Processing'
      },
      zh: {
        name: '信用卡收单',
        description: '信用卡收单'
      }
    }
  },
  {
    id: 312,
    parentId: 31,
    code: 'LOCAL_WALLETS',
    name: '本地钱包与扫码',
    description: 'Local Wallets',
    isActive: true,
    level: 3,
    path: '/3/31/312/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Local Wallets',
        description: 'Local Wallets'
      },
      zh: {
        name: '本地钱包与扫码',
        description: '本地钱包与扫码'
      }
    }
  },
  {
    id: 32,
    parentId: 3,
    code: 'PAYMENT_TERMINALS',
    name: '支付终端硬件',
    description: 'Payment Terminals',
    isActive: true,
    level: 2,
    path: '/3/32/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Payment Terminals',
        description: 'Payment Terminals'
      },
      zh: {
        name: '支付终端硬件',
        description: '支付终端硬件'
      }
    }
  },
  {
    id: 321,
    parentId: 32,
    code: 'CARD_READERS',
    name: '刷卡设备',
    description: 'Card Readers',
    isActive: true,
    level: 3,
    path: '/3/32/321/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Card Readers',
        description: 'Card Readers'
      },
      zh: {
        name: '刷卡设备',
        description: '刷卡设备'
      }
    }
  },
  {
    id: 4,
    parentId: null,
    code: 'SERVICES',
    name: '专业服务与耗材',
    description: 'Professional Services & Consumables',
    isActive: true,
    level: 1,
    path: '/4/',
    sortOrder: 4,
    translations: {
      en: {
        name: 'Professional Services & Consumables',
        description: 'Professional Services & Consumables'
      },
      zh: {
        name: '专业服务与耗材',
        description: '专业服务与耗材'
      }
    }
  },
  {
    id: 41,
    parentId: 4,
    code: 'ONBOARDING',
    name: '实施与培训',
    description: 'Onboarding Services',
    isActive: true,
    level: 2,
    path: '/4/41/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Onboarding Services',
        description: 'Onboarding Services'
      },
      zh: {
        name: '实施与培训',
        description: '实施与培训'
      }
    }
  },
  {
    id: 411,
    parentId: 41,
    code: 'DEPLOYMENT',
    name: '部署服务',
    description: 'Deployment',
    isActive: true,
    level: 3,
    path: '/4/41/411/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Deployment',
        description: 'Deployment'
      },
      zh: {
        name: '部署服务',
        description: '部署服务'
      }
    }
  },
  {
    id: 412,
    parentId: 41,
    code: 'TRAINING',
    name: '培训服务',
    description: 'Training',
    isActive: true,
    level: 3,
    path: '/4/41/412/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Training',
        description: 'Training'
      },
      zh: {
        name: '培训服务',
        description: '培训服务'
      }
    }
  },
  {
    id: 42,
    parentId: 4,
    code: 'CONSUMABLES',
    name: '耗材与增值服务',
    description: 'Consumables & Add-ons',
    isActive: true,
    level: 2,
    path: '/4/42/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Consumables & Add-ons',
        description: 'Consumables & Add-ons'
      },
      zh: {
        name: '耗材与增值服务',
        description: '耗材与增值服务'
      }
    }
  },
  {
    id: 421,
    parentId: 42,
    code: 'PHYSICAL_SUPPLIES',
    name: '物理耗材',
    description: 'Physical Supplies',
    isActive: true,
    level: 3,
    path: '/4/42/421/',
    sortOrder: 1,
    translations: {
      en: {
        name: 'Physical Supplies',
        description: 'Physical Supplies'
      },
      zh: {
        name: '物理耗材',
        description: '物理耗材'
      }
    }
  },
  {
    id: 422,
    parentId: 42,
    code: 'VIRTUAL_CREDITS',
    name: '虚拟消耗品',
    description: 'Virtual Credits',
    isActive: true,
    level: 3,
    path: '/4/42/422/',
    sortOrder: 2,
    translations: {
      en: {
        name: 'Virtual Credits',
        description: 'Virtual Credits'
      },
      zh: {
        name: '虚拟消耗品',
        description: '虚拟消耗品'
      }
    }
  }
];
