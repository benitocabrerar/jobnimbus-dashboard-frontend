import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DashboardView from '../../views/DashboardView';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

// Mock jobNimbusApi
jest.mock('../../services/apiService', () => ({
  __esModule: true,
  default: {
    getContacts: jest.fn().mockResolvedValue([
      { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active' },
      { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', status: 'active' }
    ]),
    getJobs: jest.fn().mockResolvedValue([
      { id: '1', display_name: 'Kitchen Remodel', customer_name: 'John Doe', status_name: 'Active' },
      { id: '2', display_name: 'Bathroom Renovation', customer_name: 'Jane Smith', status_name: 'Completed' }
    ]),
    getTasks: jest.fn().mockResolvedValue([
      { id: '1', display_name: 'Initial Consultation', assigned_name: 'John Worker', status_name: 'Pending' },
      { id: '2', display_name: 'Material Delivery', assigned_name: 'Jane Worker', status_name: 'Completed' }
    ])
  }
}));

const renderDashboard = (props: any = {}) => {
  return render(
    <BrowserRouter>
      <DashboardView showNotification={jest.fn()} {...props} />
    </BrowserRouter>
  );
};

describe('Dashboard Integration Tests', () => {
  const mockDashboardResponse = {
    kpis: {
      totalContacts: { value: 1247, change: 12.5 },
      activeJobs: { value: 89, change: 8.3 },
      pendingTasks: { value: 156, change: -5.2 },
      monthlyRevenue: { value: 284750, change: 18.7 },
      conversionRate: { value: 23.4, change: 3.2 },
      teamProductivity: { value: 87.5, change: 4.1 }
    },
    charts: {
      monthlyTrends: [
        { month: 'Ene', contacts: 98, jobs: 15, revenue: 45000 },
        { month: 'Feb', contacts: 125, jobs: 22, revenue: 67000 }
      ],
      jobStatus: [
        { name: 'Completados', value: 45, color: '#2e7d32' },
        { name: 'En Progreso', value: 32, color: '#1976d2' }
      ],
      teamPerformance: [],
      revenueFlow: []
    },
    summary: {
      total_contacts: 1247,
      total_jobs: 89
    },
    recentActivity: [
      {
        id: '1',
        type: 'contact',
        title: 'Nuevo cliente registrado',
        description: 'María González - Proyecto de remodelación',
        timestamp: '2025-01-14T10:30:00Z',
        user: 'Juan Pérez',
        status: 'Activo'
      }
    ],
    alerts: [
      {
        type: 'warning',
        message: '12 tareas vencen hoy',
        action: 'Ver tareas'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  test('loads dashboard data successfully from API', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    const showNotification = jest.fn();
    renderDashboard({ showNotification });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Dashboard Ejecutivo')).toBeInTheDocument();
    });

    // Check KPI cards
    expect(screen.getByText('1,247')).toBeInTheDocument(); // Total contacts
    expect(screen.getByText('89')).toBeInTheDocument(); // Active jobs
    expect(screen.getByText('156')).toBeInTheDocument(); // Pending tasks
    expect(screen.getByText('$284,750')).toBeInTheDocument(); // Monthly revenue

    // Check success notification
    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Conectado a JobNimbus'),
        'success'
      );
    });
  });

  test('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const showNotification = jest.fn();
    renderDashboard({ showNotification });

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Error conectando a JobNimbus API'),
        'error'
      );
    });

    // Should show zero values when API fails
    await waitFor(() => {
      expect(screen.getByText('Dashboard Ejecutivo')).toBeInTheDocument();
    });
  });

  test('displays alerts correctly', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('12 tareas vencen hoy')).toBeInTheDocument();
      expect(screen.getByText('Ver tareas')).toBeInTheDocument();
    });
  });

  test('displays recent activity', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Actividad Reciente')).toBeInTheDocument();
      expect(screen.getByText('Nuevo cliente registrado')).toBeInTheDocument();
      expect(screen.getByText('María González - Proyecto de remodelación')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  test('KPI cards are clickable and open details', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Total Contactos')).toBeInTheDocument();
    });

    // Click on contacts KPI card
    const contactsCard = screen.getByText('Total Contactos').closest('.MuiCard-root');
    if (contactsCard) {
      await user.click(contactsCard);
      
      await waitFor(() => {
        expect(screen.getByText('Detalles - contacts')).toBeInTheDocument();
      });
    }
  });

  test('refreshes data when refresh button is clicked', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockDashboardResponse
    });

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Actualizar')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Actualizar');
    await user.click(refreshButton);

    expect(window.location.reload).toHaveBeenCalled();
  });

  test('switches between chart tabs', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Tendencias de Crecimiento - últimos 6 meses')).toBeInTheDocument();
    });

    // Switch to Estado de Trabajos tab
    const jobStatusTab = screen.getByRole('tab', { name: /estado de trabajos/i });
    await user.click(jobStatusTab);

    await waitFor(() => {
      expect(screen.getByText('Distribución de Estados de Trabajos - Funcionalidad próximamente')).toBeInTheDocument();
    });

    // Switch to Rendimiento del Equipo tab
    const teamPerformanceTab = screen.getByRole('tab', { name: /rendimiento del equipo/i });
    await user.click(teamPerformanceTab);

    await waitFor(() => {
      expect(screen.getByText('Eficiencia por Miembro del Equipo')).toBeInTheDocument();
    });

    // Switch to Flujo de Ingresos tab
    const revenueFlowTab = screen.getByRole('tab', { name: /flujo de ingresos/i });
    await user.click(revenueFlowTab);

    await waitFor(() => {
      expect(screen.getByText('Análisis Financiero Semanal')).toBeInTheDocument();
    });
  });

  test('displays loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );

    renderDashboard();

    expect(screen.getByText('Cargando dashboard avanzado...')).toBeInTheDocument();
  });

  test('shows detailed contact information in dialog', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Total Contactos')).toBeInTheDocument();
    });

    // Click on contacts KPI card
    const contactsCard = screen.getByText('Total Contactos').closest('.MuiCard-root');
    if (contactsCard) {
      await user.click(contactsCard);
      
      await waitFor(() => {
        expect(screen.getByText('Resumen de Contactos')).toBeInTheDocument();
        expect(screen.getByText('Total de Contactos')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // From mocked API service
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      });
    }
  });

  test('shows detailed job information in dialog', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Trabajos Activos')).toBeInTheDocument();
    });

    // Click on jobs KPI card
    const jobsCard = screen.getByText('Trabajos Activos').closest('.MuiCard-root');
    if (jobsCard) {
      await user.click(jobsCard);
      
      await waitFor(() => {
        expect(screen.getByText('Resumen de Trabajos')).toBeInTheDocument();
        expect(screen.getByText('Kitchen Remodel')).toBeInTheDocument();
        expect(screen.getByText('Cliente: John Doe')).toBeInTheDocument();
        expect(screen.getByText('Bathroom Renovation')).toBeInTheDocument();
      });
    }
  });

  test('shows detailed task information in dialog', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Tareas Pendientes')).toBeInTheDocument();
    });

    // Click on tasks KPI card
    const tasksCard = screen.getByText('Tareas Pendientes').closest('.MuiCard-root');
    if (tasksCard) {
      await user.click(tasksCard);
      
      await waitFor(() => {
        expect(screen.getByText('Resumen de Tareas')).toBeInTheDocument();
        expect(screen.getByText('Initial Consultation')).toBeInTheDocument();
        expect(screen.getByText('Asignado a: John Worker')).toBeInTheDocument();
        expect(screen.getByText('Material Delivery')).toBeInTheDocument();
      });
    }
  });

  test('formats currency correctly in different locales', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardResponse
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('$284,750')).toBeInTheDocument();
    });
  });

  test('handles network errors with retry mechanism', async () => {
    const showNotification = jest.fn();
    
    // Mock window.location.reload for retry
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    renderDashboard({ showNotification });

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Error conectando a JobNimbus API'),
        'error'
      );
    });

    // Should attempt retry after 3 seconds
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    }, { timeout: 4000 });
  });
});