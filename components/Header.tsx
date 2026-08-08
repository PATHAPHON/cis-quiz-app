'use client';

import React from 'react';
import { AppScreen } from '../types/quiz';

interface HeaderProps {
  screen: AppScreen;
  moduleTitle?: string;
  moduleCode?: string;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBackToHome: () => void;
  isRetryMode?: boolean;
}

export function Header({
  screen,
  moduleTitle,
  moduleCode,
  currentQuestionIndex = 0,
  totalQuestions = 0,
  soundEnabled,
  onToggleSound,
  onBackToHome,
  isRetryMode = false,
}: HeaderProps) {
  const progressPercent = totalQuestions > 0 ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 shrink-0 px-4 py-3 select-none">
      <div className="flex items-center justify-between">
        
        {/* Left Side: Back Button or App Brand */}
        <div className="flex items-center space-x-2">
          {screen !== 'HOME' ? (
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-slate-200 text-xs font-medium border border-slate-700/60"
              title="กลับหน้าหลัก"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              <span>หน้าหลัก</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">
                    EX
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-slate-100 leading-tight">Quiz Master</h1>
                <span className="text-[10px] text-slate-400 font-medium">3 Modules Exam App</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Module Title / Screen Badge */}
        {screen === 'QUIZ' && moduleTitle && (
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5">
              {moduleCode && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {moduleCode}
                </span>
              )}
              {isRetryMode && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  เรียนซ้ำข้อผิด
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-300 max-w-[130px] truncate">
              {moduleTitle}
            </span>
          </div>
        )}

        {/* Right Side: Sound Toggle Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-slate-800 text-indigo-400 border-indigo-500/30 hover:bg-slate-700'
                : 'bg-slate-800/60 text-slate-500 border-slate-800 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
          >
            {soundEnabled ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar (Quiz Screen Only) */}
      {screen === 'QUIZ' && totalQuestions > 0 && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-slate-400 px-0.5">
            <span>
              ข้อที่ <strong className="text-slate-100">{currentQuestionIndex + 1}</strong> จาก {totalQuestions}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isRetryMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                  : 'bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
    </header>
  );
}
