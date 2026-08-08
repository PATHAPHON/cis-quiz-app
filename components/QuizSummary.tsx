'use client';

import React, { useEffect, useState } from 'react';
import { ModuleInfo, Question } from '../types/quiz';

interface QuizSummaryProps {
  moduleInfo?: ModuleInfo;
  questions: Question[];
  userAnswers: Record<string, string[]>;
  isRetryMode: boolean;
  retryRoundCount: number;
  originalQuestionCount: number;
  onRetryWrongQuestions: () => void;
  onRestartFullModule: () => void;
  onBackToHome: () => void;
}

export function QuizSummary({
  moduleInfo,
  questions,
  userAnswers,
  isRetryMode,
  retryRoundCount,
  originalQuestionCount,
  onRetryWrongQuestions,
  onRestartFullModule,
  onBackToHome,
}: QuizSummaryProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate results
  const wrongQuestions = questions.filter((q) => {
    const selected = userAnswers[q.id] || [];
    const isCorrect =
      selected.length === q.correctAnswers.length &&
      selected.every((id) => q.correctAnswers.includes(id as 'a' | 'b' | 'c' | 'd'));
    return !isCorrect;
  });

  const correctCount = questions.length - wrongQuestions.length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const isMastered100 = scorePercent === 100;

  useEffect(() => {
    if (isMastered100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isMastered100]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-5 animate-slide-up pb-8 relative">
      
      {/* Confetti Animation Overlay when 100% Mastery Achieved */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'][i % 5],
                animation: `confettiFall ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Header Result Card */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900 border border-slate-700/80 p-5 shadow-xl text-center space-y-4 relative overflow-hidden">
        
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
          <span>{moduleInfo ? moduleInfo.title : 'รวมข้อสอบ 3 โมดูล'}</span>
          {isRetryMode && (
            <span className="text-amber-400 font-bold ml-1">• รอบเรียนซ้ำครั้งที่ {retryRoundCount}</span>
          )}
        </div>

        {/* Score Ring Counter */}
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  isMastered100
                    ? 'text-emerald-400'
                    : scorePercent >= 70
                    ? 'text-sky-400'
                    : 'text-amber-400'
                } transition-all duration-1000 ease-out`}
                strokeDasharray={`${scorePercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{scorePercent}%</span>
              <span className="text-[11px] text-slate-400 font-medium">{correctCount} / {questions.length} ข้อ</span>
            </div>
          </div>

          {/* Mastery Message */}
          {isMastered100 ? (
            <div className="space-y-1 pt-1">
              <h3 className="text-lg font-extrabold text-emerald-400 animate-bounce">
                🎉 สุดยอดมาก! ตอบถูกครบ 100%
              </h3>
              <p className="text-xs text-slate-300">
                {isRetryMode
                  ? `คุณเรียนซ้ำจนตอบถูกหมดทุกข้อสำเร็จแล้ว!`
                  : `คุณทำข้อสอบตอบถูกหมดทุกข้อตั้งแต่รอบแรก!`}
              </p>
            </div>
          ) : (
            <div className="space-y-1 pt-1">
              <h3 className="text-base font-bold text-amber-300">
                ตอบถูก {correctCount} ข้อ (ยังมีข้อที่ตอบผิด {wrongQuestions.length} ข้อ)
              </h3>
              <p className="text-xs text-slate-400">
                กดปุ่มด้านล่างเพื่อ <strong className="text-amber-300 font-bold">เรียนซ้ำเฉพาะข้อที่ผิด</strong> จนกว่าจะ 100%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PRIMARY ACTION BUTTON: "เรียนซ้ำเฉพาะข้อที่ตอบผิด" */}
      {!isMastered100 && wrongQuestions.length > 0 && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/60 shadow-xl space-y-2 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                🔄
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-200">
                  เรียนซ้ำเฉพาะข้อที่ตอบผิด ({wrongQuestions.length} ข้อ)
                </h4>
                <p className="text-[11px] text-amber-300/80">ฝึกฝนเฉพาะข้อที่ยังตอบผิดในรอบนี้จนกว่าจะตอบถูกหมด</p>
              </div>
            </div>
          </div>

          <button
            onClick={onRetryWrongQuestions}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg transition active:scale-98 flex items-center justify-center space-x-2"
          >
            <span>คลิกเรียนซ้ำข้อผิด ({wrongQuestions.length} ข้อ)</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {/* Secondary Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onRestartFullModule}
          className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs shadow transition active:scale-98 flex items-center justify-center space-x-1.5"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>ทำใหม่ทั้งชุด</span>
        </button>

        <button
          onClick={onBackToHome}
          className="py-3 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:brightness-110 text-white font-bold text-xs shadow transition active:scale-98 flex items-center justify-center space-x-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>กลับหน้าหลัก (โมดูล)</span>
        </button>
      </div>

      {/* Review Questions Breakdown Header */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          สรุปการตอบข้อสอบย่อย ({questions.length} ข้อ)
        </h4>

        <div className="space-y-2.5">
          {questions.map((q, idx) => {
            const selected = userAnswers[q.id] || [];
            const isCorrect =
              selected.length === q.correctAnswers.length &&
              selected.every((id) => q.correctAnswers.includes(id as 'a' | 'b' | 'c' | 'd'));

            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                    : 'bg-rose-950/30 border-rose-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 pr-2">
                    <span
                      className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h5 className="font-bold text-slate-100 line-clamp-2">{q.text}</h5>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0 ${
                      isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {isCorrect ? 'ถูก' : 'ผิด'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                  <strong className="text-slate-300">เฉลย: </strong>
                  {q.options
                    .filter((o) => q.correctAnswers.includes(o.id))
                    .map((o) => `[${o.id.toUpperCase()}] ${o.text}`)
                    .join(' , ')}
                  <br />
                  <span className="text-[10px] opacity-80 mt-1 block">{q.explanation}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
