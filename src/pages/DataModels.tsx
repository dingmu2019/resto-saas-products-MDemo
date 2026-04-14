import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui';
import { Database, Table as TableIcon, Info } from 'lucide-react';
import schemaSql from '../data/schema.sql?raw';

const OVERVIEW_SQL = `-- ============================================================================== 
-- 餐饮 SaaS 全球产品与定价中心 - 数据模型设计 V15.0 
-- ============================================================================== 
-- 【项目背景与设计理念】 
-- 本模型是支撑全球化餐饮 SaaS (涵盖软件订阅、智能硬件、金融支付、专业服务) 商业流转的底层数据骨架。 
-- 旨在解决全球化业务中的三大难题： 
-- 1. 复杂定价 (CPQ)：支持不同国家、不同币种、不同销售渠道的差异化定价，支持基于客户身份与场景的精准路由。 
-- 2. 套餐灵活性与合规性：实现“组合逻辑”与“定价逻辑”的彻底解耦，支持 HaaS (硬件即服务) 模式。内置公允价值 (SSP) 与合约约束（强制在网期、违约金），满足 ASC 606 财务审计合规。 
-- 3. 全球税务合规：采用扁平化综合税率模型，结合邮编/省州精准匹配最终税率，避免多层级嵌套计算，支持多语言展示。 
-- 
-- 【核心模块说明】 
-- 1. 基础维度 (\`product_categories\`)：构建支持无限层级的商品目录，支撑商城的导航与分类逻辑。 
-- 2. 全球税务 (\`tax_rates_flat\`)：处理全球复杂的价外税 (Sales Tax) 与价内税 (VAT)，基于地理位置直接匹配最终税率。 
-- 3. 核心资产 (\`products\`, \`product_skus\`)： 
--    - SPU (Standard Product Unit)：定义产品族（如：POS系统、收银机）。 
--    - SKU (Stock Keeping Unit)：定义具体的销售规格（如：专业版月付、白色收银机），内置买断与租赁的资产状态标识。 
-- 4. 权益管控 (\`product_entitlements\`)：将商业 SKU 映射为系统底层的 Feature Code，驱动自动化开通。 
-- 5. 组合套餐 (\`bundle_groups\`, \`bundle_options\`)：定义“M选N”的选择逻辑，支持多语言分组指引，不涉及价格。 
-- 6. 定价引擎 (\`price_books\`, \`price_book_entries\`)：核心商业枢纽。 
--    - 支持“上下文定价”：同一个 iPad，单独买是一个价，在套餐里买是另一个价（或免费）。 
--    - 支持“合约与违约控制”：内置最低承诺期 (Minimum Commitment) 与提前解约金 (ETF) 策略。 
--    - 支持“财务合规拆账”：独立维护公允价值 (Standalone Selling Price)，确保 0 元硬件套餐的合规收入分摊。 
--    - 支持“毛利估算”：内置预估成本字段，帮助销售在报价时实时掌握盈利情况。 
-- ==============================================================================`;

const schemaData = [
  {
    name: 'tax_rates_flat',
    description: '扁平化综合税率表，替代复杂的多层级嵌套',
    fields: [
      { name: 'id', type: 'bigint', comment: '唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'country_code', type: 'char(2)', comment: 'ISO 3166-1 alpha-2 标准国家码', defaultValue: '无' },
      { name: 'state_code', type: 'varchar(10)', comment: '州/省代码', defaultValue: 'null' },
      { name: 'postal_code_pattern', type: 'varchar(20)', comment: '邮编匹配规则', defaultValue: '*' },
      { name: 'product_type', type: 'enum', comment: '适用的产品类型', defaultValue: '无' },
      { name: 'tax_type', type: 'enum', comment: '税种', defaultValue: 'SalesTax' },
      { name: 'combined_tax_rate', type: 'decimal(6,4)', comment: '最终综合税率', defaultValue: '0.0000' },
      { name: 'tax_name', type: 'varchar(50)', comment: '税费显示名称', defaultValue: '无' },
      { name: 'is_tax_inclusive', type: 'boolean', comment: '价格是否已含此税', defaultValue: 'false' },
      { name: 'is_b2b_exempt', type: 'boolean', comment: 'B2B客户是否免税', defaultValue: 'false' },
      { name: 'effective_date', type: 'date', comment: '生效日期', defaultValue: '无' },
      { name: 'end_date', type: 'date', comment: '失效日期', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
    ]
  },
  {
    name: 'product_categories',
    description: '产品分类，支持多层级树状结构',
    fields: [
      { name: 'id', type: 'bigint', comment: '分类唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'parent_id', type: 'bigint', comment: '父分类ID', defaultValue: 'null', ref: 'product_categories.id' },
      { name: 'code', type: 'string', comment: '分类编码', defaultValue: '无' },
      { name: 'name', type: 'string', comment: '分类名称', defaultValue: '无' },
      { name: 'description', type: 'string', comment: '分类描述', defaultValue: 'null' },
      { name: 'translations', type: 'json', comment: '多语言翻译', defaultValue: 'null' },
      { name: 'level', type: 'number', comment: '层级深度', defaultValue: '1' },
      { name: 'path', type: 'string', comment: '层级路径', defaultValue: '无' },
      { name: 'sort_order', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'is_active', type: 'boolean', comment: '是否启用', defaultValue: 'true' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'deleted_at', type: 'timestamp', comment: '删除时间', defaultValue: 'null' },
    ]
  },
  {
    name: 'products',
    description: '产品族 (SPU)，代表一组具有相同基本属性的商品',
    fields: [
      { name: 'id', type: 'bigint', comment: '产品唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'category_id', type: 'bigint', comment: '所属分类ID', defaultValue: '无', ref: 'product_categories.id' },
      { name: 'product_code', type: 'string', comment: '产品编码', defaultValue: '无' },
      { name: 'name', type: 'string', comment: '产品名称', defaultValue: '无' },
      { name: 'product_type', type: 'enum', comment: '产品类型', defaultValue: '无' },
      { name: 'brand', type: 'string', comment: '品牌', defaultValue: 'null' },
      { name: 'description', type: 'string', comment: '产品描述', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'deleted_at', type: 'timestamp', comment: '删除时间', defaultValue: 'null' },
    ]
  },
  {
    name: 'product_skus',
    description: '产品规格 (SKU)，可售卖的最小物理或逻辑单元',
    fields: [
      { name: 'id', type: 'bigint', comment: 'SKU唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'product_id', type: 'bigint', comment: '所属产品族ID', defaultValue: '无', ref: 'products.id' },
      { name: 'sku_code', type: 'string', comment: 'SKU编码', defaultValue: '无' },
      { name: 'name', type: 'string', comment: 'SKU名称', defaultValue: '无' },
      { name: 'billing_model', type: 'enum', comment: '计费模式 (recurring, one_time, usage_based, hybrid)', defaultValue: 'one_time' },
      { name: 'billing_term', type: 'enum', comment: '计费周期', defaultValue: 'none' },
      { name: 'billing_timing', type: 'enum', comment: '结算时机', defaultValue: 'in_advance' },
      { name: 'trial_days', type: 'number', comment: '试用天数', defaultValue: '0' },
      { name: 'uom', type: 'string', comment: '计量单位', defaultValue: 'unit' },
      { name: 'lifecycle_status', type: 'enum', comment: '生命周期状态', defaultValue: 'draft' },
      { name: 'standard_tax_code', type: 'string', comment: '标准税务编码', defaultValue: 'null' },
      { name: 'is_shippable', type: 'boolean', comment: '是否需要物流发货', defaultValue: 'false' },
      { name: 'is_serialized', type: 'boolean', comment: '是否管理序列号(SN)', defaultValue: 'false' },
      { name: 'weight_kg', type: 'number', comment: '重量(kg)', defaultValue: 'null' },
      { name: 'length_cm', type: 'number', comment: '长度(cm)', defaultValue: 'null' },
      { name: 'width_cm', type: 'number', comment: '宽度(cm)', defaultValue: 'null' },
      { name: 'height_cm', type: 'number', comment: '高度(cm)', defaultValue: 'null' },
      { name: 'hs_code', type: 'string', comment: '海关编码', defaultValue: 'null' },
      { name: 'country_of_origin', type: 'string', comment: '原产国', defaultValue: 'null' },
      { name: 'provisioning_handler', type: 'string', comment: '自动开通处理器标识', defaultValue: 'null' },
      { name: 'specifications', type: 'json', comment: '动态规格属性', defaultValue: 'null' },
      { name: 'translations', type: 'json', comment: '多语言翻译', defaultValue: 'null' },
      { name: 'launch_date', type: 'date', comment: '上市日期', defaultValue: 'null' },
      { name: 'eos_date', type: 'date', comment: '停止销售日期', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'deleted_at', type: 'timestamp', comment: '删除时间', defaultValue: 'null' },
    ]
  },
  {
    name: 'product_media',
    description: '产品多媒体资源',
    fields: [
      { name: 'id', type: 'bigint', comment: '媒体资源唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'product_id', type: 'bigint', comment: '关联的产品族ID', defaultValue: 'null', ref: 'products.id' },
      { name: 'sku_id', type: 'bigint', comment: '关联的SKUID', defaultValue: 'null', ref: 'product_skus.id' },
      { name: 'media_type', type: 'enum', comment: '媒体类型', defaultValue: 'image' },
      { name: 'url', type: 'string', comment: '资源URL', defaultValue: '无' },
      { name: 'thumbnail_url', type: 'string', comment: '缩略图URL', defaultValue: 'null' },
      { name: 'is_main', type: 'boolean', comment: '是否为主图', defaultValue: 'false' },
      { name: 'sort_order', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'locale', type: 'string', comment: '适用语言', defaultValue: 'ALL' },
      { name: 'title', type: 'string', comment: '资源标题', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
    ]
  },
  {
    name: 'product_entitlements',
    description: '产品权益，定义购买该SKU后获得的系统功能或配额',
    fields: [
      { name: 'id', type: 'bigint', comment: '权益唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'sku_id', type: 'bigint', comment: '关联的SKUID', defaultValue: '无', ref: 'product_skus.id' },
      { name: 'feature_code', type: 'string', comment: '功能字典编码', defaultValue: '无' },
      { name: 'entitlement_type', type: 'enum', comment: '权益类型', defaultValue: 'boolean' },
      { name: 'quota_value', type: 'bigint', comment: '配额数量', defaultValue: 'null' },
      { name: 'tier_value', type: 'string', comment: '层级标识', defaultValue: 'null' },
      { name: 'status', type: 'enum', comment: '状态', defaultValue: 'active' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'deleted_at', type: 'timestamp', comment: '删除时间', defaultValue: 'null' },
    ]
  },
  {
    name: 'bundle_groups',
    description: '套餐选项组，用于组织套餐内的组件',
    fields: [
      { name: 'id', type: 'bigint', comment: '分组唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'bundle_sku_id', type: 'bigint', comment: '所属套餐SKUID', defaultValue: '无', ref: 'product_skus.id' },
      { name: 'name', type: 'string', comment: '分组名称', defaultValue: '无' },
      { name: 'description', type: 'string', comment: '分组描述', defaultValue: 'null' },
      { name: 'sort_order', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'select_n', type: 'number', comment: '必须选取的固定数量 (N)，0 表示该组整体可选配', defaultValue: '1' },
      { name: 'allow_multiple_qty_per_item', type: 'boolean', comment: '单个选项是否允许选择多个数量', defaultValue: 'false' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
    ]
  },
  {
    name: 'bundle_options',
    description: '套餐选项，定义套餐内可供选择的具体组件SKU',
    fields: [
      { name: 'id', type: 'bigint', comment: '选项唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'bundle_sku_id', type: 'bigint', comment: '所属套餐SKUID', defaultValue: '无', ref: 'product_skus.id' },
      { name: 'group_id', type: 'bigint', comment: '所属分组ID', defaultValue: '无', ref: 'bundle_groups.id' },
      { name: 'component_sku_id', type: 'bigint', comment: '组件SKUID', defaultValue: '无', ref: 'product_skus.id' },
      { name: 'is_default', type: 'boolean', comment: '是否默认选中', defaultValue: 'false' },
      { name: 'sort_order', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'pricing_type', type: 'enum', comment: '在套餐内的定价策略', defaultValue: 'included' },
      { name: 'pricing_value', type: 'number', comment: '定价调整值', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
    ]
  },
  {
    name: 'product_rules',
    description: '产品规则，用于CPQ配置时的约束和推荐',
    fields: [
      { name: 'id', type: 'bigint', comment: '规则唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'source_sku_id', type: 'bigint', comment: '触发规则的源SKUID', defaultValue: '无', ref: 'product_skus.id' },
      { name: 'target_sku_id', type: 'bigint', comment: '受规则影响的目标SKUID', defaultValue: '无', ref: 'product_skus.id' },
      { name: 'rule_type', type: 'enum', comment: '规则类型', defaultValue: '无' },
      { name: 'message', type: 'string', comment: '违反规则时的提示信息', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
    ]
  },
  {
    name: 'price_books',
    description: '价格手册，用于管理不同渠道、区域或客户群的定价',
    fields: [
      { name: 'id', type: 'bigint', comment: '价格手册唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'code', type: 'string', comment: '手册编码', defaultValue: '无' },
      { name: 'name', type: 'string', comment: '手册名称', defaultValue: '无' },
      { name: 'currency', type: 'string', comment: '结算货币', defaultValue: 'USD' },
      { name: 'applicable_regions', type: 'json', comment: '适用的税务区域编码列表', defaultValue: 'null' },
      { name: 'translations', type: 'json', comment: '多语言翻译', defaultValue: 'null' },
      { name: 'price_display_precision', type: 'number', comment: '价格显示精度', defaultValue: '2' },
      { name: 'type', type: 'enum', comment: '手册类型', defaultValue: 'standard' },
      { name: 'partner_tier', type: 'string', comment: '合作伙伴层级 (Gold, Silver, Bronze)', defaultValue: 'null' },
      { name: 'is_active', type: 'boolean', comment: '是否启用', defaultValue: 'false' },
      { name: 'valid_from', type: 'datetime', comment: '生效日期', defaultValue: '无' },
      { name: 'valid_to', type: 'datetime', comment: '失效日期', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'deleted_at', type: 'timestamp', comment: '删除时间', defaultValue: 'null' },
    ]
  },
  {
    name: 'price_book_entries',
    description: '价格手册条目，定义特定SKU在特定价格手册中的价格',
    fields: [
      { name: 'id', type: 'bigint', comment: '条目唯一标识', defaultValue: 'AUTO_INCREMENT' },
      { name: 'price_book_id', type: 'bigint', comment: '所属价格手册ID', defaultValue: '无', ref: 'price_books.id' },
      { name: 'sku_id', type: 'bigint', comment: '关联的SKUID', defaultValue: '无', ref: 'product_skus.id' },
      { name: 'pricing_strategy', type: 'enum', comment: '定价策略', defaultValue: 'flat_fee' },
      { name: 'parent_sku_id', type: 'bigint', comment: '父级 SKU ID (用于套餐组件)', defaultValue: 'null', ref: 'product_skus.id' },
      { name: 'list_price', type: 'number', comment: '目录价格', defaultValue: '0' },
      { name: 'standalone_selling_price', type: 'number', comment: '独立售价', defaultValue: 'null' },
      { name: 'billing_model_override', type: 'enum', comment: '计费模式覆盖', defaultValue: 'null' },
      { name: 'min_commitment_months', type: 'number', comment: '最低承诺期限 (月)', defaultValue: 'null' },
      { name: 'early_termination_policy', type: 'enum', comment: '提前终止策略', defaultValue: 'none' },
      { name: 'etf_amount_or_percent', type: 'number', comment: '提前终止费金额或比例', defaultValue: 'null' },
      { name: 'bundle_adjustment_amount', type: 'number', comment: '套餐调整金额', defaultValue: 'null' },
      { name: 'estimated_unit_cost', type: 'number', comment: '预估单位成本', defaultValue: 'null' },
      { name: 'min_price', type: 'number', comment: '允许的最低售价', defaultValue: 'null' },
      { name: 'max_discount_rate', type: 'number', comment: '最大折扣率', defaultValue: 'null' },
      { name: 'msrp', type: 'number', comment: '建议零售价', defaultValue: 'null' },
      { name: 'tier_config', type: 'json', comment: '阶梯/批量定价配置', defaultValue: 'null' },
      { name: 'valid_from', type: 'datetime', comment: '生效日期', defaultValue: '无' },
      { name: 'valid_to', type: 'datetime', comment: '失效日期', defaultValue: 'null' },
      { name: 'created_by', type: 'string', comment: '创建人', defaultValue: 'null' },
      { name: 'updated_by', type: 'string', comment: '修改人', defaultValue: 'null' },
      { name: 'created_at', type: 'timestamp', comment: '创建时间', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'timestamp', comment: '更新时间', defaultValue: 'CURRENT_TIMESTAMP' },
    ]
  }
];

export function DataModels() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [viewMode, setViewMode] = useState<'table' | 'script'>('script');

  const tabs = useMemo(() => [
    { id: 'overview', label: t('dataModels.overview'), icon: Info },
    ...schemaData.map(s => ({ id: s.name, label: s.name, icon: TableIcon }))
  ], [t]);

  const activeModel = useMemo(() => schemaData.find(s => s.name === activeTab), [activeTab]);

  const generateSql = (model: typeof schemaData[0]) => {
    // Capture preceding comments and the CREATE TABLE block
    const regex = new RegExp(`((?:--.*\\n)*CREATE TABLE\\s+\`?${model.name}\`?[\\s\\S]*?;)`, 'i');
    const match = schemaSql.match(regex);
    return match ? match[1].trim() : `-- SQL script for ${model.name} not found in schema.sql`;
  };

  const currentSql = useMemo(() => {
    if (activeTab === 'overview') return OVERVIEW_SQL;
    if (activeModel) return generateSql(activeModel);
    return '';
  }, [activeTab, activeModel]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: add a toast notification here if available
  };

  const highlightSql = (sql: string) => {
    return sql
      // Keywords
      .replace(/\b(CREATE TABLE|PRIMARY KEY|UNIQUE KEY|KEY|ENGINE|DEFAULT|CHARSET|COLLATE|COMMENT|NOT NULL|AUTO_INCREMENT|UNSIGNED|ON UPDATE|NULL)\b/g, '<span style="color: #569CD6; font-weight: bold;">$1</span>')
      // Types
      .replace(/\b(BIGINT|VARCHAR|JSON|TINYINT|INT|BOOLEAN|TIMESTAMP|CURRENT_TIMESTAMP|ENUM|DECIMAL|DATE|DATETIME|TEXT)\b/g, '<span style="color: #4EC9B0;">$1</span>')
      // Identifiers (backticks)
      .replace(/(`[^`]+`)/g, '<span style="color: #9CDCFE;">$1</span>')
      // Strings
      .replace(/('[^']*')/g, '<span style="color: #CE9178;">$1</span>')
      // Comments
      .replace(/(--.*)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          {t('dataModels.title')}
        </h1>
        <p className="text-slate-500 mt-1">{t('dataModels.subtitle')}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'overview') {
                setViewMode('script');
              }
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2
              ${activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="min-h-[600px] flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          {(activeTab === 'overview' || activeModel) && (
            <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    {activeTab === 'overview' ? (
                      <Info className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <TableIcon className="w-5 h-5 text-indigo-500" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold">
                        {activeTab === 'overview' ? t('dataModels.overview') : activeModel?.name}
                      </h2>
                      {(activeTab === 'overview' || activeModel?.description) && (
                         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                           {activeTab === 'overview' 
                             ? '餐饮 SaaS 全球产品与定价中心数据模型概览' 
                             : t(`dataModels.descriptions.${activeModel?.name}`)}
                         </p>
                      )}
                    </div>
                  </div>
                  
                  {activeTab !== 'overview' && (
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          viewMode === 'table'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {t('dataModels.tableView')}
                      </button>
                      <button
                        onClick={() => setViewMode('script')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          viewMode === 'script'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {t('dataModels.scriptView')}
                      </button>
                    </div>
                  )}
                </div>

                {viewMode === 'table' && activeModel ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                          <th className="py-3 px-4 font-medium">{t('dataModels.fieldName')}</th>
                          <th className="py-3 px-4 font-medium">{t('dataModels.fieldType')}</th>
                          <th className="py-3 px-4 font-medium">{t('dataModels.defaultValue')}</th>
                          <th className="py-3 px-4 font-medium">{t('dataModels.comment')}</th>
                          <th className="py-3 px-4 font-medium">{t('dataModels.externalDependency')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {activeModel.fields.map(field => (
                          <tr key={field.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                              {field.name}
                              {(field.name.endsWith('_id') || field.name.endsWith('Id')) && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                  FK
                                </span>
                              )}
                              {field.name === 'id' && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                  PK
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                              {field.type}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                              {field.defaultValue || '-'}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                              {field.comment || '-'}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                              {field.ref ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  {field.ref}
                                </span>
                              ) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d] border-b border-[#3e3e42]">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-xs font-mono text-[#cccccc] ml-3">
                          {activeTab === 'overview' ? 'overview' : activeModel?.name}.sql
                        </span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(currentSql)}
                        className="text-xs font-medium text-[#cccccc] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-[#3e3e42]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        {t('dataModels.copy')}
                      </button>
                    </div>
                    <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-[#1e1e1e]">
                      <pre className="font-mono text-[13px] leading-relaxed text-[#d4d4d4] flex">
                        <div className="flex flex-col text-right pr-4 select-none text-[#858585] border-r border-[#404040] mr-4 min-w-[2.5rem]">
                          {currentSql.split('\n').map((_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                        </div>
                        <code dangerouslySetInnerHTML={{ __html: highlightSql(currentSql) }} />
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
}
