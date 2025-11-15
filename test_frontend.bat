@echo off
title JobNimbus MCP Frontend - Tests
color 0E

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - Testing Suite
echo ==========================================
echo.
echo [INFO] Ejecutando suite de tests...
echo [INFO] Framework: Jest + Testing Library
echo [INFO] Cobertura: Coverage reports incluidos
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado o no está en el PATH
    echo [INFO] Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

:: Cambiar al directorio del frontend
cd /d "%~dp0"

:: Verificar si package.json existe
if not exist "package.json" (
    echo [ERROR] package.json no encontrado
    echo [INFO] Asegúrate de estar en el directorio correcto del frontend
    pause
    exit /b 1
)

:: Verificar si node_modules existe
if not exist "node_modules" (
    echo [WARNING] node_modules no encontrado
    echo [INFO] Instalando dependencias...
    echo.
    npm install
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencias instaladas correctamente
    echo.
)

:: Mostrar menú de opciones
echo [INFO] Opciones de testing disponibles:
echo.
echo 1. Ejecutar todos los tests (sin coverage)
echo 2. Ejecutar todos los tests con coverage
echo 3. Ejecutar tests en modo watch
echo 4. Ejecutar solo tests básicos
echo 5. Ejecutar tests de componentes
echo 6. Ejecutar tests de integración
echo 7. Linting (verificar código)
echo 8. Type checking (verificar TypeScript)
echo.

set /p "choice=Selecciona una opción (1-8): "

if "%choice%"=="1" (
    echo.
    echo ==========================================
    echo  Ejecutando todos los tests
    echo ==========================================
    npm test -- --watchAll=false
)

if "%choice%"=="2" (
    echo.
    echo ==========================================
    echo  Ejecutando tests con coverage
    echo ==========================================
    npm run test:coverage
    echo.
    echo [INFO] Reporte de coverage generado en: coverage/
    if exist "coverage\lcov-report\index.html" (
        set /p "open_coverage=[PREGUNTA] ¿Abrir reporte HTML de coverage? (y/n): "
        if /i "!open_coverage!"=="y" (
            start coverage\lcov-report\index.html
        )
    )
)

if "%choice%"=="3" (
    echo.
    echo ==========================================
    echo  Modo Watch - Tests automáticos
    echo ==========================================
    echo [INFO] Los tests se ejecutarán automáticamente al guardar archivos
    echo [INFO] Presiona 'q' para salir del modo watch
    echo.
    npm run test:watch
)

if "%choice%"=="4" (
    echo.
    echo ==========================================
    echo  Ejecutando tests básicos
    echo ==========================================
    npm test -- --watchAll=false --testPathPatterns="basic.test.ts"
)

if "%choice%"=="5" (
    echo.
    echo ==========================================
    echo  Ejecutando tests de componentes
    echo ==========================================
    npm test -- --watchAll=false --testPathPatterns="components"
)

if "%choice%"=="6" (
    echo.
    echo ==========================================
    echo  Ejecutando tests de integración
    echo ==========================================
    npm test -- --watchAll=false --testPathPatterns="integration"
)

if "%choice%"=="7" (
    echo.
    echo ==========================================
    echo  Verificación de Linting
    echo ==========================================
    if exist "package.json" (
        findstr /C:"lint" package.json >nul 2>&1
        if not errorlevel 1 (
            npm run lint
        ) else (
            echo [WARNING] Script de linting no configurado
            echo [INFO] Instalando ESLint...
            npm install --save-dev eslint @typescript-eslint/eslint-plugin
        )
    )
)

if "%choice%"=="8" (
    echo.
    echo ==========================================
    echo  Verificación de TypeScript
    echo ==========================================
    if exist "package.json" (
        findstr /C:"type-check" package.json >nul 2>&1
        if not errorlevel 1 (
            npm run type-check
        ) else (
            echo [INFO] Ejecutando verificación directa con tsc...
            npx tsc --noEmit
        )
    )
)

:: Verificar si la opción es válida
if "%choice%" lss "1" goto invalid_choice
if "%choice%" gtr "8" goto invalid_choice
goto end

:invalid_choice
echo.
echo [ERROR] Opción inválida. Ejecutando tests por defecto...
echo.
npm test -- --watchAll=false

:end
echo.
echo ==========================================
echo  Testing completado
echo ==========================================
echo.

:: Mostrar resumen si hay archivos de coverage
if exist "coverage\lcov.info" (
    echo [INFO] Archivos de coverage disponibles en: coverage/
    echo [INFO] Formatos: HTML, LCOV, Text
)

if exist "coverage\clover.xml" (
    echo [INFO] Reporte XML disponible para CI/CD
)

echo.
echo [INFO] Para ejecutar tests específicos:
echo         npm test -- --testNamePattern="nombre del test"
echo         npm test -- --testPathPatterns="archivo específico"
echo.
echo [INFO] Para debugging:
echo         npm test -- --verbose
echo         npm test -- --detectOpenHandles
echo.

pause