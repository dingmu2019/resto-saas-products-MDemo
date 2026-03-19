-- ==============================================================================
-- 餐饮 SaaS 全球产品与定价中心 - 数据模型设计 V12.0 (架构师终极版)
-- ==============================================================================
-- 设计理念：
-- 本模型是支撑全球化餐饮 SaaS (涵盖软硬件、金融支付、专业服务) 商业流转的底层数据骨架。
-- 遵循了行业领先的 CPQ (Configure, Price, Quote) 与自动化履约 (Provisioning) 最佳实践，
-- 实现了“商业售卖(Sales)”与“系统控制(Engineering)”的彻底解耦。
--
-- 核心模块与建表顺序说明 (按依赖关系从基础到复杂排列)：
-- 1. 基础维度 (`product_categories`)：构建支持多语言、树形层级的全球化商品展示目录。
-- 2. 税务合规 (`tax_regions`, `tax_rates_mapping`)：支持多层级嵌套、多税种叠加及 B2B 免税反向征收。
-- 3. 核心资产 (`products`, `product_skus`)：定义软硬件形态，内置试运行期、计费时序与跨境清关属性。
-- 4. 多媒体库 (`product_media`)：集中管理电商商城展示所需的各类图片、视频、文档素材。
-- 5. 权益管控 (`product_entitlements`)：将商业 SKU 映射为底层 Feature Codes 和配额，驱动自动化履约。
-- 6. 组合套餐 (`bundle_groups`, `bundle_options`, `product_rules`)：支撑“M选N”、套餐内特价及互斥依赖逻辑。
-- 7. 定价引擎 (`price_books`, `price_book_entries`)：支持按国家/地区隔离定价、预约调价与销售折扣风控。
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. 基础维度与分类
-- ------------------------------------------------------------------------------

-- 产品分类表
-- 餐饮 SaaS 行业 4 级分类最佳实践示例 (参考头部企业体系)：
-- 1. 软件订阅与云服务 (Software & Cloud Services)
--    1.1 核心门店系统 (Core POS)
--        1.1.1 快餐版 (QSR Edition) -> 包含: 单店版, 连锁版
--        1.1.2 正餐版 (FSR Edition) -> 包含: 基础版, 专业版
--    1.2 数字化运营 (Digital Guest Experience)
--        1.2.1 线上点餐 (Online Ordering) -> 包含: 自营外卖, 聚合平台接口(API)
--        1.2.2 会员与营销 (Loyalty & Marketing) -> 包含: 积分模块, 自动化营销包
--    1.3 后厨与供应链 (Kitchen & Back-Office)
--        1.3.1 厨房显控 (KDS) -> 包含: 基础叫号, 高级厨房调度
--        1.3.2 进销存管理 (Inventory) -> 包含: 门店库存, 中央厨房(CK)
-- 2. 智能硬件与外设 (Smart Hardware & Devices)
--    2.1 收银与触控终端 (POS Terminals)
--        2.1.1 桌面收银机 (Countertop POS) -> 包含: 15寸单屏, 15+10寸双屏
--        2.1.2 移动与自助设备 (Mobile & Kiosk) -> 包含: 手持点餐机(mPOS), 24寸自助点餐机
--    2.2 打印与网络设备 (Printers & Networking)
--        2.2.1 打印机 (Printers) -> 包含: 80mm热敏前台, 厨房防油烟打印机, 标签打印机
--        2.2.2 网络基建 (Networking) -> 包含: 商业级路由器, 交换机, AP基站
-- 3. 金融与支付网关 (Fintech & Payment Processing)
--    3.1 支付费率与服务 (Payment Rates)
--        3.1.1 信用卡收单 (Credit Card Processing) -> 包含: Visa/MC 基础费率, 高级费率套餐
--        3.1.2 本地钱包与扫码 (Local Wallets) -> 包含: Apple Pay/Google Pay, 微信/支付宝聚合
--    3.2 支付终端硬件 (Payment Terminals)
--        3.2.1 刷卡设备 (Card Readers) -> 包含: 台式密码键盘(PIN Pad), 移动刷卡头
-- 4. 专业服务与耗材 (Professional Services & Consumables)
--    4.1 实施与培训 (Onboarding Services)
--        4.1.1 部署服务 (Deployment) -> 包含: 远程基础建档, 上门硬件安装
--        4.1.2 培训服务 (Training) -> 包含: 经理培训包, 员工在线认证课程
--    4.2 耗材与增值服务 (Consumables & Add-ons)
--        4.2.1 物理耗材 (Physical Supplies) -> 包含: 热敏打印纸一箱, 员工IC磁卡
--        4.2.2 虚拟消耗品 (Virtual Credits) -> 包含: 营销短信包(1000条), WhatsApp通知包
CREATE TABLE `product_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID，支持无限层级',
  `code` VARCHAR(50) NOT NULL COMMENT '分类业务编码，全局唯一。例如：POS_HARDWARE, SAAS_CORE',
  `name` VARCHAR(100) NOT NULL COMMENT '分类显示名称 (默认/基准语言名称)',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
  `translations` JSON DEFAULT NULL 
    COMMENT '多语言名称与描述 JSON。结构示例：\n'
            '{\n'
            '  "zh-CN": {"name": "智能硬件", "description": "包含收银机、打印机等设备"},\n'
            '  "en-US": {"name": "Smart Hardware", "description": "POS terminals, printers, etc."}\n'
            '}',
  `level` TINYINT NOT NULL DEFAULT 1 COMMENT '层级深度：1-根分类, 2-二级分类...',
  `path` VARCHAR(255) NOT NULL COMMENT '层级路径，如 /1/4/12/，用于快速查询某分类下的所有子孙节点',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '前端展示排序权重，数值越小越靠前',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
  
  -- 审计字段
  `created_by` VARCHAR(64) DEFAULT NULL COMMENT '创建人ID或用户名',
  `updated_by` VARCHAR(64) DEFAULT NULL COMMENT '最后修改人ID或用户名',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间，非空即为已删除',
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`, `deleted_at`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品分类表';

-- ------------------------------------------------------------------------------
-- 2. 全球税务合规 (Global Tax Compliance)
-- ------------------------------------------------------------------------------

-- 税区表 (Tax Jurisdictions)
-- 核心作用：建立全球税务管辖区的层级树。
-- 补充说明：支持多层级嵌套，如：US (国家级) -> US-NY (州级) -> US-NY-NYC (市级/特殊税区)。
-- path 字段用于在计费时快速向上回溯，将整条链路上的税率进行叠加计算。
CREATE TABLE `tax_regions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父级税区，支持税区嵌套（如国家-州-市）',
  `region_code` VARCHAR(50) NOT NULL COMMENT '内部税区编码，如 US-NY, CN-SH',
  `country_code` CHAR(2) NOT NULL COMMENT 'ISO 3166-1 alpha-2 国家码',
  `state_code` VARCHAR(10) DEFAULT NULL COMMENT '州/省代码 (针对美国/加拿大等)',
  `city_code` VARCHAR(50) DEFAULT NULL COMMENT '城市编码',
  `county_code` VARCHAR(50) DEFAULT NULL COMMENT '区/县编码',
  `zip_code` VARCHAR(20) DEFAULT NULL COMMENT '邮政编码',
  `name` VARCHAR(100) NOT NULL COMMENT '税区显示名称',
  
  `level` ENUM('country', 'state', 'county', 'city', 'special') NOT NULL DEFAULT 'country' 
    COMMENT '税务管辖级别：\n'
            'country - 国家级 (如 US)\n'
            'state - 州/省级 (如 US-NY)\n'
            'county - 县/郡级 (如 US-NY-Kings)\n'
            'city - 市级 (如 US-NY-NYC)\n'
            'special - 特殊经济区/保税区 (如 特区、免税港)',
            
  `path` VARCHAR(255) NOT NULL COMMENT '层级路径，如 /1/2/3/，用于快速向上回溯父级税率或向下查询子税区',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_region` (`region_code`, `deleted_at`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='全球税务管辖区表';

-- 税率映射表 (Tax Rates Mapping)
-- 核心作用：定义在不同税区下，针对不同产品类型应征收的具体税率。
-- 补充说明：
-- 1. 拆分税种：支持复合税率（如加拿大的 GST 5% + PST 7%）。
-- 2. 免税逻辑：增加 B2B/B2C 判定标记及反向征收 (Reverse Charge) 支持。
-- 3. 时间轴：通过 effective_date 和 end_date 控制未来税法变更，保证历史账单重算不出错。
CREATE TABLE `tax_rates_mapping` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tax_region_id` BIGINT UNSIGNED NOT NULL COMMENT '关联的具体税区 (可精确到州/市)',
  `product_type` ENUM('software', 'hardware', 'service', 'consumable', 'bundle') NOT NULL 
    COMMENT '对应 products 表的 product_type',
    
  `tax_type` ENUM('VAT', 'GST', 'SalesTax', 'PST', 'HST', 'QST') NOT NULL DEFAULT 'SalesTax' COMMENT '具体税种',
  `tax_rate` DECIMAL(6,4) NOT NULL COMMENT '税率，0.0700 = 7%',
  `tax_name` VARCHAR(50) NOT NULL COMMENT '税项展示名称，如 "NY State Sales Tax"',
  
  `is_tax_inclusive` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '系统标价是否已含此税 (欧洲/澳洲通常为 True，北美通常为 False)',
  `is_b2b_exempt` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'B2B 客户是否免税或适用反向征收 (Reverse Charge)',
  
  `effective_date` DATE NOT NULL COMMENT '税率生效日期 (支持未来税法变更)',
  `end_date` DATE DEFAULT NULL COMMENT '税率失效日期 (留空表示当前有效)',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rule` (`tax_region_id`, `product_type`, `tax_type`, `effective_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='区域产品类型复杂税率规则表';

-- ------------------------------------------------------------------------------
-- 3. 核心资产 (Product Definitions & SKUs)
-- ------------------------------------------------------------------------------

-- 产品族表 (Product Family / SPU)
-- 核心作用：等同于电商中的 SPU (Standard Product Unit)，定义业务层面的“产品概念”，充当同类 SKU 的逻辑聚合容器。
-- 补充说明：
-- 1. 前端聚合展示：客户在商城列表页看到的是 SPU 卡片（避免被几十个 SKU 刷屏），点击进入详情页后才选择具体 SKU。
-- 2. 媒体资源复用：产品的营销视频、说明书挂载在 SPU 上，所有子 SKU 共享。
-- 3. 财务报表：用于按产品线 (Product Line) 聚合统计 MRR 收入。
-- 
-- 【SPU-SKU 典型设置示例】
-- 示例 1 (SaaS软件):
--   [SPU] Name: "RestoSuite 门店专业版收银系统" (Type: software)
--     ├── [SKU 1] Name: "专业版 - 按月订阅", Term: monthly, Price: $99/月
--     └── [SKU 2] Name: "专业版 - 按年订阅", Term: annual, Price: $999/年 (享优惠)
--
-- 示例 2 (智能硬件):
--   [SPU] Name: "15.6寸双屏智能收银机" (Type: hardware, Brand: Sunmi)
--     ├── [SKU 1] Name: "15.6寸双屏 - 午夜黑版", SKU_Code: HW-POS-BLK, Is_Serialized: True
--     └── [SKU 2] Name: "15.6寸双屏 - 珍珠白版", SKU_Code: HW-POS-WHT, Is_Serialized: True
--
-- 示例 3 (消耗品/按量服务):
--   [SPU] Name: "全球营销短信包" (Type: consumable)
--     ├── [SKU 1] Name: "基础包 (1000条)", Model: one_time, Quota: 1000
--     └── [SKU 2] Name: "企业包 (10000条)", Model: one_time, Quota: 10000
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '所属分类ID',
  `product_code` VARCHAR(50) NOT NULL COMMENT '产品族内部编码，如 POS_SOFTWARE_V2',
  `name` VARCHAR(100) NOT NULL COMMENT '产品族名称',
  
  -- 核心类型定义
  `product_type` ENUM('software', 'hardware', 'service', 'consumable', 'bundle') NOT NULL 
    COMMENT '产品类型：\n'
            'software - SaaS软件订阅，涉及开通逻辑\n'
            'hardware - 实体硬件，涉及库存物流\n'
            'service - 人工服务，如实施/培训\n'
            'consumable - 消耗品，如短信包/支付点数\n'
            'bundle - 虚拟组合，不持有实体',
            
  `brand` VARCHAR(50) DEFAULT NULL COMMENT '品牌/厂商，如 RestoSuite, Epson, Apple',
  `description` TEXT COMMENT '产品族通用描述',
  
  -- 审计字段
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_code` (`product_code`, `deleted_at`),
  KEY `idx_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品族表';

-- SKU 表 (Stock Keeping Unit)
-- 核心作用：定义“怎么卖”。SKU 是报价单 (Quote)、订单行 (Order Line Item) 和库存流转的最小原子单位。
-- 补充说明：SKU 承载了计费模式、生命周期、物流属性等所有具备商业交易价值的元数据。
CREATE TABLE `product_skus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '所属产品族ID',
  `sku_code` VARCHAR(100) NOT NULL COMMENT '可售卖SKU编码，如 SW-POS-PRO-M-V1',
  `name` VARCHAR(150) NOT NULL COMMENT 'SKU 销售名称，如 POS Pro Edition (Monthly)',
  
  -- 财务与计费维度
  `billing_model` ENUM('recurring', 'one_time', 'usage_based') NOT NULL 
    COMMENT '计费模式：\n'
            'recurring - 周期性订阅 (MRR)\n'
            'one_time - 一次性买断 (硬件/实施费)\n'
            'usage_based - 按量计费 (支付费率/短信)',
            
  `billing_term` ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'biennial', 'triennial', 'custom', 'none') NOT NULL DEFAULT 'none'
    COMMENT '计费周期（针对 recurring 模式）：\n'
            'daily - 按天\n'
            'weekly - 按周\n'
            'monthly - 按月\n'
            'quarterly - 按季\n'
            'annual - 按年\n'
            'biennial - 按两年\n'
            'triennial - 按三年\n'
            'custom - 自定义周期\n'
            'none - 非周期计费',
            
  `billing_timing` ENUM('in_advance', 'in_arrears') NOT NULL DEFAULT 'in_advance'
    COMMENT '计费时序：\n'
            'in_advance - 前置计费 (先付后用，如软件订阅)\n'
            'in_arrears - 后置计费 (先用后付，如按量短信包)',
            
  `trial_days` INT UNSIGNED DEFAULT 0 COMMENT '试运行期天数 (Free Trial Days)。0 表示无试用，14 表示前14天免费',
  
  `uom` VARCHAR(20) NOT NULL DEFAULT 'unit' 
    COMMENT '计量单位 (Unit of Measure)：license(授权), device(设备), hour(工时), transaction(笔)',
  
  `lifecycle_status` ENUM('draft', 'active', 'eos', 'eol', 'retired') NOT NULL DEFAULT 'draft' 
    COMMENT '生命周期状态：\n'
            'draft - 草稿，不可售\n'
            'active - 在售，全渠道可见\n'
            'eos - 停止销售 (End of Sale)，老客户可续费，新客户不可买\n'
            'eol - 停止服务 (End of Life)，彻底终止支持\n'
            'retired - 已归档/下架',

  -- 税务合规
  `standard_tax_code` VARCHAR(50) DEFAULT NULL COMMENT '标准税务分类码 (如 Avalara Tax Code)，用于精准税务计算（暂不使用，未来可能会用）',

  -- 硬件与物流属性 (Supply Chain Specific)
  `is_shippable` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否需要物流履约',
  `is_serialized` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否需要序列号管理 (如 iPad/终端需追踪 SN)',
  `weight_kg` DECIMAL(10,3) DEFAULT NULL COMMENT '发货毛重 (kg)',
  `length_cm` DECIMAL(10,2) DEFAULT NULL COMMENT '包装长度 (cm)',
  `width_cm` DECIMAL(10,2) DEFAULT NULL COMMENT '包装宽度 (cm)',
  `height_cm` DECIMAL(10,2) DEFAULT NULL COMMENT '包装高度 (cm)',
  `hs_code` VARCHAR(20) DEFAULT NULL COMMENT '海关编码 (HS Code)，跨境清关必备',
  `country_of_origin` CHAR(2) DEFAULT NULL COMMENT '原产地国家码 (ISO 2)，跨境清关必备',

  -- 软件属性 (Software Specific)
  `provisioning_handler` VARCHAR(100) DEFAULT NULL COMMENT '开通处理器标识，如 "saas-core-provisioner" 为开通或关闭做初始化配置处理传递标识',

  -- 扩展属性
  `specifications` JSON DEFAULT NULL 
    COMMENT '技术规格参数 JSON。基于餐饮 SaaS 行业最佳实践的结构示例：\n'
            '【硬件设备示例 (如 POS 机)】\n'
            '{\n'
            '  "color": "Midnight Black",\n'
            '  "screen_size": "15.6 inch",\n'
            '  "resolution": "1920x1080",\n'
            '  "processor": "Qualcomm Snapdragon 8-core",\n'
            '  "memory": "4GB RAM + 64GB ROM",\n'
            '  "interfaces": ["USB Type-A x4", "RJ45 x1", "RJ11 (Cash Drawer) x1"],\n'
            '  "connectivity": ["Wi-Fi 5", "Bluetooth 5.0"],\n'
            '  "warranty_months": 12\n'
            '}\n'
            '【软件/服务示例 (如 API 增值包)】\n'
            '{\n'
            '  "supported_platforms": ["iOS", "Android", "Web"],\n'
            '  "deployment_type": "Cloud-based (AWS)",\n'
            '  "api_rate_limit": "100 requests / second",\n'
            '  "data_retention_days": 365,\n'
            '  "compliance": ["PCI-DSS", "GDPR"]\n'
            '}',
  `translations` JSON DEFAULT NULL 
    COMMENT '多语言内容 JSON。结构示例：\n'
            '{\n'
            '  "zh-CN": {\n'
            '    "name": "RestoSuite 连锁版 POS (月付)",\n'
            '    "short_desc": "适用于拥有 5 家以上门店的餐饮品牌。",\n'
            '    "long_desc": "包含中央厨房管理、供应链集成及高级报表功能..."\n'
            '  },\n'
            '  "en-US": {\n'
            '    "name": "RestoSuite Chain POS (Monthly)",\n'
            '    "short_desc": "Best for F&B brands with 5+ locations.",\n'
            '    "long_desc": "Includes Central Kitchen, Supply Chain & Advanced Reporting..."\n'
            '  }\n'
            '}',
  
  -- 时间轴
  `launch_date` DATE DEFAULT NULL COMMENT '计划上市日期',
  `eos_date` DATE DEFAULT NULL COMMENT '停止销售日期',
  
  -- 审计字段
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sku_code` (`sku_code`, `deleted_at`),
  KEY `idx_product` (`product_id`),
  KEY `idx_status` (`lifecycle_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SKU 定义表';

-- ------------------------------------------------------------------------------
-- 4. 多媒体与文档库 (Media & Assets)
-- ------------------------------------------------------------------------------

-- 产品媒体表 (Product Media)
-- 核心作用：集中管理产品在电商商城、报价单展示时所需的各类多媒体素材。
-- 补充说明：采用独立的媒体表而不是在 SKU 中存 JSON 数组，是为了支持素材的多语言 (locale)、
-- 多终端适配 (thumbnail) 以及资源复用 (挂载在 Product 级别供所有 SKU 共享)。
CREATE TABLE `product_media` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联到产品族 (适用于所有版本通用的宣传图/视频)',
  `sku_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联到特定 SKU (适用于特定颜色的硬件，或特定版本的界面截图)',
  
  `media_type` ENUM('image', 'video', 'document', '3d_model') NOT NULL COMMENT '媒体类型',
  `url` VARCHAR(500) NOT NULL COMMENT 'CDN 或存储桶的绝对路径',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '视频或 3D 模型的缩略图 URL',
  
  `is_main` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为主图 (封面图)',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  
  `locale` VARCHAR(10) DEFAULT 'ALL' COMMENT '适用语言/地区。ALL=全球通用，en-US=仅限英文版展示，zh-CN=仅限中文版展示',
  `title` VARCHAR(255) DEFAULT NULL COMMENT '图片 Alt 文本或文档标题 (如 "快速安装指南.pdf")',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_sku` (`sku_id`),
  KEY `idx_locale` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品多媒体与文档资源表';

-- ------------------------------------------------------------------------------
-- 5. 权益管控 (SaaS Entitlements)
-- ------------------------------------------------------------------------------

-- 产品权益表 (Product Entitlements)
-- 核心作用：充当商业售卖 SKU 与系统底层技术控制之间的“翻译官”。
-- 补充说明：SaaS 系统的核心枢纽。通过定义 Feature Code，前端可据此控制页面按钮的显示/隐藏，
-- 后端可据此进行业务拦截（如门店数量限制）。在 CPQ 阶段也用于向客户展示套餐的具体包含内容。
-- 
-- 典型应用场景示例：
-- 1. 功能开关 (Boolean)：
--    - 场景：购买“专业版 SKU”才能使用“高级库存分析”模块。
--    - 配置：entitlement_type='boolean', feature_code='module_advanced_inventory'
--    - 效果：前端/后端根据此 Flag 动态显示或隐藏菜单，研发无需硬编码 `if (sku == '专业版')`。
-- 
-- 2. 数量配额控制 (Quota - 状态型)：
--    - 场景：“连锁版 5 店套餐”限制租户最多创建 5 个门店。
--    - 配置：entitlement_type='quota', feature_code='max_store_limit', quota_value=5
--    - 效果：后端在创建门店时拦截，超出数量则提示升级。购买多个扩容包 SKU 时，系统自动累加 (SUM) 其 quota_value。
-- 
-- 3. 消耗品一次性充值 (Quota - 消耗型)：
--    - 场景：客户购买“10000 条营销短信包”。
--    - 配置：entitlement_type='quota', feature_code='sms_balance_topup', quota_value=10000
--    - 效果：订单生效后，自动化履约网关触发短信微服务，将该租户短信余额累加 (Increment) 10000。
-- 
-- 4. 服务等级协议与层级限制 (Tier)：
--    - 场景：购买“旗舰全球套装”享受 7x24 小时白金级专属客服 (SLA)。
--    - 配置：entitlement_type='tier', feature_code='support_sla_level', tier_value='Platinum'
--    - 效果：工单系统读取该权益，自动为工单打上“高优先级”标签并路由至高级专家组。
CREATE TABLE `product_entitlements` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku_id` BIGINT UNSIGNED NOT NULL COMMENT '关联的软件 SKU',
  `feature_code` VARCHAR(100) NOT NULL COMMENT '系统功能特性编码 (Feature Flag)，如 module_inventory',
  `entitlement_type` ENUM('boolean', 'quota', 'tier') NOT NULL DEFAULT 'boolean'
    COMMENT '权益类型：\n'
            'boolean - 开关型 (有/无)\n'
            'quota - 配额型 (如包含 5 个用户，1000 条短信)\n'
            'tier - 等级型 (如 Silver, Gold)',
  `quota_value` BIGINT DEFAULT NULL COMMENT '配额数量 (当 type=quota 时使用。使用大整型以支持海量消耗品包，如 100万条 API 调用配配 或者 AI Token)',
  `tier_value` VARCHAR(50) DEFAULT NULL COMMENT '等级值 (当 type=tier 时使用)',
  
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '权益状态，用于临时剥夺或下线某项权益',
  
  -- 审计字段
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除，保留历史订单的权益追溯',
  
  PRIMARY KEY (`id`),
  KEY `idx_sku` (`sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品权益/功能特性配置表';

-- ------------------------------------------------------------------------------
-- 6. 组合套餐与约束规则 (Bundle & CPQ Rules)
-- ------------------------------------------------------------------------------

-- 套餐分组表 (Bundle Groups)
-- 核心作用：在套餐 SKU 下划定“选择范围” (M 选 N 逻辑)。
-- 补充说明：如“请选择 1 个核心软件”、“请选配 0-3 台外设打印机”。
CREATE TABLE `bundle_groups` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '所属套餐 SKU ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分组名称，如 "核心POS软件", "厨房打印机选配"',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '给客户/销售的提示说明',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  
  -- M 选 N 核心控制逻辑
  `min_selections` INT NOT NULL DEFAULT 1 COMMENT '该组最少需选择的数量 (M)，0 表示该组为纯选配',
  `max_selections` INT NOT NULL DEFAULT 1 COMMENT '该组最多可选择的数量 (N)',
  
  `is_mutually_exclusive` BOOLEAN NOT NULL DEFAULT FALSE 
    COMMENT '组内互斥开关。\n'
            'TRUE: 组内选项完全互斥 (Radio Button)。示例：在“操作系统”分组中，选了 Windows 就不能选 Linux。\n'
            'FALSE: 组内可多选 (Checkbox)。示例：在“外设配件”分组中，可以同时勾选键盘和鼠标。',
            
  `allow_multiple_qty_per_item` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否允许同一个选项选多次 (如买两台一样的打印机) 当前暂不支持 未来大概率也不会用',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_bundle` (`bundle_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐分组表(控制M选N逻辑)';

-- 套餐选项表 (Bundle Options)
-- 核心作用：具体定义某个分组下客户可以选哪些 SKU，以及选这个 SKU 是否需要加价/减价。
-- 补充说明：支持类似麦当劳的“包含在套餐内(included)”、“套餐内特价(fixed_override)”和“补差价(price_adjustment)”。
CREATE TABLE `bundle_options` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '所属套餐 SKU ID (冗余字段，用于极大提升 CPQ 渲染时的查询性能)',
  `group_id` BIGINT UNSIGNED NOT NULL COMMENT '所属的分组 ID',
  `component_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '选项对应的真实 SKU ID',
  
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否默认选中',
  `sort_order` INT NOT NULL DEFAULT 0,
  
  -- 加价与定价逻辑 (类似麦当劳套餐换大杯可乐加2元)
  `pricing_type` ENUM('included', 'fixed_override', 'price_adjustment') NOT NULL DEFAULT 'included'
    COMMENT '定价类型：\n'
            'included - 包含在套餐价内，不加钱 (如 标配小薯)\n'
            'fixed_override - 套餐内特价 (如 原价$100，套餐内卖$50)\n'
            'price_adjustment - 差价/加价 (如 升级大杯 +$2)',
  `pricing_value` DECIMAL(19,4) DEFAULT NULL COMMENT '配合 pricing_type 使用的具体金额',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_sku` (`group_id`, `component_sku_id`),
  KEY `idx_component` (`component_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐具体选项表';

-- 兼容性规则表 (Product Rules / Validation)
-- 核心作用：防止销售人员“乱配单”，并在在线商城提供智能推荐。
-- 补充说明：
-- 1. requires: 买 A 必须买 B（如：买打印机必须买电源线）。
-- 2. excludes: 买 A 就不能买 B（互斥防错）。
-- 3. recommends: 智能推荐/向上销售 (Up-sell) 提示。
CREATE TABLE `product_rules` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `source_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '主 SKU',
  `target_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '关联 SKU',
  `rule_type` ENUM('requires', 'excludes', 'recommends', 'compatible_with') NOT NULL 
    COMMENT '规则类型：\n'
            'requires - 强依赖 (买A必须买B)\n'
            'excludes - 互斥 (买A不能买B)\n'
            'recommends - 推荐/加购 (买A推荐买B)\n'
            'compatible_with - 兼容性标记 (A可以配合B使用)',
            
  `message` VARCHAR(255) DEFAULT NULL COMMENT '提示信息 (用于前端报错或提示)',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rule` (`source_sku_id`, `target_sku_id`, `rule_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品兼容性与销售规则表';

-- ------------------------------------------------------------------------------
-- 7. 定价引擎 (Pricing Engine)
-- ------------------------------------------------------------------------------

-- 价格手册表 (Price Books)
-- 核心作用：控制“谁能看到什么价格”。
-- 补充说明：同一款软件，针对直销、渠道代理商、大客户(Custom)可以有完全不同的价格手册 and 结算币种。
CREATE TABLE `price_books` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL COMMENT '手册编码，如 PB-2026-GLOBAL-USD',
  `name` VARCHAR(100) NOT NULL COMMENT '手册名称',
  `currency` CHAR(3) NOT NULL COMMENT '结算币种 ISO 4217',
  
  `applicable_regions` JSON DEFAULT NULL 
    COMMENT '适用国家/地区范围 (JSON 数组)。\n'
            '示例 1: ["GLOBAL"] (全球通用)\n'
            '示例 2: ["US", "CA"] (仅限北美)\n'
            '通过此字段可实现同币种在不同国家的“购买力平价”策略隔离。',
            
  `translations` JSON DEFAULT NULL COMMENT '手册名称的多语言展示 (JSON)。如 {"fr-FR": "Prix Standard Mondial"}',
  `price_display_precision` TINYINT UNSIGNED DEFAULT 2 COMMENT '前端展示小数位数 (0=取整, 2=保留两位)',
            
  `type` ENUM('standard', 'channel', 'promotional', 'custom') NOT NULL DEFAULT 'standard'
    COMMENT '手册类型：\n'
            'standard - 标准公开价\n'
            'channel - 渠道/合作伙伴价格\n'
            'promotional - 限时促销价\n'
            'custom - 大客户定制价',
  
  `is_active` BOOLEAN NOT NULL DEFAULT FALSE,
  `valid_from` DATETIME NOT NULL COMMENT '生效时间',
  `valid_to` DATETIME DEFAULT NULL COMMENT '失效时间 (NULL表示永久)',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格手册主表';

-- 价格条目表 (Price Book Entries)
-- 核心作用：具体定义某一个 SKU 在特定价格手册中的售价和计费策略。
-- 补充说明：
-- 1. 阶梯计费：支持通过 tier_config 配置用量阶梯（如API调用量前1万次免费，超出部分阶梯计费）。
-- 2. 时间轴：通过 valid_from 支持价格的“预约变更”（如下月起涨价），保障财务对账的历史准确性。
CREATE TABLE `price_book_entries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `price_book_id` BIGINT UNSIGNED NOT NULL,
  `sku_id` BIGINT UNSIGNED NOT NULL,
  
  `pricing_strategy` ENUM('flat_fee', 'per_unit', 'tiered', 'volume', 'percentage') NOT NULL DEFAULT 'flat_fee'
    COMMENT '定价策略：\n'
            'flat_fee - 固定一口价 (如 月费 $99)\n'
            'per_unit - 单价 x 数量 (如 硬件 $500/台)\n'
            'tiered - 分段阶梯累加 (如 前10个$10，第11个起$8)\n'
            'volume - 总量阶梯跳变 (如 买100个以上全部$8)\n'
            'percentage - 百分比费率 (如 支付费率 2.9%)',
            
  `list_price` DECIMAL(19,4) NOT NULL COMMENT '目录价格 (标准单价)',
  `min_price` DECIMAL(19,4) DEFAULT NULL COMMENT '销售底价 (Floor Price)，低于此价格需要审批',
  `max_discount_rate` DECIMAL(5,4) DEFAULT NULL COMMENT '最大允许折扣率 (0.20 = 20% off)，用于前端风控拦截 配置某个硬件 SKU “最多打 95 折”，如果销售试图输入 8 折，前端直接拦截，无需提交审批',
  `msrp` DECIMAL(19,4) DEFAULT NULL COMMENT '建议零售价 (Hardware)',
  
  `tier_config` JSON DEFAULT NULL 
    COMMENT '阶梯/复杂计费配置 JSON\n'
            '结构示例: [{"min": 0, "max": 1000, "price": 0.029}, {"min": 1001, "max": null, "price": 0.025}]',
            
  `valid_from` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '价格生效时间 (支持预约调价)',
  `valid_to` DATETIME DEFAULT NULL COMMENT '价格失效时间 (留空表示当前有效)',
            
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_book_sku_date` (`price_book_id`, `sku_id`, `valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格手册明细表';
