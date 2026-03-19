import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppProvider';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  BookOpen, 
  Settings, 
  Moon, 
  Sun, 
  Monitor,
  Globe,
  Layers,
  Calculator,
  ShieldAlert,
  ListChecks,
  Image as ImageIcon,
  Database,
  Navigation
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, setTheme, language, setLanguage } = useAppContext();

  const navItems = [
    { path: '/', label: t('app.dashboard'), icon: LayoutDashboard },
    { path: '/categories', label: t('app.categories'), icon: Layers },
    { path: '/products', label: t('app.products'), icon: Package },
    { path: '/skus', label: t('app.skus'), icon: Tags },
    { path: '/bundles', label: t('app.bundles'), icon: Package },
    { path: '/features', label: t('app.features'), icon: ListChecks },
    { path: '/rules', label: t('app.rules'), icon: ShieldAlert },
    { path: '/taxes', label: t('app.taxes'), icon: Calculator },
    { path: '/tax-regions', label: t('app.taxRegions'), icon: Navigation },
    { path: '/media', label: t('app.media'), icon: ImageIcon },
    { path: '/price-books', label: t('app.priceBooks'), icon: BookOpen },
    { path: '/cpq', label: t('app.cpqDemo'), icon: Monitor },
    { path: '/data-models', label: t('app.dataModels'), icon: Database },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Package className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">RestoSuite</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <h1 className="text-xl font-semibold">{navItems.find(i => i.path === location.pathname || (i.path !== '/' && location.pathname.startsWith(i.path)))?.label || t('app.title')}</h1>
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Sun className="w-4 h-4" />
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="bg-transparent border-none outline-none cursor-pointer dark:bg-slate-950"
              >
                <option value="light">{t('app.light')}</option>
                <option value="dark">{t('app.dark')}</option>
                <option value="system">{t('app.system')}</option>
              </select>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Globe className="w-4 h-4" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer dark:bg-slate-950"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* User Profile Mock */}
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
