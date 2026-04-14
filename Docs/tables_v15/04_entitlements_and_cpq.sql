-- 权益管控与CPQ组合 (Entitlements and CPQ)
CREATE TABLE `product_entitlements` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku_id` BIGINT UNSIGNED NOT NULL,
  `feature_code` VARCHAR(100) NOT NULL,
  `entitlement_type` ENUM('boolean', 'quota', 'tier') NOT NULL,
  `quota_value` INT DEFAULT NULL,
  `tier_value` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品权益映射表';

CREATE TABLE `bundle_groups` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `select_n` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐分组表';

CREATE TABLE `bundle_options` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL,
  `group_id` BIGINT UNSIGNED NOT NULL,
  `component_sku_id` BIGINT UNSIGNED NOT NULL,
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐选项表';

CREATE TABLE `product_rules` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `source_sku_id` BIGINT UNSIGNED NOT NULL,
  `target_sku_id` BIGINT UNSIGNED NOT NULL,
  `rule_type` ENUM('requires', 'excludes', 'recommends', 'compatible_with') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品规则表';
