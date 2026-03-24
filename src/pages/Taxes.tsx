import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { TaxRateMapping } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function Taxes() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { taxRegions, taxRates, setTaxRates } = useProductContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRateMapping | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<number | null>(null);

  const getRegionName = (regionId: number) => {
    return getTranslatedField(taxRegions.find(r => r.id === regionId), 'name', currentLang) || t('common.unknown');
  };

  const filteredRates = taxRates.filter(rate => {
    const regionName = getRegionName(rate.taxRegionId).toLowerCase();
    const taxName = rate.taxName.toLowerCase();
    const query = searchQuery.toLowerCase();
    return regionName.includes(query) || taxName.includes(query);
  });

  const handleSaveRate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rateData: Partial<TaxRateMapping> = {
      taxRegionId: parseInt(formData.get('taxRegionId') as string),
      taxName: formData.get('taxName') as string,
      productType: formData.get('productType') as any,
      taxType: formData.get('taxType') as any,
      taxRate: parseFloat(formData.get('taxRate') as string) / 100,
      isTaxInclusive: formData.get('isTaxInclusive') === 'on',
      isB2bExempt: formData.get('isB2bExempt') === 'on',
      effectiveDate: formData.get('effectiveDate') as string,
      endDate: (formData.get('endDate') as string) || undefined,
    };

    if (editingRate) {
      setTaxRates(taxRates.map(r => r.id === editingRate.id ? { ...r, ...rateData } : r));
    } else {
      const newRate: TaxRateMapping = {
        id: Math.max(0, ...taxRates.map(r => r.id)) + 1,
        ...rateData as TaxRateMapping
      };
      setTaxRates([...taxRates, newRate]);
    }
    setIsModalOpen(false);
    setEditingRate(null);
  };

  const handleDeleteRate = (id: number) => {
    setRateToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (rateToDelete !== null) {
      setTaxRates(taxRates.filter(r => r.id !== rateToDelete));
      setRateToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('taxes.search')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        <Button className="gap-2" onClick={() => { setEditingRate(null); setIsModalOpen(true); }}>
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
              <Th className="text-right">{t('common.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRates.map((rate) => (
              <Tr key={rate.id}>
                <Td className="font-medium">{getRegionName(rate.taxRegionId)}</Td>
                <Td>{rate.taxName}</Td>
                <Td className="capitalize text-slate-500 dark:text-slate-400">{rate.productType}</Td>
                <Td><Badge variant="default">{rate.taxType}</Badge></Td>
                <Td className="font-mono text-indigo-600 dark:text-indigo-400">{(rate.taxRate * 100).toFixed(2)}%</Td>
                <Td>{rate.isTaxInclusive ? <Badge variant="success">{t('taxes.yes')}</Badge> : <Badge variant="warning">{t('taxes.no')}</Badge>}</Td>
                <Td>{rate.isB2bExempt ? <Badge variant="success">{t('taxes.yes')}</Badge> : <Badge variant="default">{t('taxes.no')}</Badge>}</Td>
                <Td className="text-slate-500 dark:text-slate-400">
                  {rate.effectiveDate}
                  {rate.endDate && ` - ${rate.endDate}`}
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingRate(rate); setIsModalOpen(true); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDeleteRate(rate.id)}>
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
        title={editingRate ? t('taxes.editRate') : t('taxes.newRate')}
      >
        <form onSubmit={handleSaveRate} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('taxes.region')}</Label>
            <Select name="taxRegionId" defaultValue={editingRate?.taxRegionId} required>
              <option value="">{t('taxes.selectRegion')}</option>
              {taxRegions.map(region => (
                <option key={region.id} value={region.id}>{getTranslatedField(region, 'name', currentLang)}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('taxes.taxName')}</Label>
            <Input name="taxName" defaultValue={editingRate?.taxName} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('taxes.productType')}</Label>
              <Select name="productType" defaultValue={editingRate?.productType} required>
                <option value="software">{t('taxes.software')}</option>
                <option value="hardware">{t('taxes.hardware')}</option>
                <option value="service">{t('taxes.service')}</option>
                <option value="consumable">{t('taxes.consumable')}</option>
                <option value="bundle">{t('taxes.bundle')}</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('taxes.taxType')}</Label>
              <Select name="taxType" defaultValue={editingRate?.taxType} required>
                <option value="SalesTax">{t('taxes.salesTax')}</option>
                <option value="VAT">{t('taxes.vat')}</option>
                <option value="GST">{t('taxes.gst')}</option>
                <option value="PST">{t('taxes.pst')}</option>
                <option value="HST">{t('taxes.hst')}</option>
                <option value="QST">{t('taxes.qst')}</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('taxes.taxRate')} (%)</Label>
              <Input type="number" step="0.01" name="taxRate" defaultValue={editingRate ? editingRate.taxRate * 100 : 0} required />
            </div>
            <div className="space-y-2">
              <Label>{t('taxes.effectiveDate')}</Label>
              <Input type="date" name="effectiveDate" defaultValue={editingRate?.effectiveDate} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('taxes.endDate')}</Label>
            <Input type="date" name="endDate" defaultValue={editingRate?.endDate} />
          </div>
          <div className="flex flex-col gap-3 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="isTaxInclusive" defaultChecked={editingRate?.isTaxInclusive} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{t('taxes.inclusive')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="isB2bExempt" defaultChecked={editingRate?.isB2bExempt} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{t('taxes.b2bExempt')}</span>
            </label>
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
        title={t('taxes.deleteRate')}
        message={t('taxes.confirmDelete')}
        variant="danger"
      />
    </div>
  );
}
