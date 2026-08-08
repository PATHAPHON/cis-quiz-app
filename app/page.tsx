'use client';

import React, { useEffect, useState } from 'react';
import { MobileContainer } from '../components/MobileContainer';
import { Header } from '../components/Header';
import { ModuleSelector } from '../components/ModuleSelector';
import { QuizCard } from '../components/QuizCard';
import { QuizSummary } from '../components/QuizSummary';
import { CustomQuizModal } from '../components/CustomQuizModal';
import { modulesData, questionsData as initialQuestionsData } from '../data/mockQuizzes';
import { AppScreen, ModuleProgress, OptionId, Question } from '../types/quiz';
import { playSound } from '../lib/audioUtils';

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('HOME');
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, OptionId[]>>({});
  const [isSubmittedCurrentQuestion, setIsSubmittedCurrentQuestion] = useState<boolean>(false);
  
  // Custom questions map state
  const [allQuestionsMap, setAllQuestionsMap] = useState<Record<string, Question[]>>(initialQuestionsData);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Retry missed questions engine state
  const [isRetryMode, setIsRetryMode] = useState<boolean>(false);
  const [retryRoundCount, setRetryRoundCount] = useState<number>(0);
  const [originalQuestionCount, setOriginalQuestionCount] = useState<number>(0);

  // Persistence maps
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress>>({});
  const [wrongQuestionsMap, setWrongQuestionsMap] = useState<Record<string, number>>({});

  // Load persisted progress from localStorage on mount
  useEffect(() => {
    try {
      const savedSound = localStorage.getItem('quiz_sound_enabled');
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');

      const savedProgress = localStorage.getItem('quiz_module_progress');
      if (savedProgress) setProgressMap(JSON.parse(savedProgress));

      const savedWrongs = localStorage.getItem('quiz_wrong_counts');
      if (savedWrongs) setWrongQuestionsMap(JSON.parse(savedWrongs));

      const savedCustomQs = localStorage.getItem('quiz_custom_questions');
      if (savedCustomQs) {
        const customArr: Question[] = JSON.parse(savedCustomQs);
        const updatedMap = { ...initialQuestionsData };
        customArr.forEach((q) => {
          if (!updatedMap[q.moduleId]) updatedMap[q.moduleId] = [];
          updatedMap[q.moduleId].push(q);
        });
        setAllQuestionsMap(updatedMap);
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
  }, []);

  const toggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    try {
      localStorage.setItem('quiz_sound_enabled', String(nextSound));
    } catch (e) {}
  };

  // Add custom question
  const handleAddQuestion = (newQuestion: Question) => {
    playSound('click', soundEnabled);
    const modId = newQuestion.moduleId;
    const existing = allQuestionsMap[modId] || [];
    const updated = [...existing, newQuestion];
    const newMap = { ...allQuestionsMap, [modId]: updated };
    setAllQuestionsMap(newMap);

    try {
      const savedCustomQsRaw = localStorage.getItem('quiz_custom_questions');
      const savedArr: Question[] = savedCustomQsRaw ? JSON.parse(savedCustomQsRaw) : [];
      savedArr.push(newQuestion);
      localStorage.setItem('quiz_custom_questions', JSON.stringify(savedArr));
    } catch (e) {}
  };

  // Start a module quiz round
  const handleSelectModule = (moduleId: string, retryOnly: boolean = false) => {
    playSound('click', soundEnabled);
    const fullQuestions = allQuestionsMap[moduleId] || [];

    if (retryOnly) {
      const savedAnswersRaw = localStorage.getItem(`quiz_answers_${moduleId}`);
      const savedAnswers: Record<string, OptionId[]> = savedAnswersRaw ? JSON.parse(savedAnswersRaw) : {};

      const missedQuestions = fullQuestions.filter((q) => {
        const selected = savedAnswers[q.id] || [];
        const isCorrect =
          selected.length === q.correctAnswers.length &&
          selected.every((id) => q.correctAnswers.includes(id));
        return !isCorrect;
      });

      const poolToUse = missedQuestions.length > 0 ? missedQuestions : fullQuestions;
      setActiveQuestions(poolToUse);
      setIsRetryMode(true);
      setRetryRoundCount((prev) => prev + 1);
    } else {
      setActiveQuestions(fullQuestions);
      setIsRetryMode(false);
      setRetryRoundCount(0);
    }

    setCurrentModuleId(moduleId);
    setOriginalQuestionCount(fullQuestions.length);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmittedCurrentQuestion(false);
    setScreen('QUIZ');
  };

  // Start All Mixed 3 Modules quiz
  const handleSelectAllMixed = () => {
    playSound('click', soundEnabled);
    const all = [
      ...(allQuestionsMap['module-1'] || []),
      ...(allQuestionsMap['module-2'] || []),
      ...(allQuestionsMap['module-3'] || []),
    ];
    
    const shuffled = [...all].sort(() => 0.5 - Math.random());

    setCurrentModuleId('mixed');
    setActiveQuestions(shuffled);
    setOriginalQuestionCount(shuffled.length);
    setIsRetryMode(false);
    setRetryRoundCount(0);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmittedCurrentQuestion(false);
    setScreen('QUIZ');
  };

  const handleSelectOption = (optionId: OptionId) => {
    if (isSubmittedCurrentQuestion) return;

    const currentQ = activeQuestions[currentQuestionIndex];
    const newAnswers = { ...userAnswers, [currentQ.id]: [optionId] };
    setUserAnswers(newAnswers);
    setIsSubmittedCurrentQuestion(true);

    const isCorrect = currentQ.correctAnswers.includes(optionId);
    if (isCorrect) {
      playSound('correct', soundEnabled);
    } else {
      playSound('incorrect', soundEnabled);
    }
  };

  const handleNextQuestion = () => {
    playSound('click', soundEnabled);
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsSubmittedCurrentQuestion(false);
    } else {
      finishQuizSession();
    }
  };

  const finishQuizSession = () => {
    let wrongCount = 0;
    activeQuestions.forEach((q) => {
      const selected = userAnswers[q.id] || [];
      const isCorrect =
        selected.length === q.correctAnswers.length &&
        selected.every((id) => q.correctAnswers.includes(id));
      if (!isCorrect) wrongCount++;
    });

    const correctCount = activeQuestions.length - wrongCount;
    const isMastered = wrongCount === 0;

    if (isMastered) {
      playSound('victory', soundEnabled);
    }

    if (currentModuleId && currentModuleId !== 'mixed') {
      const prevProgress = progressMap[currentModuleId];
      const newBestScore = Math.max(prevProgress?.bestScore || 0, correctCount);
      
      const updatedProgress: ModuleProgress = {
        moduleId: currentModuleId,
        bestScore: newBestScore,
        totalQuestions: activeQuestions.length,
        mastered: prevProgress?.mastered || isMastered,
        lastAttemptDate: new Date().toLocaleDateString('th-TH'),
      };

      const newProgressMap = { ...progressMap, [currentModuleId]: updatedProgress };
      const newWrongMap = { ...wrongQuestionsMap, [currentModuleId]: wrongCount };

      setProgressMap(newProgressMap);
      setWrongQuestionsMap(newWrongMap);

      try {
        localStorage.setItem('quiz_module_progress', JSON.stringify(newProgressMap));
        localStorage.setItem('quiz_wrong_counts', JSON.stringify(newWrongMap));
        localStorage.setItem(`quiz_answers_${currentModuleId}`, JSON.stringify(userAnswers));
      } catch (e) {}
    }

    setScreen('SUMMARY');
  };

  const handleRetryWrongQuestions = () => {
    playSound('click', soundEnabled);

    const wrongPool = activeQuestions.filter((q) => {
      const selected = userAnswers[q.id] || [];
      const isCorrect =
        selected.length === q.correctAnswers.length &&
        selected.every((id) => q.correctAnswers.includes(id));
      return !isCorrect;
    });

    setActiveQuestions(wrongPool);
    setIsRetryMode(true);
    setRetryRoundCount((prev) => prev + 1);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmittedCurrentQuestion(false);
    setScreen('QUIZ');
  };

  const handleRestartFullModule = () => {
    if (currentModuleId === 'mixed') {
      handleSelectAllMixed();
    } else if (currentModuleId) {
      handleSelectModule(currentModuleId, false);
    }
  };

  const handleBackToHome = () => {
    playSound('click', soundEnabled);
    setScreen('HOME');
  };

  const currentModuleObj = modulesData.find((m) => m.id === currentModuleId);
  const currentQuestion = activeQuestions[currentQuestionIndex];

  return (
    <MobileContainer>
      <Header
        screen={screen}
        moduleTitle={currentModuleObj?.title || (currentModuleId === 'mixed' ? 'รวมข้อสอบ 3 โมดูล' : '')}
        moduleCode={currentModuleObj?.code || (currentModuleId === 'mixed' ? 'ALL' : '')}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={activeQuestions.length}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onBackToHome={handleBackToHome}
        isRetryMode={isRetryMode}
      />

      {screen === 'HOME' && (
        <ModuleSelector
          modules={modulesData}
          progressMap={progressMap}
          wrongQuestionsMap={wrongQuestionsMap}
          onSelectModule={handleSelectModule}
          onSelectAllMixed={handleSelectAllMixed}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />
      )}

      {screen === 'QUIZ' && currentQuestion && (
        <QuizCard
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={activeQuestions.length}
          selectedAnswers={userAnswers[currentQuestion.id] || []}
          isSubmitted={isSubmittedCurrentQuestion}
          onSelectOption={handleSelectOption}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === activeQuestions.length - 1}
        />
      )}

      {screen === 'SUMMARY' && (
        <QuizSummary
          moduleInfo={currentModuleObj}
          questions={activeQuestions}
          userAnswers={userAnswers}
          isRetryMode={isRetryMode}
          retryRoundCount={retryRoundCount}
          originalQuestionCount={originalQuestionCount}
          onRetryWrongQuestions={handleRetryWrongQuestions}
          onRestartFullModule={handleRestartFullModule}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Custom Quiz Question & Image Snippet Modal Builder */}
      <CustomQuizModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddQuestion={handleAddQuestion}
        modules={modulesData}
      />
    </MobileContainer>
  );
}
