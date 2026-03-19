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
