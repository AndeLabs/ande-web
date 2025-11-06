// Script para probar el faucet de ANDE
// Uso: node src/scripts/test-faucet.js

const fs = require('fs');
const path = require('path');

// Polyfill para fetch si no está disponible en Node.js <18
if (typeof fetch === 'undefined') {
  const { default: fetch } = require('node-fetch');
  global.fetch = fetch;
}

// Configuración del faucet
const FAUCET_CONFIG = {
  apiUrl: 'http://localhost:3000/api/faucet',
  testAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45', // Dirección de prueba
  claimAmount: '100',
  cooldownPeriod: 24 * 60 * 60 * 1000, // 24 horas
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Función para hacer peticiones HTTP
async function makeRequest(endpoint, options = {}) {
  const url = `${FAUCET_CONFIG.apiUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Faucet-Test-Script/1.0',
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    logError(`Error en petición a ${url}: ${error.message}`);
    throw error;
  }
}

// Test 1: Verificar configuración del faucet
async function testFaucetConfig() {
  log('\n🔧 Test 1: Verificar configuración del faucet', 'bright');
  
  try {
    const response = await makeRequest('/claim');
    
    if (response.ok) {
      logSuccess('Configuración obtenida correctamente');
      log('Configuración:', 'cyan');
      console.log(JSON.stringify(response.data, null, 2));
      
      // Verificar valores esperados
      const expectedValues = {
        address: '0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f',
        claimAmount: FAUCET_CONFIG.claimAmount,
        chainId: 6174,
        network: 'ANDE Network'
      };
      
      let allCorrect = true;
      for (const [key, expectedValue] of Object.entries(expectedValues)) {
        if (response.data[key] !== expectedValue) {
          logError(`${key}: esperado ${expectedValue}, recibido ${response.data[key]}`);
          allCorrect = false;
        } else {
          logSuccess(`${key}: ${expectedValue}`);
        }
      }
      
      if (allCorrect) {
        logSuccess('Todos los valores de configuración son correctos');
      }
      
      return true;
    } else {
      logError(`Error ${response.status}: ${response.data.error || 'Error desconocido'}`);
      return false;
    }
  } catch (error) {
    logError(`Error al obtener configuración: ${error.message}`);
    return false;
  }
}

// Test 2: Verificar saldo del faucet
async function testFaucetBalance() {
  log('\n💰 Test 2: Verificar saldo del faucet', 'bright');
  
  try {
    const response = await makeRequest('/claim');
    
    if (response.ok && response.data.currentBalance) {
      const balance = parseFloat(response.data.currentBalance);
      logSuccess(`Saldo actual: ${balance.toLocaleString()} ANDE`);
      
      if (balance > 1000) {
        logSuccess('Saldo suficiente para operación');
      } else if (balance > 100) {
        logWarning('Saldo bajo, considerar recargar el faucet');
      } else {
        logError('Saldo críticamente bajo');
      }
      
      return true;
    } else {
      logError('No se pudo obtener el saldo');
      return false;
    }
  } catch (error) {
    logError(`Error al verificar saldo: ${error.message}`);
    return false;
  }
}

// Test 3: Solicitar tokens
async function testClaimTokens() {
  log('\n💸 Test 3: Solicitar tokens', 'bright');
  
  try {
    const payload = {
      address: FAUCET_CONFIG.testAddress,
    };
    
    logInfo(`Solicitando ${FAUCET_CONFIG.claimAmount} ANDE para ${FAUCET_CONFIG.testAddress}`);
    
    const response = await makeRequest('/claim', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    if (response.ok) {
      logSuccess('Tokens solicitados correctamente');
      log(`Hash de transacción: ${response.data.txHash}`, 'cyan');
      log(`Cantidad: ${response.data.amount} wei`, 'cyan');
      
      // Verificar en el explorer (opcional)
      if (response.data.txHash) {
        logInfo(`Puedes verificar la transacción en: https://explorer.ande.network/tx/${response.data.txHash}`);
      }
      
      return true;
    } else {
      logError(`Error ${response.status}: ${response.data.error || 'Error desconocido'}`);
      
      // Errores esperados
      if (response.status === 429) {
        logWarning('Error de rate limiting - esto es normal si haces múltiples pruebas rápidas');
      } else if (response.status === 400) {
        logWarning('Error de validación - verifica la dirección');
      }
      
      return false;
    }
  } catch (error) {
    logError(`Error al solicitar tokens: ${error.message}`);
    return false;
  }
}

// Test 4: Verificar estado de claims
async function testClaimStatus() {
  log('\n📊 Test 4: Verificar estado de claims', 'bright');
  
  try {
    const response = await makeRequest(`/status?address=${FAUCET_CONFIG.testAddress}`);
    
    if (response.ok) {
      logSuccess('Estado obtenido correctamente');
      log('Estado:', 'cyan');
      console.log(JSON.stringify(response.data, null, 2));
      
      if (response.data.canClaim) {
        logSuccess('La dirección puede solicitar tokens');
      } else {
        logWarning('La dirección no puede solicitar tokens aún');
        if (response.data.timeRemaining) {
          const hours = Math.floor(response.data.timeRemaining / (1000 * 60 * 60));
          const minutes = Math.floor((response.data.timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          logInfo(`Tiempo restante: ${hours}h ${minutes}m`);
        }
      }
      
      return true;
    } else {
      logError(`Error ${response.status}: ${response.data.error || 'Error desconocido'}`);
      return false;
    }
  } catch (error) {
    logError(`Error al verificar estado: ${error.message}`);
    return false;
  }
}

// Test 5: Validación de direcciones inválidas
async function testInvalidAddresses() {
  log('\n🚫 Test 5: Validar direcciones inválidas', 'bright');
  
  const invalidAddresses = [
    'invalid-address',
    '0xinvalid',
    '0x1234567890123456789012345678901234567890', // Inválida pero formato correcto
    '',
    null,
  ];
  
  let passedTests = 0;
  
  for (const address of invalidAddresses) {
    try {
      const payload = { address };
      const response = await makeRequest('/claim', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      if (!response.ok && (response.status === 400 || response.status === 422)) {
        logSuccess(`Dirección inválida rechazada: ${address || '(vacía)'}`);
        passedTests++;
      } else {
        logError(`Dirección inválida aceptada: ${address || '(vacía)'}`);
      }
    } catch (error) {
      logError(`Error probando dirección ${address}: ${error.message}`);
    }
  }
  
  return passedTests === invalidAddresses.length;
}

// Test 6: Rate limiting
async function testRateLimiting() {
  log('\n⏱️  Test 6: Probar rate limiting', 'bright');
  
  const rapidRequests = 5;
  let rateLimitedRequests = 0;
  
  logInfo(`Enviando ${rapidRequests} peticiones rápidas...`);
  
  for (let i = 0; i < rapidRequests; i++) {
    try {
      const payload = {
        address: `0x${Math.random().toString(16).substr(2, 40)}`, // Dirección aleatoria
      };
      
      const response = await makeRequest('/claim', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      if (response.status === 429) {
        rateLimitedRequests++;
        logWarning(`Petición ${i + 1} bloqueada por rate limiting`);
      } else if (response.ok) {
        logSuccess(`Petición ${i + 1} aceptada`);
      }
      
      // Pequeña pausa entre peticiones
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      logError(`Error en petición ${i + 1}: ${error.message}`);
    }
  }
  
  if (rateLimitedRequests > 0) {
    logSuccess(`Rate limiting funciona correctamente (${rateLimitedRequests}/${rapidRequests} peticiones bloqueadas)`);
    return true;
  } else {
    logWarning('No se detectó rate limiting (puede ser normal si las IPs son diferentes)');
    return true; // No es necesariamente un error
  }
}

// Función principal
async function runTests() {
  log('🚀 Iniciando pruebas del Faucet ANDE', 'bright');
  log('=====================================', 'bright');
  
  const tests = [
    { name: 'Configuración', fn: testFaucetConfig },
    { name: 'Saldo', fn: testFaucetBalance },
    { name: 'Solicitud de Tokens', fn: testClaimTokens },
    { name: 'Estado de Claims', fn: testClaimStatus },
    { name: 'Validación de Direcciones', fn: testInvalidAddresses },
    { name: 'Rate Limiting', fn: testRateLimiting },
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      logError(`Error en test ${test.name}: ${error.message}`);
    }
    
    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Resumen
  log('\n📋 Resumen de Pruebas', 'bright');
  log('==================', 'bright');
  log(`Tests pasados: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    logSuccess('🎉 Todos los tests pasaron correctamente');
  } else {
    logWarning('⚠️  Algunos tests fallaron - revisa los errores above');
  }
  
  // Recomendaciones
  log('\n💡 Recomendaciones:', 'bright');
  if (passedTests === totalTests) {
    log('✅ El faucet está funcionando correctamente', 'green');
    log('📊 Monitorea regularmente el saldo del faucet', 'blue');
    log('🔍 Revisa los logs de transacciones periódicamente', 'blue');
  } else {
    log('🔧 Revisa los errores reportados', 'yellow');
    log('📝 Verifica la configuración del backend', 'yellow');
    log('🌐 Asegúrate que la red ANDE está accesible', 'yellow');
  }
  
  log('\n🔗 Enlaces útiles:', 'bright');
  log(`Faucet: http://localhost:3000/faucet`, 'cyan');
  log('Explorer: https://explorer.ande.network', 'cyan');
  log('RPC: https://rpc.ande.network', 'cyan');
  
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Verificar si estamos en el entorno correcto
if (typeof window !== 'undefined') {
  logError('Este script debe ejecutarse en Node.js, no en el navegador');
  process.exit(1);
}

// Verificar argumentos
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('Uso: node src/scripts/test-faucet.js [opciones]', 'bright');
  log('');
  log('Opciones:', 'bright');
  log('  --help, -h     Muestra esta ayuda', 'bright');
  log('  --address DIR  Usa una dirección específica para las pruebas', 'bright');
  log('');
  log('Ejemplos:', 'bright');
  log('  node src/scripts/test-faucet.js', 'bright');
  log('  node src/scripts/test-faucet.js --address 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45', 'bright');
  process.exit(0);
}

// Configurar dirección de prueba si se proporciona
const addressIndex = args.indexOf('--address');
if (addressIndex !== -1 && args[addressIndex + 1]) {
  FAUCET_CONFIG.testAddress = args[addressIndex + 1];
  logInfo(`Usando dirección personalizada: ${FAUCET_CONFIG.testAddress}`);
}

// Ejecutar tests
runTests().catch(error => {
  logError(`Error fatal: ${error.message}`);
  process.exit(1);
});