import React, { useEffect, useRef } from 'react';
import { Button, Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useTranscription } from '../contexts/TranscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import speechToTextService from '../services/SpeechToTextService';
import translationService from '../services/TranslationService';

const AudioCapture = () => {
  const { 
    isRecording, 
    setIsRecording, 
    setAudioStream, 
    audioStream,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    setTranscription,
    setTranslation
  } = useTranscription();
  
  const { sourceLanguage, targetLanguage } = useLanguage();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamingRef = useRef(null);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setError(null);
    setTranscription('');
    setTranslation('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start streaming transcription
      setIsProcessing(true);
      const streamingResult = await speechToTextService.streamTranscription(
        stream,
        sourceLanguage.code,
        async (transcriptionUpdate) => {
          if (transcriptionUpdate.transcript) {
            setTranscription(prev => 
              prev ? `${prev}\n${transcriptionUpdate.transcript}` : transcriptionUpdate.transcript
            );
            
            // Translate the transcription
            const translationResult = await translationService.translate(
              transcriptionUpdate.transcript,
              sourceLanguage.code,
              targetLanguage.code
            );
            
            if (translationResult.success) {
              setTranslation(prev => 
                prev ? `${prev}\n${translationResult.translatedText}` : translationResult.translatedText
              );
            }
          }
        }
      );
      
      if (streamingResult.success) {
        streamingRef.current = streamingResult.stopStreaming;
      } else {
        setError('Failed to start transcription streaming');
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop streaming transcription
      if (streamingRef.current) {
        streamingRef.current();
        streamingRef.current = null;
      }
      
      // Stop all audio tracks
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Cleanup function to stop recording when component unmounts
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, audioStream]);

  return (
    <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Audio Capture ({sourceLanguage.name})
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
      
      <Button
        variant="contained"
        color={isRecording ? "error" : "primary"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing && !isRecording}
        startIcon={isProcessing && !isRecording ? <CircularProgress size={24} color="inherit" /> : null}
        sx={{ minWidth: 200 }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      
      {isRecording && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Recording and transcribing in progress...
        </Typography>
      )}
    </Box>
  );
};

export default AudioCapture;
