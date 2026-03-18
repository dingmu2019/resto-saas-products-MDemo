import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockRules, mockSkus } from '../data/mock';
import { Plus, Search } from 'lucide-react';

export function ProductRules() {
  const { t } = useTranslation();

  const getSkuName = (skuId: number) => {
    const sku = mockSkus.find(s => s.id === skuId);
    return sku ? `${sku.skuCode} - ${sku.name}` : 'Unknown';
  };

  const getRuleBadge = (type: string) => {
    switch (type) {
      case 'requires': return <Badge variant="error">{t('rules.requires')}</Badge>;
      case 'excludes': return <Badge variant="warning">{t('rules.excludes')}</Badge>;
      case 'recommends': return <Badge variant="success">{t('rules.recommends')}</Badge>;
      case 'compatible_with': return <Badge variant="default">{t('rules.compatible')}</Badge>;
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
            placeholder={t('rules.search')} 
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {t('rules.newRule')}
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('rules.sourceSku')}</Th>
              <Th>{t('rules.ruleType')}</Th>
              <Th>{t('rules.targetSku')}</Th>
              <Th>{t('rules.message')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockRules.map((rule) => (
              <Tr key={rule.id}>
                <Td className="font-medium text-slate-900 dark:text-slate-100">{getSkuName(rule.sourceSkuId)}</Td>
                <Td>{getRuleBadge(rule.ruleType)}</Td>
                <Td className="font-medium text-slate-900 dark:text-slate-100">{getSkuName(rule.targetSkuId)}</Td>
                <Td className="text-slate-500 dark:text-slate-400 text-sm">{rule.message}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
