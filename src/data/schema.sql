-- ==============================================================================
-- 餐饮 SaaS 全球产品与定价中心 - 数据模型设计 V14.0 
-- ==============================================================================
-- 【项目背景与设计理念】
-- 本模型是支撑全球化餐饮 SaaS (涵盖软件订阅、智能硬件、金融支付、专业服务) 商业流转的底层数据骨架。
-- 旨在解决全球化业务中的三大难题：
-- 1. 复杂定价 (CPQ)：支持不同国家、不同币种、不同销售渠道的差异化定价，支持基于客户身份与场景的精准路由。
-- 2. 套餐灵活性与合规性：实现“组合逻辑”与“定价逻辑”的彻底解耦，支持 HaaS (硬件即服务) 模式。内置公允价值 (SSP) 与合约约束（强制在网期、违约金），满足 ASC 606 财务审计合规。
-- 3. 全球税务合规：采用扁平化综合税率模型，结合邮编/省州精准匹配最终税率，避免多层级嵌套计算，支持多语言展示。
--
-- 【核心模块说明】
-- 1. 基础维度 (`product_categories`)：构建支持无限层级的商品目录，支撑商城的导航与分类逻辑。
-- 2. 全球税务 (`tax_rates_flat`)：处理全球复杂的价外税 (Sales Tax) 与价内税 (VAT)，基于地理位置直接匹配最终税率。
-- 3. 核心资产 (`products`, `product_skus`)：
--    - SPU (Standard Product Unit)：定义产品族（如：POS系统、收银机）。
--    - SKU (Stock Keeping Unit)：定义具体的销售规格（如：专业版月付、白色收银机），内置买断与租赁的资产状态标识。
-- 4. 权益管控 (`product_entitlements`)：将商业 SKU 映射为系统底层的 Feature Code，驱动自动化开通。
-- 5. 组合套餐 (`bundle_groups`, `bundle_options`)：定义“M选N”的选择逻辑，支持多语言分组指引，不涉及价格。
-- 6. 定价引擎 (`price_books`, `price_book_entries`)：核心商业枢纽。
--    - 支持“上下文定价”：同一个 iPad，单独买是一个价，在套餐里买是另一个价（或免费）。
--    - 支持“合约与违约控制”：内置最低承诺期 (Minimum Commitment) 与提前解约金 (ETF) 策略。
--    - 支持“财务合规拆账”：独立维护公允价值 (Standalone Selling Price)，确保 0 元硬件套餐的合规收入分摊。
--    - 支持“毛利估算”：内置预估成本字段，帮助销售在报价时实时掌握盈利情况。
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. 基础维度与分类 (Foundational Dimensions)
-- ------------------------------------------------------------------------------

-- 产品分类表
-- 用于构建商城的类目树，支持多语言展示。
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
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID。NULL表示顶级分类，支持无限层级嵌套。',
  `code` VARCHAR(50) NOT NULL COMMENT '分类业务编码。全局唯一，用于代码硬编码引用。示例：SOFTWARE_SUBSCRIPTION, HARDWARE_TERMINAL',
  `name` VARCHAR(100) NOT NULL COMMENT '分类显示名称 (基准语言，通常为英文)。',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类功能描述。',
  `translations` JSON DEFAULT NULL 
    COMMENT '多语言 JSON 存储。结构示例：\n'
            '{\n'
            '  "zh-CN": {"name": "智能硬件", "description": "包含收银机、打印机等设备"},\n'
            '  "en-US": {"name": "Smart Hardware", "description": "POS terminals, printers, etc."}\n'
            '}',
  `level` TINYINT NOT NULL DEFAULT 1 COMMENT '层级深度。1表示一级分类，以此类推。',
  `path` VARCHAR(255) NOT NULL COMMENT '层级路径。格式如 /1/4/12/，用于通过 LIKE 操作符快速查询某分类下的所有子孙节点。',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序权重。数值越小，在前端 UI（如 POS 或商城）中的排列越靠前。',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '启用状态。设置为 FALSE 时，该分类及其下所有产品在商城中不可见。',
  
  -- 审计字段
  `created_by` VARCHAR(64) DEFAULT NULL COMMENT '创建记录的操作员 ID。',
  `updated_by` VARCHAR(64) DEFAULT NULL COMMENT '最后修改记录的操作员 ID。',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间。',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间。',
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '逻辑删除标记。非空表示记录已删除，用于保留历史引用。',
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`, `deleted_at`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品分类表：支撑全球商城的类目导航与多语言展示。';

-- ------------------------------------------------------------------------------
-- 2. 全球税务合规 (Global Tax Compliance)
-- ------------------------------------------------------------------------------

-- 税率规则表 (Tax Rates Flat)
-- 扁平化综合税率表，替代复杂的多层级嵌套。直接通过邮编或省州匹配最终的综合税率。
CREATE TABLE `tax_rates_flat` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `country_code` CHAR(2) NOT NULL COMMENT 'ISO 3166-1 alpha-2 标准国家码。示例：US, CN, GB。',
  `state_code` VARCHAR(10) DEFAULT NULL COMMENT '州/省代码。主要针对北美地区（如 NY, CA）。',
  `postal_code_pattern` VARCHAR(20) DEFAULT '*' COMMENT '邮编匹配规则（支持通配符或具体邮编），用于精准匹配市/县级税率。',
  
  `product_type` ENUM('software', 'hardware', 'service', 'consumable', 'bundle') NOT NULL 
    COMMENT '产品类型。不同类型的商品在同一地区税率可能不同（如软件免税，硬件征收）。\n'
            'software - SaaS软件订阅\n'
            'hardware - 实体硬件\n'
            'service - 人工服务\n'
            'consumable - 消耗品\n'
            'bundle - 虚拟组合',
    
  `tax_type` ENUM('VAT', 'GST', 'SalesTax', 'PST', 'HST', 'QST') NOT NULL DEFAULT 'SalesTax' 
    COMMENT '主要税种标识。若该地区存在多层级叠加（如美国SalesTax），这里指代其主体税种分类。',
  `combined_tax_rate` DECIMAL(6,4) NOT NULL 
    COMMENT '综合税率。这是向客户收取的最终税率总和。\n'
            '示例：如果某地 State Tax=4.0%, County Tax=1.0%, City Tax=3.875%，\n'
            '则此处直接存储 0.0888 (即 8.875%)，系统计费时无需再次计算多层级叠加。',
  `tax_name` VARCHAR(100) NOT NULL 
    COMMENT '显示在发票/账单上的综合税项名称。\n'
            '建议包含构成说明，以便客户理解。示例："NY State & Local Tax" 或 "CA Sales Tax (State 7.25% + Local 1.5%)"。',
  
  `is_tax_inclusive` BOOLEAN NOT NULL DEFAULT FALSE 
    COMMENT '标价是否含税。欧洲/澳洲通常为 TRUE（含税价），北美通常为 FALSE（价外税）。',
  `is_b2b_exempt` BOOLEAN NOT NULL DEFAULT FALSE 
    COMMENT 'B2B 免税标记。若租户提供合法税号，系统自动适用反向征收 (Reverse Charge) 逻辑。',
  
  `effective_date` DATE NOT NULL COMMENT '税率生效日期。支持未来税法变更的预约配置。',
  `end_date` DATE DEFAULT NULL COMMENT '税率失效日期。留空表示当前有效。',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_location` (`country_code`, `state_code`, `postal_code_pattern`),
  UNIQUE KEY `uk_rule_flat` (`country_code`, `state_code`, `postal_code_pattern`, `product_type`, `effective_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='扁平化综合税率表：基于地理位置直接匹配最终税率，避免多层级嵌套计算。';

-- ------------------------------------------------------------------------------
-- 3. 核心资产 (Product Definitions & SKUs)
-- ------------------------------------------------------------------------------

-- 产品族表 (Product Family / SPU)
-- 定义业务层面的“产品概念”，不具备直接售卖属性。
-- 示例：
--   [SPU] Name: "RestoSuite 门店专业版收银系统" (Type: software)
--     ├── [SKU 1] Name: "专业版 - 按月订阅", Term: monthly, Price: $99/月
--     └── [SKU 2] Name: "专业版 - 按年订阅", Term: annual, Price: $999/年 (享优惠)
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '所属分类ID。',
  `product_code` VARCHAR(50) NOT NULL COMMENT '产品族内部编码。示例：CORE_POS_V3。',
  `name` VARCHAR(100) NOT NULL COMMENT '产品族名称。示例："RestoSuite 智能收银系统"。',
  
  `product_type` ENUM('software', 'hardware', 'service', 'consumable', 'bundle') NOT NULL 
    COMMENT '产品核心类型。直接决定了后端的开通、物流及税务逻辑。\n'
            'software - SaaS软件订阅，涉及开通逻辑\n'
            'hardware - 实体硬件，涉及库存物流\n'
            'service - 人工服务，如实施/培训\n'
            'consumable - 消耗品，如短信包/支付点数\n'
            'bundle - 虚拟组合，不持有实体',
            
  `brand` VARCHAR(50) DEFAULT NULL COMMENT '品牌/厂商。示例：RestoSuite, Sunmi, Epson。',
  `description` TEXT COMMENT '产品的通用营销描述。',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_code` (`product_code`, `deleted_at`),
  KEY `idx_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品族(SPU)表：定义“卖什么”，是 SKU 的逻辑容器。';

-- SKU 表 (Stock Keeping Unit)
-- 定义具体的“销售规格”。是报价单、订单和库存流转的最小单位。
CREATE TABLE `product_skus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '关联的 SPU。',
  `sku_code` VARCHAR(100) NOT NULL COMMENT '全局唯一 SKU 编码。示例：SW-POS-PRO-MONTHLY。',
  `name` VARCHAR(150) NOT NULL COMMENT 'SKU 销售名称。示例："专业版 POS (月付版)"。',
  
  -- 财务与计费维度
  `billing_model` ENUM('recurring', 'one_time', 'usage_based', 'hybrid') NOT NULL
    COMMENT '计费模式：\n'
            'recurring - 周期性订阅 (软件订阅产品按周、月、季、年等)\n'
            'one_time - 一次性买断 (硬件/实施费/定制开发费等)\n'
            'usage_based - 按量计费 (支付费率)\n'
            'hybrid - 混合计费 (套餐组合SKU)',
            
  `billing_term` ENUM('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annual', 'biennial', 'triennial', 'custom', 'none') NOT NULL DEFAULT 'none'
    COMMENT '计费周期（针对 recurring 模式）：\n'
            'daily - 按天\n'
            'weekly - 按周\n'
            'biweekly - 按双周\n'
            'monthly - 按月\n'
            'quarterly - 按季\n'
            'annual - 按年\n'
            'biennial - 按两年\n'
            'triennial - 按三年\n'
            'custom - 自定义周期\n'
            'none - 非周期计费',
            
  `billing_timing` ENUM('in_advance', 'in_arrears') NOT NULL DEFAULT 'in_advance'
    COMMENT '计费时序：\n'
            'in_advance - 前置计费 (先付后用，如SaaS软件月度订阅、硬件买断)\n'
            'in_arrears - 后置计费 (先用后付，如按单月实际API调用量、支付交易流水计费)',
            
  `trial_days` INT UNSIGNED DEFAULT 0 COMMENT '免费试用天数。0 表示无试用，14 表示前14天免费',
  
  `uom` VARCHAR(20) NOT NULL DEFAULT 'unit' 
    COMMENT '计量单位 (Unit of Measure)：\n'
            'license - 授权\n'
            'device - 设备\n'
            'hour - 工时\n'
            'transaction - 笔\n'
            'unit - 个/件',
  
  `lifecycle_status` ENUM('draft', 'active', 'eos', 'eol', 'retired') NOT NULL DEFAULT 'draft' 
    COMMENT '生命周期状态：\n'
            'draft - 草稿中。仅在产品库可见，无法加入报价单。\n'
            'active - 在售中。全渠道可配置并下单。\n'
            'eos (End of Sale) - 停止销售。不再接纳新客户订单，但现有客户可以继续续费或加购许可。\n'
            'eol (End of Life) - 停止服务。产品强制下线，不可购买、不可续订、不再提供工单支持。\n'
            'retired - 已归档废弃。',

  -- 税务合规
  `standard_tax_code` VARCHAR(50) DEFAULT NULL COMMENT '标准税务分类码 (如 Avalara Tax Code)，用于精准税务计算（暂不使用，未来可能会用）',

  -- 硬件与物流属性 (仅当 product_type=hardware 时有效)
  `is_shippable` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否需要物理发货。',
  `is_serialized` BOOLEAN NOT NULL DEFAULT FALSE 
    COMMENT '是否需要 SN (Serial Number) 序列号管理。\n'
            '为 TRUE 时，仓库发货 (Fulfillment) 必须扫描唯一的 SN 码出库，用于后期保修追踪。如：收银机主机。',
  `weight_kg` DECIMAL(10,3) DEFAULT NULL COMMENT '发货毛重 (kg)。用于物流运费预估。',
  `length_cm` DECIMAL(10,2) DEFAULT NULL COMMENT '包装长度 (cm)',
  `width_cm` DECIMAL(10,2) DEFAULT NULL COMMENT '包装宽度 (cm)',
  `height_cm` DECIMAL(10,2) DEFAULT NULL COMMENT '包装高度 (cm)',
  `hs_code` VARCHAR(20) DEFAULT NULL COMMENT '海关编码 (HS Code)。跨境清关必备。',
  `country_of_origin` CHAR(2) DEFAULT NULL COMMENT '原产地国家码 (ISO 2)。跨境清关必备。',

  -- 软件自动化属性
  `provisioning_handler` VARCHAR(100) DEFAULT NULL 
    COMMENT '开通处理器标识（当前用于授权控制的场景值或者AppID)。用于关联底层的 Feature Flag 或具体的 AppID，驱动自动化开通逻辑。',

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
  `launch_date` DATE DEFAULT NULL COMMENT '计划上市日期。',
  `eos_date` DATE DEFAULT NULL COMMENT '停止销售日期。',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sku_code` (`sku_code`, `deleted_at`),
  KEY `idx_product` (`product_id`),
  KEY `idx_status` (`lifecycle_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SKU定义表：定义“怎么卖”，承载计费、物流、自动化开通元数据。';

-- ------------------------------------------------------------------------------
-- 4. 多媒体与文档库 (Media & Assets)
-- ------------------------------------------------------------------------------

CREATE TABLE `product_media` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联产品族（适用于所有版本通用的宣传图/视频）。',
  `sku_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联特定 SKU（特定颜色或规格图）。',
  `media_type` ENUM('image', 'video', 'document', '3d_model') NOT NULL 
    COMMENT '素材类型：\n'
            'image - 图片\n'
            'video - 视频\n'
            'document - 文档 (如PDF说明书)\n'
            '3d_model - 3D模型',
  `url` VARCHAR(500) NOT NULL COMMENT 'CDN 或存储桶的绝对 URL。',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '视频或 3D 模型的缩略图 URL。',
  `is_main` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为主图/封面。',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  `locale` VARCHAR(10) DEFAULT 'ALL' COMMENT '适用语言/地区。ALL=全球通用，en-US=仅限英文版展示，zh-CN=仅限中文版展示',
  `title` VARCHAR(255) DEFAULT NULL COMMENT '图片 Alt 文本或文档标题 (如 "快速安装指南.pdf")',
  `created_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_sku` (`sku_id`),
  KEY `idx_locale` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品多媒体资源表：管理商城图片、宣传视频及技术手册。';

-- ------------------------------------------------------------------------------
-- 5. 权益管控 (SaaS Entitlements)
-- ------------------------------------------------------------------------------

-- 产品权益表 (Product Entitlements)
-- 将商业 SKU 翻译为系统内部可识别的权限。是实现“按功能售卖”的核心。
CREATE TABLE `product_entitlements` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku_id` BIGINT UNSIGNED NOT NULL COMMENT '关联的 SKU ID。',
  `feature_code` VARCHAR(100) NOT NULL COMMENT '底层功能编码。示例：module_inventory。',
  `entitlement_type` ENUM('boolean', 'quota', 'tier') NOT NULL DEFAULT 'boolean'
    COMMENT '权益类型：\n'
            'boolean - 开关型 (有无，如 高级报表功能、第三方API接入权限)\n'
            'quota - 配额型 (如 包含5个POS账号授权，或 1000条营销短信包)\n'
            'tier - 等级型 (如 Silver/Gold/Platinum，对应不同的SLA服务等级或API限流策略)',
  `quota_value` BIGINT DEFAULT NULL COMMENT '配额数值。当 type=quota 时使用。使用大整型以支持海量消耗品包，如 100万条 API 调用配配 或者 AI Token',
  `tier_value` VARCHAR(50) DEFAULT NULL COMMENT '等级名称。当 type=tier 时使用。',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '权益状态，用于临时剥夺或下线某项权益',
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除，保留历史订单的权益追溯',
  PRIMARY KEY (`id`),
  KEY `idx_sku` (`sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品权益配置表：实现商业 SKU 到系统底层功能控制的自动映射。';

-- ------------------------------------------------------------------------------
-- 6. 组合套餐定义 (Bundle Structure)
-- ------------------------------------------------------------------------------

-- 套餐分组表 (Bundle Groups)
-- 在套餐下划定“选购范围”。实现 M 选 N 逻辑（如：主食 3 选 1，配件 10 选 3）。
CREATE TABLE `bundle_groups` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '所属套餐 SKU ID。',
  `group_name` VARCHAR(100) NOT NULL COMMENT '分组名称。示例："核心软件模块", "选配外设配件"。',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '面向客户的选购指引。',
  `translations` JSON DEFAULT NULL 
    COMMENT '多语言 JSON 存储。结构示例：\n'
            '{\n'
            '  "zh-CN": {"group_name": "核心软件模块", "description": "请选择您的主控系统"},\n'
            '  "en-US": {"group_name": "Core Software Modules", "description": "Please select your main system"}\n'
            '}',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  
  -- M 选 N 核心控制逻辑：固定选取数量，M 是分组内的 SKU 种类数，N 是必须选取的固定数量  
  -- 场景示例：  
  -- 1. “主收银机 3 选 1” → min=1, max=1，必须且只能选一台主收银机；  
  -- 2. “周边配件 6 选 3” → min=3, max=3，必须恰好选 3 件配件；  
  -- 3. “增值服务 5 选 0~2” → min=0, max=2，纯选配，可不选或最多选 2 项；  
  -- 4. “耗材包 5 选 5” → min=5, max=5，必须一次性配齐 5 种耗材，不能多也不能少。  
  `min_selections` INT NOT NULL DEFAULT 1 COMMENT '该组最少需选择的数量，0 表示该组为纯选配',
  `max_selections` INT NOT NULL DEFAULT 1 COMMENT '该组最多可选择的数量',
  
  `allow_multiple_qty_per_item` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否允许同一个选项选多次 (如买两台一样的打印机) ',
  `is_mutually_exclusive` BOOLEAN NOT NULL DEFAULT FALSE 
    COMMENT '组内互斥开关。\n'
            'TRUE - 组内所有选项完全互斥，只能选1个（单选框 UI）。例如：主控收银机的操作系统，只能在 Android 或 Windows 中二选一。\n'
            'FALSE - 组内选项可多选（复选框 UI）。例如：周边配件组，客户可以同时勾选“扫码枪”和“钱箱”。',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bundle` (`bundle_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐分组表：定义套餐内的“M选N”配置范围。';

-- 套餐选项表 (Bundle Options)
-- 定义分组下具体的子件清单。V14 仅保留结构，定价完全移至价格手册。
CREATE TABLE `bundle_options` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '所属套餐 SKU ID (冗余字段，用于极大提升 CPQ 渲染时的查询性能)',
  `group_id` BIGINT UNSIGNED NOT NULL COMMENT '所属的分组 ID。',
  `component_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '选项对应的真实子 SKU ID。',
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE 
    COMMENT '是否默认选中。\n'
            'TRUE 时，当销售人员首次添加该套餐到报价单时，此子项将被自动勾选（但销售可以手动取消，除非 select_n 要求必选）。',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_sku` (`group_id`, `component_sku_id`),
  KEY `idx_component` (`component_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐选项表：定义套餐的物理构成，不涉及任何定价信息。';

-- 兼容性规则表
-- 业务约束逻辑。防止错配（如：买打印机必须买电源线）。
CREATE TABLE `product_rules` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `source_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '主 SKU。',
  `target_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '关联 SKU。',
  `rule_type` ENUM('requires', 'excludes', 'recommends', 'compatible_with') NOT NULL 
    COMMENT '规则类型：\n'
            'requires - 强依赖 (买A必须买B)\n'
            'excludes - 互斥 (买A不能买B)\n'
            'recommends - 推荐/加购 (买A推荐买B)\n'
            'compatible_with - 兼容性标记 (A可以配合B使用)',
  `message` VARCHAR(255) DEFAULT NULL COMMENT '触发规则时的提示语 (用于前端报错或提示)。示例：购买此打印机必须同时购买电源适配器。',
  `created_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rule` (`source_sku_id`, `target_sku_id`, `rule_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品销售规则表：内置 CPQ 校验逻辑，防止销售人员乱配单。';

-- ------------------------------------------------------------------------------
-- 7. 定价引擎 (Pricing Engine)
-- ------------------------------------------------------------------------------

-- 价格手册表 (Price Books)
-- 控制“谁在什么市场看到什么价格”。实现全球差异化定价的核心。
-- 
-- 【报价手册路由与匹配策略】
-- 第一步：基于硬性条件进行“海选” (Filtering)
-- 当接收到客户报价请求时，系统首先找出所有当前时间点合法可用的手册：
-- 1. 状态检查：is_active = TRUE
-- 2. 时间检查：valid_from <= NOW() 且 (valid_to IS NULL 或 valid_to >= NOW())
-- 3. 区域检查：applicable_regions 包含 GLOBAL 或客户所在的国家代码（如 US）
-- 4. 币种检查：currency 匹配客户期望的币种（如 USD）
-- 
-- 第二步：基于客户身份与场景的“精确路由” (Routing)
-- 根据 type 字段和客户身份进行路由优先级判断（从高到低）：
-- 优先级 1：专属合同价 (custom) - 最高优先级，强制匹配。针对大型连锁品牌（Enterprise）签署的战略协议价。
-- 优先级 2：限时促销价 (promotional) - 仅次于合同价，覆盖标准价。如果促销手册中没有某个 SKU 的报价，则回退(Fallback)。
-- 优先级 3：渠道代理商价 (channel) - 身份隔离。渠道商专属供货底价，无法看到普通 C 端客户的标准价或促销价。
-- 优先级 4：公开标准价 (standard) - 兜底方案。作为最终的 Fallback，所有针对该地区的 SKU 都必须在 standard 手册中有报价。
-- 
-- 第三步：极端冲突场景处理（Conflict Resolution）
-- 如果在同一个优先级层级内，依然匹配出了多本手册，系统处理策略（推荐）：
-- 1. 就低原则 (Lowest Price Wins)：去两本手册里查同一个 SKU 的价格，哪个便宜应用哪个（B2C 常用，体验最好）。
-- 2. 最后生效优先 (Latest Valid From Wins)：比较 valid_from 字段，谁的生效时间最晚就用谁的（运营最可控）。
-- 3. 优先级字段介入 (Weight/Priority)：可扩展 priority INT 字段，手动指定权重。
CREATE TABLE `price_books` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL COMMENT '手册编码。示例：USD_STANDARD_2026。',
  `name` VARCHAR(100) NOT NULL COMMENT '手册名称。',
  `currency` CHAR(3) NOT NULL COMMENT '计价币种 (ISO 4217)。示例：USD, EUR, CNY。',
  `applicable_regions` JSON DEFAULT NULL 
    COMMENT '适用国家/地区。格式：["US", "CA"]。实现同币种在不同市场的隔离。\n'
            '示例 1: ["GLOBAL"] (全球通用)\n'
            '示例 2: ["US", "CA"] (仅限北美)',
  `translations` JSON DEFAULT NULL 
    COMMENT '手册名称的多语言展示 (JSON)。\n'
            '结构示例：{"fr-FR": "Prix Standard Mondial", "zh-CN": "2026全球标准价格手册"}',
  `price_display_precision` TINYINT UNSIGNED DEFAULT 2 COMMENT '前端展示小数位数 (0=取整, 2=保留两位)',
  `type` ENUM('standard', 'channel', 'promotional', 'custom') NOT NULL DEFAULT 'standard' 
    COMMENT '手册类型：\n'
            'standard - 标准公开价 (默认用于 B2C/SMB 在线商城直接下单)\n'
            'channel - 渠道代理商供货价 (折扣极低，仅针对有合作协议的 Dealer)\n'
            'promotional - 节日/活动限时促销价 (配合 valid_to 控制失效时间)\n'
            'custom - 战略大客户专属定价 (仅针对特定 Enterprise 租户可见)',
  `is_active` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '启用状态。',
  `valid_from` DATETIME NOT NULL COMMENT '生效时间。支持预约调价（如：下月 1 号正式提价）。',
  `valid_to` DATETIME DEFAULT NULL COMMENT '失效时间。(NULL表示永久)',
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格手册表：全球差异化定价的顶级容器。';

-- 价格条目表 (Price Book Entries)
-- 最核心表。定义 SKU 在特定上下文、特定币种下的真实售价。
CREATE TABLE `price_book_entries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `price_book_id` BIGINT UNSIGNED NOT NULL COMMENT '关联的价格手册（隐含了币种和市场）。',
  `sku_id` BIGINT UNSIGNED NOT NULL COMMENT '售卖对象 SKU ID。',
  `parent_sku_id` BIGINT UNSIGNED DEFAULT NULL 
    COMMENT '上下文定价核心字段。针对套餐子件定价：\n'
            'NULL: 独立销售价或套餐整体基础价。\n'
            '非NULL: 该 SKU 作为指定套餐子件时的定价（支持 Included $0 或 加减价）。',
  
  `pricing_strategy` ENUM('flat_fee', 'per_unit', 'tiered', 'volume', 'percentage') NOT NULL DEFAULT 'flat_fee'
    COMMENT '定价策略：\n'
            'flat_fee - 固定一口价 (如 月费 $99)\n'
            'per_unit - 单价 x 数量 (如 硬件 $500/台)\n'
            'tiered - 分段阶梯累加 (如 前100个$10，第101个起$8，按单次订购量分段计费)\n'
            'volume - 总量阶梯跳变 (如 买100个以上全部$8，按累计订购总量跳档)\n'
            'percentage - 百分比费率 (如 支付费率 2.9%)\n'
            '当 parent_sku_id 非空时，通常继承父项计费周期，除非特殊声明。',
            
  `list_price` DECIMAL(19,4) NOT NULL 
    COMMENT '基础单价。\n'
            '场景1：独立销售（parent_sku_id 为空），表示该 SKU 的独立基础售价。\n'
            '场景2：套餐组合明细（parent_sku_id 非空），同样表示该子件的【标准目录单价】。该价格用于向客户展示其价值。',
            
  `standalone_selling_price` DECIMAL(19,4) DEFAULT NULL 
    COMMENT '财务独立公允售价 (SSP, Standalone Selling Price)。\n'
            '核心作用：解决 ASC 606 / IFRS 15 收入分摊合规问题。\n'
            '业务场景：当向客户提供“买 SaaS 送 0 元硬件”或极高折扣的 Bundle 时，'
            '财务系统将无视 list_price，强制按照本字段的公允价值比例，重新拆分和确认软硬件的真实收入。',
            
  `billing_model_override` ENUM('one_time', 'recurring', 'usage_based') DEFAULT NULL 
    COMMENT '计费模式强制覆盖 (解决 HaaS 硬件变租赁问题)。\n'
            '业务场景：一个 POS 硬件 SKU 默认是 one_time (买断)，'
            '但在本价格手册/套餐中，配置为 recurring (按月租赁)。此字段非 NULL 时优先于 SKU 原生设定。',
            
  `min_commitment_months` SMALLINT UNSIGNED DEFAULT 0 
    COMMENT '最低承诺在网期（强制绑定月数）。\n'
            '业务场景：享受本价格条目（如 8 折优惠或 0 元硬件）的客户，必须至少连续订阅 12 或 36 个月。0 表示无约束 (Month-to-Month)。',
            
  `early_termination_policy` ENUM('none', 'flat_fee', 'remaining_balance', 'fixed_months') NOT NULL DEFAULT 'none'
    COMMENT '提前解约金 (ETF, Early Termination Fee) 收取策略：\n'
            'none - 无违约金（随时可退订）。\n'
            'flat_fee - 罚没固定金额（如直接罚 $500 设备折旧费）。\n'
            'remaining_balance - 罚没剩余未履行合同期的全额或比例金额（如要求补齐剩下 10 个月的 SaaS 费）。\n'
            'fixed_months - 罚没固定 N 个月的月费。',
            
  `etf_amount_or_percent` DECIMAL(10,4) DEFAULT NULL 
    COMMENT '违约金计算系数。\n'
            '配合 policy 字段使用。若 flat_fee 则表示绝对金额；若 remaining_balance 则表示惩罚比例（如 0.5 表示收剩余金额的 50%）。',

  `bundle_adjustment_amount` DECIMAL(19,4) DEFAULT NULL
    COMMENT '套餐子件加减价金额（仅当 parent_sku_id 非空时有效）：\n'
            ' - 0.00: 免费包含 (Included)，不影响套餐总价。\n'
            ' - 正数: 额外加价金额 (Markup)，如升级大杯 +2.00。\n'
            ' - 负数: 减免金额 (Markdown)，如降级或不选退还 -1.00。\n'
            '前端在计算套餐总价时，直接将选中的各子件该字段值累加至套餐基础价即可。',
  `estimated_unit_cost` DECIMAL(19,4) DEFAULT NULL 
    COMMENT '预估单位成本价（与价格手册币种一致）。用于销售报价时实时计算毛利（Gross Margin），辅助决策。',
  `min_price` DECIMAL(19,4) DEFAULT NULL COMMENT '销售底价（Floor Price）。低于此价格必须走高层审批。',
  `max_discount_rate` DECIMAL(5,4) DEFAULT NULL 
    COMMENT '最大允许折扣率。示例：0.2000 表示最多打 8 折，用于前端风控拦截。如配置某硬件最多打 95 折，如果销售输入 8 折，前端直接拦截。',
  `msrp` DECIMAL(19,4) DEFAULT NULL COMMENT '建议零售价 (Hardware)',
  
  `tier_config` JSON DEFAULT NULL 
    COMMENT '阶梯/复杂计费配置 JSON\n'
            '主要用于 usage_based 或 tiered 定价策略，贴合餐饮 SaaS 场景。\n'
            '示例1（支付费率）：\n'
            '[\n'
            '  {"min": 0, "max": 10000, "price": 0.0038, "description": "微信/支付宝 0.38%"},\n'
            '  {"min": 10001, "max": 50000, "price": 0.0033, "description": "月交易 1~5 万 0.33%"},\n'
            '  {"min": 50001, "max": null, "price": 0.0028, "description": "月交易超 5 万 0.28% "}\n'
            ']\n'
            '示例2（多门店按店数阶梯，如奶茶店POS模块）：\n'
            '[\n'
            '  {"min": 1, "max": 20, "price": 200.00, "description": "1~20家店 200元/店/月"},\n'
            '  {"min": 21, "max": 100, "price": 150.00, "description": "21~100家店 150元/店/月"},\n'
            '  {"min": 101, "max": null, "price": 100.00, "description": "超100家店 100元/店/月"}\n'
            ']',
  
  `valid_from` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '价格条目生效时间 (支持预约调价)。',
  `valid_to` DATETIME DEFAULT NULL COMMENT '价格条目失效时间 (留空表示当前有效)。',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  -- 复合索引：确保同一个 SKU 在同一个手册、同一个上下文下，在同一时间点只有一个有效价格。
  UNIQUE KEY `uk_book_sku_parent_date` (`price_book_id`, `sku_id`, `parent_sku_id`, `valid_from`),
  KEY `idx_sku` (`sku_id`),
  KEY `idx_parent` (`parent_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格条目表：定义 SKU 在特定币种、市场及套餐上下文中的真实售价与毛利参考。';