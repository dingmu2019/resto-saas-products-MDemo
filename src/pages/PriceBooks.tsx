import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, Textarea, Pagination, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { BookOpen, Search, Plus, DollarSign, Tag, Globe, Calendar, ChevronRight, Edit2, Trash2, Check, Info } from 'lucide-react';
import { cn } from '../components/Layout';
import { PriceBook, PriceBookEntry } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function PriceBooks() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { priceBooks, setPriceBooks, priceBookEntries, setPriceBookEntries, skus, products } = useProductContext();
  const [activePbId, setActivePbId] = useState<number | null>(priceBooks[0]?.id || null);
  const [isPbModalOpen, setIsPbModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isDeletePbModalOpen, setIsDeletePbModalOpen] = useState(false);
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);
  const [editingPb, setEditingPb] = useState<PriceBook | null>(null);
  const [editingEntry, setEditingEntry] = useState<PriceBookEntry | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [pbToDelete, setPbToDelete] = useState<number | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state for Price Books
  const [pbPage, setPbPage] = useState(1);
  const [pbPageSize, setPbPageSize] = useState(10);

  // Pagination state for Entries
  const [entryPage, setEntryPage] = useState(1);
  const [entryPageSize, setEntryPageSize] = useState(10);

  const filteredPriceBooks = useMemo(() => {
    return priceBooks.filter(pb => 
      getTranslatedField(pb, 'name', currentLang).toLowerCase().includes(searchQuery.toLowerCase()) || 
      pb.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [priceBooks, searchQuery]);

  const paginatedPriceBooks = useMemo(() => {
    const start = (pbPage - 1) * pbPageSize;
    return filteredPriceBooks.slice(start, start + pbPageSize);
  }, [filteredPriceBooks, pbPage, pbPageSize]);

  const activePbEntries = useMemo(() => {
    return priceBookEntries.filter(e => e.priceBookId === activePbId);
  }, [priceBookEntries, activePbId]);

  const paginatedEntries = useMemo(() => {
    const start = (entryPage - 1) * entryPageSize;
    return activePbEntries.slice(start, start + entryPageSize);
  }, [activePbEntries, entryPage, entryPageSize]);

  const activePb = priceBooks.find(pb => pb.id === activePbId);

  const handleOpenPbModal = (pb?: PriceBook) => {
    setEditingPb(pb || null);
    setIsPbModalOpen(true);
  };

  const handleOpenEntryModal = (entry?: PriceBookEntry, viewOnly: boolean = false) => {
    setEditingEntry(entry || null);
    setIsViewOnly(viewOnly);
    setIsEntryModalOpen(true);
  };

  const handleDeletePb = (id: number) => {
    setPbToDelete(id);
    setIsDeletePbModalOpen(true);
  };

  const handleConfirmDeletePb = () => {
    if (pbToDelete !== null) {
      setPriceBooks(priceBooks.filter(pb => pb.id !== pbToDelete));
      if (activePbId === pbToDelete) setActivePbId(priceBooks.find(pb => pb.id !== pbToDelete)?.id || null);
      setPbToDelete(null);
    }
  };

  const handleDeleteEntry = (id: number) => {
    setEntryToDelete(id);
    setIsDeleteEntryModalOpen(true);
  };

  const handleConfirmDeleteEntry = () => {
    if (entryToDelete !== null) {
      setPriceBookEntries(priceBookEntries.filter(e => e.id !== entryToDelete));
      setEntryToDelete(null);
    }
  };

  const handlePbSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const pbData: Partial<PriceBook> = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      currency: formData.get('currency') as string,
      type: formData.get('type') as any,
      partnerTier: formData.get('partnerTier') as string,
      isActive: formData.get('isActive') === 'on',
      validFrom: formData.get('validFrom') as string,
      validTo: formData.get('validTo') as string || undefined,
      applicableRegions: (formData.get('applicableRegions') as string)?.split(',').map(s => s.trim()).filter(Boolean),
      priceDisplayPrecision: parseInt(formData.get('priceDisplayPrecision') as string) || 2,
      translations: {
        en: { name: formData.get('name_en') as string },
        zh: { name: formData.get('name_zh') as string },
      }
    };

    if (editingPb) {
      setPriceBooks(priceBooks.map(pb => pb.id === editingPb.id ? { ...pb, ...pbData } : pb));
    } else {
      const newPb: PriceBook = {
        ...pbData as PriceBook,
        id: Math.max(0, ...priceBooks.map(pb => pb.id)) + 1,
      };
      setPriceBooks([...priceBooks, newPb]);
      setActivePbId(newPb.id);
    }
    
    setIsPbModalOpen(false);
  };

  const handleEntrySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activePbId) return;
    const formData = new FormData(e.currentTarget);
    
    const entryData: Partial<PriceBookEntry> = {
      priceBookId: activePbId,
      skuId: parseInt(formData.get('skuId') as string),
      parentSkuId: formData.get('parentSkuId') ? parseInt(formData.get('parentSkuId') as string) : undefined,
      pricingStrategy: formData.get('pricingStrategy') as any,
      listPrice: parseFloat(formData.get('listPrice') as string),
      minPrice: formData.get('minPrice') ? parseFloat(formData.get('minPrice') as string) : undefined,
      maxDiscountRate: formData.get('maxDiscountRate') ? parseFloat(formData.get('maxDiscountRate') as string) / 100 : undefined,
      msrp: formData.get('msrp') ? parseFloat(formData.get('msrp') as string) : undefined,
      standaloneSellingPrice: formData.get('standaloneSellingPrice') ? parseFloat(formData.get('standaloneSellingPrice') as string) : undefined,
      estimatedUnitCost: formData.get('estimatedUnitCost') ? parseFloat(formData.get('estimatedUnitCost') as string) : undefined,
      minCommitmentMonths: formData.get('minCommitmentMonths') ? parseInt(formData.get('minCommitmentMonths') as string) : undefined,
      billingModelOverride: formData.get('billingModelOverride') as any || undefined,
      earlyTerminationPolicy: formData.get('earlyTerminationPolicy') as any || undefined,
      etfAmountOrPercent: formData.get('etfAmountOrPercent') ? parseFloat(formData.get('etfAmountOrPercent') as string) : undefined,
      bundleAdjustmentAmount: formData.get('bundleAdjustmentAmount') ? parseFloat(formData.get('bundleAdjustmentAmount') as string) : undefined,
      validFrom: formData.get('validFrom') as string,
      validTo: formData.get('validTo') as string || undefined,
      tierConfig: formData.get('tierConfig') ? JSON.parse(formData.get('tierConfig') as string) : undefined,
    };

    if (editingEntry) {
      setPriceBookEntries(priceBookEntries.map(entry => entry.id === editingEntry.id ? { ...entry, ...entryData } : entry));
    } else {
      const newEntry: PriceBookEntry = {
        ...entryData as PriceBookEntry,
        id: Math.max(0, ...priceBookEntries.map(entry => entry.id)) + 1,
      };
      setPriceBookEntries([...priceBookEntries, newEntry]);
    }
    
    setIsEntryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('priceBook.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 transition-all"
            />
          </div>
        </div>
        <Button className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => handleOpenPbModal()}>
          <Plus className="w-4 h-4" /> {t('priceBook.newPriceBook')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {t('priceBook.title')}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedPriceBooks.map((pb) => (
                <div 
                  key={pb.id} 
                  onClick={() => setActivePbId(pb.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-all border-l-4 group",
                    activePbId === pb.id 
                      ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-500" 
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={cn(
                      "font-semibold text-sm transition-colors",
                      activePbId === pb.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-slate-50"
                    )}>
                      {getTranslatedField(pb, 'name', currentLang)}
                    </h4>
                    <div className="flex gap-1">
                      <Badge variant={pb.isActive ? 'success' : 'default'} className="text-[10px] uppercase tracking-wider">
                        {pb.isActive ? t('common.active') : t('sku.draft')}
                      </Badge>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenPbModal(pb); }}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePb(pb.id); }}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {pb.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{pb.partnerTier ? t(`priceBook.${pb.partnerTier.toLowerCase()}`) : ''}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{pb.currency}</span>
                    </div>
                  </div>
                  {pb.applicableRegions && pb.applicableRegions.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
                      <Globe className="w-3 h-3" />
                      <span className="truncate">{pb.applicableRegions.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-slate-100 dark:divide-slate-800">
              <Pagination
                currentPage={pbPage}
                totalItems={filteredPriceBooks.length}
                totalPages={Math.ceil(filteredPriceBooks.length / pbPageSize)}
                pageSize={pbPageSize}
                onPageChange={setPbPage}
                onPageSizeChange={setPbPageSize}
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-900 dark:text-white">{t('priceBook.entries')}</div>
                  <div className="text-[11px] font-mono text-slate-500">{activePb?.code}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-slate-200 dark:border-slate-800"
                onClick={() => handleOpenEntryModal()}
                disabled={!activePbId}
              >
                <Plus className="w-3.5 h-3.5" /> {t('priceBook.addEntry')}
              </Button>
            </div>
            <Table>
              <Thead>
                <Tr className="bg-slate-50/30 dark:bg-slate-800/10">
                  <Th className="w-48">{t('sku.name')}</Th>
                  <Th className="w-40">{t('priceBook.skuCode')}</Th>
                  <Th className="w-32">{t('product.type')}</Th>
                  <Th className="w-40">{t('product.code')}</Th>
                  <Th className="w-48">{t('product.name')}</Th>
                  <Th className="text-right">{t('priceBook.listPrice')}</Th>
                  <Th className="text-right">{t('priceBook.msrp')}</Th>
                  <Th className="text-right">{t('priceBook.standaloneSellingPrice')}</Th>
                  <Th className="text-right">{t('priceBook.minPrice')}</Th>
                  <Th className="text-right">{t('priceBook.maxDiscount')}</Th>
                  <Th className="w-32">{t('priceBook.strategy')}</Th>
                  <Th className="w-32">{t('sku.billingModel')}</Th>
                  <Th className="w-32">{t('sku.billingTerm')}</Th>
                  <Th className="w-32">{t('sku.billingTiming')}</Th>
                  <Th className="w-24">{t('sku.uom')}</Th>
                  <Th className="w-32">{t('sku.lifecycle')}</Th>
                  <Th className="w-24 text-right">{t('sku.actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedEntries.map((entry) => {
                  const sku = skus.find(s => s.id === entry.skuId);
                  const product = sku ? products.find(p => p.id === sku.productId) : null;
                  
                  return (
                    <Tr key={entry.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                      <Td className="max-w-[200px] truncate">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {sku ? getTranslatedField(sku, 'name', currentLang) : '-'}
                        </span>
                      </Td>
                      <Td>
                        <span className="font-mono text-[11px] tracking-tight text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800/50">
                          {sku?.skuCode || entry.skuId}
                        </span>
                      </Td>
                      <Td>
                        {product ? (
                          <Badge variant="outline" className="text-[10px] lowercase first-letter:uppercase">
                            {t(`product.${product.productType}`)}
                          </Badge>
                        ) : '-'}
                      </Td>
                      <Td>
                        <span className="text-xs text-slate-500 font-mono">
                          {product?.productCode || '-'}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {product ? getTranslatedField(product, 'name', currentLang) : '-'}
                        </span>
                      </Td>
                      <Td className="text-right font-bold text-slate-900 dark:text-white">
                        {activePb?.currency === 'USD' ? '$' : activePb?.currency === 'CNY' ? '¥' : ''}
                        {entry.listPrice.toLocaleString(undefined, { minimumFractionDigits: activePb?.priceDisplayPrecision || 2 })}
                      </Td>
                      <Td className="text-right text-slate-500 text-sm">
                        {entry.msrp ? (
                          <>
                            {activePb?.currency === 'USD' ? '$' : activePb?.currency === 'CNY' ? '¥' : ''}
                            {entry.msrp.toLocaleString(undefined, { minimumFractionDigits: activePb?.priceDisplayPrecision || 2 })}
                          </>
                        ) : '-'}
                      </Td>
                      <Td className="text-right text-slate-500 text-sm">
                        {entry.standaloneSellingPrice ? (
                          <>
                            {activePb?.currency === 'USD' ? '$' : activePb?.currency === 'CNY' ? '¥' : ''}
                            {entry.standaloneSellingPrice.toLocaleString(undefined, { minimumFractionDigits: activePb?.priceDisplayPrecision || 2 })}
                          </>
                        ) : '-'}
                      </Td>
                      <Td className="text-right text-slate-500 text-sm">
                        {entry.minPrice ? (
                          <>
                            {activePb?.currency === 'USD' ? '$' : activePb?.currency === 'CNY' ? '¥' : ''}
                            {entry.minPrice.toLocaleString(undefined, { minimumFractionDigits: activePb?.priceDisplayPrecision || 2 })}
                          </>
                        ) : '-'}
                      </Td>
                      <Td className="text-right">
                        {entry.maxDiscountRate ? (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                            {(entry.maxDiscountRate * 100).toFixed(0)}%
                          </span>
                        ) : '-'}
                      </Td>
                      <Td>
                        <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider">
                          {t(`priceBook.${entry.pricingStrategy}`)}
                        </Badge>
                      </Td>
                      <Td>
                        {sku ? (
                          <Badge variant="info" className="text-[10px] lowercase first-letter:uppercase">
                            {t(`sku.${sku.billingModel}`)}
                          </Badge>
                        ) : '-'}
                      </Td>
                      <Td className="text-xs">
                        {sku ? t(`sku.${sku.billingTerm}`) : '-'}
                      </Td>
                      <Td className="text-xs">
                        {sku ? t(`sku.${sku.billingTiming}`) : '-'}
                      </Td>
                      <Td className="text-xs">
                        {sku?.uom || '-'}
                      </Td>
                      <Td>
                        {sku ? (
                          <Badge 
                            variant={sku.lifecycleStatus === 'active' ? 'success' : sku.lifecycleStatus === 'draft' ? 'warning' : 'default'}
                            className="text-[10px]"
                          >
                            {t(`sku.${sku.lifecycleStatus}`)}
                          </Badge>
                        ) : '-'}
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleOpenEntryModal(entry, true)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleOpenEntryModal(entry)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <Pagination
                currentPage={entryPage}
                totalItems={activePbEntries.length}
                totalPages={Math.ceil(activePbEntries.length / entryPageSize)}
                pageSize={entryPageSize}
                onPageChange={setEntryPage}
                onPageSizeChange={setEntryPageSize}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Price Book Modal */}
      <Modal 
        isOpen={isPbModalOpen} 
        onClose={() => setIsPbModalOpen(false)} 
        title={editingPb ? t('priceBook.editPriceBook') : t('priceBook.newPriceBook')}
      >
        <form onSubmit={handlePbSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.code')}</Label>
              <Input name="code" required defaultValue={editingPb?.code} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.name')}</Label>
              <Input name="name" required defaultValue={editingPb?.name} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.currency')}</Label>
              <Select name="currency" required defaultValue={editingPb?.currency || 'USD'}>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.type')}</Label>
              <Select name="type" required defaultValue={editingPb?.type || 'standard'}>
                <option value="standard">{t('priceBook.standard')}</option>
                <option value="channel">{t('priceBook.channel')}</option>
                <option value="promotional">{t('priceBook.promotional')}</option>
                <option value="custom">{t('priceBook.custom')}</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.partnerTier')}</Label>
              <Select name="partnerTier" defaultValue={editingPb?.partnerTier || ''}>
                <option value="">{t('common.none')}</option>
                <option value="Gold">{t('priceBook.gold')}</option>
                <option value="Silver">{t('priceBook.silver')}</option>
                <option value="Bronze">{t('priceBook.bronze')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.precision')}</Label>
              <Input type="number" name="priceDisplayPrecision" defaultValue={editingPb?.priceDisplayPrecision || 2} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.validFrom')}</Label>
              <Input type="date" name="validFrom" required defaultValue={editingPb?.validFrom?.split('T')[0]} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.validTo')}</Label>
              <Input type="date" name="validTo" defaultValue={editingPb?.validTo?.split('T')[0]} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('priceBook.applicableRegions')}</Label>
            <Input 
              name="applicableRegions" 
              defaultValue={editingPb?.applicableRegions?.join(', ')} 
              placeholder="e.g. US, CN, SG"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              name="isActive" 
              defaultChecked={editingPb ? editingPb.isActive : true}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" 
            />
            <Label className="mb-0">{t('common.active')}</Label>
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
                  defaultValue={editingPb?.translations?.en?.name || ''} 
                  placeholder="English Name" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.name')} (ZH)</Label>
                <Input 
                  name="name_zh"
                  defaultValue={editingPb?.translations?.zh?.name || ''} 
                  placeholder="中文名称" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsPbModalOpen(false)} className="border-slate-200 dark:border-slate-800">{t('common.cancel')}</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Entry Modal */}
      <Modal 
        isOpen={isEntryModalOpen} 
        onClose={() => setIsEntryModalOpen(false)} 
        title={isViewOnly ? t('common.view') : editingEntry ? t('priceBook.editEntry') : t('priceBook.addEntry')}
      >
        <form onSubmit={handleEntrySubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('priceBook.skuCode')}</Label>
            <Select name="skuId" required defaultValue={editingEntry?.skuId} disabled={isViewOnly}>
              <option value="">{t('sku.searchPlaceholder')}</option>
              {skus.map(s => (
                <option key={s.id} value={s.id}>{s.skuCode} - {getTranslatedField(s, 'name', currentLang)}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t('priceBook.parentSkuId')}</Label>
            <Select name="parentSkuId" defaultValue={editingEntry?.parentSkuId || ''} disabled={isViewOnly}>
              <option value="">{t('common.none')}</option>
              {skus.filter(s => s.id !== editingEntry?.skuId).map(s => (
                <option key={s.id} value={s.id}>{s.skuCode} - {getTranslatedField(s, 'name', currentLang)}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.strategy')}</Label>
              <Select name="pricingStrategy" required defaultValue={editingEntry?.pricingStrategy || 'flat_fee'} disabled={isViewOnly}>
                <option value="flat_fee">{t('priceBook.flat_fee')}</option>
                <option value="per_unit">{t('priceBook.per_unit')}</option>
                <option value="tiered">{t('priceBook.tiered')}</option>
                <option value="volume">{t('priceBook.volume')}</option>
                <option value="percentage">{t('priceBook.percentage')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.listPrice')}</Label>
              <Input type="number" step="0.01" name="listPrice" required defaultValue={editingEntry?.listPrice} disabled={isViewOnly} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.minPrice')}</Label>
              <Input type="number" step="0.01" name="minPrice" defaultValue={editingEntry?.minPrice} disabled={isViewOnly} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.msrp')}</Label>
              <Input type="number" step="0.01" name="msrp" defaultValue={editingEntry?.msrp} disabled={isViewOnly} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.maxDiscount')} (%)</Label>
              <Input type="number" name="maxDiscountRate" defaultValue={editingEntry?.maxDiscountRate ? editingEntry.maxDiscountRate * 100 : ''} disabled={isViewOnly} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.standaloneSellingPrice')}</Label>
              <Input type="number" step="0.01" name="standaloneSellingPrice" defaultValue={editingEntry?.standaloneSellingPrice} disabled={isViewOnly} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.estimatedUnitCost')}</Label>
              <Input type="number" step="0.01" name="estimatedUnitCost" defaultValue={editingEntry?.estimatedUnitCost} disabled={isViewOnly} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.minCommitmentMonths')}</Label>
              <Input type="number" name="minCommitmentMonths" defaultValue={editingEntry?.minCommitmentMonths} disabled={isViewOnly} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.billingModelOverride')}</Label>
              <Select name="billingModelOverride" defaultValue={editingEntry?.billingModelOverride || ''} disabled={isViewOnly}>
                <option value="">{t('common.none')}</option>
                <option value="one_time">{t('sku.one_time')}</option>
                <option value="recurring">{t('sku.recurring')}</option>
                <option value="usage_based">{t('sku.usage_based')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.bundleAdjustmentAmount')}</Label>
              <Input type="number" step="0.01" name="bundleAdjustmentAmount" defaultValue={editingEntry?.bundleAdjustmentAmount} disabled={isViewOnly} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.earlyTerminationPolicy')}</Label>
              <Select name="earlyTerminationPolicy" defaultValue={editingEntry?.earlyTerminationPolicy || 'none'} disabled={isViewOnly}>
                <option value="none">{t('common.none')}</option>
                <option value="flat_fee">{t('priceBook.flat_fee')}</option>
                <option value="remaining_balance">{t('priceBook.remaining_balance')}</option>
                <option value="fixed_months">{t('priceBook.fixed_months')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.etfAmountOrPercent')}</Label>
              <Input type="number" step="0.01" name="etfAmountOrPercent" defaultValue={editingEntry?.etfAmountOrPercent} disabled={isViewOnly} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('priceBook.tierConfig')} (JSON)</Label>
            <Textarea 
              name="tierConfig" 
              defaultValue={editingEntry?.tierConfig ? JSON.stringify(editingEntry.tierConfig, null, 2) : ''} 
              rows={3}
              placeholder={t('priceBook.tierConfigPlaceholder')}
              disabled={isViewOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.validFrom')}</Label>
              <Input type="date" name="validFrom" required defaultValue={editingEntry?.validFrom?.split('T')[0] || new Date().toISOString().split('T')[0]} disabled={isViewOnly} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.validTo')}</Label>
              <Input type="date" name="validTo" defaultValue={editingEntry?.validTo?.split('T')[0]} disabled={isViewOnly} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsEntryModalOpen(false)} className="border-slate-200 dark:border-slate-800">{t('common.cancel')}</Button>
            {!isViewOnly && (
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">{t('common.save')}</Button>
            )}
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeletePbModalOpen}
        onClose={() => setIsDeletePbModalOpen(false)}
        onConfirm={handleConfirmDeletePb}
        title={t('common.confirmDelete')}
        message={t('common.confirmDeleteMessage')}
      />

      <ConfirmModal
        isOpen={isDeleteEntryModalOpen}
        onClose={() => setIsDeleteEntryModalOpen(false)}
        onConfirm={handleConfirmDeleteEntry}
        title={t('common.confirmDelete')}
        message={t('common.confirmDeleteMessage')}
      />
    </div>
  );
}
