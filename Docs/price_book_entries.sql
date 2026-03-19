-- 价格条目表 (Price Book Entries)
-- 核心作用：具体定义某一个 SKU 在特定价格手册中的售价和计费策略。
-- 补充说明：
-- 1. 阶梯计费：支持通过 tier_config 配置用量阶梯（如API调用量前1万次免费，超出部分阶梯计费）。
-- 2. 时间轴：通过 valid_from 支持价格的“预约变更”（如下月起涨价），保障财务对账的历史准确性。
CREATE TABLE `price_book_entries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `price_book_id` BIGINT UNSIGNED NOT NULL,
  `sku_id` BIGINT UNSIGNED NOT NULL,
  
  `pricing_strategy` ENUM('flat_fee', 'per_unit', 'tiered', 'volume', 'percentage') NOT NULL DEFAULT 'flat_fee'
    COMMENT '定价策略：\n'
            'flat_fee - 固定一口价 (如 月费 $99)\n'
            'per_unit - 单价 x 数量 (如 硬件 $500/台)\n'
            'tiered - 分段阶梯累加 (如 前10个$10，第11个起$8)\n'
            'volume - 总量阶梯跳变 (如 买100个以上全部$8)\n'
            'percentage - 百分比费率 (如 支付费率 2.9%)',
            
  `list_price` DECIMAL(19,4) NOT NULL COMMENT '目录价格 (标准单价)',
  `min_price` DECIMAL(19,4) DEFAULT NULL COMMENT '销售底价 (Floor Price)，低于此价格需要审批',
  `max_discount_rate` DECIMAL(5,4) DEFAULT NULL COMMENT '最大允许折扣率 (0.20 = 20% off)，用于前端风控拦截 配置某个硬件 SKU “最多打 95 折”，如果销售试图输入 8 折，前端直接拦截，无需提交审批',
  `msrp` DECIMAL(19,4) DEFAULT NULL COMMENT '建议零售价 (Hardware)',
  
  `tier_config` JSON DEFAULT NULL 
    COMMENT '阶梯/复杂计费配置 JSON\n'
            '结构示例: [{"min": 0, "max": 1000, "price": 0.029}, {"min": 1001, "max": null, "price": 0.025}]',
            
  `valid_from` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '价格生效时间 (支持预约调价)',
  `valid_to` DATETIME DEFAULT NULL COMMENT '价格失效时间 (留空表示当前有效)',
            
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_book_sku_date` (`price_book_id`, `sku_id`, `valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格手册明细表';
