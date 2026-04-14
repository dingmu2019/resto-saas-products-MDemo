-- 定价引擎 (Pricing Engine)
CREATE TABLE `price_books` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `currency` CHAR(3) NOT NULL,
  `type` ENUM('standard', 'channel', 'promotional', 'custom') NOT NULL DEFAULT 'standard',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格手册表';

CREATE TABLE `price_book_entries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `price_book_id` BIGINT UNSIGNED NOT NULL,
  `sku_id` BIGINT UNSIGNED NOT NULL,
  `pricing_strategy` ENUM('flat_fee', 'per_unit', 'tiered', 'volume', 'percentage') NOT NULL DEFAULT 'flat_fee',
  `list_price` DECIMAL(19,4) NOT NULL,
  `min_price` DECIMAL(19,4) DEFAULT NULL,
  `ssp_price` DECIMAL(19,4) DEFAULT NULL COMMENT 'SSP公允价值 (Standalone Selling Price)',
  `penalty_strategy` JSON DEFAULT NULL COMMENT '违约金策略 (Penalty Strategy)',
  `tier_config` JSON DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格条目表';
