import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdvancedFilters, { FilterOptions } from '../../components/AdvancedFilters';

// Mock Material-UI DatePicker
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, value, onChange, renderInput }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value ? new Date(e.target.value) : null;
      onChange(date);
    };
    
    return (
      <input
        data-testid={`datepicker-${label.toLowerCase()}`}
        type="date"
        value={value ? value.toISOString().split('T')[0] : ''}
        onChange={handleChange}
        placeholder={label}
      />
    );
  }
}));

jest.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  AdapterDateFns: jest.fn()
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('AdvancedFilters Component', () => {
  const mockFilters: FilterOptions = {
    dateRange: { start: null, end: null },
    status: [],
    priority: [],
    assignedTo: [],
    tags: [],
    amountRange: [0, 100000],
    showCompleted: true,
    customFilters: {}
  };

  const mockUsers = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
    { id: '3', name: 'Carlos López' }
  ];

  const mockTags = ['Urgente', 'Comercial', 'Residencial', 'Mantenimiento'];
  
  const mockPresets = [
    {
      name: 'Trabajos Urgentes',
      filters: {
        ...mockFilters,
        priority: ['Alta', 'Urgente'],
        status: ['Activo']
      }
    }
  ];

  const defaultProps = {
    filters: mockFilters,
    onFiltersChange: jest.fn(),
    availableUsers: mockUsers,
    availableTags: mockTags,
    onSavePreset: jest.fn(),
    onLoadPreset: jest.fn(),
    savedPresets: mockPresets
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders advanced filters component', () => {
    render(<AdvancedFilters {...defaultProps} />);
    
    expect(screen.getByText('Filtros Avanzados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument();
  });

  test('shows active filters count', () => {
    const filtersWithData: FilterOptions = {
      ...mockFilters,
      status: ['Activo'],
      priority: ['Alta']
    };

    render(<AdvancedFilters {...defaultProps} filters={filtersWithData} />);
    
    expect(screen.getByText('2 activos')).toBeInTheDocument();
  });

  test('expands and collapses filter options', async () => {
    const user = userEvent.setup();
    render(<AdvancedFilters {...defaultProps} />);
    
    // Initially collapsed
    expect(screen.queryByText('Rango de Fechas')).not.toBeInTheDocument();
    
    // Click expand button
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rango de Fechas')).toBeInTheDocument();
    });
  });

  test('handles date range selection', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    
    render(<AdvancedFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    // Expand filters
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rango de Fechas')).toBeInTheDocument();
    });

    // Select start date
    const startDateInput = screen.getByTestId('datepicker-desde');
    await user.type(startDateInput, '2024-01-01');
    
    await waitFor(() => {
      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({
            start: expect.any(Date)
          })
        })
      );
    });
  });

  test('handles status filter selection', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    
    render(<AdvancedFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    // Expand filters
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Estado')).toBeInTheDocument();
    });

    // Click on status select
    const statusSelect = screen.getByLabelText('Estado');
    fireEvent.mouseDown(statusSelect);
    
    // Select an option
    const activeOption = screen.getByText('Activo');
    await user.click(activeOption);
    
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ['Activo']
      })
    );
  });

  test('handles priority filter selection', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    
    render(<AdvancedFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    // Expand filters
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Prioridad')).toBeInTheDocument();
    });

    // Click on priority select
    const prioritySelect = screen.getByLabelText('Prioridad');
    fireEvent.mouseDown(prioritySelect);
    
    // Select an option
    const highOption = screen.getByText('Alta');
    await user.click(highOption);
    
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        priority: ['Alta']
      })
    );
  });

  test('handles assigned user filter selection', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    
    render(<AdvancedFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    // Expand filters
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Asignado a')).toBeInTheDocument();
    });

    // Click on assigned select
    const assignedSelect = screen.getByLabelText('Asignado a');
    fireEvent.mouseDown(assignedSelect);
    
    // Select a user
    const userOption = screen.getByText('Juan Pérez');
    await user.click(userOption);
    
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        assignedTo: ['1']
      })
    );
  });

  test('handles show completed toggle', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    
    render(<AdvancedFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    // Expand filters
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      const toggle = screen.getByLabelText('Mostrar elementos completados');
      expect(toggle).toBeInTheDocument();
    });

    // Toggle the switch
    const toggle = screen.getByLabelText('Mostrar elementos completados');
    await user.click(toggle);
    
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        showCompleted: false
      })
    );
  });

  test('clears all filters', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    
    const filtersWithData: FilterOptions = {
      ...mockFilters,
      status: ['Activo'],
      priority: ['Alta']
    };
    
    render(<AdvancedFilters {...defaultProps} filters={filtersWithData} onFiltersChange={onFiltersChange} />);
    
    // Click clear button
    const clearButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(clearButton);
    
    expect(onFiltersChange).toHaveBeenCalledWith({
      dateRange: { start: null, end: null },
      status: [],
      priority: [],
      assignedTo: [],
      tags: [],
      amountRange: [0, 100000],
      showCompleted: true,
      customFilters: {}
    });
  });

  test('saves filter preset', async () => {
    const user = userEvent.setup();
    const onSavePreset = jest.fn();
    
    render(<AdvancedFilters {...defaultProps} onSavePreset={onSavePreset} />);
    
    // Expand filters
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Presets')).toBeInTheDocument();
    });

    // Enter preset name
    const presetNameInput = screen.getByPlaceholderText('Nombre del preset');
    await user.type(presetNameInput, 'Mi Preset');
    
    // Click save button
    const saveButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveButton);
    
    expect(onSavePreset).toHaveBeenCalledWith('Mi Preset', mockFilters);
  });

  test('loads filter preset', async () => {
    const user = userEvent.setup();
    const onLoadPreset = jest.fn();
    
    render(<AdvancedFilters {...defaultProps} onLoadPreset={onLoadPreset} />);
    
    // Expand filters
    const expandButton = screen.getByRole('button');
    await user.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Trabajos Urgentes')).toBeInTheDocument();
    });

    // Click on preset chip
    const presetChip = screen.getByText('Trabajos Urgentes');
    await user.click(presetChip);
    
    expect(onLoadPreset).toHaveBeenCalledWith(mockPresets[0].filters);
  });

  test('disables clear button when no active filters', () => {
    render(<AdvancedFilters {...defaultProps} />);
    
    const clearButton = screen.getByRole('button', { name: /limpiar/i });
    expect(clearButton).toBeDisabled();
  });

  test('enables clear button when filters are active', () => {
    const filtersWithData: FilterOptions = {
      ...mockFilters,
      status: ['Activo']
    };
    
    render(<AdvancedFilters {...defaultProps} filters={filtersWithData} />);
    
    const clearButton = screen.getByRole('button', { name: /limpiar/i });
    expect(clearButton).not.toBeDisabled();
  });
});