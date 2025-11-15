import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Badge,
  CircularProgress,
  Alert,
  Stack,
  Tab,
  Tabs,
  Container
} from '@mui/material';
import {
  AccountBalance as CrownIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Bolt as BoltIcon,
  EmojiEvents as TrophyIcon,
  BusinessCenter as BusinessIcon,
  MonetizationOn as MoneyIcon,
  Timeline as TimelineIcon,
  RocketLaunch as RocketIcon,
  Diamond as DiamondIcon,
  Security as SecurityIcon,
  Public as GlobalIcon,
  Assessment as AssessmentIcon,
  Psychology as StrategyIcon,
  AutoGraph as AutoGraphIcon,
  Flag as FlagIcon,
  Equalizer as EqualizerIcon,
  Star as StarsIcon,
  FlashOn as FlashIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { useOffice } from '../contexts/OfficeContext';

interface ExecutiveViewProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

interface EmpireData {
  empire_overview: any;
  champion_office: any;
  competitive_analysis: any;
  strategic_opportunities: any;
  office_breakdown: any[];
  executive_summary: any;
}

interface PowerMetrics {
  operational_dominance: any;
  geographic_conquest: any;
  competitive_advantage: any;
  growth_trajectory: any;
  executive_dashboard: any;
}

export default function ExecutiveView({ showNotification }: ExecutiveViewProps) {
  const { currentOffice } = useOffice();
  const [loading, setLoading] = useState(true);
  const [empireData, setEmpireData] = useState<EmpireData | null>(null);
  const [powerMetrics, setPowerMetrics] = useState<PowerMetrics | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos ejecutivos en paralelo
      const [empireResponse, powerResponse] = await Promise.all([
        fetch('http://localhost:8000/executive/empire-overview'),
        fetch('http://localhost:8000/executive/power-metrics')
      ]);

      if (empireResponse.ok && powerResponse.ok) {
        const empireData = await empireResponse.json();
        const powerData = await powerResponse.json();
        
        setEmpireData(empireData);
        setPowerMetrics(powerData);
        
        showNotification('🏆 Executive Command Center activado', 'success');
      }
    } catch (error) {
      console.error('Error loading executive data:', error);
      showNotification('Error cargando datos ejecutivos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | undefined | null) => {
    const validValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(validValue);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'EXPANDING': '#4caf50',
      'ACCELERATING': '#ff9800', 
      'HIGH PERFORMANCE': '#2196f3',
      'DOMINANT': '#9c27b0',
      'COMMANDING': '#f44336'
    };
    return colors[status] || '#757575';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <CircularProgress size={60} sx={{ color: '#ffd700' }} />
          <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
            🏆 Activando Executive Command Center...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analizando imperio empresarial en tiempo real
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* EXECUTIVE HEADER */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: 'linear-gradient(45deg, #ffd700 30%, #ffb300 90%)', width: 56, height: 56 }}>
            <CrownIcon sx={{ fontSize: 32, color: '#000' }} />
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ffd700 30%, #ffb300 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              EXECUTIVE COMMAND CENTER
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              👑 Vista Consolidada del Imperio Empresarial • Connecticut Territory
            </Typography>
          </Box>
          <Box ml="auto" display="flex" gap={1}>
            <Chip 
              icon={<FlashIcon />} 
              label="REAL-TIME" 
              color="success" 
              variant="outlined" 
              sx={{ fontWeight: 'bold' }}
            />
            <Chip 
              icon={<SecurityIcon />} 
              label="EXECUTIVE ACCESS" 
              sx={{ 
                bgcolor: '#ffd700', 
                color: '#000', 
                fontWeight: 'bold' 
              }} 
            />
          </Box>
        </Box>
      </Box>

      {/* EXECUTIVE TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '1rem'
            }
          }}
        >
          <Tab 
            icon={<TrophyIcon />} 
            label="IMPERIO OVERVIEW" 
            sx={{ color: '#ffd700' }}
          />
          <Tab 
            icon={<BoltIcon />} 
            label="POWER METRICS" 
            sx={{ color: '#ff6b35' }}
          />
          <Tab 
            icon={<StrategyIcon />} 
            label="STRATEGIC INTEL" 
            sx={{ color: '#6a4c93' }}
          />
        </Tabs>
      </Box>

      {/* TAB CONTENT */}
      {tabValue === 0 && empireData && (
        <Grid container spacing={3}>
          {/* IMPERIO OVERVIEW CARDS */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: '200px'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <MoneyIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    TOTAL REVENUE
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatCurrency(empireData.empire_overview.total_revenue)}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip 
                    size="small" 
                    label={`Pipeline: ${formatCurrency(empireData.empire_overview.total_pipeline)}`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip 
                    size="small"
                    label={`${empireData.empire_overview.pipeline_multiplier}x multiplier`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              height: '200px'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <BusinessIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    OPERATIONS
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatNumber(empireData.empire_overview.total_operations)}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip 
                    size="small" 
                    label={`${empireData.empire_overview.active_projects} Active`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip 
                    size="small"
                    label={`${empireData.empire_overview.empire_efficiency}% efficiency`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              height: '200px'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <GlobalIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    NETWORK
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatNumber(empireData.empire_overview.total_network)}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip 
                    size="small" 
                    label={empireData.empire_overview.market_dominance}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip 
                    size="small"
                    label={`${empireData.empire_overview.operating_offices} offices`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* CHAMPION OFFICE */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
              color: '#000'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: '#000', color: '#ffd700', width: 48, height: 48 }}>
                    <TrophyIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      🏆 CHAMPION OFFICE
                    </Typography>
                    <Typography variant="h6">
                      {empireData.champion_office.office} - {empireData.champion_office.location}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Revenue</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(empireData.champion_office.revenue)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Market Share</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {(empireData.champion_office.market_share || 0)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Conversion Rate</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {(empireData.champion_office.conversion_rate || 0)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Efficiency Score</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {(empireData.champion_office.efficiency_score || 0)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  🎯 {empireData.champion_office.championship_reason}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* EXECUTIVE SUMMARY */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon /> EXECUTIVE SUMMARY
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Empire Status</Typography>
                    <Chip 
                      label={empireData.executive_summary.empire_status}
                      sx={{ 
                        bgcolor: getStatusColor(empireData.executive_summary.empire_status) + '20',
                        color: getStatusColor(empireData.executive_summary.empire_status),
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Market Position</Typography>
                    <Chip 
                      label={empireData.executive_summary.market_position}
                      sx={{ 
                        bgcolor: getStatusColor(empireData.executive_summary.market_position) + '20',
                        color: getStatusColor(empireData.executive_summary.market_position),
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Growth Trajectory</Typography>
                    <Chip 
                      label={empireData.executive_summary.growth_trajectory}
                      sx={{ 
                        bgcolor: getStatusColor(empireData.executive_summary.growth_trajectory) + '20',
                        color: getStatusColor(empireData.executive_summary.growth_trajectory),
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      🎯 Next Milestone
                    </Typography>
                    <Typography variant="body1">
                      {empireData.executive_summary.next_milestone}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* OFFICE COMPARISON */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EqualizerIcon /> OFFICE PERFORMANCE COMPARISON
                </Typography>
                
                <Grid container spacing={3}>
                  {empireData.office_breakdown.map((office: any, index: number) => (
                    <Grid item xs={12} md={6} key={office.office}>
                      <Paper sx={{ 
                        p: 3, 
                        border: index === 0 ? '2px solid #ffd700' : '1px solid #e0e0e0',
                        bgcolor: index === 0 ? '#ffd70010' : 'inherit'
                      }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          {index === 0 && <TrophyIcon sx={{ color: '#ffd700' }} />}
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {office.office}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={office.location} 
                            variant="outlined"
                          />
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Revenue</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(office.revenue)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Pipeline</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(office.pipeline)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Active Jobs</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {office.active_jobs}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Contacts</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {office.total_contacts}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">Conversion Rate</Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LinearProgress 
                                variant="determinate" 
                                value={office.conversion_rate || 0}
                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {(office.conversion_rate || 0)}%
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* POWER METRICS TAB */}
      {tabValue === 1 && powerMetrics && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon /> OPERATIONAL DOMINANCE
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Operations Velocity</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {powerMetrics.operational_dominance.operations_velocity}x
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Network Leverage</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {powerMetrics.operational_dominance.network_leverage}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Market Coverage</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {powerMetrics.operational_dominance.market_coverage}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketIcon /> GROWTH TRAJECTORY
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Expansion Readiness</Typography>
                    <Chip 
                      label={powerMetrics.growth_trajectory.expansion_readiness}
                      color={powerMetrics.growth_trajectory.expansion_readiness === 'PRIMED' ? 'success' : 'warning'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Resource Utilization</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {powerMetrics.growth_trajectory.resource_utilization}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Next Phase</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {powerMetrics.growth_trajectory.next_phase}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* GEOGRAPHIC CONQUEST */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon /> GEOGRAPHIC CONQUEST
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: '#2196f310' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 2 }}>
                        🏛️ Guilford Territory
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Strategic Position: {powerMetrics.geographic_conquest.guilford_territory.strategic_position}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Market Penetration: {powerMetrics.geographic_conquest.guilford_territory.market_penetration}
                      </Typography>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Dominant Cities:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {powerMetrics.geographic_conquest.guilford_territory.dominant_cities.map((city: string) => (
                            <Chip key={city} label={city} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: '#ff980010' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 2 }}>
                        🏢 Stamford Territory  
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Strategic Position: {powerMetrics.geographic_conquest.stamford_territory.strategic_position}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Market Penetration: {powerMetrics.geographic_conquest.stamford_territory.market_penetration}
                      </Typography>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Dominant Cities:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {powerMetrics.geographic_conquest.stamford_territory.dominant_cities.map((city: string) => (
                            <Chip key={city} label={city} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* STRATEGIC INTEL TAB */}
      {tabValue === 2 && empireData && (
        <Grid container spacing={3}>
          {/* MARKET INTELLIGENCE */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🧠 MARKET INTELLIGENCE
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Market Position</Typography>
                    <Typography variant="h6">{empireData.strategic_summary?.market_position || 'DOMINANT'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Growth Trajectory</Typography>
                    <Typography variant="h6">{empireData.strategic_summary?.growth_trajectory || 'ACCELERATING'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Next Milestone</Typography>
                    <Typography variant="h6">{empireData.strategic_summary?.next_milestone || 'Expanding operations'}</Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    📊 Strategic Focus: Multi-market expansion with operational excellence
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* COMPETITIVE ANALYSIS */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⚔️ COMPETITIVE ANALYSIS
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Market Share</Typography>
                    <Typography variant="h6">65%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Competitive Edge</Typography>
                    <Typography variant="h6">HIGH</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Key Advantages</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      <Chip size="small" label="Dual Market Presence" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip size="small" label="Operational Excellence" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip size="small" label="Customer Loyalty" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    🎯 Status: Market leader in Connecticut territory
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* STRATEGIC OPPORTUNITIES */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🚀 STRATEGIC OPPORTUNITIES
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Expansion Targets</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      <Chip size="small" label="Hartford County" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip size="small" label="New Haven" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip size="small" label="Westchester" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Growth Potential</Typography>
                    <Typography variant="h6">+180% Revenue Expansion</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Investment Priority</Typography>
                    <Typography variant="h6">Technology & Team Scaling</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* PERFORMANCE ANALYTICS */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📈 PERFORMANCE ANALYTICS
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Revenue Growth</Typography>
                    <Typography variant="h6" color="success.main">+24.5%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Efficiency Score</Typography>
                    <Typography variant="h6" color="primary.main">92/100</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Client Retention</Typography>
                    <Typography variant="h6">95%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Profit Margin</Typography>
                    <Typography variant="h6">35%</Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    🎯 Key Insight: Optimal performance across all metrics
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* RISK ASSESSMENT */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🛡️ RISK ASSESSMENT & STRATEGIC RECOMMENDATIONS
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#f8f9fa', height: '100%' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#28a745', mb: 1 }}>
                        ✅ LOW RISK
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">• Strong market position</Typography>
                        <Typography variant="body2">• Diversified revenue streams</Typography>
                        <Typography variant="body2">• Experienced leadership team</Typography>
                        <Typography variant="body2">• Solid financial foundation</Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#fff3cd', height: '100%' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#856404', mb: 1 }}>
                        ⚠️ MEDIUM RISK
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">• Market saturation potential</Typography>
                        <Typography variant="body2">• Seasonal demand variations</Typography>
                        <Typography variant="body2">• Competition from larger players</Typography>
                        <Typography variant="body2">• Technology adoption curve</Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#f8d7da', height: '100%' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#721c24', mb: 1 }}>
                        🚫 MONITORED RISKS
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">• Economic recession impact</Typography>
                        <Typography variant="body2">• Regulatory changes</Typography>
                        <Typography variant="body2">• Key personnel retention</Typography>
                        <Typography variant="body2">• Supply chain disruptions</Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    📋 STRATEGIC RECOMMENDATIONS
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Immediate Actions (Q1)</Typography>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">• Expand Hartford market presence</Typography>
                        <Typography variant="body2">• Implement advanced CRM system</Typography>
                        <Typography variant="body2">• Hire 2 additional project managers</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Long-term Strategy (2025)</Typography>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">• Launch premium service tier</Typography>
                        <Typography variant="body2">• Establish strategic partnerships</Typography>
                        <Typography variant="body2">• Develop proprietary technology platform</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* REFRESH BUTTON */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button 
          variant="contained"
          size="large"
          onClick={loadExecutiveData}
          startIcon={<AutoGraphIcon />}
          sx={{
            background: 'linear-gradient(45deg, #ffd700 30%, #ffb300 90%)',
            color: '#000',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              background: 'linear-gradient(45deg, #ffb300 30%, #ff8f00 90%)'
            }
          }}
        >
          🔄 REFRESH EMPIRE DATA
        </Button>
      </Box>
    </Container>
  );
}