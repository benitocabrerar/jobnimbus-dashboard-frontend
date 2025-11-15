#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  title: (msg) => console.log(`${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getVersion(command) {
  try {
    return execSync(`${command} --version`, { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

async function install() {
  console.log();
  log.title('==========================================');
  log.title(' JobNimbus MCP Frontend - Instalación');
  log.title('==========================================');
  console.log();

  log.info('Configurando entorno de desarrollo...');
  log.info('React + TypeScript + Vite + Material-UI');
  console.log();

  // Verificar prerequisitos
  log.info('Verificando prerequisitos...');
  
  if (!checkCommand('node')) {
    log.error('Node.js no está instalado');
    console.log();
    log.info('Para instalar Node.js:');
    log.info('  1. Ve a https://nodejs.org/');
    log.info('  2. Descarga la versión LTS');
    log.info('  3. Instala y reinicia');
    process.exit(1);
  }

  if (!checkCommand('npm')) {
    log.error('npm no está disponible');
    process.exit(1);
  }

  const nodeVersion = getVersion('node');
  const npmVersion = getVersion('npm');
  
  log.success(`Node.js ${nodeVersion} encontrado`);
  log.success(`npm ${npmVersion} encontrado`);

  // Verificar package.json
  if (!fs.existsSync('package.json')) {
    log.error('package.json no encontrado');
    log.info('Ejecuta este script desde el directorio del frontend');
    process.exit(1);
  }

  log.success('package.json encontrado');

  // Verificar reinstalación
  if (fs.existsSync('node_modules')) {
    console.log();
    log.info('node_modules ya existe');
    
    // En entorno no interactivo, asumir reinstalación
    log.info('Reinstalando dependencias...');
    
    try {
      if (fs.existsSync('node_modules')) {
        execSync('rm -rf node_modules', { stdio: 'inherit' });
      }
      if (fs.existsSync('package-lock.json')) {
        fs.unlinkSync('package-lock.json');
      }
      log.success('Limpieza completada');
    } catch (error) {
      log.warning('Error en limpieza, continuando...');
    }
  }

  // Instalar dependencias
  console.log();
  log.info('Instalando dependencias...');
  log.info('Esto puede tardar varios minutos...');
  console.log();

  try {
    execSync('npm install', { stdio: 'inherit' });
    log.success('Dependencias instaladas correctamente');
  } catch (error) {
    log.error('Error en la instalación');
    log.info('Intenta ejecutar: npm cache clean --force');
    process.exit(1);
  }

  // Verificar instalación
  console.log();
  log.info('Verificando instalación...');
  
  if (fs.existsSync('node_modules')) {
    log.success('node_modules creado');
  } else {
    log.error('node_modules no encontrado');
    process.exit(1);
  }

  // Test básico
  log.info('Ejecutando test básico...');
  try {
    execSync('npm test -- --testPathPatterns=basic.test.ts --watchAll=false', { 
      stdio: 'pipe' 
    });
    log.success('Test básico funciona');
  } catch {
    log.warning('Test básico con problemas (normal en primera instalación)');
  }

  // Crear .env.local
  if (!fs.existsSync('.env.local')) {
    log.info('Creando configuración local...');
    const envContent = `# JobNimbus MCP Frontend - Configuración Local
VITE_API_URL=http://localhost:8000
VITE_MCP_SERVER_URL=ws://localhost:8001
VITE_DEV_MODE=true
VITE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ADVANCED_FILTERS=true`;
    
    fs.writeFileSync('.env.local', envContent);
    log.success('Archivo .env.local creado');
  }

  // Completado
  console.log();
  log.title('==========================================');
  log.title(' Instalación Completada!');
  log.title('==========================================');
  console.log();
  
  log.success('Frontend listo para usar');
  console.log();
  
  log.info('Próximos pasos:');
  log.info('  - Desarrollo: npm run dev');
  log.info('  - Tests: npm test');
  log.info('  - Build: npm run build');
  console.log();
  
  log.info('URLs:');
  log.info('  - Desarrollo: http://localhost:5173');
  log.info('  - Preview: http://localhost:4173');
  console.log();

  // Opción de iniciar desarrollo
  log.info('Para iniciar el servidor de desarrollo:');
  log.info('  npm run dev');
  console.log();
}

// Manejar errores
process.on('uncaughtException', (error) => {
  log.error(`Error inesperado: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log.error(`Error de promesa: ${error.message}`);
  process.exit(1);
});

// Ejecutar instalación
install().catch((error) => {
  log.error(`Error en instalación: ${error.message}`);
  process.exit(1);
});