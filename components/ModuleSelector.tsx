'use client';

import React from 'react';
import { ModuleInfo, ModuleProgress } from '../types/quiz';

interface ModuleSelectorProps {
  modules: ModuleInfo[];
  progressMap: Record<string, ModuleProgress>;
  wrongQuestionsMap: Record<string, number>;
  onSelectModule: (moduleId: string, retryOnly?: boolean) => void;
  onSelectAllMixed: () => void;
  onOpenCustomModal: () => void;
}

export function ModuleSelector({
  modules,
  progressMap,
  wrongQuestionsMap,
  onSelectModule,
  onSelectAllMixed,
  onOpenCustomModal,
}: ModuleSelectorProps) {

  const totalCompletedModules = Object.values(progressMap).filter(p => p.bestScore > 0).length;
  const totalMasteredModules = Object.values(progressMap).filter(p => p.mastered).length;
  const totalWrongCount = Object.values(wrongQuestionsMap).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5 animate-slide-up pb-8">
      
      {/* Banner / Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900/80 via-slate-800 to-slate-900 border border-indigo-500/30 p-5 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>ระบบข้อสอบ 3 โมดูลพร้อมเฉลย</span>
            </div>

            <button
              onClick={onOpenCustomModal}
              className="px-2.5 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-[11px] border border-indigo-500/40 transition active:scale-95 flex items-center space-x-1"
            >
              <span>+ เพิ่มข้อสอบ</span>
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-white leading-tight">
            เตรียมสอบย่อย 3 โมดูลหลัก <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              ฝึกซ้ำจนกว่าจะตอบถูก 100%
            </span>
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            คลังข้อสอบจริงพร้อมภาพครอปเฉพาะส่วนเฉลย ตอบถูก/ผิดเห็นเฉลยทันที และสามารถกดเรียนซ้ำเฉพาะข้อที่ผิดได้
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/50">
            <div className="bg-slate-900/60 rounded-xl p-2 text-center border border-slate-700/40">
              <span className="text-[10px] text-slate-400 block font-medium">ทำแล้ว</span>
              <span className="text-sm font-bold text-slate-100">{totalCompletedModules}/3 โมดูล</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2 text-center border border-slate-700/40">
              <span className="text-[10px] text-slate-400 block font-medium">ตอบถูก 100%</span>
              <span className="text-sm font-bold text-emerald-400">{totalMasteredModules}/3 โมดูล</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2 text-center border border-slate-700/40">
              <span className="text-[10px] text-slate-400 block font-medium">ข้อที่ต้องเรียนซ้ำ</span>
              <span className={`text-sm font-bold ${totalWrongCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {totalWrongCount} ข้อ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Mixed Quiz Quick Action */}
      <button
        onClick={onSelectAllMixed}
        className="w-full group relative rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg active:scale-[0.99] transition duration-200"
      >
        <div className="w-full bg-slate-900 rounded-[15px] p-3.5 flex items-center justify-between group-hover:bg-slate-900/80 transition">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition">
                โหมดรวมข้อสอบ 3 โมดูล (All 142 ข้อ)
              </h3>
              <p className="text-[11px] text-slate-400">สุ่มทำข้อสอบรวม Spreadsheets, Social Media & Gen AI</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Modules List Header */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          เลือกทำตามโมดูล (3 Modules)
        </h3>
        <button
          onClick={onOpenCustomModal}
          className="text-[11px] text-indigo-400 font-bold hover:underline"
        >
          + สร้างข้อสอบเอง
        </button>
      </div>

      {/* 3 Modules Cards */}
      <div className="space-y-3.5">
        {modules.map((module) => {
          const progress = progressMap[module.id];
          const wrongCount = wrongQuestionsMap[module.id] || 0;
          const isMastered = progress?.mastered;
          const bestScore = progress?.bestScore || 0;
          const scorePercent = progress?.totalQuestions ? Math.round((bestScore / progress.totalQuestions) * 100) : 0;

          let cardBorder = 'border-slate-800';
          let badgeColor = 'bg-slate-800 text-slate-300';
          let gradientBtn = 'from-emerald-600 to-teal-600';

          if (module.id === 'module-1') {
            cardBorder = 'border-emerald-500/30 hover:border-emerald-500/60';
            badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            gradientBtn = 'from-emerald-600 to-teal-600';
          } else if (module.id === 'module-2') {
            cardBorder = 'border-sky-500/30 hover:border-sky-500/60';
            badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
            gradientBtn = 'from-sky-600 to-blue-600';
          } else if (module.id === 'module-3') {
            cardBorder = 'border-indigo-500/30 hover:border-indigo-500/60';
            badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
            gradientBtn = 'from-indigo-600 to-purple-600';
          }

          return (
            <div
              key={module.id}
              className={`rounded-2xl bg-slate-800/80 backdrop-blur border ${cardBorder} p-4 shadow-md space-y-3 transition duration-200`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${badgeColor}`}>
                    {module.code}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 leading-tight">
                      {module.title}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {module.subtitle}
                    </span>
                  </div>
                </div>

                {isMastered ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span>100%</span>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                ) : bestScore > 0 ? (
                  <span className="text-[11px] font-semibold text-slate-400">
                    ดีสุด: <strong className="text-indigo-400 font-bold">{scorePercent}%</strong>
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500">
                    {module.totalQuestions} ข้อ
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-normal line-clamp-2">
                {module.description}
              </p>

              {/* Retry Alert Tag */}
              {wrongCount > 0 && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>ข้อที่ตอบผิดสะสม <strong>{wrongCount} ข้อ</strong></span>
                  </div>
                  <button
                    onClick={() => onSelectModule(module.id, true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow transition active:scale-95"
                  >
                    เรียนซ้ำข้อผิด
                  </button>
                </div>
              )}

              {/* Module Action Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => onSelectModule(module.id, false)}
                  className={`flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r ${gradientBtn} hover:brightness-110 text-white font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center space-x-1.5`}
                >
                  <span>{bestScore > 0 ? 'ทำแบบทดสอบใหม่' : 'เริ่มทำแบบทดสอบ'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M3 12h18" />
                  </svg>
                </button>

                {wrongCount > 0 && (
                  <button
                    onClick={() => onSelectModule(module.id, true)}
                    className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition active:scale-98"
                    title="เรียนซ้ำเฉพาะข้อที่ตอบผิด"
                  >
                    เรียนซ้ำข้อผิด ({wrongCount})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2 pb-4 space-y-2">
        <p className="text-[11px] text-slate-500">
          💡 แสดงรูปภาพครอปเฉพาะส่วนเฉลยของแต่ละข้อ เพื่อความชัดเจนในการเรียนรู้
        </p>
      </div>
    </div>
  );
}
