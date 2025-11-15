import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Shield as ShieldIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  VpnKey as VpnKeyIcon,
  GetApp as ExportIcon,
  Settings as SettingsIcon,
  Sync as SyncIcon,
  TrendingUp,
  TrendingDown,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AdminDashboardProps {
  onNotify: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  action?: () => void;
}

interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  user?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNotify }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState<StatCardData[]>([
    {
      title: 'Total Users',
      value: 24,
      icon: <PeopleIcon />,
      color: '#1976d2',
      trend: { value: 12, direction: 'up' },
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Active Roles',
      value: 3,
      icon: <ShieldIcon />,
      color: '#2e7d32',
      action: () => navigate('/admin/roles'),
    },
    {
      title: 'Actions Today',
      value: 156,
      icon: <HistoryIcon />,
      color: '#ed6c02',
      trend: { value: 23, direction: 'up' },
      action: () => navigate('/admin/audit'),
    },
    {
      title: 'System Issues',
      value: 2,
      icon: <WarningIcon />,
      color: '#d32f2f',
      trend: { value: 1, direction: 'down' },
      action: () => navigate('/admin/system'),
    },
    {
      title: 'System Health',
      value: '98%',
      icon: <CheckCircleIcon />,
      color: '#388e3c',
      action: () => navigate('/admin/system'),
    },
  ]);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'success',
      message: 'John Doe updated role permissions',
      timestamp: '2 minutes ago',
      user: 'John Doe',
    },
    {
      id: '2',
      type: 'info',
      message: 'New API key generated for Guilford office',
      timestamp: '15 minutes ago',
      user: 'Admin',
    },
    {
      id: '3',
      type: 'success',
      message: 'User login: admin@poweria.com',
      timestamp: '1 hour ago',
      user: 'Admin',
    },
    {
      id: '4',
      type: 'warning',
      message: 'Failed login attempt detected',
      timestamp: '2 hours ago',
    },
    {
      id: '5',
      type: 'success',
      message: 'System settings updated successfully',
      timestamp: '3 hours ago',
      user: 'Admin',
    },
  ]);

  const quickActions = [
    {
      label: 'Create User',
      icon: <PersonAddIcon />,
      color: '#1976d2',
      action: () => {
        navigate('/admin/users');
        onNotify('Navigating to user management', 'info');
      },
    },
    {
      label: 'Generate API Key',
      icon: <VpnKeyIcon />,
      color: '#2e7d32',
      action: () => {
        navigate('/admin/config');
        onNotify('Navigating to API configuration', 'info');
      },
    },
    {
      label: 'Export Logs',
      icon: <ExportIcon />,
      color: '#ed6c02',
      action: () => {
        onNotify('Exporting audit logs...', 'info');
        // Implement export logic
      },
    },
    {
      label: 'System Settings',
      icon: <SettingsIcon />,
      color: '#9c27b0',
      action: () => {
        navigate('/admin/config');
      },
    },
    {
      label: 'Sync Data',
      icon: <SyncIcon />,
      color: '#0288d1',
      action: () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          onNotify('Data synchronized successfully', 'success');
        }, 2000);
      },
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
      onNotify('Dashboard refreshed', 'success');
    }, 1500);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'error':
        return <WarningIcon sx={{ color: 'error.main' }} />;
      default:
        return <HistoryIcon sx={{ color: 'info.main' }} />;
    }
  };

  return (
    <Box>
      {/* Header with refresh button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600">
          Overview
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                cursor: stat.action ? 'pointer' : 'default',
                '&:hover': stat.action
                  ? {
                      borderColor: stat.color,
                      boxShadow: `0 4px 12px ${stat.color}20`,
                      transform: 'translateY(-4px)',
                    }
                  : {},
              }}
              onClick={stat.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}15`,
                      color: stat.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  {stat.trend && (
                    <Chip
                      size="small"
                      icon={stat.trend.direction === 'up' ? <TrendingUp /> : <TrendingDown />}
                      label={`${stat.trend.value}%`}
                      color={stat.trend.direction === 'up' ? 'success' : 'error'}
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
                <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions and Recent Activity */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List sx={{ pt: 0 }}>
                {quickActions.map((action, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateX(4px)',
                      },
                    }}
                    onClick={action.action}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: `${action.color}15`,
                          color: action.color,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {action.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={action.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                    />
                    <ArrowForward sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Recent Activity
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/admin/audit')}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ pt: 0 }}>
                {recentActivity.map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>{getActivityIcon(activity.type)}</ListItemIcon>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.timestamp}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        fontSize: 12,
                      }}
                    />
                    {activity.user && (
                      <Chip
                        size="small"
                        label={activity.user}
                        variant="outlined"
                        sx={{ fontSize: 11 }}
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
