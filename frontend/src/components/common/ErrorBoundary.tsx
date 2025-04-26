import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Paper, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors in child component trees.
 * It displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100%',
            p: 4
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              maxWidth: '600px', 
              width: '100%', 
              textAlign: 'center',
              borderTop: 5,
              borderColor: 'error.main'
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            
            <Typography variant="h5" component="h2" gutterBottom>
              Something Went Wrong
            </Typography>
            
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Alert>
            
            {this.state.errorInfo && (
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Error Details:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ 
                    p: 2, 
                    maxHeight: '150px', 
                    overflow: 'auto',
                    bgcolor: 'grey.100',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </Paper>
              </Box>
            )}
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleReload}
              sx={{ mt: 2 }}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 