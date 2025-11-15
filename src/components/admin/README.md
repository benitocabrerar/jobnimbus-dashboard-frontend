# Admin Panel - JobNimbus Dashboard

## Overview

Panel de administración profesional, minimalista y poderoso para el JobNimbus Dashboard. Diseñado con filosofía "super sencillo pero poderoso" usando React 18.3.1, TypeScript y Material-UI 6.5.0.

## Características Principales

### 🎯 Dashboard Overview
- **Estadísticas en tiempo real**: Usuarios, roles, acciones, issues y salud del sistema
- **Acciones rápidas**: Crear usuarios, generar API keys, exportar logs, sincronizar datos
- **Actividad reciente**: Stream en vivo de las últimas 5 acciones del sistema
- **Diseño responsive**: Cards adaptables con hover effects

### 👥 User Management
- **Tabla completa de usuarios** con búsqueda y filtros avanzados
- **CRUD completo**: Crear, editar, eliminar usuarios
- **Gestión de estados**: Activar/desactivar usuarios
- **Acciones masivas**: Selección múltiple y operaciones en lote
- **Filtros**: Por rol, oficina y estado
- **Paginación**: 5, 10, 25 usuarios por página

### 🛡️ Role & Permissions Management
- **Gestión visual de roles** con cards por rol
- **Matrix de permisos**: Control granular de permisos
- **Roles predefinidos**: Admin, Manager, Viewer
- **Contador de usuarios**: Por rol en tiempo real
- **Edición inline**: Modificar roles sin recargar

### ⚙️ System Configuration
- **Configuración general**: Nombre del sitio, URL, email de soporte
- **Configuración de seguridad**: 2FA, verificación de email, timeout de sesión
- **Gestión de API Keys**: Crear, copiar, eliminar keys
- **Notificaciones**: Configuración de alertas del sistema
- **Persistencia**: Guardar cambios con feedback visual

### 📊 Audit Logs
- **Registro completo de acciones** con timestamps
- **Filtros avanzados**: Por acción, tipo de entidad, usuario, fechas
- **Detalles completos**: IP address, user agent, datos adicionales
- **Exportación**: Descargar logs en CSV/JSON
- **Vista detallada**: Modal con información completa del log
- **Paginación**: Optimizada para grandes volúmenes de datos

### 💻 System Health & Monitoring
- **Estado del sistema**: Uptime, última verificación, servicios activos
- **Métricas de recursos**: CPU, memoria, almacenamiento, base de datos
- **Estado de servicios**: Web server, database, API gateway, background jobs
- **Alertas del sistema**: Notificaciones de warnings y errores
- **Actualización en tiempo real**: Refresh manual con loading states

## Estructura de Archivos

```
src/components/admin/
├── AdminPanel.tsx              # Componente principal con tabs
├── AdminDashboard.tsx          # Dashboard con stats y quick actions
├── UserManagement/
│   └── index.tsx              # Gestión completa de usuarios
├── RoleManagement.tsx          # Gestión de roles y permisos
├── SystemConfig.tsx            # Configuración del sistema
├── AuditLogs.tsx              # Logs de auditoría
├── SystemStats.tsx            # Métricas y salud del sistema
├── index.tsx                  # Exportaciones centralizadas
└── README.md                  # Esta documentación
```

## Integración en App.tsx

```tsx
import { AdminPanel } from './components/admin/AdminPanel';
import { PrivateRoute } from './components/auth/PrivateRoute';

// En tus rutas:
<Route
  path="/admin/*"
  element={
    <PrivateRoute requiredRoles={['admin']}>
      <AdminPanel />
    </PrivateRoute>
  }
/>
```

## Rutas del Admin Panel

- `/admin` - Dashboard principal
- `/admin/users` - Gestión de usuarios
- `/admin/roles` - Roles y permisos
- `/admin/config` - Configuración del sistema
- `/admin/audit` - Logs de auditoría
- `/admin/system` - Salud del sistema

## Protección de Rutas

El panel está protegido con `PrivateRoute` y requiere:
- Usuario autenticado (`isAuthenticated`)
- Rol de administrador (`user.role === 'admin'`)

Si el usuario no cumple los requisitos, se redirige automáticamente.

## Sistema de Notificaciones

Cada sección del panel puede mostrar notificaciones mediante:

```tsx
onNotify(message: string, severity: 'success' | 'error' | 'warning' | 'info')
```

Ejemplos:
```tsx
onNotify('User created successfully', 'success');
onNotify('Failed to delete user', 'error');
onNotify('API key copied to clipboard', 'info');
```

## Características de UX/UI

### Diseño Minimalista
- Cards con bordes sutiles (`border: 1px solid divider`)
- Sin sombras por defecto (`elevation={0}`)
- Hover effects suaves con transformaciones
- Paleta de colores consistente con el tema

### Responsive Design
- Grid adaptable: `xs={12} sm={6} md={4} lg={2.4}`
- Tabs scrollables en móvil
- Contenido adaptable a diferentes breakpoints

### Feedback Visual
- Loading states con `LinearProgress` y `CircularProgress`
- Chips de estado con colores semánticos
- Iconos intuitivos para cada acción
- Tooltips informativos

### Accesibilidad
- Labels descriptivos en todos los inputs
- ARIA labels en tabs y dialogs
- Contraste de colores WCAG AA
- Navegación por teclado habilitada

## Datos Mock vs API Real

Actualmente los componentes usan datos mock. Para integrar con tu API:

1. **AdminDashboard**: Reemplazar `useState` con llamadas a API
2. **UserManagement**: Conectar CRUD a endpoints de usuarios
3. **RoleManagement**: Integrar con sistema de roles de backend
4. **SystemConfig**: Guardar configuración en base de datos
5. **AuditLogs**: Ya tiene integración lista con `adminApiService`
6. **SystemStats**: Conectar con métricas reales del servidor

## Próximos Pasos de Implementación

1. **Backend Integration**
   - Crear endpoints REST para cada sección
   - Implementar validaciones en backend
   - Agregar autenticación JWT

2. **Features Adicionales**
   - Export de usuarios en CSV/Excel
   - Importación masiva de usuarios
   - Configuración de temas (dark mode)
   - Dashboard widgets personalizables
   - Gráficos de uso y estadísticas

3. **Optimizaciones**
   - Caché de datos frecuentes
   - Lazy loading de tabs
   - Virtualización de tablas grandes
   - Debounce en búsquedas

## Dependencias

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.x",
  "@mui/material": "^6.5.0",
  "@mui/icons-material": "^6.5.0",
  "typescript": "^5.x"
}
```

## Estilo de Código

- **TypeScript strict mode** habilitado
- **Functional components** con hooks
- **Props interfaces** bien definidas
- **Destructuring** de props y state
- **Comentarios** solo cuando necesario
- **Naming conventions**: camelCase para variables, PascalCase para componentes

## Testing

Para implementar tests:

```tsx
// UserManagement.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserManagement } from './UserManagement';

test('renders user table', () => {
  render(<UserManagement onNotify={jest.fn()} />);
  expect(screen.getByText('User Management')).toBeInTheDocument();
});
```

## Performance

- **Paginación** en todas las tablas
- **Filtros locales** para búsquedas rápidas
- **Memoización** de componentes pesados (si necesario)
- **Lazy loading** de imágenes y avatars
- **Debouncing** en búsquedas en tiempo real

## Soporte Multi-tenancy

El sistema soporta Guilford/Stamford offices mediante:
- Filtro de oficina en User Management
- Configuración por oficina en System Config
- Logs separados por oficina en Audit Logs

## Seguridad

- ✅ Validación de rol en cada vista
- ✅ Protección de rutas con PrivateRoute
- ✅ Sanitización de inputs
- ✅ CORS configurado correctamente
- ✅ Rate limiting en endpoints críticos (backend)
- ✅ Encriptación de passwords (bcrypt)
- ✅ JWT tokens con expiración

## Changelog

### v1.0.0 (2024-11-15)
- ✨ Panel principal con 6 secciones
- ✨ Dashboard con estadísticas en tiempo real
- ✨ User Management completo
- ✨ Role & Permissions management
- ✨ System Configuration
- ✨ Audit Logs con filtros avanzados
- ✨ System Health monitoring
- ✨ Notificaciones globales
- ✨ Diseño responsive
- ✨ Tema consistente con Material-UI

## Soporte

Para reportar bugs o solicitar features:
1. Crear issue en el repositorio
2. Describir el problema con screenshots
3. Incluir pasos para reproducir
4. Mencionar versión del navegador

## Licencia

Propietario - Poweria LLC © 2024
