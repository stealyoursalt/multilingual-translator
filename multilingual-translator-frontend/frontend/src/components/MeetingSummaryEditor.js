import React from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  IconButton, 
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon, 
  Cancel as CancelIcon 
} from '@mui/icons-material';
import { useSummary } from './SummaryContext';

const MeetingSummaryEditor = () => {
  const { 
    editedSummary, 
    updateSummaryField, 
    updateArrayItem, 
    addArrayItem, 
    removeArrayItem, 
    saveEdits, 
    cancelEditing 
  } = useSummary();

  if (!editedSummary) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">No summary data available for editing.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Title */}
      <TextField
        label="Meeting Title"
        fullWidth
        margin="normal"
        value={editedSummary.title || ''}
        onChange={(e) => updateSummaryField('title', e.target.value)}
      />
      
      {/* Date */}
      <TextField
        label="Date"
        fullWidth
        margin="normal"
        value={editedSummary.date || ''}
        onChange={(e) => updateSummaryField('date', e.target.value)}
      />
      
      {/* Overview */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Overview
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={editedSummary.overview || ''}
        onChange={(e) => updateSummaryField('overview', e.target.value)}
      />
      
      {/* Key Points */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Key Points
      </Typography>
      <List>
        {editedSummary.keyPoints && editedSummary.keyPoints.map((point, index) => (
          <ListItem key={index} sx={{ pl: 0 }}>
            <TextField
              fullWidth
              value={point}
              onChange={(e) => updateArrayItem('keyPoints', index, e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end" 
                      onClick={() => removeArrayItem('keyPoints', index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        ))}
        <ListItem sx={{ pl: 0 }}>
          <Button 
            startIcon={<AddIcon />} 
            onClick={() => addArrayItem('keyPoints')}
            sx={{ mt: 1 }}
          >
            Add Key Point
          </Button>
        </ListItem>
      </List>
      
      {/* Action Items */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Action Items
      </Typography>
      <List>
        {editedSummary.actionItems && editedSummary.actionItems.map((item, index) => (
          <ListItem key={index} sx={{ pl: 0 }}>
            <TextField
              fullWidth
              value={item}
              onChange={(e) => updateArrayItem('actionItems', index, e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end" 
                      onClick={() => removeArrayItem('actionItems', index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        ))}
        <ListItem sx={{ pl: 0 }}>
          <Button 
            startIcon={<AddIcon />} 
            onClick={() => addArrayItem('actionItems')}
            sx={{ mt: 1 }}
          >
            Add Action Item
          </Button>
        </ListItem>
      </List>
      
      {/* Decisions */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Decisions
      </Typography>
      <List>
        {editedSummary.decisions && editedSummary.decisions.map((decision, index) => (
          <ListItem key={index} sx={{ pl: 0 }}>
            <TextField
              fullWidth
              value={decision}
              onChange={(e) => updateArrayItem('decisions', index, e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end" 
                      onClick={() => removeArrayItem('decisions', index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        ))}
        <ListItem sx={{ pl: 0 }}>
          <Button 
            startIcon={<AddIcon />} 
            onClick={() => addArrayItem('decisions')}
            sx={{ mt: 1 }}
          >
            Add Decision
          </Button>
        </ListItem>
      </List>
      
      {/* Next Steps */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Next Steps
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={2}
        value={editedSummary.nextSteps || ''}
        onChange={(e) => updateSummaryField('nextSteps', e.target.value)}
      />
      
      {/* Save/Cancel Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          startIcon={<CancelIcon />} 
          onClick={cancelEditing}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button 
          startIcon={<SaveIcon />} 
          onClick={saveEdits}
          variant="contained"
          sx={{ 
            backgroundColor: '#D4FD51', 
            color: 'black',
            '&:hover': {
              backgroundColor: '#b8e046',
            }
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingSummaryEditor;
