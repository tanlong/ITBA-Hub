
import React, { useState, useEffect } from 'react';
import { AppState, Language, RoadmapItem, QuizQuestion } from './types';
import { INITIAL_ROADMAP, INITIAL_QUESTIONS, TRANSLATIONS } from './constants';
import LanguageToggle from './components/LanguageToggle';
import RoadmapView from './components/RoadmapView';
import QuizView from './components/QuizView';
import AdminPanel from './components/AdminPanel';
import Chatbot from './components/Chatbot';
import { BookOpen, HelpCircle, Settings, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'quiz' | 'admin'>('roadmap');
  const [language, setLanguage] = useState<Language>('vi');
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(INITIAL_ROADMAP);
  const [questions, setQuestions] = useState<QuizQuestion[]>(INITIAL_QUESTIONS);

  // Persistence (LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem('itba_study_hub_data');
    if (saved) {
      try {
        const { roadmap: r, questions: q, lang: l } = JSON.parse(saved);
        if (r) setRoadmap(r);
        if (q) setQuestions(q);
        if (l) setLanguage(l);
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('itba_study_hub_data', JSON.stringify({ roadmap, questions, lang: language }));
  }, [roadmap, questions, language]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layout className="w-8 h-8 text-blue-200" />
            <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase">
              {TRANSLATIONS[language].appTitle}
            </h1>
          </div>
          <LanguageToggle current={language} onToggle={setLanguage} />
        </div>
        
        {/* Navigation Tabs */}
        <nav className="max-w-7xl mx-auto px-4 flex space-x-1">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center px-4 py-3 text-sm font-bold border-b-4 transition-all ${
              activeTab === 'roadmap' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {TRANSLATIONS[language].roadmap}
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center px-4 py-3 text-sm font-bold border-b-4 transition-all ${
              activeTab === 'quiz' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {TRANSLATIONS[language].quiz}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center px-4 py-3 text-sm font-bold border-b-4 transition-all ${
              activeTab === 'admin' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            {TRANSLATIONS[language].admin}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 animate-in fade-in slide-in-from-top-4 duration-700">
        {activeTab === 'roadmap' && <RoadmapView items={roadmap} language={language} />}
        {activeTab === 'quiz' && <QuizView questions={questions} language={language} />}
        {activeTab === 'admin' && (
          <AdminPanel 
            roadmap={roadmap} 
            questions={questions} 
            setRoadmap={setRoadmap} 
            setQuestions={setQuestions}
            language={language}
          />
        )}
      </main>

      {/* AI Chatbot */}
      <Chatbot language={language} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} ITBA Mastery Hub - Built for Future Business Analysts</p>
          <p className="mt-1">All technical terms follow BABOK® standards.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
