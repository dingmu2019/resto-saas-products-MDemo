import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { BookOpen, Search, Plus, DollarSign, Tag, Globe, Calendar, ChevronRight, Edit2, Trash2, Check, Info } from 'lucide-react';
import { cn } from '../components/Layout';
import { PriceBook, PriceBookEntry } from '../types';

export function PriceBooks() {
  const { t } = useTranslation();
  const { priceBooks, setPriceBooks, priceBookEntries, setPriceBookEntries, skus } = useProductContext();
  const [activePbId, setActivePbId] = useState<number | null>(priceBooks[0]?.id || null);
  const [isPbModalOpen, setIsPbModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingPb, setEditingPb] = useState<PriceBook | null>(null);
  const [editingEntry, setEditingEntry] = useState<PriceBookEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPriceBooks = priceBooks.filter(pb => 
    pb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pb.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSkuCode = (id: number) => {
    return skus.find(s => s.id === id)?.skuCode || 'Unknown';
  };

  const activePb = priceBooks.find(pb => pb.id === activePbId);

  const handleOpenPbModal = (pb?: PriceBook) => {
    setEditingPb(pb || null);
    setIsPbModalOpen(true);
  };

  const handleOpenEntryModal = (entry?: PriceBookEntry) => {
    setEditingEntry(entry || null);
    setIsEntryModalOpen(true);
  };

  const handleDeletePb = (id: number) => {
    if (window.confirm(t('common.confirmDelete'))) {
      setPriceBooks(priceBooks.filter(pb => pb.id !== id));
      if (activePbId === id) setActivePbId(priceBooks.find(pb => pb.id !== id)?.id || null);
    }
  };

  const handleDeleteEntry = (id: number) => {
    if (window.confirm(t('common.confirmDelete'))) {
      setPriceBookEntries(priceBookEntries.filter(e => e.id !== id));
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
      priceDisplayPrecision: parseInt(formData.get('priceDisplayPrecision') as string) || 2,
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
      pricingStrategy: formData.get('pricingStrategy') as any,
      listPrice: parseFloat(formData.get('listPrice') as string),
      minPrice: formData.get('minPrice') ? parseFloat(formData.get('minPrice') as string) : undefined,
      maxDiscountRate: formData.get('maxDiscountRate') ? parseFloat(formData.get('maxDiscountRate') as string) / 100 : undefined,
      validFrom: formData.get('validFrom') as string,
      validTo: formData.get('validTo') as string || undefined,
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
              {filteredPriceBooks.map((pb) => (
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
                      {pb.name}
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
                      <span className="text-slate-400">{pb.partnerTier}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{pb.currency}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                  <Th className="w-40">{t('priceBook.skuCode')}</Th>
                  <Th className="w-32">{t('priceBook.strategy')}</Th>
                  <Th className="text-right">{t('priceBook.listPrice')}</Th>
                  <Th className="text-right">{t('priceBook.minPrice')}</Th>
                  <Th className="text-right">{t('priceBook.maxDiscount')}</Th>
                  <Th className="w-24 text-right">{t('sku.actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {priceBookEntries.filter(e => e.priceBookId === activePbId).map((entry) => (
                  <Tr key={entry.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <Td>
                      <span className="font-mono text-[11px] tracking-tight text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800/50">
                        {getSkuCode(entry.skuId)}
                      </span>
                    </Td>
                    <Td>
                      <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider">
                        {t(`priceBook.${entry.pricingStrategy}`)}
                      </Badge>
                    </Td>
                    <Td className="text-right font-bold text-slate-900 dark:text-white">
                      {activePb?.currency === 'USD' ? '$' : activePb?.currency === 'CNY' ? '¥' : ''}
                      {entry.listPrice.toLocaleString(undefined, { minimumFractionDigits: activePb?.priceDisplayPrecision || 2 })}
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
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-1">
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
                ))}
              </Tbody>
            </Table>
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
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
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

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              name="isActive" 
              defaultChecked={editingPb ? editingPb.isActive : true}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" 
            />
            <Label className="mb-0">{t('common.active')}</Label>
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
        title={editingEntry ? t('priceBook.editEntry') : t('priceBook.addEntry')}
      >
        <form onSubmit={handleEntrySubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('priceBook.skuCode')}</Label>
            <Select name="skuId" required defaultValue={editingEntry?.skuId}>
              <option value="">{t('sku.searchPlaceholder')}</option>
              {skus.map(s => (
                <option key={s.id} value={s.id}>{s.skuCode} - {s.name}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.strategy')}</Label>
              <Select name="pricingStrategy" required defaultValue={editingEntry?.pricingStrategy || 'flat_fee'}>
                <option value="flat_fee">{t('priceBook.flat_fee')}</option>
                <option value="per_unit">{t('priceBook.per_unit')}</option>
                <option value="tiered">{t('priceBook.tiered')}</option>
                <option value="volume">{t('priceBook.volume')}</option>
                <option value="percentage">{t('priceBook.percentage')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.listPrice')}</Label>
              <Input type="number" step="0.01" name="listPrice" required defaultValue={editingEntry?.listPrice} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.minPrice')}</Label>
              <Input type="number" step="0.01" name="minPrice" defaultValue={editingEntry?.minPrice} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.maxDiscount')} (%)</Label>
              <Input type="number" name="maxDiscountRate" defaultValue={editingEntry?.maxDiscountRate ? editingEntry.maxDiscountRate * 100 : ''} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('priceBook.validFrom')}</Label>
              <Input type="date" name="validFrom" required defaultValue={editingEntry?.validFrom?.split('T')[0] || new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('priceBook.validTo')}</Label>
              <Input type="date" name="validTo" defaultValue={editingEntry?.validTo?.split('T')[0]} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsEntryModalOpen(false)} className="border-slate-200 dark:border-slate-800">{t('common.cancel')}</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
