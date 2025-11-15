# Admin Panel - Guía de Integración

## 🚀 Quick Start

### 1. Verificar que las rutas estén configuradas en App.tsx

```tsx
import { AdminPanel } from './components/admin/AdminPanel';
import { PrivateRoute } from './components/auth/PrivateRoute';

// Dentro del Router:
<Route
  path="/admin/*"
  element={
    <PrivateRoute requiredRoles={['admin']}>
      <AdminPanel />
    </PrivateRoute>
  }
/>
```

### 2. Agregar link en la navegación principal

```tsx
// En App.tsx, dentro del Drawer:
<ListItemButton component={Link} to="/admin">
  <ListItemIcon>
    <AdminIcon sx={{ color: '#1976d2' }} />
  </ListItemIcon>
  <ListItemText primary="Admin Panel" />
</ListItemButton>
```

### 3. Verificar que el icono esté importado

```tsx
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
```

## 📋 Estructura Completa de Rutas

```tsx
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

  {/* Protected Routes */}
  <Route path="/" element={<PrivateRoute><DashboardView /></PrivateRoute>} />
  <Route path="/contacts" element={<PrivateRoute><ContactsView /></PrivateRoute>} />
  <Route path="/jobs" element={<PrivateRoute><JobsView /></PrivateRoute>} />

  {/* Admin Routes - Solo para rol admin */}
  <Route
    path="/admin/*"
    element={
      <PrivateRoute requiredRoles={['admin']}>
        <AdminPanel />
      </PrivateRoute>
    }
  />
</Routes>
```

## 🎨 Wireframe Visual Completo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     JobNimbus Dashboard - Admin Panel                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐                                                         │
│  │   DRAWER    │  ┌──────────────────────────────────────────────────┐ │
│  │   280px     │  │                                                  │ │
│  │             │  │  Dashboard > Admin Panel                         │ │
│  │ Dashboard   │  │                                                  │ │
│  │ Contacts    │  │  Admin Panel                                     │ │
│  │ Jobs        │  │  Complete control of your JobNimbus Dashboard    │ │
│  │ Tasks       │  │                                                  │ │
│  │ ...         │  │  ┌────────────────────────────────────────────┐ │ │
│  │ ═══════════ │  │  │ TABS:                                      │ │ │
│  │ 👤 Admin    │  │  │ [📊 Dashboard] [👥 Users] [🛡️ Roles]       │ │ │
│  │   Panel     │  │  │ [⚙️ Config] [📜 Audit] [💻 System]         │ │ │
│  └─────────────┘  │  └────────────────────────────────────────────┘ │ │
│                   │                                                  │ │
│                   │  ┌─ DASHBOARD TAB ────────────────────────────┐ │ │
│                   │  │                                            │ │ │
│                   │  │  OVERVIEW STATS                            │ │ │
│                   │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │ │ │
│                   │  │  │ 👥  │ │ 🛡️  │ │ 📝  │ │ ⚠️  │ │ ✅  │ │ │ │
│                   │  │  │ 24  │ │  3  │ │ 156 │ │  2  │ │ 98% │ │ │ │
│                   │  │  │Users│ │Roles│ │Acts │ │Issue│ │Hlth │ │ │ │
│                   │  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ │ │ │
│                   │  │                                            │ │ │
│                   │  │  ┌──────────────┬────────────────────────┐│ │ │
│                   │  │  │QUICK ACTIONS │ RECENT ACTIVITY        ││ │ │
│                   │  │  │              │                        ││ │ │
│                   │  │  │[+] Create User│✓ User updated (2m)   ││ │ │
│                   │  │  │[🔑] API Key   │✓ API created (15m)   ││ │ │
│                   │  │  │[📋] Export    │✓ Login admin (1h)    ││ │ │
│                   │  │  │[⚙️] Settings  │⚠️ Failed login (2h)  ││ │ │
│                   │  │  │[🔄] Sync Data │✓ Settings ok (3h)    ││ │ │
│                   │  │  └──────────────┴────────────────────────┘│ │ │
│                   │  └────────────────────────────────────────────┘ │ │
│                   │                                                  │ │
│                   └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          USER MANAGEMENT TAB                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  User Management                                   [+ Add User]          │
│                                                                           │
│  ┌─ FILTERS ─────────────────────────────────────────────────────────┐  │
│  │ [🔍 Search...] [Role ▼] [Office ▼] [Status ▼] [🔄]              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ TABLE ──────────────────────────────────────────────────────────┐  │
│  │ ☐ | User          | Email          | Role    | Office | Status  │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ ☐ | 🟢 John Doe   | john@mail.com  | [Admin] | Guilf. | Active  │  │
│  │ ☐ | 🟢 Jane S.    | jane@mail.com  | [Mgr]   | Stamf. | Active  │  │
│  │ ☐ | 🔴 Bob W.     | bob@mail.com   | [View]  | Guilf. | Inactive│  │
│  │                                                           [✏️][⋮] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  Rows per page: [10 ▼]  1-3 of 24                        [< 1/8 >]     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      ROLES & PERMISSIONS TAB                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Roles & Permissions                               [+ Add Role]          │
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │ 🛡️ Admin    │  │ 🛡️ Manager  │  │ 🛡️ Viewer   │                     │
│  │             │  │             │  │             │                     │
│  │ Full system │  │ Manage      │  │ Read-only   │                     │
│  │ access and  │  │ users and   │  │ access to   │                     │
│  │ control     │  │ view reports│  │ dashboard   │                     │
│  │             │  │             │  │             │                     │
│  │ 3 users     │  │ 8 users     │  │ 13 users    │                     │
│  │             │  │             │  │             │                     │
│  │ ✅ All Perms│  │ • View Users│  │ • View Dash │                     │
│  │             │  │ • Edit Users│  │ • View Rpts │                     │
│  │             │  │ • View Rpts │  │ +1 more     │                     │
│  │         [✏️] │  │         [✏️] │  │         [✏️] │                     │
│  └─────────────┘  └─────────────┘  └─────────────┘                     │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      SYSTEM CONFIGURATION TAB                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  System Configuration                          [💾 Save Changes]         │
│                                                                           │
│  ┌─────────────────────┐  ┌─────────────────────┐                       │
│  │ 🌐 GENERAL          │  │ 🔒 SECURITY         │                       │
│  │                     │  │                     │                       │
│  │ Site Name           │  │ ☑ Registration      │                       │
│  │ Site URL            │  │ ☑ Email Verify      │                       │
│  │ Support Email       │  │ ☐ Two-Factor Auth   │                       │
│  │ Session Timeout     │  │                     │                       │
│  └─────────────────────┘  └─────────────────────┘                       │
│                                                                           │
│  ┌─────────────────────┐  ┌─────────────────────┐                       │
│  │ 🔔 NOTIFICATIONS    │  │ 🔑 API KEYS         │                       │
│  │                     │  │                  [+]│                       │
│  │ ☑ Enable Notifs     │  │ • Production API    │                       │
│  │ Email: admin@...    │  │   jn_prod_xxx  [📋] │                       │
│  │                     │  │ • Development API   │                       │
│  │                     │  │   jn_dev_xxx   [📋] │                       │
│  └─────────────────────┘  └─────────────────────┘                       │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🎯 Características Clave Implementadas

### ✅ Dashboard
- [x] Stats cards con métricas en tiempo real
- [x] Hover effects en cards
- [x] Quick actions con navegación
- [x] Recent activity feed
- [x] Refresh manual de datos

### ✅ User Management
- [x] Tabla completa con filtros
- [x] Búsqueda en tiempo real
- [x] CRUD completo (Create, Read, Update, Delete)
- [x] Acciones masivas
- [x] Activar/desactivar usuarios
- [x] Paginación

### ✅ Roles & Permissions
- [x] Cards visuales por rol
- [x] Edición de roles
- [x] Gestión de permisos
- [x] Contador de usuarios por rol

### ✅ System Config
- [x] Configuración general
- [x] Configuración de seguridad
- [x] Gestión de API keys
- [x] Configuración de notificaciones

### ✅ Audit Logs
- [x] Tabla con logs completos
- [x] Filtros avanzados
- [x] Vista detallada
- [x] Exportación (estructura lista)

### ✅ System Health
- [x] Métricas de recursos
- [x] Estado de servicios
- [x] Alertas del sistema
- [x] Uptime tracking

## 🔐 Control de Acceso

### Verificación de Rol
```tsx
// En AdminPanel.tsx
if (user?.role !== 'admin') {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Alert severity="error">
        Access Denied. Only administrators can access this panel.
      </Alert>
    </Container>
  );
}
```

### PrivateRoute con Roles
```tsx
<PrivateRoute requiredRoles={['admin']}>
  <AdminPanel />
</PrivateRoute>
```

## 📱 Responsive Breakpoints

```tsx
// Stats cards adaptables
<Grid item xs={12} sm={6} md={4} lg={2.4}>

// Tabs scrollables en móvil
<Tabs variant="scrollable" scrollButtons="auto">

// Padding responsive
<Box sx={{ px: { xs: 2, md: 3 } }}>
```

## 🎨 Paleta de Colores

```tsx
const colors = {
  primary: '#1976d2',     // Azul principal
  success: '#4caf50',     // Verde
  warning: '#ff9800',     // Naranja
  error: '#f44336',       // Rojo
  info: '#0288d1',        // Azul claro
  admin: '#d32f2f',       // Rojo admin
  manager: '#ed6c02',     // Naranja manager
  viewer: '#0288d1',      // Azul viewer
};
```

## 🔔 Sistema de Notificaciones

```tsx
// En cualquier componente hijo
interface ComponentProps {
  onNotify: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

// Uso
onNotify('Operation completed successfully', 'success');
onNotify('An error occurred', 'error');
onNotify('Please review this action', 'warning');
onNotify('Additional information', 'info');
```

## 🚀 Next Steps

### Backend Integration
1. Crear endpoints REST para cada sección
2. Implementar validaciones
3. Agregar autenticación JWT en todos los endpoints
4. Configurar CORS correctamente

### Features Pendientes
- [ ] Export real de logs (CSV/JSON)
- [ ] Import masivo de usuarios
- [ ] Configuración de dark mode
- [ ] Gráficos de uso
- [ ] Email notifications
- [ ] WebSocket para updates en tiempo real
- [ ] Backup y restore del sistema
- [ ] Multi-language support

### Optimizaciones
- [ ] Lazy loading de tabs
- [ ] Virtualización de tablas grandes
- [ ] Caché de datos frecuentes
- [ ] Service Worker para offline support

## 📞 Troubleshooting

### La ruta /admin no funciona
**Solución**: Verificar que la ruta esté definida en App.tsx con el path `/admin/*`

### El usuario admin no puede acceder
**Solución**: Verificar que `user.role === 'admin'` en el contexto de autenticación

### Las notificaciones no aparecen
**Solución**: Verificar que el Snackbar esté en AdminPanel.tsx y que `onNotify` se pase correctamente a los componentes hijos

### Los estilos no se aplican correctamente
**Solución**: Verificar que Material-UI 6.5.0 esté instalado correctamente:
```bash
npm install @mui/material@^6.5.0 @mui/icons-material@^6.5.0
```

## 📝 Changelog

### v1.0.0 - Initial Release (2024-11-15)
- ✨ Admin Panel completo con 6 secciones
- ✨ Dashboard con estadísticas
- ✨ User Management CRUD
- ✨ Role Management
- ✨ System Configuration
- ✨ Audit Logs
- ✨ System Health Monitoring
- ✨ Responsive design
- ✨ Sistema de notificaciones
- ✨ Protección de rutas

## 📚 Referencias

- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JobNimbus API Documentation](internal)

---

**Creado por**: Poweria Development Team
**Fecha**: 2024-11-15
**Versión**: 1.0.0
