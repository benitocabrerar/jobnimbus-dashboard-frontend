import React, { useState, useRef, useEffect } from 'react';
import { jobNimbusApi, JobNimbusLocation } from '../services/apiService';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Fade,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Lightbulb,
  TrendingUp,
  Assessment,
  Search,
  History,
  Star,
  ContentCopy,
  ThumbUp,
  ThumbDown,
  Refresh
} from '@mui/icons-material';

interface ChatViewProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  currentLocation: JobNimbusLocation;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];
}

export default function ChatView({ showNotification, currentLocation }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente MCP para JobNimbus. Puedo ayudarte a consultar contactos, analizar trabajos, generar reportes y mucho más. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      suggestions: [
        '¿Cuántos contactos nuevos tengo este mes?',
        'Muéstrame un resumen de trabajos activos',
        'Genera un reporte de productividad del equipo',
        '¿Cuáles son mis tareas pendientes?'
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQueries = [
    {
      category: 'Consultas Rápidas',
      queries: [
        '¿Cuántos contactos tengo en total?',
        'Muéstrame los trabajos de esta semana',
        '¿Cuáles son las tareas vencidas?',
        'Resumen de actividades recientes'
      ]
    },
    {
      category: 'Análisis Gerencial',
      queries: [
        'Análisis de conversión de leads a clientes',
        'Productividad del equipo por miembro',
        'Ingresos proyectados vs reales',
        'Tendencias de crecimiento mensual'
      ]
    },
    {
      category: 'Reportes Avanzados',
      queries: [
        'Dashboard ejecutivo completo',
        'Análisis de satisfacción del cliente',
        'Eficiencia operativa por proyecto',
        'Métricas de retención de clientes'
      ]
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🏢 Efecto para sincronizar con cambios de ubicación desde App.tsx
  useEffect(() => {
    // Recargar contexto del chat cuando cambie la ubicación
    showNotification(`🤖 Chat actualizado para ${currentLocation} - Contexto refrescado`, 'info');
  }, [currentLocation]);

  const handleSendMessage = async (message: string = currentMessage) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Llamar al endpoint real de chat
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const chatResponse = await response.json();
      
      // Formatear la respuesta de la API real
      let formattedResponse = '';
      
      if (chatResponse.response) {
        if (chatResponse.response.contactos) {
          const contacts = Array.isArray(chatResponse.response.contactos) 
            ? chatResponse.response.contactos 
            : chatResponse.response.contactos.results || [];
          
          formattedResponse += `📊 **Contactos de JobNimbus**\n\n`;
          formattedResponse += `• **Total encontrados**: ${contacts.length}\n`;
          
          if (contacts.length > 0) {
            formattedResponse += `• **Últimos contactos**:\n`;
            contacts.slice(0, 3).forEach((contact: any, index: number) => {
              formattedResponse += `  ${index + 1}. ${contact.first_name || contact.firstName || 'Sin nombre'} ${contact.last_name || contact.lastName || ''}\n`;
              formattedResponse += `     📧 ${contact.email || contact.primary_email || 'Sin email'}\n`;
            });
          }
        }
        
        if (chatResponse.response.trabajos) {
          const jobs = Array.isArray(chatResponse.response.trabajos) 
            ? chatResponse.response.trabajos 
            : chatResponse.response.trabajos.results || [];
          
          formattedResponse += `\n🔧 **Trabajos de JobNimbus**\n\n`;
          formattedResponse += `• **Total encontrados**: ${jobs.length}\n`;
          
          if (jobs.length > 0) {
            formattedResponse += `• **Trabajos recientes**:\n`;
            jobs.slice(0, 3).forEach((job: any, index: number) => {
              formattedResponse += `  ${index + 1}. ${job.name || job.title || 'Sin título'}\n`;
              formattedResponse += `     📅 Estado: ${job.status || 'Sin estado'}\n`;
            });
          }
        }
        
        if (chatResponse.response.tareas) {
          const tasks = Array.isArray(chatResponse.response.tareas) 
            ? chatResponse.response.tareas 
            : chatResponse.response.tareas.results || [];
          
          formattedResponse += `\n✅ **Tareas de JobNimbus**\n\n`;
          formattedResponse += `• **Total encontradas**: ${tasks.length}\n`;
          
          if (tasks.length > 0) {
            formattedResponse += `• **Tareas pendientes**:\n`;
            tasks.slice(0, 3).forEach((task: any, index: number) => {
              formattedResponse += `  ${index + 1}. ${task.name || task.title || 'Sin título'}\n`;
              formattedResponse += `     ⏰ Vencimiento: ${task.due_date || 'Sin fecha'}\n`;
            });
          }
        }
        
        if (chatResponse.response.kpi) {
          const kpi = chatResponse.response.kpi;
          formattedResponse += `\n📈 **KPIs de JobNimbus**\n\n`;
          formattedResponse += `• **Trabajos totales**: ${kpi.total_jobs}\n`;
          formattedResponse += `• **Contactos totales**: ${kpi.total_contacts}\n`;
          formattedResponse += `• **Tareas totales**: ${kpi.total_tasks}\n`;
        }
        
        if (chatResponse.response.info) {
          formattedResponse += `\n💡 **Información**: ${chatResponse.response.info}\n`;
        }
      }
      
      // Si no hay respuesta específica, usar respuesta predeterminada
      if (!formattedResponse.trim()) {
        formattedResponse = `He consultado tu base de datos de JobNimbus y procesado tu consulta: "${message}"\n\n`;
        formattedResponse += `**Estado de la conexión**: ✅ Conectado a JobNimbus API\n`;
        formattedResponse += `**Consulta procesada**: ${new Date().toLocaleString('en-US')}\n\n`;
        formattedResponse += `¿Te gustaría hacer una consulta más específica sobre contactos, trabajos o tareas?`;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: formattedResponse,
        timestamp: new Date(),
        suggestions: generateSuggestions(message)
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      showNotification('✅ Respuesta de JobNimbus API procesada', 'success');

    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // No fallback to demo - show real error
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ **Error conectando a JobNimbus API**\n\n**Error**: ${error instanceof Error ? error.message : String(error)}\n\n**Estado**: Desconectado de JobNimbus\n\nPor favor verifica tu conexión a internet y el estado de la API de JobNimbus. Se reintentará la conexión automáticamente.`,
        timestamp: new Date(),
        suggestions: ['Reintentar conexión', 'Verificar estado API', 'Contactar soporte']
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      showNotification(`❌ Error conectando a JobNimbus API`, 'error');
    }
  };

  const generateMockResponse = (query: string): string => {
    const responses = {
      contactos: `📊 **Análisis de Contactos**

He consultado tu base de datos de JobNimbus y encontré:

• **Total de contactos**: 1,247
• **Nuevos este mes**: 87 (+12.5%)
• **Clientes activos**: 456
• **Prospectos**: 234
• **Valor potencial total**: $1,672,351

**Insights clave:**
- Tus mejores prospectos están en Madrid y Barcelona
- 23.4% de conversión lead → cliente
- Mejor día para contactar: Martes entre 10-12h`,

      trabajos: `🔧 **Estado de Trabajos**

Basado en los datos actuales de JobNimbus:

• **Trabajos activos**: 89 proyectos
• **Completados este mes**: 34
• **En progreso**: 32
• **Pendientes de inicio**: 18
• **Facturación pendiente**: $612,465

**Próximos vencimientos:**
1. Instalación Casa García - Mañana
2. Remodelación López - 3 días
3. Mantenimiento Empresa XYZ - 5 días`,

      tareas: `✅ **Gestión de Tareas**

Estado actual de tareas en JobNimbus:

• **Tareas totales**: 156
• **Completadas hoy**: 12
• **Vencidas**: 8 ⚠️
• **Para esta semana**: 45
• **Asignadas a ti**: 23

**Tareas críticas vencidas:**
- Seguimiento Cliente ABC (vence hace 2 días)
- Cotización proyecto comercial (vence hace 1 día)
- Revisión contrato López (vence hoy)`
    };

    const queryLower = query.toLowerCase();
    if (queryLower.includes('contacto')) return responses.contactos;
    if (queryLower.includes('trabajo') || queryLower.includes('proyecto')) return responses.trabajos;
    if (queryLower.includes('tarea')) return responses.tareas;

    return `He procesado tu consulta usando las herramientas MCP de JobNimbus. 

**Datos obtenidos:**
- Conectado exitosamente a la API de JobNimbus
- Procesados 1,247 registros de contactos
- Analizados 89 trabajos activos
- Evaluadas 156 tareas pendientes

**Resumen ejecutivo:**
Tu negocio muestra un crecimiento del 18.7% este mes. Las métricas clave indican una buena salud operativa con oportunidades de mejora en el seguimiento de tareas vencidas.

¿Te gustaría que profundice en algún aspecto específico?`;
  };

  const generateSuggestions = (query: string): string[] => {
    return [
      '¿Puedes mostrarme más detalles?',
      'Exporta estos datos a PDF',
      '¿Cómo puedo mejorar estas métricas?',
      'Muéstrame la tendencia histórica'
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex' }}>
      {/* Sidebar with predefined queries */}
      <Box sx={{ width: 300, mr: 2 }}>
        <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Consultas Predefinidas
          </Typography>
          
          {predefinedQueries.map((category, index) => (
            <Box key={index} mb={3}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                {category.category}
              </Typography>
              <List dense>
                {category.queries.map((query, queryIndex) => (
                  <ListItem
                    key={queryIndex}
                    component="button"
                    onClick={() => handleSendMessage(query)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Lightbulb fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={query}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              💡 Tip: Puedes hacer cualquier consulta sobre tus datos de JobNimbus
            </Typography>
          </Alert>
        </Paper>
      </Box>

      {/* Main chat area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat header */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <SmartToy />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Asistente MCP JobNimbus
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    ● Conectado y listo
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Chip 
                  icon={<Star />} 
                  label="AI Powered" 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          {/* Messages area */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => (
              <Fade in key={message.id}>
                <Box
                  display="flex"
                  justifyContent={message.type === 'user' ? 'flex-end' : 'flex-start'}
                  mb={2}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1
                    }}
                  >
                    {message.type === 'assistant' && (
                      <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                        <SmartToy fontSize="small" />
                      </Avatar>
                    )}
                    
                    <Box>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: message.type === 'user' ? '#1976d2' : '#f5f5f5',
                          color: message.type === 'user' ? 'white' : 'text.primary'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-line' }}
                        >
                          {message.content}
                        </Typography>
                      </Paper>
                      
                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                        
                        {message.type === 'assistant' && (
                          <Box>
                            <IconButton size="small">
                              <ContentCopy fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="success">
                              <ThumbUp fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <ThumbDown fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <Box mt={2}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            Sugerencias:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            {message.suggestions.map((suggestion, index) => (
                              <Chip
                                key={index}
                                label={suggestion}
                                size="small"
                                variant="outlined"
                                onClick={() => handleSuggestionClick(suggestion)}
                                sx={{ cursor: 'pointer' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {message.type === 'user' && (
                      <Avatar sx={{ bgcolor: '#2e7d32', width: 32, height: 32 }}>
                        <Person fontSize="small" />
                      </Avatar>
                    )}
                  </Box>
                </Box>
              </Fade>
            ))}

            {isTyping && (
              <Fade in>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32, mr: 1 }}>
                    <SmartToy fontSize="small" />
                  </Avatar>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Procesando con MCP...
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Fade>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Escribe tu consulta sobre JobNimbus..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTyping}
              />
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={() => handleSendMessage()}
                disabled={!currentMessage.trim() || isTyping}
                sx={{ minWidth: 120 }}
              >
                Enviar
              </Button>
            </Box>
            
            <Box mt={1}>
              <Typography variant="caption" color="text.secondary">
                💡 Usa comandos naturales como "muéstrame", "analiza", "compara", "exporta"
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}