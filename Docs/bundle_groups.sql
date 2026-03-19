-- 套餐分组表 (Bundle Groups)
-- 核心作用：在套餐 SKU 下划定“选择范围” (M 选 N 逻辑)。
-- 补充说明：如“请选择 1 个核心软件”、“请选配 0-3 台外设打印机”。
CREATE TABLE `bundle_groups` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '所属套餐 SKU ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分组名称，如 "核心POS软件", "厨房打印机选配"',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '给客户/销售的提示说明',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  
  -- M 选 N 核心控制逻辑
  `min_selections` INT NOT NULL DEFAULT 1 COMMENT '该组最少需选择的数量 (M)，0 表示该组为纯选配',
  `max_selections` INT NOT NULL DEFAULT 1 COMMENT '该组最多可选择的数量 (N)',
  
  `is_mutually_exclusive` BOOLEAN NOT NULL DEFAULT FALSE 
    COMMENT '组内互斥开关。\n'
            'TRUE: 组内选项完全互斥 (Radio Button)。示例：在“操作系统”分组中，选了 Windows 就不能选 Linux。\n'
            'FALSE: 组内可多选 (Checkbox)。示例：在“外设配件”分组中，可以同时勾选键盘和鼠标。',
            
  `allow_multiple_qty_per_item` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否允许同一个选项选多次 (如买两台一样的打印机) 当前暂不支持 未来大概率也不会用',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_bundle` (`bundle_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐分组表(控制M选N逻辑)';
