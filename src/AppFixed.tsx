import React, { useState, useEffect } from 'react';
import { OfficeProvider } from './contexts/OfficeContext';
// import { CacheProvider } from './contexts/CacheContext'; // Not needed for now
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Badge,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Task as TaskIcon,
  Notes as NotesIcon,
  BarChart as BarChartIcon,
  GetApp as ExportIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  TrendingUp,
  Group,
  Assignment,
  AttachMoney,
  Timeline,
  PictureAsPdf,
  CloudDownload,
  Menu as MenuIcon,
  SystemUpdate as SystemIcon,
  AttachFile as AttachFileIcon,
  Receipt as EstimateIcon,
  Business as BusinessIcon,
  LocationCity as LocationCityIcon,
  AccountBalance as ExecutiveIcon,
  Computer as GPUIcon
} from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Import views
import DashboardView from './views/DashboardView';
import ContactsView from './views/ContactsView';
import JobsView from './views/JobsView';
import TasksView from './views/TasksView';
import ActivitiesView from './views/ActivitiesView';
import AnalyticsView from './views/AnalyticsView';
import ExportsView from './views/ExportsView';
import ChatView from './views/ChatView';
import SettingsView from './views/SettingsView';
import SystemStatusView from './views/SystemStatusView';
import EstimatesView from './views/EstimatesView';
import AttachmentsView from './views/AttachmentsView';
import ExecutiveView from './views/ExecutiveView';
import RTX5090Dashboard from './views/RTX5090Dashboard';
import BillingView from './views/BillingView';

// Import components
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useOffice } from './contexts/OfficeContext';
import { jobNimbusApi, type JobNimbusLocation, type LocationInfo } from './services/apiService';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
  },
});

const drawerWidth = 280;

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactElement;
  badge?: number;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Dashboard Principal',
    icon: <DashboardIcon />,
    description: 'Vista general de métricas y KPIs'
  },
  {
    path: '/executive',
    label: '👑 Executive Command Center',
    icon: <ExecutiveIcon />,
    description: 'Vista consolidada CEO - Imperio completo'
  },
  {
    path: '/gpu',
    label: '🚀 RTX 5090 GPU Center',
    icon: <GPUIcon />,
    description: 'NVIDIA RTX 5090 Acceleration Dashboard'
  },
  {
    path: '/contacts',
    label: 'Contactos',
    icon: <PeopleIcon />,
    description: 'Gestión de clientes y prospectos'
  },
  {
    path: '/jobs',
    label: 'Trabajos',
    icon: <WorkIcon />,
    description: 'Proyectos y trabajos activos'
  },
  {
    path: '/tasks',
    label: 'Tareas',
    icon: <TaskIcon />,
    description: 'Seguimiento de tareas pendientes'
  },
  {
    path: '/activities',
    label: 'Actividades',
    icon: <NotesIcon />,
    description: 'Registro de comunicaciones'
  },
  {
    path: '/analytics',
    label: 'Analytics Avanzado',
    icon: <BarChartIcon />,
    description: 'Reportes y análisis profundo'
  },
  {
    path: '/exports',
    label: 'Exportaciones',
    icon: <ExportIcon />,
    description: 'Descarga de datos en PDF/CSV'
  },
  {
    path: '/chat',
    label: 'Chat MCP',
    icon: <ChatIcon />,
    description: 'Consultas inteligentes con IA'
  },
  {
    path: '/settings',
    label: 'Configuración',
    icon: <SettingsIcon />,
    description: 'Ajustes del sistema'
  },
  {
    path: '/estimates',
    label: 'Estimaciones',
    icon: <EstimateIcon />,
    description: 'Cotizaciones y presupuestos'
  },
  {
    path: '/billing',
    label: 'Centro Financiero',
    icon: <AttachMoney />,
    description: 'Dashboard de pagos y facturación'
  },
  {
    path: '/attachments',
    label: 'Archivos (51K+)',
    icon: <AttachFileIcon />,
    description: 'Archivos adjuntos corregidos'
  },
  {
    path: '/system-status',
    label: 'Estado del Sistema',
    icon: <SystemIcon />,
    description: 'Monitoreo de endpoints MCP'
  }
];

function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Removed global loading state - each component handles its own loading now
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // 🏢 Usar el contexto de oficina
  const { currentOffice, switchOffice } = useOffice();
  
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // 🏢 Función para cambiar oficina usando el contexto
  const handleOfficeChange = (officeId: string) => {
    switchOffice(officeId);
    
    showNotification(
      `🏢 Cambiado a ${currentOffice.name} - Los datos se actualizarán automáticamente`, 
      'info'
    );
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getCurrentPageInfo = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem || navigationItems[0];
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Custom CSS-based Sidebar - Fixed Version */}
      <Box
        component="nav"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: mobileOpen ? 0 : { xs: -drawerWidth, sm: 0 },
          height: '100vh',
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          zIndex: 1200,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          display: { xs: mobileOpen ? 'block' : 'none', sm: 'block' }
        }}
      >
        <Toolbar sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box display="flex" alignItems="center" width="100%">
            <WorkIcon sx={{ mr: 1, fontSize: 32, color: '#fff' }} />
            <Box>
              <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#fff' }}>
                JobNimbus MCP
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Dashboard Gerencial
              </Typography>
            </Box>
          </Box>
        </Toolbar>
        
        <List sx={{ px: 1, pt: 2 }}>
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: 1,
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease',
                },
                ...(location.pathname === item.path && {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderLeft: '4px solid #fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                    color: '#fff',
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 40 }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={
                  <Typography
                    variant="caption"
                    sx={{ 
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.7rem',
                      lineHeight: 1.2,
                      mt: 0.5,
                      display: 'block'
                    }}
                  >
                    {item.description}
                  </Typography>
                }
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>

      </Box>

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          boxShadow: '0 2px 20px rgba(25,118,210,0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box>
              <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
                {getCurrentPageInfo().label}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {getCurrentPageInfo().description}
              </Typography>
            </Box>
          </Box>

          {/* 🏢 Selector de Ubicación JobNimbus - Posición Premium en Header */}
          <Box display="flex" alignItems="center" gap={2} sx={{ mr: 2 }}>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 40 }} />
            
            <Box display="flex" alignItems="center" gap={1}>
              <BusinessIcon sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                Ubicación:
              </Typography>
            </Box>
            
            <ToggleButtonGroup
              value={currentOffice.id}
              exclusive
              onChange={(_, newOfficeId) => newOfficeId && handleOfficeChange(newOfficeId)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.9)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  px: 1.5,
                  py: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  },
                },
              }}
            >
              {[
                { id: 'guilford', name: 'Guilford', icon: '🏛️' },
                { id: 'stamford', name: 'Stamford', icon: '🏢' }
              ].map((office) => (
                <ToggleButton key={office.id} value={office.id}>
                  <Badge
                    color={currentOffice.id === office.id ? 'success' : 'default'}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: currentOffice.id === office.id ? '#4caf50' : 'transparent',
                        width: 8,
                        height: 8,
                        minWidth: 8,
                        borderRadius: '50%',
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="inherit" sx={{ fontSize: 16 }}>
                        {office.icon}
                      </Typography>
                      <Typography variant="inherit">
                        {office.name}
                      </Typography>
                    </Box>
                  </Badge>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 40 }} />
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Actualizar datos">
              <IconButton 
                color="inherit" 
                onClick={() => window.location.reload()}
                sx={{ '&:hover': { transform: 'rotate(180deg)', transition: 'transform 0.3s' } }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Chip
              icon={<span style={{ fontSize: '12px' }}>🚀</span>}
              label="PowerIA Enterprise"
              color="success"
              variant="outlined"
              size="small"
              sx={{ 
                color: '#fff', 
                borderColor: 'rgba(255,255,255,0.5)',
                '& .MuiChip-icon': { color: '#4caf50' },
                fontSize: '0.7rem'
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        
        <Container 
          maxWidth={false} 
          sx={{ 
            py: 3, 
            px: 3, 
            minHeight: 'calc(100vh - 140px)',
            height: 'calc(100vh - 140px)', // Fixed height prevents resizing
            position: 'relative',
            overflow: 'auto' // Enable scrolling inside container
          }}
        >          
          <Routes>
            <Route path="/" element={<DashboardView showNotification={showNotification} />} />
            <Route path="/executive" element={<ExecutiveView showNotification={showNotification} />} />
            <Route path="/gpu" element={<RTX5090Dashboard />} />
            <Route path="/contacts" element={<ContactsView showNotification={showNotification} />} />
            <Route path="/jobs" element={<JobsView showNotification={showNotification} />} />
            <Route path="/tasks" element={<TasksView showNotification={showNotification} />} />
            <Route path="/activities" element={<ActivitiesView showNotification={showNotification} />} />
            <Route path="/analytics" element={<AnalyticsView showNotification={showNotification} />} />
            <Route path="/exports" element={<ExportsView showNotification={showNotification} />} />
            <Route path="/chat" element={<ChatView showNotification={showNotification} />} />
            <Route path="/settings" element={<SettingsView showNotification={showNotification} />} />
            <Route path="/estimates" element={<EstimatesView showNotification={showNotification} />} />
            <Route path="/billing" element={<BillingView showNotification={showNotification} />} />
            <Route path="/attachments" element={<AttachmentsView showNotification={showNotification} />} />
            <Route path="/system-status" element={<SystemStatusView showNotification={showNotification} />} />
          </Routes>
        </Container>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1199,
            display: { sm: 'none' }
          }}
          onClick={handleDrawerToggle}
        />
      )}
    </Box>
  );
}

export default function AppFixed() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <OfficeProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <AppContent />
          </Router>
        </OfficeProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}