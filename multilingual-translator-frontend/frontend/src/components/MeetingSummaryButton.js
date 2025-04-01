import React from 'react';
import { Button, Box } from '@mui/material';
import { useSummary } from './SummaryContext';
import { useTranscription } from '../contexts/TranscriptionContext';

const MeetingSummaryButton = () => {
  const { generateSummary, isGenerating } = useSummary();
  const { transcription } = useTranscription();
  
  // Determine if there's enough content to generate a summary
  const hasEnoughContent = transcription && transcription.length > 50;
  
  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="contained"
        onClick={generateSummary}
        disabled={isGenerating || !hasEnoughContent}
        sx={{
          backgroundColor: '#D4FD51',
          color: 'black',
          '&:hover': {
            backgroundColor: '#b8e046',
          },
          '&.Mui-disabled': {
            backgroundColor: '#f0f0f0',
            color: '#a0a0a0',
          }
        }}
      >
        {isGenerating ? 'Generating Minutes...' : 'Generate Meeting Minutes'}
      </Button>
    </Box>
  );
};

export default MeetingSummaryButton;
