#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');

// Colores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

async function startDev() {
  console.log();
  log.title('==========================================');
  log.title(' JobNimbus MCP Frontend - Servidor');
  log.title('==========================================');
  console.log();

  // Verificar Node.js
  if (!checkCommand('node')) {
    log.error('Node.js no encontrado');
    log.info('Ejecuta primero: node install.js');
    process.exit(1);
  }

  const nodeVersion = getVersion('node');
  log.info(`Node.js ${nodeVersion}`);

  // Verificar package.json
  if (!fs.existsSync('package.json')) {
    log.error('package.json no encontrado');
    process.exit(1);
  }

  // Verificar node_modules
  if (!fs.existsSync('node_modules')) {
    log.error('node_modules no encontrado');
    log.info('Ejecuta primero: node install.js');
    process.exit(1);
  }

  // Mostrar información
  log.info(`Directorio: ${process.cwd()}`);
  log.info('Puerto: http://localhost:5173');
  console.log();

  // Verificar puerto 5173
  try {
    const netstat = execSync('netstat -an', { encoding: 'utf8' });
    if (netstat.includes('5173')) {
      log.warning('Puerto 5173 en uso');
      log.info('Vite usará puerto alternativo');
      console.log();
    }
  } catch {
    // Ignorar error de netstat en sistemas que no lo tienen
  }

  log.info('Iniciando servidor de desarrollo...');
  log.info('Presiona Ctrl+C para detener');
  console.log();
  
  log.title('==========================================');
  log.title(' Servidor iniciando...');
  log.title('==========================================');
  console.log();

  // Abrir navegador después de 5 segundos
  setTimeout(() => {
    const url = 'http://localhost:5173';
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    try {
      execSync(`${start} ${url}`, { stdio: 'ignore' });
    } catch {
      log.info(`Abre manualmente: ${url}`);
    }
  }, 5000);

  // Iniciar Vite
  try {
    const child = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      console.log();
      log.title('==========================================');
      log.title(' Servidor detenido');
      log.title('==========================================');
      console.log();
      
      if (code === 0) {
        log.info('Servidor detenido correctamente');
      } else {
        log.warning(`Servidor detenido con código: ${code}`);
      }
      
      log.info('Para reiniciar ejecuta: node start.js');
    });

    // Manejar Ctrl+C
    process.on('SIGINT', () => {
      log.info('Deteniendo servidor...');
      child.kill('SIGINT');
    });

  } catch (error) {
    log.error(`Error iniciando servidor: ${error.message}`);
    process.exit(1);
  }
}

// Manejar errores
process.on('uncaughtException', (error) => {
  log.error(`Error inesperado: ${error.message}`);
  process.exit(1);
});

// Ejecutar servidor
startDev().catch((error) => {
  log.error(`Error en servidor: ${error.message}`);
  process.exit(1);
});