-- 产品媒体表 (Product Media)
-- 核心作用：集中管理产品在电商商城、报价单展示时所需的各类多媒体素材。
-- 补充说明：采用独立的媒体表而不是在 SKU 中存 JSON 数组，是为了支持素材的多语言 (locale)、
-- 多终端适配 (thumbnail) 以及资源复用 (挂载在 Product 级别供所有 SKU 共享)。
CREATE TABLE `product_media` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联到产品族 (适用于所有版本通用的宣传图/视频)',
  `sku_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联到特定 SKU (适用于特定颜色的硬件，或特定版本的界面截图)',
  
  `media_type` ENUM('image', 'video', 'document', '3d_model') NOT NULL COMMENT '媒体类型',
  `url` VARCHAR(500) NOT NULL COMMENT 'CDN 或存储桶的绝对路径',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '视频或 3D 模型的缩略图 URL',
  
  `is_main` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为主图 (封面图)',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '展示排序',
  
  `locale` VARCHAR(10) DEFAULT 'ALL' COMMENT '适用语言/地区。ALL=全球通用，en-US=仅限英文版展示，zh-CN=仅限中文版展示',
  `title` VARCHAR(255) DEFAULT NULL COMMENT '图片 Alt 文本或文档标题 (如 "快速安装指南.pdf")',
  
  `created_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_sku` (`sku_id`),
  KEY `idx_locale` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品多媒体与文档资源表';
