-- SKU 表 (Stock Keeping Unit)
-- 核心作用：定义“怎么卖”。SKU 是报价单 (Quote)、订单行 (Order Line Item) 和库存流转的最小原子单位。
-- 补充说明：SKU 承载了计费模式、生命周期、物流属性等所有具备商业交易价值的元数据。
CREATE TABLE `product_skus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '所属产品族ID',
  `sku_code` VARCHAR(100) NOT NULL COMMENT '可售卖SKU编码，如 SW-POS-PRO-M-V1',
  `name` VARCHAR(150) NOT NULL COMMENT 'SKU 销售名称，如 POS Pro Edition (Monthly)',
  
  -- 财务与计费维度
  `billing_model` ENUM('recurring', 'one_time', 'usage_based', 'hybrid') NOT NULL 
    COMMENT '计费模式：\n'
            'recurring - 周期性订阅 (软件订阅产品按周、月、季、年等)\n'
            'one_time - 一次性买断 (硬件/实施费)\n'
            'usage_based - 按量计费 (支付费率/短信)\n'
            'hybrid - 混合计费 (套餐组合SKU)',
            
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
