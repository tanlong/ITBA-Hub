
import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCcw, BrainCircuit, AlertCircle, BookOpenCheck, ArrowRight, Lightbulb } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  language: Language;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, language }) => {
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const startNewSession = useCallback(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSessionQuestions(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
  }, [questions]);

  useEffect(() => {
    startNewSession();
  }, [startNewSession]);

  const handleAnswerSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const currentQuestion = sessionQuestions[currentIndex];
    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setIsSubmitted(true);
    }
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BrainCircuit className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500">No questions available. Add some in the Admin panel!</p>
      </div>
    );
  }

  const currentQuestion = sessionQuestions[currentIndex];
  const isFinished = currentIndex === sessionQuestions.length - 1 && isSubmitted;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-12 bg-white rounded-[3rem] shadow-2xl text-center border border-gray-100 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <BookOpenCheck className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">Practice Finished!</h2>
        <p className="text-gray-500 text-lg mb-10">You've successfully completed this ITBA knowledge audit.</p>
        
        <div className="inline-flex items-baseline space-x-2 bg-blue-50 px-10 py-6 rounded-3xl mb-12">
          <span className="text-7xl font-black text-blue-600 tracking-tighter">{score}</span>
          <span className="text-3xl font-bold text-blue-300">/</span>
          <span className="text-4xl font-black text-blue-400">{sessionQuestions.length}</span>
        </div>

        <button
          onClick={startNewSession}
          className="flex items-center justify-center space-x-3 w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group"
        >
          <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          <span>New Session</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Quiz Progress Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-blue-600 font-black uppercase tracking-widest text-sm mb-1">Knowledge Verification</h2>
          <p className="text-3xl font-black text-gray-800">ITBA Master Class</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 font-bold mb-2">Progress: {currentIndex + 1} / {sessionQuestions.length}</p>
          <div className="w-48 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200 p-0.5 shadow-inner">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out shadow-sm" 
              style={{ width: `${((currentIndex + (isSubmitted ? 1 : 0)) / sessionQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden transition-all duration-500 mb-8">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-10 leading-snug">
            {language === 'en' ? currentQuestion.questionEn : currentQuestion.questionVi}
          </h3>

          <div className="space-y-4">
            {(language === 'en' ? currentQuestion.optionsEn : currentQuestion.optionsVi).map((option, idx) => {
              let stateStyle = 'bg-gray-50 border-gray-100 hover:border-blue-200 hover:bg-white';
              let textStyle = 'text-gray-600';
              let circleStyle = 'bg-gray-100 text-gray-400';
              
              if (selectedAnswer === idx) {
                stateStyle = 'bg-blue-50 border-blue-500 ring-4 ring-blue-50';
                textStyle = 'text-blue-900';
                circleStyle = 'bg-blue-600 text-white shadow-lg shadow-blue-200';
              }

              if (isSubmitted) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  stateStyle = 'bg-green-50 border-green-500 ring-4 ring-green-50 shadow-md';
                  textStyle = 'text-green-900';
                  circleStyle = 'bg-green-600 text-white shadow-lg shadow-green-100';
                } else if (selectedAnswer === idx) {
                  stateStyle = 'bg-red-50 border-red-500 ring-4 ring-red-50 shadow-md';
                  textStyle = 'text-red-900';
                  circleStyle = 'bg-red-600 text-white shadow-lg shadow-red-100';
                } else {
                  stateStyle = 'bg-gray-50 border-gray-100 opacity-40 grayscale-[0.3] pointer-events-none';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full p-6 rounded-[1.5rem] border-2 text-left transition-all duration-300 flex items-center justify-between group ${stateStyle}`}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-300 group-hover:scale-105 ${circleStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`font-bold text-lg md:text-xl transition-colors duration-300 ${textStyle}`}>{option}</span>
                  </div>
                  <div className="flex items-center">
                    {isSubmitted && idx === currentQuestion.correctAnswerIndex && <CheckCircle className="w-8 h-8 text-green-600 animate-in zoom-in spin-in-90 duration-500" />}
                    {isSubmitted && selectedAnswer === idx && idx !== currentQuestion.correctAnswerIndex && <XCircle className="w-8 h-8 text-red-600 animate-in zoom-in duration-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`mt-12 w-full py-6 rounded-2xl font-black text-2xl text-white transition-all shadow-2xl active:scale-[0.97] ${
                selectedAnswer === null 
                ? 'bg-gray-200 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-200'
              }`}
            >
              Verify Knowledge
            </button>
          )}
        </div>
      </div>

      {/* Explanation Card - Only shown after submission */}
      {isSubmitted && (
        <div className="animate-in fade-in slide-in-from-top-10 duration-700 space-y-6">
          {/* Result Feedback Card */}
          <div className={`p-8 rounded-[2.5rem] shadow-xl border-2 flex flex-col md:flex-row items-center md:items-start space-y-5 md:space-y-0 md:space-x-8 ${
            selectedAnswer === currentQuestion.correctAnswerIndex 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
          }`}>
            <div className={`p-5 rounded-3xl shadow-lg flex-shrink-0 ${selectedAnswer === currentQuestion.correctAnswerIndex ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {selectedAnswer === currentQuestion.correctAnswerIndex ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>
            <div className="text-center md:text-left flex-1">
              <p className={`text-3xl font-black mb-3 ${selectedAnswer === currentQuestion.correctAnswerIndex ? 'text-green-800' : 'text-red-800'}`}>
                {selectedAnswer === currentQuestion.correctAnswerIndex ? TRANSLATIONS[language].correct : TRANSLATIONS[language].incorrect}
              </p>
              {selectedAnswer !== currentQuestion.correctAnswerIndex && (
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-red-100 shadow-sm inline-block w-full">
                  <p className="text-red-900 font-bold text-lg mb-1">Correct Answer:</p>
                  <p className="text-2xl font-black text-red-600">
                    {(language === 'en' ? currentQuestion.optionsEn : currentQuestion.optionsVi)[currentQuestion.correctAnswerIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Explanation Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden relative">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <Lightbulb className="w-6 h-6 text-yellow-300" />
                <h4 className="text-xl font-black uppercase tracking-wider">{TRANSLATIONS[language].explanation}</h4>
              </div>
              <span className="text-xs font-bold opacity-75 uppercase tracking-[0.2em]">Expert Analysis</span>
            </div>
            
            <div className="p-8 md:p-12 bg-gradient-to-b from-blue-50/30 to-white">
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-500 font-black text-xs uppercase tracking-widest mb-6 border-b border-blue-100 pb-2">
                  BABOK® v3 - Deep Dive (~250 words)
                </p>
                <div className="text-gray-800 leading-[1.8] whitespace-pre-line text-lg font-medium">
                  {language === 'en' ? currentQuestion.explanationEn : currentQuestion.explanationVi}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xl hover:bg-black transition-all flex items-center shadow-xl active:scale-[0.98] group"
                >
                  <span>{currentIndex === sessionQuestions.length - 1 ? TRANSLATIONS[language].finish : TRANSLATIONS[language].next}</span>
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
