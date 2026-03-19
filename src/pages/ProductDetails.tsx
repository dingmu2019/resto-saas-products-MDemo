import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, Input, Select, Label, Textarea } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { ArrowLeft, Box, Shield, FileText, Tag, Image as ImageIcon, Info, Edit2, Plus, Trash2 } from 'lucide-react';
import { cn } from '../components/Layout';
import { ProductSku, ProductEntitlement, ProductMedia } from '../types';

export function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
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

  const product = products.find(p => p.id === Number(id));
  const productSkus = skus.filter(s => s.productId === Number(id));
  const productMedia = media.filter(m => m.productId === Number(id));
  const productEntitlements = entitlements.filter(e => productSkus.some(s => s.id === e.skuId));

  if (!product) return <div className="p-8 text-center text-slate-500">{t('common.noData')}</div>;

  const getLifecycleBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success" className="text-[10px] uppercase tracking-wider">{t('sku.active')}</Badge>;
      case 'draft': return <Badge variant="warning" className="text-[10px] uppercase tracking-wider">{t('sku.draft')}</Badge>;
      case 'eos': return <Badge variant="error" className="text-[10px] uppercase tracking-wider">{t('sku.eos')}</Badge>;
      case 'eol': return <Badge variant="error" className="text-[10px] uppercase tracking-wider">{t('sku.eol')}</Badge>;
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
    const skuData: Partial<ProductSku> = {
      productId: product.id,
      name: formData.get('name') as string,
      skuCode: formData.get('skuCode') as string,
      billingModel: formData.get('billingModel') as any,
      billingTerm: formData.get('billingTerm') as any,
      uom: formData.get('uom') as string,
      lifecycleStatus: formData.get('lifecycleStatus') as any,
      isShippable: formData.get('isShippable') === 'true',
      isSerialized: formData.get('isSerialized') === 'true',
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
    if (window.confirm(t('common.confirmDelete'))) {
      setSkus(skus.filter(s => s.id !== id));
    }
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
    if (window.confirm(t('common.confirmDelete'))) {
      setEntitlements(entitlements.filter(e => e.id !== id));
    }
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
      title: formData.get('title') as string,
      url: formData.get('url') as string,
      mediaType: formData.get('mediaType') as any,
      isMain: formData.get('isMain') === 'true',
      sortOrder: Number(formData.get('sortOrder')),
      locale: formData.get('locale') as string,
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
    if (window.confirm(t('common.confirmDelete'))) {
      setMedia(media.filter(m => m.id !== id));
    }
  };

  // Product Edit Handler
  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProduct = {
      ...product,
      name: formData.get('name') as string,
      productCode: formData.get('productCode') as string,
      brand: formData.get('brand') as string,
      description: formData.get('description') as string,
      productType: formData.get('productType') as any,
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{product.name}</h1>
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
                      <Td className="font-bold text-slate-900 dark:text-slate-100">{sku.name}</Td>
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
                      <Td>{getLifecycleBadge(sku.lifecycleStatus)}</Td>
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
                    <Th className="text-[10px] uppercase tracking-wider">SKU</Th>
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
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{sku.name}</span>
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
                      <Th className="text-[10px] uppercase tracking-wider">SKU</Th>
                      <Th className="text-[10px] uppercase tracking-wider">{t('features.code')}</Th>
                      <Th className="text-[10px] uppercase tracking-wider">{t('features.type')}</Th>
                      <Th className="text-[10px] uppercase tracking-wider">Value</Th>
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
                          <p className="font-bold text-xs truncate">{item.title}</p>
                          <p className="text-[9px] opacity-70 uppercase tracking-widest mt-0.5">{item.mediaType}</p>
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
                          <Badge variant="success" className="text-[9px] px-2 py-0.5 shadow-lg shadow-emerald-500/20">MAIN</Badge>
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
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total SKUs</span>
                <span className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{productSkus.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active SKUs</span>
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
        <form onSubmit={handleSkuSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.name')}</Label>
              <Input name="name" defaultValue={editingSku?.name} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.code')}</Label>
              <Input name="skuCode" defaultValue={editingSku?.skuCode} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.billingModel')}</Label>
              <Select name="billingModel" defaultValue={editingSku?.billingModel || 'recurring'}>
                <option value="recurring">{t('sku.recurring')}</option>
                <option value="one_time">{t('sku.one_time')}</option>
                <option value="usage_based">{t('sku.usage_based')}</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.billingTerm')}</Label>
              <Select name="billingTerm" defaultValue={editingSku?.billingTerm || 'monthly'}>
                <option value="monthly">{t('sku.monthly')}</option>
                <option value="annual">{t('sku.annual')}</option>
                <option value="none">{t('sku.none')}</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('sku.uom')}</Label>
              <Input name="uom" defaultValue={editingSku?.uom || 'Unit'} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t('sku.lifecycle')}</Label>
              <Select name="lifecycleStatus" defaultValue={editingSku?.lifecycleStatus || 'active'}>
                <option value="active">{t('sku.active')}</option>
                <option value="draft">{t('sku.draft')}</option>
                <option value="eos">{t('sku.eos')}</option>
                <option value="eol">{t('sku.eol')}</option>
              </Select>
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
            <Label>SKU</Label>
            <Select name="skuId" defaultValue={editingEntitlement?.skuId || productSkus[0]?.id}>
              {productSkus.map(sku => (
                <option key={sku.id} value={sku.id}>{sku.name} ({sku.skuCode})</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t('features.code')}</Label>
            <Input name="featureCode" defaultValue={editingEntitlement?.featureCode} required placeholder="e.g. max_users" />
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
              <Label>Quota Value</Label>
              <Input name="quotaValue" type="number" defaultValue={editingEntitlement?.quotaValue} />
            </div>
            <div className="space-y-1.5">
              <Label>Tier Value</Label>
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
          <div className="space-y-1.5">
            <Label>{t('common.title')}</Label>
            <Input name="title" defaultValue={editingMedia?.title} required />
          </div>
          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input name="url" defaultValue={editingMedia?.url} required placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('features.type')}</Label>
              <Select name="mediaType" defaultValue={editingMedia?.mediaType || 'image'}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input name="sortOrder" type="number" defaultValue={editingMedia?.sortOrder || 0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Is Main</Label>
              <Select name="isMain" defaultValue={editingMedia?.isMain ? 'true' : 'false'}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Locale</Label>
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
              <Label>{t('product.name')}</Label>
              <Input name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t('product.code')}</Label>
              <Input name="productCode" defaultValue={product.productCode} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-1.5">
              <Label>{t('product.brand')}</Label>
              <Input name="brand" defaultValue={product.brand} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('product.description')}</Label>
            <Textarea name="description" defaultValue={product.description} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
