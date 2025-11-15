# JobNimbus MCP Frontend

Frontend gerencial moderno para el servidor MCP JobNimbus.

## Requisitos

- Node.js 18+
- Backend MCP corriendo (endpoint `/chat` disponible)

## Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Conexión al backend MCP

Por defecto, las peticiones al endpoint `/chat` se hacen relativas. Si el backend está en otro host/puerto, usa un proxy en `vite.config.ts`:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chat': 'http://localhost:8000' // Cambia el puerto según tu backend
    }
  }
});
```

## Funcionalidades

- Dashboard con KPIs, gráficas avanzadas y tabla de trabajos activos
- Filtros avanzados y consultas predefinidas
- Exportación de tablas y visualizaciones a PDF y CSV
- Chat UI tipo ChatGPT conectado a `/chat`
- Diseño moderno, responsivo y atractivo (MUI)
- Pruebas automáticas básicas (Jest/React Testing Library)

## Pruebas automáticas

```bash
npm test
```

## Estructura recomendada para frontend avanzado MCP JobNimbus

```
src/
  components/
    DataTable.tsx
    FilterBar.tsx
    ExportMenu.tsx
    KPIWidget.tsx
    ChartWidget.tsx
    ChatUI.tsx
    ...
  views/
    ContactsView.tsx
    PaymentsView.tsx
    TaskTypesView.tsx
    ActivityTypesView.tsx
    LocationsView.tsx
    DashboardView.tsx
  hooks/
    useFetch.ts
    useFilters.ts
    useExport.ts
  utils/
    api.ts
    exportUtils.ts
    kpiUtils.ts
  theme/
    theme.ts
    ...
  routes.tsx
  App.tsx
  main.tsx
  style.css
```

- Cada recurso tiene su vista y usa componentes reutilizables.
- Los hooks y utilidades centralizan lógica de negocio y acceso a datos.
- El tema y los estilos aseguran diseño profesional y accesible.
- Las rutas permiten navegación SPA.
