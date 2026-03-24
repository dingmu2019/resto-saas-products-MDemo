import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, ShieldCheck, Edit2, Trash2, Package, ListChecks } from 'lucide-react';
import { ProductEntitlement } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function Entitlements() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { entitlements, setEntitlements, skus, features } = useProductContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState<ProductEntitlement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entitlementToDelete, setEntitlementToDelete] = useState<number | null>(null);

  const filteredEntitlements = useMemo(() => {
    return entitlements.filter(ent => {
      const sku = skus.find(s => s.id === ent.skuId);
      const feature = features.find(f => f.code === ent.featureCode);
      const searchStr = `${sku ? getTranslatedField(sku, 'name', currentLang) : ''} ${feature ? getTranslatedField(feature, 'name', currentLang) : ''} ${ent.featureCode}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });
  }, [entitlements, skus, features, searchQuery]);

  const handleSaveEntitlement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const entitlementData: Partial<ProductEntitlement> = {
      skuId: Number(formData.get('skuId')),
      featureCode: formData.get('featureCode') as string,
      entitlementType: formData.get('type') as any,
      quotaValue: formData.get('quotaValue') ? Number(formData.get('quotaValue')) : undefined,
      tierValue: formData.get('tierValue') as string || undefined,
      status: formData.get('status') as any,
    };

    if (editingEntitlement) {
      setEntitlements(entitlements.map(ent => ent.id === editingEntitlement.id ? { ...ent, ...entitlementData } : ent));
    } else {
      const newEntitlement: ProductEntitlement = {
        id: Math.max(0, ...entitlements.map(ent => ent.id)) + 1,
        ...entitlementData as ProductEntitlement
      };
      setEntitlements([...entitlements, newEntitlement]);
    }
    setIsModalOpen(false);
    setEditingEntitlement(null);
  };

  const handleDeleteEntitlement = (id: number) => {
    setEntitlementToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (entitlementToDelete !== null) {
      setEntitlements(entitlements.filter(ent => ent.id !== entitlementToDelete));
      setEntitlementToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('common.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 transition-all"
            />
          </div>
        </div>
        <Button className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => { setEditingEntitlement(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" /> {t('product.addEntitlement')}
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
        <Table>
          <Thead>
            <Tr className="bg-slate-50/50 dark:bg-slate-800/20">
              <Th className="w-64">{t('app.skus')}</Th>
              <Th className="w-64">{t('app.features')}</Th>
              <Th className="w-40">{t('features.type')}</Th>
              <Th>{t('sku.quotaValue')} / {t('sku.tierValue')}</Th>
              <Th className="w-32">{t('common.status')}</Th>
              <Th className="text-right">{t('common.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEntitlements.map((ent) => {
              const sku = skus.find(s => s.id === ent.skuId);
              const feature = features.find(f => f.code === ent.featureCode);
              return (
                <Tr key={ent.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <div className="font-medium text-slate-900 dark:text-white">{sku ? getTranslatedField(sku, 'name', currentLang) : 'Unknown SKU'}</div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{feature ? getTranslatedField(feature, 'name', currentLang) : ent.featureCode}</div>
                        <div className="text-xs text-slate-500 font-mono">{ent.featureCode}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={ent.entitlementType === 'boolean' ? 'success' : ent.entitlementType === 'quota' ? 'warning' : 'info'} className="text-[10px] uppercase tracking-wider">
                      {t(`features.${ent.entitlementType}`)}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="font-mono text-sm">
                      {ent.entitlementType === 'boolean' ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      ) : ent.entitlementType === 'quota' ? (
                        <span>{ent.quotaValue || 0}</span>
                      ) : (
                        <span>{ent.tierValue || '-'}</span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={ent.status === 'active' ? 'success' : 'secondary'}>
                      {t(`common.${ent.status}`)}
                    </Badge>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingEntitlement(ent); setIsModalOpen(true); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDeleteEntitlement(ent.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingEntitlement ? t('product.editEntitlement') : t('product.addEntitlement')}
      >
        <form onSubmit={handleSaveEntitlement} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('app.skus')}</Label>
            <Select name="skuId" defaultValue={editingEntitlement?.skuId} required>
              <option value="">{t('sku.selectSku')}</option>
              {skus.map(sku => (
                <option key={sku.id} value={sku.id}>{getTranslatedField(sku, 'name', currentLang)}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('app.features')}</Label>
            <Select name="featureCode" defaultValue={editingEntitlement?.featureCode} required>
              <option value="">{t('features.selectFeature')}</option>
              {features.map(f => (
                <option key={f.id} value={f.code}>{getTranslatedField(f, 'name', currentLang)} ({f.code})</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('features.type')}</Label>
            <Select name="entitlementType" defaultValue={editingEntitlement?.entitlementType || 'boolean'} required>
              <option value="boolean">{t('features.boolean')}</option>
              <option value="quota">{t('features.quota')}</option>
              <option value="tier">{t('features.tier')}</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('sku.quotaValue')}</Label>
              <Input name="quotaValue" type="number" defaultValue={editingEntitlement?.quotaValue} placeholder="e.g. 100" />
            </div>
            <div className="space-y-2">
              <Label>{t('sku.tierValue')}</Label>
              <Input name="tierValue" defaultValue={editingEntitlement?.tierValue} placeholder="e.g. Gold" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('common.status')}</Label>
            <Select name="status" defaultValue={editingEntitlement?.status || 'active'} required>
              <option value="active">{t('common.active')}</option>
              <option value="inactive">{t('common.inactive')}</option>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete')}
        message={t('common.confirmDelete')}
        variant="danger"
      />
    </div>
  );
}
