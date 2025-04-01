import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Alert, Paper, Divider, Link } from '@mui/material';
import { useTranscription } from '../contexts/TranscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import speechToTextService from '../services/SpeechToTextService';
import translationService from '../services/TranslationService';

const ZoomAudioCapture = () => {
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
  const [zoomConnected, setZoomConnected] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const streamingRef = useRef(null);

  // This function would integrate with Zoom SDK in a production environment
  const connectToZoom = () => {
    // In a real implementation, this would use the Zoom SDK
    // For now, we'll simulate the connection
    setZoomConnected(true);
    setError(null);
  };

  const disconnectFromZoom = () => {
    if (isRecording) {
      stopCapturingZoomAudio();
    }
    setZoomConnected(false);
  };

  const startCapturingZoomAudio = async () => {
    setError(null);
    setTranscription('');
    setTranslation('');
    
    try {
      // In a real implementation, this would use the Zoom SDK to capture audio
      // For now, we'll use the browser's audio capture as a simulation
      // Using higher quality audio settings for better language recognition
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2
        } 
      });
      
      setAudioStream(stream);
      setIsRecording(true);
      setError(null);
      
      // Start streaming transcription with optimized settings for Zoom
      setIsProcessing(true);
      const streamingResult = await speechToTextService.streamTranscription(
        stream,
        sourceLanguage.code,
        async (transcriptionUpdate) => {
          if (transcriptionUpdate.transcript) {
            // Use non-blocking state updates for better performance
            setTranscription(prev => 
              prev ? `${prev}\n${transcriptionUpdate.transcript}` : transcriptionUpdate.transcript
            );
            
            // Optimize translation pipeline for speed
            // Process in parallel when possible
            const translationPromise = translationService.translate(
              transcriptionUpdate.transcript,
              sourceLanguage.code,
              targetLanguage.code
            );
            
            // Continue processing while translation happens
            
            const translationResult = await translationPromise;
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
      console.error('Error capturing Zoom audio:', err);
      setError('Could not capture audio from Zoom. Please check permissions and settings.');
      setIsProcessing(false);
    }
  };

  const stopCapturingZoomAudio = () => {
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
  };

  useEffect(() => {
    return () => {
      // Cleanup function
      if (zoomConnected) {
        disconnectFromZoom();
      }
    };
  }, []);

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        Zoom Meeting Audio Capture
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          color={zoomConnected ? "success" : "primary"}
          onClick={zoomConnected ? disconnectFromZoom : connectToZoom}
          disabled={isProcessing && !isRecording}
        >
          {zoomConnected ? "Disconnect from Zoom" : "Connect to Zoom"}
        </Button>
        
        {zoomConnected && (
          <Button
            variant="contained"
            color={isRecording ? "error" : "primary"}
            onClick={isRecording ? stopCapturingZoomAudio : startCapturingZoomAudio}
            disabled={!zoomConnected || (isProcessing && !isRecording)}
          >
            {isRecording ? "Stop Capturing" : "Start Capturing Zoom Audio"}
          </Button>
        )}
        
        <Button
          variant="text"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </Button>
      </Box>
      
      {showInstructions && (
        <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
          <Typography variant="subtitle1" gutterBottom>
            How to Capture Zoom Audio
          </Typography>
          
          <Typography variant="body2" paragraph>
            In a production environment, this app would use the Zoom SDK to directly capture meeting audio. For development purposes, you can use one of these methods:
          </Typography>
          
          <Typography variant="body2" component="div">
            <ol>
              <li>
                <strong>Zoom SDK Integration:</strong> Requires Zoom developer account and OAuth setup.
                <Link href="https://marketplace.zoom.us/docs/sdk/native-sdks/web" target="_blank" sx={{ display: 'block', ml: 2 }}>
                  Zoom Web SDK Documentation
                </Link>
              </li>
              <Divider sx={{ my: 1 }} />
              <li>
                <strong>System Audio Routing:</strong> Use virtual audio cable software to route Zoom audio to this app.
                <ul>
                  <li>Windows: VB-Cable or Voicemeeter</li>
                  <li>Mac: Loopback or BlackHole</li>
                  <li>Linux: PulseAudio or JACK</li>
                </ul>
              </li>
              <Divider sx={{ my: 1 }} />
              <li>
                <strong>Browser Tab Audio:</strong> Use Chrome's tab audio capture feature (requires HTTPS).
              </li>
            </ol>
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Note: For this demo, clicking "Connect to Zoom" simulates a connection, and "Start Capturing" uses your microphone to simulate Zoom audio capture.
          </Alert>
        </Paper>
      )}
      
      {zoomConnected && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {isRecording 
            ? "Currently capturing and transcribing audio from Zoom meeting." 
            : "Connected to Zoom. Click 'Start Capturing' to begin audio capture and transcription."}
        </Alert>
      )}
    </Box>
  );
};

export default ZoomAudioCapture;
