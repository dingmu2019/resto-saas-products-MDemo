import { Product } from '../../types';

export const mockProducts: Product[] = [
  {
    id: 101,
    categoryId: 111,
    productCode: 'PROD-POS_SW-101',
    name: 'RestoPOS 快餐版 POS 软件',
    description: '专为快餐和饮品店设计的轻量级 POS 系统，支持扫码点餐、外卖集成。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Quick Service POS Software',
        description: 'Lightweight POS system designed for QSR and beverage shops, supporting QR ordering and delivery integration.'
      },
      zh: {
        name: 'RestoPOS 快餐版 POS 软件',
        description: '专为快餐和饮品店设计的轻量级 POS 系统，支持扫码点餐、外卖集成。'
      }
    }
  },
  {
    id: 102,
    categoryId: 112,
    productCode: 'PROD-POS_SW-102',
    name: 'RestoPOS 正餐版 POS 软件',
    description: '功能强大的正餐 POS 系统，支持桌台管理、预订、多打印机调度。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Full Service POS Software',
        description: 'Powerful POS system for full-service restaurants, supporting table management, reservations, and multi-printer routing.'
      },
      zh: {
        name: 'RestoPOS 正餐版 POS 软件',
        description: '功能强大的正餐 POS 系统，支持桌台管理、预订、多打印机调度。'
      }
    }
  },
  {
    id: 103,
    categoryId: 112,
    productCode: 'PROD-POS_SW-103',
    name: 'RestoPOS 零售版 POS 软件',
    description: '适用于精品零售店，支持库存管理、会员积分、条码扫描。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Retail POS Software',
        description: 'Suitable for boutique retail, supporting inventory management, loyalty points, and barcode scanning.'
      },
      zh: {
        name: 'RestoPOS 零售版 POS 软件',
        description: '适用于精品零售店，支持库存管理、会员积分、条码扫描。'
      }
    }
  },
  {
    id: 104,
    categoryId: 11,
    productCode: 'PROD-POS_SW-104',
    name: 'RestoPOS 连锁总部管理系统',
    description: '集中管理多门店菜单、价格、员工权限及报表汇总。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Enterprise HQ Manager',
        description: 'Centralized management for multi-store menus, pricing, staff permissions, and reporting.'
      },
      zh: {
        name: 'RestoPOS 连锁总部管理系统',
        description: '集中管理多门店菜单、价格、员工权限及报表汇总。'
      }
    }
  },
  {
    id: 105,
    categoryId: 121,
    productCode: 'PROD-POS_SW-105',
    name: 'RestoPOS 移动点餐 APP',
    description: '支持服务员手持设备点餐，实时同步后厨。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Mobile Ordering App',
        description: 'Supports waiter handheld ordering with real-time kitchen synchronization.'
      },
      zh: {
        name: 'RestoPOS 移动点餐 APP',
        description: '支持服务员手持设备点餐，实时同步后厨。'
      }
    }
  },
  {
    id: 106,
    categoryId: 111,
    productCode: 'PROD-POS_SW-106',
    name: 'RestoPOS 自助点餐 Kiosk 软件',
    description: '用于自助点餐机，支持多语言、会员登录、聚合支付。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Self-Service Kiosk Software',
        description: 'For self-service kiosks, supporting multi-language, member login, and integrated payments.'
      },
      zh: {
        name: 'RestoPOS 自助点餐 Kiosk 软件',
        description: '用于自助点餐机，支持多语言、会员登录、聚合支付。'
      }
    }
  },
  {
    id: 146,
    categoryId: 121,
    productCode: 'PROD-POS_SW-146',
    name: 'RestoPOS 扫码点餐系统',
    description: '支持顾客手机扫码点餐，自动同步后厨，提升翻台率。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS QR Scan-to-Order System',
        description: 'Supports customer QR code ordering, auto-sync to kitchen, improves table turnover.'
      },
      zh: {
        name: 'RestoPOS 扫码点餐系统',
        description: '支持顾客手机扫码点餐，自动同步后厨，提升翻台率。'
      }
    }
  },
  {
    id: 147,
    categoryId: 131,
    productCode: 'PROD-POS_SW-147',
    name: 'RestoPOS 厨房打印调度软件',
    description: '智能调度厨房小票打印，支持分单、合单打印。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Kitchen Print Routing Software',
        description: 'Intelligent routing for kitchen receipts, supports split and merged printing.'
      },
      zh: {
        name: 'RestoPOS 厨房打印调度软件',
        description: '智能调度厨房小票打印，支持分单、合单打印。'
      }
    }
  },
  {
    id: 107,
    categoryId: 211,
    productCode: 'PROD-POS_HW-107',
    name: 'RestoPOS 15寸单屏收银机',
    description: '高性能 15 寸电容触摸屏，铝合金机身，稳定耐用。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 15" Single Screen Terminal',
        description: 'High-performance 15" capacitive touch screen, aluminum body, stable and durable.'
      },
      zh: {
        name: 'RestoPOS 15寸单屏收银机',
        description: '高性能 15 寸电容触摸屏，铝合金机身，稳定耐用。'
      }
    }
  },
  {
    id: 108,
    categoryId: 211,
    productCode: 'PROD-POS_HW-108',
    name: 'RestoPOS 15寸双屏收银机',
    description: '主屏 15 寸 + 客显屏 15 寸，支持广告展示和订单确认。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 15" Dual Screen Terminal',
        description: '15" Main screen + 15" customer display, supports advertising and order confirmation.'
      },
      zh: {
        name: 'RestoPOS 15寸双屏收银机',
        description: '主屏 15 寸 + 客显屏 15 寸，支持广告展示和订单确认。'
      }
    }
  },
  {
    id: 109,
    categoryId: 221,
    productCode: 'PROD-POS_HW-109',
    name: 'RestoPOS 80mm 热敏小票打印机',
    description: '高速打印，支持切刀，多种接口（USB/LAN/Serial）。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 80mm Thermal Receipt Printer',
        description: 'High-speed printing with auto-cutter, multiple interfaces (USB/LAN/Serial).'
      },
      zh: {
        name: 'RestoPOS 80mm 热敏小票打印机',
        description: '高速打印，支持切刀，多种接口（USB/LAN/Serial）。'
      }
    }
  },
  {
    id: 110,
    categoryId: 221,
    productCode: 'PROD-POS_HW-110',
    name: 'RestoPOS 厨房标签打印机',
    description: '支持不干胶标签打印，防油防水设计，适合厨房环境。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Kitchen Label Printer',
        description: 'Supports adhesive label printing, oil and water resistant design for kitchen environments.'
      },
      zh: {
        name: 'RestoPOS 厨房标签打印机',
        description: '支持不干胶标签打印，防油防水设计，适合厨房环境。'
      }
    }
  },
  {
    id: 111,
    categoryId: 211,
    productCode: 'PROD-POS_HW-111',
    name: 'RestoPOS 智能钱箱',
    description: '标准三档锁，重型钢结构，支持 RJ11 接口。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Smart Cash Drawer',
        description: 'Standard 3-position lock, heavy-duty steel construction, RJ11 interface support.'
      },
      zh: {
        name: 'RestoPOS 智能钱箱',
        description: '标准三档锁，重型钢结构，支持 RJ11 接口。'
      }
    }
  },
  {
    id: 112,
    categoryId: 211,
    productCode: 'PROD-POS_HW-112',
    name: 'RestoPOS 二维码扫描枪',
    description: '支持屏幕扫码，快速识别微信、支付宝付款码。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 2D Barcode Scanner',
        description: 'Supports screen scanning, fast recognition of WeChat and Alipay payment codes.'
      },
      zh: {
        name: 'RestoPOS 二维码扫描枪',
        description: '支持屏幕扫码，快速识别微信、支付宝付款码。'
      }
    }
  },
  {
    id: 113,
    categoryId: 131,
    productCode: 'PROD-POS_HW-113',
    name: 'RestoPOS 10寸厨房显示屏 (KDS)',
    description: '工业级触摸屏，支持壁挂，实时显示待做订单。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 10" Kitchen Display System (KDS)',
        description: 'Industrial-grade touch screen, supports wall mounting, real-time order display.'
      },
      zh: {
        name: 'RestoPOS 10寸厨房显示屏 (KDS)',
        description: '工业级触摸屏，支持壁挂，实时显示待做订单。'
      }
    }
  },
  {
    id: 114,
    categoryId: 212,
    productCode: 'PROD-POS_HW-114',
    name: 'RestoPOS 移动支付手持终端',
    description: '内置打印机，支持 4G/WiFi，随时随地收银。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Mobile Payment Terminal',
        description: 'Built-in printer, supports 4G/WiFi, order and pay anywhere.'
      },
      zh: {
        name: 'RestoPOS 移动支付手持终端',
        description: '内置打印机，支持 4G/WiFi，随时随地收银。'
      }
    }
  },
  {
    id: 115,
    categoryId: 211,
    productCode: 'PROD-POS_HW-115',
    name: 'RestoPOS 智能电子秤',
    description: '高精度称重，与 POS 系统无缝对接，适合生鲜零售。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Smart Electronic Scale',
        description: 'High-precision weighing, seamless integration with POS, suitable for fresh retail.'
      },
      zh: {
        name: 'RestoPOS 智能电子秤',
        description: '高精度称重，与 POS 系统无缝对接，适合生鲜零售。'
      }
    }
  },
  {
    id: 116,
    categoryId: 212,
    productCode: 'PROD-POS_HW-116',
    name: 'RestoPOS 呼叫器套装',
    description: '包含 1 个发射主机和 10 个接收子机，适合排队取餐。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Pager System Set',
        description: 'Includes 1 transmitter and 10 pagers, suitable for queue management.'
      },
      zh: {
        name: 'RestoPOS 呼叫器套装',
        description: '包含 1 个发射主机和 10 个接收子机，适合排队取餐。'
      }
    }
  },
  {
    id: 117,
    categoryId: 222,
    productCode: 'PROD-POS_HW-117',
    name: 'RestoPOS 路由器 (商用版)',
    description: '支持多设备稳定连接，保障收银系统网络畅通。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Commercial Router',
        description: 'Supports stable connection for multiple devices, ensuring POS network reliability.'
      },
      zh: {
        name: 'RestoPOS 路由器 (商用版)',
        description: '支持多设备稳定连接，保障收银系统网络畅通。'
      }
    }
  },
  {
    id: 118,
    categoryId: 222,
    productCode: 'PROD-POS_HW-118',
    name: 'RestoPOS 备用电源 (UPS)',
    description: '防止意外断电导致的数据丢失，支持 POS 运行 30 分钟。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Uninterruptible Power Supply (UPS)',
        description: 'Prevents data loss from power outages, supports POS for 30 minutes.'
      },
      zh: {
        name: 'RestoPOS 备用电源 (UPS)',
        description: '防止意外断电导致的数据丢失，支持 POS 运行 30 分钟。'
      }
    }
  },
  {
    id: 119,
    categoryId: 211,
    productCode: 'PROD-POS_HW-119',
    name: 'RestoPOS 15寸电容触摸屏 (备件)',
    description: '原厂 15 寸触摸屏备件。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 15" Capacitive Touch Screen (Spare)',
        description: 'Original 15" touch screen spare part.'
      },
      zh: {
        name: 'RestoPOS 15寸电容触摸屏 (备件)',
        description: '原厂 15 寸触摸屏备件。'
      }
    }
  },
  {
    id: 120,
    categoryId: 221,
    productCode: 'PROD-POS_HW-120',
    name: 'RestoPOS 打印机切刀 (备件)',
    description: '适用于 80mm 热敏打印机的原厂切刀。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS Printer Cutter (Spare)',
        description: 'Original cutter for 80mm thermal printers.'
      },
      zh: {
        name: 'RestoPOS 打印机切刀 (备件)',
        description: '适用于 80mm 热敏打印机的原厂切刀。'
      }
    }
  },
  {
    id: 121,
    categoryId: 212,
    productCode: 'PROD-POS_HW-121',
    name: 'RestoPOS 21寸自助点餐机 (立式)',
    description: '大屏幕自助点餐，支持刷脸支付，提升餐厅效率。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 21" Self-Service Kiosk (Floor Stand)',
        description: 'Large screen self-service ordering, supports face payment, improves efficiency.'
      },
      zh: {
        name: 'RestoPOS 21寸自助点餐机 (立式)',
        description: '大屏幕自助点餐，支持刷脸支付，提升餐厅效率。'
      }
    }
  },
  {
    id: 122,
    categoryId: 212,
    productCode: 'PROD-POS_HW-122',
    name: 'RestoPOS 21寸自助点餐机 (壁挂)',
    description: '节省空间的自助点餐方案。',
    productType: 'hardware',
    translations: {
      en: {
        name: 'RestoPOS 21" Self-Service Kiosk (Wall Mount)',
        description: 'Space-saving self-service ordering solution.'
      },
      zh: {
        name: 'RestoPOS 21寸自助点餐机 (壁挂)',
        description: '节省空间的自助点餐方案。'
      }
    }
  },
  {
    id: 123,
    categoryId: 411,
    productCode: 'PROD-POS_SV-123',
    name: 'RestoPOS 基础安装服务',
    description: '专业工程师上门安装、调试收银系统。',
    productType: 'service',
    translations: {
      en: {
        name: 'RestoPOS Basic Installation Service',
        description: 'Professional engineer on-site installation and debugging.'
      },
      zh: {
        name: 'RestoPOS 基础安装服务',
        description: '专业工程师上门安装、调试收银系统。'
      }
    }
  },
  {
    id: 124,
    categoryId: 412,
    productCode: 'PROD-POS_SV-124',
    name: 'RestoPOS 员工培训服务',
    description: '针对餐厅员工的系统操作培训。',
    productType: 'service',
    translations: {
      en: {
        name: 'RestoPOS Staff Training Service',
        description: 'System operation training for restaurant staff.'
      },
      zh: {
        name: 'RestoPOS 员工培训服务',
        description: '针对餐厅员工的系统操作培训。'
      }
    }
  },
  {
    id: 125,
    categoryId: 41,
    productCode: 'PROD-POS_SV-125',
    name: 'RestoPOS 7x24 远程技术支持',
    description: '全天候远程协助，快速解决系统问题。',
    productType: 'service',
    translations: {
      en: {
        name: 'RestoPOS 7x24 Remote Tech Support',
        description: '24/7 remote assistance to quickly resolve system issues.'
      },
      zh: {
        name: 'RestoPOS 7x24 远程技术支持',
        description: '全天候远程协助，快速解决系统问题。'
      }
    }
  },
  {
    id: 126,
    categoryId: 2,
    productCode: 'PROD-POS_SV-126',
    name: 'RestoPOS 硬件延保服务 (1年)',
    description: '为收银硬件提供额外 1 年的保修。',
    productType: 'service',
    translations: {
      en: {
        name: 'RestoPOS Hardware Extended Warranty (1 Year)',
        description: 'Provides an additional 1-year warranty for POS hardware.'
      },
      zh: {
        name: 'RestoPOS 硬件延保服务 (1年)',
        description: '为收银硬件提供额外 1 年的保修。'
      }
    }
  },
  {
    id: 127,
    categoryId: 111,
    productCode: 'PROD-POS_BD-127',
    name: 'RestoPOS 快餐店开店套餐',
    description: '包含快餐版软件 + 单屏收银机 + 打印机 + 钱箱。',
    productType: 'bundle',
    translations: {
      en: {
        name: 'RestoPOS QSR Starter Bundle',
        description: 'Includes QSR software + single screen terminal + printer + cash drawer.'
      },
      zh: {
        name: 'RestoPOS 快餐店开店套餐',
        description: '包含快餐版软件 + 单屏收银机 + 打印机 + 钱箱。'
      }
    }
  },
  {
    id: 128,
    categoryId: 112,
    productCode: 'PROD-POS_BD-128',
    name: 'RestoPOS 正餐店专业套餐',
    description: '包含正餐版软件 + 双屏收银机 + 2台打印机 + 钱箱 + 5个呼叫器。',
    productType: 'bundle',
    translations: {
      en: {
        name: 'RestoPOS Full Service Pro Bundle',
        description: 'Includes full service software + dual screen terminal + 2 printers + cash drawer + 5 pagers.'
      },
      zh: {
        name: 'RestoPOS 正餐店专业套餐',
        description: '包含正餐版软件 + 双屏收银机 + 2台打印机 + 钱箱 + 5个呼叫器。'
      }
    }
  },
  {
    id: 129,
    categoryId: 421,
    productCode: 'PROD-POS_CS-129',
    name: 'RestoPOS 80mm 热敏打印纸 (50卷)',
    description: '高品质热敏纸，显色清晰，不伤打印头。',
    productType: 'consumable',
    translations: {
      en: {
        name: 'RestoPOS 80mm Thermal Paper (50 Rolls)',
        description: 'High-quality thermal paper, clear printing, protects print head.'
      },
      zh: {
        name: 'RestoPOS 80mm 热敏打印纸 (50卷)',
        description: '高品质热敏纸，显色清晰，不伤打印头。'
      }
    }
  },
  {
    id: 130,
    categoryId: 421,
    productCode: 'PROD-POS_CS-130',
    name: 'RestoPOS 厨房标签纸 (20卷)',
    description: '防油防水不干胶标签，适合厨房使用。',
    productType: 'consumable',
    translations: {
      en: {
        name: 'RestoPOS Kitchen Label Paper (20 Rolls)',
        description: 'Oil and water resistant adhesive labels for kitchen use.'
      },
      zh: {
        name: 'RestoPOS 厨房标签纸 (20卷)',
        description: '防油防水不干胶标签，适合厨房使用。'
      }
    }
  },
  {
    id: 131,
    categoryId: 111,
    productCode: 'PROD-POS_SW-131',
    name: 'RestoPOS 咖啡茶饮版 POS 软件',
    description: '支持复杂的配料选择、加料管理、标签自动打印。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Coffee & Tea POS Software',
        description: 'Supports complex topping selections, modifier management, and auto label printing.'
      },
      zh: {
        name: 'RestoPOS 咖啡茶饮版 POS 软件',
        description: '支持复杂的配料选择、加料管理、标签自动打印。'
      }
    }
  },
  {
    id: 132,
    categoryId: 112,
    productCode: 'PROD-POS_SW-132',
    name: 'RestoPOS 酒吧版 POS 软件',
    description: '支持开台存酒、分单支付、快乐时光价格自动切换。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Bar & Lounge POS Software',
        description: 'Supports bottle storage, split payments, and automatic Happy Hour pricing.'
      },
      zh: {
        name: 'RestoPOS 酒吧版 POS 软件',
        description: '支持开台存酒、分单支付、快乐时光价格自动切换。'
      }
    }
  },
  {
    id: 133,
    categoryId: 112,
    productCode: 'PROD-POS_SW-133',
    name: 'RestoPOS 烘焙版 POS 软件',
    description: '支持称重计价、保质期管理、预订取货。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Bakery POS Software',
        description: 'Supports weight-based pricing, shelf-life management, and pre-order pickup.'
      },
      zh: {
        name: 'RestoPOS 烘焙版 POS 软件',
        description: '支持称重计价、保质期管理、预订取货。'
      }
    }
  },
  {
    id: 134,
    categoryId: 111,
    productCode: 'PROD-POS_SW-134',
    name: 'RestoPOS 美食广场版 POS 软件',
    description: '支持统一发卡、档口结算、多商户报表。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Food Court POS Software',
        description: 'Supports centralized card issuing, stall settlement, and multi-merchant reporting.'
      },
      zh: {
        name: 'RestoPOS 美食广场版 POS 软件',
        description: '支持统一发卡、档口结算、多商户报表。'
      }
    }
  },
  {
    id: 135,
    categoryId: 112,
    productCode: 'PROD-POS_SW-135',
    name: 'RestoPOS 酒店餐饮版 POS 软件',
    description: '支持房费挂账、宴会管理、与 PMS 系统集成。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Hotel F&B POS Software',
        description: 'Supports room charging, banquet management, and PMS integration.'
      },
      zh: {
        name: 'RestoPOS 酒店餐饮版 POS 软件',
        description: '支持房费挂账、宴会管理、与 PMS 系统集成。'
      }
    }
  },
  {
    id: 136,
    categoryId: 132,
    productCode: 'PROD-POS_SW-136',
    name: 'RestoPOS 供应链管理系统',
    description: '集中采购、中央厨房加工、门店配送管理。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Supply Chain Management',
        description: 'Centralized purchasing, central kitchen processing, and store distribution.'
      },
      zh: {
        name: 'RestoPOS 供应链管理系统',
        description: '集中采购、中央厨房加工、门店配送管理。'
      }
    }
  },
  {
    id: 137,
    categoryId: 11,
    productCode: 'PROD-POS_SW-137',
    name: 'RestoPOS 财务集成模块',
    description: '自动同步销售数据至主流财务软件（如金蝶、用友）。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Finance Integration Module',
        description: 'Auto-sync sales data to major accounting software.'
      },
      zh: {
        name: 'RestoPOS 财务集成模块',
        description: '自动同步销售数据至主流财务软件（如金蝶、用友）。'
      }
    }
  },
  {
    id: 138,
    categoryId: 122,
    productCode: 'PROD-POS_SW-138',
    name: 'RestoPOS 顾客忠诚度 APP',
    description: '顾客端 APP，支持积分查询、优惠券领取、在线订位。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Customer Loyalty App',
        description: 'Customer-facing app for points, coupons, and online reservations.'
      },
      zh: {
        name: 'RestoPOS 顾客忠诚度 APP',
        description: '顾客端 APP，支持积分查询、优惠券领取、在线订位。'
      }
    }
  },
  {
    id: 139,
    categoryId: 131,
    productCode: 'PROD-POS_SW-139',
    name: 'RestoPOS 厨房显示系统 (KDS) 软件',
    description: '运行于 KDS 硬件，支持订单分色显示、超时预警。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS KDS Software',
        description: 'Runs on KDS hardware, supporting color-coded orders and timeout alerts.'
      },
      zh: {
        name: 'RestoPOS 厨房显示系统 (KDS) 软件',
        description: '运行于 KDS 硬件，支持订单分色显示、超时预警。'
      }
    }
  },
  {
    id: 140,
    categoryId: 121,
    productCode: 'PROD-POS_SW-140',
    name: 'RestoPOS 智能排队系统软件',
    description: '支持在线取号、进度查询、语音叫号。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Smart Queuing Software',
        description: 'Supports online ticketing, progress tracking, and voice calling.'
      },
      zh: {
        name: 'RestoPOS 智能排队系统软件',
        description: '支持在线取号、进度查询、语音叫号。'
      }
    }
  },
  {
    id: 141,
    categoryId: 111,
    productCode: 'PROD-POS_SW-141',
    name: 'RestoPOS 英文版 POS 软件',
    description: '全英文界面，符合海外经营习惯及税制。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS English Edition',
        description: 'Full English interface, compliant with overseas operations and tax systems.'
      },
      zh: {
        name: 'RestoPOS 英文版 POS 软件',
        description: '全英文界面，符合海外经营习惯及税制。'
      }
    }
  },
  {
    id: 142,
    categoryId: 111,
    productCode: 'PROD-POS_SW-142',
    name: 'RestoPOS 多语言版 POS 软件',
    description: '支持中、英、日、韩等多国语言切换。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Multi-language Edition',
        description: 'Supports Chinese, English, Japanese, Korean, etc.'
      },
      zh: {
        name: 'RestoPOS 多语言版 POS 软件',
        description: '支持中、英、日、韩等多国语言切换。'
      }
    }
  },
  {
    id: 143,
    categoryId: 111,
    productCode: 'PROD-POS_SW-143',
    name: 'RestoPOS 离线版 POS 软件',
    description: '支持断网模式下正常收银，网络恢复后自动同步。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Offline Edition',
        description: 'Supports normal operations during network outages with auto-sync.'
      },
      zh: {
        name: 'RestoPOS 离线版 POS 软件',
        description: '支持断网模式下正常收银，网络恢复后自动同步。'
      }
    }
  },
  {
    id: 144,
    categoryId: 111,
    productCode: 'PROD-POS_SW-144',
    name: 'RestoPOS 极简版 POS 软件',
    description: '去除复杂功能，仅保留核心点餐收银，适合小微摊位。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Lite Edition',
        description: 'Core ordering and checkout only, suitable for micro-stalls.'
      },
      zh: {
        name: 'RestoPOS 极简版 POS 软件',
        description: '去除复杂功能，仅保留核心点餐收银，适合小微摊位。'
      }
    }
  },
  {
    id: 145,
    categoryId: 111,
    productCode: 'PROD-POS_SW-145',
    name: 'RestoPOS 团餐版 POS 软件',
    description: '支持食堂刷卡、餐券核销、批量结算。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Cafeteria Edition',
        description: 'Supports card swiping, coupon redemption, and bulk settlement.'
      },
      zh: {
        name: 'RestoPOS 团餐版 POS 软件',
        description: '支持食堂刷卡、餐券核销、批量结算。'
      }
    }
  },
  {
    id: 155,
    categoryId: 111,
    productCode: 'PROD-POS_SW-146',
    name: 'RestoPOS 移动收银版 POS 软件',
    description: '专为手持终端优化，界面简洁，操作快捷。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Mobile POS Edition',
        description: 'Optimized for handheld terminals with a simple interface.'
      },
      zh: {
        name: 'RestoPOS 移动收银版 POS 软件',
        description: '专为手持终端优化，界面简洁，操作快捷。'
      }
    }
  },
  {
    id: 156,
    categoryId: 111,
    productCode: 'PROD-POS_SW-147',
    name: 'RestoPOS 智能报表版 POS 软件',
    description: '强化报表功能，支持自定义维度分析、自动发送邮件。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Analytics Edition',
        description: 'Enhanced reporting with custom analysis and auto-emailing.'
      },
      zh: {
        name: 'RestoPOS 智能报表版 POS 软件',
        description: '强化报表功能，支持自定义维度分析、自动发送邮件。'
      }
    }
  },
  {
    id: 157,
    categoryId: 111,
    productCode: 'PROD-POS_SW-148',
    name: 'RestoPOS 营销增强版 POS 软件',
    description: '内置多种营销工具，如满减、折扣、套餐自动匹配。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Marketing Edition',
        description: 'Built-in marketing tools like discounts and auto-bundle matching.'
      },
      zh: {
        name: 'RestoPOS 营销增强版 POS 软件',
        description: '内置多种营销工具，如满减、折扣、套餐自动匹配。'
      }
    }
  },
  {
    id: 149,
    categoryId: 111,
    productCode: 'PROD-POS_SW-149',
    name: 'RestoPOS 员工管理版 POS 软件',
    description: '强化员工考勤、提成计算、权限精细化管理。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Staff Manager Edition',
        description: 'Enhanced attendance, commission calculation, and permission management.'
      },
      zh: {
        name: 'RestoPOS 员工管理版 POS 软件',
        description: '强化员工考勤、提成计算、权限精细化管理。'
      }
    }
  },
  {
    id: 150,
    categoryId: 111,
    productCode: 'PROD-POS_SW-150',
    name: 'RestoPOS 客户关系版 POS 软件',
    description: '强化 CRM 功能，支持客户画像、精准营销推送。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS CRM Edition',
        description: 'Enhanced CRM with customer profiling and targeted marketing.'
      },
      zh: {
        name: 'RestoPOS 客户关系版 POS 软件',
        description: '强化 CRM 功能，支持客户画像、精准营销推送。'
      }
    }
  },
  {
    id: 151,
    categoryId: 111,
    productCode: 'PROD-POS_SW-151',
    name: 'RestoPOS 开放平台版 POS 软件',
    description: '提供完整 SDK/API，支持深度二次开发。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Platform Edition',
        description: 'Provides full SDK/API for deep secondary development.'
      },
      zh: {
        name: 'RestoPOS 开放平台版 POS 软件',
        description: '提供完整 SDK/API，支持深度二次开发。'
      }
    }
  },
  {
    id: 152,
    categoryId: 111,
    productCode: 'PROD-POS_SW-152',
    name: 'RestoPOS 云端备份版 POS 软件',
    description: '实时云端备份所有交易数据，安全无忧。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Cloud Backup Edition',
        description: 'Real-time cloud backup for all transaction data.'
      },
      zh: {
        name: 'RestoPOS 云端备份版 POS 软件',
        description: '实时云端备份所有交易数据，安全无忧。'
      }
    }
  },
  {
    id: 153,
    categoryId: 111,
    productCode: 'PROD-POS_SW-153',
    name: 'RestoPOS 智能库存版 POS 软件',
    description: '强化库存预警、自动补货建议。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Inventory Pro Edition',
        description: 'Enhanced inventory alerts and auto-replenishment suggestions.'
      },
      zh: {
        name: 'RestoPOS 智能库存版 POS 软件',
        description: '强化库存预警、自动补货建议。'
      }
    }
  },
  {
    id: 154,
    categoryId: 111,
    productCode: 'PROD-POS_SW-154',
    name: 'RestoPOS 聚合支付版 POS 软件',
    description: '集成全球主流支付方式，一码通收。',
    productType: 'software',
    translations: {
      en: {
        name: 'RestoPOS Global Pay Edition',
        description: 'Integrated global payment methods in one solution.'
      },
      zh: {
        name: 'RestoPOS 聚合支付版 POS 软件',
        description: '集成全球主流支付方式，一码通收。'
      }
    }
  },
  {
    id: 157,
    categoryId: 3,
    productCode: 'PROD-BUNDLE-148',
    name: 'RestoSuite 餐饮全能开店套餐',
    description: '专为餐饮门店设计的全能开店套餐，包含基础软件模块与核心硬件设备，一站式解决开店需求。',
    productType: 'bundle',
    translations: {
      en: {
        name: 'RestoSuite F&B All-in-One Bundle',
        description: 'An all-in-one package designed for F&B stores, including basic software modules and core hardware devices, a one-stop solution for opening a store.'
      },
      zh: {
        name: 'RestoSuite 餐饮全能开店套餐',
        description: '专为餐饮门店设计的全能开店套餐，包含基础软件模块与核心硬件设备，一站式解决开店需求。'
      }
    }
  }
];
