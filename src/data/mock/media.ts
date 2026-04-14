import { ProductMedia } from '../../types';

export const mockMedia: ProductMedia[] = [
  {
    id: 1,
    productId: 101,
    mediaType: 'image',
    url: 'https://picsum.photos/seed/pos_sw_1/800/600',
    title: 'RestoPOS Core Interface',
    isMain: true,
    sortOrder: 0,
    locale: 'zh'
  },
  {
    id: 2,
    productId: 101,
    mediaType: 'image',
    url: 'https://picsum.photos/seed/pos_sw_2/800/600',
    title: 'Order Management Screen',
    isMain: false,
    sortOrder: 1,
    locale: 'zh'
  },
  {
    id: 3,
    productId: 107,
    mediaType: 'image',
    url: 'https://picsum.photos/seed/pos_hw_1/800/600',
    title: '15" Single Screen Terminal',
    isMain: true,
    sortOrder: 0,
    locale: 'zh'
  },
  {
    id: 4,
    productId: 108,
    mediaType: 'image',
    url: 'https://picsum.photos/seed/pos_hw_2/800/600',
    title: '15" Dual Screen Terminal',
    isMain: true,
    sortOrder: 0,
    locale: 'zh'
  },
  {
    id: 5,
    productId: 122,
    mediaType: 'image',
    url: 'https://picsum.photos/seed/kiosk_1/800/600',
    title: '21" Self-Service Kiosk',
    isMain: true,
    sortOrder: 0,
    locale: 'zh'
  }
];
