@echo off
setlocal enabledelayedexpansion
title JobNimbus MCP Frontend - Servidor Desarrollo
color 0A

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - Servidor
echo ==========================================
echo.

:: Cambiar al directorio del script
cd /d "%~dp0"

:: Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no encontrado
    echo [INFO] Ejecuta primero: install_frontend_simple.bat
    pause
    exit /b 1
)

:: Mostrar version de Node
for /f %%i in ('node --version') do set NODE_VERSION=%%i
echo [INFO] Node.js !NODE_VERSION!

:: Verificar package.json
if not exist "package.json" (
    echo [ERROR] package.json no encontrado
    pause
    exit /b 1
)

:: Verificar node_modules
if not exist "node_modules" (
    echo [ERROR] node_modules no encontrado
    echo [INFO] Ejecuta primero: install_frontend_simple.bat
    pause
    exit /b 1
)

:: Mostrar informacion
echo [INFO] Directorio: %cd%
echo [INFO] Puerto: http://localhost:5173
echo.

:: Verificar puerto 5173
netstat -an | find "5173" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Puerto 5173 en uso
    echo [INFO] Vite usara puerto alternativo
    echo.
)

echo [INFO] Iniciando servidor de desarrollo...
echo [INFO] Presiona Ctrl+C para detener
echo.
echo ==========================================
echo  Servidor iniciando...
echo ==========================================
echo.

:: Abrir navegador despues de 5 segundos en background
start /b cmd /c "timeout /t 5 >nul 2>&1 & start http://localhost:5173"

:: Iniciar Vite
npm run dev

:: Si se detiene el servidor
echo.
echo ==========================================
echo  Servidor detenido
echo ==========================================
echo.
echo [INFO] Servidor detenido
echo [INFO] Para reiniciar ejecuta este archivo
pause