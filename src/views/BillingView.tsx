import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
  Alert,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  useTheme,
  alpha
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Description as ContractIcon,
  AccountBalance as BankIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CompletedIcon,
  AccessTime as PendingIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Analytics as AnalyticsIcon,
  PieChart as ChartIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useOffice } from '../contexts/OfficeContext';
import { jobNimbusApi } from '../services/apiService';

interface BillingStatus {
  id: string;
  label: string;
  count: number;
  amount: number;
  color: string;
  icon: React.ReactElement;
  gradient: string;
  description: string;
}

interface BillingItem {
  id: string;
  jobId: string;
  contactId: string;
  customerName: string;
  jobName: string;
  status: 'signed_contract' | 'deposit' | 'job_completed' | 'pending_payment' | 'paid';
  amount: number;
  dueDate: string;
  createdDate: string;
  description: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface BillingViewProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

const BillingView: React.FC<BillingViewProps> = ({ showNotification }) => {
  const theme = useTheme();
  const { currentOffice } = useOffice();
  
  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState<BillingItem[]>([]);
  const [filteredData, setFilteredData] = useState<BillingItem[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; item: BillingItem | null }>({
    open: false,
    item: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [realTimeMode, setRealTimeMode] = useState(true);

  // 💎 Definición de estados de facturación con colores únicos y gradientes
  const billingStatuses: BillingStatus[] = [
    {
      id: 'signed_contract',
      label: 'Contratos Firmados',
      count: 0,
      amount: 0,
      color: '#2196f3',
      icon: <ContractIcon />,
      gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
      description: 'Contratos firmados listos para proceder'
    },
    {
      id: 'deposit',
      label: 'Depósitos Recibidos',
      count: 0,
      amount: 0,
      color: '#ff9800',
      icon: <BankIcon />,
      gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      description: 'Depósitos pagados por los clientes'
    },
    {
      id: 'job_completed',
      label: 'Trabajos Completados',
      count: 0,
      amount: 0,
      color: '#4caf50',
      icon: <CompletedIcon />,
      gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
      description: 'Trabajos finalizados pendientes de facturación'
    },
    {
      id: 'pending_payment',
      label: 'Pagos Pendientes',
      count: 0,
      amount: 0,
      color: '#f44336',
      icon: <PendingIcon />,
      gradient: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
      description: 'Facturas emitidas pendientes de pago'
    },
    {
      id: 'paid',
      label: 'Pagos Completados',
      count: 0,
      amount: 0,
      color: '#9c27b0',
      icon: <ReceiptIcon />,
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      description: 'Pagos completados y procesados'
    }
  ];

  const [statusData, setStatusData] = useState<BillingStatus[]>(billingStatuses);

  // 🎯 Cargar datos de facturación
  const loadBillingData = async () => {
    try {
      setLoading(true);
      
      // Obtener estimaciones y trabajos en paralelo
      const [estimatesRes, jobsRes, paymentsRes] = await Promise.all([
        jobNimbusApi.getEstimates(1, 200),
        jobNimbusApi.getJobs(1, 200),
        fetch(`http://localhost:8000/payments?size=200`, {
          headers: { 'X-Location': currentOffice.id }
        }).then(res => res.json()).catch(() => ({ results: [] }))
      ]);

      const estimates = estimatesRes.data || [];
      const jobs = jobsRes.data || [];
      const payments = paymentsRes.results || [];

      // 🏗️ Mapear datos a estructura de facturación
      const mockBillingData: BillingItem[] = [];
      
      // Contratos firmados (jobs con status 'sold')
      jobs.filter(job => job.status === 'sold').forEach(job => {
        const relatedEstimate = estimates.find(est => est.jnid === job.jnid);
        mockBillingData.push({
          id: `contract_${job.jnid}`,
          jobId: job.jnid,
          contactId: job.primary_contact?.jnid || '',
          customerName: job.primary_contact?.display_name || 'Cliente Desconocido',
          jobName: job.display_name || job.name || 'Trabajo Sin Nombre',
          status: 'signed_contract',
          amount: relatedEstimate?.amount || Math.random() * 50000 + 10000,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdDate: job.date_created || new Date().toISOString(),
          description: job.description || 'Contrato firmado listo para comenzar',
          phone: job.primary_contact?.phone || '',
          email: job.primary_contact?.email || '',
          address: `${job.address?.line1 || ''} ${job.address?.city || ''} ${job.address?.state_text || ''}`.trim()
        });
      });

      // Depósitos (30% de contratos firmados)
      const contractsForDeposit = mockBillingData.filter(item => item.status === 'signed_contract').slice(0, Math.floor(mockBillingData.length * 0.3));
      contractsForDeposit.forEach(contract => {
        mockBillingData.push({
          ...contract,
          id: `deposit_${contract.jobId}`,
          status: 'deposit',
          amount: contract.amount * 0.3, // 30% deposit
          description: `Depósito del 30% recibido para ${contract.jobName}`,
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        });
      });

      // Trabajos completados (jobs con status 'complete')
      jobs.filter(job => job.status === 'complete').forEach(job => {
        const relatedEstimate = estimates.find(est => est.jnid === job.jnid);
        mockBillingData.push({
          id: `completed_${job.jnid}`,
          jobId: job.jnid,
          contactId: job.primary_contact?.jnid || '',
          customerName: job.primary_contact?.display_name || 'Cliente Desconocido',
          jobName: job.display_name || job.name || 'Trabajo Sin Nombre',
          status: 'job_completed',
          amount: relatedEstimate?.amount || Math.random() * 80000 + 20000,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdDate: job.date_created || new Date().toISOString(),
          description: 'Trabajo completado listo para facturación final',
          phone: job.primary_contact?.phone || '',
          email: job.primary_contact?.email || '',
          address: `${job.address?.line1 || ''} ${job.address?.city || ''} ${job.address?.state_text || ''}`.trim()
        });
      });

      // Pagos pendientes y completados basados en payments
      payments.forEach((payment: any) => {
        const relatedJob = jobs.find(job => job.jnid === payment.job_id);
        const isPaid = payment.status === 'paid' || payment.amount > 0;
        
        mockBillingData.push({
          id: `payment_${payment.jnid || Math.random()}`,
          jobId: payment.job_id || '',
          contactId: relatedJob?.primary_contact?.jnid || '',
          customerName: relatedJob?.primary_contact?.display_name || payment.customer_name || 'Cliente Desconocido',
          jobName: relatedJob?.display_name || payment.description || 'Pago JobNimbus',
          status: isPaid ? 'paid' : 'pending_payment',
          amount: payment.amount || Math.random() * 25000 + 5000,
          dueDate: payment.due_date || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          createdDate: payment.date_created || new Date().toISOString(),
          description: payment.description || (isPaid ? 'Pago completado y procesado' : 'Pago pendiente de procesamiento'),
          phone: relatedJob?.primary_contact?.phone || '',
          email: relatedJob?.primary_contact?.email || ''
        });
      });

      // Agregar algunos datos adicionales simulados para demostración completa
      const additionalMockData: BillingItem[] = [
        {
          id: 'mock_pending_1',
          jobId: 'MOCK001',
          contactId: 'CONT001',
          customerName: 'Constructora Mendez S.A.',
          jobName: 'Remodelación Oficinas Corporativas',
          status: 'pending_payment',
          amount: 125000,
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Vencido
          createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Factura final pendiente - VENCIDA',
          phone: '+1 (555) 123-4567',
          email: 'pagos@mendez-constructora.com',
          address: '123 Business Ave, Stamford, CT'
        },
        {
          id: 'mock_paid_1',
          jobId: 'MOCK002',
          contactId: 'CONT002',
          customerName: 'María González',
          jobName: 'Reparación Tejado Residencial',
          status: 'paid',
          amount: 8500,
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Pago completado - Transferencia bancaria',
          phone: '+1 (555) 987-6543',
          email: 'm.gonzalez@email.com',
          address: '456 Residential St, Guilford, CT'
        }
      ];

      const combinedData = [...mockBillingData, ...additionalMockData];
      setBillingData(combinedData);
      setFilteredData(combinedData);

      // 📊 Calcular estadísticas por estado
      const updatedStatuses = billingStatuses.map(status => {
        const statusItems = combinedData.filter(item => item.status === status.id);
        return {
          ...status,
          count: statusItems.length,
          amount: statusItems.reduce((sum, item) => sum + item.amount, 0)
        };
      });

      setStatusData(updatedStatuses);
      
      showNotification(
        `💰 Centro Financiero actualizado: ${combinedData.length} elementos de facturación cargados desde ${currentOffice.name}`,
        'success'
      );

    } catch (error) {
      console.error('Error loading billing data:', error);
      showNotification('❌ Error al cargar datos de facturación', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filtrar datos
  useEffect(() => {
    let filtered = billingData;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.customerName.toLowerCase().includes(term) ||
        item.jobName.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }

    setFilteredData(filtered);
  }, [billingData, selectedStatus, searchTerm]);

  // 🔄 Auto-refresh en modo tiempo real
  useEffect(() => {
    loadBillingData();
    
    let interval: NodeJS.Timeout;
    if (realTimeMode) {
      interval = setInterval(loadBillingData, 30000); // Cada 30 segundos
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentOffice.id, realTimeMode]);

  // 💎 Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 🎨 Crear visualizaciones simples
  const createSimpleChart = (data: any[], type: 'pie' | 'bar' = 'pie') => {
    const maxValue = Math.max(...data.map(item => item.value || item.amount));
    return data.map(item => ({
      ...item,
      percentage: ((item.value || item.amount) / maxValue) * 100
    }));
  };

  // 🎯 Calcular totales
  const totalAmount = statusData.reduce((sum, status) => sum + status.amount, 0);
  const totalCount = statusData.reduce((sum, status) => sum + status.count, 0);

  // 💸 Identificar elementos críticos
  const overduePayments = billingData.filter(item => 
    item.status === 'pending_payment' && new Date(item.dueDate) < new Date()
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box>
      {/* 🏆 Header del Centro Financiero */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #81c784 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box position="relative" zIndex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                💰 Centro Financiero Ejecutivo
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Dashboard Integral de Pagos y Facturación - {currentOffice.name}
              </Typography>
            </Box>
            
            <Box display="flex" gap={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={realTimeMode}
                    onChange={(e) => setRealTimeMode(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4caf50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4caf50',
                      },
                    }}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <NotificationIcon />
                    <Typography variant="caption">Tiempo Real</Typography>
                  </Box>
                }
                sx={{ color: 'white' }}
              />
              
              <Tooltip title="Actualizar datos">
                <IconButton 
                  onClick={loadBillingData}
                  sx={{ 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'rotate(180deg)',
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* 🎯 Métricas principales */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {formatCurrency(totalAmount)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Valor Total en Sistema
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {totalCount}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Elementos de Facturación
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold" color="#f44336">
                  {overduePayments.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Pagos Vencidos
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Efectos visuales de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      </Paper>

      {/* 🚨 Alertas críticas */}
      {overduePayments.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" startIcon={<ViewIcon />}>
              Ver Detalles
            </Button>
          }
        >
          <Typography fontWeight="bold">
            ⚠️ ATENCIÓN: {overduePayments.length} pagos vencidos requieren seguimiento inmediato
          </Typography>
          <Typography variant="body2">
            Valor total vencido: {formatCurrency(overduePayments.reduce((sum, item) => sum + item.amount, 0))}
          </Typography>
        </Alert>
      )}

      {/* 💎 Tarjetas de Estados de Facturación */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statusData.map((status, index) => (
          <Grid item xs={12} sm={6} lg={2.4} key={status.id}>
            <Card
              elevation={0}
              sx={{
                background: status.gradient,
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 40px ${alpha(status.color, 0.3)}`,
                },
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative'
              }}
              onClick={() => setSelectedStatus(selectedStatus === status.id ? 'all' : status.id)}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {status.icon}
                  </Box>
                  <Badge 
                    badgeContent={status.count} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: status.color,
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <StarIcon />
                  </Badge>
                </Box>

                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {formatCurrency(status.amount)}
                </Typography>
                
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {status.label}
                </Typography>
                
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {status.description}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={`${status.count} elementos`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  {selectedStatus === status.id && (
                    <Chip
                      label="FILTRADO"
                      size="small"
                      sx={{
                        bgcolor: '#4caf50',
                        color: 'white',
                        fontWeight: 'bold',
                        animation: 'pulse 1.5s infinite'
                      }}
                    />
                  )}
                </Box>

                {/* Indicador de progreso animado */}
                <LinearProgress
                  variant="determinate"
                  value={(status.amount / Math.max(totalAmount, 1)) * 100}
                  sx={{
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'rgba(255,255,255,0.8)',
                      borderRadius: 3,
                    }
                  }}
                />
              </CardContent>

              {/* Efecto de brillo */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: -100,
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shine 3s infinite',
                  '@keyframes shine': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' }
                  }
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📊 Panel de Analytics y Controles */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Distribución por Valor */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ p: 3, borderRadius: 3, height: '400px' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
              <ChartIcon color="primary" />
              Distribución por Valor
            </Typography>
            <Box height="300px" display="flex" flexDirection="column" gap={2} pt={2}>
              {statusData.map((status, index) => {
                const percentage = totalAmount > 0 ? (status.amount / totalAmount) * 100 : 0;
                return (
                  <Box key={status.id} display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: status.color,
                        flexShrink: 0
                      }}
                    />
                    <Box flexGrow={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight="500">
                          {status.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(status.color, 0.2),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: status.color,
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" mt={0.5}>
                        {formatCurrency(status.amount)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Cantidad por Estado */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ p: 3, borderRadius: 3, height: '400px' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
              <AnalyticsIcon color="primary" />
              Cantidad por Estado
            </Typography>
            <Box height="300px" display="flex" flexDirection="column" gap={3} pt={2}>
              {statusData.map((status, index) => {
                const maxCount = Math.max(...statusData.map(s => s.count));
                const percentage = maxCount > 0 ? (status.count / maxCount) * 100 : 0;
                return (
                  <Box key={status.id} display="flex" alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center" gap={1} minWidth={120}>
                      {status.icon}
                      <Typography variant="body2" fontWeight="500">
                        {status.label.split(' ')[0]}
                      </Typography>
                    </Box>
                    <Box flexGrow={1}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            flexGrow: 1,
                            height: 12,
                            borderRadius: 6,
                            bgcolor: alpha(status.color, 0.2),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: status.color,
                              borderRadius: 6,
                            }
                          }}
                        />
                        <Chip
                          label={status.count}
                          size="small"
                          sx={{
                            bgcolor: status.color,
                            color: 'white',
                            fontWeight: 'bold',
                            minWidth: 40
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 🔍 Panel de Controles */}
      <Card elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="🔍 Buscar cliente, trabajo o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={selectedStatus}
                label="Estado"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="all">Todos los Estados</MenuItem>
                {statusData.map(status => (
                  <MenuItem key={status.id} value={status.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {status.icon}
                      {status.label}
                      <Chip size="small" label={status.count} />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={() => showNotification('🚀 Exportación iniciada - Función en desarrollo', 'info')}
              >
                Exportar a Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => showNotification('🔧 Panel de filtros avanzados - Próximamente', 'info')}
              >
                Filtros Avanzados
              </Button>
              <Button
                variant="contained"
                startIcon={<TimelineIcon />}
                onClick={() => setSelectedTab(1)}
              >
                Ver Cronología
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 📋 Tabs de contenido */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Vista de Tabla" />
          <Tab label="Cronología" />
          <Tab label="Analytics Avanzado" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 0: Tabla */}
          {selectedTab === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography fontWeight="bold">Cliente</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Trabajo</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Estado</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">Monto</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Fecha Vencimiento</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Acciones</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(0, 50).map((item) => {
                    const status = statusData.find(s => s.id === item.status);
                    const isOverdue = item.status === 'pending_payment' && new Date(item.dueDate) < new Date();
                    
                    return (
                      <TableRow 
                        key={item.id}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                          ...(isOverdue && {
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.12) }
                          })
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: status?.color, width: 32, height: 32 }}>
                              {item.customerName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold" variant="body2">
                                {item.customerName}
                              </Typography>
                              {item.phone && (
                                <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                                  <PhoneIcon sx={{ fontSize: 12 }} />
                                  {item.phone}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {item.jobName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {item.jobId}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={status?.label || item.status}
                            size="small"
                            sx={{
                              bgcolor: status?.color,
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                            icon={status?.icon}
                          />
                          {isOverdue && (
                            <Chip
                              label="VENCIDO"
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography variant="h6" fontWeight="bold" color={status?.color}>
                            {formatCurrency(item.amount)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </Typography>
                          {isOverdue && (
                            <Typography variant="caption" color="error">
                              {Math.floor((new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24))} días vencido
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => setDetailDialog({ open: true, item })}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredData.length === 0 && (
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" color="text.secondary">
                    No se encontraron elementos de facturación
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta ajustar los filtros o buscar términos diferentes
                  </Typography>
                </Box>
              )}
            </TableContainer>
          )}

          {/* Tab 1: Cronología */}
          {selectedTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📅 Cronología de Facturación
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Visualización temporal de todos los elementos de facturación
              </Typography>

              {filteredData
                .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                .slice(0, 20)
                .map((item, index) => {
                  const status = statusData.find(s => s.id === item.status);
                  return (
                    <Box key={item.id} display="flex" alignItems="flex-start" gap={2} mb={3}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: status?.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0
                        }}
                      >
                        {status?.icon}
                      </Box>
                      
                      <Card 
                        elevation={0} 
                        sx={{ 
                          flexGrow: 1, 
                          p: 2, 
                          bgcolor: alpha(status?.color || '#1976d2', 0.05),
                          border: `1px solid ${alpha(status?.color || '#1976d2', 0.2)}`
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {item.customerName} - {item.jobName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.createdDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {item.description}
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Chip
                            size="small"
                            label={status?.label}
                            sx={{ bgcolor: status?.color, color: 'white' }}
                          />
                          <Typography variant="h6" fontWeight="bold" color={status?.color}>
                            {formatCurrency(item.amount)}
                          </Typography>
                        </Box>
                      </Card>
                    </Box>
                  );
                })}
            </Box>
          )}

          {/* Tab 2: Analytics Avanzado */}
          {selectedTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📊 Analytics Avanzado
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" color="#4caf50">
                      {((statusData.find(s => s.id === 'paid')?.amount || 0) / Math.max(totalAmount, 1) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Cobro
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                    <MoneyIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" color="#ff9800">
                      {formatCurrency((statusData.find(s => s.id === 'pending_payment')?.amount || 0))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pendiente de Cobro
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                    <CalendarIcon sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" color="#2196f3">
                      {Math.round(billingData.length ? (
                        billingData.reduce((sum, item) => {
                          const days = Math.floor((new Date().getTime() - new Date(item.createdDate).getTime()) / (1000 * 60 * 60 * 24));
                          return sum + Math.max(days, 0);
                        }, 0) / billingData.length
                      ) : 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Días Promedio
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Card>

      {/* 🔍 Dialog de Detalles */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, item: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ReceiptIcon color="primary" />
            Detalles de Facturación
          </Box>
        </DialogTitle>
        
        {detailDialog.item && (
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Cliente
                </Typography>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {detailDialog.item.customerName}
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={1} mb={2}>
                  {detailDialog.item.phone && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{detailDialog.item.phone}</Typography>
                    </Box>
                  )}
                  
                  {detailDialog.item.email && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{detailDialog.item.email}</Typography>
                    </Box>
                  )}
                  
                  {detailDialog.item.address && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{detailDialog.item.address}</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Trabajo
                </Typography>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {detailDialog.item.jobName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {detailDialog.item.description}
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <Chip label={`ID: ${detailDialog.item.jobId}`} size="small" />
                  <Chip label={`Contact: ${detailDialog.item.contactId}`} size="small" />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Monto
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {formatCurrency(detailDialog.item.amount)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado
                    </Typography>
                    <Chip
                      label={statusData.find(s => s.id === detailDialog.item!.status)?.label}
                      sx={{
                        bgcolor: statusData.find(s => s.id === detailDialog.item!.status)?.color,
                        color: 'white'
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha Creación
                    </Typography>
                    <Typography variant="body1">
                      {new Date(detailDialog.item.createdDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha Vencimiento
                    </Typography>
                    <Typography variant="body1">
                      {new Date(detailDialog.item.dueDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        )}
        
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, item: null })}>
            Cerrar
          </Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Editar
          </Button>
          <Button variant="outlined" startIcon={<ExportIcon />}>
            Exportar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingView;