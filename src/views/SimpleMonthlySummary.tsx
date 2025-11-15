import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';
import { TrendingUp, TrendingDown, AttachMoney, Assessment, WorkOutline, People } from '@mui/icons-material';
import axios from 'axios';

interface MonthlySummaryData {
  period: string;
  totalRevenue: number;
  totalJobs: number;
  completedJobs: number;
  averageMargin: number;
  topSalesRep: string;
  revenue_change: number;
  jobs_change: number;
}

const SimpleMonthlySummary: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MonthlySummaryData | null>(null);
  const [instance] = useState('guilford'); // Default instance

  useEffect(() => {
    fetchMonthlySummary();
  }, []);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mcp/monthly-summary`,
        {
          instance: instance,
          month: currentMonth
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-location': instance
          }
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch monthly summary');
      }
    } catch (err: any) {
      console.error('Error fetching monthly summary:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: number;
    prefix?: string;
    suffix?: string;
  }> = ({ title, value, icon, change, prefix = '', suffix = '' }) => (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
        </Box>

        <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </Typography>

        {change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {change >= 0 ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: 20, mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: 20, mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: change >= 0 ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {change >= 0 ? '+' : ''}{change}% vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
          <Typography variant="h5">Loading Monthly Summary...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>Error Loading Summary</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: { xs: 2, sm: 4, md: 6 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 800,
            mb: 1,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          Monthly Summary
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 400,
          }}
        >
          {data?.period || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ maxWidth: 1400, margin: '0 auto' }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Revenue"
            value={data?.totalRevenue || 0}
            prefix="$"
            icon={<AttachMoney />}
            change={data?.revenue_change}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Jobs"
            value={data?.totalJobs || 0}
            icon={<WorkOutline />}
            change={data?.jobs_change}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Completed Jobs"
            value={data?.completedJobs || 0}
            icon={<Assessment />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Average Margin"
            value={data?.averageMargin || 0}
            suffix="%"
            icon={<TrendingUp />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Top Sales Rep"
            value={data?.topSalesRep || 'N/A'}
            icon={<People />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Completion Rate"
            value={data?.totalJobs ? Math.round((data.completedJobs / data.totalJobs) * 100) : 0}
            suffix="%"
            icon={<Assessment />}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default SimpleMonthlySummary;
