import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { Database, Table as TableIcon, Network } from 'lucide-react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const schemaData = [
  {
    name: 'Category',
    description: '产品分类，支持多层级树状结构',
    fields: [
      { name: 'id', type: 'number', comment: '分类唯一标识', defaultValue: '自增' },
      { name: 'parentId', type: 'number | null', comment: '父分类ID，为null时表示顶级分类', defaultValue: 'null', ref: 'Category.id' },
      { name: 'code', type: 'string', comment: '分类编码，用于业务逻辑或外部系统对接', defaultValue: '无' },
      { name: 'name', type: 'string', comment: '分类名称', defaultValue: '无' },
      { name: 'description', type: 'string?', comment: '分类描述', defaultValue: 'null' },
      { name: 'translations', type: 'Record<string, { name: string; description: string }>?', comment: '多语言翻译', defaultValue: 'null' },
      { name: 'level', type: 'number', comment: '层级深度，从1开始', defaultValue: '1' },
      { name: 'path', type: 'string', comment: '层级路径，如 /1/2/3/，用于快速查询子树', defaultValue: '无' },
      { name: 'sortOrder', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'isActive', type: 'boolean', comment: '是否启用', defaultValue: 'true' },
    ]
  },
  {
    name: 'TaxRegion',
    description: '税务区域定义',
    fields: [
      { name: 'id', type: 'number', comment: '税务区域唯一标识', defaultValue: '自增' },
      { name: 'parentId', type: 'number | null', comment: '父区域ID', defaultValue: 'null', ref: 'TaxRegion.id' },
      { name: 'regionCode', type: 'string', comment: '区域编码', defaultValue: '无' },
      { name: 'countryCode', type: 'string', comment: '国家ISO编码', defaultValue: '无' },
      { name: 'stateCode', type: 'string?', comment: '州/省编码', defaultValue: 'null' },
      { name: 'name', type: 'string', comment: '区域名称', defaultValue: '无' },
      { name: 'level', type: "'country' | 'state' | 'county' | 'city' | 'special'", comment: '区域级别', defaultValue: 'country' },
      { name: 'path', type: 'string', comment: '层级路径', defaultValue: '无' },
    ]
  },
  {
    name: 'TaxRateMapping',
    description: '税率映射规则',
    fields: [
      { name: 'id', type: 'number', comment: '规则唯一标识', defaultValue: '自增' },
      { name: 'taxRegionId', type: 'number', comment: '关联的税务区域', defaultValue: '无', ref: 'TaxRegion.id' },
      { name: 'productType', type: "'software' | 'hardware' | 'service' | 'consumable' | 'bundle'", comment: '适用的产品类型', defaultValue: '无' },
      { name: 'taxType', type: "'VAT' | 'GST' | 'SalesTax' | 'PST' | 'HST' | 'QST'", comment: '税种', defaultValue: '无' },
      { name: 'taxRate', type: 'number', comment: '税率百分比，如 0.05 表示 5%', defaultValue: '0' },
      { name: 'taxName', type: 'string', comment: '税费显示名称', defaultValue: '无' },
      { name: 'isTaxInclusive', type: 'boolean', comment: '价格是否已含此税', defaultValue: 'false' },
      { name: 'isB2bExempt', type: 'boolean', comment: 'B2B客户是否免税', defaultValue: 'false' },
      { name: 'effectiveDate', type: 'string', comment: '生效日期 (ISO 8601)', defaultValue: '当前时间' },
      { name: 'endDate', type: 'string?', comment: '失效日期 (ISO 8601)', defaultValue: 'null' },
    ]
  },
  {
    name: 'Product',
    description: '产品族 (SPU)，代表一组具有相同基本属性的商品',
    fields: [
      { name: 'id', type: 'number', comment: '产品唯一标识', defaultValue: '自增' },
      { name: 'categoryId', type: 'number', comment: '所属分类ID', defaultValue: '无', ref: 'Category.id' },
      { name: 'productCode', type: 'string', comment: '产品编码', defaultValue: '无' },
      { name: 'name', type: 'string', comment: '产品名称', defaultValue: '无' },
      { name: 'productType', type: "'software' | 'hardware' | 'service' | 'consumable' | 'bundle'", comment: '产品类型', defaultValue: '无' },
      { name: 'brand', type: 'string?', comment: '品牌', defaultValue: 'null' },
      { name: 'description', type: 'string?', comment: '产品描述', defaultValue: 'null' },
    ]
  },
  {
    name: 'ProductSku',
    description: '产品规格 (SKU)，可售卖的最小物理或逻辑单元',
    fields: [
      { name: 'id', type: 'number', comment: 'SKU唯一标识', defaultValue: '自增' },
      { name: 'productId', type: 'number', comment: '所属产品族ID', defaultValue: '无', ref: 'Product.id' },
      { name: 'skuCode', type: 'string', comment: 'SKU编码', defaultValue: '无' },
      { name: 'name', type: 'string', comment: 'SKU名称', defaultValue: '无' },
      { name: 'billingModel', type: "'recurring' | 'one_time' | 'usage_based'", comment: '计费模式', defaultValue: 'one_time' },
      { name: 'billingTerm', type: "'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'biennial' | 'triennial' | 'custom' | 'none'", comment: '计费周期', defaultValue: 'none' },
      { name: 'billingTiming', type: "'in_advance' | 'in_arrears'", comment: '结算时机：预付费/后付费', defaultValue: 'in_advance' },
      { name: 'trialDays', type: 'number', comment: '试用天数', defaultValue: '0' },
      { name: 'uom', type: 'string', comment: '计量单位 (Unit of Measure)', defaultValue: 'Unit' },
      { name: 'lifecycleStatus', type: "'draft' | 'active' | 'eos' | 'eol' | 'retired'", comment: '生命周期状态', defaultValue: 'draft' },
      { name: 'standardTaxCode', type: 'string?', comment: '标准税务编码，用于覆盖默认税率', defaultValue: 'null' },
      { name: 'isShippable', type: 'boolean', comment: '是否需要物流发货', defaultValue: 'false' },
      { name: 'isSerialized', type: 'boolean', comment: '是否管理序列号(SN)', defaultValue: 'false' },
      { name: 'weightKg', type: 'number?', comment: '重量(千克)', defaultValue: 'null' },
      { name: 'lengthCm', type: 'number?', comment: '长度(厘米)', defaultValue: 'null' },
      { name: 'widthCm', type: 'number?', comment: '宽度(厘米)', defaultValue: 'null' },
      { name: 'heightCm', type: 'number?', comment: '高度(厘米)', defaultValue: 'null' },
      { name: 'hsCode', type: 'string?', comment: '海关编码', defaultValue: 'null' },
      { name: 'countryOfOrigin', type: 'string?', comment: '原产国', defaultValue: 'null' },
      { name: 'provisioningHandler', type: 'string?', comment: '自动开通处理器标识', defaultValue: 'null' },
      { name: 'specifications', type: 'any?', comment: '动态规格属性 (JSON)', defaultValue: 'null' },
      { name: 'translations', type: 'any?', comment: '多语言翻译', defaultValue: 'null' },
      { name: 'launchDate', type: 'string?', comment: '上市日期', defaultValue: 'null' },
      { name: 'eosDate', type: 'string?', comment: '停止销售日期 (End of Sale)', defaultValue: 'null' },
    ]
  },
  {
    name: 'ProductMedia',
    description: '产品多媒体资源',
    fields: [
      { name: 'id', type: 'number', comment: '媒体资源唯一标识', defaultValue: '自增' },
      { name: 'productId', type: 'number?', comment: '关联的产品族ID', defaultValue: 'null', ref: 'Product.id' },
      { name: 'skuId', type: 'number?', comment: '关联的SKUID', defaultValue: 'null', ref: 'ProductSku.id' },
      { name: 'mediaType', type: "'image' | 'video' | 'document' | '3d_model'", comment: '媒体类型', defaultValue: 'image' },
      { name: 'url', type: 'string', comment: '资源URL', defaultValue: '无' },
      { name: 'thumbnailUrl', type: 'string?', comment: '缩略图URL', defaultValue: 'null' },
      { name: 'isMain', type: 'boolean', comment: '是否为主图', defaultValue: 'false' },
      { name: 'sortOrder', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'locale', type: 'string', comment: '适用语言', defaultValue: 'en' },
      { name: 'title', type: 'string?', comment: '资源标题/Alt文本', defaultValue: 'null' },
    ]
  },
  {
    name: 'ProductEntitlement',
    description: '产品权益，定义购买该SKU后获得的系统功能或配额',
    fields: [
      { name: 'id', type: 'number', comment: '权益唯一标识', defaultValue: '自增' },
      { name: 'skuId', type: 'number', comment: '关联的SKUID', defaultValue: '无', ref: 'ProductSku.id' },
      { name: 'featureCode', type: 'string', comment: '功能字典编码', defaultValue: '无' },
      { name: 'entitlementType', type: "'boolean' | 'quota' | 'tier'", comment: '权益类型：开关/配额/层级', defaultValue: 'boolean' },
      { name: 'quotaValue', type: 'number?', comment: '配额数量', defaultValue: 'null' },
      { name: 'tierValue', type: 'string?', comment: '层级标识', defaultValue: 'null' },
      { name: 'status', type: "'active' | 'inactive'", comment: '状态', defaultValue: 'active' },
    ]
  },
  {
    name: 'BundleGroup',
    description: '套餐选项组，用于组织套餐内的组件',
    fields: [
      { name: 'id', type: 'number', comment: '分组唯一标识', defaultValue: '自增' },
      { name: 'bundleSkuId', type: 'number', comment: '所属套餐SKUID', defaultValue: '无', ref: 'ProductSku.id' },
      { name: 'name', type: 'string', comment: '分组名称', defaultValue: '无' },
      { name: 'description', type: 'string?', comment: '分组描述', defaultValue: 'null' },
      { name: 'sortOrder', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'minSelections', type: 'number', comment: '最少选择数量', defaultValue: '0' },
      { name: 'maxSelections', type: 'number', comment: '最多选择数量', defaultValue: '1' },
      { name: 'isMutuallyExclusive', type: 'boolean', comment: '组内选项是否互斥', defaultValue: 'false' },
      { name: 'allowMultipleQtyPerItem', type: 'boolean', comment: '单个选项是否允许选择多个数量', defaultValue: 'false' },
    ]
  },
  {
    name: 'BundleOption',
    description: '套餐选项，定义套餐内可供选择的具体组件SKU',
    fields: [
      { name: 'id', type: 'number', comment: '选项唯一标识', defaultValue: '自增' },
      { name: 'bundleSkuId', type: 'number', comment: '所属套餐SKUID', defaultValue: '无', ref: 'ProductSku.id' },
      { name: 'groupId', type: 'number', comment: '所属分组ID', defaultValue: '无', ref: 'BundleGroup.id' },
      { name: 'componentSkuId', type: 'number', comment: '组件SKUID', defaultValue: '无', ref: 'ProductSku.id' },
      { name: 'isDefault', type: 'boolean', comment: '是否默认选中', defaultValue: 'false' },
      { name: 'sortOrder', type: 'number', comment: '排序权重', defaultValue: '0' },
      { name: 'pricingType', type: "'included' | 'fixed_override' | 'price_adjustment'", comment: '在套餐内的定价策略', defaultValue: 'included' },
      { name: 'pricingValue', type: 'number?', comment: '定价调整值', defaultValue: 'null' },
    ]
  },
  {
    name: 'ProductRule',
    description: '产品规则，用于CPQ配置时的约束和推荐',
    fields: [
      { name: 'id', type: 'number', comment: '规则唯一标识', defaultValue: '自增' },
      { name: 'sourceSkuId', type: 'number', comment: '触发规则的源SKUID', defaultValue: '无', ref: 'ProductSku.id' },
      { name: 'targetSkuId', type: 'number', comment: '受规则影响的目标SKUID', defaultValue: '无', ref: 'ProductSku.id' },
      { name: 'ruleType', type: "'requires' | 'excludes' | 'recommends' | 'compatible_with'", comment: '规则类型：依赖/互斥/推荐/兼容', defaultValue: '无' },
      { name: 'message', type: 'string?', comment: '违反规则时的提示信息', defaultValue: 'null' },
    ]
  },
  {
    name: 'PriceBook',
    description: '价格手册，用于管理不同渠道、区域或客户群的定价',
    fields: [
      { name: 'id', type: 'number', comment: '价格手册唯一标识', defaultValue: '自增' },
      { name: 'code', type: 'string', comment: '手册编码', defaultValue: '无' },
      { name: 'name', type: 'string', comment: '手册名称', defaultValue: '无' },
      { name: 'currency', type: 'string', comment: '结算货币 (ISO 4217)', defaultValue: 'USD' },
      { name: 'applicableRegions', type: 'string[]?', comment: '适用的税务区域编码列表', defaultValue: 'null' },
      { name: 'translations', type: 'any?', comment: '多语言翻译', defaultValue: 'null' },
      { name: 'priceDisplayPrecision', type: 'number', comment: '价格显示精度(小数位数)', defaultValue: '2' },
      { name: 'type', type: "'standard' | 'channel' | 'promotional' | 'custom'", comment: '手册类型', defaultValue: 'standard' },
      { name: 'isActive', type: 'boolean', comment: '是否启用', defaultValue: 'true' },
      { name: 'validFrom', type: 'string', comment: '生效日期 (ISO 8601)', defaultValue: '当前时间' },
      { name: 'validTo', type: 'string?', comment: '失效日期 (ISO 8601)', defaultValue: 'null' },
    ]
  },
  {
    name: 'PriceBookEntry',
    description: '价格手册条目，定义特定SKU在特定价格手册中的价格',
    fields: [
      { name: 'id', type: 'number', comment: '条目唯一标识', defaultValue: '自增' },
      { name: 'priceBookId', type: 'number', comment: '所属价格手册ID', defaultValue: '无', ref: 'PriceBook.id' },
      { name: 'skuId', type: 'number', comment: '关联的SKUID', defaultValue: '无', ref: 'ProductSku.id' },
      { name: 'pricingStrategy', type: "'flat_fee' | 'per_unit' | 'tiered' | 'volume' | 'percentage'", comment: '定价策略', defaultValue: 'flat_fee' },
      { name: 'listPrice', type: 'number', comment: '目录价格/基础价格', defaultValue: '0' },
      { name: 'minPrice', type: 'number?', comment: '允许的最低售价(底价)', defaultValue: 'null' },
      { name: 'maxDiscountRate', type: 'number?', comment: '最大折扣率', defaultValue: 'null' },
      { name: 'msrp', type: 'number?', comment: '建议零售价', defaultValue: 'null' },
      { name: 'tierConfig', type: 'any?', comment: '阶梯/批量定价配置 (JSON)', defaultValue: 'null' },
      { name: 'validFrom', type: 'string', comment: '生效日期 (ISO 8601)', defaultValue: '当前时间' },
      { name: 'validTo', type: 'string?', comment: '失效日期 (ISO 8601)', defaultValue: 'null' },
    ]
  }
];

const initialNodes = [
  { id: 'Category', position: { x: 250, y: 0 }, data: { label: 'Category' }, style: { width: 150 } },
  { id: 'Product', position: { x: 250, y: 100 }, data: { label: 'Product' }, style: { width: 150 } },
  { id: 'ProductSku', position: { x: 250, y: 200 }, data: { label: 'ProductSku' }, style: { width: 150 } },
  { id: 'ProductMedia', position: { x: 50, y: 150 }, data: { label: 'ProductMedia' }, style: { width: 150 } },
  { id: 'ProductEntitlement', position: { x: 50, y: 250 }, data: { label: 'ProductEntitlement' }, style: { width: 150 } },
  { id: 'ProductRule', position: { x: 50, y: 350 }, data: { label: 'ProductRule' }, style: { width: 150 } },
  { id: 'BundleGroup', position: { x: 450, y: 200 }, data: { label: 'BundleGroup' }, style: { width: 150 } },
  { id: 'BundleOption', position: { x: 450, y: 300 }, data: { label: 'BundleOption' }, style: { width: 150 } },
  { id: 'PriceBook', position: { x: 450, y: 400 }, data: { label: 'PriceBook' }, style: { width: 150 } },
  { id: 'PriceBookEntry', position: { x: 250, y: 400 }, data: { label: 'PriceBookEntry' }, style: { width: 150 } },
  { id: 'TaxRegion', position: { x: 650, y: 0 }, data: { label: 'TaxRegion' }, style: { width: 150 } },
  { id: 'TaxRateMapping', position: { x: 650, y: 100 }, data: { label: 'TaxRateMapping' }, style: { width: 150 } },
];

const initialEdges = [
  { id: 'e-cat-parent', source: 'Category', target: 'Category', label: 'parentId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-prod-cat', source: 'Product', target: 'Category', label: 'categoryId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-sku-prod', source: 'ProductSku', target: 'Product', label: 'productId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-media-prod', source: 'ProductMedia', target: 'Product', label: 'productId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-media-sku', source: 'ProductMedia', target: 'ProductSku', label: 'skuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-ent-sku', source: 'ProductEntitlement', target: 'ProductSku', label: 'skuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-rule-source', source: 'ProductRule', target: 'ProductSku', label: 'sourceSkuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-rule-target', source: 'ProductRule', target: 'ProductSku', label: 'targetSkuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-bg-sku', source: 'BundleGroup', target: 'ProductSku', label: 'bundleSkuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-bo-sku', source: 'BundleOption', target: 'ProductSku', label: 'bundleSkuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-bo-bg', source: 'BundleOption', target: 'BundleGroup', label: 'groupId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-bo-comp', source: 'BundleOption', target: 'ProductSku', label: 'componentSkuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-pbe-pb', source: 'PriceBookEntry', target: 'PriceBook', label: 'priceBookId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-pbe-sku', source: 'PriceBookEntry', target: 'ProductSku', label: 'skuId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-tax-region', source: 'TaxRateMapping', target: 'TaxRegion', label: 'taxRegionId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-tax-parent', source: 'TaxRegion', target: 'TaxRegion', label: 'parentId', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];

export function DataModels() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(t('dataModels.erDiagram'));
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const tabs = [t('dataModels.erDiagram'), ...schemaData.map(s => s.name)];

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
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}
            `}
          >
            {tab === t('dataModels.erDiagram') ? <Network className="w-4 h-4 inline-block mr-2" /> : <TableIcon className="w-4 h-4 inline-block mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      <Card className="min-h-[600px] flex flex-col">
        {activeTab === t('dataModels.erDiagram') ? (
          <div className="flex-1 w-full h-[600px] bg-slate-50/50 dark:bg-slate-900/50 rounded-xl overflow-hidden">
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#ccc" gap={16} />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        ) : (
          <div className="p-6">
            {schemaData.filter(s => s.name === activeTab).map(model => (
              <div key={model.name} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <TableIcon className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h2 className="text-xl font-semibold">{model.name}</h2>
                    {model.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{model.description}</p>
                    )}
                  </div>
                </div>
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
                      {model.fields.map(field => (
                        <tr key={field.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                            {field.name}
                            {field.name.endsWith('Id') && (
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
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
