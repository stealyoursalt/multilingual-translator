import React, { createContext, useState, useContext } from 'react';
import SummaryService from './SummaryService';
import { useTranscription } from '../contexts/TranscriptionContext';

const SummaryContext = createContext();

export const SummaryProvider = ({ children }) => {
  const { transcription } = useTranscription();
  const [summary, setSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(null);

  // Generate meeting minutes from the current transcription
  const generateSummary = async () => {
    if (!transcription || transcription.trim() === '') {
      setError('No transcription available to summarize');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      const result = await SummaryService.generateSummary(transcription);
      
      if (result.success) {
        setSummary(result.summary);
        setEditedSummary(result.summary);
      } else {
        setError(result.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError('An error occurred while generating the summary');
      console.error('Summary generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Format the summary as markdown
  const getMarkdownSummary = () => {
    return SummaryService.formatAsMarkdown({
      success: true,
      summary: isEditing ? editedSummary : summary
    });
  };

  // Export the summary as PDF
  const exportAsPdf = async () => {
    try {
      return await SummaryService.exportAsPdf({
        success: true,
        summary: isEditing ? editedSummary : summary
      });
    } catch (err) {
      setError('Failed to export as PDF');
      console.error('PDF export error:', err);
      return { success: false, error: 'Failed to export as PDF' };
    }
  };

  // Start editing the summary
  const startEditing = () => {
    setIsEditing(true);
    setEditedSummary(summary);
  };

  // Save the edited summary
  const saveEdits = () => {
    setSummary(editedSummary);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedSummary(summary);
  };

  // Update a specific field in the edited summary
  const updateSummaryField = (field, value) => {
    if (!isEditing) return;
    
    setEditedSummary(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update a specific item in an array field (like keyPoints, actionItems, etc.)
  const updateArrayItem = (field, index, value) => {
    if (!isEditing || !editedSummary[field]) return;
    
    const updatedArray = [...editedSummary[field]];
    updatedArray[index] = value;
    
    setEditedSummary(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  // Add a new item to an array field
  const addArrayItem = (field, value = '') => {
    if (!isEditing || !editedSummary[field]) return;
    
    setEditedSummary(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  // Remove an item from an array field
  const removeArrayItem = (field, index) => {
    if (!isEditing || !editedSummary[field]) return;
    
    const updatedArray = [...editedSummary[field]];
    updatedArray.splice(index, 1);
    
    setEditedSummary(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const value = {
    summary,
    isGenerating,
    error,
    isEditing,
    editedSummary,
    generateSummary,
    getMarkdownSummary,
    exportAsPdf,
    startEditing,
    saveEdits,
    cancelEditing,
    updateSummaryField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem
  };

  return (
    <SummaryContext.Provider value={value}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  return context;
};

export default SummaryContext;
