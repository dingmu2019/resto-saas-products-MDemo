-- 全球税务合规 (Global Tax Compliance)
CREATE TABLE `tax_rates_flat` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `country_code` CHAR(2) NOT NULL COMMENT 'ISO 3166-1 alpha-2',
  `state_code` VARCHAR(10) DEFAULT NULL,
  `zip_code` VARCHAR(20) DEFAULT NULL,
  `product_type` ENUM('software', 'hardware', 'service', 'consumable', 'bundle') NOT NULL,
  `tax_type` ENUM('VAT', 'GST', 'SalesTax', 'PST', 'HST', 'QST') NOT NULL,
  `tax_rate` DECIMAL(6,4) NOT NULL,
  `tax_name` VARCHAR(50) NOT NULL,
  `is_tax_inclusive` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_b2b_exempt` BOOLEAN NOT NULL DEFAULT FALSE,
  `effective_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='全球扁平化综合税率表';
