import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockCategories } from '../data/mock';
import { Layers, Plus, Search } from 'lucide-react';

export function Categories() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('category.searchPlaceholder')} 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {t('category.newCategory')}
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {t('category.title')}
        </div>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('category.code')}</Th>
              <Th>{t('category.name')}</Th>
              <Th>{t('category.description')}</Th>
              <Th>{t('category.level')}</Th>
              <Th>{t('category.path')}</Th>
              <Th>{t('category.status')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockCategories.map((cat) => (
              <Tr key={cat.id}>
                <Td className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{cat.code}</Td>
                <Td className="font-medium">{cat.name}</Td>
                <Td className="text-slate-500 text-sm max-w-xs truncate">{cat.description}</Td>
                <Td><Badge variant="outline">L{cat.level}</Badge></Td>
                <Td className="font-mono text-xs text-slate-400">{cat.path}</Td>
                <Td><Badge variant={cat.isActive ? 'success' : 'default'}>{cat.isActive ? t('common.active') : t('common.inactive')}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
