import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  PieChart,
  BarChart,
  Timeline,
  Psychology as PredictionsIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';

export interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    totalJobs: number;
    jobsGrowth: number;
    conversionRate: number;
    conversionGrowth: number;
    customerSatisfaction: number;
    satisfactionGrowth: number;
  };
  trends: {
    revenue: Array<{ month: string; revenue: number; forecast: number }>;
    jobs: Array<{ month: string; completed: number; inProgress: number; canceled: number }>;
    conversion: Array<{ month: string; leads: number; conversions: number; rate: number }>;
  };
  performance: {
    topPerformers: Array<{ name: string; jobs: number; revenue: number; rating: number }>;
    teamMetrics: Array<{ category: string; current: number; target: number; performance: number }>;
  };
  insights: {
    keyInsights: Array<{ title: string; description: string; impact: 'high' | 'medium' | 'low'; trend: 'up' | 'down' | 'stable' }>;
    predictions: Array<{ metric: string; current: number; predicted: number; confidence: number }>;
  };
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData;
  onExport: (type: string) => void;
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ data, onExport, showNotification }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; type?: string }>({ open: false });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up' || value > 0) {
      return <TrendingUp sx={{ color: '#4caf50', fontSize: 20 }} />;
    } else if (trend === 'down' || value < 0) {
      return <TrendingDown sx={{ color: '#f44336', fontSize: 20 }} />;
    }
    return null;
  };

  const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#00695c', '#d32f2f'];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Analytics Avanzado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análisis predictivo y insights empresariales
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => onExport('analytics')}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            onClick={() => setDetailDialog({ open: true, type: 'overview' })}
          >
            Vista Detallada
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(data.overview.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Ingresos Totales
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Analytics />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                {getTrendIcon('up', data.overview.revenueGrowth)}
                <Typography variant="body2" sx={{ ml: 0.5, opacity: 0.9 }}>
                  {data.overview.revenueGrowth > 0 ? '+' : ''}{data.overview.revenueGrowth}% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {data.overview.totalJobs}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Trabajos Completados
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <BarChart />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                {getTrendIcon('up', data.overview.jobsGrowth)}
                <Typography variant="body2" sx={{ ml: 0.5, opacity: 0.9 }}>
                  {data.overview.jobsGrowth > 0 ? '+' : ''}{data.overview.jobsGrowth}% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {data.overview.conversionRate}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tasa de Conversión
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Timeline />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                {getTrendIcon('up', data.overview.conversionGrowth)}
                <Typography variant="body2" sx={{ ml: 0.5, opacity: 0.9 }}>
                  {data.overview.conversionGrowth > 0 ? '+' : ''}{data.overview.conversionGrowth}% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {data.overview.customerSatisfaction}/5
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Satisfacción Cliente
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <SpeedIcon />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                {getTrendIcon('up', data.overview.satisfactionGrowth)}
                <Typography variant="body2" sx={{ ml: 0.5, opacity: 0.9 }}>
                  {data.overview.satisfactionGrowth > 0 ? '+' : ''}{data.overview.satisfactionGrowth}% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
            <Tab icon={<TrendingUp />} label="Tendencias" />
            <Tab icon={<BarChart />} label="Rendimiento" />
            <Tab icon={<PredictionsIcon />} label="Predicciones" />
            <Tab icon={<InsightsIcon />} label="Insights" />
          </Tabs>
        </Box>

        <Box p={3}>
          {/* Tendencias Tab */}
          {selectedTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Tendencia de Ingresos vs Pronóstico
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.trends.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Monto']} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.6}
                      name="Ingresos Reales"
                    />
                    <Area
                      type="monotone"
                      dataKey="forecast"
                      stroke="#ff9800"
                      fill="none"
                      strokeDasharray="5 5"
                      name="Pronóstico"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Estado de Trabajos por Mes
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={data.trends.jobs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#4caf50" name="Completados" />
                    <Bar dataKey="inProgress" fill="#ff9800" name="En Progreso" />
                    <Bar dataKey="canceled" fill="#f44336" name="Cancelados" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Análisis de Conversión
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data.trends.conversion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="leads" fill="#2196f3" name="Leads" />
                    <Bar yAxisId="left" dataKey="conversions" fill="#4caf50" name="Conversiones" />
                    <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#f44336" strokeWidth={3} name="Tasa (%)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}

          {/* Rendimiento Tab */}
          {selectedTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Top Performers del Equipo
                </Typography>
                <List>
                  {data.performance.topPerformers.map((performer, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                          {performer.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={performer.name}
                        secondary={`${performer.jobs} trabajos • ${formatCurrency(performer.revenue)} • ${performer.rating}/5`}
                      />
                      <Chip
                        label={`#${index + 1}`}
                        color={index === 0 ? 'primary' : 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Métricas del Equipo vs Objetivos
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={data.performance.teamMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={0} domain={[0, 100]} />
                    <Radar
                      name="Actual"
                      dataKey="current"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Objetivo"
                      dataKey="target"
                      stroke="#4caf50"
                      fill="none"
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}

          {/* Predicciones Tab */}
          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Predicciones de IA para el Próximo Trimestre
                </Typography>
                <Grid container spacing={2}>
                  {data.insights.predictions.map((prediction, index) => (
                    <Grid item xs={12} md={6} lg={3} key={index}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {prediction.metric}
                          </Typography>
                          
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="h5" color="primary">
                              {prediction.current.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Actual
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="h5" color="success.main">
                              {prediction.predicted.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Predicción
                            </Typography>
                          </Box>
                          
                          <LinearProgress
                            variant="determinate"
                            value={prediction.confidence}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Confianza: {prediction.confidence}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Insights Tab */}
          {selectedTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Insights Clave del Negocio
                </Typography>
                <List>
                  {data.insights.keyInsights.map((insight, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getImpactColor(insight.impact) }}>
                            <InsightsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {insight.title}
                              </Typography>
                              <Chip
                                label={insight.impact.toUpperCase()}
                                size="small"
                                sx={{ 
                                  bgcolor: `${getImpactColor(insight.impact)}20`,
                                  color: getImpactColor(insight.impact)
                                }}
                              />
                              {getTrendIcon(insight.trend, 0)}
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              {insight.description}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < data.insights.keyInsights.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Vista Detallada de Analytics
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            Funcionalidad de vista detallada próximamente...
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdvancedAnalytics;
