import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Button, Table, Thead, Tbody, Tr, Th, Td, Modal } from '../components/ui';
import { mockProducts, mockSkus, mockBundleGroups, mockBundleOptions } from '../data/mock';
import { Search, Plus, Package, Settings, ChevronRight, Check, Layers, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { BundleGroup, BundleOption } from '../types';

export function Bundles() {
  const { t } = useTranslation();
  
  // Find all SKUs that belong to a 'bundle' product
  const bundleProducts = mockProducts.filter(p => p.productType === 'bundle');
  const bundleSkus = mockSkus.filter(s => bundleProducts.some(p => p.id === s.productId));

  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(bundleSkus[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state for groups and options to allow editing
  const [groups, setGroups] = useState<BundleGroup[]>(mockBundleGroups);
  const [options, setOptions] = useState<BundleOption[]>(mockBundleOptions);

  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<BundleGroup | null>(null);
  const [editingOption, setEditingOption] = useState<BundleOption | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);

  const filteredSkus = bundleSkus.filter(sku => 
    sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSku = bundleSkus.find(s => s.id === selectedSkuId);
  const currentGroups = groups
    .filter(g => g.bundleSkuId === selectedSkuId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const getSkuName = (skuId: number) => {
    const sku = mockSkus.find(s => s.id === skuId);
    return sku ? `${sku.skuCode} - ${sku.name}` : 'Unknown';
  };

  const getPricingBadge = (type: string, value?: number) => {
    switch (type) {
      case 'included':
        return <Badge variant="success">{t('bundles.included')}</Badge>;
      case 'fixed_override':
        return <Badge variant="warning">{t('bundles.fixed_override')}: ${value}</Badge>;
      case 'price_adjustment':
        return <Badge variant="default">{t('bundles.price_adjustment')}: {value && value > 0 ? '+' : ''}${value}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Handlers for Group
  const handleSaveGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const groupData: Partial<BundleGroup> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      minSelections: parseInt(formData.get('minSelections') as string),
      maxSelections: parseInt(formData.get('maxSelections') as string),
      sortOrder: parseInt(formData.get('sortOrder') as string),
      isMutuallyExclusive: formData.get('isMutuallyExclusive') === 'on',
      allowMultipleQtyPerItem: formData.get('allowMultipleQtyPerItem') === 'on',
    };

    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...groupData } : g));
    } else {
      const newGroup: BundleGroup = {
        id: Math.max(0, ...groups.map(g => g.id)) + 1,
        bundleSkuId: selectedSkuId!,
        ...groupData as BundleGroup
      };
      setGroups([...groups, newGroup]);
    }
    setIsGroupModalOpen(false);
    setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: number) => {
    setGroups(groups.filter(g => g.id !== groupId));
    setOptions(options.filter(o => o.groupId !== groupId));
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
      setOptions(options.map(o => o.id === editingOption.id ? { ...o, ...optionData } : o));
    } else {
      const newOption: BundleOption = {
        id: Math.max(0, ...options.map(o => o.id)) + 1,
        bundleSkuId: selectedSkuId!,
        groupId: currentGroupId!,
        ...optionData as BundleOption
      };
      setOptions([...options, newOption]);
    }
    setIsOptionModalOpen(false);
    setEditingOption(null);
  };

  const handleDeleteOption = (optionId: number) => {
    setOptions(options.filter(o => o.id !== optionId));
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Panel: Bundle List */}
      <Card className="w-1/3 flex flex-col overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('bundles.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSkus.map(sku => (
            <button
              key={sku.id}
              onClick={() => setSelectedSkuId(sku.id)}
              className={clsx(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                selectedSkuId === sku.id 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
              )}
            >
              <div className={clsx(
                "p-2 rounded-md",
                selectedSkuId === sku.id ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-slate-100 dark:bg-slate-800"
              )}>
                <Package className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-medium truncate">{sku.name}</div>
                <div className="text-xs opacity-70 truncate">{sku.skuCode}</div>
              </div>
              <ChevronRight className={clsx(
                "w-4 h-4 transition-transform",
                selectedSkuId === sku.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              )} />
            </button>
          ))}
        </div>
      </Card>

      {/* Right Panel: Bundle Builder */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        {selectedSku ? (
          <>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedSku.name}
                  <Badge variant="default" className="ml-2">Bundle</Badge>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedSku.skuCode}</p>
              </div>
              <Button className="gap-2" onClick={() => { setEditingGroup(null); setIsGroupModalOpen(true); }}>
                <Plus className="w-4 h-4" /> {t('bundles.newGroup')}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {currentGroups.map(group => {
                const currentOptions = options
                  .filter(o => o.groupId === group.id)
                  .sort((a, b) => a.sortOrder - b.sortOrder);

                return (
                  <Card key={group.id} className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-indigo-500" />
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">{group.name}</h3>
                          {group.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{group.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Settings className="w-4 h-4" />
                          <span>{t('bundles.minMax')}: {group.minSelections} - {group.maxSelections}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingGroup(group); setIsGroupModalOpen(true); }}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteGroup(group.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => { setCurrentGroupId(group.id); setEditingOption(null); setIsOptionModalOpen(true); }}>
                            <Plus className="w-3.5 h-3.5" /> {t('bundles.addOption')}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Table>
                      <Thead>
                        <Tr>
                          <Th className="w-12 text-center">#</Th>
                          <Th>{t('bundles.component')}</Th>
                          <Th className="text-center">{t('bundles.isDefault')}</Th>
                          <Th>{t('bundles.pricingType')}</Th>
                          <Th className="w-20 text-right">{t('common.actions')}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {currentOptions.map((option, idx) => (
                          <Tr key={option.id} className="group">
                            <Td className="text-center text-slate-400">{idx + 1}</Td>
                            <Td className="font-medium text-slate-900 dark:text-slate-100">
                              {getSkuName(option.componentSkuId)}
                            </Td>
                            <Td className="text-center">
                              {option.isDefault ? (
                                <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
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
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingOption(option); setCurrentGroupId(group.id); setIsOptionModalOpen(true); }}>
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteOption(option.id)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </Td>
                          </Tr>
                        ))}
                        {currentOptions.length === 0 && (
                          <Tr>
                            <Td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">
                              {t('bundles.noOptions')}
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Card>
                );
              })}
              
              {currentGroups.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">{t('bundles.noGroups')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('bundles.noGroupsDesc')}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
            {t('bundles.selectBundle')}
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.groupName')}</label>
            <input name="name" defaultValue={editingGroup?.name} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.description')}</label>
            <textarea name="description" defaultValue={editingGroup?.description} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.minSelections')}</label>
              <input type="number" name="minSelections" defaultValue={editingGroup?.minSelections ?? 1} min={0} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.maxSelections')}</label>
              <input type="number" name="maxSelections" defaultValue={editingGroup?.maxSelections ?? 1} min={1} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.sortOrder')}</label>
            <input type="number" name="sortOrder" defaultValue={editingGroup?.sortOrder ?? 1} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isMutuallyExclusive" defaultChecked={editingGroup?.isMutuallyExclusive} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('bundles.isMutuallyExclusive')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="allowMultipleQtyPerItem" defaultChecked={editingGroup?.allowMultipleQtyPerItem} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('bundles.allowMultipleQtyPerItem')}</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.component')}</label>
            <select name="componentSkuId" defaultValue={editingOption?.componentSkuId} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
              <option value="">{t('bundles.selectSku')}</option>
              {mockSkus.filter(s => s.productId !== selectedSku?.productId).map(sku => (
                <option key={sku.id} value={sku.id}>{sku.skuCode} - {sku.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.sortOrder')}</label>
              <input type="number" name="sortOrder" defaultValue={editingOption?.sortOrder ?? 1} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isDefault" defaultChecked={editingOption?.isDefault} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{t('bundles.isDefault')}</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.pricingType')}</label>
            <select name="pricingType" defaultValue={editingOption?.pricingType ?? 'included'} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
              <option value="included">{t('bundles.included')}</option>
              <option value="fixed_override">{t('bundles.fixed_override')}</option>
              <option value="price_adjustment">{t('bundles.price_adjustment')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('bundles.pricingValue')}</label>
            <input type="number" step="0.01" name="pricingValue" defaultValue={editingOption?.pricingValue} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOptionModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
