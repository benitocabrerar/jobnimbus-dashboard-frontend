import React, { useState, useEffect } from 'react';
import { jobNimbusApi, JobNimbusLocation } from '../services/apiService';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import {
  PictureAsPdf,
  CloudDownload,
  TableChart,
  Assessment,
  People,
  Work,
  Task,
  Notes,
  Schedule,
  CheckCircle
} from '@mui/icons-material';

interface ExportsViewProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  currentLocation: JobNimbusLocation;
}

export default function ExportsView({ showNotification, currentLocation }: ExportsViewProps) {
  const [selectedDataType, setSelectedDataType] = useState('contacts');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('this_month');

  // 🏢 Efecto para sincronizar con cambios de ubicación desde App.tsx
  useEffect(() => {
    // Actualizar opciones de exportación cuando cambie la ubicación
    showNotification(`✅ Centro de exportaciones actualizado para ${currentLocation}`, 'info');
  }, [currentLocation]);

  const dataTypes = [
    { value: 'contacts', label: 'Contactos', icon: <People />, description: 'Todos los contactos y clientes' },
    { value: 'jobs', label: 'Trabajos', icon: <Work />, description: 'Proyectos y trabajos completados' },
    { value: 'tasks', label: 'Tareas', icon: <Task />, description: 'Lista de tareas pendientes y completadas' },
    { value: 'activities', label: 'Actividades', icon: <Notes />, description: 'Registro de comunicaciones y actividades' },
    { value: 'reports', label: 'Reportes', icon: <Assessment />, description: 'Reportes de rendimiento y métricas' }
  ];

  const exportFormats = [
    { value: 'pdf', label: 'PDF', icon: <PictureAsPdf />, description: 'Documento PDF profesional' },
    { value: 'csv', label: 'CSV', icon: <TableChart />, description: 'Archivo CSV para Excel' },
    { value: 'json', label: 'JSON', icon: <CloudDownload />, description: 'Datos estructurados JSON' }
  ];

  const recentExports = [
    {
      id: '1',
      name: 'Contactos_Enero_2025.pdf',
      type: 'Contactos',
      format: 'PDF',
      date: '2025-01-14T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Trabajos_Q4_2024.csv',
      type: 'Trabajos',
      format: 'CSV',
      date: '2025-01-13T15:45:00Z',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Reporte_Mensual.pdf',
      type: 'Reportes',
      format: 'PDF',
      date: '2025-01-12T09:20:00Z',
      status: 'completed'
    }
  ];

  const handleExport = () => {
    showNotification(`Iniciando exportación de ${dataTypes.find(dt => dt.value === selectedDataType)?.label} en formato ${exportFormats.find(ef => ef.value === selectedFormat)?.label}...`, 'info');
    
    // Simulate export process
    setTimeout(() => {
      showNotification('¡Exportación completada con éxito!', 'success');
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Centro de Exportaciones
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Exporta tus datos de JobNimbus en múltiples formatos
      </Typography>

      <Grid container spacing={3} mt={2}>
        {/* Export Configuration */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuración de Exportación
            </Typography>
            
            <Grid container spacing={3} mt={1}>
              {/* Data Type Selection */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Tipo de Datos
                </Typography>
                <Grid container spacing={2}>
                  {dataTypes.map((dataType) => (
                    <Grid item xs={12} sm={6} md={4} key={dataType.value}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedDataType === dataType.value ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          '&:hover': {
                            boxShadow: 3
                          }
                        }}
                        onClick={() => setSelectedDataType(dataType.value)}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={1}>
                            {dataType.icon}
                            <Typography variant="subtitle2" fontWeight="bold" ml={1}>
                              {dataType.label}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {dataType.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Format Selection */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Formato de Exportación
                </Typography>
                <Grid container spacing={2}>
                  {exportFormats.map((format) => (
                    <Grid item xs={12} sm={4} key={format.value}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedFormat === format.value ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          '&:hover': {
                            boxShadow: 3
                          }
                        }}
                        onClick={() => setSelectedFormat(format.value)}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={1}>
                            {format.icon}
                            <Typography variant="subtitle2" fontWeight="bold" ml={1}>
                              {format.label}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {format.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Rango de Fechas</InputLabel>
                  <Select
                    value={dateRange}
                    label="Rango de Fechas"
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <MenuItem value="all_time">Todo el tiempo</MenuItem>
                    <MenuItem value="this_year">Este año</MenuItem>
                    <MenuItem value="this_quarter">Este trimestre</MenuItem>
                    <MenuItem value="this_month">Este mes</MenuItem>
                    <MenuItem value="this_week">Esta semana</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Custom filename */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del archivo (opcional)"
                  placeholder="mi_exportacion_personalizada"
                  helperText="Se agregará automáticamente la fecha y extensión"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Export Summary */}
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Resumen de Exportación
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Se exportarán los datos de <strong>{dataTypes.find(dt => dt.value === selectedDataType)?.label}</strong> en formato <strong>{exportFormats.find(ef => ef.value === selectedFormat)?.label}</strong> para el período seleccionado.
              </Alert>
            </Box>

            {/* Export Button */}
            <Box textAlign="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudDownload />}
                onClick={handleExport}
                sx={{ minWidth: 200 }}
              >
                Iniciar Exportación
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Exports */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exportaciones Recientes
            </Typography>
            
            <List>
              {recentExports.map((exportItem, index) => (
                <ListItem key={exportItem.id} divider={index < recentExports.length - 1}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {exportItem.name}
                        </Typography>
                        <Box display="flex" gap={1} mt={0.5}>
                          <Chip 
                            label={exportItem.type} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={exportItem.format} 
                            size="small" 
                            color="primary"
                          />
                        </Box>
                      </Box>
                    }
                    secondary={formatDate(exportItem.date)}
                  />
                  <Button size="small" variant="outlined">
                    Descargar
                  </Button>
                </ListItem>
              ))}
            </List>

            <Box mt={2}>
              <Alert severity="success">
                <Typography variant="body2">
                  Todas las exportaciones se mantienen disponibles por 30 días
                </Typography>
              </Alert>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}