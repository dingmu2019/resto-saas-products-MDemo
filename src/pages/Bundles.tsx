import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Button, Table, Thead, Tbody, Tr, Th, Td, Modal, Input, Select, Label, Textarea, Pagination, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Search, Plus, Package, Settings, ChevronRight, Check, Layers, Edit2, Trash2, Box, Globe } from 'lucide-react';
import { cn } from '../components/Layout';
import { BundleGroup, BundleOption } from '../types';

export function Bundles() {
  const { t } = useTranslation();
  const { 
    products, 
    skus, 
    bundleGroups, 
    setBundleGroups, 
    bundleOptions, 
    setBundleOptions 
  } = useProductContext();
  
  // Find all SKUs that belong to a 'bundle' product
  const bundleProducts = products.filter(p => p.productType === 'bundle');
  const bundleSkus = skus.filter(s => bundleProducts.some(p => p.id === s.productId));

  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(bundleSkus[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [isDeleteOptionModalOpen, setIsDeleteOptionModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<BundleGroup | null>(null);
  const [editingOption, setEditingOption] = useState<BundleOption | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [optionToDelete, setOptionToDelete] = useState<number | null>(null);

  const filteredSkus = useMemo(() => {
    return bundleSkus.filter(sku => 
      sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bundleSkus, searchQuery]);

  const paginatedSkus = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSkus.slice(start, start + pageSize);
  }, [filteredSkus, currentPage, pageSize]);

  const selectedSku = bundleSkus.find(s => s.id === selectedSkuId);
  const currentGroups = bundleGroups
    .filter(g => g.bundleSkuId === selectedSkuId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const getSkuName = (skuId: number) => {
    const sku = skus.find(s => s.id === skuId);
    return sku ? `${sku.skuCode} - ${sku.name}` : t('common.unknown');
  };

  const getPricingBadge = (type: string, value?: number) => {
    switch (type) {
      case 'included':
        return <Badge variant="success" className="text-[10px] uppercase tracking-wider">{t('bundles.included')}</Badge>;
      case 'fixed_override':
        return <Badge variant="warning" className="text-[10px] uppercase tracking-wider">{t('bundles.fixed_override')}: ${value}</Badge>;
      case 'price_adjustment':
        return <Badge variant="info" className="text-[10px] uppercase tracking-wider">{t('bundles.price_adjustment')}: {value && value > 0 ? '+' : ''}${value}</Badge>;
      default:
        return <Badge className="text-[10px] uppercase tracking-wider">{type}</Badge>;
    }
  };

  // Handlers for Group
  const handleSaveGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const groupData: Partial<BundleGroup> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      selectN: parseInt(formData.get('selectN') as string),
      sortOrder: parseInt(formData.get('sortOrder') as string),
      allowMultipleQtyPerItem: formData.get('allowMultipleQtyPerItem') === 'on',
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

    if (editingGroup) {
      setBundleGroups(bundleGroups.map(g => g.id === editingGroup.id ? { ...g, ...groupData } : g));
    } else {
      const newGroup: BundleGroup = {
        id: Math.max(0, ...bundleGroups.map(g => g.id)) + 1,
        bundleSkuId: selectedSkuId!,
        ...groupData as BundleGroup
      };
      setBundleGroups([...bundleGroups, newGroup]);
    }
    setIsGroupModalOpen(false);
    setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: number) => {
    setGroupToDelete(groupId);
    setIsDeleteGroupModalOpen(true);
  };

  const handleConfirmDeleteGroup = () => {
    if (groupToDelete !== null) {
      setBundleGroups(bundleGroups.filter(g => g.id !== groupToDelete));
      setBundleOptions(bundleOptions.filter(o => o.groupId !== groupToDelete));
      setGroupToDelete(null);
    }
  };

  // Handlers for Option
  const handleSaveOption = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const optionData: Partial<BundleOption> = {
      componentSkuId: parseInt(formData.get('componentSkuId') as string),
      isDefault: formData.get('isDefault') === 'on',
      sortOrder: parseInt(formData.get('sortOrder') as string),
      pricingType: formData.get('pricingType') as any,
      pricingValue: formData.get('pricingValue') ? parseFloat(formData.get('pricingValue') as string) : undefined,
    };

    if (editingOption) {
      setBundleOptions(bundleOptions.map(o => o.id === editingOption.id ? { ...o, ...optionData } : o));
    } else {
      const newOption: BundleOption = {
        id: Math.max(0, ...bundleOptions.map(o => o.id)) + 1,
        bundleSkuId: selectedSkuId!,
        groupId: currentGroupId!,
        ...optionData as BundleOption
      };
      setBundleOptions([...bundleOptions, newOption]);
    }
    setIsOptionModalOpen(false);
    setEditingOption(null);
  };

  const handleDeleteOption = (optionId: number) => {
    setOptionToDelete(optionId);
    setIsDeleteOptionModalOpen(true);
  };

  const handleConfirmDeleteOption = () => {
    if (optionToDelete !== null) {
      setBundleOptions(bundleOptions.filter(o => o.id !== optionToDelete));
      setOptionToDelete(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Panel: Bundle List */}
      <Card className="w-1/3 flex flex-col overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('bundles.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {paginatedSkus.map(sku => (
            <button
              key={sku.id}
              onClick={() => setSelectedSkuId(sku.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group",
                selectedSkuId === sku.id 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800" 
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
              )}
            >
              <div className={cn(
                "p-2 rounded-md transition-colors",
                selectedSkuId === sku.id ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
              )}>
                <Package className={cn(
                  "w-4 h-4 transition-colors",
                  selectedSkuId === sku.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                )} />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-sm truncate">{sku.name}</div>
                <div className="text-[10px] font-mono opacity-60 truncate tracking-tighter">{sku.skuCode}</div>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-all",
                selectedSkuId === sku.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              )} />
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
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


      {/* Right Panel: Bundle Builder */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-slate-50/30 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        {selectedSku ? (
          <>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedSku.name}
                    <Badge variant="info" className="text-[10px] uppercase tracking-wider">Bundle</Badge>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {selectedSku.skuCode}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-tighter">ID: {selectedSku.id}</span>
                  </div>
                </div>
              </div>
              <Button className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => { setEditingGroup(null); setIsGroupModalOpen(true); }}>
                <Plus className="w-4 h-4" /> {t('bundles.newGroup')}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {currentGroups.map(group => {
                const currentOptions = bundleOptions
                  .filter(o => o.groupId === group.id)
                  .sort((a, b) => a.sortOrder - b.sortOrder);

                return (
                  <Card key={group.id} className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-950/50">
                    <div className="bg-slate-50/80 dark:bg-slate-900/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <Layers className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{group.name}</h3>
                          {group.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{group.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          <Settings className="w-3.5 h-3.5" />
                          <span>
                            {t('bundles.groupSelection', {
                              m: bundleOptions.filter(o => o.groupId === group.id).length,
                              n: group.selectN,
                              allowMultiple: group.allowMultipleQtyPerItem ? t('bundles.allowMultipleTrue') : t('bundles.allowMultipleFalse')
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-400 hover:text-indigo-600" onClick={() => { setEditingGroup(group); setIsGroupModalOpen(true); }}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" onClick={() => handleDeleteGroup(group.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-slate-200 dark:border-slate-800 text-xs" onClick={() => { setCurrentGroupId(group.id); setEditingOption(null); setIsOptionModalOpen(true); }}>
                            <Plus className="w-3.5 h-3.5" /> {t('bundles.addOption')}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Table>
                      <Thead>
                        <Tr className="bg-slate-50/30 dark:bg-slate-800/10">
                          <Th className="w-12 text-center text-[10px] uppercase tracking-wider">#</Th>
                          <Th className="text-[10px] uppercase tracking-wider">{t('bundles.component')}</Th>
                          <Th className="text-[10px] uppercase tracking-wider">{t('sku.uom')}</Th>
                          <Th className="text-center text-[10px] uppercase tracking-wider">{t('bundles.isDefault')}</Th>
                          <Th className="text-[10px] uppercase tracking-wider">{t('bundles.pricingType')}</Th>
                          <Th className="w-24 text-right text-[10px] uppercase tracking-wider">{t('bundles.pricingValue')}</Th>
                          <Th className="w-24 text-right text-[10px] uppercase tracking-wider">{t('common.actions')}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {currentOptions.map((option, idx) => {
                          const sku = skus.find(s => s.id === option.componentSkuId);
                          return (
                            <Tr key={option.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                              <Td className="text-center text-[11px] font-mono text-slate-400">{idx + 1}</Td>
                              <Td>
                                <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                  {sku?.name || 'Unknown'}
                                </div>
                                <div className="text-[10px] font-mono text-slate-400">{sku?.skuCode}</div>
                              </Td>
                              <Td>
                                <span className="text-[10px] text-slate-500">{sku?.uom || '-'}</span>
                              </Td>
                              <Td className="text-center">
                                {option.isDefault ? (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10">
                                    <Check className="w-3 h-3" />
                                  </div>
                                ) : (
                                  <span className="text-slate-300 dark:text-slate-700">-</span>
                                )}
                              </Td>
                              <Td>
                                {getPricingBadge(option.pricingType, option.pricingValue)}
                              </Td>
                              <Td className="text-right">
                                <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                                  {option.pricingType === 'included' ? '-' : option.pricingValue}
                                </span>
                              </Td>
                              <Td className="text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-400 hover:text-indigo-600" onClick={() => { setEditingOption(option); setCurrentGroupId(group.id); setIsOptionModalOpen(true); }}>
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" onClick={() => handleDeleteOption(option.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </Td>
                            </Tr>
                          );
                        })}
                        {currentOptions.length === 0 && (
                          <Tr>
                            <Td colSpan={7} className="text-center py-10">
                              <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
                                <Box className="w-8 h-8 opacity-20" />
                                <span className="text-xs italic">{t('bundles.noOptions')}</span>
                              </div>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Card>
                );
              })}
              
              {currentGroups.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-950/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <Package className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('bundles.noGroups')}</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">{t('bundles.noGroupsDesc')}</p>
                  <Button className="mt-6 gap-2" onClick={() => { setEditingGroup(null); setIsGroupModalOpen(true); }}>
                    <Plus className="w-4 h-4" /> {t('bundles.newGroup')}
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-950/20">
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-full mb-4">
              <Package className="w-12 h-12 opacity-20" />
            </div>
            <p className="text-lg font-medium">{t('bundles.selectBundle')}</p>
            <p className="text-sm opacity-60 mt-1">{t('bundles.selectBundleDesc')}</p>
          </div>
        )}
      </Card>

      {/* Group Modal */}
      <Modal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        title={editingGroup ? t('bundles.editGroup') : t('bundles.newGroup')}
      >
        <form onSubmit={handleSaveGroup} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('bundles.groupName')}</Label>
            <Input name="name" defaultValue={editingGroup?.name} required />
          </div>
          <div className="space-y-2">
            <Label>{t('bundles.description')}</Label>
            <Textarea name="description" defaultValue={editingGroup?.description} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('bundles.selectN')}</Label>
              <Input type="number" name="selectN" defaultValue={editingGroup?.selectN ?? 1} min={1} required />
            </div>
            <div className="space-y-2">
              <Label>{t('bundles.sortOrder')}</Label>
              <Input type="number" name="sortOrder" defaultValue={editingGroup?.sortOrder ?? 1} required />
            </div>
          </div>
          <div className="flex flex-col gap-3 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="allowMultipleQtyPerItem" defaultChecked={editingGroup?.allowMultipleQtyPerItem} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{t('bundles.allowMultipleQtyPerItem')}</span>
            </label>
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
                  defaultValue={editingGroup?.translations?.en?.name || ''} 
                  placeholder="English Name" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.name')} (ZH)</Label>
                <Input 
                  name="name_zh"
                  defaultValue={editingGroup?.translations?.zh?.name || ''} 
                  placeholder="中文名称" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (EN)</Label>
                <Textarea 
                  name="description_en"
                  defaultValue={editingGroup?.translations?.en?.description || ''} 
                  placeholder="English Description" 
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (ZH)</Label>
                <Textarea 
                  name="description_zh"
                  defaultValue={editingGroup?.translations?.zh?.description || ''} 
                  placeholder="中文描述" 
                  rows={2}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsGroupModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Option Modal */}
      <Modal 
        isOpen={isOptionModalOpen} 
        onClose={() => setIsOptionModalOpen(false)} 
        title={editingOption ? t('bundles.editOption') : t('bundles.addOption')}
      >
        <form onSubmit={handleSaveOption} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('bundles.component')}</Label>
            <Select name="componentSkuId" defaultValue={editingOption?.componentSkuId} required>
              <option value="">{t('bundles.selectSku')}</option>
              {skus.filter(s => s.productId !== selectedSku?.productId).map(sku => (
                <option key={sku.id} value={sku.id}>{sku.skuCode} - {sku.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('bundles.sortOrder')}</Label>
              <Input type="number" name="sortOrder" defaultValue={editingOption?.sortOrder ?? 1} required />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" name="isDefault" defaultChecked={editingOption?.isDefault} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{t('bundles.isDefault')}</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('bundles.pricingType')}</Label>
            <Select name="pricingType" defaultValue={editingOption?.pricingType ?? 'included'} required>
              <option value="included">{t('bundles.included')}</option>
              <option value="fixed_override">{t('bundles.fixed_override')}</option>
              <option value="price_adjustment">{t('bundles.price_adjustment')}</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('bundles.pricingValue')}</Label>
            <Input type="number" step="0.01" name="pricingValue" defaultValue={editingOption?.pricingValue} />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsOptionModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteGroupModalOpen}
        onClose={() => setIsDeleteGroupModalOpen(false)}
        onConfirm={handleConfirmDeleteGroup}
        title={t('common.confirmDelete')}
        message={t('common.confirmDeleteMessage')}
      />

      <ConfirmModal
        isOpen={isDeleteOptionModalOpen}
        onClose={() => setIsDeleteOptionModalOpen(false)}
        onConfirm={handleConfirmDeleteOption}
        title={t('common.confirmDelete')}
        message={t('common.confirmDeleteMessage')}
      />
    </div>
  );
}
