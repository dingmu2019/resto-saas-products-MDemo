-- 产品分类表
-- 餐饮 SaaS 行业 4 级分类最佳实践示例 (参考头部企业体系)：
-- 1. 软件订阅与云服务 (Software & Cloud Services)
--    1.1 核心门店系统 (Core POS)
--        1.1.1 快餐版 (QSR Edition) -> 包含: 单店版, 连锁版
--        1.1.2 正餐版 (FSR Edition) -> 包含: 基础版, 专业版
--    1.2 数字化运营 (Digital Guest Experience)
--        1.2.1 线上点餐 (Online Ordering) -> 包含: 自营外卖, 聚合平台接口(API)
--        1.2.2 会员与营销 (Loyalty & Marketing) -> 包含: 积分模块, 自动化营销包
--    1.3 后厨与供应链 (Kitchen & Back-Office)
--        1.3.1 厨房显控 (KDS) -> 包含: 基础叫号, 高级厨房调度
--        1.3.2 进销存管理 (Inventory) -> 包含: 门店库存, 中央厨房(CK)
-- 2. 智能硬件与外设 (Smart Hardware & Devices)
--    2.1 收银与触控终端 (POS Terminals)
--        2.1.1 桌面收银机 (Countertop POS) -> 包含: 15寸单屏, 15+10寸双屏
--        2.1.2 移动与自助设备 (Mobile & Kiosk) -> 包含: 手持点餐机(mPOS), 24寸自助点餐机
--    2.2 打印与网络设备 (Printers & Networking)
--        2.2.1 打印机 (Printers) -> 包含: 80mm热敏前台, 厨房防油烟打印机, 标签打印机
--        2.2.2 网络基建 (Networking) -> 包含: 商业级路由器, 交换机, AP基站
-- 3. 金融与支付网关 (Fintech & Payment Processing)
--    3.1 支付费率与服务 (Payment Rates)
--        3.1.1 信用卡收单 (Credit Card Processing) -> 包含: Visa/MC 基础费率, 高级费率套餐
--        3.1.2 本地钱包与扫码 (Local Wallets) -> 包含: Apple Pay/Google Pay, 微信/支付宝聚合
--    3.2 支付终端硬件 (Payment Terminals)
--        3.2.1 刷卡设备 (Card Readers) -> 包含: 台式密码键盘(PIN Pad), 移动刷卡头
-- 4. 专业服务与耗材 (Professional Services & Consumables)
--    4.1 实施与培训 (Onboarding Services)
--        4.1.1 部署服务 (Deployment) -> 包含: 远程基础建档, 上门硬件安装
--        4.1.2 培训服务 (Training) -> 包含: 经理培训包, 员工在线认证课程
--    4.2 耗材与增值服务 (Consumables & Add-ons)
--        4.2.1 物理耗材 (Physical Supplies) -> 包含: 热敏打印纸一箱, 员工IC磁卡
--        4.2.2 虚拟消耗品 (Virtual Credits) -> 包含: 营销短信包(1000条), WhatsApp通知包
CREATE TABLE `product_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID，支持无限层级',
  `code` VARCHAR(50) NOT NULL COMMENT '分类业务编码，全局唯一。例如：POS_HARDWARE, SAAS_CORE',
  `name` VARCHAR(100) NOT NULL COMMENT '分类显示名称 (默认/基准语言名称)',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
  `translations` JSON DEFAULT NULL 
    COMMENT '多语言名称与描述 JSON。结构示例：\n'
            '{\n'
            '  "zh-CN": {"name": "智能硬件", "description": "包含收银机、打印机等设备"},\n'
            '  "en-US": {"name": "Smart Hardware", "description": "POS terminals, printers, etc."}\n'
            '}',
  `level` TINYINT NOT NULL DEFAULT 1 COMMENT '层级深度：1-根分类, 2-二级分类...',
  `path` VARCHAR(255) NOT NULL COMMENT '层级路径，如 /1/4/12/，用于快速查询某分类下的所有子孙节点',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '前端展示排序权重，数值越小越靠前',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
  
  -- 审计字段
  `created_by` VARCHAR(64) DEFAULT NULL COMMENT '创建人ID或用户名',
  `updated_by` VARCHAR(64) DEFAULT NULL COMMENT '最后修改人ID或用户名',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '软删除时间，非空即为已删除',
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`, `deleted_at`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品分类表';
