import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { Database, Table as TableIcon, Network } from 'lucide-react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const schemaData = [
  {
    name: 'Category',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'parentId', type: 'number | null' },
      { name: 'code', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string?' },
      { name: 'translations', type: 'Record<string, { name: string; description: string }>?' },
      { name: 'level', type: 'number' },
      { name: 'path', type: 'string' },
      { name: 'sortOrder', type: 'number' },
      { name: 'isActive', type: 'boolean' },
    ]
  },
  {
    name: 'TaxRegion',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'parentId', type: 'number | null' },
      { name: 'regionCode', type: 'string' },
      { name: 'countryCode', type: 'string' },
      { name: 'stateCode', type: 'string?' },
      { name: 'name', type: 'string' },
      { name: 'level', type: "'country' | 'state' | 'county' | 'city' | 'special'" },
      { name: 'path', type: 'string' },
    ]
  },
  {
    name: 'TaxRateMapping',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'taxRegionId', type: 'number' },
      { name: 'productType', type: "'software' | 'hardware' | 'service' | 'consumable' | 'bundle'" },
      { name: 'taxType', type: "'VAT' | 'GST' | 'SalesTax' | 'PST' | 'HST' | 'QST'" },
      { name: 'taxRate', type: 'number' },
      { name: 'taxName', type: 'string' },
      { name: 'isTaxInclusive', type: 'boolean' },
      { name: 'isB2bExempt', type: 'boolean' },
      { name: 'effectiveDate', type: 'string' },
      { name: 'endDate', type: 'string?' },
    ]
  },
  {
    name: 'Product',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'categoryId', type: 'number' },
      { name: 'productCode', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'productType', type: "'software' | 'hardware' | 'service' | 'consumable' | 'bundle'" },
      { name: 'brand', type: 'string?' },
      { name: 'description', type: 'string?' },
    ]
  },
  {
    name: 'ProductSku',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'productId', type: 'number' },
      { name: 'skuCode', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'billingModel', type: "'recurring' | 'one_time' | 'usage_based'" },
      { name: 'billingTerm', type: "'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'biennial' | 'triennial' | 'custom' | 'none'" },
      { name: 'billingTiming', type: "'in_advance' | 'in_arrears'" },
      { name: 'trialDays', type: 'number' },
      { name: 'uom', type: 'string' },
      { name: 'lifecycleStatus', type: "'draft' | 'active' | 'eos' | 'eol' | 'retired'" },
      { name: 'standardTaxCode', type: 'string?' },
      { name: 'isShippable', type: 'boolean' },
      { name: 'isSerialized', type: 'boolean' },
      { name: 'weightKg', type: 'number?' },
      { name: 'lengthCm', type: 'number?' },
      { name: 'widthCm', type: 'number?' },
      { name: 'heightCm', type: 'number?' },
      { name: 'hsCode', type: 'string?' },
      { name: 'countryOfOrigin', type: 'string?' },
      { name: 'provisioningHandler', type: 'string?' },
      { name: 'specifications', type: 'any?' },
      { name: 'translations', type: 'any?' },
      { name: 'launchDate', type: 'string?' },
      { name: 'eosDate', type: 'string?' },
    ]
  },
  {
    name: 'ProductMedia',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'productId', type: 'number?' },
      { name: 'skuId', type: 'number?' },
      { name: 'mediaType', type: "'image' | 'video' | 'document' | '3d_model'" },
      { name: 'url', type: 'string' },
      { name: 'thumbnailUrl', type: 'string?' },
      { name: 'isMain', type: 'boolean' },
      { name: 'sortOrder', type: 'number' },
      { name: 'locale', type: 'string' },
      { name: 'title', type: 'string?' },
    ]
  },
  {
    name: 'ProductEntitlement',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'skuId', type: 'number' },
      { name: 'featureCode', type: 'string' },
      { name: 'entitlementType', type: "'boolean' | 'quota' | 'tier'" },
      { name: 'quotaValue', type: 'number?' },
      { name: 'tierValue', type: 'string?' },
      { name: 'status', type: "'active' | 'inactive'" },
    ]
  },
  {
    name: 'BundleGroup',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'bundleSkuId', type: 'number' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string?' },
      { name: 'sortOrder', type: 'number' },
      { name: 'minSelections', type: 'number' },
      { name: 'maxSelections', type: 'number' },
      { name: 'isMutuallyExclusive', type: 'boolean' },
      { name: 'allowMultipleQtyPerItem', type: 'boolean' },
    ]
  },
  {
    name: 'BundleOption',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'bundleSkuId', type: 'number' },
      { name: 'groupId', type: 'number' },
      { name: 'componentSkuId', type: 'number' },
      { name: 'isDefault', type: 'boolean' },
      { name: 'sortOrder', type: 'number' },
      { name: 'pricingType', type: "'included' | 'fixed_override' | 'price_adjustment'" },
      { name: 'pricingValue', type: 'number?' },
    ]
  },
  {
    name: 'ProductRule',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'sourceSkuId', type: 'number' },
      { name: 'targetSkuId', type: 'number' },
      { name: 'ruleType', type: "'requires' | 'excludes' | 'recommends' | 'compatible_with'" },
      { name: 'message', type: 'string?' },
    ]
  },
  {
    name: 'PriceBook',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'code', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'currency', type: 'string' },
      { name: 'applicableRegions', type: 'string[]?' },
      { name: 'translations', type: 'any?' },
      { name: 'priceDisplayPrecision', type: 'number' },
      { name: 'type', type: "'standard' | 'channel' | 'promotional' | 'custom'" },
      { name: 'isActive', type: 'boolean' },
      { name: 'validFrom', type: 'string' },
      { name: 'validTo', type: 'string?' },
    ]
  },
  {
    name: 'PriceBookEntry',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'priceBookId', type: 'number' },
      { name: 'skuId', type: 'number' },
      { name: 'pricingStrategy', type: "'flat_fee' | 'per_unit' | 'tiered' | 'volume' | 'percentage'" },
      { name: 'listPrice', type: 'number' },
      { name: 'minPrice', type: 'number?' },
      { name: 'maxDiscountRate', type: 'number?' },
      { name: 'msrp', type: 'number?' },
      { name: 'tierConfig', type: 'any?' },
      { name: 'validFrom', type: 'string' },
      { name: 'validTo', type: 'string?' },
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
  const [activeTab, setActiveTab] = useState<string>('ER Diagram');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const tabs = ['ER Diagram', ...schemaData.map(s => s.name)];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Data Models
        </h1>
        <p className="text-slate-500 mt-1">Explore the core data structures and their relationships.</p>
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
            {tab === 'ER Diagram' ? <Network className="w-4 h-4 inline-block mr-2" /> : <TableIcon className="w-4 h-4 inline-block mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      <Card className="min-h-[600px] flex flex-col">
        {activeTab === 'ER Diagram' ? (
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
                  <h2 className="text-xl font-semibold">{model.name}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="py-3 px-4 font-medium">Field Name</th>
                        <th className="py-3 px-4 font-medium">Type</th>
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
