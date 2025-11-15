@echo off
title JobNimbus MCP Frontend - Build Production
color 0B

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - Build Production
echo ==========================================
echo.
echo [INFO] Construyendo aplicación para producción...
echo [INFO] Framework: React + TypeScript + Vite
echo [INFO] Optimizaciones: Minificación, Tree-shaking, Code-splitting
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

:: Limpiar build anterior si existe
if exist "dist" (
    echo [INFO] Limpiando build anterior...
    rmdir /s /q "dist"
    echo [SUCCESS] Build anterior eliminado
    echo.
)

:: Ejecutar type checking
echo [INFO] Verificando tipos TypeScript...
npm run type-check
if errorlevel 1 (
    echo [ERROR] Errores de TypeScript encontrados
    echo [WARNING] Continuando con el build...
    echo.
)

:: Ejecutar tests
echo [INFO] Ejecutando tests...
npm test -- --watchAll=false --coverage=false
if errorlevel 1 (
    echo [WARNING] Algunos tests fallaron
    echo [INFO] Continuando con el build...
    echo.
) else (
    echo [SUCCESS] Todos los tests pasaron
    echo.
)

:: Construir la aplicación
echo ==========================================
echo  Iniciando build de producción...
echo ==========================================
echo.
npm run build

if errorlevel 1 (
    echo [ERROR] Error en el build de producción
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Build completado exitosamente!
echo ==========================================
echo.

:: Mostrar información del build
if exist "dist" (
    echo [SUCCESS] Archivos generados en: %cd%\dist
    echo.
    echo [INFO] Contenido del build:
    dir /b "dist"
    echo.
    
    :: Calcular tamaño del build
    echo [INFO] Tamaño del build:
    for /f %%A in ('dir /s "dist" ^| find "File(s)"') do echo %%A
    echo.
    
    echo [INFO] Para servir la aplicación:
    echo         - npm run preview  : Servidor de vista previa local
    echo         - Copiar 'dist' a tu servidor web
    echo.
    
    :: Preguntar si quiere ejecutar preview
    set /p "run_preview=[PREGUNTA] ¿Deseas ejecutar vista previa del build? (y/n): "
    if /i "%run_preview%"=="y" (
        echo.
        echo [INFO] Iniciando vista previa...
        echo [INFO] Presiona Ctrl+C para detener
        echo.
        start /b timeout /t 3 >nul 2>&1 && start http://localhost:4173
        npm run preview
    )
) else (
    echo [ERROR] No se pudo encontrar el directorio 'dist'
    echo [ERROR] El build puede haber fallado
)

echo.
echo [INFO] Proceso de build finalizado
pause