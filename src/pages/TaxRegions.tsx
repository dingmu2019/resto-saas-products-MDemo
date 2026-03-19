import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Globe,
  MapPin,
  Building2,
  Navigation
} from 'lucide-react';
import { Card, Button, Input, Modal, Select, Pagination } from '../components/ui';
import { mockTaxRegions } from '../data/mock/taxes';
import { TaxRegion } from '../types';

export function TaxRegions() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<TaxRegion | null>(null);
  const [regions, setRegions] = useState<TaxRegion[]>(mockTaxRegions);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRegions = useMemo(() => {
    return regions.filter(region => 
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.regionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [regions, searchTerm]);

  const paginatedRegions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRegions.slice(start, start + pageSize);
  }, [filteredRegions, currentPage, pageSize]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newRegion: TaxRegion = {
      id: editingRegion?.id || regions.length + 1,
      parentId: formData.get('parentId') ? Number(formData.get('parentId')) : null,
      regionCode: formData.get('regionCode') as string,
      countryCode: formData.get('countryCode') as string,
      stateCode: formData.get('stateCode') as string || undefined,
      cityCode: formData.get('cityCode') as string || undefined,
      countyCode: formData.get('countyCode') as string || undefined,
      zipCode: formData.get('zipCode') as string || undefined,
      name: formData.get('name') as string,
      level: formData.get('level') as any,
      path: editingRegion?.path || '/',
      isActive: formData.get('isActive') === 'true',
    };

    if (editingRegion) {
      setRegions(regions.map(r => r.id === editingRegion.id ? newRegion : r));
    } else {
      setRegions([...regions, newRegion]);
    }
    
    setIsModalOpen(false);
    setEditingRegion(null);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'country': return <Globe className="w-4 h-4" />;
      case 'state': return <MapPin className="w-4 h-4" />;
      case 'city': return <Building2 className="w-4 h-4" />;
      default: return <Navigation className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('taxRegions.title')}</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {t('taxRegions.subtitle')}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('taxRegions.newRegion')}
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={t('taxes.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 font-medium">{t('taxRegions.regionCode')}</th>
                <th className="px-4 py-3 font-medium">{t('taxRegions.countryCode')}</th>
                <th className="px-4 py-3 font-medium">{t('taxRegions.level')}</th>
                <th className="px-4 py-3 font-medium">{t('sku.name')}</th>
                <th className="px-4 py-3 font-medium">{t('common.status')}</th>
                <th className="px-4 py-3 font-medium text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedRegions.map((region) => (
                <tr key={region.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs">{region.regionCode}</td>
                  <td className="px-4 py-4">{region.countryCode}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getLevelIcon(region.level)}
                      <span className="capitalize">{t(`taxRegions.levels.${region.level}`)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium">{region.name}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                      region.isActive 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {region.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingRegion(region);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                        onClick={() => setRegions(regions.filter(r => r.id !== region.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredRegions.length}
            totalPages={Math.ceil(filteredRegions.length / pageSize)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRegion(null);
        }}
        title={editingRegion ? t('taxRegions.editRegion') : t('taxRegions.newRegion')}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.regionCode')}</label>
              <Input 
                name="regionCode" 
                defaultValue={editingRegion?.regionCode} 
                required 
                placeholder={t('taxRegions.placeholders.regionCode')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.countryCode')}</label>
              <Input 
                name="countryCode" 
                defaultValue={editingRegion?.countryCode} 
                required 
                placeholder={t('taxRegions.placeholders.countryCode')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('sku.name')}</label>
            <Input 
              name="name" 
              defaultValue={editingRegion?.name} 
              required 
              placeholder={t('taxRegions.placeholders.name')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.level')}</label>
              <Select name="level" defaultValue={editingRegion?.level || 'country'}>
                <option value="country">{t('taxRegions.levels.country')}</option>
                <option value="state">{t('taxRegions.levels.state')}</option>
                <option value="city">{t('taxRegions.levels.city')}</option>
                <option value="county">{t('taxRegions.levels.county')}</option>
                <option value="special">{t('taxRegions.levels.special')}</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.parentRegion')}</label>
              <Select name="parentId" defaultValue={editingRegion?.parentId || ''}>
                <option value="">{t('common.none')}</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.stateCode')}</label>
              <Input name="stateCode" defaultValue={editingRegion?.stateCode} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.cityCode')}</label>
              <Input name="cityCode" defaultValue={editingRegion?.cityCode} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.countyCode')}</label>
              <Input name="countyCode" defaultValue={editingRegion?.countyCode} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('taxRegions.zipCode')}</label>
              <Input name="zipCode" defaultValue={editingRegion?.zipCode} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('common.status')}</label>
            <Select name="isActive" defaultValue={editingRegion?.isActive ? 'true' : 'false'}>
              <option value="true">{t('common.active')}</option>
              <option value="false">{t('common.inactive')}</option>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingRegion(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
