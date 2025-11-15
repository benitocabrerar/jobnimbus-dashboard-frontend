@echo off
title JobNimbus MCP Frontend - Instalación
color 0C

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - Instalación
echo ==========================================
echo.
echo [INFO] Configurando entorno de desarrollo...
echo [INFO] React + TypeScript + Vite + Material-UI
echo.

:: Verificar si Node.js está instalado
echo [INFO] Verificando prerequisitos...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado
    echo.
    echo [INFO] Para instalar Node.js:
    echo         1. Ve a https://nodejs.org/
    echo         2. Descarga la version LTS
    echo         3. Instala y reinicia este script
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no está disponible
    pause
    exit /b 1
)

:: Mostrar versiones
echo [SUCCESS] Node.js version:
node --version
echo [SUCCESS] npm version:
npm --version
echo.

:: Cambiar al directorio del frontend
cd /d "%~dp0"
echo [INFO] Directorio de trabajo: %cd%
echo.

:: Verificar si package.json existe
if not exist "package.json" (
    echo [ERROR] package.json no encontrado
    echo [INFO] Asegúrate de estar en el directorio correcto del frontend
    pause
    exit /b 1
)

:: Mostrar información del proyecto
echo [INFO] Información del proyecto:
findstr /C:"name" /C:"version" /C:"description" package.json 2>nul
echo.

:: Limpiar instalación anterior si existe
if exist "node_modules" (
    set /p "clean_install=[PREGUNTA] ¿Limpiar instalación anterior? (y/n): "
    if /i "!clean_install!"=="y" (
        echo [INFO] Limpiando node_modules...
        rmdir /s /q "node_modules"
        if exist "package-lock.json" (
            del "package-lock.json"
        )
        echo [SUCCESS] Instalación anterior limpiada
        echo.
    )
)

:: Limpiar caché de npm
echo [INFO] Limpiando caché de npm...
npm cache clean --force >nul 2>&1
echo [SUCCESS] Caché limpiada
echo.

:: Instalar dependencias
echo ==========================================
echo  Instalando dependencias...
echo ==========================================
echo.
echo [INFO] Esto puede tomar varios minutos...
echo [INFO] Instalando paquetes de producción y desarrollo...
echo.

npm install
if errorlevel 1 (
    echo [ERROR] Error durante la instalación de dependencias
    echo.
    echo [INFO] Intentos de solución:
    echo         1. Verificar conexión a internet
    echo         2. Ejecutar: npm cache clean --force
    echo         3. Eliminar node_modules y package-lock.json
    echo         4. Ejecutar este script nuevamente
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencias instaladas correctamente
echo.

:: Verificar instalación
echo [INFO] Verificando instalación...
if exist "node_modules" (
    echo [SUCCESS] node_modules creado
)

if exist "package-lock.json" (
    echo [SUCCESS] package-lock.json generado
)

:: Mostrar dependencias principales
echo.
echo [INFO] Dependencias principales instaladas:
echo.
findstr /C:"react" /C:"typescript" /C:"@mui" /C:"vite" package.json | findstr /C:"dependencies"
echo.

:: Ejecutar auditoría de seguridad
echo [INFO] Ejecutando auditoría de seguridad...
npm audit --audit-level=moderate
if errorlevel 1 (
    echo.
    echo [WARNING] Se encontraron vulnerabilidades
    set /p "fix_audit=[PREGUNTA] ¿Intentar arreglar automáticamente? (y/n): "
    if /i "!fix_audit!"=="y" (
        npm audit fix
        echo [INFO] Intentos de reparación completados
    )
)
echo.

:: Verificar scripts disponibles
echo ==========================================
echo  Verificando configuración...
echo ==========================================
echo.
echo [INFO] Scripts disponibles:
npm run 2>&1 | findstr /V "Lifecycle" | findstr /V "available"
echo.

:: Ejecutar verificaciones básicas
echo [INFO] Ejecutando verificaciones básicas...

:: Verificar TypeScript
echo [INFO] Verificando TypeScript...
npx tsc --version >nul 2>&1
if not errorlevel 1 (
    echo [SUCCESS] TypeScript configurado
) else (
    echo [WARNING] TypeScript no detectado
)

:: Verificar Vite
echo [INFO] Verificando Vite...
npx vite --version >nul 2>&1
if not errorlevel 1 (
    echo [SUCCESS] Vite configurado
) else (
    echo [WARNING] Vite no detectado
)

:: Test básico de instalación
echo [INFO] Ejecutando test básico...
npm test -- --testPathPatterns=basic.test.ts --watchAll=false >nul 2>&1
if not errorlevel 1 (
    echo [SUCCESS] Tests básicos funcionando
) else (
    echo [WARNING] Tests básicos con problemas
)

echo.
echo ==========================================
echo  Instalación Completada!
echo ==========================================
echo.
echo [SUCCESS] El frontend está listo para usar
echo.
echo [INFO] Próximos pasos:
echo         1. Ejecutar desarrollo: start_frontend.bat
echo         2. Ejecutar tests: test_frontend.bat  
echo         3. Build producción: build_frontend.bat
echo.
echo [INFO] URLs importantes:
echo         - Desarrollo: http://localhost:5173
echo         - Preview: http://localhost:4173
echo.
echo [INFO] Comandos directos:
echo         - npm run dev      : Servidor desarrollo
echo         - npm run build    : Build producción
echo         - npm test         : Ejecutar tests
echo         - npm run lint     : Verificar código
echo.

:: Crear archivo de configuración local si no existe
if not exist ".env.local" (
    echo [INFO] Creando archivo de configuración local...
    (
        echo # JobNimbus MCP Frontend - Configuración Local
        echo # Generado automáticamente por install_frontend.bat
        echo.
        echo # API Configuration
        echo VITE_API_URL=http://localhost:8000
        echo VITE_MCP_SERVER_URL=ws://localhost:8001
        echo.
        echo # Development Settings
        echo VITE_DEV_MODE=true
        echo VITE_DEBUG=false
        echo.
        echo # Feature Flags
        echo VITE_ENABLE_ANALYTICS=true
        echo VITE_ENABLE_NOTIFICATIONS=true
        echo VITE_ENABLE_ADVANCED_FILTERS=true
    ) > .env.local
    echo [SUCCESS] Archivo .env.local creado
)

echo.
set /p "start_dev=[PREGUNTA] ¿Iniciar servidor de desarrollo ahora? (y/n): "
if /i "!start_dev!"=="y" (
    echo.
    echo [INFO] Iniciando servidor de desarrollo...
    call start_frontend.bat
) else (
    echo.
    echo [INFO] Para iniciar el desarrollo ejecuta: start_frontend.bat
    echo.
    pause
)