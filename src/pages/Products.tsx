import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockProducts, mockCategories } from '../data/mock';
import { Plus, Search, Filter } from 'lucide-react';

export function Products() {
  const { t } = useTranslation();

  const getCategoryName = (id: number) => {
    return mockCategories.find(c => c.id === id)?.name || 'Unknown';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('product.searchPlaceholder')} 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> {t('common.filter')}
          </Button>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {t('product.newProduct')}
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('product.code')}</Th>
              <Th>{t('product.name')}</Th>
              <Th>{t('app.categories')}</Th>
              <Th>{t('product.type')}</Th>
              <Th>{t('product.brand')}</Th>
              <Th className="text-right">{t('product.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockProducts.map((product) => (
              <Tr key={product.id}>
                <Td className="font-mono text-xs text-slate-500 dark:text-slate-400">{product.productCode}</Td>
                <Td className="font-medium">{product.name}</Td>
                <Td className="text-slate-500 dark:text-slate-400">{getCategoryName(product.categoryId)}</Td>
                <Td>{getTypeBadge(product.productType)}</Td>
                <Td className="text-slate-500 dark:text-slate-400">{product.brand || '-'}</Td>
                <Td className="text-right">
                  <Link to={`/products/${product.id}`}>
                    <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400">
                      {t('product.viewDetails')}
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
