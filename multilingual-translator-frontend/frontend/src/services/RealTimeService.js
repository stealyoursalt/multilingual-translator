import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useTranscription } from '../contexts/TranscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';

// This service handles real-time communication with the backend
const RealTimeService = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const { setTranscription, setTranslation, isRecording } = useTranscription();
  const { sourceLanguage, targetLanguage } = useLanguage();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for transcription events from the server
    socket.on('transcription', (data) => {
      if (data.transcript) {
        setTranscription(prev => 
          prev ? `${prev}\n${data.transcript}` : data.transcript
        );
      }
    });

    // Listen for translation events from the server
    socket.on('translation', (data) => {
      if (data.translatedText) {
        setTranslation(prev => 
          prev ? `${prev}\n${data.translatedText}` : data.translatedText
        );
      }
    });

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('transcription');
      socket.off('translation');
    };
  }, [socket, isConnected, setTranscription, setTranslation]);

  // Function to send audio data to the server
  const sendAudioData = (audioData) => {
    if (!socket || !isConnected || !isRecording) return;

    socket.emit('stream-audio', {
      audio: audioData,
      language: sourceLanguage.code,
      sourceLanguage: sourceLanguage.code,
      targetLanguage: targetLanguage.code
    });
  };

  return children;
};

export default RealTimeService;
