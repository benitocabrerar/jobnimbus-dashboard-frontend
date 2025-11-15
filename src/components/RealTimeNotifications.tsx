import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Chip,
  Paper
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Clear,
  CheckCircle,
  Warning,
  Error,
  Info,
  Work,
  Person,
  Task,
  AttachMoney
} from '@mui/icons-material';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: 'job' | 'contact' | 'task' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface RealTimeNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  maxNotifications?: number;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  maxNotifications = 50
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filter out read notifications and limit to maxNotifications
  const displayNotifications = notifications
    .filter(n => !n.read)
    .slice(0, maxNotifications);

  const unreadCount = displayNotifications.length;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'job': return <Work />;
      case 'contact': return <Person />;
      case 'task': return <Task />;
      case 'payment': return <AttachMoney />;
      default: return <Info />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#757575';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // Play notification sound (if enabled)
  useEffect(() => {
    if (soundEnabled && unreadCount > 0) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, [notifications.length, soundEnabled]);

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{ 
          color: unreadCount > 0 ? 'primary.main' : 'inherit',
          animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' }
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Notificaciones
            </Typography>
            <Box display="flex" gap={1}>
              {unreadCount > 0 && (
                <Button size="small" onClick={onMarkAllAsRead}>
                  Marcar todas
                </Button>
              )}
              <IconButton size="small" onClick={onClearAll}>
                <Clear />
              </IconButton>
            </Box>
          </Box>
          
          {unreadCount > 0 && (
            <Typography variant="caption" color="primary">
              {unreadCount} nuevas notificaciones
            </Typography>
          )}
        </Box>

        {/* Notifications List */}
        {displayNotifications.length === 0 ? (
          <Box p={3} textAlign="center">
            <CheckCircle sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No hay notificaciones nuevas
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {displayNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    bgcolor: notification.read ? 'transparent' : 'action.selected',
                    borderLeft: `4px solid ${getNotificationColor(notification.type)}`
                  }}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getNotificationColor(notification.type),
                        width: 32,
                        height: 32
                      }}
                    >
                      {getNotificationIcon(notification.category)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle2" fontWeight={notification.read ? 'normal' : 'bold'}>
                          {notification.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'primary.main'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {notification.message}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Chip
                            label={notification.category}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                          
                          {notification.actions && notification.actions.length > 0 && (
                            <Box display="flex" gap={0.5}>
                              {notification.actions.slice(0, 2).map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  size="small"
                                  variant="text"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                  sx={{ fontSize: '0.65rem', minWidth: 'auto', p: 0.5 }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                
                {index < displayNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Footer */}
        {displayNotifications.length > 0 && (
          <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Button
              fullWidth
              size="small"
              onClick={() => {
                handleClose();
                // Navigate to full notifications page
              }}
            >
              Ver todas las notificaciones
            </Button>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default RealTimeNotifications;
