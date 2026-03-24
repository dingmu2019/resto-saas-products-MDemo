import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppProvider';
import { ShieldCheck, LayoutDashboard, Package, Tags, BookOpen, Settings, Moon, Sun, Monitor, Globe, Layers, Calculator, ShieldAlert, ListChecks, Image as ImageIcon, Database, Navigation } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

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
    { path: '/entitlements', label: t('product.entitlements'), icon: ShieldCheck },
    { path: '/bundles', label: t('app.bundles'), icon: Package },
    { path: '/features', label: t('app.features'), icon: ListChecks },
    { path: '/rules', label: t('app.rules'), icon: ShieldAlert },
    { path: '/taxes', label: t('app.taxes'), icon: Calculator },
    { path: '/tax-regions', label: t('app.taxRegions'), icon: Navigation },
    { path: '/media', label: t('app.media'), icon: ImageIcon },
    { path: '/price-books', label: t('app.priceBooks'), icon: BookOpen },
    // { path: '/cpq', label: t('app.cpqDemo'), icon: Monitor }, // Hidden as requested
    { path: '/data-models', label: t('app.dataModels'), icon: Database },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shadow-sm z-20">
        <div className="h-20 flex flex-col justify-center px-8 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">RestoSuite</span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 ml-10 opacity-70">
            v0.1.2-beat
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 translate-x-1" 
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {navItems.find(i => i.path === location.pathname || (i.path !== '/' && location.pathname.startsWith(i.path)))?.label || t('app.title')}
          </h1>
          <div className="flex items-center gap-8">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
                const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
                setTheme(themes[nextIndex]);
              }}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={t(`app.${theme}`)}
            >
              {theme === 'light' && <Sun className="w-5 h-5" />}
              {theme === 'dark' && <Moon className="w-5 h-5" />}
              {theme === 'system' && <Monitor className="w-5 h-5" />}
            </button>

            {/* Language Toggle */}
            <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
              <Globe className="w-4 h-4" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer dark:bg-slate-950 font-medium hover:text-indigo-600 transition-colors"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Settings className="w-5 h-5 text-slate-500" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-end">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin User</p>
                <p className="text-[10px] text-slate-500">admin@restosuite.com</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
