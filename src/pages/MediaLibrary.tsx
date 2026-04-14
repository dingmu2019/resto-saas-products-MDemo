import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Button, Modal, Input, Select, Label, Textarea, ConfirmModal } from '../components/ui';
import { useProductContext } from '../contexts/ProductProvider';
import { Plus, Search, Image as ImageIcon, FileText, Video, Box, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { ProductMedia } from '../types';

import { getTranslatedField } from '../utils/i18n';

export function MediaLibrary() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { media, setMedia, products, skus } = useProductContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<ProductMedia | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<number | null>(null);

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4 text-indigo-500" />;
      case 'video': return <Video className="w-4 h-4 text-rose-500" />;
      case 'document': return <FileText className="w-4 h-4 text-emerald-500" />;
      case '3d_model': return <Box className="w-4 h-4 text-amber-500" />;
      default: return <ImageIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  const filteredMedia = media.filter(m => 
    getTranslatedField(m, 'title', currentLang)?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMedia = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mediaData: Partial<ProductMedia> = {
      title: formData.get('title_en') as string || formData.get('title') as string,
      url: formData.get('url') as string,
      mediaType: formData.get('mediaType') as any,
      productId: formData.get('productId') ? parseInt(formData.get('productId') as string) : undefined,
      skuId: formData.get('skuId') ? parseInt(formData.get('skuId') as string) : undefined,
      isMain: formData.get('isMain') === 'on',
      sortOrder: parseInt(formData.get('sortOrder') as string),
      locale: formData.get('locale') as string,
      translations: {
        en: { title: formData.get('title_en') as string },
        zh: { title: formData.get('title_zh') as string }
      }
    };

    if (editingMedia) {
      setMedia(media.map(m => m.id === editingMedia.id ? { ...m, ...mediaData } : m));
    } else {
      const newMedia: ProductMedia = {
        id: Math.max(0, ...media.map(m => m.id)) + 1,
        ...mediaData as ProductMedia
      };
      setMedia([...media, newMedia]);
    }
    setIsModalOpen(false);
    setEditingMedia(null);
  };

  const handleDeleteMedia = (id: number) => {
    setMediaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (mediaToDelete !== null) {
      setMedia(media.filter(m => m.id !== mediaToDelete));
      setMediaToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('media.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 transition-all"
            />
          </div>
        </div>
        <Button className="gap-2 shadow-lg shadow-indigo-500/20" onClick={() => { setEditingMedia(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4" /> {t('media.upload')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((m) => (
          <Card key={m.id} className="overflow-hidden flex flex-col group border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/5 bg-white dark:bg-slate-900/50">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              {m.mediaType === 'image' ? (
                <img 
                  src={m.url} 
                  alt={getTranslatedField(m, 'title', currentLang)} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                    {getMediaIcon(m.mediaType)}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                  onClick={() => window.open(m.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" /> {t('common.view')}
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20" onClick={() => { setEditingMedia(m); setIsModalOpen(true); }}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" className="bg-rose-500/20 backdrop-blur-md border-rose-500/30 text-rose-200 hover:bg-rose-500/40" onClick={() => handleDeleteMedia(m.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              {m.isMain && (
                <div className="absolute top-3 right-3">
                  <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/20 text-[10px] px-2 py-0.5 uppercase tracking-wider">
                    {t('media.main')}
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={getTranslatedField(m, 'title', currentLang)}>
                  {getTranslatedField(m, 'title', currentLang) || t('media.untitled')}
                </h3>
                <div className="shrink-0 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                  {getMediaIcon(m.mediaType)}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider border-slate-200 dark:border-slate-700">
                  {m.locale}
                </Badge>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-tighter">{m.skuId ? t('media.skuId') : t('media.productId')}</span>
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-300">#{m.skuId || m.productId}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingMedia ? t('media.editMedia') : t('media.upload')}
      >
        <form onSubmit={handleSaveMedia} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('media.mediaTitleEn')}</Label>
              <Input name="title_en" defaultValue={editingMedia?.translations?.en?.title || editingMedia?.title} required />
            </div>
            <div className="space-y-2">
              <Label>{t('media.mediaTitleZh')}</Label>
              <Input name="title_zh" defaultValue={editingMedia?.translations?.zh?.title || editingMedia?.title} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('media.mediaUrl')}</Label>
            <div className="flex gap-2">
              <Input name="url" defaultValue={editingMedia?.url} required className="flex-1" />
              <div className="relative">
                <input 
                  type="file" 
                  id="media-upload" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // In a real app, we would upload the file here.
                      // For now, we'll just use a placeholder or createObjectURL
                      const url = URL.createObjectURL(file);
                      const urlInput = document.querySelector('input[name="url"]') as HTMLInputElement;
                      if (urlInput) urlInput.value = url;
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('media-upload')?.click()}
                  className="whitespace-nowrap"
                >
                  {t('media.upload')}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('media.mediaType')}</Label>
              <Select name="mediaType" defaultValue={editingMedia?.mediaType} required>
                <option value="image">{t('media.image')}</option>
                <option value="video">{t('media.video')}</option>
                <option value="document">{t('media.document')}</option>
                <option value="3d_model">{t('media.3d_model')}</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('media.mediaLocale')}</Label>
              <Input name="locale" defaultValue={editingMedia?.locale || 'zh_CN'} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('media.productId')} ({t('common.optional')})</Label>
              <Select name="productId" defaultValue={editingMedia?.productId}>
                <option value="">{t('common.none')}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{getTranslatedField(p, 'name', currentLang)}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('media.skuId')} ({t('common.optional')})</Label>
              <Select name="skuId" defaultValue={editingMedia?.skuId}>
                <option value="">{t('common.none')}</option>
                {skus.map(s => (
                  <option key={s.id} value={s.id}>{s.skuCode} - {getTranslatedField(s, 'name', currentLang)}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('media.mediaSortOrder')}</Label>
            <Input type="number" name="sortOrder" defaultValue={editingMedia?.sortOrder || 1} required />
          </div>
          <div className="flex flex-col gap-3 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="isMain" defaultChecked={editingMedia?.isMain} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{t('media.main')}</span>
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
        title={t('media.deleteMedia')}
        message={t('media.confirmDelete')}
        variant="danger"
      />
    </div>
  );
}
