import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Thermostat as ThermostatIcon,
  FlashOn as FlashOnIcon,
  Computer as ComputerIcon,
  Tune as TuneIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { rtxCache, CacheTTL } from '../services/cacheService';

interface GPUMetrics {
  rtx5090_ultra_enabled: boolean;
  gpu_utilization: {
    gpu_utilization_percent: number;
    memory_used_mb: number;
    memory_total_mb: number;
    temperature_celsius: number;
    memory_utilization_percent: number;
  };
  mcp_gpu_status: {
    gpu_name: string;
    utilization_percent: number;
    memory_used_mb: number;
    memory_total_mb: number;
    memory_percent: number;
    temperature_celsius: number;
    power_draw_watts: number;
    cuda_available: boolean;
    cuda_device_count: number;
    current_device: number;
  };
  background_workload: string;
  streams_active: number;
  memory_pool: string;
  timestamp: string;
}

const RTX5090Dashboard: React.FC = () => {
  const [gpuMetrics, setGpuMetrics] = useState<GPUMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isCacheHit, setIsCacheHit] = useState(false);

  const fetchGPUMetrics = async (showLoading: boolean = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      // Use RTX Cache for GPU metrics with 10 second TTL
      let wasFromCache = true;
      const data = await rtxCache.get(
        'rtx5090:ultra-status',
        async () => {
          console.log('🔄 RTX CACHE MISS for rtx5090:ultra-status - fetching from API');
          wasFromCache = false;
          const response = await fetch('http://localhost:8000/rtx5090/ultra-status');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        },
        10000 // 10 second TTL for real-time GPU data
      );
      
      setIsCacheHit(wasFromCache);
      
      setGpuMetrics(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch GPU metrics:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const optimizeGPU = async () => {
    try {
      setOptimizing(true);
      const response = await fetch('http://localhost:8000/rtx5090/stress-test', { method: 'POST' });
      const result = await response.json();
      
      if (result.stress_test_status === 'COMPLETED') {
        // Invalidate cache and refresh metrics after stress test
        rtxCache.invalidate('rtx5090:ultra-status');
        setTimeout(() => fetchGPUMetrics(false), 1000);
      }
    } catch (error) {
      console.error('GPU optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    fetchGPUMetrics(true); // Show loading only on initial load
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => fetchGPUMetrics(false), 10000); // Background refresh every 10s without loading
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return '#4caf50';
    if (utilization > 50) return '#ff9800';
    return '#2196f3';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return '#4caf50';
      case 'optimized': return '#4caf50';
      case 'stable': return '#4caf50';
      default: return '#2196f3';
    }
  };

  if (!gpuMetrics || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Initializing RTX 5090...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 56, height: 56 }}>
            <ComputerIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              🚀 NVIDIA RTX 5090 Command Center
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {gpuMetrics.mcp_gpu_status.gpu_name} • {Math.round(gpuMetrics.mcp_gpu_status.memory_total_mb / 1024)}GB VRAM • AI Acceleration Active
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title={autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"}>
            <IconButton 
              onClick={() => setAutoRefresh(!autoRefresh)}
              color={autoRefresh ? "primary" : "default"}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="secondary"
            startIcon={optimizing ? <CircularProgress size={20} /> : <TuneIcon />}
            onClick={optimizeGPU}
            disabled={optimizing}
          >
            {optimizing ? 'Optimizing...' : 'Stress Test'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchGPUMetrics(true)}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* System Status Alert */}
      <AnimatePresence>
        {gpuMetrics.rtx5090_ultra_enabled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="success" 
              sx={{ mb: 3, fontWeight: 'bold' }}
              icon={<AIIcon />}
            >
              🚀 RTX 5090 ULTRA BOOST ACTIVE - {gpuMetrics.streams_active} CUDA Streams • Background Workload: {gpuMetrics.background_workload.toUpperCase()}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Grid container spacing={3}>
        {/* GPU Utilization */}
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SpeedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">GPU Utilization</Typography>
                </Box>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Current Usage</Typography>
                    <Chip 
                      label={`${gpuMetrics.gpu_utilization.gpu_utilization_percent}%`}
                      sx={{ 
                        bgcolor: getUtilizationColor(gpuMetrics.gpu_utilization.gpu_utilization_percent),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={gpuMetrics.gpu_utilization.gpu_utilization_percent}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: getUtilizationColor(gpuMetrics.gpu_utilization.gpu_utilization_percent)
                      }
                    }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  CUDA Available: {gpuMetrics.mcp_gpu_status.cuda_available ? '✅ Yes' : '❌ No'}
                  <br />
                  Active Streams: {gpuMetrics.streams_active}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Memory Usage */}
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <MemoryIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Memory Usage</Typography>
                </Box>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">VRAM Usage</Typography>
                    <Chip 
                      label={`${(gpuMetrics.mcp_gpu_status.memory_used_mb / 1024).toFixed(2)}GB / ${(gpuMetrics.mcp_gpu_status.memory_total_mb / 1024).toFixed(1)}GB`}
                      sx={{ 
                        bgcolor: getUtilizationColor(gpuMetrics.mcp_gpu_status.memory_percent),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={gpuMetrics.mcp_gpu_status.memory_percent}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: getUtilizationColor(gpuMetrics.mcp_gpu_status.memory_percent)
                      }
                    }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Memory Pool: {gpuMetrics.memory_pool.toUpperCase()}
                  <br />
                  Utilization: {gpuMetrics.mcp_gpu_status.memory_percent.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Temperature & Power */}
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ThermostatIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Thermal & Power</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="rgba(33, 150, 243, 0.1)" borderRadius={2}>
                      <ThermostatIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {gpuMetrics.mcp_gpu_status.temperature_celsius}°C
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Temperature</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="rgba(255, 152, 0, 0.1)" borderRadius={2}>
                      <FlashOnIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {gpuMetrics.mcp_gpu_status.power_draw_watts.toFixed(1)}W
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Power Draw</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AIIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">System Status</Typography>
                </Box>
                
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">RTX Ultra Boost</Typography>
                      <Chip 
                        label={gpuMetrics.rtx5090_ultra_enabled ? 'ACTIVE' : 'INACTIVE'}
                        sx={{ 
                          bgcolor: gpuMetrics.rtx5090_ultra_enabled ? '#4caf50' : '#f44336',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Background Workload</Typography>
                      <Chip 
                        label={gpuMetrics.background_workload.toUpperCase()}
                        sx={{ 
                          bgcolor: getStatusColor(gpuMetrics.background_workload),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Memory Pool</Typography>
                      <Chip 
                        label={gpuMetrics.memory_pool.toUpperCase()}
                        sx={{ 
                          bgcolor: getStatusColor(gpuMetrics.memory_pool),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {lastUpdate && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Last updated: {lastUpdate.toLocaleTimeString()}
                    <br />
                    🚀 RTX Cache: {autoRefresh ? 'ACTIVE (10s)' : 'MANUAL'} • {isCacheHit ? 'HIT' : 'MISS'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RTX5090Dashboard;