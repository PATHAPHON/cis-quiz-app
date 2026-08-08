'use client';

import React, { useState } from 'react';
import { OptionId, Question } from '../types/quiz';

interface CustomQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (newQuestion: Question) => void;
  modules: { id: string; title: string }[];
}

export function CustomQuizModal({
  isOpen,
  onClose,
  onAddQuestion,
  modules,
}: CustomQuizModalProps) {
  const [moduleId, setModuleId] = useState(modules[0]?.id || 'module-1');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<OptionId>('a');
  const [explanation, setExplanation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !optionA.trim() || !optionB.trim()) {
      alert('กรุณากรอกโจทย์และอย่างน้อย 2 ตัวเลือกแรก');
      return;
    }

    const newQuestion: Question = {
      id: `custom-q-${Date.now()}`,
      moduleId,
      text: text.trim(),
      image: imageUrl.trim() || undefined,
      options: [
        { id: 'a', text: optionA.trim() },
        { id: 'b', text: optionB.trim() },
        ...(optionC.trim() ? [{ id: 'c' as OptionId, text: optionC.trim() }] : []),
        ...(optionD.trim() ? [{ id: 'd' as OptionId, text: optionD.trim() }] : []),
      ],
      correctAnswers: [correctAnswer],
      explanation: explanation.trim() || 'คำอธิบายเพิ่มเติมสำหรับข้อนี้',
      difficulty: 'ปานกลาง',
    };

    onAddQuestion(newQuestion);
    onClose();
    // Reset form
    setText('');
    setImageUrl('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
              ✨
            </div>
            <h3 className="text-base font-extrabold text-white">สร้างข้อสอบเพิ่มด้วยตนเอง</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Select Module */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">เลือกโมดูลข้อสอบ:</label>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-medium focus:border-indigo-500 outline-none"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">โจทย์คำถาม:</label>
            <textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="พิมพ์โจทย์ข้อสอบ เช่น จากภาพ เป็นรูปของส่วนประกอบใด..."
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-medium focus:border-indigo-500 outline-none resize-none"
              required
            />
          </div>

          {/* Image URL / Snippet */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">รูปภาพประกอบโจทย์ / ภาพครอป (Optional URL):</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="เช่น /snippets/sheet_bar.png หรือ https://..."
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-medium focus:border-indigo-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">💡 สามารถใช้ภาพครอปเฉพาะส่วน เช่น /snippets/sheet_bar.png หรือ URL รูปภาพได้</span>
          </div>

          {/* Options A - D */}
          <div className="space-y-2 pt-1">
            <label className="block text-slate-300 font-semibold">ช้อยส์ตัวเลือกตอบ:</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="ตัวเลือก A *"
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="ตัวเลือก B *"
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="ตัวเลือก C"
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="ตัวเลือก D"
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Correct Answer Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">เลือกคำตอบที่ถูกต้อง:</label>
            <div className="flex space-x-2">
              {(['a', 'b', 'c', 'd'] as OptionId[]).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setCorrectAnswer(opt)}
                  className={`flex-1 py-2 rounded-xl font-bold uppercase border transition ${
                    correctAnswer === opt
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  ข้อ {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">เฉลยและคำอธิบาย:</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="อธิบายเหตุผลว่าทำไมข้อนี้ถึงถูก..."
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold border border-slate-700 hover:bg-slate-700 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-black shadow-lg hover:brightness-110 transition active:scale-98"
            >
              บันทึกข้อสอบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
