import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Grid,
  Paper
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  SwapHoriz as SwapIcon
} from '@mui/icons-material';

interface Office {
  id: string;
  name: string;
  location: string;
  apiKey: string;
  color: string;
  description: string;
}

const offices: Office[] = [
  {
    id: 'guilford',
    name: 'Guilford Office',
    location: 'Guilford, CT',
    apiKey: 'mecyk7o9u0e7rcfj',
    color: '#2196f3',
    description: 'Oficina principal - Datos completos de operaciones'
  },
  {
    id: 'stamford', 
    name: 'Stamford Office',
    location: 'Stamford, CT',
    apiKey: 'meaxpvmlzqu0g3il',
    color: '#ff9800',
    description: 'Sucursal - Datos regionales especializados'
  }
];

interface OfficeSelectorProps {
  currentOffice: string;
  onOfficeChange: (office: Office) => void;
  showSelector?: boolean;
}

const OfficeSelector: React.FC<OfficeSelectorProps> = ({ 
  currentOffice, 
  onOfficeChange,
  showSelector = true 
}) => {
  const [selectedOffice, setSelectedOffice] = useState<Office>(
    offices.find(office => office.id === currentOffice) || offices[0]
  );

  const handleOfficeChange = (officeId: string) => {
    const office = offices.find(o => o.id === officeId);
    if (office) {
      setSelectedOffice(office);
      onOfficeChange(office);
      
      // Save to localStorage
      localStorage.setItem('selectedOffice', office.id);
    }
  };

  useEffect(() => {
    // Load from localStorage on mount
    const savedOffice = localStorage.getItem('selectedOffice');
    if (savedOffice) {
      const office = offices.find(o => o.id === savedOffice);
      if (office) {
        setSelectedOffice(office);
        onOfficeChange(office);
      }
    }
  }, [onOfficeChange]);

  if (!showSelector) {
    // Solo mostrar la oficina actual como indicador
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <BusinessIcon sx={{ color: selectedOffice.color }} />
        <Chip
          label={selectedOffice.name}
          sx={{ 
            backgroundColor: selectedOffice.color + '20',
            color: selectedOffice.color,
            fontWeight: 'bold'
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {selectedOffice.location}
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Oficina</InputLabel>
              <Select
                value={selectedOffice.id}
                label="Seleccionar Oficina"
                onChange={(e) => handleOfficeChange(e.target.value)}
                startAdornment={<BusinessIcon sx={{ mr: 1, color: selectedOffice.color }} />}
              >
                {offices.map((office) => (
                  <MenuItem key={office.id} value={office.id}>
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <BusinessIcon sx={{ color: office.color }} />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {office.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {office.location}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: selectedOffice.color + '10',
                border: `2px solid ${selectedOffice.color}30`
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocationIcon sx={{ color: selectedOffice.color }} />
                <Typography variant="h6" sx={{ color: selectedOffice.color }}>
                  {selectedOffice.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {selectedOffice.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                API: {selectedOffice.apiKey.substring(0, 8)}...
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Datos específicos por oficina:</strong> Cada oficina tiene su propio conjunto de 
            contactos, trabajos, tareas y analytics. Los datos se cargarán automáticamente según 
            la oficina seleccionada.
          </Typography>
        </Alert>

        {offices.length > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              startIcon={<SwapIcon />}
              onClick={() => {
                const nextOffice = offices.find(o => o.id !== selectedOffice.id) || offices[0];
                handleOfficeChange(nextOffice.id);
              }}
              sx={{
                borderColor: selectedOffice.color,
                color: selectedOffice.color,
                '&:hover': {
                  backgroundColor: selectedOffice.color + '10'
                }
              }}
            >
              Cambiar a {offices.find(o => o.id !== selectedOffice.id)?.name}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OfficeSelector;