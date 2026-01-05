
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LanguageToggleProps {
  current: Language;
  onToggle: (lang: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ current, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(current === 'en' ? 'vi' : 'en')}
      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm border border-white/30"
    >
      <span className="font-semibold text-sm">
        {current === 'en' ? 'VN 🇻🇳' : 'EN 🇺🇸'}
      </span>
      <span className="text-xs uppercase opacity-80">
        {TRANSLATIONS[current].languageToggle}
      </span>
    </button>
  );
};

export default LanguageToggle;
