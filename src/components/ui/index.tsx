import React from 'react';
import { cn } from '../Layout';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-8 py-5 border-b border-slate-100 dark:border-slate-800/50", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-8", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default', className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'info' }) {
  const variants = {
    default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
    error: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30",
    info: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30",
    outline: "border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400"
  };
  
  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }) {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-500/20",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg shadow-slate-900/10",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-6 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-3.5 text-base rounded-2xl"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("inline-flex items-center justify-center font-bold tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Table({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto custom-scrollbar rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
      <table className={cn("w-full text-sm text-left border-collapse", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800" {...props}>{children}</thead>;
}

export function Tbody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50" {...props}>{children}</tbody>;
}

export function Tr({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group", className)} {...props}>{children}</tr>;
}

export function Th({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope="col" className={cn("px-8 py-4 font-bold", className)} {...props}>{children}</th>;
}

export function Td({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-8 py-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors break-words", className)} {...props}>{children}</td>;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn("w-full px-5 py-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400", className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select 
      className={cn("w-full px-5 py-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={cn("w-full px-5 py-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[120px] placeholder:text-slate-400", className)}
      {...props}
    />
  );
}

export function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1", className)} {...props}>
      {children}
    </label>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] border border-white/20 overflow-hidden"
          >
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800/50">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h3>
              <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-300 hover:rotate-90">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="px-8 py-6 overflow-y-auto custom-scrollbar flex-1">
              {children}
            </div>
            {footer && (
              <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 flex justify-end gap-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText,
  variant = 'danger'
}: ConfirmModalProps) {
  const { t } = useTranslation();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md flex flex-col border border-white/20 overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
            </div>
            <div className="px-8 pb-8 flex justify-end gap-4">
              <Button variant="outline" onClick={onClose} className="border-slate-200 dark:border-slate-800">
                {cancelText || t('common.cancel')}
              </Button>
              <Button 
                onClick={() => { onConfirm(); onClose(); }} 
                variant={variant === 'danger' ? 'primary' : 'primary'}
                className={variant === 'danger' ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20" : ""}
              >
                {confirmText || t('common.confirm')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  totalItems: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange, totalItems }: PaginationProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/50">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {t('common.paginationInfo', { 
          start: (currentPage - 1) * pageSize + 1, 
          end: Math.min(currentPage * pageSize, totalItems), 
          total: totalItems 
        })}
      </div>
      
      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-3 mr-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('common.pageSize')}</span>
            <select 
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-10 h-10 p-0 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = 1;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
              }
              
              if (pageNum <= 0 || pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-10 h-10 p-0 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
