import React, { Component, type ReactNode } from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || undefined
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          p={3}
          bgcolor="#f5f5f5"
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              textAlign: 'center',
              borderRadius: 3
            }}
          >
            <ErrorOutline 
              sx={{ 
                fontSize: 60, 
                color: 'error.main', 
                mb: 2 
              }} 
            />
            
            <Typography variant="h4" gutterBottom color="error">
              ¡Oops! Algo salió mal
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Ha ocurrido un error inesperado en la aplicación. 
              Por favor, intenta actualizar la página.
            </Typography>

            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                {this.state.error?.message}
              </Typography>
            </Alert>

            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                size="large"
              >
                Actualizar Página
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => this.setState({ hasError: false })}
                size="large"
              >
                Intentar Nuevamente
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Box mt={3} textAlign="left">
                <Typography variant="h6" gutterBottom>
                  Información de Debug:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100', maxHeight: 200, overflow: 'auto' }}>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                    {this.state.errorInfo}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}