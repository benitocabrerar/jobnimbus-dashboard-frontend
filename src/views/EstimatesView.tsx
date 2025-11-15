import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  GetApp as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  DateRange as DateIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { DataTable } from '../components/DataTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { jobNimbusApi, JobNimbusLocation } from '../services/apiService';

interface EstimatesViewProps {
  showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  currentLocation: JobNimbusLocation;
}

interface Estimate {
  id: string;
  jnid: string;
  number: string;
  display_name: string;
  amount: number;
  status: string;
  status_name: string;
  date_created: string;
  valid_until: string | null;
  customer: string;
  customer_name: string;
  customer_address: string;
  description: string;
  items: any[];
  tax_rate: number;
  tax_amount: number;
  discount: number;
  notes: string;
  tags: string[];
}

export default function EstimatesView({ showNotification, currentLocation }: EstimatesViewProps) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const loadEstimates = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setEstimates([]);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }
      
      // Cargar solo 10 registros por página
      const result = await jobNimbusApi.getEstimates(page, 10);
      
      // Transform API data to ensure customer information is properly mapped
      const transformedEstimates = result.data.map((estimate: any) => ({
        ...estimate,
        customer_name: estimate.customer_name || 
                      estimate.contact_name || 
                      estimate.primary?.name ||
                      estimate.related?.[0]?.name ||
                      estimate.customer_display_name ||
                      estimate.contact?.first_name && estimate.contact?.last_name 
                        ? `${estimate.contact.first_name} ${estimate.contact.last_name}` 
                        : (estimate.customer_id ? `Cliente #${estimate.customer_id}` : 'Cliente no especificado'),
        customer_address: estimate.customer_address ||
                         estimate.address ||
                         estimate.primary?.address ||
                         estimate.related?.[0]?.address ||
                         estimate.contact?.address ||
                         estimate.job_address ||
                         estimate.site_address ||
                         'Dirección no especificada',
        display_name: estimate.display_name || 
                     estimate.name || 
                     estimate.title || 
                     `Estimación #${estimate.number || estimate.id}`
      }));
      
      if (append && page > 1) {
        setEstimates(prev => [...prev, ...transformedEstimates]);
        setFilteredEstimates(prev => [...prev, ...transformedEstimates]);
      } else {
        setEstimates(transformedEstimates);
        setFilteredEstimates(transformedEstimates);
      }
      
      setTotal(result.total);
      setHasMore(result.hasMore);
      setCurrentPage(page);
      setLoading(false);
      setLoadingMore(false);
      
      showNotification(`${result.data.length} estimaciones${append ? ' adicionales' : ''} cargadas correctamente (${result.total} total)`, 'success');
    } catch (error) {
      console.error('Error loading estimates:', error);
      
      // Datos de ejemplo si falla la API
      const mockEstimates: Estimate[] = [
        {
          id: '1',
          jnid: 'est_001',
          number: '3001',
          display_name: 'Estimación - Reparación Techo Johnson',
          amount: 15750.00,
          status: 'sent',
          status_name: 'Enviada',
          date_created: '2025-01-20T10:30:00Z',
          valid_until: '2025-02-20T23:59:59Z',
          customer: 'customer_123',
          customer_name: 'Maria Johnson',
          customer_address: '123 Main Street, Springfield, IL 62701',
          description: 'Reparación completa de techo con materiales premium',
          items: [],
          tax_rate: 0.08,
          tax_amount: 1260.00,
          discount: 0,
          notes: 'Incluye garantía de 5 años',
          tags: ['techo', 'urgente']
        },
        {
          id: '2',
          jnid: 'est_002',
          number: '3002',
          display_name: 'Estimación - Instalación Solar Martinez',
          amount: 32500.00,
          status: 'approved',
          status_name: 'Aprobada',
          date_created: '2025-01-18T14:15:00Z',
          valid_until: '2025-03-18T23:59:59Z',
          customer: 'customer_456',
          customer_name: 'Carlos Martinez',
          customer_address: '456 Oak Avenue, Chicago, IL 60601',
          description: 'Sistema solar completo 15kW',
          items: [],
          tax_rate: 0.08,
          tax_amount: 2600.00,
          discount: 1500.00,
          notes: 'Descuento por pronto pago',
          tags: ['solar', 'ecológico']
        },
        {
          id: '3',
          jnid: 'est_003',
          number: '3003',
          display_name: 'Estimación - Renovación Baño Williams',
          amount: 8950.00,
          status: 'draft',
          status_name: 'Borrador',
          date_created: '2025-01-22T09:00:00Z',
          valid_until: '2025-02-22T23:59:59Z',
          customer: 'customer_789',
          customer_name: 'Jennifer Williams',
          customer_address: '789 Pine Road, Aurora, IL 60505',
          description: 'Renovación completa de baño principal',
          items: [],
          tax_rate: 0.08,
          tax_amount: 716.00,
          discount: 0,
          notes: 'Incluye accesorios premium',
          tags: ['baño', 'renovación']
        }
      ];
      
      // Usar datos mock con paginación
      const newEstimates = append ? [...estimates, ...mockEstimates] : mockEstimates;
      setEstimates(newEstimates);
      setFilteredEstimates(newEstimates);
      setTotal(mockEstimates.length);
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      
      showNotification(`${mockEstimates.length} estimaciones de ejemplo cargadas`, 'info');
    }
  };

  const loadMoreEstimates = () => {
    loadEstimates(currentPage + 1, true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterEstimates(term, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterEstimates(searchTerm, status);
  };

  const filterEstimates = (term: string, status: string) => {
    let filtered = estimates;

    if (term) {
      filtered = filtered.filter(estimate =>
        estimate.display_name.toLowerCase().includes(term.toLowerCase()) ||
        estimate.customer_name.toLowerCase().includes(term.toLowerCase()) ||
        estimate.customer_address.toLowerCase().includes(term.toLowerCase()) ||
        estimate.number.includes(term) ||
        estimate.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(estimate => estimate.status === status);
    }

    setFilteredEstimates(filtered);
  };

  const handleViewDetails = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setDetailDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string | number) => {
    const statusStr = String(status || '').toLowerCase();
    switch (statusStr) {
      case 'draft':
      case '1':
        return 'default';
      case 'sent':
      case '2':
        return 'info';
      case 'approved':
      case '3':
        return 'success';
      case 'rejected':
      case '4':
        return 'error';
      case 'expired':
      case '5':
        return 'warning';
      default: 
        return 'default';
    }
  };

  const getStatusCounts = () => {
    // Ensure estimates is always an array
    const estimatesArray = Array.isArray(estimates) ? estimates : [];
    const showing = estimatesArray.length;
    const counts = estimatesArray.reduce((acc, estimate) => {
      acc[estimate.status] = (acc[estimate.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAmount = estimatesArray
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.amount, 0);

    return { showing, total, counts, totalAmount };
  };

  const { showing, counts, totalAmount } = getStatusCounts();

  // 🏢 Efecto para sincronizar con cambios de ubicación desde App.tsx
  useEffect(() => {
    // Recargar estimaciones cuando cambie la ubicación
    loadEstimates();
    showNotification(`💰 Estimaciones recargadas para ${currentLocation}`, 'info');
  }, [currentLocation]);

  useEffect(() => {
    loadEstimates();
  }, []);

  const columns = [
    {
      key: 'number' as keyof Estimate,
      label: 'Número',
      sortable: true,
      render: (value: any, row: Estimate) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            #{row.number}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.jnid}
          </Typography>
        </Box>
      )
    },
    {
      key: 'display_name' as keyof Estimate,
      label: 'Estimación',
      sortable: true,
      render: (value: any, row: Estimate) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {row.display_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.customer_name || row.customer || 'Cliente no especificado'}
          </Typography>
        </Box>
      )
    },
    {
      key: 'customer_address' as keyof Estimate,
      label: 'Dirección del Cliente',
      sortable: false,
      render: (value: any, row: Estimate) => (
        <Box sx={{ maxWidth: 200 }}>
          <Typography variant="body2" noWrap title={row.customer_address}>
            {row.customer_address || 'Dirección no especificada'}
          </Typography>
        </Box>
      )
    },
    {
      key: 'amount' as keyof Estimate,
      label: 'Monto',
      sortable: true,
      render: (value: any, row: Estimate) => (
        <Box textAlign="right">
          <Typography variant="body2" fontWeight="bold" color="primary">
            {formatCurrency(row.amount)}
          </Typography>
          {row.tax_amount > 0 && (
            <Typography variant="caption" color="text.secondary">
              +{formatCurrency(row.tax_amount)} impuestos
            </Typography>
          )}
        </Box>
      )
    },
    {
      key: 'status' as keyof Estimate,
      label: 'Estado',
      sortable: true,
      render: (value: any, row: Estimate) => (
        <Chip
          label={row.status_name}
          color={getStatusColor(row.status) as any}
          size="small"
        />
      )
    },
    {
      key: 'date_created' as keyof Estimate,
      label: 'Fecha Creación',
      sortable: true,
      render: (value: any, row: Estimate) => (
        <Box>
          <Typography variant="body2">
            {formatDate(row.date_created)}
          </Typography>
          {row.valid_until && (
            <Typography variant="caption" color="text.secondary">
              Válida hasta: {formatDate(row.valid_until)}
            </Typography>
          )}
        </Box>
      )
    },
    {
      key: 'actions' as keyof Estimate,
      label: 'Acciones',
      sortable: false,
      render: (value: any, row: Estimate) => (
        <Box>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={() => handleViewDetails(row)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => showNotification('Función de edición próximamente', 'info')}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar PDF">
            <IconButton
              size="small"
              onClick={() => showNotification('Descarga de PDF próximamente', 'info')}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Estimaciones y Cotizaciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestión de estimaciones - {estimates.length} mostrando de {total} estimaciones
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => showNotification('Crear estimación próximamente', 'info')}
        >
          Nueva Estimación
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {showing}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mostrando ({total > showing ? `${total} total` : 'todas'})
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(totalAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Valor Aprobado
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BusinessIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {counts.sent || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DateIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {counts.approved || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aprobadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar estimaciones..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
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
                  onChange={(e) => handleStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos los estados</MenuItem>
                  <MenuItem value="draft">Borrador</MenuItem>
                  <MenuItem value="sent">Enviada</MenuItem>
                  <MenuItem value="approved">Aprobada</MenuItem>
                  <MenuItem value="rejected">Rechazada</MenuItem>
                  <MenuItem value="expired">Expirada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => showNotification('Filtros avanzados próximamente', 'info')}
              >
                Filtros Avanzados
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredEstimates.length === 0 ? (
        <Alert severity="info">
          No se encontraron estimaciones que coincidan con los criterios de búsqueda.
        </Alert>
      ) : (
        <>
          <DataTable
            data={filteredEstimates}
            columns={columns}
            title={`${filteredEstimates.length} estimaciones encontradas`}
          />
          
          {/* Load More Button */}
          {hasMore && filteredEstimates.length > 0 && (
            <Box p={2} display="flex" justifyContent="center">
              <Button 
                variant="outlined" 
                onClick={loadMoreEstimates}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : undefined}
                sx={{
                  minWidth: 200,
                  height: 40
                }}
              >
                {loadingMore ? 'Cargando más...' : 'Cargar más estimaciones'}
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles de Estimación
        </DialogTitle>
        <DialogContent>
          {selectedEstimate && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Información General
                  </Typography>
                  <Typography><strong>Número:</strong> #{selectedEstimate.number}</Typography>
                  <Typography><strong>Cliente:</strong> {selectedEstimate.customer_name}</Typography>
                  <Typography><strong>Descripción:</strong> {selectedEstimate.description}</Typography>
                  <Typography><strong>Estado:</strong> 
                    <Chip 
                      label={selectedEstimate.status_name}
                      color={getStatusColor(selectedEstimate.status) as any}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Información Financiera
                  </Typography>
                  <Typography><strong>Monto Base:</strong> {formatCurrency(selectedEstimate.amount)}</Typography>
                  <Typography><strong>Impuestos ({(selectedEstimate.tax_rate * 100).toFixed(1)}%):</strong> {formatCurrency(selectedEstimate.tax_amount)}</Typography>
                  <Typography><strong>Descuento:</strong> {formatCurrency(selectedEstimate.discount)}</Typography>
                  <Typography><strong>Total:</strong> {formatCurrency(selectedEstimate.amount + selectedEstimate.tax_amount - selectedEstimate.discount)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Fechas
                  </Typography>
                  <Typography><strong>Fecha Creación:</strong> {formatDate(selectedEstimate.date_created)}</Typography>
                  {selectedEstimate.valid_until && (
                    <Typography><strong>Válida Hasta:</strong> {formatDate(selectedEstimate.valid_until)}</Typography>
                  )}
                </Grid>
                {selectedEstimate.notes && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Notas
                    </Typography>
                    <Typography>{selectedEstimate.notes}</Typography>
                  </Grid>
                )}
                {selectedEstimate.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Etiquetas
                    </Typography>
                    <Box>
                      {selectedEstimate.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            Cerrar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={() => showNotification('Descarga de PDF próximamente', 'info')}
          >
            Descargar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}