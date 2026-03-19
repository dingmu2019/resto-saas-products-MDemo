-- 产品权益表 (Product Entitlements)
-- 核心作用：充当商业售卖 SKU 与系统底层技术控制之间的“翻译官”。
-- 补充说明：SaaS 系统的核心枢纽。通过定义 Feature Code，前端可据此控制页面按钮的显示/隐藏，
-- 后端可据此进行业务拦截（如门店数量限制）。在 CPQ 阶段也用于向客户展示套餐的具体包含内容。
-- 
-- 典型应用场景示例：
-- 1. 功能开关 (Boolean)：
--    - 场景：购买“专业版 SKU”才能使用“高级库存分析”模块。
--    - 配置：entitlement_type='boolean', feature_code='module_advanced_inventory'
--    - 效果：前端/后端根据此 Flag 动态显示或隐藏菜单，研发无需硬编码 `if (sku == '专业版')`。
-- 
-- 2. 数量配额控制 (Quota - 状态型)：
--    - 场景：“连锁版 5 店套餐”限制租户最多创建 5 个门店。
--    - 配置：entitlement_type='quota', feature_code='max_store_limit', quota_value=5
--    - 效果：后端在创建门店时拦截，超出数量则提示升级。购买多个扩容包 SKU 时，系统自动累加 (SUM) 其 quota_value。
-- 
-- 3. 消耗品一次性充值 (Quota - 消耗型)：
--    - 场景：客户购买“10000 条营销短信包”。
--    - 配置：entitlement_type='quota', feature_code='sms_balance_topup', quota_value=10000
--    - 效果：订单生效后，自动化履约网关触发短信微服务，将该租户短信余额累加 (Increment) 10000。
-- 
-- 4. 服务等级协议与层级限制 (Tier)：
--    - 场景：购买“旗舰全球套装”享受 7x24 小时白金级专属客服 (SLA)。
--    - 配置：entitlement_type='tier', feature_code='support_sla_level', tier_value='Platinum'
--    - 效果：工单系统读取该权益，自动为工单打上“高优先级”标签并路由至高级专家组。
CREATE TABLE `product_entitlements` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku_id` BIGINT UNSIGNED NOT NULL COMMENT '关联的软件 SKU',
  `feature_code` VARCHAR(100) NOT NULL COMMENT '系统功能特性编码 (Feature Flag)，如 module_inventory',
  `entitlement_type` ENUM('boolean', 'quota', 'tier') NOT NULL DEFAULT 'boolean'
    COMMENT '权益类型：\n'
            'boolean - 开关型 (有/无)\n'
            'quota - 配额型 (如包含 5 个用户，1000 条短信)\n'
            'tier - 等级型 (如 Silver, Gold)',
  `quota_value` BIGINT DEFAULT NULL COMMENT '配额数量 (当 type=quota 时使用。使用大整型以支持海量消耗品包，如 100万条 API 调用配配 或者 AI Token)',
  `tier_value` VARCHAR(50) DEFAULT NULL COMMENT '等级值 (当 type=tier 时使用)',
  
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '权益状态，用于临时剥夺或下线某项权益',
  
  -- 审计字段
  `created_by` VARCHAR(64) DEFAULT NULL,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除，保留历史订单的权益追溯',
  
  PRIMARY KEY (`id`),
  KEY `idx_sku` (`sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品权益/功能特性配置表';
