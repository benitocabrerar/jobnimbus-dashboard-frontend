import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

interface SkeletonLoaderProps {
  variant?: 'dashboard' | 'table' | 'chart' | 'cards';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  variant = 'dashboard', 
  count = 1 
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'dashboard':
        return (
          <Grid container spacing={3}>
            {/* KPI Cards */}
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="40%" height={16} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="40%" height={16} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="40%" height={16} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="40%" height={16} />
                </CardContent>
              </Card>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Card elevation={2}>
                <CardContent>
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton variant="rectangular" width="100%" height={300} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', my: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 'table':
        return (
          <Card elevation={2}>
            <CardContent>
              <Skeleton variant="text" width="30%" height={32} />
              <Box sx={{ mt: 2 }}>
                {Array.from({ length: count || 5 }).map((_, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={20} />
                      <Skeleton variant="text" width="60%" height={16} />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={32} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        );

      case 'chart':
        return (
          <Card elevation={2}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Skeleton variant="text" width="60%" height={16} />
              </Box>
            </CardContent>
          </Card>
        );

      case 'cards':
        return (
          <Grid container spacing={3}>
            {Array.from({ length: count || 4 }).map((_, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card elevation={2}>
                  <CardContent>
                    <Skeleton variant="text" width="70%" height={20} />
                    <Skeleton variant="text" width="90%" height={32} />
                    <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="50%" height={16} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      default:
        return <Skeleton variant="rectangular" width="100%" height={200} />;
    }
  };

  return (
    <Box>
      {renderSkeleton()}
    </Box>
  );
};

export default SkeletonLoader;