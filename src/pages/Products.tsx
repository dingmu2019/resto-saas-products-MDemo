import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Textarea, Label, Pagination, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, Filter, Edit2, Trash2, ChevronRight, Globe } from 'lucide-react';
import { Product } from '../types';

export function Products() {
  const { t } = useTranslation();
  const { products, setProducts, categories } = useProductContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    productCode: '',
    productType: 'software',
    categoryId: categories[0]?.id || 0,
    brand: '',
    description: ''
  });

  const getCategoryPath = (id: number) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return 'Unknown';
    return cat.path.split('/').filter(Boolean).map(pId => {
      return categories.find(c => c.id === Number(pId))?.name || pId;
    }).join(' > ');
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'software': return <Badge variant="success">{t('product.software')}</Badge>;
      case 'hardware': return <Badge variant="warning">{t('product.hardware')}</Badge>;
      case 'consumable': return <Badge variant="outline">{t('product.consumable')}</Badge>;
      case 'bundle': return <Badge variant="default">{t('product.bundle')}</Badge>;
      case 'service': return <Badge variant="info">{t('product.service')}</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        productCode: '',
        productType: 'software',
        categoryId: categories[0]?.id || 0,
        brand: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.max(0, ...products.map(p => p.id)) + 1
      } as Product;
      setProducts([...products, newProduct]);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete !== null) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('product.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 transition-all"
            />
          </div>
          <Button variant="outline" className="gap-2 border-dashed">
            <Filter className="w-4 h-4" /> {t('common.filter')}
          </Button>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shadow-lg shadow-indigo-500/20">
          <Plus className="w-4 h-4" /> {t('product.newProduct')}
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
        <Table>
          <Thead>
            <Tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <Th className="w-40">{t('product.code')}</Th>
              <Th>{t('product.name')}</Th>
              <Th>{t('app.categories')}</Th>
              <Th className="w-32">{t('product.type')}</Th>
              <Th className="w-32">{t('product.brand')}</Th>
              <Th className="text-right w-40">{t('product.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProducts.map((product) => (
              <Tr key={product.id} className="group cursor-pointer">
                <Td className="font-mono text-[11px] tracking-tight text-slate-500 dark:text-slate-400">
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    {product.productCode}
                  </span>
                </Td>
                <Td>
                  <div className="flex flex-col">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      {product.name}
                    </button>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{product.description}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {getCategoryPath(product.categoryId)}
                  </div>
                </Td>
                <Td>{getTypeBadge(product.productType)}</Td>
                <Td>
                  {product.brand ? (
                    <span className="text-xs font-medium px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded">
                      {product.brand}
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-700">-</span>
                  )}
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.preventDefault(); handleOpenModal(product); }}
                      className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.preventDefault(); handleDeleteClick(product.id); }}
                      className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            totalPages={Math.ceil(filteredProducts.length / pageSize)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingProduct ? t('product.editProduct') : t('product.newProduct')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('product.name')}</Label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('product.namePlaceholder')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('product.code')}</Label>
              <Input 
                required
                value={formData.productCode}
                onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                placeholder={t('product.codePlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('product.type')}</Label>
              <Select 
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
              >
                <option value="software">{t('product.software')}</option>
                <option value="hardware">{t('product.hardware')}</option>
                <option value="consumable">{t('product.consumable')}</option>
                <option value="bundle">{t('product.bundle')}</option>
                <option value="service">{t('product.service')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('app.categories')}</Label>
              <Select 
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('product.brand')}</Label>
            <Input 
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder={t('product.brandPlaceholder')}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t('product.description')}</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('product.descriptionPlaceholder')}
            />
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
                  value={(formData as any).translations?.en?.name || ''} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    translations: { 
                      ...(formData as any).translations, 
                      en: { ...(formData as any).translations?.en, name: e.target.value } 
                    } 
                  })}
                  placeholder="English Name" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.name')} (ZH)</Label>
                <Input 
                  value={(formData as any).translations?.zh?.name || ''} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    translations: { 
                      ...(formData as any).translations, 
                      zh: { ...(formData as any).translations?.zh, name: e.target.value } 
                    } 
                  })}
                  placeholder="中文名称" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (EN)</Label>
                <Textarea 
                  value={(formData as any).translations?.en?.description || ''} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    translations: { 
                      ...(formData as any).translations, 
                      en: { ...(formData as any).translations?.en, description: e.target.value } 
                    } 
                  })}
                  placeholder="English Description" 
                  className="h-20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (ZH)</Label>
                <Textarea 
                  value={(formData as any).translations?.zh?.description || ''} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    translations: { 
                      ...(formData as any).translations, 
                      zh: { ...(formData as any).translations?.zh, description: e.target.value } 
                    } 
                  })}
                  placeholder="中文描述" 
                  className="h-20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.confirmDelete')}
        message={t('product.deleteConfirmMessage')}
      />
    </div>
  );
}
