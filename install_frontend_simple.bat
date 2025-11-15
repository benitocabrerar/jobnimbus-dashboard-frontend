@echo off
setlocal enabledelayedexpansion
title JobNimbus MCP Frontend - Instalacion
color 0C

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - Instalacion
echo ==========================================
echo.

:: Cambiar al directorio del script
cd /d "%~dp0"

:: Verificar Node.js
echo [INFO] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no encontrado
    echo [INFO] Instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

for /f %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js !NODE_VERSION! encontrado

:: Verificar npm
echo [INFO] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no encontrado
    pause
    exit /b 1
)

for /f %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm !NPM_VERSION! encontrado

:: Verificar package.json
if not exist "package.json" (
    echo [ERROR] package.json no encontrado
    echo [INFO] Ejecuta este script desde el directorio del frontend
    pause
    exit /b 1
)

echo [SUCCESS] package.json encontrado

:: Preguntar sobre reinstalacion
if exist "node_modules" (
    echo.
    echo [INFO] node_modules ya existe
    set /p "reinstall=¿Reinstalar dependencias? (s/n): "
    if /i "!reinstall!"=="s" (
        echo [INFO] Eliminando node_modules...
        rmdir /s /q "node_modules" 2>nul
        if exist "package-lock.json" del "package-lock.json" 2>nul
        echo [SUCCESS] Limpieza completada
    )
)

:: Instalar dependencias
echo.
echo [INFO] Instalando dependencias...
echo [INFO] Esto puede tardar varios minutos...
echo.

npm install
if errorlevel 1 (
    echo [ERROR] Error en la instalacion
    echo [INFO] Intenta ejecutar: npm cache clean --force
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencias instaladas correctamente
echo.

:: Verificar instalacion basica
echo [INFO] Verificando instalacion...
if exist "node_modules" (
    echo [SUCCESS] node_modules creado
) else (
    echo [ERROR] node_modules no encontrado
    pause
    exit /b 1
)

:: Ejecutar test basico
echo [INFO] Ejecutando test basico...
npm test -- --testPathPatterns=basic.test.ts --watchAll=false >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Test basico con problemas (normal en primera instalacion)
) else (
    echo [SUCCESS] Test basico funciona
)

:: Crear .env.local si no existe
if not exist ".env.local" (
    echo [INFO] Creando configuracion local...
    (
        echo # JobNimbus MCP Frontend - Configuracion Local
        echo VITE_API_URL=http://localhost:8000
        echo VITE_MCP_SERVER_URL=ws://localhost:8001
        echo VITE_DEV_MODE=true
        echo VITE_DEBUG=false
        echo VITE_ENABLE_ANALYTICS=true
        echo VITE_ENABLE_NOTIFICATIONS=true
        echo VITE_ENABLE_ADVANCED_FILTERS=true
    ) > .env.local
    echo [SUCCESS] Archivo .env.local creado
)

echo.
echo ==========================================
echo  Instalacion Completada!
echo ==========================================
echo.
echo [SUCCESS] Frontend listo para usar
echo.
echo [INFO] Proximos pasos:
echo         - Desarrollo: start_frontend.bat
echo         - Tests: test_frontend.bat
echo         - Build: build_frontend.bat
echo.
echo [INFO] URLs:
echo         - Desarrollo: http://localhost:5173
echo         - Preview: http://localhost:4173
echo.

set /p "start_now=¿Iniciar servidor de desarrollo? (s/n): "
if /i "!start_now!"=="s" (
    echo.
    echo [INFO] Iniciando servidor...
    call start_frontend_simple.bat
) else (
    echo [INFO] Para iniciar: start_frontend_simple.bat
    pause
)