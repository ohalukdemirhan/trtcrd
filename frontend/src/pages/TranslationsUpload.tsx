import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Alert, LinearProgress, Chip } from '@mui/material';
import FileUploader from '../components/FileUploader';
import { apiService } from '../services/api';

const TranslationsUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'pending' | 'completed' | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setStatus(null);
    setResult(null);
    setError(null);
    if (!file.name.endsWith('.txt')) {
      setError('Only .txt files are supported for translation.');
      setUploading(false);
      return;
    }
    try {
      // Read file as text
      const text = await file.text();
      setProgress(30);
      // Send to API
      setStatus('pending');
      const response = await apiService.post('/translations', {
        source_text: text,
        source_lang: 'en', // Hardcoded for MVP
        target_lang: 'tr', // Hardcoded for MVP
      });
      setProgress(100);
      setStatus('completed');
      setResult(response.data.translation);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Translation failed');
      setStatus(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Certified Document Translation
      </Typography>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload your .txt document for translation
        </Typography>
        <FileUploader onFileSelect={handleFileSelect} />
        {uploading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />}
        {status && (
          <Box sx={{ mt: 2 }}>
            <Chip label={status === 'pending' ? 'Pending' : 'Completed'} color={status === 'pending' ? 'warning' : 'success'} />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      {result && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Translation Result
          </Typography>
          <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.translated_text || 'No translation result.'}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default TranslationsUpload; 