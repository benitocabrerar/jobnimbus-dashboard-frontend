# 🚀 JobNimbus MCP Frontend - Instrucciones de Uso

## ⚠️ IMPORTANTE: Cómo ejecutar los scripts

Los archivos `.bat` deben ejecutarse desde **Command Prompt de Windows** (cmd), no desde bash o terminal de Git.

### 📋 Métodos de ejecución:

#### Método 1: Doble Click (Más Fácil)
```
1. Ve a la carpeta: C:\Users\benito\poweria\jobnimbus\frontend\
2. Haz doble click en: install_frontend_simple.bat
```

#### Método 2: Command Prompt
```cmd
# Abrir CMD como administrador (opcional)
Win + R → cmd → Enter

# Navegar a la carpeta
cd C:\Users\benito\poweria\jobnimbus\frontend

# Ejecutar script
install_frontend_simple.bat
```

#### Método 3: PowerShell
```powershell
# Abrir PowerShell
Win + X → Windows PowerShell

# Navegar a la carpeta
cd C:\Users\benito\poweria\jobnimbus\frontend

# Ejecutar script
.\install_frontend_simple.bat
```

## 🔄 Orden de ejecución recomendado:

### 1️⃣ Primera vez - Instalación
```
install_frontend_simple.bat
```
**Qué hace:**
- ✅ Verifica Node.js y npm
- ✅ Instala todas las dependencias
- ✅ Crea configuración local (.env.local)
- ✅ Ejecuta verificaciones básicas
- ✅ Opción de iniciar servidor automáticamente

### 2️⃣ Desarrollo diario - Servidor
```
start_frontend_simple.bat
```
**Qué hace:**
- ✅ Inicia servidor de desarrollo en http://localhost:5173
- ✅ Abre navegador automáticamente
- ✅ Hot reload activado
- ✅ Presiona Ctrl+C para detener

### 3️⃣ Testing - Pruebas
```
test_frontend_simple.bat
```
**Opciones disponibles:**
1. Todos los tests
2. Tests con coverage
3. Modo watch (automático)
4. Tests básicos
5. Tests de componentes  
6. Verificación TypeScript
7. Linting de código

### 4️⃣ Producción - Build
```
build_frontend_simple.bat
```
**Qué hace:**
- ✅ Verificación de tipos
- ✅ Build optimizado
- ✅ Genera carpeta `dist/`
- ✅ Opción de preview
- ✅ Listo para subir a servidor

## 🛠️ Solución de Problemas

### ❌ "No pasa nada cuando ejecuto el archivo"

**Problema:** Ejecutando desde terminal bash/git
**Solución:** Usar Command Prompt o PowerShell de Windows

### ❌ "Node.js no encontrado"

**Solución:**
```cmd
# Verificar instalación
node --version
npm --version

# Si no está instalado:
# 1. Ve a https://nodejs.org/
# 2. Descarga versión LTS
# 3. Instala y reinicia terminal
```

### ❌ "Error en npm install"

**Solución:**
```cmd
# Limpiar caché
npm cache clean --force

# Eliminar node_modules y reinstalar
rmdir /s node_modules
del package-lock.json
npm install
```

### ❌ "Puerto 5173 ocupado"

**Solución:** Vite automáticamente usará otro puerto (5174, 5175, etc.)

## 📱 URLs Importantes

- **Desarrollo:** http://localhost:5173
- **Preview Build:** http://localhost:4173  
- **Backend API:** http://localhost:8000
- **MCP Server:** ws://localhost:8001

## 🔧 Comandos Directos (Alternativos)

Si prefieres usar comandos directos desde la carpeta del frontend:

```cmd
# Instalación
npm install

# Desarrollo
npm run dev

# Tests
npm test

# Build
npm run build

# Preview
npm run preview

# Type check
npm run type-check

# Linting
npm run lint
```

## 📊 Estructura de Archivos

```
frontend/
├── install_frontend_simple.bat    ← Instalación
├── start_frontend_simple.bat      ← Servidor desarrollo  
├── test_frontend_simple.bat       ← Tests
├── build_frontend_simple.bat      ← Build producción
├── .env.local                     ← Configuración (auto-generado)
├── package.json                   ← Dependencias
├── dist/                          ← Build final (generado)
└── src/                          ← Código fuente
```

## 🎯 Primeros Pasos Rápidos

1. **Abrir Command Prompt:**
   - `Win + R` → escribir `cmd` → Enter

2. **Navegar al proyecto:**
   ```cmd
   cd C:\Users\benito\poweria\jobnimbus\frontend
   ```

3. **Ejecutar instalación:**
   ```cmd
   install_frontend_simple.bat
   ```

4. **¡Listo!** El script te guiará paso a paso.

---

💡 **Tip:** Una vez instalado, simplemente haz doble click en `start_frontend_simple.bat` para iniciar el desarrollo.

🆘 **Soporte:** Si tienes problemas, revisa que estés usando Command Prompt de Windows (cmd) y no bash/terminal de Git.