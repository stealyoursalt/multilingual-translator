import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Switch, FormControlLabel } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import { useTranscription } from '../contexts/TranscriptionContext';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [recordWithoutTranslation, setRecordWithoutTranslation] = useState(false);
  
  const { transcription, translation } = useTranscription();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        showSnackbar('Recording stopped. You can now save the audio.', 'info');
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      showSnackbar('Recording started', 'success');
    } catch (error) {
      console.error('Error starting recording:', error);
      showSnackbar('Failed to start recording: ' + error.message, 'error');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const saveRecording = () => {
    if (!audioBlob) {
      showSnackbar('No recording to save', 'warning');
      return;
    }
    
    try {
      // Create a download link for the audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(audioUrl);
      
      // Also save the transcription and translation if not in pure recording mode
      if (!recordWithoutTranslation && (transcription || translation)) {
        const textContent = `
# Recording Session

## Date: ${new Date().toLocaleString()}

${recordWithoutTranslation ? '' : `
### Transcription
${transcription || 'No transcription available'}

### Translation
${translation || 'No translation available'}
`}
        `;
        
        const textBlob = new Blob([textContent], { type: 'text/markdown' });
        const textUrl = URL.createObjectURL(textBlob);
        const textLink = document.createElement('a');
        textLink.href = textUrl;
        textLink.download = `recording_text_${Date.now()}.md`;
        document.body.appendChild(textLink);
        textLink.click();
        document.body.removeChild(textLink);
        URL.revokeObjectURL(textUrl);
      }
      
      showSnackbar('Recording and text saved successfully', 'success');
    } catch (error) {
      console.error('Error saving recording:', error);
      showSnackbar('Failed to save recording: ' + error.message, 'error');
    }
  };
  
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const toggleRecordingMode = () => {
    setRecordWithoutTranslation(!recordWithoutTranslation);
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Audio Recording
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={recordWithoutTranslation}
            onChange={toggleRecordingMode}
            color="primary"
          />
        }
        label="Record without translation (for Tencent meetings or pure Chinese/English recording)"
      />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color={isRecording ? 'secondary' : 'primary'}
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={saveRecording}
          disabled={!audioBlob}
        >
          Save Audio & Text
        </Button>
      </Box>
      
      {audioBlob && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Preview Recording
          </Typography>
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </Box>
      )}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AudioRecorder;
