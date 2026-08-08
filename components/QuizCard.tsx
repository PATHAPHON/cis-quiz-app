'use client';

import React, { useEffect, useState } from 'react';
import { OptionId, Question } from '../types/quiz';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswers: OptionId[];
  isSubmitted: boolean;
  onSelectOption: (selected: OptionId | OptionId[]) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswers,
  isSubmitted,
  onSelectOption,
  onNextQuestion,
  isLastQuestion,
}: QuizCardProps) {
  const [isZoomImage, setIsZoomImage] = useState(false);
  const isMultiSelect = !!question.isMultiSelect || question.correctAnswers.length > 1;
  const [tempSelected, setTempSelected] = useState<OptionId[]>(selectedAnswers || []);

  useEffect(() => {
    setTempSelected(selectedAnswers || []);
  }, [question.id, isSubmitted, selectedAnswers]);

  const handleOptionClick = (id: OptionId) => {
    if (isSubmitted) return;

    if (isMultiSelect) {
      if (tempSelected.includes(id)) {
        setTempSelected(tempSelected.filter((item) => item !== id));
      } else {
        setTempSelected([...tempSelected, id]);
      }
    } else {
      onSelectOption(id);
    }
  };

  const handleConfirmMultiSubmit = () => {
    if (tempSelected.length === 0) return;
    onSelectOption(tempSelected);
  };

  const isSelected = (id: OptionId) =>
    isSubmitted
      ? selectedAnswers.includes(id)
      : isMultiSelect
      ? tempSelected.includes(id)
      : selectedAnswers.includes(id);

  const isCorrectOption = (id: OptionId) => question.correctAnswers.includes(id);
  
  const userGotItRight =
    isSubmitted &&
    selectedAnswers.length === question.correctAnswers.length &&
    selectedAnswers.every((id) => question.correctAnswers.includes(id));

  // Render SVG icons for visual options
  const renderOptionIcon = (iconType?: string) => {
    switch (iconType) {
      case 'facebook':
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow shrink-0">
            f
          </div>
        );
      case 'tiktok':
        return (
          <div className="w-9 h-9 rounded-xl bg-black border border-slate-700 flex items-center justify-center text-pink-500 font-black text-sm shadow shrink-0">
            🎵
          </div>
        );
      case 'googleplay':
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-black text-base shadow shrink-0">
            ▶️
          </div>
        );
      case 'line':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow shrink-0">
            LINE
          </div>
        );
      case 'merge':
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16M10 4v16M14 4v16" />
            </svg>
          </div>
        );
      case 'sparkline':
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'orientation':
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
          </div>
        );
      case 'fit-page':
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 animate-slide-up pb-8">
      
      {/* Question Header Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-indigo-400 border border-slate-700/60 shadow-sm">
          คำถามที่ {questionIndex + 1} / {totalQuestions}
        </span>

        {isMultiSelect ? (
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm flex items-center space-x-1">
            <span>☑️ เลือกตอบ {question.correctAnswers.length} ข้อ</span>
          </span>
        ) : question.difficulty ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              question.difficulty === 'ง่าย'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : question.difficulty === 'ปานกลาง'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            ระดับ: {question.difficulty}
          </span>
        ) : null}
      </div>

      {/* Question Card Box */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3">
        <h3 className="text-base font-bold text-slate-100 leading-relaxed">
          {question.text}
        </h3>

        {/* Question Image Diagram / Screenshot Figure */}
        {question.image && (
          <div className="space-y-1.5 pt-1">
            <div className="relative group rounded-xl overflow-hidden border border-indigo-500/40 bg-slate-950 p-1 shadow-inner">
              {/* Image Preview with click to zoom */}
              <img
                src={question.image}
                alt="รูปภาพประกอบโจทย์ข้อสอบ"
                className="w-full max-h-56 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
                onClick={() => setIsZoomImage(true)}
              />
              <button
                onClick={() => setIsZoomImage(true)}
                className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur text-indigo-300 text-[10px] font-bold border border-slate-700 flex items-center space-x-1 shadow"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <span>ขยายรูปภาพ</span>
              </button>
            </div>
            {question.imageCaption && (
              <span className="text-[10px] text-slate-400 block text-center italic">
                {question.imageCaption}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Modal Zoom Image */}
      {isZoomImage && question.image && (
        <div
          onClick={() => setIsZoomImage(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-xl w-full max-h-[85vh] bg-slate-900 rounded-2xl border border-indigo-500/40 p-2 shadow-2xl overflow-hidden flex flex-col items-center">
            <button
              onClick={() => setIsZoomImage(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold border border-slate-700"
            >
              ✕
            </button>
            <img
              src={question.image}
              alt="รูปภาพขยายเต็มจอ"
              className="w-full h-full object-contain rounded-xl max-h-[75vh]"
            />
            <span className="text-xs text-slate-300 mt-2 font-medium">แตะที่ใดก็ได้เพื่อปิดรูปภาพขยาย</span>
          </div>
        </div>
      )}

      {/* Choices Options List */}
      <div className="space-y-2.5">
        {question.options.map((option) => {
          const selected = isSelected(option.id);
          const correct = isCorrectOption(option.id);

          let optionStyle = 'bg-slate-800/70 border-slate-700/70 text-slate-200 hover:bg-slate-700/80';
          let badgeStyle = 'bg-slate-700 text-slate-300';
          let animationClass = '';

          if (isSubmitted) {
            if (correct) {
              optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-emerald-900/20 shadow-md';
              badgeStyle = 'bg-emerald-500 text-white font-bold';
              if (selected) animationClass = 'animate-correct';
            } else if (selected && !correct) {
              optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-rose-900/20 shadow-md';
              badgeStyle = 'bg-rose-500 text-white font-bold';
              animationClass = 'animate-shake';
            } else {
              optionStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              badgeStyle = 'bg-slate-800 text-slate-600';
            }
          } else if (selected) {
            optionStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-100 shadow-indigo-900/30';
            badgeStyle = 'bg-indigo-500 text-white font-bold';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={isSubmitted}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${optionStyle} ${animationClass}`}
            >
              <div className="flex items-center space-x-3 pr-2 flex-1">
                {isMultiSelect && (
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                      selected
                        ? 'bg-indigo-500 border-indigo-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-transparent'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 uppercase transition ${badgeStyle}`}>
                  {option.id}
                </span>

                {/* Optional visual icon rendering for choices */}
                {option.iconType && renderOptionIcon(option.iconType)}
                
                {/* Optional choice image */}
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.text}
                    className="w-12 h-12 object-contain rounded-lg border border-slate-700 bg-slate-900 shrink-0"
                  />
                )}

                <span className="text-xs font-semibold leading-relaxed">
                  {option.text}
                </span>
              </div>

              {/* Status Icons on Submission */}
              {isSubmitted && (
                <div className="shrink-0 pl-1">
                  {correct ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : selected && !correct ? (
                    <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Multi-Select Confirm Submission Button (before answer submission) */}
      {isMultiSelect && !isSubmitted && (
        <div className="pt-2 sticky bottom-0 z-10 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pb-2">
          <button
            onClick={handleConfirmMultiSubmit}
            disabled={tempSelected.length === 0}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-xl transition active:scale-98 flex items-center justify-center space-x-2 ${
              tempSelected.length > 0
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-110 text-white shadow-indigo-900/40 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60'
            }`}
          >
            <span>ยืนยันคำตอบ ({tempSelected.length} ข้อ)</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Instant Explanation Box */}
      {isSubmitted && (
        <div
          className={`rounded-2xl p-4 border space-y-2 animate-slide-up ${
            userGotItRight
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            {userGotItRight ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center space-x-1">
                <span>✓ ถูกต้อง!</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[11px] flex items-center space-x-1">
                <span>✕ ตอบผิด</span>
              </span>
            )}
            <span className="text-xs font-bold opacity-90">เฉลยและคำอธิบาย:</span>
          </div>

          <p className="text-xs leading-relaxed opacity-95">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Bottom Action: Next Question Button */}
      {isSubmitted && (
        <div className="pt-2 sticky bottom-0 z-10 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pb-2">
          <button
            onClick={onNextQuestion}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 hover:brightness-110 text-white font-bold text-sm shadow-xl transition active:scale-98 flex items-center justify-center space-x-2"
          >
            <span>{isLastQuestion ? 'ดูสรุปผลคะแนนประจำรอบ' : 'ข้อถัดไป'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M3 12h18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
