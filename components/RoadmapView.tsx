
import React, { useState } from 'react';
import { RoadmapItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { CheckCircle2, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';

interface RoadmapViewProps {
  items: RoadmapItem[];
  language: Language;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ items, language }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const selectedItem = items.find(i => i.id === selectedItemId);

  if (selectedItem) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedItemId(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-bold mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          {TRANSLATIONS[language].back}
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {selectedItem.order}
              </div>
              <span className="uppercase tracking-widest text-xs font-bold opacity-80">Knowledge Area</span>
            </div>
            <h2 className="text-3xl font-black mb-2">
              {language === 'en' ? selectedItem.titleEn : selectedItem.titleVi}
            </h2>
            <p className="text-blue-100 text-lg">
              {language === 'en' ? selectedItem.descriptionEn : selectedItem.descriptionVi}
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-blue max-w-none">
              <div className="flex items-center text-gray-800 font-bold text-xl mb-6">
                <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                {TRANSLATIONS[language].details}
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {language === 'en' ? selectedItem.contentEn : selectedItem.contentVi}
              </p>
            </div>
            
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2">Practical Tip:</h4>
              <p className="text-gray-500 italic">
                {language === 'en' 
                  ? "Always align your technical tasks with the overall project Business Case to ensure value delivery."
                  : "Luôn điều chỉnh các nhiệm vụ kỹ thuật của bạn phù hợp với Business Case tổng thể của dự án để đảm bảo mang lại giá trị."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-100 hidden md:block"></div>
        <div className="space-y-8">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="relative flex items-start group">
              <div className="absolute left-6 w-10 h-10 -ml-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold z-10 hidden md:flex transition-colors group-hover:bg-blue-600 group-hover:text-white">
                {item.order}
              </div>
              <div 
                onClick={() => setSelectedItemId(item.id)}
                className="md:ml-12 bg-white rounded-2xl shadow-sm hover:shadow-xl p-6 border border-gray-100 w-full cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">
                    {language === 'en' ? item.titleEn : item.titleVi}
                  </h3>
                  <div className="p-1 bg-green-50 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {language === 'en' ? item.descriptionEn : item.descriptionVi}
                </p>
                <div className="flex items-center text-blue-600 text-sm font-bold uppercase tracking-wider">
                  {TRANSLATIONS[language].details} <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
