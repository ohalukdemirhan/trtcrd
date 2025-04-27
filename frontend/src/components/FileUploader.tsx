import React, { useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleBoxClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      sx={{ border: '2px dashed #6366f1', p: 4, textAlign: 'center', cursor: 'pointer' }}
      onClick={handleBoxClick}
    >
      <Typography variant="body1" color="text.secondary">
        Drag & drop a file here, or click to select
      </Typography>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleBoxClick}>
        Select File
      </Button>
    </Box>
  );
};

export default FileUploader; 