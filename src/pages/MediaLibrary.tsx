import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Button } from '../components/ui';
import { mockMedia } from '../data/mock';
import { Plus, Search, Image as ImageIcon, FileText, Video, Box } from 'lucide-react';

export function MediaLibrary() {
  const { t } = useTranslation();

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5 text-indigo-500" />;
      case 'video': return <Video className="w-5 h-5 text-rose-500" />;
      case 'document': return <FileText className="w-5 h-5 text-emerald-500" />;
      case '3d_model': return <Box className="w-5 h-5 text-amber-500" />;
      default: return <ImageIcon className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('media.search')} 
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {t('media.upload')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockMedia.map((media) => (
          <Card key={media.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative group">
              {media.mediaType === 'image' ? (
                <img 
                  src={media.url} 
                  alt={media.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getMediaIcon(media.mediaType)}
                </div>
              )}
              {media.isMain && (
                <div className="absolute top-2 right-2">
                  <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-sm">Main</Badge>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-sm line-clamp-2" title={media.title}>{media.title || 'Untitled'}</h3>
                <div className="shrink-0">{getMediaIcon(media.mediaType)}</div>
              </div>
              <div className="mt-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="uppercase">{media.locale}</span>
                <span>Product ID: {media.productId}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
