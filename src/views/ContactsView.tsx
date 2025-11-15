import React, { useState, useEffect } from 'react';
import { jobNimbusApi, JobNimbusLocation } from '../services/apiService';
import { useJobNimbusConnection } from '../hooks/useJobNimbusConnection';
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
  Tooltip,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  GetApp,
  Edit,
  Delete,
  Phone,
  Email,
  LocationOn,
  Person,
  Business,
  Star,
  StarBorder,
  MoreVert,
  Visibility,
  AttachMoney,
  TrendingUp,
  Group,
  Refresh
} from '@mui/icons-material';

interface ContactsViewProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  currentLocation: JobNimbusLocation;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1?: string;
  city?: string;
  state_text?: string;
  zip?: string;
  status: 'active' | 'inactive' | 'lead' | 'customer';
  date_created: string | number; // Can be Unix timestamp or ISO string
  last_activity?: string;
  tags?: string[];
  potential_value?: number;
  is_favorite?: boolean;
  // JobNimbus specific fields
  record_type_name?: string; // 'Customer', 'Subcontractor', etc.
  status_name?: string; // 'New', 'Active', etc.
  is_lead?: boolean;
  last_estimate?: number;
  mobile_phone?: string;
}

export default function ContactsView({ showNotification, currentLocation }: ContactsViewProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Hook de conexión JobNimbus
  const { isConnected, isConnecting, getStatusMessage, connect } = useJobNimbusConnection();

  // Removed mock data - prioritizing real JobNimbus data only

  const loadRealContacts = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setContacts([]);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }
      
      // Cargar solo 10 registros por página
      const result = await jobNimbusApi.getContacts(page, 10);
      
      if (append && page > 1) {
        setContacts(prev => [...prev, ...result.data]);
        setFilteredContacts(prev => [...prev, ...result.data]);
      } else {
        setContacts(result.data);
        setFilteredContacts(result.data);
      }
      
      setTotal(result.total);
      setHasMore(result.hasMore || false);
      setCurrentPage(page);
      setLoading(false);
      setLoadingMore(false);
      
      showNotification(`✅ Cargados ${result.data.length} contactos${append ? ' adicionales' : ''} (${result.total} total)`, 'success');
      
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts(page === 1 ? [] : contacts);
      setFilteredContacts(page === 1 ? [] : filteredContacts);
      setLoading(false);
      setLoadingMore(false);
      
      showNotification(`❌ ${error instanceof Error ? error.message : 'Error cargando contactos'}`, 'error');
    }
  };

  const loadMoreContacts = () => {
    loadRealContacts(currentPage + 1, true);
  };

  useEffect(() => {
    loadRealContacts();
  }, []);

  // 🏢 Efecto para sincronizar con cambios de ubicación desde App.tsx
  useEffect(() => {
    // Recargar datos cuando cambie la ubicación
    loadRealContacts();
  }, [currentLocation]);

  // Recargar cuando se restablece la conexión
  useEffect(() => {
    if (isConnected && contacts.length === 0 && !loading) {
      loadRealContacts();
    }
  }, [isConnected, contacts.length, loading]);

  useEffect(() => {
    let filtered = contacts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      );
    }

    // Apply status filter - Fixed for JobNimbus field mapping
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => {
        switch(statusFilter) {
          case 'customer':
            return contact.record_type_name === 'Customer' && contact.status_name === 'Active';
          case 'lead':
            return contact.is_lead === true || contact.status_name === 'New';
          case 'active':
            return contact.status_name === 'Active';
          case 'inactive':
            return contact.status_name !== 'Active' && contact.status_name !== 'New';
          default:
            return contact.status === statusFilter; // fallback
        }
      });
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter]);

  const getContactDisplayStatus = (contact: Contact) => {
    // Determine the best display status based on JobNimbus fields
    if (contact.record_type_name === 'Customer' && contact.status_name === 'Active') {
      return 'customer';
    } else if (contact.is_lead === true || contact.status_name === 'New') {
      return 'lead';
    } else if (contact.status_name === 'Active') {
      return 'active';
    } else {
      return 'inactive';
    }
  };

  const getStatusColor = (displayStatus: string) => {
    switch (displayStatus) {
      case 'customer': return '#2e7d32';
      case 'lead': return '#1976d2';
      case 'active': return '#ed6c02';
      case 'inactive': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusLabel = (displayStatus: string) => {
    switch (displayStatus) {
      case 'customer': return 'Cliente';
      case 'lead': return 'Prospecto';
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return displayStatus;
    }
  };

  const formatDate = (dateString: string | number) => {
    if (!dateString) return 'N/A';
    // Handle Unix timestamp (like 1755903339) vs ISO string
    const date = typeof dateString === 'number' 
      ? new Date(dateString * 1000)  // Convert Unix timestamp to Date
      : new Date(dateString);
    
    return date.toLocaleDateString('en-US', {
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, contact: Contact) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setCreateDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    showNotification('Contacto eliminado correctamente', 'success');
    handleMenuClose();
  };

  const handleToggleFavorite = (contactId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, is_favorite: !c.is_favorite } : c
    ));
    handleMenuClose();
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setCreateDialogOpen(true);
  };

  const calculateStats = () => {
    const showing = contacts.length;
    
    console.log('🔍 DEBUG: Calculating stats for contacts:', showing);
    console.log('🔍 DEBUG: First 3 contacts:', contacts.slice(0, 3).map(c => ({
      record_type_name: c.record_type_name,
      status_name: c.status_name,
      is_lead: c.is_lead
    })));
    
    // Fix: Use correct field mapping for JobNimbus data
    // Active customers: record_type_name === 'Customer' AND status_name === 'Active'
    const customers = contacts.filter(c => 
      c.record_type_name === 'Customer' && c.status_name === 'Active'
    ).length;
    
    // Leads/Prospects: is_lead === true OR status_name === 'New' (for new customers)
    const leads = contacts.filter(c => 
      c.is_lead === true || c.status_name === 'New'
    ).length;
    
    console.log('🔍 DEBUG: Calculated customers (Customer + Active):', customers);
    console.log('🔍 DEBUG: Calculated leads (is_lead=true OR status_name=New):', leads);
    
    // Calculate realistic potential value - use last_estimate or create estimated value
    let totalValue = 0;
    contacts.forEach(c => {
      if (c.potential_value && c.potential_value > 0) {
        totalValue += c.potential_value;
      } else if (c.last_estimate && c.last_estimate > 0) {
        totalValue += c.last_estimate;
      } else {
        // Assign estimated value based on contact type and status
        if (c.record_type_name === 'Customer' && c.status_name === 'Active') {
          totalValue += 15000; // Active customers estimated value
        } else if (c.status_name === 'New') {
          totalValue += 8000; // New prospects estimated value
        }
      }
    });
    
    const thisMonthContacts = contacts.filter(c => {
      if (!c.date_created) return false;
      // Handle Unix timestamp (like 1755903339) vs ISO string
      const contactDate = typeof c.date_created === 'number' 
        ? new Date(c.date_created * 1000)  // Convert Unix timestamp to Date
        : new Date(c.date_created);
      return contactDate.getMonth() === new Date().getMonth() && 
             contactDate.getFullYear() === new Date().getFullYear();
    }).length;
    
    const hasEmail = contacts.filter(c => c.email && c.email !== 'Sin email' && c.email.includes('@')).length;
    const hasPhone = contacts.filter(c => c.phone && c.phone !== 'Sin teléfono' && c.phone.length > 5).length;
    const avgValue = showing > 0 ? totalValue / showing : 0;

    console.log('🔍 DEBUG: Final stats calculation:', {
      customers,
      leads,
      totalValue,
      avgValue,
      showing
    });

    return { 
      showing, 
      total, 
      customers, 
      leads, 
      totalValue, 
      thisMonthContacts,
      hasEmail,
      hasPhone,
      avgValue
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Box p={3}>
          <Typography>Cargando contactos...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Stats */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Gestión de Contactos
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Administra tu base de clientes y prospectos
        </Typography>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                    <Group />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.showing}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mostrando ({total > stats.showing ? `${total} total` : 'todos'})
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#2e7d32', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.customers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clientes Activos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#ed6c02', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.leads}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prospectos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(stats.avgValue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Promedio
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#00695c', mr: 2 }}>
                    <Add />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.hasEmail + stats.hasPhone}/{stats.showing * 2}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Datos Completos
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
              onClick={handleCreateContact}
              disabled={!isConnected}
            >
              Nuevo Contacto
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar contactos..."
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
                <MenuItem value="customer">Clientes</MenuItem>
                <MenuItem value="lead">Prospectos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GetApp />}
              onClick={() => showNotification('Exportando contactos...', 'info')}
            >
              Exportar CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Contacts Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contacto</TableCell>
                <TableCell>Email & Teléfono</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Valor Potencial</TableCell>
                <TableCell>Última Actividad</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: getStatusColor(getContactDisplayStatus(contact)) }}>
                        {contact.first_name[0]}{contact.last_name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {contact.first_name} {contact.last_name}
                          {contact.is_favorite && (
                            <Star sx={{ ml: 1, color: '#ffa000', fontSize: 16 }} />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Cliente desde {formatDate(contact.date_created)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography variant="body2" display="flex" alignItems="center">
                        <Email sx={{ mr: 1, fontSize: 16 }} />
                        {contact.email}
                      </Typography>
                      <Typography variant="body2" display="flex" alignItems="center" mt={0.5}>
                        <Phone sx={{ mr: 1, fontSize: 16 }} />
                        {contact.phone}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" display="flex" alignItems="center">
                      <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                      {contact.city}, {contact.state_text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contact.zip}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getStatusLabel(getContactDisplayStatus(contact))}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(getContactDisplayStatus(contact))}20`,
                        color: getStatusColor(getContactDisplayStatus(contact)),
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(contact.potential_value || 0)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {contact.last_activity ? formatDate(contact.last_activity) : 'Sin actividad'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {contact.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, contact)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredContacts.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              {contacts.length === 0 ? 'Conectando a JobNimbus...' : 'No se encontraron contactos'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contacts.length === 0 ? 'Cargando datos reales de tu cuenta JobNimbus' : 'Prueba con diferentes filtros de búsqueda o verifica tu conexión a JobNimbus'}
            </Typography>
          </Box>
        )}

        {/* Load More Button */}
        {hasMore && filteredContacts.length > 0 && (
          <Box p={2} display="flex" justifyContent="center">
            <Button 
              variant="outlined" 
              onClick={loadMoreContacts}
              disabled={loadingMore}
              startIcon={loadingMore ? <CircularProgress size={20} /> : undefined}
              sx={{
                minWidth: 200,
                height: 40
              }}
            >
              {loadingMore ? 'Cargando más...' : 'Cargar más contactos'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedContact && handleEditContact(selectedContact)}>
          <Edit sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => selectedContact && handleToggleFavorite(selectedContact.id)}>
          {selectedContact?.is_favorite ? <StarBorder sx={{ mr: 1 }} /> : <Star sx={{ mr: 1 }} />}
          {selectedContact?.is_favorite ? 'Quitar de Favoritos' : 'Marcar como Favorito'}
        </MenuItem>
        <MenuItem onClick={() => showNotification('Abriendo detalles...', 'info')}>
          <Visibility sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => selectedContact && handleDeleteContact(selectedContact.id)}
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
          {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                defaultValue={editingContact?.first_name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                defaultValue={editingContact?.last_name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={editingContact?.email || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                defaultValue={editingContact?.phone || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                defaultValue={editingContact?.address_line1 || ''}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ciudad"
                defaultValue={editingContact?.city || ''}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Provincia"
                defaultValue={editingContact?.state_text || ''}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Código Postal"
                defaultValue={editingContact?.zip || ''}
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
                editingContact ? 'Contacto actualizado correctamente' : 'Contacto creado correctamente',
                'success'
              );
              setCreateDialogOpen(false);
            }}
          >
            {editingContact ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}