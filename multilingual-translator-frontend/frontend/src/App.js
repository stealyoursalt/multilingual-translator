import React from 'react';
import { Box, Container, CssBaseline, AppBar, Toolbar, Typography, Paper, Divider, Tabs, Tab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/LanguageSelector';
import AudioCapture from './components/AudioCapture';
import ZoomAudioCapture from './components/ZoomAudioCapture';
import { LanguageProvider } from './contexts/LanguageContext';
import { TranscriptionProvider } from './contexts/TranscriptionContext';
import { SocketProvider } from './contexts/SocketContext';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import RecordingStorage from './components/RecordingStorage';
import AudioRecorder from './components/AudioRecorder';
import RealTimeService from './services/RealTimeService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D4FD51',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <SocketProvider>
          <TranscriptionProvider>
            <RealTimeService>
              <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                  <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {t('app.title')}
                    </Typography>
                    <LanguageSelector type="interface" />
                  </Toolbar>
                </AppBar>
                
                <Container maxWidth="md" sx={{ mt: 4 }}>
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      {t('app.subtitle')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <LanguageSelector type="source" />
                      <LanguageSelector type="target" />
                    </Box>
                    
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                      <Tabs value={tabValue} onChange={handleTabChange} aria-label="audio capture tabs">
                        <Tab label={t('tabs.microphone')} id="tab-0" />
                        <Tab label={t('tabs.zoom')} id="tab-1" />
                      </Tabs>
                    </Box>
                    
                    <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0">
                      {tabValue === 0 && <AudioCapture />}
                    </Box>
                    
                    <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1">
                      {tabValue === 1 && <ZoomAudioCapture />}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <TranscriptionDisplay />
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <RecordingStorage />
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <AudioRecorder />
                  </Paper>
                </Container>
              </Box>
            </RealTimeService>
          </TranscriptionProvider>
        </SocketProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
