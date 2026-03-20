import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function TableNode({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden min-w-[180px]">
      <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{data.label}</span>
      </div>
      <div className="p-2 space-y-1">
        {data.fields?.map((field: any) => (
          <div key={field.name} className="flex items-center justify-between text-[10px] gap-4">
            <div className="flex items-center gap-1.5">
              <span className={field.isPrimary ? "text-amber-500 font-bold" : field.isForeign ? "text-indigo-500" : "text-slate-600 dark:text-slate-400"}>
                {field.name}
              </span>
            </div>
            <span className="text-slate-400 dark:text-slate-500 font-mono italic">{field.type}</span>
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-indigo-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-indigo-500" />
    </div>
  );
}
