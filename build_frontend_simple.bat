@echo off
setlocal enabledelayedexpansion
title JobNimbus MCP Frontend - Build
color 0B

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - Build
echo ==========================================
echo.

:: Cambiar al directorio del script
cd /d "%~dp0"

:: Verificar dependencias
if not exist "node_modules" (
    echo [ERROR] node_modules no encontrado
    echo [INFO] Ejecuta primero: install_frontend_simple.bat
    pause
    exit /b 1
)

:: Limpiar build anterior
if exist "dist" (
    echo [INFO] Limpiando build anterior...
    rmdir /s /q "dist"
    echo [SUCCESS] Build anterior eliminado
)

:: Type checking
echo [INFO] Verificando TypeScript...
npm run type-check
if errorlevel 1 (
    echo [WARNING] Errores de TypeScript
    set /p "continue=¿Continuar con el build? (s/n): "
    if /i "!continue!" neq "s" (
        echo [INFO] Build cancelado
        pause
        exit /b 1
    )
)

:: Ejecutar build
echo.
echo [INFO] Construyendo aplicacion...
echo [INFO] Esto puede tardar unos minutos...
echo.

npm run build

if errorlevel 1 (
    echo [ERROR] Error en el build
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Build Completado!
echo ==========================================
echo.

:: Mostrar informacion del build
if exist "dist" (
    echo [SUCCESS] Build generado en: dist/
    echo.
    echo [INFO] Archivos generados:
    dir /b "dist"
    echo.
    
    echo [INFO] Para usar el build:
    echo         - npm run preview : Vista previa local
    echo         - Subir 'dist/' a servidor web
    echo.
    
    set /p "preview=¿Ver preview del build? (s/n): "
    if /i "!preview!"=="s" (
        echo [INFO] Iniciando preview...
        start /b cmd /c "timeout /t 3 >nul & start http://localhost:4173"
        npm run preview
    )
) else (
    echo [ERROR] No se genero el directorio dist/
)

echo.
pause