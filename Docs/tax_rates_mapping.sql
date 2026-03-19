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
  `is_b2b_exempt` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'B2B 客户是否免税 or 适用反向征收 (Reverse Charge)',
  
  `effective_date` DATE NOT NULL COMMENT '税率生效日期 (支持未来税法变更)',
  `end_date` DATE DEFAULT NULL COMMENT '税率失效日期 (留空表示当前有效)',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rule` (`tax_region_id`, `product_type`, `tax_type`, `effective_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='区域产品类型复杂税率规则表';
