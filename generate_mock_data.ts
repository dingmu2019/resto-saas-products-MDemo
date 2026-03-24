import * as fs from 'fs';

const categories = [
  { id: 111, code: 'QSR_EDITION', name: '快餐版', translations: { en: { name: 'QSR Edition', description: 'Quick Service Restaurant Edition' }, zh: { name: '快餐版', description: '快餐版收银系统' } } },
  { id: 112, code: 'FSR_EDITION', name: '正餐版', translations: { en: { name: 'FSR Edition', description: 'Full Service Restaurant Edition' }, zh: { name: '正餐版', description: '正餐版收银系统' } } },
  { id: 121, code: 'ONLINE_ORDERING', name: '线上点餐', translations: { en: { name: 'Online Ordering', description: 'Online Ordering System' }, zh: { name: '线上点餐', description: '线上点餐系统' } } },
  { id: 122, code: 'LOYALTY_MARKETING', name: '会员与营销', translations: { en: { name: 'Loyalty & Marketing', description: 'Loyalty and Marketing Tools' }, zh: { name: '会员与营销', description: '会员与营销工具' } } },
  { id: 131, code: 'KDS', name: '厨房显控', translations: { en: { name: 'KDS', description: 'Kitchen Display System' }, zh: { name: '厨房显控', description: '厨房显示系统' } } },
  { id: 132, code: 'INVENTORY', name: '进销存管理', translations: { en: { name: 'Inventory', description: 'Inventory Management' }, zh: { name: '进销存管理', description: '进销存管理系统' } } },
  { id: 211, code: 'COUNTERTOP_POS', name: '桌面收银机', translations: { en: { name: 'Countertop POS', description: 'Countertop Point of Sale' }, zh: { name: '桌面收银机', description: '桌面收银机设备' } } },
  { id: 212, code: 'MOBILE_KIOSK', name: '移动与自助设备', translations: { en: { name: 'Mobile & Kiosk', description: 'Mobile and Kiosk Devices' }, zh: { name: '移动与自助设备', description: '移动与自助点餐设备' } } },
  { id: 221, code: 'PRINTERS', name: '打印机', translations: { en: { name: 'Printers', description: 'Receipt and Kitchen Printers' }, zh: { name: '打印机', description: '小票与后厨打印机' } } },
  { id: 222, code: 'NETWORKING', name: '网络基建', translations: { en: { name: 'Networking', description: 'Networking Equipment' }, zh: { name: '网络基建', description: '网络基础设施设备' } } },
  { id: 311, code: 'CC_PROCESSING', name: '信用卡收单', translations: { en: { name: 'Credit Card Processing', description: 'Credit Card Processing Services' }, zh: { name: '信用卡收单', description: '信用卡收单服务' } } },
  { id: 312, code: 'LOCAL_WALLETS', name: '本地钱包与扫码', translations: { en: { name: 'Local Wallets', description: 'Local Wallets and QR Payments' }, zh: { name: '本地钱包与扫码', description: '本地钱包与扫码支付' } } },
  { id: 321, code: 'CARD_READERS', name: '刷卡设备', translations: { en: { name: 'Card Readers', description: 'Payment Card Readers' }, zh: { name: '刷卡设备', description: '支付刷卡设备' } } },
  { id: 411, code: 'DEPLOYMENT', name: '部署服务', translations: { en: { name: 'Deployment', description: 'Deployment Services' }, zh: { name: '部署服务', description: '系统部署服务' } } },
  { id: 412, code: 'TRAINING', name: '培训服务', translations: { en: { name: 'Training', description: 'Training Services' }, zh: { name: '培训服务', description: '系统操作培训服务' } } },
  { id: 421, code: 'PHYSICAL_SUPPLIES', name: '物理耗材', translations: { en: { name: 'Physical Supplies', description: 'Physical Consumables' }, zh: { name: '物理耗材', description: '物理耗材' } } },
  { id: 422, code: 'VIRTUAL_CREDITS', name: '虚拟消耗品', translations: { en: { name: 'Virtual Credits', description: 'Virtual Credits and Quotas' }, zh: { name: '虚拟消耗品', description: '虚拟消耗品与额度' } } }
];

let products: any[] = [];
let skus: any[] = [];
let bundleGroups: any[] = [];
let bundleOptions: any[] = [];
let priceBookEntries: any[] = [];

let pId = 100;
let sId = 1000;
let pbId = 1;

const realisticNames: Record<string, string[]> = {
  'QSR_EDITION': ['RestoSuite 快餐版收银系统', 'RestoLite 奶茶店专版', 'RestoPro 连锁快餐版'],
  'FSR_EDITION': ['RestoSuite 正餐版收银系统', 'RestoDine 高级餐厅版', 'RestoBistro 小酒馆专版'],
  'ONLINE_ORDERING': ['RestoOrder 微信小程序点餐', 'RestoWeb 网页外卖系统', 'RestoApp 独立品牌APP'],
  'LOYALTY_MARKETING': ['RestoCRM 会员营销系统', 'RestoLoyalty 积分商城', 'RestoCoupon 智能优惠券引擎'],
  'KDS': ['RestoKDS 厨房显示系统', 'RestoPrep 备餐管理屏', 'RestoExpedite 传菜调度系统'],
  'INVENTORY': ['RestoInv 智能进销存', 'RestoSupply 供应链管理', 'RestoCost 成本核算模块'],
  'COUNTERTOP_POS': ['Sunmi T2s 桌面收银机', 'Sunmi T3 PRO 双屏收银机', 'Elo 15寸一体机'],
  'MOBILE_KIOSK': ['Sunmi V2 PRO 移动点单机', 'Sunmi K2 自助点餐机', 'iPad Pro 12.9寸点餐平板'],
  'PRINTERS': ['Epson TM-T88VI 热敏打印机', 'Sunmi 80mm 云打印机', 'Star Micronics 蓝牙打印机'],
  'NETWORKING': ['Cisco Meraki 商业路由器', 'Ubiquiti UniFi AP', 'Netgear 24口千兆交换机'],
  'CC_PROCESSING': ['Stripe 信用卡收单服务', 'Square 支付网关', 'Adyen 全球支付处理'],
  'LOCAL_WALLETS': ['微信/支付宝 聚合支付', 'Apple Pay / Google Pay 接入', '本地电子钱包网关'],
  'CARD_READERS': ['Sunmi P2 智能支付终端', 'Verifone V400m 刷卡机', 'Ingenico Lane/3000'],
  'DEPLOYMENT': ['标准上门安装服务', '高级网络布线与调试', '多门店批量部署服务'],
  'TRAINING': ['店长系统操作培训', '收银员基础培训', '后台管理与报表培训'],
  'PHYSICAL_SUPPLIES': ['80mm 热敏打印纸 (50卷)', '收银机专用钱箱', '员工点餐卡/手环'],
  'VIRTUAL_CREDITS': ['短信发送额度 (10000条)', '电子发票开具额度', 'AI 营销助手调用次数']
};

// Generate 50 regular SPUs
for (let i = 0; i < 50; i++) {
  pId++;
  const cat = categories[i % categories.length];
  const isHardware = cat.id >= 200 && cat.id < 300;
  const isSoftware = cat.id >= 100 && cat.id < 200;
  const isService = cat.id >= 400;
  const isFintech = cat.id >= 300 && cat.id < 400;
  
  let type = 'software';
  if (isHardware) type = 'hardware';
  if (isService) type = 'service';
  if (isFintech) type = 'service';

  const names = realisticNames[cat.code] || [`${cat.name} 产品`];
  const name = names[Math.floor(i / categories.length) % names.length] || `${cat.name} - 型号 ${i + 1}`;

  const enName = `${cat.translations?.en?.name || cat.name} - Model ${i + 1}`;
  const zhName = name;

  products.push({
    id: pId,
    categoryId: cat.id,
    productCode: `PRD-${cat.code}-${pId}`,
    name: name,
    productType: type,
    brand: isHardware ? 'Sunmi' : 'RestoSuite',
    description: `这是 ${cat.name} 类别下的代表性产品：${name}。`,
    translations: {
      en: {
        name: enName,
        description: `This is a representative product in the ${cat.translations?.en?.name || cat.name} category: ${enName}.`
      },
      zh: {
        name: zhName,
        description: `这是 ${cat.name} 类别下的代表性产品：${zhName}。`
      }
    }
  });

  // Generate 1-3 SKUs per product
  const numSkus = (i % 3) + 1;
  for (let j = 0; j < numSkus; j++) {
    sId++;
    
    let skuSuffix = `规格 ${j + 1}`;
    let enSkuSuffix = `Spec ${j + 1}`;
    if (isSoftware) {
      skuSuffix = j === 0 ? '月付版' : (j === 1 ? '年付版' : '终身版');
      enSkuSuffix = j === 0 ? 'Monthly' : (j === 1 ? 'Annual' : 'Lifetime');
    }
    if (isHardware) {
      skuSuffix = j === 0 ? '标准版' : (j === 1 ? '高配版' : '旗舰版');
      enSkuSuffix = j === 0 ? 'Standard' : (j === 1 ? 'Pro' : 'Ultimate');
    }
    
    skus.push({
      id: sId,
      productId: pId,
      skuCode: `SKU-${cat.code}-${pId}-${j+1}`,
      name: `${name} - ${skuSuffix}`,
      billingModel: isSoftware ? 'recurring' : 'one_time',
      billingTerm: isSoftware ? (j % 2 === 0 ? 'monthly' : 'annual') : 'none',
      billingTiming: 'in_advance',
      trialDays: isSoftware ? 14 : 0,
      uom: isHardware ? 'Unit' : 'License',
      lifecycleStatus: 'active',
      isShippable: isHardware,
      isSerialized: isHardware,
      translations: {
        en: {
          name: `${enName} - ${enSkuSuffix}`
        },
        zh: {
          name: `${zhName} - ${skuSuffix}`
        }
      }
    });

    // Price book entries
    priceBookEntries.push({
      id: pbId++,
      priceBookId: 1, // USD
      skuId: sId,
      pricingStrategy: isHardware ? 'per_unit' : 'flat_fee',
      listPrice: 100 + (j * 50) + (i * 10),
      minPrice: 90 + (j * 50) + (i * 10),
      maxDiscountRate: 0.10,
      validFrom: '2026-01-01T00:00:00Z'
    });
    priceBookEntries.push({
      id: pbId++,
      priceBookId: 2, // CNY
      skuId: sId,
      pricingStrategy: isHardware ? 'per_unit' : 'flat_fee',
      listPrice: 700 + (j * 350) + (i * 70),
      minPrice: 630 + (j * 350) + (i * 70),
      maxDiscountRate: 0.10,
      validFrom: '2026-01-01T00:00:00Z'
    });
  }
}

// Generate 5 Bundle SPUs
const bundleNames = [
  '快餐全能创业套装',
  '正餐豪华数字化套装',
  '移动点餐先锋套装',
  '后厨效率提升套装',
  '全渠道营销增长套装'
];

let bGroupId = 1;
let bOptionId = 1;

for (let i = 0; i < 5; i++) {
  pId++;
  products.push({
    id: pId,
    categoryId: 111, // Just put them in QSR or FSR
    productCode: `BND-PKG-${i+1}`,
    name: bundleNames[i],
    productType: 'bundle',
    brand: 'RestoSuite',
    description: `包含软件、硬件和服务的综合套餐 - ${bundleNames[i]}`
  });

  sId++;
  const bundleSkuId = sId;
  skus.push({
    id: bundleSkuId,
    productId: pId,
    skuCode: `SKU-BND-${i+1}`,
    name: bundleNames[i] + ' - 标准版',
    billingModel: 'one_time',
    billingTerm: 'none',
    billingTiming: 'in_advance',
    trialDays: 0,
    uom: 'Bundle',
    lifecycleStatus: 'active',
    isShippable: true,
    isSerialized: false
  });

  priceBookEntries.push({
    id: pbId++,
    priceBookId: 1,
    skuId: bundleSkuId,
    pricingStrategy: 'flat_fee',
    listPrice: 1000 + (i * 500),
    minPrice: 900 + (i * 500),
    maxDiscountRate: 0.15,
    validFrom: '2026-01-01T00:00:00Z'
  });
  priceBookEntries.push({
    id: pbId++,
    priceBookId: 2,
    skuId: bundleSkuId,
    pricingStrategy: 'flat_fee',
    listPrice: 7000 + (i * 3500),
    minPrice: 6300 + (i * 3500),
    maxDiscountRate: 0.15,
    validFrom: '2026-01-01T00:00:00Z'
  });

  // Create 3 groups per bundle
  for (let g = 0; g < 3; g++) {
    const groupId = bGroupId++;
    bundleGroups.push({
      id: groupId,
      bundleSkuId: bundleSkuId,
      name: `分组 ${g + 1} - ${g === 0 ? '核心软件' : g === 1 ? '配套硬件' : '增值服务'}`,
      description: `请选择您的配置`,
      selectN: g === 0 ? 1 : (g === 1 ? 2 : 1),
      sortOrder: g + 1,
      allowMultipleQtyPerItem: g === 1
    });

    // Add 2-3 options per group
    for (let o = 0; o < 3; o++) {
      // Pick a random SKU of appropriate type
      let targetSkus = skus.filter(s => {
        const p = products.find(p => p.id === s.productId);
        if (!p) return false;
        if (g === 0) return p.productType === 'software';
        if (g === 1) return p.productType === 'hardware';
        return p.productType === 'service';
      });
      if (targetSkus.length === 0) targetSkus = skus.filter(s => s.id < 1050); // fallback
      
      const targetSku = targetSkus[(i * 10 + g * 5 + o) % targetSkus.length];
      
      bundleOptions.push({
        id: bOptionId++,
        bundleSkuId: bundleSkuId,
        groupId: groupId,
        componentSkuId: targetSku.id,
        isDefault: o === 0,
        pricingType: g === 0 ? 'included' : 'fixed_override',
        pricingValue: g === 0 ? undefined : 99.00,
        sortOrder: o + 1
      });
    }
  }
}

let entitlements: any[] = [];
let rules: any[] = [];

let eId = 1;
let rId = 1;

// Generate entitlements for the first few software SKUs
const softwareSkus = skus.filter(s => s.billingModel === 'recurring');
if (softwareSkus.length > 0) {
  entitlements.push({ id: eId++, skuId: softwareSkus[0].id, featureCode: 'FEAT_POS_CORE', entitlementType: 'boolean', status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[0].id, featureCode: 'FEAT_INV_BASIC', entitlementType: 'boolean', status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[0].id, featureCode: 'LIMIT_STORES', entitlementType: 'quota', quotaValue: 1, status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[0].id, featureCode: 'LIMIT_USERS', entitlementType: 'quota', quotaValue: 5, status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[0].id, featureCode: 'SLA_LEVEL', entitlementType: 'tier', tierValue: 'Standard', status: 'active' });
}
if (softwareSkus.length > 1) {
  entitlements.push({ id: eId++, skuId: softwareSkus[1].id, featureCode: 'FEAT_POS_CORE', entitlementType: 'boolean', status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[1].id, featureCode: 'FEAT_INV_BASIC', entitlementType: 'boolean', status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[1].id, featureCode: 'LIMIT_STORES', entitlementType: 'quota', quotaValue: 1, status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[1].id, featureCode: 'LIMIT_USERS', entitlementType: 'quota', quotaValue: 10, status: 'active' });
  entitlements.push({ id: eId++, skuId: softwareSkus[1].id, featureCode: 'SLA_LEVEL', entitlementType: 'tier', tierValue: 'Silver', status: 'active' });
}

// Generate some rules
const hardwareSkus = skus.filter(s => s.uom === 'Unit');
if (hardwareSkus.length >= 2 && softwareSkus.length >= 2) {
  rules.push({ id: rId++, sourceSkuId: hardwareSkus[0].id, targetSkuId: softwareSkus[0].id, ruleType: 'requires', message: '此硬件需要搭配基础版软件订阅才能正常工作。' });
  rules.push({ id: rId++, sourceSkuId: hardwareSkus[0].id, targetSkuId: hardwareSkus[1].id, ruleType: 'excludes', message: '同一个套装中不能混搭这两种硬件。' });
  rules.push({ id: rId++, sourceSkuId: softwareSkus[1].id, targetSkuId: softwareSkus[0].id, ruleType: 'recommends', message: '强烈建议选购高级版以获得更深度的业务洞察。' });
  rules.push({ id: rId++, sourceSkuId: hardwareSkus[1].id, targetSkuId: softwareSkus[1].id, ruleType: 'compatible_with', message: '此硬件完全兼容高级版订阅。' });
}

fs.writeFileSync('generated_products.json', JSON.stringify({ products, skus }, null, 2));
fs.writeFileSync('generated_bundles.json', JSON.stringify({ bundleGroups, bundleOptions }, null, 2));
fs.writeFileSync('generated_pricing.json', JSON.stringify({ priceBookEntries }, null, 2));
fs.writeFileSync('generated_features.json', JSON.stringify({ entitlements }, null, 2));
fs.writeFileSync('generated_rules.json', JSON.stringify({ rules }, null, 2));

console.log(`Generated ${products.length} SPUs, ${skus.length} SKUs, ${bundleGroups.length} Bundle Groups, ${bundleOptions.length} Bundle Options, ${priceBookEntries.length} Price Book Entries, ${entitlements.length} Entitlements, ${rules.length} Rules.`);
