-- 套餐分组表 (Bundle Groups)
-- 核心作用：在套餐 SKU 下划定“选择范围” (M 选 N 逻辑)。
-- 补充说明：例如：打印机组合中3选2，SKU 分别是： 80毫米高速打印机-黑色、 80毫米高速打印机-白色、 80毫米高速打印机-灰色，3选2，可以任意2种组合或者同色选2次（allow_multiple_qty_per_item=TRUE）
CREATE TABLE `bundle_groups` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bundle_sku_id` BIGINT UNSIGNED NOT NULL COMMENT '所属套餐 SKU ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分组名称，如 "核心POS软件", "厨房打印机选配"',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '给客户/销售的提示说明',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  
  -- M 选 N 核心控制逻辑：固定选取数量，M是分组内的SKU种类数，N是必须选取的固定数量
  -- 业务示例：分组设置为3选2，则表示分组共 3 种 SKU (M=3)，必须且只能选 2 种 (N=2)，是否同一种可选多次取决于 allow_multiple_qty_per_item。
  -- 例如：打印机组合中3选2，SKU 分别是： 80毫米高速打印机-黑色、 80毫米高速打印机-白色、 80毫米高速打印机-灰色，3选2，可以任意2种组合或者同色选2次（allow_multiple_qty_per_item=TRUE）
  `select_n` INT NOT NULL DEFAULT 1 COMMENT '必须选取的固定数量 (N)，0 表示该组整体可选配',
            
  `allow_multiple_qty_per_item` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否允许同一个选项选多次 (如买两台一样的打印机) ',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_bundle` (`bundle_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐分组表(控制M选N逻辑)';
