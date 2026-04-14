-- 价格手册表 (Price Books)
-- 核心作用：控制“谁能看到什么价格”。
-- 补充说明：同一款软件，针对直销、渠道代理商、大客户(Custom)可以有完全不同的价格手册 and 结算币种。
CREATE TABLE `price_books` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL COMMENT '手册编码，如 PB-2026-GLOBAL-USD',
  `name` VARCHAR(100) NOT NULL COMMENT '手册名称',
  `currency` CHAR(3) NOT NULL COMMENT '结算币种 ISO 4217',
  
  `applicable_regions` JSON DEFAULT NULL 
    COMMENT '适用国家/地区范围 (JSON 数组)。\n'
            '示例 1: ["GLOBAL"] (全球通用)\n'
            '示例 2: ["US", "CA"] (仅限北美)\n'
            '通过此字段可实现同币种在不同国家的“购买力平价”策略隔离。',
            
  `translations` JSON DEFAULT NULL COMMENT '手册名称的多语言展示 (JSON)。如 {"fr-FR": "Prix Standard Mondial"}',
  `price_display_precision` TINYINT UNSIGNED DEFAULT 2 COMMENT '前端展示小数位数 (0=取整, 2=保留两位)',
            
  `type` ENUM('standard', 'channel', 'promotional', 'custom') NOT NULL DEFAULT 'standard'
    COMMENT '手册类型：\n'
            'standard - 标准公开价\n'
            'channel - 渠道/合作伙伴价格\n'
            'promotional - 限时促销价\n'
            'custom - 大客户定制价',
  
  `is_active` BOOLEAN NOT NULL DEFAULT FALSE,
  `valid_from` DATETIME NOT NULL COMMENT '生效时间',
  `valid_to` DATETIME DEFAULT NULL COMMENT '失效时间 (NULL表示永久)',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格手册主表';
