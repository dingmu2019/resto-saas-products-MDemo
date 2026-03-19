import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, Textarea } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Layers, Plus, Search, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '../components/Layout';
import { Category } from '../types';

export function Categories() {
  const { t } = useTranslation();
  const { categories, setCategories } = useProductContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Sort categories by path to ensure parents come before children
  const sortedCategories = [...categories]
    .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || cat.code.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.path.localeCompare(b.path));

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm(t('common.confirmDelete'))) {
      setCategories(categories.filter(c => c.id !== id));
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
            {sortedCategories.map((cat) => (
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
                      {cat.name}
                    </span>
                  </div>
                </Td>
                <Td className="font-mono text-[11px] tracking-tight text-indigo-600 dark:text-indigo-400">
                  <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800/50">
                    {cat.code}
                  </span>
                </Td>
                <Td className="text-slate-500 text-xs max-w-xs truncate">{cat.description}</Td>
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
                      onClick={() => handleDeleteCategory(cat.id)}
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
              <option value="">{t('category.none')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
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
    </div>
  );
}
