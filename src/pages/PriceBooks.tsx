import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '../components/ui';
import { mockPriceBooks, mockPriceBookEntries, mockSkus } from '../data/mock';
import { BookOpen, Search, Plus, DollarSign } from 'lucide-react';

export function PriceBooks() {
  const { t } = useTranslation();

  const getSkuCode = (id: number) => {
    return mockSkus.find(s => s.id === id)?.skuCode || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search price books..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Price Book
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Price Books
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockPriceBooks.map((pb) => (
                <div key={pb.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-slate-50">{pb.name}</h4>
                    <Badge variant={pb.isActive ? 'success' : 'default'}>{pb.isActive ? 'Active' : 'Draft'}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-mono">{pb.code}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{pb.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Price Entries (PB-2026-GLOBAL-USD)
              </div>
              <Button variant="outline" className="text-xs py-1 h-8">Add Entry</Button>
            </div>
            <Table>
              <Thead>
                <Tr>
                  <Th>SKU Code</Th>
                  <Th>Strategy</Th>
                  <Th className="text-right">List Price</Th>
                  <Th className="text-right">Min Price</Th>
                  <Th className="text-right">Max Discount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockPriceBookEntries.filter(e => e.priceBookId === 1).map((entry) => (
                  <Tr key={entry.id}>
                    <Td className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{getSkuCode(entry.skuId)}</Td>
                    <Td><Badge variant="outline">{entry.pricingStrategy}</Badge></Td>
                    <Td className="text-right font-medium">${entry.listPrice.toFixed(2)}</Td>
                    <Td className="text-right text-slate-500">${entry.minPrice?.toFixed(2) || '-'}</Td>
                    <Td className="text-right text-slate-500">{entry.maxDiscountRate ? `${(entry.maxDiscountRate * 100).toFixed(0)}%` : '-'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
