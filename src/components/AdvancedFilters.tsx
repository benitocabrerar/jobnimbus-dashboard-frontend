import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Grid,
  Collapse,
  IconButton,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  Save,
  Restore
} from '@mui/icons-material';
import { es } from 'date-fns/locale';

export interface FilterOptions {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  status: string[];
  priority: string[];
  assignedTo: string[];
  tags: string[];
  amountRange: [number, number];
  showCompleted: boolean;
  customFilters: Record<string, any>;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableUsers: Array<{ id: string; name: string }>;
  availableTags: string[];
  onSavePreset: (name: string, filters: FilterOptions) => void;
  onLoadPreset: (filters: FilterOptions) => void;
  savedPresets: Array<{ name: string; filters: FilterOptions }>;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  availableUsers,
  availableTags,
  onSavePreset,
  onLoadPreset,
  savedPresets
}) => {
  const [expanded, setExpanded] = useState(false);
  const [presetName, setPresetName] = useState('');

  const updateFilters = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: { start: null, end: null },
      status: [],
      priority: [],
      assignedTo: [],
      tags: [],
      amountRange: [0, 100000],
      showCompleted: true,
      customFilters: {}
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.assignedTo.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.amountRange[0] > 0 || filters.amountRange[1] < 100000) count++;
    return count;
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <FilterList color="primary" />
            <Typography variant="h6">Filtros Avanzados</Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={`${getActiveFiltersCount()} activos`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              startIcon={<Clear />}
              onClick={clearAllFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              Limpiar
            </Button>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box mt={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <Grid container spacing={3}>
                {/* Date Range */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rango de Fechas
                  </Typography>
                  <Box display="flex" gap={2}>
                    <DatePicker
                      label="Desde"
                      value={filters.dateRange.start}
                      onChange={(date) => updateFilters('dateRange', { ...filters.dateRange, start: date })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                    <DatePicker
                      label="Hasta"
                      value={filters.dateRange.end}
                      onChange={(date) => updateFilters('dateRange', { ...filters.dateRange, end: date })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </Box>
                </Grid>

                {/* Status Filter */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select
                      multiple
                      value={filters.status}
                      onChange={(e) => updateFilters('status', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {['Activo', 'Pendiente', 'Completado', 'Cancelado'].map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Priority Filter */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      multiple
                      value={filters.priority}
                      onChange={(e) => updateFilters('priority', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {['Alta', 'Media', 'Baja', 'Urgente'].map((priority) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Assigned To Filter */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Asignado a</InputLabel>
                    <Select
                      multiple
                      value={filters.assignedTo}
                      onChange={(e) => updateFilters('assignedTo', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => {
                            const user = availableUsers.find(u => u.id === value);
                            return <Chip key={value} label={user?.name || value} size="small" />;
                          })}
                        </Box>
                      )}
                    >
                      {availableUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Amount Range */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rango de Monto: ${filters.amountRange[0].toLocaleString()} - ${filters.amountRange[1].toLocaleString()}
                  </Typography>
                  <Slider
                    value={filters.amountRange}
                    onChange={(_, newValue) => updateFilters('amountRange', newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100000}
                    step={1000}
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  />
                </Grid>

                {/* Tags Filter */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Etiquetas</InputLabel>
                    <Select
                      multiple
                      value={filters.tags}
                      onChange={(e) => updateFilters('tags', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {availableTags.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                          {tag}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Show Completed Toggle */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.showCompleted}
                        onChange={(e) => updateFilters('showCompleted', e.target.checked)}
                      />
                    }
                    label="Mostrar elementos completados"
                  />
                </Grid>

                {/* Preset Management */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Gestión de Presets
                    </Typography>
                    
                    <Box display="flex" gap={2} mb={2}>
                      <TextField
                        size="small"
                        placeholder="Nombre del preset"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        sx={{ flexGrow: 1 }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Save />}
                        onClick={() => {
                          if (presetName) {
                            onSavePreset(presetName, filters);
                            setPresetName('');
                          }
                        }}
                        disabled={!presetName}
                      >
                        Guardar
                      </Button>
                    </Box>

                    <Box display="flex" gap={1} flexWrap="wrap">
                      {savedPresets.map((preset) => (
                        <Chip
                          key={preset.name}
                          label={preset.name}
                          onClick={() => onLoadPreset(preset.filters)}
                          onDelete={() => {/* Implement delete preset */}}
                          icon={<Restore />}
                          variant="outlined"
                          size="small"
                          clickable
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
