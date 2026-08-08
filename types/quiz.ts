export type OptionId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export interface Option {
  id: OptionId;
  text: string;
  image?: string; // Optional image URL for visual choices
  iconType?: 'facebook' | 'tiktok' | 'googleplay' | 'line' | 'table-styles' | 'sparkline' | 'merge' | 'orientation' | 'fit-page' | 'select-all' | 'ribbon-hide';
}

export interface Question {
  id: string;
  moduleId: string; // 'module-1' | 'module-2' | 'module-3'
  questionNumber?: number;
  text: string;
  image?: string; // Image path e.g. '/image/SCR-20260808-kgxd.png'
  imageCaption?: string;
  options: Option[];
  correctAnswers: OptionId[]; // Supports single or multiple correct answers
  isMultiSelect?: boolean;
  explanation: string;
  difficulty?: 'ง่าย' | 'ปานกลาง' | 'ยาก';
}

export interface ModuleInfo {
  id: string;
  code: string; // e.g. 'M6', 'M9', 'AI'
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  colorTheme: string;
  totalQuestions: number;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswers: OptionId[];
  isCorrect: boolean;
  timestamp: number;
}

export interface ModuleProgress {
  moduleId: string;
  bestScore: number;
  totalQuestions: number;
  mastered: boolean;
  lastAttemptDate?: string;
}

export type AppScreen = 'HOME' | 'QUIZ' | 'SUMMARY';

export interface QuizState {
  currentModuleId: string | null;
  activeQuestions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, OptionId[]>;
  isSubmittedCurrentQuestion: boolean;
  isRetryMode: boolean;
  retryRoundCount: number;
  originalQuestionCount: number;
}
