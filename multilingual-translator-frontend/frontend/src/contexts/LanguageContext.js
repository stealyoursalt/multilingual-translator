import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Define supported languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' }
];

// Create context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // State for interface language
  const [interfaceLanguage, setInterfaceLanguage] = useState(
    LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0]
  );
  
  // State for source language with auto-detection option
  const [sourceLanguage, setSourceLanguage] = useState({ code: 'auto', name: 'Auto Detect' });
  
  // State for target language
  const [targetLanguage, setTargetLanguage] = useState(LANGUAGES[1]);
  
  // State to track detected language
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  
  // Effect to update source language when detected language changes
  // and automatically set target language based on detected source language
  useEffect(() => {
    if (detectedLanguage && sourceLanguage.code === 'auto') {
      // Find the language object that matches the detected code
      const detected = LANGUAGES.find(lang => lang.code === detectedLanguage);
      if (detected) {
        console.log(`Auto-detected language: ${detected.name}`);
        // We don't update sourceLanguage here to keep "Auto Detect" selected
        // but we store the detected language for use in translation
        
        // Automatically set target language based on detected source language
        if (detectedLanguage === 'zh') {
          // If Chinese is detected, set target to English
          const englishLang = LANGUAGES.find(lang => lang.code === 'en');
          setTargetLanguage(englishLang);
        } else {
          // If any other language is detected, set target to Chinese
          const chineseLang = LANGUAGES.find(lang => lang.code === 'zh');
          setTargetLanguage(chineseLang);
        }
      }
    }
  }, [detectedLanguage, sourceLanguage.code]);
  
  // Effect to change i18n language when interface language changes
  useEffect(() => {
    if (interfaceLanguage && interfaceLanguage.code) {
      i18n.changeLanguage(interfaceLanguage.code);
    }
  }, [interfaceLanguage, i18n]);
  
  // Function to get actual source language code (detected or selected)
  const getEffectiveSourceLanguage = () => {
    if (sourceLanguage.code === 'auto' && detectedLanguage) {
      return detectedLanguage;
    }
    return sourceLanguage.code;
  };
  
  const value = {
    interfaceLanguage,
    setInterfaceLanguage,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    detectedLanguage,
    setDetectedLanguage,
    getEffectiveSourceLanguage,
    supportedLanguages: [...LANGUAGES],
    allSourceLanguages: [{ code: 'auto', name: 'Auto Detect' }, ...LANGUAGES]
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
