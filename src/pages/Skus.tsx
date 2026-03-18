import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockSkus, mockProducts } from '../data/mock';
import { Plus, Search, Filter } from 'lucide-react';

export function Skus() {
  const { t } = useTranslation();

  const getProductName = (productId: number) => {
    return mockProducts.find(p => p.id === productId)?.name || 'Unknown';
  };

  const getLifecycleBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'draft': return <Badge variant="warning">Draft</Badge>;
      case 'eos': return <Badge variant="error">EOS</Badge>;
      case 'eol': return <Badge variant="error">EOL</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getBillingBadge = (model: string) => {
    switch (model) {
      case 'recurring': return <Badge variant="default" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">{t('sku.recurring')}</Badge>;
      case 'one_time': return <Badge variant="success">{t('sku.one_time')}</Badge>;
      case 'usage_based': return <Badge variant="warning">{t('sku.usage_based')}</Badge>;
      default: return <Badge>{model}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search SKUs..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New SKU
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('sku.code')}</Th>
              <Th>{t('sku.name')}</Th>
              <Th>{t('sku.parentProduct')}</Th>
              <Th>{t('sku.billingModel')}</Th>
              <Th>{t('sku.billingTerm')}</Th>
              <Th>{t('sku.uom')}</Th>
              <Th>{t('sku.lifecycle')}</Th>
              <Th className="text-right">{t('sku.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockSkus.map((sku) => (
              <Tr key={sku.id}>
                <Td className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{sku.skuCode}</Td>
                <Td className="font-medium">{sku.name}</Td>
                <Td className="text-slate-500 dark:text-slate-400 text-sm max-w-[200px] truncate" title={getProductName(sku.productId)}>
                  {getProductName(sku.productId)}
                </Td>
                <Td>{getBillingBadge(sku.billingModel)}</Td>
                <Td className="text-slate-500 dark:text-slate-400 text-sm capitalize">{sku.billingTerm !== 'none' ? sku.billingTerm : '-'}</Td>
                <Td className="text-slate-500 dark:text-slate-400 text-sm">{sku.uom}</Td>
                <Td>{getLifecycleBadge(sku.lifecycleStatus)}</Td>
                <Td className="text-right">
                  <Link to={`/products/${sku.productId}`}>
                    <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400">
                      {t('product.viewDetails')}
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
