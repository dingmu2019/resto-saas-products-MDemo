import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Button, Table, Thead, Tbody, Tr, Th, Td } from '../components/ui';
import { mockProducts, mockSkus, mockBundleGroups, mockBundleOptions } from '../data/mock';
import { Search, Plus, Package, Settings, ChevronRight, Check, Layers } from 'lucide-react';
import { clsx } from 'clsx';

export function Bundles() {
  const { t } = useTranslation();
  
  // Find all SKUs that belong to a 'bundle' product
  const bundleProducts = mockProducts.filter(p => p.productType === 'bundle');
  const bundleSkus = mockSkus.filter(s => bundleProducts.some(p => p.id === s.productId));

  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(bundleSkus[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkus = bundleSkus.filter(sku => 
    sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSku = bundleSkus.find(s => s.id === selectedSkuId);
  const groups = mockBundleGroups
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
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> {t('bundles.newGroup')}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {groups.map(group => {
                const options = mockBundleOptions
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
                        <Button variant="outline" size="sm" className="h-8 gap-1.5">
                          <Plus className="w-3.5 h-3.5" /> {t('bundles.addOption')}
                        </Button>
                      </div>
                    </div>
                    
                    <Table>
                      <Thead>
                        <Tr>
                          <Th className="w-12 text-center">#</Th>
                          <Th>{t('bundles.component')}</Th>
                          <Th className="text-center">{t('bundles.isDefault')}</Th>
                          <Th>{t('bundles.pricingType')}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {options.map((option, idx) => (
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
                          </Tr>
                        ))}
                        {options.length === 0 && (
                          <Tr>
                            <Td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">
                              No options configured for this group.
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Card>
                );
              })}
              
              {groups.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No Groups Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400">Add your first option group to start building this bundle.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Select a bundle from the list to view its configuration.
          </div>
        )}
      </Card>
    </div>
  );
}
