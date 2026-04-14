-- 核心资产与媒体 (Core Assets and Media)
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `product_code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `product_type` ENUM('software', 'hardware', 'service', 'consumable', 'bundle') NOT NULL,
  `brand` VARCHAR(50) DEFAULT NULL,
  `description` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品族表';

CREATE TABLE `product_skus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `sku_code` VARCHAR(100) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `billing_model` ENUM('recurring', 'one_time', 'usage_based', 'hybrid') NOT NULL,
  `billing_term` ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'biennial', 'triennial', 'custom', 'none') NOT NULL DEFAULT 'none',
  `billing_timing` ENUM('in_advance', 'in_arrears') NOT NULL DEFAULT 'in_advance',
  `trial_days` INT UNSIGNED DEFAULT 0,
  `uom` VARCHAR(20) NOT NULL DEFAULT 'unit',
  `lifecycle_status` ENUM('draft', 'active', 'eos', 'eol', 'retired') NOT NULL DEFAULT 'draft',
  `asset_status` ENUM('buyout', 'lease', 'subscription') NOT NULL DEFAULT 'buyout' COMMENT '资产状态标识：买断、租赁、订阅',
  `is_shippable` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_serialized` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SKU 定义表';

CREATE TABLE `product_media` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED DEFAULT NULL,
  `sku_id` BIGINT UNSIGNED DEFAULT NULL,
  `media_type` ENUM('image', 'video', 'document', '3d_model') NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品多媒体表';
