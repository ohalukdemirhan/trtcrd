import React, { useState } from 'react';
import { Typography, Paper, Box, Alert, LinearProgress } from '@mui/material';
import FileUploader from '../components/FileUploader';
import { apiService } from '../services/api';

const Compliance: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setResult(null);
    setError(null);
    if (!file.name.endsWith('.txt')) {
      setError('Only .txt files are supported for compliance check.');
      setUploading(false);
      return;
    }
    try {
      // Read file as text
      const text = await file.text();
      setProgress(30);
      // Send to API
      const response = await apiService.post('/compliance/check', {
        text,
        template_id: 1 // Hardcoded for MVP
      });
      setProgress(100);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Compliance check failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        GDPR Compliance Check
      </Typography>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload your .txt document
        </Typography>
        <FileUploader onFileSelect={handleFileSelect} />
        {uploading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      {result && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Compliance Result
          </Typography>
          <Alert severity={result.is_compliant ? 'success' : 'error'}>
            {result.is_compliant ? 'Compliance Passed' : 'Compliance Failed'}
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default Compliance; 