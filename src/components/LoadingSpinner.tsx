import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando datos...', 
  size = 60 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress 
        size={size} 
        sx={{
          color: '#1976d2',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {message}
      </Typography>
    </Box>
  );
};