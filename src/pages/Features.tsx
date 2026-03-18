import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockFeatures } from '../data/mock';
import { Plus, Search } from 'lucide-react';

export function Features() {
  const { t } = useTranslation();

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'boolean': return <Badge variant="success">{t('features.boolean')}</Badge>;
      case 'quota': return <Badge variant="warning">{t('features.quota')}</Badge>;
      case 'tier': return <Badge variant="default">{t('features.tier')}</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('features.search')} 
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {t('features.newFeature')}
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('features.code')}</Th>
              <Th>{t('features.name')}</Th>
              <Th>{t('features.type')}</Th>
              <Th>{t('features.description')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockFeatures.map((feature) => (
              <Tr key={feature.id}>
                <Td className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{feature.code}</Td>
                <Td className="font-medium">{feature.name}</Td>
                <Td>{getTypeBadge(feature.type)}</Td>
                <Td className="text-slate-500 dark:text-slate-400 text-sm">{feature.description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
