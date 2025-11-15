import { useState, useEffect, useCallback } from 'react';
import { jobNimbusApi } from '../services/apiService';

interface ConnectionStatus {
  state: 'connected' | 'connecting' | 'disconnected' | 'error';
  lastConnected?: Date;
  errorCount: number;
  isLoading: boolean;
}

export function useJobNimbusConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    state: 'disconnected',
    errorCount: 0,
    isLoading: false
  });

  const [healthCheckInterval, setHealthCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Actualizar estado cuando cambie la conexión
  useEffect(() => {
    const unsubscribe = jobNimbusApi.onConnectionStateChange((newState) => {
      setStatus(prev => ({
        ...prev,
        state: newState as any,
        lastConnected: newState === 'connected' ? new Date() : prev.lastConnected,
        errorCount: newState === 'connected' ? 0 : prev.errorCount + (newState === 'error' ? 1 : 0),
        isLoading: newState === 'connecting'
      }));
    });

    return unsubscribe;
  }, []);

  // Health check periódico
  useEffect(() => {
    const startHealthCheck = () => {
      const interval = setInterval(async () => {
        if (status.state === 'connected') {
          try {
            const isConnected = await jobNimbusApi.testConnection();
            if (!isConnected) {
              console.log('🔄 Conexión perdida, reintentando...');
              await jobNimbusApi.forceReconnect();
            }
          } catch (error) {
            console.error('Health check failed:', error);
          }
        } else if (status.state === 'error' && status.errorCount < 10) {
          // Reintentar conexión automáticamente si hay errores
          console.log('🔄 Reintentando conexión automáticamente...');
          await jobNimbusApi.forceReconnect();
        }
      }, 30000); // Cada 30 segundos

      setHealthCheckInterval(interval);
    };

    startHealthCheck();

    return () => {
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }
    };
  }, [status.state, status.errorCount]);

  // Funciones de control manual
  const connect = useCallback(async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      await jobNimbusApi.forceReconnect();
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
      setHealthCheckInterval(null);
    }
    setStatus(prev => ({ ...prev, state: 'disconnected', isLoading: false }));
  }, [healthCheckInterval]);

  // Estado de conexión legible
  const getStatusMessage = useCallback(() => {
    switch (status.state) {
      case 'connected':
        return `✅ Conectado a JobNimbus${status.lastConnected ? ` - ${status.lastConnected.toLocaleTimeString()}` : ''}`;
      case 'connecting':
        return '🔄 Conectando a JobNimbus...';
      case 'disconnected':
        return '⚫ Desconectado de JobNimbus';
      case 'error':
        return `❌ Error de conexión (${status.errorCount} intentos)`;
      default:
        return '❓ Estado desconocido';
    }
  }, [status]);

  const isConnected = status.state === 'connected';
  const hasErrors = status.state === 'error';
  const isConnecting = status.state === 'connecting' || status.isLoading;

  return {
    status,
    isConnected,
    hasErrors,
    isConnecting,
    connect,
    disconnect,
    getStatusMessage,
    errorCount: status.errorCount,
    lastConnected: status.lastConnected
  };
}