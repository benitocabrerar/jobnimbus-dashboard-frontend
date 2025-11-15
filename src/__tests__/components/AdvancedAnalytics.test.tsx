import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdvancedAnalytics, { AnalyticsData } from '../../components/AdvancedAnalytics';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  Radar: () => <div data-testid="radar" />,
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
  PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
  ComposedChart: ({ children }: any) => <div data-testid="composed-chart">{children}</div>,
  Cell: () => <div data-testid="cell" />
}));

describe('AdvancedAnalytics Component', () => {
  const mockAnalyticsData: AnalyticsData = {
    overview: {
      totalRevenue: 284750,
      revenueGrowth: 18.7,
      totalJobs: 89,
      jobsGrowth: 8.3,
      conversionRate: 23.4,
      conversionGrowth: 3.2,
      customerSatisfaction: 4.2,
      satisfactionGrowth: 4.1
    },
    trends: {
      revenue: [
        { month: 'Ene', revenue: 45000, forecast: 47000 },
        { month: 'Feb', revenue: 67000, forecast: 69000 },
        { month: 'Mar', revenue: 89000, forecast: 91000 }
      ],
      jobs: [
        { month: 'Ene', completed: 15, inProgress: 8, canceled: 2 },
        { month: 'Feb', completed: 22, inProgress: 12, canceled: 1 },
        { month: 'Mar', completed: 28, inProgress: 15, canceled: 3 }
      ],
      conversion: [
        { month: 'Ene', leads: 50, conversions: 10, rate: 20 },
        { month: 'Feb', leads: 75, conversions: 18, rate: 24 },
        { month: 'Mar', leads: 90, conversions: 21, rate: 23.3 }
      ]
    },
    performance: {
      topPerformers: [
        { name: 'Juan Pérez', jobs: 23, revenue: 125000, rating: 4.8 },
        { name: 'María García', jobs: 19, revenue: 98000, rating: 4.6 },
        { name: 'Carlos López', jobs: 27, revenue: 156000, rating: 4.9 }
      ],
      teamMetrics: [
        { category: 'Productividad', current: 85, target: 90, performance: 94.4 },
        { category: 'Calidad', current: 92, target: 95, performance: 96.8 },
        { category: 'Satisfacción', current: 88, target: 90, performance: 97.8 }
      ]
    },
    insights: {
      keyInsights: [
        {
          title: 'Incremento en conversiones',
          description: 'Las conversiones han aumentado 15% en el último trimestre',
          impact: 'high' as const,
          trend: 'up' as const
        },
        {
          title: 'Oportunidad de mejora',
          description: 'El tiempo de respuesta promedio puede optimizarse',
          impact: 'medium' as const,
          trend: 'stable' as const
        }
      ],
      predictions: [
        { metric: 'Ingresos Q2', current: 284750, predicted: 325000, confidence: 85 },
        { metric: 'Trabajos Completados', current: 89, predicted: 105, confidence: 78 }
      ]
    }
  };

  const defaultProps = {
    data: mockAnalyticsData,
    onExport: jest.fn(),
    showNotification: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders advanced analytics component', () => {
    render(<AdvancedAnalytics {...defaultProps} />);
    
    expect(screen.getByText('Analytics Avanzado')).toBeInTheDocument();
    expect(screen.getByText('Análisis predictivo y insights empresariales')).toBeInTheDocument();
  });

  test('displays overview cards with correct data', () => {
    render(<AdvancedAnalytics {...defaultProps} />);
    
    expect(screen.getByText('$284,750')).toBeInTheDocument();
    expect(screen.getByText('Ingresos Totales')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    expect(screen.getByText('Trabajos Completados')).toBeInTheDocument();
    expect(screen.getByText('23.4%')).toBeInTheDocument();
    expect(screen.getByText('Tasa de Conversión')).toBeInTheDocument();
    expect(screen.getByText('4.2/5')).toBeInTheDocument();
    expect(screen.getByText('Satisfacción Cliente')).toBeInTheDocument();
  });

  test('displays growth indicators correctly', () => {
    render(<AdvancedAnalytics {...defaultProps} />);
    
    expect(screen.getByText('+18.7% este mes')).toBeInTheDocument();
    expect(screen.getByText('+8.3% este mes')).toBeInTheDocument();
    expect(screen.getByText('+3.2% este mes')).toBeInTheDocument();
    expect(screen.getByText('+4.1% este mes')).toBeInTheDocument();
  });

  test('switches between tabs correctly', async () => {
    const user = userEvent.setup();
    render(<AdvancedAnalytics {...defaultProps} />);
    
    // Initially on Tendencias tab
    expect(screen.getByText('Tendencia de Ingresos vs Pronóstico')).toBeInTheDocument();
    
    // Switch to Rendimiento tab
    const rendimientoTab = screen.getByRole('tab', { name: /rendimiento/i });
    await user.click(rendimientoTab);
    
    await waitFor(() => {
      expect(screen.getByText('Top Performers del Equipo')).toBeInTheDocument();
    });
    
    // Switch to Predicciones tab
    const prediccionesTab = screen.getByRole('tab', { name: /predicciones/i });
    await user.click(prediccionesTab);
    
    await waitFor(() => {
      expect(screen.getByText('Predicciones de IA para el Próximo Trimestre')).toBeInTheDocument();
    });
    
    // Switch to Insights tab
    const insightsTab = screen.getByRole('tab', { name: /insights/i });
    await user.click(insightsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Insights Clave del Negocio')).toBeInTheDocument();
    });
  });

  test('displays top performers correctly', async () => {
    const user = userEvent.setup();
    render(<AdvancedAnalytics {...defaultProps} />);
    
    // Switch to Rendimiento tab
    const rendimientoTab = screen.getByRole('tab', { name: /rendimiento/i });
    await user.click(rendimientoTab);
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('23 trabajos • $125,000 • 4.8/5')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
      expect(screen.getByText('Carlos López')).toBeInTheDocument();
    });
  });

  test('displays predictions correctly', async () => {
    const user = userEvent.setup();
    render(<AdvancedAnalytics {...defaultProps} />);
    
    // Switch to Predicciones tab
    const prediccionesTab = screen.getByRole('tab', { name: /predicciones/i });
    await user.click(prediccionesTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ingresos Q2')).toBeInTheDocument();
      expect(screen.getByText('284,750')).toBeInTheDocument(); // Current value
      expect(screen.getByText('325,000')).toBeInTheDocument(); // Predicted value
      expect(screen.getByText('Confianza: 85%')).toBeInTheDocument();
    });
  });

  test('displays insights correctly', async () => {
    const user = userEvent.setup();
    render(<AdvancedAnalytics {...defaultProps} />);
    
    // Switch to Insights tab
    const insightsTab = screen.getByRole('tab', { name: /insights/i });
    await user.click(insightsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Incremento en conversiones')).toBeInTheDocument();
      expect(screen.getByText('Las conversiones han aumentado 15% en el último trimestre')).toBeInTheDocument();
      expect(screen.getByText('HIGH')).toBeInTheDocument();
      expect(screen.getByText('Oportunidad de mejora')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    });
  });

  test('handles export functionality', async () => {
    const user = userEvent.setup();
    const onExport = jest.fn();
    
    render(<AdvancedAnalytics {...defaultProps} onExport={onExport} />);
    
    const exportButton = screen.getByRole('button', { name: /exportar/i });
    await user.click(exportButton);
    
    expect(onExport).toHaveBeenCalledWith('analytics');
  });

  test('opens detail dialog', async () => {
    const user = userEvent.setup();
    render(<AdvancedAnalytics {...defaultProps} />);
    
    const detailButton = screen.getByRole('button', { name: /vista detallada/i });
    await user.click(detailButton);
    
    await waitFor(() => {
      expect(screen.getByText('Vista Detallada de Analytics')).toBeInTheDocument();
    });
  });

  test('renders charts correctly', () => {
    render(<AdvancedAnalytics {...defaultProps} />);
    
    // Check for chart components
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(1);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  test('formats currency correctly', () => {
    render(<AdvancedAnalytics {...defaultProps} />);
    
    expect(screen.getByText('$284,750')).toBeInTheDocument();
  });

  test('handles empty data gracefully', () => {
    const emptyData: AnalyticsData = {
      overview: {
        totalRevenue: 0,
        revenueGrowth: 0,
        totalJobs: 0,
        jobsGrowth: 0,
        conversionRate: 0,
        conversionGrowth: 0,
        customerSatisfaction: 0,
        satisfactionGrowth: 0
      },
      trends: {
        revenue: [],
        jobs: [],
        conversion: []
      },
      performance: {
        topPerformers: [],
        teamMetrics: []
      },
      insights: {
        keyInsights: [],
        predictions: []
      }
    };

    render(<AdvancedAnalytics {...defaultProps} data={emptyData} />);
    
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});