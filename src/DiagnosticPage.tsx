import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Drawer,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const drawerWidth = 280;

const DiagnosticPage: React.FC = () => {
  const navigationItems = [
    { path: '/', label: 'Dashboard Principal', description: 'Vista general de métricas y KPIs' },
    { path: '/executive', label: '👑 Executive Command Center', description: 'Vista consolidada CEO - Imperio completo' },
    { path: '/gpu', label: '🚀 RTX 5090 GPU Center', description: 'NVIDIA RTX 5090 Acceleration Dashboard' },
    { path: '/contacts', label: 'Contactos', description: 'Gestión de clientes y prospectos' },
    { path: '/jobs', label: 'Trabajos', description: 'Proyectos y trabajos activos' },
    { path: '/tasks', label: 'Tareas', description: 'Seguimiento de tareas pendientes' },
    { path: '/activities', label: 'Actividades', description: 'Registro de comunicaciones' },
    { path: '/analytics', label: 'Analytics Avanzado', description: 'Reportes y análisis profundo' },
    { path: '/exports', label: 'Exportaciones', description: 'Descarga de datos en PDF/CSV' },
    { path: '/chat', label: 'Chat MCP', description: 'Consultas inteligentes con IA' },
    { path: '/settings', label: 'Configuración', description: 'Ajustes del sistema' },
    { path: '/estimates', label: 'Estimaciones', description: 'Cotizaciones y presupuestos' },
    { path: '/billing', label: 'Centro Financiero', description: 'Dashboard de pagos y facturación' },
    { path: '/attachments', label: 'Archivos (51K+)', description: 'Archivos adjuntos corregidos' },
    { path: '/system-status', label: 'Estado del Sistema', description: 'Monitoreo de endpoints MCP' }
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          JobNimbus MCP
        </Typography>
      </Toolbar>
      
      <List sx={{ px: 1, pt: 2 }}>
        {navigationItems.map((item, index) => (
          <ListItem key={index} sx={{ mb: 1, borderRadius: 2 }}>
            <ListItemText
              primary={item.label}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ color: 'white' }}>
              🔧 Diagnostic Page - Test Sidebar
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
                color: 'white'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
            p: 3
          }}
        >
          <Toolbar />
          
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                🔧 Diagnóstico React - Sidebar Test
              </Typography>
              
              <Typography variant="body1" paragraph>
                Esta página de diagnóstico prueba si el problema está en:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText primary="✅ Material-UI Drawer component" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ React Router navigation" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ CSS/Styling issues" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ Context provider problems" />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Status:</Typography>
                <Typography color="success.main" sx={{ fontWeight: 'bold' }}>
                  ✅ Si puedes ver el sidebar a la izquierda con todas las pestañas, 
                  entonces Material-UI y React están funcionando correctamente.
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={() => window.location.href = '/#/'}
                  sx={{ mr: 2 }}
                >
                  Volver al Dashboard Principal
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.reload()}
                >
                  Recargar Página
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Router>
  );
};

export default DiagnosticPage;