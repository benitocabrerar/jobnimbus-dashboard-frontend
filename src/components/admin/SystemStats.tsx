import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  Cloud as CloudIcon,
  Database as DatabaseIcon,
  Api as ApiIcon,
} from '@mui/icons-material';

interface SystemStatsProps {
  onNotify: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastCheck: string;
}

interface ResourceMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: 'ok' | 'warning' | 'critical';
  icon: React.ReactNode;
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  lastUpdate: string;
  responseTime?: number;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ onNotify }) => {
  const [loading, setLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 99.98,
    lastCheck: new Date().toLocaleString(),
  });

  const [resources, setResources] = useState<ResourceMetric[]>([
    {
      name: 'CPU Usage',
      value: 45,
      max: 100,
      unit: '%',
      status: 'ok',
      icon: <SpeedIcon />,
    },
    {
      name: 'Memory Usage',
      value: 6.4,
      max: 16,
      unit: 'GB',
      status: 'ok',
      icon: <MemoryIcon />,
    },
    {
      name: 'Storage Usage',
      value: 234,
      max: 500,
      unit: 'GB',
      status: 'ok',
      icon: <StorageIcon />,
    },
    {
      name: 'Database Size',
      value: 12.5,
      max: 50,
      unit: 'GB',
      status: 'ok',
      icon: <DatabaseIcon />,
    },
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Web Server',
      status: 'running',
      lastUpdate: '2 minutes ago',
      responseTime: 45,
    },
    {
      name: 'Database Server',
      status: 'running',
      lastUpdate: '1 minute ago',
      responseTime: 12,
    },
    {
      name: 'API Gateway',
      status: 'running',
      lastUpdate: '30 seconds ago',
      responseTime: 23,
    },
    {
      name: 'Background Jobs',
      status: 'running',
      lastUpdate: '5 minutes ago',
    },
  ]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setSystemHealth({
        ...systemHealth,
        lastCheck: new Date().toLocaleString(),
      });
      setLoading(false);
      onNotify('System stats refreshed', 'success');
    }, 1500);
  };

  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getServiceIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'running':
        return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'stopped':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <CheckIcon />;
    }
  };

  const getResourceColor = (percentage: number) => {
    if (percentage < 60) return 'success';
    if (percentage < 80) return 'warning';
    return 'error';
  };

  const calculatePercentage = (value: number, max: number) => {
    return (value / max) * 100;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="600">
          System Health & Monitoring
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* System Health Overview */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          mb: 3,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              System Status
            </Typography>
            <Chip
              label={systemHealth.status.toUpperCase()}
              color={getStatusColor(systemHealth.status)}
              icon={<CheckIcon />}
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  System Uptime
                </Typography>
                <Typography variant="h4" fontWeight="700" color="success.main">
                  {systemHealth.uptime}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last Health Check
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {systemHealth.lastCheck}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Active Services
                </Typography>
                <Typography variant="h4" fontWeight="700" color="primary.main">
                  {services.filter(s => s.status === 'running').length}/{services.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Resource Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {resources.map((resource, index) => {
          const percentage = calculatePercentage(resource.value, resource.max);
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box
                      sx={{
                        bgcolor: `${getResourceColor(percentage) === 'success' ? '#4caf50' : getResourceColor(percentage) === 'warning' ? '#ff9800' : '#f44336'}15`,
                        color: getResourceColor(percentage) === 'success' ? '#4caf50' : getResourceColor(percentage) === 'warning' ? '#ff9800' : '#f44336',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                      }}
                    >
                      {resource.icon}
                    </Box>
                    <Typography variant="body2" fontWeight="600">
                      {resource.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="h5" fontWeight="700">
                        {resource.value}{resource.unit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        / {resource.max}{resource.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      color={getResourceColor(percentage)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {percentage.toFixed(1)}% utilized
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Services Status */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Service Status
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List dense>
                {services.map((service, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemIcon>{getServiceIcon(service.status)}</ListItemIcon>
                    <ListItemText
                      primary={service.name}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {service.lastUpdate}
                          </Typography>
                          {service.responseTime && (
                            <Chip
                              label={`${service.responseTime}ms`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 18, fontSize: 10 }}
                            />
                          )}
                        </Box>
                      }
                    />
                    <Chip
                      label={service.status}
                      size="small"
                      color={service.status === 'running' ? 'success' : 'default'}
                      sx={{ fontWeight: 600, minWidth: 70 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                System Alerts
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="info">
                  System is running smoothly. All services are operational.
                </Alert>
                <Alert severity="success">
                  Scheduled maintenance completed successfully at 2:00 AM.
                </Alert>
                <Alert severity="warning">
                  Database size is approaching 25% capacity. Consider cleanup.
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemStats;
