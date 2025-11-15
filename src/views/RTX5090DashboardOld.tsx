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

  const fetchGPUMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/rtx5090/ultra-status');
      const data = await response.json();
      setGpuMetrics(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch GPU metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeGPU = async () => {
    try {
      setOptimizing(true);
      const response = await fetch('http://localhost:8000/rtx5090/stress-test', { method: 'POST' });
      const result = await response.json();
      
      if (result.optimization_status === 'SUCCESS') {
        // Refresh metrics after optimization
        setTimeout(fetchGPUMetrics, 1000);
      }
    } catch (error) {
      console.error('GPU optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    fetchGPUMetrics();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchGPUMetrics, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'fair': return '#ff9800';
      case 'optimal': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return '#4caf50';
    if (utilization > 50) return '#ff9800';
    return '#f44336';
  };

  if (!gpuMetrics || !gpuMetrics.mcp_gpu_status || loading) {
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
              {gpuMetrics?.mcp_gpu_status?.gpu_name || 'NVIDIA RTX 5090 Laptop GPU'} • {Math.round(gpuMetrics?.mcp_gpu_status?.memory_total_mb / 1024 || 24)}GB VRAM • AI Acceleration Active
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
            {optimizing ? 'Optimizing...' : 'Optimize GPU'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchGPUMetrics}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* System Status Alert */}
      <Alert 
        severity="success" 
        sx={{ mb: 3, bgcolor: '#e8f5e8' }}
        icon={<AIIcon />}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          🚀 RTX 5090 ACTIVE - Maximum Performance Mode Engaged
        </Typography>
        <Typography variant="body2">
          AI Acceleration: {gpuMetrics.system_integration.ai_analytics} | 
          Processing: {gpuMetrics.system_integration.data_processing} | 
          JobNimbus: {gpuMetrics.system_integration.jobnimbus_acceleration}
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* GPU Information Card */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card elevation={4}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ComputerIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Hardware Specifications
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">CUDA Cores</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {gpuMetrics.gpu_info.cuda_cores.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">RT Cores</Typography>
                    <Typography variant="h6" fontWeight="bold" color="secondary">
                      {gpuMetrics.gpu_info.rt_cores}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Tensor Cores</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {gpuMetrics.gpu_info.tensor_cores}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">VRAM</Typography>
                    <Typography variant="h6" fontWeight="bold" color="warning.main">
                      {gpuMetrics.gpu_info.vram_total.toFixed(1)} GB
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Base Clock</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {gpuMetrics.gpu_info.base_clock}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Boost Clock</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {gpuMetrics.gpu_info.boost_clock}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Real-time Metrics */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card elevation={4}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SpeedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Real-Time Performance
                  </Typography>
                </Box>
                
                {/* GPU Utilization */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">GPU Utilization</Typography>
                    <Chip 
                      label={`${gpuMetrics.real_time_metrics.gpu_utilization}%`}
                      size="small"
                      sx={{ 
                        bgcolor: getUtilizationColor(gpuMetrics.real_time_metrics.gpu_utilization),
                        color: 'white'
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={gpuMetrics.real_time_metrics.gpu_utilization}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getUtilizationColor(gpuMetrics.real_time_metrics.gpu_utilization)
                      }
                    }}
                  />
                </Box>

                {/* Memory Usage */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">VRAM Usage</Typography>
                    <Chip 
                      label={`${gpuMetrics.real_time_metrics.memory_used_gb.toFixed(2)}GB / ${gpuMetrics.gpu_info.vram_total.toFixed(1)}GB`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={gpuMetrics.real_time_metrics.memory_utilization}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="primary"
                  />
                </Box>

                {/* Temperature and Power */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <ThermostatIcon color="warning" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Temperature</Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {gpuMetrics.real_time_metrics.temperature}°C
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FlashOnIcon color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Power Draw</Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {gpuMetrics.real_time_metrics.power_draw.toFixed(1)}W
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Acceleration Stats */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card elevation={4} sx={{ background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AIIcon sx={{ mr: 1, color: 'white' }} />
                  <Typography variant="h6" fontWeight="bold" color="white">
                    AI Acceleration Power
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      AI Operations/sec
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {gpuMetrics.acceleration_stats.ai_operations_per_sec.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Matrix TFLOPS
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {gpuMetrics.acceleration_stats.matrix_operations_tflops}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      CPU Speedup
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {gpuMetrics.acceleration_stats.inference_speedup}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Memory BW
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {gpuMetrics.acceleration_stats.memory_bandwidth}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Health Status */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card elevation={4}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <MemoryIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    System Health
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Overall Health</Typography>
                      <Chip 
                        label={gpuMetrics.health_status.overall}
                        size="small"
                        sx={{ 
                          bgcolor: getHealthColor(gpuMetrics.health_status.overall),
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Thermal</Typography>
                      <Chip 
                        label={gpuMetrics.health_status.thermal}
                        size="small"
                        sx={{ 
                          bgcolor: getHealthColor(gpuMetrics.health_status.thermal),
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Power Efficiency</Typography>
                      <Chip 
                        label={gpuMetrics.health_status.power}
                        size="small"
                        sx={{ 
                          bgcolor: getHealthColor(gpuMetrics.health_status.power),
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Stability</Typography>
                      <Chip 
                        label={gpuMetrics.health_status.stability}
                        size="small"
                        sx={{ 
                          bgcolor: getHealthColor(gpuMetrics.health_status.stability),
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Performance Score */}
                <Box mt={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight="bold">Performance Score</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {gpuMetrics.real_time_metrics.performance_score.toFixed(1)}/100
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={gpuMetrics.real_time_metrics.performance_score}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: gpuMetrics.real_time_metrics.performance_score > 80 ? '#4caf50' : 
                                 gpuMetrics.real_time_metrics.performance_score > 60 ? '#ff9800' : '#f44336'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recommendations */}
        {gpuMetrics.recommendations && gpuMetrics.recommendations.length > 0 && (
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    🎯 Performance Recommendations
                  </Typography>
                  {gpuMetrics.recommendations.map((recommendation, index) => (
                    <Alert key={index} severity="info" sx={{ mb: 1 }}>
                      {recommendation}
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>

      {/* Footer with Last Update */}
      <Box mt={3} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'} | 
          Auto-refresh: {autoRefresh ? 'ON' : 'OFF'} | 
          RTX 5090 Status: 🚀 ACTIVE
        </Typography>
      </Box>
    </Box>
  );
};

export default RTX5090Dashboard;