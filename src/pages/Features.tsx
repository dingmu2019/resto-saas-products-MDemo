import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, Textarea, Pagination, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, CheckCircle2, BarChart3, Layers, Edit2, Trash2 } from 'lucide-react';
import { ProductFeature } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function Features() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { features, setFeatures } = useProductContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<ProductFeature | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<number | null>(null);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'boolean': 
        return (
          <Badge variant="success" className="text-[10px] uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {t('features.boolean')}
          </Badge>
        );
      case 'quota': 
        return (
          <Badge variant="warning" className="text-[10px] uppercase tracking-wider flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {t('features.quota')}
          </Badge>
        );
      case 'tier': 
        return (
          <Badge variant="info" className="text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {t('features.tier')}
          </Badge>
        );
      default: return <Badge className="text-[10px] uppercase tracking-wider">{type}</Badge>;
    }
  };

  const filteredFeatures = features.filter(feature => 
    getTranslatedField(feature, 'name', currentLang).toLowerCase().includes(searchQuery.toLowerCase()) || 
    feature.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedFeatures = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFeatures.slice(start, start + pageSize);
  }, [filteredFeatures, currentPage, pageSize]);

  const handleSaveFeature = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const featureData: Partial<ProductFeature> = {
      code: formData.get('code') as string,
      name: formData.get('name_en') as string || formData.get('name') as string,
      type: formData.get('type') as any,
      description: formData.get('description_en') as string || formData.get('description') as string,
      translations: {
        en: { 
          name: formData.get('name_en') as string,
          description: formData.get('description_en') as string
        },
        zh: { 
          name: formData.get('name_zh') as string,
          description: formData.get('description_zh') as string
        }
      }
    };

    if (editingFeature) {
      setFeatures(features.map(f => f.id === editingFeature.id ? { ...f, ...featureData } : f));
    } else {
      const newFeature: ProductFeature = {
        id: Math.max(0, ...features.map(f => f.id)) + 1,
        ...featureData as ProductFeature
      };
      setFeatures([...features, newFeature]);
    }
    setIsModalOpen(false);
    setEditingFeature(null);
  };

  const handleDeleteFeature = (id: number) => {
    setFeatureToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (featureToDelete !== null) {
      setFeatures(features.filter(f => f.id !== featureToDelete));
      setFeatureToDelete(null);
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
              placeholder={t('features.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 transition-all"
            />
          </div>
        </div>
        <Button className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => { setEditingFeature(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" /> {t('features.newFeature')}
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
        <Table>
          <Thead>
            <Tr className="bg-slate-50/50 dark:bg-slate-800/20">
              <Th className="w-48">{t('features.code')}</Th>
              <Th className="w-64">{t('features.name')}</Th>
              <Th className="w-40">{t('features.type')}</Th>
              <Th>{t('features.description')}</Th>
              <Th className="text-right">{t('common.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedFeatures.map((feature) => (
              <Tr key={feature.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <Td>
                  <span className="font-mono text-[11px] tracking-tight text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800/50">
                    {feature.code}
                  </span>
                </Td>
                <Td>
                  <div className="font-medium text-slate-900 dark:text-white">{getTranslatedField(feature, 'name', currentLang)}</div>
                </Td>
                <Td>{getTypeBadge(feature.type)}</Td>
                <Td>
                  <div className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {getTranslatedField(feature, 'description', currentLang)}
                  </div>
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingFeature(feature); setIsModalOpen(true); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDeleteFeature(feature.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredFeatures.length}
            totalPages={Math.ceil(filteredFeatures.length / pageSize)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingFeature ? t('features.editFeature') : t('features.newFeature')}
      >
        <form onSubmit={handleSaveFeature} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('features.code')}</Label>
            <Input name="code" defaultValue={editingFeature?.code} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('features.nameEn')}</Label>
              <Input name="name_en" defaultValue={editingFeature?.translations?.en?.name || editingFeature?.name} required />
            </div>
            <div className="space-y-2">
              <Label>{t('features.nameZh')}</Label>
              <Input name="name_zh" defaultValue={editingFeature?.translations?.zh?.name || editingFeature?.name} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('features.type')}</Label>
            <Select name="type" defaultValue={editingFeature?.type} required>
              <option value="boolean">{t('features.boolean')}</option>
              <option value="quota">{t('features.quota')}</option>
              <option value="tier">{t('features.tier')}</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('features.descriptionEn')}</Label>
              <Textarea name="description_en" defaultValue={editingFeature?.translations?.en?.description || editingFeature?.description} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>{t('features.descriptionZh')}</Label>
              <Textarea name="description_zh" defaultValue={editingFeature?.translations?.zh?.description || editingFeature?.description} rows={3} />
            </div>
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
        title={t('features.deleteFeature')}
        message={t('features.confirmDelete')}
        variant="danger"
      />
    </div>
  );
}
