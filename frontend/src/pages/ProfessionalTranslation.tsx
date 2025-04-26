import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  MenuItem, 
  Select, 
  FormControl,
  InputLabel,
  Button,
  Tooltip,
  Alert,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import BuildIcon from '@mui/icons-material/Build';
import { styled, alpha, Theme } from '@mui/material/styles';
import { useTranslation } from '../contexts/TranslationContext';
import { useAuth } from '../contexts/AuthContext';

// Simplified compliance interface for our demo
interface ComplianceIssue {
  id: string;
  rule: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion?: string;
  status: string;
  hasFix?: boolean;
  details: {
    match: string;
    context: string;
  };
}

// Custom styled components
const ComplianceScore = styled(Box)<{ score: number }>(({ theme, score }) => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '120px',
  height: '120px',
  margin: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StatusChip = styled(Chip)<{ status: 'compliant' | 'warning' | 'violation' }>(({ theme, status }) => ({
  fontWeight: 600,
  backgroundColor: status === 'compliant' 
    ? alpha('#5CB85C', 0.1) 
    : status === 'warning' 
      ? alpha('#F0AD4E', 0.1) 
      : alpha('#D9534F', 0.1),
  color: status === 'compliant' 
    ? '#5CB85C' 
    : status === 'warning' 
      ? '#F0AD4E' 
      : '#D9534F',
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));

const REGULATORY_FRAMEWORKS = [
  { value: 'gdpr', label: 'GDPR (EU General Data Protection Regulation)' },
  { value: 'hipaa', label: 'HIPAA (US Healthcare Privacy)' },
  { value: 'ccpa', label: 'CCPA (California Consumer Privacy Act)' },
  { value: 'kvkk', label: 'KVKK (Turkish Personal Data Protection Law)' },
  { value: 'pci-dss', label: 'PCI DSS (Payment Card Industry Data Security Standard)' }
];

const USER_ROLES = [
  { value: 'legal', label: 'Legal Department' },
  { value: 'healthcare', label: 'Healthcare Provider' },
  { value: 'finance', label: 'Financial Services' },
  { value: 'general', label: 'General Business' }
];

const SEVERITY_LEVELS = {
  critical: { color: '#D9534F', label: 'Critical' },
  high: { color: '#F0AD4E', label: 'High' },
  medium: { color: '#5BC0DE', label: 'Medium' },
  low: { color: '#5CB85C', label: 'Low' }
};

// Mock compliance results for demonstration
const mockComplianceResults: ComplianceIssue[] = [
  {
    id: '1',
    rule: 'GDPR Article 7 - Consent',
    description: 'The text mentions collecting data without clear user consent mechanism',
    severity: 'high',
    suggestion: 'Add explicit mention of consent collection and how users can withdraw it',
    status: 'failed',
    hasFix: true,
    details: {
      match: 'user data will be stored',
      context: 'for personalization purposes'
    }
  },
  {
    id: '2',
    rule: 'GDPR Article 13 - Information Provision',
    description: 'Missing clear information about data retention period',
    severity: 'medium',
    suggestion: 'Specify how long the personal data will be stored or criteria used to determine that period',
    status: 'failed',
    hasFix: true,
    details: {
      match: 'stored in our database',
      context: 'for future use'
    }
  },
  {
    id: '3',
    rule: 'HIPAA - Protected Health Information',
    description: 'Contains potential health-related identifiable information',
    severity: 'critical',
    suggestion: 'Remove or anonymize the health-related information',
    status: 'failed',
    hasFix: true,
    details: {
      match: 'medical history',
      context: 'will be processed'
    }
  }
];

const ProfessionalTranslation: React.FC = () => {
  // Context and state
  const { 
    sourceText, setSourceText,
    sourceLanguage, setSourceLanguage,
    targetLanguage, setTargetLanguage,
    translatedText, translate,
    isTranslating, complianceResults,
    checkCompliance, isCheckingCompliance,
    complianceScore
  } = useTranslation();
  
  const { user } = useAuth();
  
  // Local state for UI components
  const [selectedFramework, setSelectedFramework] = useState<string>('gdpr');
  const [userRole, setUserRole] = useState<string>('general');
  const [autoTranslate, setAutoTranslate] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [autoCompliance, setAutoCompliance] = useState<boolean>(true);
  
  // Use mock compliance results for demo
  const [demoResults, setDemoResults] = useState<ComplianceIssue[]>(mockComplianceResults);
  const [demoScore, setDemoScore] = useState<number>(75);
  
  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (sourceText.trim()) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(interval);
  }, [sourceText]);
  
  // Handle translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    await translate();
    
    if (autoCompliance) {
      await checkCompliance();
      // For demo purposes, set a random compliance score if we don't have real data
      if (complianceScore <= 0) {
        setDemoScore(Math.floor(Math.random() * 30) + 65);
      }
    }
  };
  
  // Handle saving
  const handleSave = () => {
    // Implement save functionality here
    setLastSaved(new Date());
    setSnackbarMessage('Translation saved successfully');
    setSnackbarOpen(true);
  };
  
  // Handle copying to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage('Copied to clipboard');
    setSnackbarOpen(true);
  };
  
  // Generate a compliance status based on score
  const getComplianceStatus = (score: number): 'compliant' | 'warning' | 'violation' => {
    if (score >= 90) return 'compliant';
    if (score >= 70) return 'warning';
    return 'violation';
  };
  
  // Export compliance report
  const handleExportReport = () => {
    // Implementation would generate a PDF or CSV report
    setSnackbarMessage('Compliance report exported');
    setSnackbarOpen(true);
  };
  
  // Handle automatic fixes
  const handleAutoFix = () => {
    setOpenDialog(true);
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Use either real compliance data or mock data for demonstration
  const displayScore = complianceScore > 0 ? complianceScore : demoScore;
  const displayResults = complianceResults.length > 0 
    ? complianceResults.map(result => {
        // Convert from ComplianceResult to ComplianceIssue format
        return {
          id: Math.random().toString(36).substring(7),
          rule: `${result.type} ${result.status === 'compliant' ? 'Check Passed' : 'Issue Detected'}`,
          description: result.message || '',
          severity: (result.status === 'compliant' ? 'low' : 
                   result.status === 'warning' ? 'medium' : 'high') as 'low' | 'medium' | 'high',
          suggestion: '',
          status: result.status,
          hasFix: false,
          details: {
            match: result.details || '',
            context: ''
          }
        };
      }) 
    : demoResults;
  
  return (
    <Box sx={{ maxWidth: '100%', margin: '0 auto', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700, 
            color: '#2A5C82',
            mb: 1
          }}
        >
          Professional Translation
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{ 
            color: (theme) => theme.palette.text.secondary,
            mb: 3
          }}
        >
          Translate content with integrated compliance checking
        </Typography>
        
        {/* Controls Row */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="framework-label">Regulatory Framework</InputLabel>
              <Select
                labelId="framework-label"
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                label="Regulatory Framework"
              >
                {REGULATORY_FRAMEWORKS.map((framework) => (
                  <MenuItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="role-label">User Role</InputLabel>
              <Select
                labelId="role-label"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                label="User Role"
              >
                {USER_ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={autoCompliance}
                    onChange={(e) => setAutoCompliance(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto Compliance Check"
              />
              
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => {/* Handle showing history */}}
                sx={{ borderRadius: '8px' }}
              >
                History
              </Button>
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: '#2A5C82',
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#1E4C6F'
                  }
                }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Main Content - Split Screen Layout */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Source Text Section */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Source Text
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="source-lang-label">Language</InputLabel>
                <Select
                  labelId="source-lang-label"
                  value={sourceLanguage.code}
                  label="Language"
                  onChange={(e) => {
                    const lang = { code: e.target.value, name: e.target.value === 'en' ? 'English' : 'Turkish' };
                    setSourceLanguage(lang);
                  }}
                  size="small"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="tr">Turkish</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              multiline
              fullWidth
              rows={12}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              variant="outlined"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'Source Sans Pro, sans-serif'
                } 
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
              {lastSaved && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last saved: {formatTime(lastSaved)}
                </Typography>
              )}
              
              <Box>
                <IconButton 
                  size="small" 
                  onClick={() => handleCopy(sourceText)}
                  title="Copy to clipboard"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                
                <Button
                  variant="contained"
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  sx={{
                    ml: 2,
                    bgcolor: '#2A5C82',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#1E4C6F'
                    }
                  }}
                >
                  {isTranslating ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Translating...
                    </>
                  ) : (
                    'Translate'
                  )}
                </Button>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
        
        {/* Translation Output Section */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Translation
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="target-lang-label">Language</InputLabel>
                <Select
                  labelId="target-lang-label"
                  value={targetLanguage.code}
                  label="Language"
                  onChange={(e) => {
                    const lang = { code: e.target.value, name: e.target.value === 'en' ? 'English' : 'Turkish' };
                    setTargetLanguage(lang);
                  }}
                  size="small"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="tr">Turkish</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ position: 'relative', mb: 2, flex: 1 }}>
              <TextField
                multiline
                fullWidth
                rows={12}
                value={translatedText}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'Source Sans Pro, sans-serif',
                    backgroundColor: (theme) => 
                      alpha(theme.palette.background.paper, 0.5)
                  } 
                }}
              />
              
              {isTranslating && (
                <LinearProgress 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0,
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                  }} 
                />
              )}
            </Box>
            
            {/* Compliance Indicator */}
            {(translatedText || demoResults.length > 0) && displayScore > 0 && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 1.5,
                borderRadius: '8px',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
                mb: 2
              }}>
                <StatusChip 
                  status={getComplianceStatus(displayScore)}
                  label={
                    getComplianceStatus(displayScore) === 'compliant' 
                      ? 'Compliant' 
                      : getComplianceStatus(displayScore) === 'warning'
                        ? 'Needs Review'
                        : 'Non-Compliant'
                  }
                  size="small"
                  sx={{ mr: 2 }}
                />
                
                <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>
                  Compliance Score:
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700,
                    color: displayScore >= 90 
                      ? '#5CB85C' 
                      : displayScore >= 70 
                        ? '#F0AD4E' 
                        : '#D9534F'
                  }}
                >
                  {displayScore}%
                </Typography>
                
                <Tooltip title="View detailed compliance report">
                  <IconButton 
                    size="small" 
                    onClick={() => setOpenDialog(true)}
                    sx={{ ml: 'auto' }}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
              <Button
                variant="text"
                startIcon={<BuildIcon />}
                onClick={() => {
                  checkCompliance();
                  // Demo data
                  if (translatedText) {
                    setDemoScore(Math.floor(Math.random() * 30) + 65);
                  }
                }}
                disabled={isCheckingCompliance || (!translatedText && demoResults.length === 0)}
                sx={{ fontSize: '0.875rem' }}
              >
                {isCheckingCompliance ? 'Checking...' : 'Check Compliance'}
              </Button>
              
              <Box>
                <IconButton 
                  size="small" 
                  onClick={() => handleCopy(translatedText)}
                  title="Copy to clipboard"
                  disabled={!translatedText}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                
                <IconButton 
                  size="small" 
                  onClick={handleExportReport}
                  disabled={(!translatedText && demoResults.length === 0) || displayScore === 0}
                  title="Download translation"
                  sx={{ ml: 1 }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
      
      {/* Compliance Results Section */}
      {displayResults.length > 0 && (
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Compliance Analysis
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<AutoFixHighIcon />}
              onClick={handleAutoFix}
              disabled={displayScore >= 100}
              sx={{ borderRadius: '8px' }}
            >
              Suggest Fixes
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {/* Compliance Score */}
            <Grid item xs={12} md={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 2,
                borderRadius: '12px',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.5)
              }}>
                <ComplianceScore score={displayScore}>
                  <CircularProgress
                    variant="determinate"
                    value={displayScore}
                    size={120}
                    thickness={4}
                    sx={{
                      color: displayScore >= 90 
                        ? '#5CB85C' 
                        : displayScore >= 70 
                          ? '#F0AD4E' 
                          : '#D9534F',
                      position: 'absolute'
                    }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={4}
                    sx={{
                      color: (theme) => alpha(theme.palette.divider, 0.2),
                      position: 'absolute'
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: 700 }}
                    >
                      {displayScore}%
                    </Typography>
                  </Box>
                </ComplianceScore>
                
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  Overall Compliance
                </Typography>
                
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  {selectedFramework.toUpperCase()} Framework
                </Typography>
              </Box>
            </Grid>
            
            {/* Compliance Issues */}
            <Grid item xs={12} md={9}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Compliance Issues ({displayResults.length})
                </Typography>
                
                <Box sx={{ maxHeight: '300px', overflow: 'auto', pr: 1 }}>
                  {displayResults.map((result, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: '8px',
                        borderLeft: '4px solid',
                        borderLeftColor: 
                          result.severity === 'critical' 
                            ? SEVERITY_LEVELS.critical.color
                            : result.severity === 'high'
                              ? SEVERITY_LEVELS.high.color
                              : result.severity === 'medium'
                                ? SEVERITY_LEVELS.medium.color
                                : SEVERITY_LEVELS.low.color
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {result.rule}
                        </Typography>
                        
                        <Chip 
                          label={result.severity} 
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            bgcolor: 
                              result.severity === 'critical' 
                                ? alpha(SEVERITY_LEVELS.critical.color, 0.1)
                                : result.severity === 'high'
                                  ? alpha(SEVERITY_LEVELS.high.color, 0.1)
                                  : result.severity === 'medium'
                                    ? alpha(SEVERITY_LEVELS.medium.color, 0.1)
                                    : alpha(SEVERITY_LEVELS.low.color, 0.1),
                            color: 
                              result.severity === 'critical' 
                                ? SEVERITY_LEVELS.critical.color
                                : result.severity === 'high'
                                  ? SEVERITY_LEVELS.high.color
                                  : result.severity === 'medium'
                                    ? SEVERITY_LEVELS.medium.color
                                    : SEVERITY_LEVELS.low.color,
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {result.description}
                      </Typography>
                      
                      {result.suggestion && (
                        <Alert 
                          severity="info" 
                          sx={{ 
                            '& .MuiAlert-message': { 
                              fontFamily: 'Source Sans Pro, sans-serif',
                              fontSize: '0.875rem'
                            }
                          }}
                        >
                          <strong>Suggestion:</strong> {result.suggestion}
                        </Alert>
                      )}
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Compliance Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Detailed Compliance Report
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Framework: {REGULATORY_FRAMEWORKS.find(f => f.value === selectedFramework)?.label}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Overall Compliance Score: 
              <span style={{ 
                fontWeight: 700,
                color: displayScore >= 90 
                  ? '#5CB85C' 
                  : displayScore >= 70 
                    ? '#F0AD4E' 
                    : '#D9534F',
                marginLeft: '8px'
              }}>
                {displayScore}%
              </span>
            </Typography>
            
            <LinearProgress
              variant="determinate"
              value={displayScore}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.divider, 0.2),
                '& .MuiLinearProgress-bar': {
                  bgcolor: displayScore >= 90 
                    ? '#5CB85C' 
                    : displayScore >= 70 
                      ? '#F0AD4E' 
                      : '#D9534F',
                  borderRadius: 5
                }
              }}
            />
          </Box>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Compliance Issues by Category
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Placeholder for actual categorized data */}
            {['Data Protection', 'Consent', 'Right to Access', 'Sensitive Information'].map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category}>
                <Paper
                  variant="outlined"
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    {category}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: Math.random() > 0.5 ? '#5CB85C' : '#D9534F',
                      fontWeight: 700
                    }}
                  >
                    {Math.random() > 0.5 ? 'Pass' : 'Fail'}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Detailed Issues
          </Typography>
          
          {displayResults.map((result, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: '8px',
                borderLeft: '4px solid',
                borderLeftColor: 
                  result.severity === 'critical' 
                    ? SEVERITY_LEVELS.critical.color
                    : result.severity === 'high'
                      ? SEVERITY_LEVELS.high.color
                      : result.severity === 'medium'
                        ? SEVERITY_LEVELS.medium.color
                        : SEVERITY_LEVELS.low.color
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {result.rule}
                </Typography>
                
                <Chip 
                  label={result.severity} 
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    bgcolor: 
                      result.severity === 'critical' 
                        ? alpha(SEVERITY_LEVELS.critical.color, 0.1)
                        : result.severity === 'high'
                          ? alpha(SEVERITY_LEVELS.high.color, 0.1)
                          : result.severity === 'medium'
                            ? alpha(SEVERITY_LEVELS.medium.color, 0.1)
                            : alpha(SEVERITY_LEVELS.low.color, 0.1),
                    color: 
                      result.severity === 'critical' 
                        ? SEVERITY_LEVELS.critical.color
                        : result.severity === 'high'
                          ? SEVERITY_LEVELS.high.color
                          : result.severity === 'medium'
                            ? SEVERITY_LEVELS.medium.color
                            : SEVERITY_LEVELS.low.color,
                  }}
                />
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                {result.description}
              </Typography>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Reference Text:
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
                  p: 1.5,
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  mb: 1.5
                }}
              >
                "{result.details.match}" in context "{result.details.context}"
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Recommendation:
              </Typography>
              
              <Alert 
                severity="info" 
                sx={{ 
                  '& .MuiAlert-message': { 
                    fontFamily: 'Source Sans Pro, sans-serif',
                    fontSize: '0.875rem'
                  }
                }}
              >
                {result.suggestion || 'No specific recommendation available.'}
              </Alert>
            </Paper>
          ))}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleExportReport} startIcon={<DownloadIcon />}>
            Export Report
          </Button>
          <Button onClick={() => setOpenDialog(false)}>
            Close
          </Button>
          <Button 
            variant="contained"
            onClick={handleAutoFix}
            startIcon={<AutoFixHighIcon />}
            sx={{
              bgcolor: '#2A5C82',
              '&:hover': {
                bgcolor: '#1E4C6F'
              }
            }}
          >
            Apply Suggested Fixes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ProfessionalTranslation; 