import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, Textarea, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { ArrowLeft, Box, Shield, FileText, Tag, Image as ImageIcon, Info, Edit2, Plus, Trash2, Globe } from 'lucide-react';
import { cn } from '../components/Layout';
import { ProductSku, ProductEntitlement, ProductMedia } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function ProductDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { 
    products, setProducts, 
    skus, setSkus, 
    entitlements, setEntitlements, 
    media, setMedia,
    priceBooks,
    priceBookEntries
  } = useProductContext();
  
  const [activeTab, setActiveTab] = useState<'skus' | 'pricing' | 'entitlements' | 'media'>('skus');
  
  // Modals state
  const [isSkuModalOpen, setIsSkuModalOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<ProductSku | null>(null);
  
  const [isEntitlementModalOpen, setIsEntitlementModalOpen] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState<ProductEntitlement | null>(null);
  
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<ProductMedia | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ type: 'sku' | 'entitlement' | 'media', id: number } | null>(null);

  const product = products.find(p => p.id === Number(id));
  const productSkus = skus.filter(s => s.productId === Number(id));
  const productMedia = media.filter(m => m.productId === Number(id));
  const productEntitlements = entitlements.filter(e => productSkus.some(s => s.id === e.skuId));

  if (!product) return <div className="p-8 text-center text-slate-500">{t('common.noData')}</div>;

  const getLifecycleBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success" className="text-[10px] uppercase tracking-wider">{t('sku.active')}</Badge>;
      case 'draft': return <Badge variant="warning" className="text-[10px] uppercase tracking-wider">{t('sku.draft')}</Badge>;
      case 'eos': return <Badge variant="warning" className="text-[10px] uppercase tracking-wider">{t('sku.eos')}</Badge>;
      case 'eol': return <Badge variant="error" className="text-[10px] uppercase tracking-wider">{t('sku.eol')}</Badge>;
      case 'retired': return <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{t('sku.retired')}</Badge>;
      default: return <Badge className="text-[10px] uppercase tracking-wider">{status}</Badge>;
    }
  };

  const tabs = [
    { id: 'skus', label: t('product.skuList'), icon: Box },
    { id: 'pricing', label: t('app.priceBooks'), icon: Tag },
    { id: 'entitlements', label: t('product.entitlements'), icon: Shield },
    { id: 'media', label: t('product.media'), icon: ImageIcon },
  ] as const;

  // SKU Handlers
  const handleOpenSkuModal = (sku?: ProductSku) => {
    setEditingSku(sku || null);
    setIsSkuModalOpen(true);
  };

  const handleSkuSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const specsRaw = formData.get('specifications') as string;
    let specifications = undefined;
    if (specsRaw) {
      try {
        specifications = JSON.parse(specsRaw);
      } catch (e) {
        console.error('Invalid JSON in specifications', e);
      }
    }

    const skuData: Partial<ProductSku> = {
      productId: product.id,
      name: formData.get('name_en') as string || formData.get('name') as string,
      skuCode: formData.get('skuCode') as string,
      billingModel: formData.get('billingModel') as any,
      billingTerm: formData.get('billingTerm') as any,
      billingTiming: formData.get('billingTiming') as any,
      trialDays: parseInt(formData.get('trialDays') as string) || 0,
      uom: formData.get('uom') as string,
      lifecycleStatus: formData.get('lifecycleStatus') as any,
      isShippable: formData.get('isShippable') === 'true',
      isSerialized: formData.get('isSerialized') === 'true',
      weightKg: formData.get('weightKg') ? parseFloat(formData.get('weightKg') as string) : undefined,
      lengthCm: formData.get('lengthCm') ? parseFloat(formData.get('lengthCm') as string) : undefined,
      widthCm: formData.get('widthCm') ? parseFloat(formData.get('widthCm') as string) : undefined,
      heightCm: formData.get('heightCm') ? parseFloat(formData.get('heightCm') as string) : undefined,
      hsCode: formData.get('hsCode') as string,
      countryOfOrigin: formData.get('countryOfOrigin') as string,
      provisioningHandler: formData.get('provisioningHandler') as string,
      standardTaxCode: formData.get('standardTaxCode') as string,
      launchDate: formData.get('launchDate') as string || undefined,
      eosDate: formData.get('eosDate') as string || undefined,
      specifications,
      translations: {
        en: { 
          name: formData.get('name_en') as string,
          description: formData.get('description_en') as string
        },
        zh: { 
          name: formData.get('name_zh') as string,
          description: formData.get('description_zh') as string
        }
      }
    };

    if (editingSku) {
      setSkus(skus.map(s => s.id === editingSku.id ? { ...editingSku, ...skuData } as ProductSku : s));
    } else {
      const newSku: ProductSku = {
        ...skuData,
        id: Math.max(0, ...skus.map(s => s.id)) + 1,
        trialDays: 0,
        billingTiming: 'in_advance',
      } as ProductSku;
      setSkus([...skus, newSku]);
    }
    setIsSkuModalOpen(false);
  };

  const handleDeleteSku = (id: number) => {
    setDeleteConfig({ type: 'sku', id });
    setIsDeleteModalOpen(true);
  };

  // Entitlement Handlers
  const handleOpenEntitlementModal = (ent?: ProductEntitlement) => {
    setEditingEntitlement(ent || null);
    setIsEntitlementModalOpen(true);
  };

  const handleEntitlementSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const entData: Partial<ProductEntitlement> = {
      skuId: Number(formData.get('skuId')),
      featureCode: formData.get('featureCode') as string,
      entitlementType: formData.get('entitlementType') as any,
      quotaValue: formData.get('quotaValue') ? Number(formData.get('quotaValue')) : undefined,
      tierValue: formData.get('tierValue') as string,
      status: formData.get('status') as any,
    };

    if (editingEntitlement) {
      setEntitlements(entitlements.map(e => e.id === editingEntitlement.id ? { ...editingEntitlement, ...entData } as ProductEntitlement : e));
    } else {
      const newEnt: ProductEntitlement = {
        ...entData,
        id: Math.max(0, ...entitlements.map(e => e.id)) + 1,
      } as ProductEntitlement;
      setEntitlements([...entitlements, newEnt]);
    }
    setIsEntitlementModalOpen(false);
  };

  const handleDeleteEntitlement = (id: number) => {
    setDeleteConfig({ type: 'entitlement', id });
    setIsDeleteModalOpen(true);
  };

  // Media Handlers
  const handleOpenMediaModal = (m?: ProductMedia) => {
    setEditingMedia(m || null);
    setIsMediaModalOpen(true);
  };

  const handleMediaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mediaData: Partial<ProductMedia> = {
      productId: product.id,
      title: formData.get('title_en') as string || formData.get('title') as string,
      url: formData.get('url') as string,
      mediaType: formData.get('mediaType') as any,
      isMain: formData.get('isMain') === 'true',
      sortOrder: Number(formData.get('sortOrder')),
      locale: formData.get('locale') as string,
      translations: {
        en: { title: formData.get('title_en') as string },
        zh: { title: formData.get('title_zh') as string }
      }
    };

    if (editingMedia) {
      setMedia(media.map(m => m.id === editingMedia.id ? { ...editingMedia, ...mediaData } as ProductMedia : m));
    } else {
      const newMedia: ProductMedia = {
        ...mediaData,
        id: Math.max(0, ...media.map(m => m.id)) + 1,
      } as ProductMedia;
      setMedia([...media, newMedia]);
    }
    setIsMediaModalOpen(false);
  };

  const handleDeleteMedia = (id: number) => {
    setDeleteConfig({ type: 'media', id });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfig) return;
    const { type, id } = deleteConfig;
    if (type === 'sku') setSkus(skus.filter(s => s.id !== id));
    if (type === 'entitlement') setEntitlements(entitlements.filter(e => e.id !== id));
    if (type === 'media') setMedia(media.filter(m => m.id !== id));
    setIsDeleteModalOpen(false);
    setDeleteConfig(null);
  };

  // Product Edit Handler
  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProduct = {
      ...product,
      name: formData.get('name_en') as string || formData.get('name') as string,
      productCode: formData.get('productCode') as string,
      brand: formData.get('brand') as string,
      description: formData.get('description_en') as string || formData.get('description') as string,
      productType: formData.get('productType') as any,
      translations: {
        en: { 
          name: formData.get('name_en') as string,
          description: formData.get('description_en') as string
        },
        zh: { 
          name: formData.get('name_zh') as string,
          description: formData.get('description_zh') as string
        }
      }
    };
    setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
    setIsProductModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/products">
            <Button variant="ghost" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{getTranslatedField(product, 'name', currentLang)}</h1>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {product.productCode}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-slate-500">{product.brand}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <Badge variant="info" className="text-[10px] uppercase tracking-wider">{t(`product.${product.productType}`)}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800" onClick={() => setIsProductModalOpen(true)}>
            <Edit2 className="w-4 h-4" /> {t('common.edit')}
          </Button>
          <Button size="sm" className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => handleOpenSkuModal()}>
            <Plus className="w-4 h-4" /> {t('sku.new')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/30 p-1 rounded-xl w-fit border border-slate-200/50 dark:border-slate-800/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  activeTab === tab.id 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-600/50" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-500" : "text-slate-400")} />
                {tab.label}
              </button>
            ))}
          </div>

          <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
            {activeTab === 'skus' && (
              <Table>
                <Thead>
                  <Tr className="bg-slate-50/50 dark:bg-slate-800/20">
                    <Th className="text-[10px] uppercase tracking-wider">{t('sku.code')}</Th>
                    <Th className="text-[10px] uppercase tracking-wider">{t('sku.name')}</Th>
                    <Th className="text-[10px] uppercase tracking-wider">{t('sku.billingModel')}</Th>
                    <Th className="text-[10px] uppercase tracking-wider">{t('sku.billingTerm')}</Th>
                    <Th className="text-[10px] uppercase tracking-wider">{t('sku.uom')}</Th>
                    <Th className="text-[10px] uppercase tracking-wider">{t('sku.lifecycle')}</Th>
                    <Th className="text-right">{t('common.actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {productSkus.map((sku) => (
                    <Tr key={sku.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                      <Td>
                        <span className="font-mono text-[11px] bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          {sku.skuCode}
                        </span>
                      </Td>
                      <Td className="font-bold text-slate-900 dark:text-slate-100">{getTranslatedField(sku, 'name', currentLang)}</Td>
                      <Td>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-tighter font-semibold bg-slate-50 dark:bg-slate-900">
                          {t(`sku.${sku.billingModel}`)}
                        </Badge>
                      </Td>
                      <Td>
                        {sku.billingTerm !== 'none' ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                            {t(`sku.${sku.billingTerm}`)}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">-</span>
                        )}
                      </Td>
                      <Td className="text-slate-500 text-xs font-medium">{sku.uom}</Td>
                      <Td>
                        <div title={t(`sku.${sku.lifecycleStatus}Desc`)}>
                          {getLifecycleBadge(sku.lifecycleStatus)}
                        </div>
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenSkuModal(sku)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDeleteSku(sku.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}

            {activeTab === 'pricing' && (
              <Table>
                <Thead>
                  <Tr className="bg-slate-50/50 dark:bg-slate-800/20">
                    <Th className="text-[10px] uppercase tracking-wider">{t('sku.title')}</Th>
                    {priceBooks.map(pb => (
                      <Th key={pb.id} className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase tracking-wider">{pb.name}</span>
                          <span className="text-[9px] font-mono opacity-50">{pb.currency}</span>
                        </div>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {productSkus.map((sku) => (
                    <Tr key={sku.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <Td>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{getTranslatedField(sku, 'name', currentLang)}</span>
                          <span className="text-[10px] font-mono text-slate-400 tracking-tighter">{sku.skuCode}</span>
                        </div>
                      </Td>
                      {priceBooks.map(pb => {
                        const entry = priceBookEntries.find(e => e.skuId === sku.id && e.priceBookId === pb.id);
                        return (
                          <Td key={pb.id} className="text-right">
                            {entry ? (
                              <div className="flex flex-col items-end">
                                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm">
                                  {pb.currency} {entry.listPrice.toFixed(2)}
                                </span>
                                {entry.msrp && (
                                  <span className="text-[10px] text-slate-400 line-through font-mono">
                                    {entry.msrp.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">-</span>
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}

            {activeTab === 'entitlements' && (
              <div className="space-y-4">
                <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('product.entitlements')}</h3>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenEntitlementModal()}>
                    <Plus className="w-3.5 h-3.5" /> {t('common.add')}
                  </Button>
                </div>
                <Table>
                  <Thead>
                    <Tr className="bg-slate-50/50 dark:bg-slate-800/20">
                      <Th className="text-[10px] uppercase tracking-wider">{t('sku.title')}</Th>
                      <Th className="text-[10px] uppercase tracking-wider">{t('features.code')}</Th>
                      <Th className="text-[10px] uppercase tracking-wider">{t('features.type')}</Th>
                      <Th className="text-[10px] uppercase tracking-wider">{t('sku.quotaValue')}</Th>
                      <Th className="text-[10px] uppercase tracking-wider">{t('common.status')}</Th>
                      <Th className="text-right">{t('common.actions')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {productEntitlements.map((ent) => {
                      const sku = productSkus.find(s => s.id === ent.skuId);
                      return (
                        <Tr key={ent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                          <Td>
                            <span className="font-mono text-[11px] bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-slate-500">
                              {sku?.skuCode}
                            </span>
                          </Td>
                          <Td className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{ent.featureCode}</Td>
                          <Td>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-tighter font-semibold bg-slate-50 dark:bg-slate-900">
                              {t(`features.${ent.entitlementType}`)}
                            </Badge>
                          </Td>
                          <Td className="font-bold text-sm text-slate-900 dark:text-slate-100">{ent.quotaValue || ent.tierValue || '-'}</Td>
                          <Td>
                            <Badge variant={ent.status === 'active' ? 'success' : 'default'} className="text-[10px] uppercase tracking-wider">
                              {ent.status === 'active' ? t('common.active') : t('common.inactive')}
                            </Badge>
                          </Td>
                          <Td className="text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenEntitlementModal(ent)}>
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDeleteEntitlement(ent.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </div>
            )}

            {activeTab === 'media' && (
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productMedia.map((item) => (
                    <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="text-white w-full">
                          <p className="font-bold text-xs">{item.title}</p>
                          <p className="text-[9px] opacity-70 uppercase tracking-widest mt-0.5">{t(`media.${item.mediaType}`)}</p>
                          <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => handleOpenMediaModal(item)} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg transition-colors">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteMedia(item.id)} className="p-1.5 bg-rose-500/50 hover:bg-rose-500/80 rounded-lg transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {item.isMain && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="success" className="text-[9px] px-2 py-0.5 shadow-lg shadow-emerald-500/20">{t('media.main')}</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={() => handleOpenMediaModal()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full mb-2 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold">{t('media.upload')}</span>
                  </button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50 py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <Info className="w-3.5 h-3.5 text-indigo-500" />
                {t('product.description')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {product.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t('product.type')}</span>
                  <Badge variant="info" className="text-[10px] uppercase tracking-wider">{t(`product.${product.productType}`)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t('product.brand')}</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{product.brand || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50 py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                {t('common.status')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('sku.totalSkus')}</span>
                <span className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{productSkus.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('sku.activeSkus')}</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                  {productSkus.filter(s => s.lifecycleStatus === 'active').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SKU Modal */}
      <Modal isOpen={isSkuModalOpen} onClose={() => setIsSkuModalOpen(false)} title={editingSku ? t('sku.edit') : t('sku.new')}>
        <form onSubmit={handleSkuSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.nameEn')}</Label>
              <Input name="name_en" defaultValue={editingSku?.translations?.en?.name || editingSku?.name} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.nameZh')}</Label>
              <Input name="name_zh" defaultValue={editingSku?.translations?.zh?.name || editingSku?.name} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('sku.code')}</Label>
            <Input name="skuCode" defaultValue={editingSku?.skuCode} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.billingModel')}</Label>
              <Select name="billingModel" defaultValue={editingSku?.billingModel || 'recurring'}>
                <option value="recurring">{t('sku.recurring')}</option>
                <option value="one_time">{t('sku.one_time')}</option>
                <option value="usage_based">{t('sku.usage_based')}</option>
                <option value="hybrid">{t('sku.hybrid')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.billingTerm')}</Label>
              <Select name="billingTerm" defaultValue={editingSku?.billingTerm || 'monthly'}>
                <option value="daily">{t('sku.daily')}</option>
                <option value="weekly">{t('sku.weekly')}</option>
                <option value="biweekly">{t('sku.biweekly')}</option>
                <option value="monthly">{t('sku.monthly')}</option>
                <option value="quarterly">{t('sku.quarterly')}</option>
                <option value="annual">{t('sku.annual')}</option>
                <option value="biennial">{t('sku.biennial')}</option>
                <option value="triennial">{t('sku.triennial')}</option>
                <option value="custom">{t('sku.custom')}</option>
                <option value="none">{t('sku.none')}</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.billingTiming')}</Label>
              <Select name="billingTiming" defaultValue={editingSku?.billingTiming || 'in_advance'}>
                <option value="in_advance">{t('sku.in_advance')}</option>
                <option value="in_arrears">{t('sku.in_arrears')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.uom')}</Label>
              <Input name="uom" defaultValue={editingSku?.uom || 'Unit'} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.trialDays')}</Label>
              <Input type="number" name="trialDays" defaultValue={editingSku?.trialDays || 0} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.lifecycle')}</Label>
              <Select name="lifecycleStatus" defaultValue={editingSku?.lifecycleStatus || 'active'}>
                <option value="active" title={t('sku.activeDesc')}>{t('sku.active')}</option>
                <option value="draft" title={t('sku.draftDesc')}>{t('sku.draft')}</option>
                <option value="eos" title={t('sku.eosDesc')}>{t('sku.eos')}</option>
                <option value="eol" title={t('sku.eolDesc')}>{t('sku.eol')}</option>
                <option value="retired" title={t('sku.retiredDesc')}>{t('sku.retired')}</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.isShippable')}</Label>
              <Select name="isShippable" defaultValue={editingSku?.isShippable ? 'true' : 'false'}>
                <option value="true">{t('taxes.yes')}</option>
                <option value="false">{t('taxes.no')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.isSerialized')}</Label>
              <Select name="isSerialized" defaultValue={editingSku?.isSerialized ? 'true' : 'false'}>
                <option value="true">{t('taxes.yes')}</option>
                <option value="false">{t('taxes.no')}</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.weightKg')}</Label>
              <Input type="number" step="0.01" name="weightKg" defaultValue={editingSku?.weightKg} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.standardTaxCode')}</Label>
              <Input name="standardTaxCode" defaultValue={editingSku?.standardTaxCode} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.lengthCm')}</Label>
              <Input type="number" step="0.01" name="lengthCm" defaultValue={editingSku?.lengthCm} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.widthCm')}</Label>
              <Input type="number" step="0.01" name="widthCm" defaultValue={editingSku?.widthCm} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.heightCm')}</Label>
              <Input type="number" step="0.01" name="heightCm" defaultValue={editingSku?.heightCm} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.launchDate')}</Label>
              <Input type="date" name="launchDate" defaultValue={editingSku?.launchDate?.split('T')[0]} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.eosDate')}</Label>
              <Input type="date" name="eosDate" defaultValue={editingSku?.eosDate?.split('T')[0]} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.hsCode')}</Label>
              <Input name="hsCode" defaultValue={editingSku?.hsCode} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.countryOfOrigin')}</Label>
              <Input name="countryOfOrigin" defaultValue={editingSku?.countryOfOrigin} placeholder="e.g. US, CN" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('sku.provisioningHandler')}</Label>
            <Input name="provisioningHandler" defaultValue={editingSku?.provisioningHandler} placeholder="e.g. saas-core-provisioner" />
          </div>

          <div className="space-y-1.5">
            <Label>{t('sku.technicalSpecs')} (JSON)</Label>
            <Textarea 
              name="specifications" 
              defaultValue={editingSku?.specifications ? JSON.stringify(editingSku.specifications, null, 2) : ''} 
              rows={4}
              placeholder='{"color": "Black", "memory": "8GB"}'
            />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              {t('common.translations')}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (EN)</Label>
                <Textarea 
                  name="description_en"
                  defaultValue={editingSku?.translations?.en?.description || ''} 
                  placeholder={t('product.descriptionEn')} 
                  className="h-20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('common.description')} (ZH)</Label>
                <Textarea 
                  name="description_zh"
                  defaultValue={editingSku?.translations?.zh?.description || ''} 
                  placeholder={t('product.descriptionZh')} 
                  className="h-20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsSkuModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Entitlement Modal */}
      <Modal isOpen={isEntitlementModalOpen} onClose={() => setIsEntitlementModalOpen(false)} title={editingEntitlement ? t('common.edit') : t('common.add')}>
        <form onSubmit={handleEntitlementSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('sku.title')}</Label>
            <Select name="skuId" defaultValue={editingEntitlement?.skuId || productSkus[0]?.id}>
              {productSkus.map(sku => (
                <option key={sku.id} value={sku.id}>{getTranslatedField(sku, 'name', currentLang)} ({sku.skuCode})</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t('features.code')}</Label>
            <Input name="featureCode" defaultValue={editingEntitlement?.featureCode} required placeholder={t('sku.featureCodePlaceholder')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('features.type')}</Label>
              <Select name="entitlementType" defaultValue={editingEntitlement?.entitlementType || 'boolean'}>
                <option value="boolean">{t('features.boolean')}</option>
                <option value="quota">{t('features.quota')}</option>
                <option value="tier">{t('features.tier')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('common.status')}</Label>
              <Select name="status" defaultValue={editingEntitlement?.status || 'active'}>
                <option value="active">{t('common.active')}</option>
                <option value="inactive">{t('common.inactive')}</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.quotaValue')}</Label>
              <Input name="quotaValue" type="number" defaultValue={editingEntitlement?.quotaValue} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.tierValue')}</Label>
              <Input name="tierValue" defaultValue={editingEntitlement?.tierValue} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEntitlementModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Media Modal */}
      <Modal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} title={editingMedia ? t('common.edit') : t('media.upload')}>
        <form onSubmit={handleMediaSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('media.mediaTitleEn')}</Label>
              <Input name="title_en" defaultValue={editingMedia?.translations?.en?.title || editingMedia?.title} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t('media.mediaTitleZh')}</Label>
              <Input name="title_zh" defaultValue={editingMedia?.translations?.zh?.title || editingMedia?.title} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('media.mediaUrl')}</Label>
            <Input name="url" defaultValue={editingMedia?.url} required placeholder="https://..." />
          </div>
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('media.mediaType')}</Label>
              <Select name="mediaType" defaultValue={editingMedia?.mediaType || 'image'}>
                <option value="image">{t('media.image')}</option>
                <option value="video">{t('media.video')}</option>
                <option value="document">{t('media.document')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('media.mediaSortOrder')}</Label>
              <Input name="sortOrder" type="number" defaultValue={editingMedia?.sortOrder || 0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.isMain')}</Label>
              <Select name="isMain" defaultValue={editingMedia?.isMain ? 'true' : 'false'}>
                <option value="true">{t('taxes.yes')}</option>
                <option value="false">{t('taxes.no')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('media.mediaLocale')}</Label>
              <Input name="locale" defaultValue={editingMedia?.locale || 'ALL'} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsMediaModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Product Edit Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={t('product.editProduct')}>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('product.nameEn')}</Label>
              <Input name="name_en" defaultValue={product.translations?.en?.name || product.name} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t('product.nameZh')}</Label>
              <Input name="name_zh" defaultValue={product.translations?.zh?.name || product.name} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('product.code')}</Label>
              <Input name="productCode" defaultValue={product.productCode} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t('product.brand')}</Label>
              <Input name="brand" defaultValue={product.brand} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('product.type')}</Label>
            <Select name="productType" defaultValue={product.productType}>
              <option value="software">{t('product.software')}</option>
              <option value="hardware">{t('product.hardware')}</option>
              <option value="consumable">{t('product.consumable')}</option>
              <option value="bundle">{t('product.bundle')}</option>
              <option value="service">{t('product.service')}</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('product.descriptionEn')}</Label>
              <Textarea name="description_en" defaultValue={product.translations?.en?.description || product.description} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('product.descriptionZh')}</Label>
              <Textarea name="description_zh" defaultValue={product.translations?.zh?.description || product.description} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.confirmDelete')}
        message={t('common.confirmDeleteMessage')}
        variant="danger"
      />
    </div>
  );
}
