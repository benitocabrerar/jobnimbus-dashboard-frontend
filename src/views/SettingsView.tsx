import React, { useState, useEffect } from 'react';
import { jobNimbusApi, JobNimbusLocation } from '../services/apiService';
import { useOffice } from '../contexts/OfficeContext';
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
  Paper,
  Chip,
  Avatar,
  IconButton,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tab,
  Tabs,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  Settings,
  Security,
  Notifications,
  Palette,
  Language,
  Storage,
  Api,
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  Save,
  Refresh,
  ExpandMore,
  VpnKey,
  Shield,
  DarkMode,
  LightMode,
  Brightness4,
  AccountCircle,
  Group,
  AdminPanelSettings,
  CloudSync,
  Backup,
  RestoreFromTrash,
  Update,
  BugReport,
  Help,
  Info,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
  Visibility,
  VisibilityOff,
  Upload,
  Chat,
  History,
  Download
} from '@mui/icons-material';

interface SettingsViewProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    avatar: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
    };
    autoRefresh: boolean;
    defaultView: string;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
    apiAccess: boolean;
  };
  system: {
    dataRetention: number;
    backupFrequency: string;
    syncEnabled: boolean;
    debugMode: boolean;
  };
}

export default function SettingsView({ showNotification }: SettingsViewProps) {
  const { currentOffice } = useOffice();
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: 'Administrador Sistema',
      email: 'admin@jobnimbus.com',
      phone: '+34 600 123 456',
      company: 'JobNimbus España',
      role: 'Administrador',
      avatar: ''
    },
    preferences: {
      theme: 'light',
      language: 'es',
      timezone: 'Europe/Madrid',
      notifications: {
        email: true,
        push: true,
        desktop: false
      },
      autoRefresh: true,
      defaultView: 'dashboard'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
      apiAccess: true
    },
    system: {
      dataRetention: 365,
      backupFrequency: 'daily',
      syncEnabled: true,
      debugMode: false
    }
  });

  const [tabValue, setTabValue] = useState(0);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [claudeImportOpen, setClaudeImportOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // 🏢 Efecto para sincronizar con cambios de ubicación desde App.tsx
  useEffect(() => {
    // Recargar configuración cuando cambie la ubicación
    showNotification(`⚙️ Configuración actualizada para ${currentOffice}`, 'info');
  }, [currentOffice]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (category: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        const categoryData = prev[category] as any;
        return {
          ...prev,
          [category]: {
            ...categoryData,
            [parentField]: {
              ...categoryData[parentField],
              [childField]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          [category]: {
            ...prev[category] as any,
            [field]: value
          }
        };
      }
    });
    setUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    showNotification('⚙️ Guardando configuración...', 'info');
    
    // Simular guardado
    setTimeout(() => {
      setUnsavedChanges(false);
      showNotification('✅ Configuración guardada correctamente', 'success');
    }, 1500);
  };

  const handleResetSettings = () => {
    showNotification('🔄 Restableciendo configuración por defecto...', 'warning');
    // Aquí se restablecerían los valores por defecto
    setTimeout(() => {
      showNotification('✅ Configuración restablecida', 'success');
    }, 1000);
  };

  const handleTestNotification = () => {
    showNotification('🔔 Esta es una notificación de prueba', 'info');
  };

  const handleExportSettings = () => {
    showNotification('📁 Exportando configuración...', 'info');
    // Simular exportación
    setTimeout(() => {
      showNotification('✅ Configuración exportada correctamente', 'success');
    }, 1000);
  };

  const handleClaudeImport = () => {
    setClaudeImportOpen(true);
  };

  const handleImportFromClaude = async (file: File) => {
    setIsImporting(true);
    setImportProgress(0);
    showNotification('📥 Iniciando importación desde Claude Desktop...', 'info');

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse file content
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Process Claude Desktop data
      if (data.conversations) {
        showNotification(`📊 Procesando ${data.conversations.length} conversaciones...`, 'info');
      }
      
      setImportProgress(100);
      
      setTimeout(() => {
        setIsImporting(false);
        setClaudeImportOpen(false);
        setImportProgress(0);
        showNotification('✅ Datos importados correctamente desde Claude Desktop', 'success');
      }, 500);
      
    } catch (error) {
      setImportProgress(0);
      setIsImporting(false);
      showNotification('❌ Error al importar datos desde Claude Desktop', 'error');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Configuración del Sistema
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Personaliza tu experiencia y ajusta las configuraciones del sistema
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            {unsavedChanges && (
              <Chip
                icon={<Warning />}
                label="Cambios sin guardar"
                color="warning"
                variant="outlined"
              />
            )}
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleResetSettings}
            >
              Restablecer
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveSettings}
              disabled={!unsavedChanges}
            >
              Guardar Cambios
            </Button>
          </Box>
        </Box>

        {unsavedChanges && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Tienes cambios sin guardar. No olvides guardar tu configuración antes de salir.
          </Alert>
        )}
      </Box>

      {/* Settings Tabs */}
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<Person />} label="Perfil" />
            <Tab icon={<Palette />} label="Preferencias" />
            <Tab icon={<Security />} label="Seguridad" />
            <Tab icon={<Storage />} label="Sistema" />
            <Tab icon={<Api />} label="Integraciones" />
            <Tab icon={<Chat />} label="Claude Desktop" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        {tabValue === 0 && (
          <Box p={4}>
            <Typography variant="h6" mb={3}>Información del Perfil</Typography>
            
            <Grid container spacing={3}>
              {/* Profile Picture */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto', 
                        mb: 2,
                        bgcolor: '#1976d2',
                        fontSize: '2rem'
                      }}
                    >
                      {settings.profile.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {settings.profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {settings.profile.role}
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                      Cambiar Foto
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Profile Information */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nombre Completo"
                      value={settings.profile.name}
                      onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={settings.profile.phone}
                      onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Empresa"
                      value={settings.profile.company}
                      onChange={(e) => handleSettingChange('profile', 'company', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Rol en la Empresa</InputLabel>
                      <Select
                        value={settings.profile.role}
                        label="Rol en la Empresa"
                        onChange={(e) => handleSettingChange('profile', 'role', e.target.value)}
                      >
                        <MenuItem value="Administrador">Administrador</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Técnico">Técnico</MenuItem>
                        <MenuItem value="Vendedor">Vendedor</MenuItem>
                        <MenuItem value="Asistente">Asistente</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" gap={2} mt={2}>
                      <Button
                        variant="outlined"
                        onClick={() => setChangePasswordOpen(true)}
                      >
                        Cambiar Contraseña
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => showNotification('Verificando email...', 'info')}
                      >
                        Verificar Email
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Preferences Tab */}
        {tabValue === 1 && (
          <Box p={4}>
            <Typography variant="h6" mb={3}>Preferencias de Usuario</Typography>
            
            <Grid container spacing={3}>
              {/* Theme Settings */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Tema y Apariencia</Typography>
                    
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={settings.preferences.theme}
                        onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                      >
                        <FormControlLabel
                          value="light"
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center">
                              <LightMode sx={{ mr: 1 }} />
                              Tema Claro
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="dark"
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center">
                              <DarkMode sx={{ mr: 1 }} />
                              Tema Oscuro
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="auto"
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center">
                              <Brightness4 sx={{ mr: 1 }} />
                              Automático (Sistema)
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Language and Region */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Idioma y Región</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Idioma</InputLabel>
                          <Select
                            value={settings.preferences.language}
                            label="Idioma"
                            onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                          >
                            <MenuItem value="es">Español</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="fr">Français</MenuItem>
                            <MenuItem value="pt">Português</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Zona Horaria</InputLabel>
                          <Select
                            value={settings.preferences.timezone}
                            label="Zona Horaria"
                            onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                          >
                            <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                            <MenuItem value="Europe/London">Londres (GMT+0)</MenuItem>
                            <MenuItem value="America/New_York">Nueva York (GMT-5)</MenuItem>
                            <MenuItem value="America/Los_Angeles">Los Angeles (GMT-8)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Notifications */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Notificaciones</Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Email />
                        </ListItemIcon>
                        <ListItemText
                          primary="Notificaciones por Email"
                          secondary="Recibir alertas y actualizaciones por correo electrónico"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.preferences.notifications.email}
                            onChange={(e) => handleSettingChange('preferences', 'notifications.email', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <Phone />
                        </ListItemIcon>
                        <ListItemText
                          primary="Notificaciones Push"
                          secondary="Notificaciones en tu dispositivo móvil"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.preferences.notifications.push}
                            onChange={(e) => handleSettingChange('preferences', 'notifications.push', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <Notifications />
                        </ListItemIcon>
                        <ListItemText
                          primary="Notificaciones de Escritorio"
                          secondary="Alertas en tu navegador mientras usas la aplicación"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.preferences.notifications.desktop}
                            onChange={(e) => handleSettingChange('preferences', 'notifications.desktop', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                    
                    <Box mt={2}>
                      <Button
                        variant="outlined"
                        onClick={handleTestNotification}
                      >
                        Probar Notificaciones
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Other Preferences */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Otras Preferencias</Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Actualización Automática"
                          secondary="Refrescar datos automáticamente cada 5 minutos"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.preferences.autoRefresh}
                            onChange={(e) => handleSettingChange('preferences', 'autoRefresh', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemText primary="Vista Predeterminada" />
                        <FormControl sx={{ minWidth: 200 }}>
                          <Select
                            value={settings.preferences.defaultView}
                            onChange={(e) => handleSettingChange('preferences', 'defaultView', e.target.value)}
                            size="small"
                          >
                            <MenuItem value="dashboard">Dashboard</MenuItem>
                            <MenuItem value="contacts">Contactos</MenuItem>
                            <MenuItem value="jobs">Trabajos</MenuItem>
                            <MenuItem value="tasks">Tareas</MenuItem>
                            <MenuItem value="activities">Actividades</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Security Tab */}
        {tabValue === 2 && (
          <Box p={4}>
            <Typography variant="h6" mb={3}>Configuración de Seguridad</Typography>
            
            <Grid container spacing={3}>
              {/* Authentication */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Autenticación</Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Shield />
                        </ListItemIcon>
                        <ListItemText
                          primary="Autenticación de Dos Factores (2FA)"
                          secondary="Añade una capa extra de seguridad a tu cuenta"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <Security />
                        </ListItemIcon>
                        <ListItemText
                          primary="Alertas de Inicio de Sesión"
                          secondary="Notificar sobre nuevos inicios de sesión"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.security.loginAlerts}
                            onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>

                    <Box mt={2}>
                      <Typography variant="body2" gutterBottom>
                        Tiempo de espera de sesión: {settings.security.sessionTimeout} minutos
                      </Typography>
                      <Slider
                        value={settings.security.sessionTimeout}
                        onChange={(e, value) => handleSettingChange('security', 'sessionTimeout', value)}
                        min={15}
                        max={120}
                        step={15}
                        marks={[
                          { value: 15, label: '15min' },
                          { value: 30, label: '30min' },
                          { value: 60, label: '1h' },
                          { value: 120, label: '2h' }
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* API Access */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Acceso API</Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Acceso a API habilitado"
                          secondary="Permite integraciones de terceros"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.security.apiAccess}
                            onChange={(e) => handleSettingChange('security', 'apiAccess', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>

                    {settings.security.apiAccess && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Clave API de JobNimbus
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TextField
                            fullWidth
                            type={showApiKey ? 'text' : 'password'}
                            value="meaxpvmlzqu0g3il"
                            InputProps={{
                              readOnly: true,
                            }}
                            size="small"
                          />
                          <IconButton
                            onClick={() => setShowApiKey(!showApiKey)}
                            size="small"
                          >
                            {showApiKey ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Esta clave se utiliza para conectar con JobNimbus API
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Security Status */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Estado de Seguridad</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <CheckCircle sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
                          <Typography variant="h6">Contraseña</Typography>
                          <Typography variant="body2" color="success.main">Segura</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <Warning sx={{ fontSize: 48, color: '#ed6c02', mb: 1 }} />
                          <Typography variant="h6">2FA</Typography>
                          <Typography variant="body2" color="warning.main">
                            {settings.security.twoFactorAuth ? 'Habilitado' : 'Deshabilitado'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <CheckCircle sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
                          <Typography variant="h6">Conexión</Typography>
                          <Typography variant="body2" color="success.main">Cifrada</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <Info sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                          <Typography variant="h6">Último acceso</Typography>
                          <Typography variant="body2" color="info.main">Hoy 09:30</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* System Tab */}
        {tabValue === 3 && (
          <Box p={4}>
            <Typography variant="h6" mb={3}>Configuración del Sistema</Typography>
            
            <Grid container spacing={3}>
              {/* Data Management */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Gestión de Datos</Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Storage />
                        </ListItemIcon>
                        <ListItemText
                          primary="Sincronización Automática"
                          secondary="Sincronizar datos con JobNimbus automáticamente"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.system.syncEnabled}
                            onChange={(e) => handleSettingChange('system', 'syncEnabled', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <BugReport />
                        </ListItemIcon>
                        <ListItemText
                          primary="Modo de Depuración"
                          secondary="Habilitar logging detallado para resolución de problemas"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.system.debugMode}
                            onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>

                    <Box mt={2}>
                      <Typography variant="body2" gutterBottom>
                        Retención de datos: {settings.system.dataRetention} días
                      </Typography>
                      <Slider
                        value={settings.system.dataRetention}
                        onChange={(e, value) => handleSettingChange('system', 'dataRetention', value)}
                        min={90}
                        max={730}
                        step={30}
                        marks={[
                          { value: 90, label: '3 meses' },
                          { value: 365, label: '1 año' },
                          { value: 730, label: '2 años' }
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box mt={2}>
                      <FormControl fullWidth>
                        <InputLabel>Frecuencia de Backup</InputLabel>
                        <Select
                          value={settings.system.backupFrequency}
                          label="Frecuencia de Backup"
                          onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                        >
                          <MenuItem value="hourly">Cada hora</MenuItem>
                          <MenuItem value="daily">Diario</MenuItem>
                          <MenuItem value="weekly">Semanal</MenuItem>
                          <MenuItem value="monthly">Mensual</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* System Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Información del Sistema</Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Info />
                        </ListItemIcon>
                        <ListItemText
                          primary="Versión de la Aplicación"
                          secondary="v1.0.0 - Build 2025.01.14"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <Api />
                        </ListItemIcon>
                        <ListItemText
                          primary="API de JobNimbus"
                          secondary="Conectado - Versión 1.0"
                        />
                        <ListItemSecondaryAction>
                          <Chip label="Activo" color="success" size="small" />
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <CloudSync />
                        </ListItemIcon>
                        <ListItemText
                          primary="Estado de Sincronización"
                          secondary="Última sync: Hoy 09:45"
                        />
                        <ListItemSecondaryAction>
                          <Chip label="Sincronizado" color="success" size="small" />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Update />}
                        onClick={() => showNotification('Buscando actualizaciones...', 'info')}
                      >
                        Buscar Actualizaciones
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Backup />}
                        onClick={() => showNotification('Iniciando backup manual...', 'info')}
                      >
                        Backup Manual
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Maintenance */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Mantenimiento</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Refresh />}
                          onClick={() => showNotification('Limpiando caché...', 'info')}
                        >
                          Limpiar Caché
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<RestoreFromTrash />}
                          onClick={() => showNotification('Limpiando datos temporales...', 'info')}
                        >
                          Limpiar Datos Temp
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<CloudSync />}
                          onClick={() => showNotification('Sincronizando con JobNimbus...', 'info')}
                        >
                          Forzar Sync
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<BugReport />}
                          onClick={handleExportSettings}
                        >
                          Exportar Logs
                        </Button>
                      </Grid>
                    </Grid>

                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Las operaciones de mantenimiento pueden afectar temporalmente el rendimiento del sistema.
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Integrations Tab */}
        {tabValue === 4 && (
          <Box p={4}>
            <Typography variant="h6" mb={3}>Integraciones y Conexiones</Typography>
            
            <Grid container spacing={3}>
              {/* JobNimbus Integration */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                        <Api />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">JobNimbus API - {currentOffice.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Conexión a {currentOffice.location} ({currentOffice.description})
                        </Typography>
                      </Box>
                      <Box ml="auto">
                        <Chip label="Conectado" color="success" />
                      </Box>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={`API Key - ${currentOffice.name}`}
                          type={showApiKey ? 'text' : 'password'}
                          value={currentOffice.apiKey}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <IconButton
                                onClick={() => setShowApiKey(!showApiKey)}
                                size="small"
                              >
                                {showApiKey ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            )
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderColor: currentOffice.color } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Endpoint"
                          value="https://app.jobnimbus.com/api1"
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                    
                    <Box mt={2} display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={() => showNotification('Probando conexión...', 'info')}
                      >
                        Probar Conexión
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => showNotification('Sincronizando datos...', 'info')}
                      >
                        Sincronizar Ahora
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Available Integrations */}
              <Grid item xs={12}>
                <Typography variant="h6" mb={2}>Integraciones Disponibles</Typography>
                
                <Grid container spacing={2}>
                  {[
                    { name: 'Google Calendar', icon: '📅', status: 'available', description: 'Sincroniza citas y eventos' },
                    { name: 'Slack', icon: '💬', status: 'available', description: 'Notificaciones de equipo' },
                    { name: 'Zapier', icon: '⚡', status: 'available', description: 'Automatizaciones avanzadas' },
                    { name: 'QuickBooks', icon: '💰', status: 'available', description: 'Gestión financiera' },
                    { name: 'Dropbox', icon: '📁', status: 'available', description: 'Almacenamiento de archivos' },
                    { name: 'Mailchimp', icon: '📧', status: 'available', description: 'Marketing por email' }
                  ].map((integration, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Typography variant="h4" mr={1}>{integration.icon}</Typography>
                            <Typography variant="h6">{integration.name}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            {integration.description}
                          </Typography>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => showNotification(`Configurando integración con ${integration.name}...`, 'info')}
                          >
                            Conectar
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Claude Desktop Tab */}
        {tabValue === 5 && (
          <Box p={4}>
            <Typography variant="h6" mb={3}>Importar desde Claude Desktop</Typography>
            
            <Grid container spacing={3}>
              {/* Claude Desktop Integration */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={3}>
                      <Avatar sx={{ bgcolor: '#ff6b35', mr: 2 }}>
                        <Chat />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">Claude Desktop</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Importa conversaciones, configuraciones y datos desde Claude Desktop
                        </Typography>
                      </Box>
                    </Box>

                    <Alert severity="info" sx={{ mb: 3 }}>
                      Puedes importar tus datos de Claude Desktop para mantener el historial de conversaciones 
                      y configuraciones en tu dashboard de JobNimbus.
                    </Alert>

                    <Grid container spacing={3}>
                      {/* Import Options */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" mb={2}>Opciones de Importación</Typography>
                        
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Historial de conversaciones"
                          />
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Configuraciones de chat"
                          />
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Proyectos guardados"
                          />
                          <FormControlLabel
                            control={<Checkbox />}
                            label="Preferencias de usuario"
                          />
                        </FormGroup>

                        <Box mt={3}>
                          <Button
                            variant="contained"
                            startIcon={<Upload />}
                            onClick={handleClaudeImport}
                            disabled={isImporting}
                          >
                            {isImporting ? 'Importando...' : 'Seleccionar Archivo'}
                          </Button>
                        </Box>
                      </Grid>

                      {/* Import Statistics */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" mb={2}>Estadísticas de Importación</Typography>
                        
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <History />
                            </ListItemIcon>
                            <ListItemText
                              primary="Conversaciones"
                              secondary="0 importadas"
                            />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <Settings />
                            </ListItemIcon>
                            <ListItemText
                              primary="Configuraciones"
                              secondary="0 importadas"
                            />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <Storage />
                            </ListItemIcon>
                            <ListItemText
                              primary="Tamaño de datos"
                              secondary="0 MB importados"
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Export to Claude Desktop */}
                    <Typography variant="h6" mb={2}>Exportar a Claude Desktop</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      También puedes exportar tus datos actuales de JobNimbus para usarlos en Claude Desktop.
                    </Typography>
                    
                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => showNotification('Exportando datos para Claude Desktop...', 'info')}
                      >
                        Exportar Conversaciones
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => showNotification('Exportando configuración para Claude Desktop...', 'info')}
                      >
                        Exportar Configuración
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Help and Documentation */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>Ayuda y Documentación</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <Help sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                          <Typography variant="h6" gutterBottom>¿Cómo importar?</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Guía paso a paso para importar desde Claude Desktop
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <Info sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                          <Typography variant="h6" gutterBottom>Formatos</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Formatos de archivo soportados: JSON, CSV, TXT
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <Shield sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
                          <Typography variant="h6" gutterBottom>Privacidad</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tus datos se procesan de forma segura y privada
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box textAlign="center" p={2}>
                          <Backup sx={{ fontSize: 48, color: '#ed6c02', mb: 1 }} />
                          <Typography variant="h6" gutterBottom>Respaldo</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Se crean copias de seguridad automáticas
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña Actual"
                type="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nueva Contraseña"
                type="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                type="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              showNotification('Contraseña actualizada correctamente', 'success');
              setChangePasswordOpen(false);
            }}
          >
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Claude Import Dialog */}
      <Dialog
        open={claudeImportOpen}
        onClose={() => !isImporting && setClaudeImportOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Chat sx={{ mr: 2, color: '#ff6b35' }} />
            Importar desde Claude Desktop
          </Box>
        </DialogTitle>
        <DialogContent>
          {!isImporting ? (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Selecciona un archivo de exportación de Claude Desktop (formato JSON) para importar 
                tus conversaciones y configuraciones.
              </Alert>
              
              <Box
                sx={{
                  border: '2px dashed #1976d2',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json,.csv,.txt';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      handleImportFromClaude(file);
                    }
                  };
                  input.click();
                }}
              >
                <Upload sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Formatos soportados: JSON, CSV, TXT (máx. 10MB)
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  ¿Dónde encontrar tu archivo de exportación?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. Abre Claude Desktop<br/>
                  2. Ve a Configuración → Exportar Datos<br/>
                  3. Selecciona el formato JSON<br/>
                  4. Descarga el archivo y selecciónalo aquí
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Box flexGrow={1}>
                  <Typography variant="h6" gutterBottom>
                    Importando datos...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Procesando archivo de Claude Desktop
                  </Typography>
                </Box>
                <CircularProgress />
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={importProgress} 
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                Progreso: {importProgress}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setClaudeImportOpen(false)}
            disabled={isImporting}
          >
            {isImporting ? 'Importando...' : 'Cancelar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}