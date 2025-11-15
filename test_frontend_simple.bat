@echo off
setlocal enabledelayedexpansion
title JobNimbus MCP Frontend - Tests
color 0E

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - Tests
echo ==========================================
echo.

:: Cambiar al directorio del script
cd /d "%~dp0"

:: Verificar Node.js y dependencias
if not exist "node_modules" (
    echo [ERROR] node_modules no encontrado
    echo [INFO] Ejecuta primero: install_frontend_simple.bat
    pause
    exit /b 1
)

echo [INFO] Opciones de testing:
echo.
echo 1. Ejecutar todos los tests
echo 2. Tests con coverage
echo 3. Tests en modo watch
echo 4. Solo tests basicos
echo 5. Tests de componentes
echo 6. Type checking
echo 7. Lint codigo
echo.

set /p "choice=Selecciona opcion (1-7): "

if "%choice%"=="1" (
    echo [INFO] Ejecutando todos los tests...
    npm test -- --watchAll=false
)

if "%choice%"=="2" (
    echo [INFO] Tests con coverage...
    npm run test:coverage
    if exist "coverage\lcov-report\index.html" (
        echo [INFO] Abriendo reporte de coverage...
        start coverage\lcov-report\index.html
    )
)

if "%choice%"=="3" (
    echo [INFO] Modo watch activo...
    echo [INFO] Presiona 'q' para salir
    npm run test:watch
)

if "%choice%"=="4" (
    echo [INFO] Tests basicos...
    npm test -- --watchAll=false --testPathPatterns="basic.test.ts"
)

if "%choice%"=="5" (
    echo [INFO] Tests de componentes...
    npm test -- --watchAll=false --testPathPatterns="components"
)

if "%choice%"=="6" (
    echo [INFO] Verificando TypeScript...
    npm run type-check
)

if "%choice%"=="7" (
    echo [INFO] Verificando codigo...
    npm run lint
)

if "%choice%" lss "1" goto invalid
if "%choice%" gtr "7" goto invalid
goto end

:invalid
echo [ERROR] Opcion invalida
echo [INFO] Ejecutando tests por defecto...
npm test -- --watchAll=false

:end
echo.
echo [INFO] Testing completado
pause