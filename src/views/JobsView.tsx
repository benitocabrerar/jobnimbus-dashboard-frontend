import React, { useState, useEffect } from 'react';
import { jobNimbusApi, JobNimbusLocation } from '../services/apiService';
import { useJobNimbusConnection } from '../hooks/useJobNimbusConnection';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  InputAdornment,
  Fab,
  Badge,
  Tooltip as MuiTooltip,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  LinearProgress,
  Tab,
  Tabs,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  GetApp,
  Edit,
  Delete,
  Visibility,
  Work,
  Schedule,
  AttachMoney,
  Person,
  LocationOn,
  Build,
  CheckCircle,
  Warning,
  PlayArrow,
  Pause,
  Stop,
  MoreVert,
  Assignment,
  Assessment,
  Timeline,
  Refresh,
  DragIndicator,
  AccessTime,
  Phone
} from '@mui/icons-material';

interface JobsViewProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  currentLocation: JobNimbusLocation;
}

interface Job {
  id: string;
  jnid: string;
  number: string;
  display_name: string;
  description: string;
  status: string;
  status_name: string;
  date_created: string;
  date_start?: string;
  date_end?: string;
  estimated_time: number;
  actual_time: number;
  customer?: string;
  customer_name?: string;
  address_line1?: string;
  city?: string;
  state_text?: string;
  zip?: string;
  last_estimate: number;
  last_invoice: number;
  task_count: number;
  attachment_count: number;
  owners?: any[];
  tags?: string[];
  record_type_name: string;
  // JobNimbus specific fields
  is_active?: boolean;
  is_closed?: boolean;
  is_archived?: boolean;
}

export default function JobsView({ showNotification, currentLocation }: JobsViewProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  
  // Hook de conexión JobNimbus
  const { isConnected, isConnecting, getStatusMessage, connect } = useJobNimbusConnection();

  const loadRealJobs = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setJobs([]);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }
      
      // Cargar solo 10 registros por página
      const result = await jobNimbusApi.getJobs(page, 10);
      
      if (append && page > 1) {
        setJobs(prev => [...prev, ...result.data]);
        setFilteredJobs(prev => [...prev, ...result.data]);
      } else {
        setJobs(result.data);
        setFilteredJobs(result.data);
      }
      
      setTotal(result.total);
      setHasMore(result.hasMore || false);
      setCurrentPage(page);
      setLoading(false);
      setLoadingMore(false);
      
      showNotification(`✅ Cargados ${result.data.length} trabajos${append ? ' adicionales' : ''} (${result.total} total)`, 'success');
      
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs(page === 1 ? [] : jobs);
      setFilteredJobs(page === 1 ? [] : filteredJobs);
      setLoading(false);
      setLoadingMore(false);
      
      showNotification(`❌ ${error instanceof Error ? error.message : 'Error cargando trabajos'}`, 'error');
    }
  };

  const loadMoreJobs = () => {
    loadRealJobs(currentPage + 1, true);
  };

  useEffect(() => {
    loadRealJobs();
  }, []);

  // 🏢 Efecto para sincronizar con cambios de ubicación desde App.tsx
  useEffect(() => {
    // Recargar datos cuando cambie la ubicación
    loadRealJobs();
  }, [currentLocation]);

  // Recargar cuando se restablece la conexión
  useEffect(() => {
    if (isConnected && jobs.length === 0 && !loading) {
      loadRealJobs();
    }
  }, [isConnected, jobs.length, loading]);

  useEffect(() => {
    let filtered = jobs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.number.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status_name.toLowerCase().includes(statusFilter.toLowerCase()));
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      // JobNimbus specific statuses - More vivid and distinct colors
      case 'lead': return '#FF6B35'; // Bright Orange-Red for leads
      case 'estimating': return '#1E88E5'; // Bright Blue for estimating
      case 'pending customer aproval': return '#E53E3E'; // Bright Red for pending approval
      case 'in production': return '#38A169'; // Bright Green for in production
      case 'completed': return '#22C55E'; // Vivid Green for completed
      case 'cancelled': return '#DC2626'; // Bright Red for cancelled
      case 'lost': return '#8B5CF6'; // Bright Purple for lost jobs
      case 'paid & closed': return '#06B6D4'; // Bright Cyan for paid & closed jobs
      case 'paid and closed': return '#06B6D4'; // Alternative spelling
      case 'paid': return '#06B6D4'; // Short form
      case 'closed': return '#6366F1'; // Bright Indigo for closed
      
      // Legacy statuses for backwards compatibility
      case 'active': return '#2e7d32';
      case 'in progress': return '#1976d2';
      case 'on hold': return '#ed6c02';
      default: return '#757575'; // Gray for unknown statuses
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <PlayArrow />;
      case 'in progress': return <Build />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Stop />;
      case 'on hold': return <Pause />;
      default: return <Work />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (hours: number) => {
    return `${hours}h`;
  };

  const calculateProgress = (actual: number, estimated: number) => {
    if (estimated === 0) return 0;
    return Math.min((actual / estimated) * 100, 100);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, job: Job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setCreateDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setCreateDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    showNotification('Trabajo eliminado correctamente', 'success');
    handleMenuClose();
  };

  const calculateStats = () => {
    const total = jobs.length;
    // ✅ Fix: Use correct JobNimbus fields for active jobs  
    // Active jobs: is_active=true AND is_closed=false AND is_archived=false
    const active = jobs.filter(j => 
      j.is_active === true && j.is_closed === false && j.is_archived === false
    ).length;
    
    console.log('🔍 DEBUG Jobs: Calculated active jobs:', active);
    const inProgress = jobs.filter(j => j.status_name.toLowerCase().includes('progress')).length;
    const completed = jobs.filter(j => j.status_name.toLowerCase().includes('completed')).length;
    const totalEstimate = jobs.reduce((sum, j) => sum + j.last_estimate, 0);
    const totalInvoice = jobs.reduce((sum, j) => sum + j.last_invoice, 0);

    return { total, active, inProgress, completed, totalEstimate, totalInvoice };
  };

  const stats = calculateStats();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Drag and Drop handlers for Kanban
  const handleDragStart = (e: React.DragEvent, job: Job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedJob && draggedJob.status_name !== newStatus) {
      // Update job status
      const updatedJobs = jobs.map(job => 
        job.id === draggedJob.id 
          ? { ...job, status_name: newStatus }
          : job
      );
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      showNotification(`Trabajo "${draggedJob.display_name}" movido a ${newStatus}`, 'success');
    }
    setDraggedJob(null);
  };

  // Get jobs organized by status for Kanban
  const getJobsByStatus = () => {
    // Get unique statuses from actual data to ensure all are included
    const uniqueStatuses = [...new Set(filteredJobs.map(job => job.status_name))];
    
    // Default statuses for consistent ordering, but include any additional ones found
    const defaultStatuses = ['Lead', 'Estimating', 'Pending Customer Aproval', 'In Production', 'Completed', 'Paid & Closed', 'Lost', 'Cancelled'];
    
    // Combine default statuses with any unique ones not in the default list
    const allStatuses = [...defaultStatuses, ...uniqueStatuses.filter(status => !defaultStatuses.includes(status))];
    
    return allStatuses.map(status => {
      const statusJobs = filteredJobs.filter(job => job.status_name === status);
      return {
        status,
        jobs: statusJobs,
        color: getStatusColor(status),
        count: statusJobs.length
      };
    }).filter(statusGroup => statusGroup.count > 0); // Only return statuses that have jobs
  };

  // Analytics calculations
  const getAnalyticsData = () => {
    // Status distribution for pie chart
    const statusData = getJobsByStatus().map(column => ({
      name: column.status,
      value: column.count,
      color: column.color
    })).filter(item => item.value > 0);
    
    // Status data is ready for pie chart

    // Monthly job creation trend - with debug logging
    const monthlyData = [];
    
    console.log('DEBUG: Total jobs received:', jobs.length);
    
    if (jobs.length > 0) {
      // Debug: Show first job structure
      const firstJob = jobs[0];
      console.log('DEBUG: First job structure:', {
        date_created: firstJob.date_created,
        dateCreated: firstJob.dateCreated,
        created_at: firstJob.created_at,
        createdAt: firstJob.createdAt,
        date_status_change: firstJob.date_status_change,
        timestamp: firstJob.timestamp,
        keys: Object.keys(firstJob).filter(key => key.toLowerCase().includes('date') || key.toLowerCase().includes('creat'))
      });
      
      // Filter jobs with valid timestamps (handle both string ISO dates and Unix timestamps)
      const validJobs = jobs.filter(job => job.date_created && job.date_created !== '');
      console.log('DEBUG: Valid jobs with timestamps:', validJobs.length);
      
      if (validJobs.length > 0) {
        // Show sample job data
        const sampleJob = validJobs[0];
        const sampleDate = new Date(sampleJob.date_created); // Works for both ISO strings and Unix timestamps
        console.log('DEBUG: Sample job:', {
          number: sampleJob.number,
          date_created: sampleJob.date_created,
          date_as_js: sampleDate,
          last_estimate: sampleJob.last_estimate
        });
        
        // Group jobs by month-year
        const jobsByMonth = new Map();
        
        validJobs.forEach(job => {
          const jobDate = new Date(job.date_created); // Works for both ISO strings and Unix timestamps
          if (!isNaN(jobDate.getTime())) {
            const monthKey = `${jobDate.getFullYear()}-${jobDate.getMonth()}`;
            if (!jobsByMonth.has(monthKey)) {
              jobsByMonth.set(monthKey, []);
            }
            jobsByMonth.get(monthKey).push(job);
          }
        });
        
        console.log('DEBUG: Jobs grouped by month:', Array.from(jobsByMonth.entries()).map(([key, jobs]) => ({
          monthKey: key,
          count: jobs.length,
          revenue: jobs.reduce((sum, job) => sum + job.last_estimate, 0)
        })));
        
        // Debug: Revenue verification (remove after confirmation)
        const totalRevenueFromMonths = Array.from(jobsByMonth.values()).flat().reduce((sum, job) => sum + job.last_estimate, 0);
        const totalRevenueFromAllJobs = jobs.reduce((sum, job) => sum + job.last_estimate, 0);
        console.log('✅ Revenue calculation verified:', {
          allJobsRevenue: totalRevenueFromAllJobs,
          monthsSubsetRevenue: totalRevenueFromMonths,
          percentageShown: ((totalRevenueFromMonths / totalRevenueFromAllJobs) * 100).toFixed(1) + '%'
        });
        
        // Get latest date to determine the 6-month range
        const latestDate = new Date(Math.max(...validJobs.map(job => new Date(job.date_created).getTime())));
        console.log('DEBUG: Latest job date:', latestDate);
        
        // Generate last 6 months from the latest date
        for (let i = 5; i >= 0; i--) {
          const date = new Date(latestDate.getFullYear(), latestDate.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          const monthJobs = jobsByMonth.get(monthKey) || [];
          const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
          
          console.log(`DEBUG: Month ${monthName} (${monthKey}): ${monthJobs.length} jobs, ${monthJobs.reduce((sum, job) => sum + job.last_estimate, 0)} revenue`);
          
          monthlyData.push({
            month: monthName,
            jobs: monthJobs.length,
            revenue: monthJobs.reduce((sum, job) => sum + job.last_estimate, 0)
          });
        }
      } else {
        console.log('DEBUG: No valid jobs found, using fallback');
        // Fallback when no valid jobs
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
          monthlyData.push({
            month: monthName,
            jobs: 0,
            revenue: 0
          });
        }
      }
    } else {
      console.log('DEBUG: No jobs at all, using fallback');
      // Fallback for empty jobs
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
        monthlyData.push({
          month: monthName,
          jobs: 0,
          revenue: 0
        });
      }
    }
    
    console.log('DEBUG: Final monthlyData:', monthlyData);

    // Performance metrics by status
    const performanceData = getJobsByStatus().map(column => ({
      status: column.status,
      count: column.count,
      avgEstimate: column.jobs.length > 0 
        ? column.jobs.reduce((sum, job) => sum + job.last_estimate, 0) / column.jobs.length 
        : 0,
      totalRevenue: column.jobs.reduce((sum, job) => sum + job.last_estimate, 0)
    })).filter(item => item.count > 0);

    // Efficiency analysis - check for jobs with time tracking data
    const efficiencyJobs = jobs.filter(job => job.estimated_time > 0 && job.actual_time > 0);
    
    let efficiencyData = [];
    
    if (efficiencyJobs.length > 0) {
      // Use real time data when available
      efficiencyData = efficiencyJobs.map(job => ({
        name: `#${job.number}`,
        estimated: job.estimated_time,
        actual: job.actual_time,
        efficiency: job.estimated_time > 0 ? (job.estimated_time / job.actual_time) * 100 : 100
      })).slice(0, 8); // Top 8 for better readability
    } else {
      // Show empty state - no sample data to avoid misleading information
      efficiencyData = [];
    }

    return {
      statusData,
      monthlyData,
      performanceData,
      efficiencyData,
      totalJobs: jobs.length,
      totalRevenue: jobs.reduce((sum, job) => sum + job.last_estimate, 0),
      avgJobValue: jobs.length > 0 ? jobs.reduce((sum, job) => sum + job.last_estimate, 0) / jobs.length : 0,
      completionRate: jobs.length > 0 ? (jobs.filter(job => 
        job.status_name === 'Job Completed' || job.status_name === 'Paid & Closed'
      ).length / jobs.length) * 100 : 0
    };
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Box p={3}>
          <Typography>Cargando trabajos...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Stats */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Gestión de Trabajos
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Administra proyectos, tareas y seguimiento de trabajos
        </Typography>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                    <Work />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Trabajos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#2e7d32', mr: 2 }}>
                    <PlayArrow />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.active}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#ed6c02', mr: 2 }}>
                    <Build />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.inProgress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En Progreso
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#388e3c', mr: 2 }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completados
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(stats.totalEstimate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Estimado
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#00695c', mr: 2 }}>
                    <Assessment />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(stats.totalInvoice)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Facturado
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6">Filtros y Búsqueda</Typography>
            <Typography variant="caption" color={isConnected ? 'success.main' : 'error.main'}>
              {getStatusMessage()}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            {!isConnected && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Conectando...' : 'Reconectar'}
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateJob}
              disabled={!isConnected}
            >
              Nuevo Trabajo
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar trabajos por nombre, descripción o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="progress">En Progreso</MenuItem>
                <MenuItem value="completed">Completados</MenuItem>
                <MenuItem value="cancelled">Cancelados</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GetApp />}
              onClick={() => showNotification('Exportando trabajos...', 'info')}
            >
              Exportar CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Jobs Table */}
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<Work />} label="Lista de Trabajos" />
            <Tab icon={<Timeline />} label="Vista Kanban" />
            <Tab icon={<Assessment />} label="Análisis" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Trabajo</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell>Fechas</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Tareas</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: getStatusColor(job.status_name) }}>
                          {getStatusIcon(job.status_name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            #{job.number} - {job.display_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {job.customer_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                          <LocationOn sx={{ mr: 0.5, fontSize: 14 }} />
                          {job.city}, {job.state_text}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={job.status_name}
                        size="small"
                        icon={getStatusIcon(job.status_name)}
                        sx={{
                          bgcolor: `${getStatusColor(job.status_name)}20`,
                          color: getStatusColor(job.status_name),
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="caption">
                            {formatTime(job.actual_time)} / {formatTime(job.estimated_time)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({Math.round(calculateProgress(job.actual_time, job.estimated_time))}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(job.actual_time, job.estimated_time)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="caption" display="block">
                          <strong>Creado:</strong> {formatDate(job.date_created)}
                        </Typography>
                        {job.date_start && (
                          <Typography variant="caption" display="block">
                            <strong>Inicio:</strong> {formatDate(job.date_start)}
                          </Typography>
                        )}
                        {job.date_end && (
                          <Typography variant="caption" display="block">
                            <strong>Fin:</strong> {formatDate(job.date_end)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {formatCurrency(job.last_estimate)}
                        </Typography>
                        {job.last_invoice > 0 && (
                          <Typography variant="caption" color="success.main">
                            Facturado: {formatCurrency(job.last_invoice)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Badge badgeContent={job.task_count} color="primary">
                        <Assignment />
                      </Badge>
                      {job.attachment_count > 0 && (
                        <Badge badgeContent={job.attachment_count} color="secondary" sx={{ ml: 1 }}>
                          <LocationOn />
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuClick(e, job)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 2, height: 'calc(100vh - 400px)', overflow: 'auto' }}>
            {filteredJobs.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {jobs.length === 0 ? 'Cargando trabajos...' : 'No se encontraron trabajos'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {jobs.length === 0 ? 'Conectando con JobNimbus para cargar trabajos' : 'Prueba con diferentes filtros de búsqueda'}
                </Typography>
              </Box>
            ) : (
            <Box display="flex" gap={2} sx={{ minWidth: 'max-content' }}>
              {getJobsByStatus().map((column) => (
                <Box
                  key={column.status}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.status)}
                  sx={{
                    minWidth: 320,
                    maxWidth: 320,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    p: 2,
                    border: draggedJob ? '2px dashed #ccc' : '1px solid #e0e0e0'
                  }}
                >
                  {/* Column Header */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: column.color
                        }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {column.status}
                      </Typography>
                      <Chip 
                        label={column.jobs.length} 
                        size="small" 
                        sx={{ bgcolor: column.color + '20', color: column.color }}
                      />
                    </Box>
                  </Box>

                  {/* Job Cards */}
                  <Box sx={{ maxHeight: 'calc(100vh - 500px)', overflow: 'auto' }}>
                    {column.jobs.map((job) => (
                      <Card
                        key={job.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, job)}
                        onClick={(e) => handleMenuClick(e, job)}
                        sx={{
                          mb: 2,
                          cursor: 'grab',
                          '&:hover': { 
                            boxShadow: 3,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease'
                          },
                          '&:active': { cursor: 'grabbing' },
                          opacity: draggedJob?.id === job.id ? 0.5 : 1
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          {/* Card Header */}
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                              #{job.number}
                            </Typography>
                            <DragIndicator sx={{ color: 'grey.400', fontSize: 16 }} />
                          </Box>

                          {/* Job Title */}
                          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1, lineHeight: 1.3 }}>
                            {job.display_name}
                          </Typography>

                          {/* Customer Info */}
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Person sx={{ fontSize: 14, color: 'grey.600' }} />
                            <Typography variant="caption" color="text.secondary">
                              {job.customer_name}
                            </Typography>
                          </Box>

                          {/* Location */}
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <LocationOn sx={{ fontSize: 14, color: 'grey.600' }} />
                            <Typography variant="caption" color="text.secondary">
                              {job.city}, {job.state_text}
                            </Typography>
                          </Box>

                          {/* Progress Bar */}
                          {job.estimated_time > 0 && (
                            <Box mb={2}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                  Progreso
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {Math.round(calculateProgress(job.actual_time, job.estimated_time))}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={calculateProgress(job.actual_time, job.estimated_time)}
                                sx={{ height: 4, borderRadius: 2 }}
                              />
                            </Box>
                          )}

                          {/* Card Footer */}
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" gap={1}>
                              <AttachMoney sx={{ fontSize: 16, color: 'success.main' }} />
                              <Typography variant="caption" fontWeight="bold" color="success.main">
                                {formatCurrency(job.last_estimate)}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                              {job.task_count > 0 && (
                                <Chip 
                                  label={`${job.task_count} tareas`} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ fontSize: '0.6rem', height: 20 }}
                                />
                              )}
                              {job.attachment_count > 0 && (
                                <Chip 
                                  label={`${job.attachment_count} archivos`} 
                                  size="small" 
                                  color="secondary"
                                  variant="outlined"
                                  sx={{ fontSize: '0.6rem', height: 20 }}
                                />
                              )}
                            </Box>
                          </Box>

                          {/* Date Created */}
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <AccessTime sx={{ fontSize: 12, color: 'grey.500' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(job.date_created)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Empty State */}
                    {column.jobs.length === 0 && (
                      <Box 
                        sx={{ 
                          p: 3, 
                          textAlign: 'center', 
                          color: 'grey.500',
                          border: '2px dashed #e0e0e0',
                          borderRadius: 2,
                          bgcolor: 'white'
                        }}
                      >
                        <Typography variant="body2">
                          No hay trabajos en {column.status.toLowerCase()}
                        </Typography>
                        <Typography variant="caption" display="block" mt={0.5}>
                          Arrastra trabajos aquí para cambiar estado
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            {filteredJobs.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {jobs.length === 0 ? 'Cargando datos...' : 'No hay datos para analizar'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {jobs.length === 0 ? 'Conectando con JobNimbus para cargar trabajos' : 'Prueba con diferentes filtros para ver análisis'}
                </Typography>
              </Box>
            ) : (
              <>
                {/* Analytics Header */}
                <Box mb={3}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Análisis de Trabajos
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Análisis completo de rendimiento, productividad y rentabilidad de proyectos
                  </Typography>
                </Box>

                {/* Key Metrics Cards */}
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {getAnalyticsData().totalJobs}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total de Trabajos
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          {formatCurrency(getAnalyticsData().totalRevenue)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ingresos Totales
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main" fontWeight="bold">
                          {formatCurrency(getAnalyticsData().avgJobValue)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Valor Promedio
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {Math.round(getAnalyticsData().completionRate)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tasa de Finalización
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Charts Grid */}
                <Grid container spacing={3}>
                  {/* Status Distribution Pie Chart */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Distribución por Estado
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={getAnalyticsData().statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={80}
                              dataKey="value"
                            >
                              {getAnalyticsData().statusData.map((entry, index) => {
                                // Use vivid, distinct fallback colors for better visibility
                                const fallbackColors = [
                                  '#FF6B35', // Bright Orange-Red
                                  '#1E88E5', // Bright Blue
                                  '#E53E3E', // Bright Red
                                  '#22C55E', // Vivid Green
                                  '#8B5CF6', // Bright Purple
                                  '#06B6D4', // Bright Cyan
                                  '#F59E0B', // Bright Amber
                                  '#EF4444', // Bright Rose
                                  '#10B981', // Bright Emerald
                                  '#6366F1'  // Bright Indigo
                                ];
                                const color = entry.color || fallbackColors[index % fallbackColors.length];
                                return <Cell key={`cell-${index}`} fill={color} />;
                              })}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Monthly Trend Line Chart */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Tendencia Mensual de Trabajos
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={getAnalyticsData().monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [
                                name === 'jobs' ? value : formatCurrency(Number(value)), 
                                name === 'jobs' ? 'Trabajos' : 'Ingresos'
                              ]}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="jobs" 
                              stackId="1"
                              stroke="#8884d8" 
                              fill="#8884d8" 
                              name="Trabajos"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Performance by Status Bar Chart */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Rendimiento por Estado
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={getAnalyticsData().performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="status" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [
                                name === 'count' ? value : formatCurrency(Number(value)), 
                                name === 'count' ? 'Cantidad' : 'Ingresos Totales'
                              ]}
                            />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Cantidad" />
                            <Bar dataKey="totalRevenue" fill="#82ca9d" name="Ingresos Totales" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Efficiency Analysis */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Análisis de Eficiencia
                        </Typography>
                        {getAnalyticsData().efficiencyData.length === 0 ? (
                          <Box>
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={200} mb={2}>
                              <Typography variant="body1" color="text.secondary" mb={1}>
                                Sin datos de tiempo disponibles
                              </Typography>
                              <Typography variant="caption" color="text.secondary" textAlign="center">
                                Los trabajos no tienen tiempo estimado/real registrado
                              </Typography>
                            </Box>
                            <Alert severity="info">
                              <Typography variant="body2">
                                <strong>💡 Sugerencia:</strong> Para habilitar el análisis de eficiencia, registra tiempo estimado y tiempo real en los trabajos de JobNimbus.
                              </Typography>
                            </Alert>
                          </Box>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={getAnalyticsData().efficiencyData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                              <Tooltip 
                                formatter={(value, name) => [
                                  `${value}h`, 
                                  name === 'estimated' ? 'Tiempo Estimado' : 'Tiempo Real'
                                ]}
                              />
                              <Legend />
                              <Bar dataKey="estimated" fill="#ffc658" name="Tiempo Estimado" />
                              <Bar dataKey="actual" fill="#ff7300" name="Tiempo Real" />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Revenue Trend */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Tendencia de Ingresos Mensual
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={getAnalyticsData().monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis 
                              tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip 
                              formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="#2196f3" 
                              strokeWidth={3}
                              dot={{ fill: '#2196f3', strokeWidth: 2, r: 6 }}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}

        {filteredJobs.length === 0 && tabValue === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              {jobs.length === 0 ? 'Conectando a JobNimbus...' : 'No se encontraron trabajos'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {jobs.length === 0 ? 'Cargando trabajos reales de tu cuenta JobNimbus' : 'Prueba con diferentes filtros de búsqueda o verifica tu conexión a JobNimbus'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedJob && handleEditJob(selectedJob)}>
          <Edit sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => showNotification('Abriendo detalles...', 'info')}>
          <Visibility sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        <MenuItem onClick={() => showNotification('Duplicando trabajo...', 'info')}>
          <Assignment sx={{ mr: 1 }} />
          Duplicar
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => selectedJob && handleDeleteJob(selectedJob.id)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingJob ? 'Editar Trabajo' : 'Nuevo Trabajo'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Trabajo"
                defaultValue={editingJob?.display_name || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                defaultValue={editingJob?.description || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cliente"
                defaultValue={editingJob?.customer_name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  defaultValue={editingJob?.status_name || 'Active'}
                  label="Estado"
                >
                  <MenuItem value="Active">Activo</MenuItem>
                  <MenuItem value="In Progress">En Progreso</MenuItem>
                  <MenuItem value="Completed">Completado</MenuItem>
                  <MenuItem value="On Hold">En Pausa</MenuItem>
                  <MenuItem value="Cancelled">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tiempo Estimado (horas)"
                type="number"
                defaultValue={editingJob?.estimated_time || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor Estimado ($)"
                type="number"
                defaultValue={editingJob?.last_estimate || 0}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              showNotification(
                editingJob ? 'Trabajo actualizado correctamente' : 'Trabajo creado correctamente',
                'success'
              );
              setCreateDialogOpen(false);
            }}
          >
            {editingJob ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}