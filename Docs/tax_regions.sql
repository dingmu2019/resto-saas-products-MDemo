-- 税区表 (Tax Jurisdictions)
-- 核心作用：建立全球税务管辖区的层级树。
-- 补充说明：支持多层级嵌套，如：US (国家级) -> US-NY (州级) -> US-NY-NYC (市级/特殊税区)。
-- path 字段用于在计费时快速向上回溯，将整条链路上的税率进行叠加计算。
CREATE TABLE `tax_regions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父级税区，支持税区嵌套（如国家-州-市）',
  `region_code` VARCHAR(50) NOT NULL COMMENT '内部税区编码，如 US-NY, CN-SH',
  `country_code` CHAR(2) NOT NULL COMMENT 'ISO 3166-1 alpha-2 国家码',
  `state_code` VARCHAR(10) DEFAULT NULL COMMENT '州/省代码 (针对美国/加拿大等)',
  `name` VARCHAR(100) NOT NULL COMMENT '税区显示名称',
  
  `level` ENUM('country', 'state', 'county', 'city', 'special') NOT NULL DEFAULT 'country' 
    COMMENT '税务管辖级别：\n'
            'country - 国家级 (如 US)\n'
            'state - 州/省级 (如 US-NY)\n'
            'county - 县/郡级 (如 US-NY-Kings)\n'
            'city - 市级 (如 US-NY-NYC)\n'
            'special - 特殊经济区/保税区 (如 特区、免税港)',
            
  `path` VARCHAR(255) NOT NULL COMMENT '层级路径，如 /1/2/3/，用于快速向上回溯父级税率或向下查询子税区',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_region` (`region_code`, `deleted_at`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='全球税务管辖区表';
