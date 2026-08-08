'use client';

import React, { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md h-screen sm:h-[880px] sm:max-h-[92vh] bg-slate-900 sm:rounded-[40px] border-0 sm:border-[8px] border-slate-800 shadow-2xl flex flex-col overflow-hidden relative sm:ring-1 sm:ring-slate-700/50">
        
        {/* Dynamic Island / Mobile Notch on Desktop View */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 bg-slate-900 z-50 shrink-0 select-none">
          <div className="w-28 h-4 bg-slate-950 rounded-full flex items-center justify-end px-2 space-x-1.5 border border-slate-800/80">
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-900/60 border border-indigo-500/40"></div>
          </div>
        </div>

        {/* Inner Content Body */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 text-slate-100">
          {children}
        </div>

        {/* Home Indicator bar on bottom */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 bg-slate-900 z-50 shrink-0 select-none">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
