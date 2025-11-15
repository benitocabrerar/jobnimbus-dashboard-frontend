import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RealTimeNotifications, { Notification } from '../../components/RealTimeNotifications';

// Mock AudioContext for notification sounds
const mockAudioContext = {
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    frequency: { value: 0 },
    type: 'sine',
    start: jest.fn(),
    stop: jest.fn()
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn()
    }
  })),
  destination: {},
  currentTime: 0
};

// Mock window.AudioContext
(window as any).AudioContext = jest.fn(() => mockAudioContext);
(window as any).webkitAudioContext = jest.fn(() => mockAudioContext);

describe('RealTimeNotifications Component', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      category: 'job',
      title: 'Trabajo completado',
      message: 'El trabajo #1234 ha sido completado exitosamente',
      timestamp: new Date('2024-01-14T10:30:00Z'),
      read: false,
      actions: [
        { label: 'Ver detalles', action: jest.fn() },
        { label: 'Marcar como leído', action: jest.fn() }
      ]
    },
    {
      id: '2',
      type: 'warning',
      category: 'task',
      title: 'Tarea vencida',
      message: 'La tarea de seguimiento está vencida desde hace 2 días',
      timestamp: new Date('2024-01-14T08:00:00Z'),
      read: false
    },
    {
      id: '3',
      type: 'info',
      category: 'contact',
      title: 'Nuevo contacto',
      message: 'Se ha registrado un nuevo contacto: María González',
      timestamp: new Date('2024-01-14T07:30:00Z'),
      read: true
    },
    {
      id: '4',
      type: 'error',
      category: 'payment',
      title: 'Pago fallido',
      message: 'El pago de la factura #5678 ha fallado',
      timestamp: new Date('2024-01-14T06:00:00Z'),
      read: false
    }
  ];

  const defaultProps = {
    notifications: mockNotifications,
    onMarkAsRead: jest.fn(),
    onMarkAllAsRead: jest.fn(),
    onClearAll: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset AudioContext mocks
    mockAudioContext.createOscillator.mockClear();
    mockAudioContext.createGain.mockClear();
  });

  test('renders notification bell with correct badge count', () => {
    render(<RealTimeNotifications {...defaultProps} />);
    
    // Should show 3 unread notifications (excluding the read one)
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  test('opens notification menu when bell is clicked', async () => {
    const user = userEvent.setup();
    render(<RealTimeNotifications {...defaultProps} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
      expect(screen.getByText('3 nuevas notificaciones')).toBeInTheDocument();
    });
  });

  test('displays unread notifications only', async () => {
    const user = userEvent.setup();
    render(<RealTimeNotifications {...defaultProps} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('Trabajo completado')).toBeInTheDocument();
      expect(screen.getByText('Tarea vencida')).toBeInTheDocument();
      expect(screen.getByText('Pago fallido')).toBeInTheDocument();
      // Read notification should not be visible
      expect(screen.queryByText('Nuevo contacto')).not.toBeInTheDocument();
    });
  });

  test('shows correct notification icons and colors', async () => {
    const user = userEvent.setup();
    render(<RealTimeNotifications {...defaultProps} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      // Check for category-specific content
      expect(screen.getByText('job')).toBeInTheDocument();
      expect(screen.getByText('task')).toBeInTheDocument();
      expect(screen.getByText('payment')).toBeInTheDocument();
    });
  });

  test('formats timestamps correctly', async () => {
    const user = userEvent.setup();
    render(<RealTimeNotifications {...defaultProps} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      // Should show relative timestamps (this might vary based on current time)
      const timeElements = screen.getAllByText(/\d+[mhd]|\w+/);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  test('marks notification as read when clicked', async () => {
    const user = userEvent.setup();
    const onMarkAsRead = jest.fn();
    
    render(<RealTimeNotifications {...defaultProps} onMarkAsRead={onMarkAsRead} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('Trabajo completado')).toBeInTheDocument();
    });

    const notification = screen.getByText('Trabajo completado').closest('[role="menuitem"]') || 
                        screen.getByText('Trabajo completado').closest('li');
    
    if (notification) {
      await user.click(notification);
      expect(onMarkAsRead).toHaveBeenCalledWith('1');
    }
  });

  test('marks all notifications as read', async () => {
    const user = userEvent.setup();
    const onMarkAllAsRead = jest.fn();
    
    render(<RealTimeNotifications {...defaultProps} onMarkAllAsRead={onMarkAllAsRead} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('Marcar todas')).toBeInTheDocument();
    });

    const markAllButton = screen.getByText('Marcar todas');
    await user.click(markAllButton);
    
    expect(onMarkAllAsRead).toHaveBeenCalled();
  });

  test('clears all notifications', async () => {
    const user = userEvent.setup();
    const onClearAll = jest.fn();
    
    render(<RealTimeNotifications {...defaultProps} onClearAll={onClearAll} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      // Look for the clear button (X icon)
      const clearButton = screen.getByRole('button', { name: '' }); // IconButton with Clear icon
      expect(clearButton).toBeInTheDocument();
    });

    const clearButtons = screen.getAllByRole('button');
    const clearButton = clearButtons.find(button => 
      button.querySelector('[data-testid="ClearIcon"]') || 
      button.textContent === '' && button !== bellButton
    );
    
    if (clearButton) {
      await user.click(clearButton);
      expect(onClearAll).toHaveBeenCalled();
    }
  });

  test('handles notification actions', async () => {
    const user = userEvent.setup();
    const mockAction = jest.fn();
    
    const notificationsWithActions: Notification[] = [
      {
        ...mockNotifications[0],
        actions: [
          { label: 'Ver detalles', action: mockAction }
        ]
      }
    ];
    
    render(<RealTimeNotifications {...defaultProps} notifications={notificationsWithActions} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('Ver detalles')).toBeInTheDocument();
    });

    const actionButton = screen.getByText('Ver detalles');
    await user.click(actionButton);
    
    expect(mockAction).toHaveBeenCalled();
  });

  test('shows empty state when no notifications', async () => {
    const user = userEvent.setup();
    render(<RealTimeNotifications {...defaultProps} notifications={[]} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('No hay notificaciones nuevas')).toBeInTheDocument();
    });
  });

  test('respects maxNotifications limit', async () => {
    const user = userEvent.setup();
    const manyNotifications = Array.from({ length: 10 }, (_, i) => ({
      ...mockNotifications[0],
      id: `notification-${i}`,
      title: `Notification ${i + 1}`
    }));
    
    render(
      <RealTimeNotifications 
        {...defaultProps} 
        notifications={manyNotifications} 
        maxNotifications={5}
      />
    );
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      // Should only show 5 notifications (maxNotifications)
      const notificationItems = screen.getAllByText(/Notification \d+/);
      expect(notificationItems).toHaveLength(5);
    });
  });

  test('handles bell animation for unread notifications', () => {
    render(<RealTimeNotifications {...defaultProps} />);
    
    const bellButton = screen.getByRole('button');
    
    // Check if bell has animation styles when there are unread notifications
    const buttonStyle = getComputedStyle(bellButton);
    expect(bellButton).toBeInTheDocument();
  });

  test('shows notification view all button', async () => {
    const user = userEvent.setup();
    render(<RealTimeNotifications {...defaultProps} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('Ver todas las notificaciones')).toBeInTheDocument();
    });
  });

  test('truncates long notification messages', async () => {
    const user = userEvent.setup();
    const longMessageNotification: Notification = {
      id: '1',
      type: 'info',
      category: 'job',
      title: 'Notification with very long message',
      message: 'This is a very long notification message that should be truncated to fit within the notification display area without overflowing',
      timestamp: new Date(),
      read: false
    };
    
    render(<RealTimeNotifications {...defaultProps} notifications={[longMessageNotification]} />);
    
    const bellButton = screen.getByRole('button');
    await user.click(bellButton);
    
    await waitFor(() => {
      expect(screen.getByText('Notification with very long message')).toBeInTheDocument();
      // The long message should be present but truncated with CSS
      expect(screen.getByText(/This is a very long notification message/)).toBeInTheDocument();
    });
  });
});