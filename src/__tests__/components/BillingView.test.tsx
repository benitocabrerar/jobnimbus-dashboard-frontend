import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import BillingView from '../../views/BillingView';
import { OfficeProvider } from '../../contexts/OfficeContext';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  jobNimbusApi: {
    getEstimates: jest.fn(),
    getJobs: jest.fn(),
  },
}));

// Mock fetch for payments
global.fetch = jest.fn();

const theme = createTheme();

// Mock data
const mockEstimates = {
  data: [
    {
      jnid: 'EST001',
      amount: 15000,
      status_name: 'Sent',
      date_estimate: Date.now() / 1000,
      description: 'Test Estimate 1',
    },
    {
      jnid: 'EST002',
      amount: 25000,
      status_name: 'Approved',
      date_estimate: Date.now() / 1000,
      description: 'Test Estimate 2',
    }
  ]
};

const mockJobs = {
  data: [
    {
      jnid: 'JOB001',
      status: 'sold',
      display_name: 'Roof Repair Project',
      date_created: new Date().toISOString(),
      description: 'Complete roof repair',
      primary_contact: {
        jnid: 'CONT001',
        display_name: 'John Smith',
        phone: '+1 (555) 123-4567',
        email: 'john@example.com'
      },
      address: {
        line1: '123 Main St',
        city: 'Stamford',
        state_text: 'CT'
      }
    },
    {
      jnid: 'JOB002',
      status: 'complete',
      display_name: 'Kitchen Renovation',
      date_created: new Date().toISOString(),
      description: 'Full kitchen remodel',
      primary_contact: {
        jnid: 'CONT002',
        display_name: 'Jane Doe',
        phone: '+1 (555) 987-6543',
        email: 'jane@example.com'
      },
      address: {
        line1: '456 Oak Ave',
        city: 'Guilford',
        state_text: 'CT'
      }
    }
  ]
};

const mockPayments = {
  results: [
    {
      jnid: 'PAY001',
      amount: 5000,
      status: 'paid',
      job_id: 'JOB001',
      date_created: new Date().toISOString(),
      description: 'Deposit payment',
      customer_name: 'John Smith'
    },
    {
      jnid: 'PAY002',
      amount: 12000,
      status: 'pending',
      job_id: 'JOB002',
      date_created: new Date().toISOString(),
      description: 'Final payment',
      customer_name: 'Jane Doe',
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago (overdue)
    }
  ]
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <ThemeProvider theme={theme}>
      <OfficeProvider>
        {children}
      </OfficeProvider>
    </ThemeProvider>
  </MemoryRouter>
);

describe('BillingView', () => {
  const mockShowNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup API mocks
    (require('../../services/apiService').jobNimbusApi.getEstimates as jest.Mock)
      .mockResolvedValue(mockEstimates);
    (require('../../services/apiService').jobNimbusApi.getJobs as jest.Mock)
      .mockResolvedValue(mockJobs);
    (global.fetch as jest.Mock)
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPayments)
      });
  });

  it('renders the billing dashboard header', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    expect(screen.getByText('💰 Centro Financiero Ejecutivo')).toBeInTheDocument();
    expect(screen.getByText(/Dashboard Integral de Pagos y Facturación/)).toBeInTheDocument();
  });

  it('displays all billing status cards', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Contratos Firmados')).toBeInTheDocument();
      expect(screen.getByText('Depósitos Recibidos')).toBeInTheDocument();
      expect(screen.getByText('Trabajos Completados')).toBeInTheDocument();
      expect(screen.getByText('Pagos Pendientes')).toBeInTheDocument();
      expect(screen.getByText('Pagos Completados')).toBeInTheDocument();
    });
  });

  it('loads and displays billing data correctly', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        expect.stringContaining('Centro Financiero actualizado'),
        'success'
      );
    });

    // Check that the APIs were called
    expect(require('../../services/apiService').jobNimbusApi.getEstimates).toHaveBeenCalledWith(1, 200);
    expect(require('../../services/apiService').jobNimbusApi.getJobs).toHaveBeenCalledWith(1, 200);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/payments?size=200'),
      expect.objectContaining({
        headers: { 'X-Location': 'guilford' }
      })
    );
  });

  it('displays overdue payment alerts', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/ATENCIÓN.*pagos vencidos/)).toBeInTheDocument();
      expect(screen.getByText('Ver Detalles')).toBeInTheDocument();
    });
  });

  it('filters billing data by status', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /Estado/ })).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox', { name: /Estado/ });
    fireEvent.mouseDown(statusSelect);
    
    await waitFor(() => {
      expect(screen.getByText('Todos los Estados')).toBeInTheDocument();
    });
  });

  it('searches billing data by customer name', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Buscar cliente, trabajo o descripción/);
      expect(searchInput).toBeInTheDocument();
      
      fireEvent.change(searchInput, { target: { value: 'John' } });
      // The filtering should happen automatically via useEffect
    });
  });

  it('switches between tabs correctly', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Vista de Tabla')).toBeInTheDocument();
      expect(screen.getByText('Cronología')).toBeInTheDocument();
      expect(screen.getByText('Analytics Avanzado')).toBeInTheDocument();
    });

    // Click on Cronología tab
    fireEvent.click(screen.getByText('Cronología'));
    
    await waitFor(() => {
      expect(screen.getByText('📅 Cronología de Facturación')).toBeInTheDocument();
    });

    // Click on Analytics Avanzado tab
    fireEvent.click(screen.getByText('Analytics Avanzado'));
    
    await waitFor(() => {
      expect(screen.getByText('📊 Analytics Avanzado')).toBeInTheDocument();
      expect(screen.getByText('Tasa de Cobro')).toBeInTheDocument();
      expect(screen.getByText('Pendiente de Cobro')).toBeInTheDocument();
      expect(screen.getByText('Días Promedio')).toBeInTheDocument();
    });
  });

  it('opens billing detail dialog when view button is clicked', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      // Wait for data to load and table to render
      const viewButtons = screen.getAllByRole('button');
      const viewButton = viewButtons.find(button => 
        button.querySelector('[data-testid="VisibilityIcon"]') !== null
      );
      
      if (viewButton) {
        fireEvent.click(viewButton);
        
        // Check if dialog opens
        expect(screen.getByText('Detalles de Facturación')).toBeInTheDocument();
      }
    });
  });

  it('toggles real-time mode correctly', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      const realTimeSwitch = screen.getByRole('checkbox', { name: /Tiempo Real/ });
      expect(realTimeSwitch).toBeInTheDocument();
      expect(realTimeSwitch).toBeChecked();

      // Toggle off
      fireEvent.click(realTimeSwitch);
      expect(realTimeSwitch).not.toBeChecked();

      // Toggle on
      fireEvent.click(realTimeSwitch);
      expect(realTimeSwitch).toBeChecked();
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      const refreshButton = screen.getByLabelText('Actualizar datos');
      expect(refreshButton).toBeInTheDocument();

      fireEvent.click(refreshButton);
      
      // Should trigger another API call
      expect(require('../../services/apiService').jobNimbusApi.getEstimates).toHaveBeenCalledTimes(2);
    });
  });

  it('displays correct currency formatting', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for currency symbols and formatting
      expect(screen.getAllByText(/\$/).length).toBeGreaterThan(0);
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API to throw error
    (require('../../services/apiService').jobNimbusApi.getEstimates as jest.Mock)
      .mockRejectedValue(new Error('API Error'));

    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        '❌ Error al cargar datos de facturación',
        'error'
      );
    });
  });

  it('displays loading spinner initially', () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    // Should show loading spinner initially
    expect(screen.getByTestId('loading-spinner') || document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('clicking status card filters by that status', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      const contractsCard = screen.getByText('Contratos Firmados').closest('[role="button"], .MuiCard-root');
      if (contractsCard) {
        fireEvent.click(contractsCard);
        
        // Should show "FILTRADO" chip
        expect(screen.getByText('FILTRADO')).toBeInTheDocument();
      }
    });
  });

  it('export buttons trigger notifications', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      const exportButton = screen.getByText('Exportar a Excel');
      fireEvent.click(exportButton);
      
      expect(mockShowNotification).toHaveBeenCalledWith(
        '🚀 Exportación iniciada - Función en desarrollo',
        'info'
      );
    });
  });

  it('calculates totals correctly', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Valor Total en Sistema')).toBeInTheDocument();
      expect(screen.getByText('Elementos de Facturación')).toBeInTheDocument();
      expect(screen.getByText('Pagos Vencidos')).toBeInTheDocument();
    });
  });

  it('renders analytics charts correctly', async () => {
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Distribución por Valor')).toBeInTheDocument();
      expect(screen.getByText('Cantidad por Estado')).toBeInTheDocument();
    });
  });
});

// Integration tests with different office contexts
describe('BillingView Office Integration', () => {
  const mockShowNotification = jest.fn();

  it('loads data for different offices', async () => {
    // Test with different office contexts would require mocking OfficeProvider
    // This demonstrates the structure for office-specific testing
    render(
      <TestWrapper>
        <BillingView showNotification={mockShowNotification} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/payments?size=200'),
        expect.objectContaining({
          headers: { 'X-Location': expect.any(String) }
        })
      );
    });
  });
});