import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, Pagination, ConfirmModal, Textarea } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, Filter, Package, ChevronRight, Edit2, Trash2, RefreshCw, CreditCard, Zap, Info, Globe } from 'lucide-react';
import { ProductSku } from '../types';
import { cn } from '../components/Layout';

import { getTranslatedField } from '../utils/i18n';

export function Skus() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { skus, setSkus, products, entitlements, setEntitlements, features } = useProductContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    productId: '',
    billingModel: '',
    lifecycleStatus: '',
    billingTerm: '',
    productType: [] as string[]
  });
  const [editingSku, setEditingSku] = useState<ProductSku | null>(null);
  const [viewingSku, setViewingSku] = useState<ProductSku | null>(null);
  const [skuToDelete, setSkuToDelete] = useState<number | null>(null);
  const [skuEntitlements, setSkuEntitlements] = useState<any[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredSkus = useMemo(() => {
    return skus.filter(sku => {
      const parentProduct = products.find(p => p.id === sku.productId);
      const matchesSearch = sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProduct = !filters.productId || sku.productId === Number(filters.productId);
      const matchesBillingModel = !filters.billingModel || sku.billingModel === filters.billingModel;
      const matchesLifecycle = !filters.lifecycleStatus || sku.lifecycleStatus === filters.lifecycleStatus;
      const matchesBillingTerm = !filters.billingTerm || sku.billingTerm === filters.billingTerm;
      const matchesProductType = filters.productType.length === 0 || 
        (parentProduct && filters.productType.includes(parentProduct.productType));
      
      return matchesSearch && matchesProduct && matchesBillingModel && matchesLifecycle && matchesBillingTerm && matchesProductType;
    });
  }, [skus, searchQuery, filters, products]);

  const hasActiveFilters = filters.productId || filters.billingModel || filters.lifecycleStatus || filters.billingTerm || filters.productType.length > 0;

  const clearFilters = () => {
    setFilters({
      productId: '',
      billingModel: '',
      lifecycleStatus: '',
      billingTerm: '',
      productType: []
    });
  };

  const paginatedSkus = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSkus.slice(start, start + pageSize);
  }, [filteredSkus, currentPage, pageSize]);

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
      setSkuEntitlements(entitlements.filter(e => e.skuId === sku.id));
    } else {
      setEditingSku(null);
      setSkuEntitlements([]);
    }
    setIsModalOpen(true);
  };

  const handleViewDetails = (sku: ProductSku) => {
    setViewingSku(sku);
    setIsDetailModalOpen(true);
  };

  const handleDeleteSku = (id: number) => {
    setSkuToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (skuToDelete !== null) {
      setSkus(skus.filter(s => s.id !== skuToDelete));
      setSkuToDelete(null);
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
      translations: {
        en: { 
          name: formData.get('name_en') as string,
          description: formData.get('description_en') as string
        },
        zh: { 
          name: formData.get('name_zh') as string,
          description: formData.get('description_zh') as string
        },
      }
    };

    if (editingSku) {
      setSkus(skus.map(s => s.id === editingSku.id ? { ...s, ...skuData } : s));
      // Update entitlements
      const otherEntitlements = entitlements.filter(e => e.skuId !== editingSku.id);
      setEntitlements([...otherEntitlements, ...skuEntitlements.map(e => ({ ...e, skuId: editingSku.id }))]);
    } else {
      const newSkuId = Math.max(0, ...skus.map(s => s.id)) + 1;
      const newSku: ProductSku = {
        ...skuData as ProductSku,
        id: newSkuId,
      };
      setSkus([newSku, ...skus]);
      setEntitlements([...entitlements, ...skuEntitlements.map(e => ({ ...e, skuId: newSkuId }))]);
    }
    
    setIsModalOpen(false);
  };

  const handleAddEntitlement = () => {
    const newEntitlement = {
      id: Math.max(0, ...entitlements.map(e => e.id), ...skuEntitlements.map(e => e.id)) + 1,
      skuId: editingSku?.id || 0,
      featureCode: features[0]?.code || '',
      entitlementType: 'boolean',
      status: 'active'
    };
    setSkuEntitlements([...skuEntitlements, newEntitlement]);
  };

  const handleUpdateEntitlement = (id: number, data: any) => {
    setSkuEntitlements(skuEntitlements.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const handleRemoveEntitlement = (id: number) => {
    setSkuEntitlements(skuEntitlements.filter(e => e.id !== id));
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
          <Button 
            variant="outline" 
            className={cn("gap-2 border-slate-200 dark:border-slate-800", hasActiveFilters && "border-indigo-500 text-indigo-600 bg-indigo-50/50")}
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="w-4 h-4" /> {t('common.filter')}
            {hasActiveFilters && <Badge variant="info" className="ml-1 px-1.5 py-0 h-4 min-w-4 flex items-center justify-center rounded-full text-[9px]">!</Badge>}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-400 hover:text-slate-600 text-xs font-medium">
              {t('common.clear')}
            </Button>
          )}
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
              <Th className="w-48">{t('sku.entitlements')}</Th>
              <Th className="w-32 text-right">{t('sku.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedSkus.map((sku) => {
              const skuEntitlements = entitlements.filter(e => e.skuId === sku.id);
              return (
                <Tr key={sku.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <Td>
                    <span className="font-mono text-[11px] tracking-tight text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800/50">
                      {sku.skuCode}
                    </span>
                  </Td>
                  <Td>
                    <button 
                      onClick={() => handleViewDetails(sku)}
                      className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      {getTranslatedField(sku, 'name', currentLang)}
                    </button>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <Link 
                        to={`/products/${sku.productId}`}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[200px]" 
                        title={getProductName(sku.productId)}
                      >
                        {getProductName(sku.productId)}
                      </Link>
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
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {skuEntitlements.length > 0 ? (
                        skuEntitlements.slice(0, 2).map(e => (
                          <Badge key={e.id} variant="outline" className="text-[9px] px-1 py-0">
                            {features.find(f => f.code === e.featureCode)?.name || e.featureCode}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">{t('common.none')}</span>
                      )}
                      {skuEntitlements.length > 2 && (
                        <span className="text-[9px] text-slate-400">+{skuEntitlements.length - 2}</span>
                      )}
                    </div>
                  </Td>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(sku)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ); })}
          </Tbody>
        </Table>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredSkus.length}
            totalPages={Math.ceil(filteredSkus.length / pageSize)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Card>

      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title={t('sku.viewSku')}
      >
        {viewingSku && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{viewingSku.name}</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{viewingSku.skuCode}</p>
              </div>
              {getLifecycleBadge(viewingSku.lifecycleStatus)}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('sku.parentProduct')}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{getProductName(viewingSku.productId)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('sku.billingModel')}</p>
                <div className="pt-1">{getBillingBadge(viewingSku.billingModel)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('sku.billingTerm')}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200 capitalize">{viewingSku.billingTerm}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('sku.uom')}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{viewingSku.uom}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t('sku.technicalSpecs')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('sku.isShippable')}</span>
                  <span className="font-medium">{viewingSku.isShippable ? t('taxes.yes') : t('taxes.no')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('sku.isSerialized')}</span>
                  <span className="font-medium">{viewingSku.isSerialized ? t('taxes.yes') : t('taxes.no')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('sku.weightKg')}</span>
                  <span className="font-medium">{viewingSku.weightKg || '-'} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('sku.hsCode')}</span>
                  <span className="font-medium">{viewingSku.hsCode || '-'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t('sku.entitlements')}</h4>
              <div className="space-y-2">
                {entitlements.filter(e => e.skuId === viewingSku.id).map(e => (
                  <div key={e.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-medium">{features.find(f => f.code === e.featureCode)?.name || e.featureCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={e.status === 'active' ? 'success' : 'outline'} className="text-[9px]">
                        {e.status}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {e.entitlementType === 'boolean' ? (e.status === 'active' ? t('taxes.yes') : t('taxes.no')) : (e.quotaValue || e.tierValue)}
                      </span>
                    </div>
                  </div>
                ))}
                {entitlements.filter(e => e.skuId === viewingSku.id).length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-2">{t('common.none')}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsDetailModalOpen(false)}>{t('common.cancel')}</Button>
            </div>
          </div>
        )}
      </Modal>

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
                  <option key={p.id} value={p.id}>{getTranslatedField(p, 'name', currentLang)}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.code')}</Label>
              <Input name="skuCode" required defaultValue={editingSku?.skuCode} placeholder={t('sku.skuCodePlaceholder')} />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label>{t('sku.name')}</Label>
            <Input name="name" required defaultValue={editingSku?.name} placeholder={t('sku.skuNamePlaceholder')} />
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
              <Input name="uom" defaultValue={editingSku?.uom || 'Unit'} placeholder={t('sku.uomPlaceholder')} required />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.countryOfOrigin')}</Label>
              <Input name="countryOfOrigin" defaultValue={editingSku?.countryOfOrigin} placeholder="e.g. US, CN" />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.provisioningHandler')}</Label>
              <Input name="provisioningHandler" defaultValue={editingSku?.provisioningHandler} placeholder="e.g. saas-core-provisioner" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              {t('common.translations')}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.name')} (EN)</Label>
                <Input 
                  name="name_en"
                  defaultValue={editingSku?.translations?.en?.name || ''} 
                  placeholder="English Name" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.name')} (ZH)</Label>
                <Input 
                  name="name_zh"
                  defaultValue={editingSku?.translations?.zh?.name || ''} 
                  placeholder="中文名称" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (EN)</Label>
                <Textarea 
                  name="description_en"
                  defaultValue={editingSku?.translations?.en?.description || ''} 
                  placeholder="English Description" 
                  className="h-20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (ZH)</Label>
                <Textarea 
                  name="description_zh"
                  defaultValue={editingSku?.translations?.zh?.description || ''} 
                  placeholder="中文描述" 
                  className="h-20"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Zap className="w-4 h-4 text-amber-500" />
                {t('sku.entitlements')}
              </div>
              <Button type="button" size="sm" variant="outline" onClick={handleAddEntitlement} className="h-7 px-2 text-[10px] gap-1">
                <Plus className="w-3 h-3" /> {t('common.add')}
              </Button>
            </div>

            <div className="space-y-3">
              {skuEntitlements.map((ent, index) => (
                <div key={ent.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  <div className="col-span-4 space-y-1">
                    <Label className="text-[10px]">{t('sku.feature')}</Label>
                    <Select 
                      value={ent.featureCode} 
                      onChange={(e) => handleUpdateEntitlement(ent.id, { featureCode: e.target.value })}
                      className="h-9 text-xs"
                    >
                      {features.map(f => (
                        <option key={f.id} value={f.code}>{f.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-[10px]">{t('sku.type')}</Label>
                    <Select 
                      value={ent.entitlementType} 
                      onChange={(e) => handleUpdateEntitlement(ent.id, { entitlementType: e.target.value })}
                      className="h-9 text-xs"
                    >
                      <option value="boolean">Boolean</option>
                      <option value="quota">Quota</option>
                      <option value="tier">Tier</option>
                    </Select>
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-[10px]">{ent.entitlementType === 'boolean' ? t('sku.status') : t('sku.value')}</Label>
                    {ent.entitlementType === 'boolean' ? (
                      <Select 
                        value={ent.status} 
                        onChange={(e) => handleUpdateEntitlement(ent.id, { status: e.target.value })}
                        className="h-9 text-xs"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Select>
                    ) : (
                      <Input 
                        value={ent.entitlementType === 'quota' ? ent.quotaValue : ent.tierValue}
                        onChange={(e) => handleUpdateEntitlement(ent.id, ent.entitlementType === 'quota' ? { quotaValue: parseInt(e.target.value) } : { tierValue: e.target.value })}
                        className="h-9 text-xs"
                      />
                    )}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveEntitlement(ent.id)}
                      className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {skuEntitlements.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-2">{t('common.none')}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-200 dark:border-slate-800">{t('common.cancel')}</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.confirmDelete')}
        message={t('common.confirmDeleteMessage')}
      />

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title={t('common.filter')}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.parentProduct')}</Label>
              <Select 
                value={filters.productId}
                onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
              >
                <option value="">{t('common.all')}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{getTranslatedField(p, 'name', currentLang)}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-3">
              <Label>{t('product.type')}</Label>
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                {['software', 'hardware', 'service', 'bundle', 'consumable'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.productType.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.productType, type]
                          : filters.productType.filter(t => t !== type);
                        setFilters({ ...filters, productType: newTypes });
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {t(`product.${type}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t('sku.billingModel')}</Label>
              <Select 
                value={filters.billingModel}
                onChange={(e) => setFilters({ ...filters, billingModel: e.target.value })}
              >
                <option value="">{t('common.all')}</option>
                <option value="one_time">{t('sku.one_time')}</option>
                <option value="recurring">{t('sku.recurring')}</option>
                <option value="usage_based">{t('sku.usage_based')}</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('sku.lifecycle')}</Label>
              <Select 
                value={filters.lifecycleStatus}
                onChange={(e) => setFilters({ ...filters, lifecycleStatus: e.target.value })}
              >
                <option value="">{t('common.all')}</option>
                <option value="draft">{t('sku.draft')}</option>
                <option value="active">{t('sku.active')}</option>
                <option value="eos">{t('sku.eos')}</option>
                <option value="eol">{t('sku.eol')}</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('sku.billingTerm')}</Label>
              <Select 
                value={filters.billingTerm}
                onChange={(e) => setFilters({ ...filters, billingTerm: e.target.value })}
              >
                <option value="">{t('common.all')}</option>
                <option value="none">{t('sku.none')}</option>
                <option value="daily">{t('sku.daily')}</option>
                <option value="weekly">{t('sku.weekly')}</option>
                <option value="monthly">{t('sku.monthly')}</option>
                <option value="quarterly">{t('sku.quarterly')}</option>
                <option value="annual">{t('sku.annual')}</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={clearFilters}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => setIsFilterModalOpen(false)}>
              {t('common.apply')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
