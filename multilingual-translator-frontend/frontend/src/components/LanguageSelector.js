import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ type }) => {
  const { 
    sourceLanguage, 
    setSourceLanguage, 
    targetLanguage, 
    setTargetLanguage,
    interfaceLanguage,
    setInterfaceLanguage,
    supportedLanguages,
    allSourceLanguages,
    detectedLanguage
  } = useLanguage();

  const handleChange = (event) => {
    const selectedCode = event.target.value;
    
    if (type === 'source') {
      if (selectedCode === 'auto') {
        setSourceLanguage({ code: 'auto', name: 'Auto Detect' });
      } else {
        const selectedLanguage = supportedLanguages.find(lang => lang.code === selectedCode);
        setSourceLanguage(selectedLanguage);
      }
    } else if (type === 'target') {
      const selectedLanguage = supportedLanguages.find(lang => lang.code === selectedCode);
      setTargetLanguage(selectedLanguage);
    } else if (type === 'interface') {
      const selectedLanguage = supportedLanguages.find(lang => lang.code === selectedCode);
      setInterfaceLanguage(selectedLanguage);
    }
  };

  const getCurrentValue = () => {
    if (type === 'source') return sourceLanguage.code;
    if (type === 'target') return targetLanguage.code;
    if (type === 'interface') return interfaceLanguage.code;
    return '';
  };

  const getLabel = () => {
    if (type === 'source') {
      if (sourceLanguage.code === 'auto' && detectedLanguage) {
        const detected = supportedLanguages.find(lang => lang.code === detectedLanguage);
        return `Source Language (Detected: ${detected ? detected.name : 'Unknown'})`;
      }
      return 'Source Language';
    }
    if (type === 'target') {
      if (sourceLanguage.code === 'auto' && detectedLanguage) {
        // Show auto-selection info for target language too
        if (detectedLanguage === 'zh') {
          return 'Target Language (Auto: English)';
        } else {
          return 'Target Language (Auto: Chinese)';
        }
      }
      return 'Target Language';
    }
    if (type === 'interface') return 'Interface Language';
    return '';
  };

  // For target language, show a message about auto-selection but keep the dropdown
  const showAutoMessage = type === 'target' && sourceLanguage.code === 'auto';
  
  return (
    <Box sx={{ minWidth: 120, m: 1 }}>
      {showAutoMessage && (
        <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
          Target language is automatically selected based on detected source language, but you can manually override it below.
        </Typography>
      )}
      <FormControl fullWidth>
        <InputLabel id={`${type}-language-label`}>{getLabel()}</InputLabel>
        <Select
          labelId={`${type}-language-label`}
          id={`${type}-language-select`}
          value={getCurrentValue()}
          label={getLabel()}
          onChange={handleChange}
        >
          {type === 'source' ? 
            allSourceLanguages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {language.name}
              </MenuItem>
            ))
            :
            supportedLanguages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {language.name}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
