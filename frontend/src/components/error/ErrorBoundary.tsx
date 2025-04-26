import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { env } from '../../config/env';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Log error to your error tracking service
        this.logError(error, errorInfo);
    }

    private logError = (error: Error, errorInfo: ErrorInfo) => {
        // TODO: Implement error logging service (e.g., Sentry)
        if (env.NODE_ENV !== 'development') {
            console.error('Error:', error);
            console.error('Error Info:', errorInfo);
        }
    };

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="md">
                    <Box
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 4,
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="h4" gutterBottom color="error">
                                Oops! Something went wrong
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                We apologize for the inconvenience. Please try reloading the page.
                            </Typography>
                            {env.NODE_ENV === 'development' && this.state.error && (
                                <Box sx={{ mt: 2, mb: 3, textAlign: 'left' }}>
                                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {this.state.error.toString()}
                                    </Typography>
                                    {this.state.errorInfo && (
                                        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {this.state.errorInfo.componentStack}
                                        </Typography>
                                    )}
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
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 