import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, Textarea, Pagination, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Layers, Plus, Search, Edit2, Trash2, ChevronRight, Globe } from 'lucide-react';
import { cn } from '../components/Layout';
import { Category } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function Categories() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { categories, setCategories } = useProductContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sort and filter categories
  const filteredCategories = useMemo(() => {
    return [...categories]
      .filter(cat => 
        getTranslatedField(cat, 'name', currentLang).toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.path.localeCompare(b.path));
  }, [categories, searchQuery, currentLang]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete !== null) {
      setCategories(categories.filter(c => c.id !== categoryToDelete));
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const parentId = formData.get('parentId') ? parseInt(formData.get('parentId') as string) : null;
    const parent = categories.find(c => c.id === parentId);
    const level = parent ? parent.level + 1 : 1;
    const code = formData.get('code') as string;
    const path = parent ? `${parent.path}/${code}` : code;

    const categoryData: Partial<Category> = {
      parentId,
      code,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      level,
      path,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
      translations: {
        en: {
          name: formData.get('name_en') as string || (formData.get('name') as string),
          description: formData.get('description_en') as string || (formData.get('description') as string)
        },
        zh: {
          name: formData.get('name_zh') as string || (formData.get('name') as string),
          description: formData.get('description_zh') as string || (formData.get('description') as string)
        }
      }
    };

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryData } : c));
    } else {
      const newCategory: Category = {
        ...categoryData as Category,
        id: Math.max(0, ...categories.map(c => c.id)) + 1,
      };
      setCategories([...categories, newCategory]);
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
              placeholder={t('category.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 transition-all"
            />
          </div>
        </div>
        <Button className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> {t('category.newCategory')}
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {t('category.title')}
        </div>
        <Table>
          <Thead>
            <Tr className="bg-slate-50/30 dark:bg-slate-800/10">
              <Th>{t('category.name')}</Th>
              <Th className="w-40">{t('category.code')}</Th>
              <Th>{t('category.description')}</Th>
              <Th className="w-24">{t('category.level')}</Th>
              <Th className="w-32">{t('category.status')}</Th>
              <Th className="w-32 text-right">{t('sku.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedCategories.map((cat) => (
              <Tr key={cat.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <Td>
                  <div className="flex items-center" style={{ paddingLeft: `${(cat.level - 1) * 24}px` }}>
                    {cat.level > 1 && (
                      <div className="w-4 h-4 mr-2 border-l-2 border-b-2 border-slate-200 dark:border-slate-700 rounded-bl" />
                    )}
                    <span className={cn(
                      "font-medium",
                      cat.level === 1 ? "text-slate-900 dark:text-white text-base" : "text-slate-600 dark:text-slate-300 text-sm"
                    )}>
                      {getTranslatedField(cat, 'name', currentLang)}
                    </span>
                  </div>
                </Td>
                <Td className="font-mono text-[11px] tracking-tight text-indigo-600 dark:text-indigo-400">
                  <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800/50">
                    {cat.code}
                  </span>
                </Td>
                <Td className="text-slate-500 text-xs max-w-xs">{getTranslatedField(cat, 'description', currentLang)}</Td>
                <Td>
                  <Badge variant="outline" className="text-[10px] font-mono">L{cat.level}</Badge>
                </Td>
                <Td>
                  <Badge variant={cat.isActive ? 'success' : 'default'} className="text-[10px]">
                    {cat.isActive ? t('common.active') : t('common.inactive')}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenModal(cat)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteClick(cat.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
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
            totalItems={filteredCategories.length}
            totalPages={Math.ceil(filteredCategories.length / pageSize)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? t('category.editCategory') : t('category.newCategory')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('category.parentCategory')}</Label>
            <Select name="parentId" defaultValue={editingCategory?.parentId || ''}>
              <option value="">{t('common.none')}</option>
              {categories
                .filter(c => c.id !== editingCategory?.id)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {getTranslatedField(c, 'name', currentLang)} ({c.code})
                  </option>
                ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('category.code')}</Label>
              <Input name="code" required defaultValue={editingCategory?.code} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('category.name')}</Label>
              <Input name="name" required defaultValue={editingCategory?.name} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('category.description')}</Label>
            <Textarea name="description" defaultValue={editingCategory?.description} />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              {t('common.translations')}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.name')} (EN)</Label>
                <Input name="name_en" defaultValue={editingCategory?.translations?.en?.name} placeholder="English Name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.name')} (ZH)</Label>
                <Input name="name_zh" defaultValue={editingCategory?.translations?.zh?.name} placeholder="中文名称" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (EN)</Label>
                <Input name="description_en" defaultValue={editingCategory?.translations?.en?.description} placeholder="English Description" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (ZH)</Label>
                <Input name="description_zh" defaultValue={editingCategory?.translations?.zh?.description} placeholder="中文描述" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('category.sortOrder')}</Label>
              <Input type="number" name="sortOrder" defaultValue={editingCategory?.sortOrder || 0} />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={editingCategory ? editingCategory.isActive : true}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" 
              />
              <Label className="mb-0">{t('common.active')}</Label>
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
        message={t('category.deleteConfirmMessage')}
      />
    </div>
  );
}
