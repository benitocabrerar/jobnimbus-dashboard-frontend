@echo off
title JobNimbus MCP Frontend - PowerIA Enterprise
color 0A

echo.
echo ==========================================
echo  JobNimbus MCP Frontend - PowerIA Enterprise
echo ==========================================
echo.
echo [INFO] Iniciando servidor de desarrollo...
echo [INFO] Puerto: http://localhost:5173
echo [INFO] Framework: React + TypeScript + Vite
echo [INFO] UI: Material-UI + Recharts
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado o no está en el PATH
    echo [INFO] Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

:: Mostrar versión de Node.js
echo [INFO] Node.js version:
node --version

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

:: Verificar si el puerto 5173 está en uso
netstat -an | find "5173" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] El puerto 5173 parece estar en uso
    echo [INFO] Vite intentará usar un puerto alternativo automáticamente
    echo.
)

:: Mostrar información del proyecto
echo [INFO] Proyecto: %cd%
echo [INFO] Scripts disponibles:
echo         - npm run dev     : Servidor de desarrollo
echo         - npm run build   : Build de producción
echo         - npm run preview : Vista previa del build
echo         - npm test        : Ejecutar tests
echo.

:: Iniciar el servidor de desarrollo
echo [INFO] Ejecutando: npm run dev
echo [INFO] Presiona Ctrl+C para detener el servidor
echo.
echo ==========================================
echo  Servidor iniciando...
echo ==========================================
echo.

:: Abrir el navegador después de 3 segundos
start /b timeout /t 3 >nul 2>&1 && start http://localhost:5173

:: Ejecutar el servidor de desarrollo
npm run dev

:: Si el servidor se detiene, mostrar mensaje
echo.
echo ==========================================
echo  Servidor detenido
echo ==========================================
echo.
echo [INFO] El servidor de desarrollo se ha detenido
echo [INFO] Para reiniciar, ejecuta este archivo nuevamente
echo.
pause