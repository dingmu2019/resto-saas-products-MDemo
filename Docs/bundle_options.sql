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
