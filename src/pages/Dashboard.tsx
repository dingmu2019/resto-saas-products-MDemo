import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Package, Tags, BookOpen, Activity } from 'lucide-react';
import { mockProducts, mockSkus, mockPriceBooks } from '../data/mock';

export function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.totalProducts'),
      value: mockProducts.length,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: t('dashboard.activeSkus'),
      value: mockSkus.filter(s => s.lifecycleStatus === 'active').length,
      icon: Tags,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      title: t('dashboard.activePriceBooks'),
      value: mockPriceBooks.filter(pb => pb.isActive).length,
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {t('dashboard.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p className="flex-1">
                <span className="font-medium">{t('common.system')}</span> {t('dashboard.activity.publishedPriceBook')} <span className="font-medium text-indigo-600 dark:text-indigo-400">PB-2026-GLOBAL-USD</span>
              </p>
              <span className="text-slate-500">{t('dashboard.activity.time.2h')}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="flex-1">
                <span className="font-medium">{t('common.admin')}</span> {t('dashboard.activity.createdSku')} <span className="font-medium text-indigo-600 dark:text-indigo-400">HW-POS-BLK</span>
              </p>
              <span className="text-slate-500">{t('dashboard.activity.time.5h')}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <p className="flex-1">
                <span className="font-medium">{t('common.system')}</span> {t('dashboard.activity.updatedTax')} <span className="font-medium text-indigo-600 dark:text-indigo-400">US-NY</span> {t('dashboard.activity.region')}
              </p>
              <span className="text-slate-500">{t('dashboard.activity.time.1d')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
