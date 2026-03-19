import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, Filter, Package, ChevronRight, Edit2, Trash2, RefreshCw, CreditCard, Zap, Info } from 'lucide-react';
import { ProductSku } from '../types';
import { cn } from '../components/Layout';

export function Skus() {
  const { t } = useTranslation();
  const { skus, setSkus, products } = useProductContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSku, setEditingSku] = useState<ProductSku | null>(null);

  const filteredSkus = skus.filter(sku => 
    sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductName = (productId: number) => {
    return products.find(p => p.id === productId)?.name || 'Unknown';
  };

  const getLifecycleBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success" className="text-[10px] uppercase tracking-wider">{t('sku.active')}</Badge>;
      case 'draft': return <Badge variant="warning" className="text-[10px] uppercase tracking-wider">{t('sku.draft')}</Badge>;
      case 'eos': return <Badge variant="error" className="text-[10px] uppercase tracking-wider">{t('sku.eos')}</Badge>;
      case 'eol': return <Badge variant="error" className="text-[10px] uppercase tracking-wider">{t('sku.eol')}</Badge>;
      case 'retired': return <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{t('sku.retired')}</Badge>;
      default: return <Badge className="text-[10px] uppercase tracking-wider">{status}</Badge>;
    }
  };

  const getBillingBadge = (model: string) => {
    switch (model) {
      case 'recurring': 
        return (
          <Badge variant="info" className="text-[10px] uppercase tracking-wider flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            {t('sku.recurring')}
          </Badge>
        );
      case 'one_time': 
        return (
          <Badge variant="success" className="text-[10px] uppercase tracking-wider flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            {t('sku.one_time')}
          </Badge>
        );
      case 'usage_based': 
        return (
          <Badge variant="warning" className="text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {t('sku.usage_based')}
          </Badge>
        );
      default: return <Badge className="text-[10px] uppercase tracking-wider">{model}</Badge>;
    }
  };

  const handleOpenModal = (sku?: ProductSku) => {
    if (sku) {
      setEditingSku(sku);
    } else {
      setEditingSku(null);
    }
    setIsModalOpen(true);
  };

  const handleDeleteSku = (id: number) => {
    if (window.confirm(t('common.confirmDelete'))) {
      setSkus(skus.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const skuData: Partial<ProductSku> = {
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
      hsCode: formData.get('hsCode') as string,
      countryOfOrigin: formData.get('countryOfOrigin') as string,
      provisioningHandler: formData.get('provisioningHandler') as string,
    };

    if (editingSku) {
      setSkus(skus.map(s => s.id === editingSku.id ? { ...s, ...skuData } : s));
    } else {
      const newSku: ProductSku = {
        ...skuData as ProductSku,
        id: Math.max(0, ...skus.map(s => s.id)) + 1,
      };
      setSkus([newSku, ...skus]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('sku.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 transition-all"
            />
          </div>
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4" /> {t('common.filter')}
          </Button>
        </div>
        <Button className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> {t('sku.newSku')}
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
        <Table>
          <Thead>
            <Tr className="bg-slate-50/50 dark:bg-slate-800/20">
              <Th className="w-48">{t('sku.code')}</Th>
              <Th>{t('sku.name')}</Th>
              <Th>{t('sku.parentProduct')}</Th>
              <Th className="w-40">{t('sku.billingModel')}</Th>
              <Th className="w-32">{t('sku.billingTerm')}</Th>
              <Th className="w-24">{t('sku.uom')}</Th>
              <Th className="w-32">{t('sku.lifecycle')}</Th>
              <Th className="w-32 text-right">{t('sku.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSkus.map((sku) => (
              <Tr key={sku.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <Td>
                  <span className="font-mono text-[11px] tracking-tight text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800/50">
                    {sku.skuCode}
                  </span>
                </Td>
                <Td>
                  <div className="font-medium text-slate-900 dark:text-white">{sku.name}</div>
                </Td>
                <Td>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[200px]" title={getProductName(sku.productId)}>
                      {getProductName(sku.productId)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {sku.productId}</span>
                  </div>
                </Td>
                <Td>{getBillingBadge(sku.billingModel)}</Td>
                <Td>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {sku.billingTerm !== 'none' ? sku.billingTerm : '-'}
                  </span>
                </Td>
                <Td>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{sku.uom}</span>
                </Td>
                <Td>{getLifecycleBadge(sku.lifecycleStatus)}</Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenModal(sku)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSku(sku.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Link to={`/products/${sku.productId}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingSku ? t('sku.editSku') : t('sku.newSku')}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.parentProduct')}</Label>
              <Select name="productId" required defaultValue={editingSku?.productId}>
                <option value="">{t('product.searchPlaceholder')}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.code')}</Label>
              <Input name="skuCode" required defaultValue={editingSku?.skuCode} />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label>{t('sku.name')}</Label>
            <Input name="name" required defaultValue={editingSku?.name} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.billingModel')}</Label>
              <Select name="billingModel" required defaultValue={editingSku?.billingModel || 'one_time'}>
                <option value="one_time">{t('sku.one_time')}</option>
                <option value="recurring">{t('sku.recurring')}</option>
                <option value="usage_based">{t('sku.usage_based')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.billingTerm')}</Label>
              <Select name="billingTerm" required defaultValue={editingSku?.billingTerm || 'none'}>
                <option value="none">{t('sku.none')}</option>
                <option value="daily">{t('sku.daily')}</option>
                <option value="weekly">{t('sku.weekly')}</option>
                <option value="monthly">{t('sku.monthly')}</option>
                <option value="quarterly">{t('sku.quarterly')}</option>
                <option value="annual">{t('sku.annual')}</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.billingTiming')}</Label>
              <Select name="billingTiming" required defaultValue={editingSku?.billingTiming || 'in_advance'}>
                <option value="in_advance">{t('sku.in_advance')}</option>
                <option value="in_arrears">{t('sku.in_arrears')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.uom')}</Label>
              <Input name="uom" defaultValue={editingSku?.uom || 'Unit'} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.trialDays')}</Label>
              <Input type="number" name="trialDays" defaultValue={editingSku?.trialDays || 0} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.lifecycle')}</Label>
              <Select name="lifecycleStatus" required defaultValue={editingSku?.lifecycleStatus || 'draft'}>
                <option value="draft">{t('sku.draft')}</option>
                <option value="active">{t('sku.active')}</option>
                <option value="eos">{t('sku.eos')}</option>
                <option value="eol">{t('sku.eol')}</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="isShippable" 
                defaultChecked={editingSku?.isShippable}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" 
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{t('sku.isShippable')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="isSerialized" 
                defaultChecked={editingSku?.isSerialized}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" 
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{t('sku.isSerialized')}</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.weightKg')}</Label>
              <Input type="number" step="0.01" name="weightKg" defaultValue={editingSku?.weightKg} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.hsCode')}</Label>
              <Input name="hsCode" defaultValue={editingSku?.hsCode} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-200 dark:border-slate-800">{t('common.cancel')}</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
