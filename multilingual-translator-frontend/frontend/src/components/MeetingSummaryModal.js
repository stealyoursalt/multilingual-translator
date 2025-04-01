import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, FileCopy as CopyIcon, PictureAsPdf as PdfIcon, Close as CloseIcon } from '@mui/icons-material';
import { useSummary } from './SummaryContext';
import MeetingSummaryEditor from './MeetingSummaryEditor';

const MeetingSummaryModal = ({ open, onClose }) => {
  const { 
    summary, 
    isGenerating, 
    error, 
    isEditing, 
    startEditing, 
    getMarkdownSummary, 
    exportAsPdf 
  } = useSummary();

  // Handle copying the summary to clipboard
  const handleCopy = () => {
    const markdown = getMarkdownSummary();
    navigator.clipboard.writeText(markdown)
      .then(() => {
        alert('Meeting minutes copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard');
      });
  };

  // Handle exporting as PDF
  const handleExportPdf = async () => {
    const result = await exportAsPdf();
    if (result.success) {
      alert('PDF export functionality would be implemented here');
    } else {
      alert('Failed to export as PDF: ' + result.error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="meeting-summary-dialog-title"
    >
      <DialogTitle id="meeting-summary-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Meeting Minutes' : 'Meeting Minutes'}
        </Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {isGenerating ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress sx={{ color: '#D4FD51' }} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Generating meeting minutes...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" color="error">
              Error: {error}
            </Typography>
          </Box>
        ) : isEditing ? (
          <MeetingSummaryEditor />
        ) : summary ? (
          <Box>
            <Typography variant="h5" gutterBottom>
              {summary.title}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              <strong>Date:</strong> {summary.date}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              {summary.overview}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Key Points
            </Typography>
            <List dense>
              {summary.keyPoints.map((point, index) => (
                <ListItem key={index}>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Action Items
            </Typography>
            <List dense>
              {summary.actionItems.length > 0 ? (
                summary.actionItems.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No action items identified." />
                </ListItem>
              )}
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Decisions
            </Typography>
            <List dense>
              {summary.decisions.length > 0 ? (
                summary.decisions.map((decision, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={decision} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No decisions identified." />
                </ListItem>
              )}
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Next Steps
            </Typography>
            <Typography variant="body1" paragraph>
              {summary.nextSteps}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">
              No meeting minutes available. Click "Generate Meeting Minutes" to create a summary.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          {summary && !isEditing && (
            <Button 
              startIcon={<EditIcon />}
              onClick={startEditing}
              sx={{ color: 'black', backgroundColor: '#D4FD51', mr: 1, '&:hover': { backgroundColor: '#b8e046' } }}
            >
              Edit
            </Button>
          )}
        </Box>
        
        <Box>
          {summary && !isEditing && (
            <>
              <Tooltip title="Copy as Markdown">
                <Button 
                  startIcon={<CopyIcon />}
                  onClick={handleCopy}
                  sx={{ mr: 1 }}
                >
                  Copy
                </Button>
              </Tooltip>
              
              <Tooltip title="Export as PDF">
                <Button 
                  startIcon={<PdfIcon />}
                  onClick={handleExportPdf}
                  sx={{ mr: 1 }}
                >
                  Export PDF
                </Button>
              </Tooltip>
            </>
          )}
          
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MeetingSummaryModal;
