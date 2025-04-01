import React, { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranscription } from '../contexts/TranscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';

const RecordingStorage = () => {
  const { transcription, translation } = useTranscription();
  const { sourceLanguage, targetLanguage } = useLanguage();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');

  const handleSaveSession = () => {
    if (!transcription && !translation) {
      showSnackbar('No content to save', 'warning');
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    if (!sessionName.trim()) {
      showSnackbar('Please enter a session name', 'warning');
      return;
    }

    // In a real implementation, this would save to a database via the backend
    // For now, we'll save to localStorage
    const sessionData = {
      id: Date.now(),
      name: sessionName,
      date: new Date().toISOString(),
      sourceLanguage: sourceLanguage.code,
      targetLanguage: targetLanguage.code,
      transcription,
      translation
    };

    try {
      // Get existing sessions or initialize empty array
      const existingSessions = JSON.parse(localStorage.getItem('translationSessions') || '[]');
      existingSessions.push(sessionData);
      localStorage.setItem('translationSessions', JSON.stringify(existingSessions));
      
      showSnackbar('Session saved successfully', 'success');
      setSaveDialogOpen(false);
      setSessionName('');
    } catch (error) {
      console.error('Error saving session:', error);
      showSnackbar('Failed to save session', 'error');
    }
  };

  const handleDownload = () => {
    if (!transcription && !translation) {
      showSnackbar('No content to download', 'warning');
      return;
    }

    try {
      // Create content for download
      const content = `
# Multilingual Translation Session

## Source Language: ${sourceLanguage.name}
## Target Language: ${targetLanguage.name}
## Date: ${new Date().toLocaleString()}

### Original Transcription
${transcription || 'No transcription available'}

### Translation
${translation || 'No translation available'}
      `;

      // Create a blob and download link
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translation_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSnackbar('Content downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading content:', error);
      showSnackbar('Failed to download content', 'error');
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

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Save & Download
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={handleSaveSession}
          disabled={!transcription && !translation}
        >
          Save Session
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!transcription && !translation}
        >
          Download as Markdown
        </Button>
      </Box>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Translation Session</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Session Name"
            type="text"
            fullWidth
            variant="outlined"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveConfirm} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
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

export default RecordingStorage;
