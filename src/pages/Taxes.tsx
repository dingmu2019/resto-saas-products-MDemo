import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockTaxRegions, mockTaxRates } from '../data/mock';
import { Plus, Search } from 'lucide-react';

export function Taxes() {
  const { t } = useTranslation();

  const getRegionName = (regionId: number) => {
    return mockTaxRegions.find(r => r.id === regionId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('taxes.search')} 
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {t('taxes.newRate')}
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('taxes.region')}</Th>
              <Th>{t('taxes.taxName')}</Th>
              <Th>{t('taxes.productType')}</Th>
              <Th>{t('taxes.taxType')}</Th>
              <Th>{t('taxes.taxRate')}</Th>
              <Th>{t('taxes.inclusive')}</Th>
              <Th>{t('taxes.b2bExempt')}</Th>
              <Th>{t('taxes.effectiveDate')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockTaxRates.map((rate) => (
              <Tr key={rate.id}>
                <Td className="font-medium">{getRegionName(rate.taxRegionId)}</Td>
                <Td>{rate.taxName}</Td>
                <Td className="capitalize text-slate-500 dark:text-slate-400">{rate.productType}</Td>
                <Td><Badge variant="default">{rate.taxType}</Badge></Td>
                <Td className="font-mono text-indigo-600 dark:text-indigo-400">{(rate.taxRate * 100).toFixed(2)}%</Td>
                <Td>{rate.isTaxInclusive ? <Badge variant="success">{t('taxes.yes')}</Badge> : <Badge variant="warning">{t('taxes.no')}</Badge>}</Td>
                <Td>{rate.isB2bExempt ? <Badge variant="success">{t('taxes.yes')}</Badge> : <Badge variant="default">{t('taxes.no')}</Badge>}</Td>
                <Td className="text-slate-500 dark:text-slate-400">{rate.effectiveDate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
