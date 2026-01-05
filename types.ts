
export type Language = 'en' | 'vi';

export interface RoadmapItem {
  id: string;
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  contentEn: string;
  contentVi: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionVi: string;
  optionsEn: string[];
  optionsVi: string[];
  correctAnswerIndex: number;
  explanationEn: string;
  explanationVi: string;
}

export interface AppState {
  roadmap: RoadmapItem[];
  questions: QuizQuestion[];
  language: Language;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
