import React, { useState } from 'react';
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
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Task as TaskIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' }
  }
});

const drawerWidth = 280;

const navigationItems = [
  { path: '/', label: 'Dashboard Principal', icon: <DashboardIcon /> },
  { path: '/contacts', label: 'Contactos', icon: <PeopleIcon /> },
  { path: '/jobs', label: 'Trabajos', icon: <WorkIcon /> },
  { path: '/tasks', label: 'Tareas', icon: <TaskIcon /> },
];

export default function SimpleApp() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          JobNimbus Simple
        </Typography>
      </Toolbar>
      
      <List sx={{ px: 1, pt: 2 }}>
        {navigationItems.map((item, index) => (
          <ListItem key={index} sx={{ mb: 1, borderRadius: 2 }}>
            <ListItemIcon sx={{ color: '#1976d2' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              🔧 Simple App Test - Sidebar Debug
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { width: drawerWidth }
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                width: drawerWidth,
                background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
                color: 'white'
              }
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
            p: 3
          }}
        >
          <Toolbar />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              ✅ Simple App Test
            </Typography>
            
            <Typography variant="body1" paragraph>
              Esta es una versión simplificada de la aplicación para probar el sidebar.
            </Typography>
            
            <Typography variant="body1" paragraph>
              <strong>Si puedes ver el sidebar a la izquierda:</strong> Material-UI está funcionando.
            </Typography>
            
            <Typography variant="body1" paragraph>
              <strong>Si no puedes ver el sidebar:</strong> Hay un problema fundamental con Material-UI o React.
            </Typography>

            <Box sx={{ mt: 3, p: 2, background: 'rgba(25, 118, 210, 0.1)', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                🔍 Debug Info:
              </Typography>
              <Typography variant="body2">
                • Material-UI Theme: ✅ Loaded<br/>
                • Drawer Width: {drawerWidth}px<br/>
                • Mobile Open: {mobileOpen ? 'Yes' : 'No'}<br/>
                • Navigation Items: {navigationItems.length}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}