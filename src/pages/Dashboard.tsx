import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Package, Tags, BookOpen, Activity, ArrowUpRight, TrendingUp, Users, DollarSign } from 'lucide-react';
import { mockData } from '../data/mock';
import { motion } from 'motion/react';

export function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.totalProducts'),
      value: mockData.products.length,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      trend: '+12%',
      trendColor: 'text-emerald-500'
    },
    {
      title: t('dashboard.activeSkus'),
      value: mockData.skus.filter(s => s.lifecycleStatus === 'active').length,
      icon: Tags,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: '+5%',
      trendColor: 'text-emerald-500'
    },
    {
      title: t('dashboard.activePriceBooks'),
      value: mockData.priceBooks.filter(pb => pb.isActive).length,
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      trend: 'Stable',
      trendColor: 'text-slate-400'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('app.dashboard')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          {t('dashboard.welcome')}
        </p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} variants={item}>
              <Card className="overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-2xl ${stat.bg} transition-transform duration-500 group-hover:scale-110`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendColor}`}>
                      {stat.trend}
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.title}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-4xl font-bold tracking-tight">{stat.value}</h3>
                      <span className="text-xs font-medium text-slate-400">{t('dashboard.units')}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="h-1 w-full bg-slate-50 dark:bg-slate-800/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${stat.color.replace('text-', 'bg-')}`} 
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-500" />
              {t('dashboard.recentActivity')}
            </CardTitle>
            <button className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
              {t('dashboard.viewAll')}
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { type: 'success', user: t('common.system'), action: t('dashboard.activity.publishedPriceBook'), target: 'PB-2026-GLOBAL-USD', time: t('dashboard.activity.time.2h') },
                { type: 'info', user: t('common.admin'), action: t('dashboard.activity.createdSku'), target: 'HW-POS-BLK', time: t('dashboard.activity.time.5h') },
                { type: 'warning', user: t('common.system'), action: t('dashboard.activity.updatedTax'), target: 'US-NY', time: t('dashboard.activity.time.1d') },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-emerald-500' : 
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-amber-500'
                  } ring-4 ring-slate-100 dark:ring-slate-800/50`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-none">
                      <span className="font-bold text-slate-900 dark:text-white">{activity.user}</span>
                      <span className="text-slate-500 dark:text-slate-400 mx-1.5">{activity.action}</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">{activity.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-600 dark:bg-indigo-500 text-white border-none shadow-xl shadow-indigo-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <TrendingUp className="w-5 h-5" />
              {t('dashboard.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-left flex items-center justify-between group">
              <div>
                <p className="font-bold text-sm">{t('dashboard.newProduct')}</p>
                <p className="text-[10px] opacity-70">{t('dashboard.newProductDesc')}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <button className="w-full px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-left flex items-center justify-between group">
              <div>
                <p className="font-bold text-sm">{t('dashboard.updatePrices')}</p>
                <p className="text-[10px] opacity-70">{t('dashboard.updatePricesDesc')}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <button className="w-full px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-left flex items-center justify-between group">
              <div>
                <p className="font-bold text-sm">{t('dashboard.systemHealth')}</p>
                <p className="text-[10px] opacity-70">{t('dashboard.systemHealthDesc')}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
