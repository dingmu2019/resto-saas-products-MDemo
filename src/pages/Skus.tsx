import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal } from '../components/ui';
import { mockSkus, mockProducts } from '../data/mock';
import { Plus, Search, Filter } from 'lucide-react';
import { ProductSku } from '../types';

export function Skus() {
  const { t } = useTranslation();
  const [skus, setSkus] = useState<ProductSku[]>(mockSkus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkus = skus.filter(sku => 
    sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductName = (productId: number) => {
    return mockProducts.find(p => p.id === productId)?.name || 'Unknown';
  };

  const getLifecycleBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">{t('sku.active')}</Badge>;
      case 'draft': return <Badge variant="warning">{t('sku.draft')}</Badge>;
      case 'eos': return <Badge variant="error">{t('sku.eos')}</Badge>;
      case 'eol': return <Badge variant="error">{t('sku.eol')}</Badge>;
      case 'retired': return <Badge variant="outline">{t('sku.retired')}</Badge>;
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

  const handleCreateSku = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newSku: ProductSku = {
      id: Math.max(0, ...skus.map(s => s.id)) + 1,
      productId: parseInt(formData.get('productId') as string),
      skuCode: formData.get('skuCode') as string,
      name: formData.get('name') as string,
      billingModel: formData.get('billingModel') as any,
      billingTerm: formData.get('billingTerm') as any,
      billingTiming: formData.get('billingTiming') as any,
      trialDays: parseInt(formData.get('trialDays') as string) || 0,
      uom: formData.get('uom') as string,
      lifecycleStatus: formData.get('lifecycleStatus') as any,
      isShippable: formData.get('isShippable') === 'on',
      isSerialized: formData.get('isSerialized') === 'on',
      weightKg: formData.get('weightKg') ? parseFloat(formData.get('weightKg') as string) : undefined,
      lengthCm: formData.get('lengthCm') ? parseFloat(formData.get('lengthCm') as string) : undefined,
      widthCm: formData.get('widthCm') ? parseFloat(formData.get('widthCm') as string) : undefined,
      heightCm: formData.get('heightCm') ? parseFloat(formData.get('heightCm') as string) : undefined,
      hsCode: formData.get('hsCode') as string,
      countryOfOrigin: formData.get('countryOfOrigin') as string,
      provisioningHandler: formData.get('provisioningHandler') as string,
    };

    setSkus([newSku, ...skus]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('sku.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> {t('common.filter')}
          </Button>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> {t('sku.newSku')}
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
            {filteredSkus.map((sku) => (
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={t('sku.newSku')}
      >
        <form onSubmit={handleCreateSku} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.parentProduct')}</label>
              <select name="productId" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
                <option value="">{t('product.searchPlaceholder')}</option>
                {mockProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.code')}</label>
              <input name="skuCode" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.name')}</label>
            <input name="name" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.billingModel')}</label>
              <select name="billingModel" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
                <option value="one_time">{t('sku.one_time')}</option>
                <option value="recurring">{t('sku.recurring')}</option>
                <option value="usage_based">{t('sku.usage_based')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.billingTerm')}</label>
              <select name="billingTerm" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
                <option value="none">{t('sku.none')}</option>
                <option value="daily">{t('sku.daily')}</option>
                <option value="weekly">{t('sku.weekly')}</option>
                <option value="monthly">{t('sku.monthly')}</option>
                <option value="quarterly">{t('sku.quarterly')}</option>
                <option value="annual">{t('sku.annual')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.billingTiming')}</label>
              <select name="billingTiming" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
                <option value="in_advance">{t('sku.in_advance')}</option>
                <option value="in_arrears">{t('sku.in_arrears')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.uom')}</label>
              <input name="uom" defaultValue="Unit" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.trialDays')}</label>
              <input type="number" name="trialDays" defaultValue={0} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.lifecycle')}</label>
              <select name="lifecycleStatus" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
                <option value="draft">{t('sku.draft')}</option>
                <option value="active">{t('sku.active')}</option>
                <option value="eos">{t('sku.eos')}</option>
                <option value="eol">{t('sku.eol')}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isShippable" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('sku.isShippable')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isSerialized" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('sku.isSerialized')}</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.weightKg')}</label>
              <input type="number" step="0.01" name="weightKg" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sku.hsCode')}</label>
              <input name="hsCode" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
