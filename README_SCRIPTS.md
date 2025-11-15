# JobNimbus MCP Frontend - Scripts de Gestión

## 📋 Scripts Disponibles

### 🚀 `start_frontend.bat`
**Servidor de Desarrollo**

Inicia el servidor de desarrollo de Vite con hot-reload.

**Características:**
- ✅ Verificación de Node.js y dependencias
- ✅ Instalación automática de dependencias si no existen
- ✅ Verificación de puertos disponibles
- ✅ Apertura automática del navegador
- ✅ Información detallada del proceso
- ✅ Manejo de errores

**URL:** http://localhost:5173

```bash
# Uso directo
./start_frontend.bat

# O hacer doble click en el archivo
```

---

### 🔨 `build_frontend.bat`
**Build de Producción**

Construye la aplicación optimizada para producción.

**Características:**
- ✅ Verificación de tipos TypeScript
- ✅ Ejecución de tests antes del build
- ✅ Limpieza de builds anteriores
- ✅ Optimizaciones de Vite (minificación, tree-shaking)
- ✅ Cálculo de tamaño del build
- ✅ Opción de vista previa inmediata

**Salida:** `dist/` folder

```bash
# Uso
./build_frontend.bat

# Vista previa después del build
npm run preview
```

---

### 🧪 `test_frontend.bat`
**Suite de Testing**

Menu interactivo para ejecutar diferentes tipos de tests.

**Opciones disponibles:**
1. **Todos los tests** - Ejecución completa sin coverage
2. **Tests con coverage** - Reporte detallado de cobertura
3. **Modo Watch** - Tests automáticos al guardar archivos
4. **Tests básicos** - Solo verificaciones fundamentales
5. **Tests de componentes** - Componentes React específicos
6. **Tests de integración** - Pruebas end-to-end
7. **Linting** - Verificación de calidad de código
8. **Type checking** - Validación de TypeScript

**Reportes generados:**
- Coverage HTML: `coverage/lcov-report/index.html`
- Coverage LCOV: `coverage/lcov.info`
- Coverage JSON: `coverage/coverage-final.json`

```bash
# Uso interactivo
./test_frontend.bat

# Tests específicos (directo)
npm test -- --testNamePattern="AdvancedFilters"
npm test -- --testPathPatterns="components"
```

---

### ⚙️ `install_frontend.bat`
**Instalación y Configuración**

Script completo de setup inicial del proyecto.

**Proceso de instalación:**
1. **Verificación de prerequisitos** (Node.js, npm)
2. **Información del proyecto** (package.json)
3. **Limpieza opcional** de instalaciones previas
4. **Instalación de dependencias** (npm install)
5. **Auditoría de seguridad** (npm audit)
6. **Verificaciones de configuración**
7. **Tests básicos de funcionalidad**
8. **Creación de .env.local**
9. **Opción de inicio inmediato**

**Configuración automática:**
- Archivo `.env.local` con variables de entorno
- Verificación de herramientas (TypeScript, Vite)
- Configuración de scripts npm

```bash
# Primera instalación
./install_frontend.bat

# Re-instalación limpia
# (elimina node_modules y reinstala todo)
```

---

## 🛠️ Configuración Técnica

### Variables de Entorno (.env.local)
```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_MCP_SERVER_URL=ws://localhost:8001

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG=false

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ADVANCED_FILTERS=true
```

### Stack Tecnológico
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **UI Library:** Material-UI 6
- **Charts:** Recharts 3
- **Date Pickers:** MUI X Date Pickers
- **Testing:** Jest + Testing Library
- **Linting:** ESLint + TypeScript ESLint

### Scripts NPM Incluidos
```json
{
  "dev": "vite",
  "build": "vite build", 
  "preview": "vite preview",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "lint": "eslint src --ext .ts,.tsx",
  "lint:fix": "eslint src --ext .ts,.tsx --fix",
  "type-check": "tsc --noEmit"
}
```

## 🚨 Troubleshooting

### Problemas Comunes

**1. "Node.js no está instalado"**
```bash
# Solución: Instalar Node.js LTS desde nodejs.org
https://nodejs.org/
```

**2. "Error al instalar dependencias"**
```bash
# Limpiar caché y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**3. "Puerto 5173 en uso"**
```bash
# Vite usa puerto alternativo automáticamente
# O especificar puerto manualmente:
npm run dev -- --port 3000
```

**4. "Tests fallan"**
```bash
# Verificar configuración Jest
npm test -- --verbose
npm test -- --detectOpenHandles
```

**5. "Build falla"**
```bash
# Verificar tipos TypeScript primero
npm run type-check
# Luego intentar build
npm run build
```

### Logs y Debugging

**Ubicaciones de logs:**
- Vite Dev Server: Console output
- Test results: Terminal + coverage/
- Build output: dist/ + console
- NPM errors: npm-debug.log

**Comandos de debugging:**
```bash
# Información detallada de dependencias
npm list
npm outdated

# Verificar configuración
npm config list
npm doctor

# Limpiar completamente
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📊 Métricas y Monitoreo

### Coverage de Tests
- **Target mínimo:** 80% de cobertura
- **Componentes críticos:** 90%+ cobertura
- **Reportes:** HTML + LCOV + JSON

### Performance Build
- **Bundle size:** < 2MB (gzipped)
- **Chunk splitting:** Automático por Vite
- **Tree shaking:** Habilitado
- **Minification:** Terser (production)

### Calidad de Código
- **ESLint:** Reglas TypeScript + React
- **TypeScript:** Strict mode habilitado
- **Prettier:** Formato automático (opcional)

---

## 🔗 Enlaces Útiles

- **Documentación Vite:** https://vitejs.dev/
- **React Docs:** https://react.dev/
- **Material-UI:** https://mui.com/
- **Testing Library:** https://testing-library.com/
- **JobNimbus API:** http://localhost:8000/docs

---

*Generado por PowerIA Enterprise - JobNimbus MCP Integration*