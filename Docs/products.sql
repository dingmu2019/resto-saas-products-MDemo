-- 产品族表 (Product Family / SPU)
-- 核心作用：等同于电商中的 SPU (Standard Product Unit)，定义业务层面的“产品 concept”，充当同类 SKU 的逻辑聚合容器。
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
