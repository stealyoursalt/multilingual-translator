import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { useTranscription } from '../contexts/TranscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';

const TranscriptionDisplay = () => {
  const { transcription, translation, isProcessing } = useTranscription();
  const { sourceLanguage, targetLanguage } = useLanguage();

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transcription & Translation
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              minHeight: 200, 
              backgroundColor: '#f5f5f5',
              position: 'relative'
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {sourceLanguage.name} (Original)
            </Typography>
            <Typography variant="body1">
              {transcription || 'No transcription available yet. Start recording to see content here.'}
            </Typography>
            {isProcessing && (
              <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                Processing...
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              minHeight: 200, 
              backgroundColor: '#f5f5f5',
              position: 'relative'
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {targetLanguage.name} (Translation)
            </Typography>
            <Typography variant="body1">
              {translation || 'Translation will appear here after transcription.'}
            </Typography>
            {isProcessing && (
              <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                Processing...
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TranscriptionDisplay;
