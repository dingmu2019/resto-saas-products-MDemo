import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { ProductRule } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function ProductRules() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { skus, rules, setRules } = useProductContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ProductRule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);

  const getSkuName = (skuId: number) => {
    const sku = skus.find(s => s.id === skuId);
    return sku ? `${sku.skuCode} - ${getTranslatedField(sku, 'name', currentLang)}` : t('common.unknown');
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

  const filteredRules = rules.filter(rule => {
    const sourceName = getSkuName(rule.sourceSkuId).toLowerCase();
    const targetName = getSkuName(rule.targetSkuId).toLowerCase();
    const message = rule.message?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return sourceName.includes(query) || targetName.includes(query) || message.includes(query);
  });

  const handleSaveRule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ruleData: Partial<ProductRule> = {
      sourceSkuId: parseInt(formData.get('sourceSkuId') as string),
      targetSkuId: parseInt(formData.get('targetSkuId') as string),
      ruleType: formData.get('ruleType') as any,
      message: formData.get('message_en') as string || formData.get('message') as string,
      translations: {
        en: { message: formData.get('message_en') as string },
        zh: { message: formData.get('message_zh') as string }
      }
    };

    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...ruleData } : r));
    } else {
      const newRule: ProductRule = {
        id: Math.max(0, ...rules.map(r => r.id)) + 1,
        ...ruleData as ProductRule
      };
      setRules([...rules, newRule]);
    }
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (id: number) => {
    setRuleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (ruleToDelete !== null) {
      setRules(rules.filter(r => r.id !== ruleToDelete));
      setRuleToDelete(null);
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        <Button className="gap-2" onClick={() => { setEditingRule(null); setIsModalOpen(true); }}>
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
              <Th className="text-right">{t('common.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRules.map((rule) => (
              <Tr key={rule.id}>
                <Td className="font-medium text-slate-900 dark:text-slate-100">{getSkuName(rule.sourceSkuId)}</Td>
                <Td>{getRuleBadge(rule.ruleType)}</Td>
                <Td className="font-medium text-slate-900 dark:text-slate-100">{getSkuName(rule.targetSkuId)}</Td>
                <Td className="text-slate-500 dark:text-slate-400 text-sm">{rule.message}</Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingRule(rule); setIsModalOpen(true); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDeleteRule(rule.id)}>
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
        title={editingRule ? t('rules.editRule') : t('rules.newRule')}
      >
        <form onSubmit={handleSaveRule} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('rules.sourceSku')}</Label>
            <Select name="sourceSkuId" defaultValue={editingRule?.sourceSkuId} required>
              <option value="">{t('rules.selectSku')}</option>
              {skus.map(sku => (
                <option key={sku.id} value={sku.id}>{sku.skuCode} - {getTranslatedField(sku, 'name', currentLang)}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('rules.ruleType')}</Label>
            <Select name="ruleType" defaultValue={editingRule?.ruleType} required>
              <option value="requires">{t('rules.requires')}</option>
              <option value="excludes">{t('rules.excludes')}</option>
              <option value="recommends">{t('rules.recommends')}</option>
              <option value="compatible_with">{t('rules.compatible')}</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('rules.targetSku')}</Label>
            <Select name="targetSkuId" defaultValue={editingRule?.targetSkuId} required>
              <option value="">{t('rules.selectSku')}</option>
              {skus.map(sku => (
                <option key={sku.id} value={sku.id}>{sku.skuCode} - {getTranslatedField(sku, 'name', currentLang)}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('rules.messageEn')}</Label>
              <Input name="message_en" defaultValue={editingRule?.translations?.en?.message || editingRule?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t('rules.messageZh')}</Label>
              <Input name="message_zh" defaultValue={editingRule?.translations?.zh?.message || editingRule?.message} />
            </div>
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
        title={t('rules.deleteRule')}
        message={t('rules.confirmDelete')}
        variant="danger"
      />
    </div>
  );
}
