import React, { createContext, useState, useContext } from 'react';

const TranscriptionContext = createContext();

export const TranscriptionProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioStream, setAudioStream] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    isRecording,
    setIsRecording,
    transcription,
    setTranscription,
    translation,
    setTranslation,
    audioStream,
    setAudioStream,
    isProcessing,
    setIsProcessing,
    error,
    setError
  };

  return (
    <TranscriptionContext.Provider value={value}>
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
};
