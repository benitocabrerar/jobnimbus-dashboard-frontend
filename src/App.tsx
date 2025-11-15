import React, { useState, useEffect } from 'react';
import { OfficeProvider } from './contexts/OfficeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
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
  Divider,
  Menu,
  MenuItem,
  Avatar,
  ListItemButton
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
  Computer as GPUIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as MonthlyIcon
} from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

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
import MonthlySummaryView from './views/MonthlySummaryView';

// Import components
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { AdminPanel } from './components/admin/AdminPanel';
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
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
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
    path: '/app',
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
    path: '/monthly-summary',
    label: 'Resumen Mensual',
    icon: <MonthlyIcon />,
    description: 'Resumen financiero mensual por instancia'
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
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // Use authentication context
  const { user, logout } = useAuth();

  // 🏢 Usar el contexto de oficina
  const { currentOffice, switchOffice } = useOffice();

  const location = useLocation();
  const navigate = useNavigate();

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

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await logout();
      showNotification('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Logout failed', 'error');
    }
  };

  const getCurrentPageInfo = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem || navigationItems[0];
  };

  const drawer = (
    <Box>
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

      <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>
            🚀 PowerIA Enterprise
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mt: 0.5 }}>
            v1.0.0-fixed-complete - MCP Corregido
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
              icon={<TrendingUp />}
              label="En vivo"
              color="success"
              variant="outlined"
              size="small"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.5)',
                '& .MuiChip-icon': { color: '#4caf50' }
              }}
            />

            {/* User Menu */}
            <Tooltip title="Mi cuenta">
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 220,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {user?.name || 'Usuario'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {user?.email || ''}
          </Typography>
          <Chip
            label={user?.role || 'viewer'}
            size="small"
            color={user?.role === 'admin' ? 'error' : user?.role === 'manager' ? 'warning' : 'default'}
            sx={{ mt: 0.5, fontSize: '0.7rem', height: 20 }}
          />
        </Box>

        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>

        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        
        <Container maxWidth={false} sx={{ py: 3, px: 3 }}>
          {isLoading && <LoadingSpinner />}
          
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/app"
              element={
                <PrivateRoute>
                  <DashboardView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/executive"
              element={
                <PrivateRoute>
                  <ExecutiveView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/gpu"
              element={
                <PrivateRoute>
                  <RTX5090Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <PrivateRoute>
                  <ContactsView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <JobsView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TasksView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivitiesView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <AnalyticsView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/exports"
              element={
                <PrivateRoute>
                  <ExportsView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/estimates"
              element={
                <PrivateRoute>
                  <EstimatesView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <PrivateRoute>
                  <BillingView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/monthly-summary"
              element={
                <PrivateRoute>
                  <MonthlySummaryView />
                </PrivateRoute>
              }
            />
            <Route
              path="/attachments"
              element={
                <PrivateRoute>
                  <AttachmentsView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/system-status"
              element={
                <PrivateRoute>
                  <SystemStatusView showNotification={showNotification} />
                </PrivateRoute>
              }
            />
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
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AuthProvider>
            <OfficeProvider>
              <AppContent />
            </OfficeProvider>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}