import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <AlertCircle
                size={64}
                color="hsl(14, 85%, 55%)"
                style={{ margin: '0 auto', display: 'block' }}
              />
              <Typography variant="h5" sx={{ mt: 3, fontWeight: 700, color: 'primary.main' }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
                We're sorry for the inconvenience. Please try refreshing the page.
              </Typography>
              {this.state.error && import.meta.env.NODE_ENV === 'development' && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 3,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    textAlign: 'left',
                  }}
                >
                  {this.state.error.message}
                </Typography>
              )}
              <Button
                variant="contained"
                size="large"
                onClick={this.handleReset}
                sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              >
                Back to Home
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
