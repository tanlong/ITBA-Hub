
import React, { useState, useRef } from 'react';
import { RoadmapItem, QuizQuestion, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateAIQuestions } from '../services/geminiService';
import { Plus, Trash2, Edit3, Download, Upload, Sparkles, Loader2, X, Save, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AdminPanelProps {
  roadmap: RoadmapItem[];
  questions: QuizQuestion[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  language: Language;
}

interface DeleteConfirmation {
  id: string;
  type: 'roadmap' | 'question';
  title: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ roadmap, questions, setRoadmap, setQuestions, language }) => {
  const [tab, setTab] = useState<'roadmap' | 'questions'>('roadmap');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation | null>(null);
  
  const roadmapInputRef = useRef<HTMLInputElement>(null);
  const questionsInputRef = useRef<HTMLInputElement>(null);

  // --- ROADMAP DATA HANDLERS ---
  const exportRoadmap = () => {
    const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itba-roadmap-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importRoadmap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setRoadmap(data);
          alert(language === 'en' ? 'Roadmap imported successfully!' : 'Đã nhập lộ trình thành công!');
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        alert(language === 'en' ? 'Invalid Roadmap file format.' : 'Định dạng tệp Lộ trình không hợp lệ.');
      }
    };
    reader.readAsText(file);
    if (roadmapInputRef.current) roadmapInputRef.current.value = '';
  };

  // --- QUIZ DATA HANDLERS ---
  const exportQuestions = () => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itba-questions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setQuestions(data);
          alert(language === 'en' ? 'Questions imported successfully!' : 'Đã nhập câu hỏi thành công!');
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        alert(language === 'en' ? 'Invalid Questions file format.' : 'Định dạng tệp Câu hỏi không hợp lệ.');
      }
    };
    reader.readAsText(file);
    if (questionsInputRef.current) questionsInputRef.current.value = '';
  };

  const saveRoadmapItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    setRoadmap(prev => {
      const exists = prev.find(i => String(i.id) === String(editingItem.id));
      if (exists) {
        return prev.map(i => String(i.id) === String(editingItem.id) ? editingItem : i);
      } else {
        return [...prev, editingItem];
      }
    });
    setEditingItem(null);
  };

  const saveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setQuestions(prev => {
      const exists = prev.find(q => String(q.id) === String(editingQuestion.id));
      if (exists) {
        return prev.map(q => String(q.id) === String(editingQuestion.id) ? editingQuestion : q);
      } else {
        return [...prev, editingQuestion];
      }
    });
    setEditingQuestion(null);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'roadmap') {
      setRoadmap(prev => prev.filter(item => String(item.id) !== String(deleteConfirm.id)));
    } else {
      setQuestions(prev => prev.filter(q => String(q.id) !== String(deleteConfirm.id)));
    }
    setDeleteConfirm(null);
  };

  const handleAiGenerate = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    try {
      const newQuestions = await generateAIQuestions(aiTopic, 10);
      setQuestions(prev => [...prev, ...newQuestions]);
      setAiTopic('');
    } catch (error) {
      alert(language === 'en' ? 'Failed to generate questions.' : 'Lỗi khi tạo câu hỏi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">
                {language === 'en' ? 'Are you sure?' : 'Bạn có chắc chắn?'}
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                {language === 'en' 
                  ? `You are about to delete "${deleteConfirm.title}". This action cannot be undone.`
                  : `Bạn sắp xóa "${deleteConfirm.title}". Hành động này không thể hoàn tác.`}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {TRANSLATIONS[language].cancel}
                </button>
                <button 
                  onClick={confirmDelete}
                  className="py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95"
                >
                  {TRANSLATIONS[language].delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-gray-800 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                {TRANSLATIONS[language].editRoadmap}
              </h3>
              <button type="button" onClick={() => setEditingItem(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={saveRoadmapItem} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{TRANSLATIONS[language].title} (EN)</label>
                  <input required className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" value={editingItem.titleEn} onChange={e => setEditingItem({...editingItem, titleEn: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{TRANSLATIONS[language].title} (VI)</label>
                  <input required className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" value={editingItem.titleVi} onChange={e => setEditingItem({...editingItem, titleVi: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{TRANSLATIONS[language].description} (EN)</label>
                  <textarea className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={2} value={editingItem.descriptionEn} onChange={e => setEditingItem({...editingItem, descriptionEn: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{TRANSLATIONS[language].description} (VI)</label>
                  <textarea className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={2} value={editingItem.descriptionVi} onChange={e => setEditingItem({...editingItem, descriptionVi: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{TRANSLATIONS[language].detailedContent} (EN)</label>
                  <textarea className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={6} value={editingItem.contentEn} onChange={e => setEditingItem({...editingItem, contentEn: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{TRANSLATIONS[language].detailedContent} (VI)</label>
                  <textarea className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={6} value={editingItem.contentVi} onChange={e => setEditingItem({...editingItem, contentVi: e.target.value})} />
                </div>
              </div>

              <div className="w-32">
                <label className="block text-sm font-bold text-gray-700 mb-2">{TRANSLATIONS[language].order}</label>
                <input type="number" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" value={editingItem.order} onChange={e => setEditingItem({...editingItem, order: parseInt(e.target.value) || 0})} />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setEditingItem(null)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">{TRANSLATIONS[language].cancel}</button>
                <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center shadow-lg shadow-blue-100 transition-all active:scale-95"><Save className="w-5 h-5 mr-2" />{TRANSLATIONS[language].save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Editor Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-gray-800 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                Edit Question
              </h3>
              <button type="button" onClick={() => setEditingQuestion(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={saveQuestion} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Question Text</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Question (EN)" value={editingQuestion.questionEn} onChange={e => setEditingQuestion({...editingQuestion, questionEn: e.target.value})} />
                  <textarea required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Question (VI)" value={editingQuestion.questionVi} onChange={e => setEditingQuestion({...editingQuestion, questionVi: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Options (EN / VI)</label>
                {[0, 1, 2, 3].map(idx => (
                  <div key={idx} className="flex items-center space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setEditingQuestion({...editingQuestion, correctAnswerIndex: idx})}
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs transition-colors ${editingQuestion.correctAnswerIndex === idx ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                    >
                      {editingQuestion.correctAnswerIndex === idx ? <CheckCircle2 className="w-5 h-5" /> : String.fromCharCode(65 + idx)}
                    </button>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input 
                        className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                        value={editingQuestion.optionsEn[idx]} 
                        onChange={e => {
                          const newOpts = [...editingQuestion.optionsEn];
                          newOpts[idx] = e.target.value;
                          setEditingQuestion({...editingQuestion, optionsEn: newOpts});
                        }} 
                      />
                      <input 
                        className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                        value={editingQuestion.optionsVi[idx]} 
                        onChange={e => {
                          const newOpts = [...editingQuestion.optionsVi];
                          newOpts[idx] = e.target.value;
                          setEditingQuestion({...editingQuestion, optionsVi: newOpts});
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Detailed Explanations</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" rows={8} placeholder="Explanation (EN)" value={editingQuestion.explanationEn} onChange={e => setEditingQuestion({...editingQuestion, explanationEn: e.target.value})} />
                  <textarea required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" rows={8} placeholder="Explanation (VI)" value={editingQuestion.explanationVi} onChange={e => setEditingQuestion({...editingQuestion, explanationVi: e.target.value})} />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setEditingQuestion(null)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">{TRANSLATIONS[language].cancel}</button>
                <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center shadow-lg shadow-blue-100 transition-all active:scale-95"><Save className="w-5 h-5 mr-2" />{TRANSLATIONS[language].save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <h2 className="text-3xl font-black text-gray-800">{TRANSLATIONS[language].admin}</h2>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
        <button type="button" onClick={() => setTab('roadmap')} className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === 'roadmap' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{TRANSLATIONS[language].roadmap}</button>
        <button type="button" onClick={() => setTab('questions')} className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === 'questions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{TRANSLATIONS[language].quiz}</button>
      </div>

      {tab === 'roadmap' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <button type="button" onClick={() => setEditingItem({ id: Date.now().toString(), titleEn: '', titleVi: '', descriptionEn: '', descriptionVi: '', contentEn: '', contentVi: '', order: roadmap.length + 1 })} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"><Plus className="w-5 h-5 mr-2" /> {TRANSLATIONS[language].addStep}</button>
            <div className="flex space-x-2">
              <button onClick={exportRoadmap} className="flex items-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700 transition-all">
                <Download className="w-4 h-4 mr-2" /> {TRANSLATIONS[language].export}
              </button>
              <label className="flex items-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700 transition-all cursor-pointer">
                <Upload className="w-4 h-4 mr-2" /> {TRANSLATIONS[language].import}
                <input ref={roadmapInputRef} type="file" className="hidden" onChange={importRoadmap} accept=".json" />
              </label>
            </div>
          </div>
          
          <div className="grid gap-4">
            {[...roadmap].sort((a,b) => a.order - b.order).map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md flex justify-between items-center transition-all group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold mr-4">{item.order}</div>
                  <div>
                    <div className="font-black text-gray-800 text-lg">{language === 'en' ? item.titleEn : item.titleVi}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{language === 'en' ? item.descriptionEn : item.descriptionVi}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => setEditingItem(item)} 
                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all active:scale-90" 
                    title={language === 'en' ? 'Edit' : 'Sửa'}
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setDeleteConfirm({ id: item.id, type: 'roadmap', title: language === 'en' ? item.titleEn : item.titleVi })} 
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all active:scale-90" 
                    title={language === 'en' ? 'Delete' : 'Xóa'}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h4 className="font-black text-2xl mb-4 flex items-center"><Sparkles className="w-6 h-6 mr-2 text-yellow-300" />AI Content Engine</h4>
              <p className="text-blue-100 mb-6 max-w-lg">Generate high-quality BABOK-aligned quiz questions automatically based on any ITBA topic.</p>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <input type="text" placeholder="e.g. Stakeholder Identification..." className="flex-1 p-4 rounded-2xl border-none focus:ring-4 focus:ring-white/20 outline-none text-gray-800 font-medium" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} />
                <button type="button" onClick={handleAiGenerate} disabled={isGenerating || !aiTopic} className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-black hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center transition-all active:scale-95">
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {TRANSLATIONS[language].generateAI}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 space-y-2 sm:space-y-0">
              <h3 className="font-black text-xl text-gray-800 flex items-center">
                <span>Question Bank ({questions.length})</span>
                <button type="button" onClick={() => setEditingQuestion({ id: `q-${Date.now()}`, questionEn: '', questionVi: '', optionsEn: ['', '', '', ''], optionsVi: ['', '', '', ''], correctAnswerIndex: 0, explanationEn: '', explanationVi: '' })} className="ml-4 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-all">+ Manual</button>
              </h3>
              <div className="flex space-x-2">
                <button onClick={exportQuestions} className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> {TRANSLATIONS[language].export}
                </button>
                <label className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> {TRANSLATIONS[language].import}
                  <input ref={questionsInputRef} type="file" className="hidden" onChange={importQuestions} accept=".json" />
                </label>
              </div>
            </div>
            
            <div className="grid gap-4">
              {questions.map(q => (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-gray-800 text-lg leading-tight pr-8">{language === 'en' ? q.questionEn : q.questionVi}</div>
                    <div className="flex space-x-1">
                      <button 
                        type="button"
                        onClick={() => setEditingQuestion(q)} 
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90" 
                        title={language === 'en' ? 'Edit' : 'Sửa'}
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDeleteConfirm({ id: q.id, type: 'question', title: (language === 'en' ? q.questionEn : q.questionVi).substring(0, 40) + '...' })} 
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90" 
                        title={language === 'en' ? 'Delete' : 'Xóa'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(language === 'en' ? q.optionsEn : q.optionsVi).map((opt, idx) => (
                      <span key={idx} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${idx === q.correctAnswerIndex ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>{opt}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
