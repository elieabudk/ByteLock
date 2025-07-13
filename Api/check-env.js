import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log('🔍 Verificando variables de entorno...\n');

const requiredEnvVars = [
  'MONGO_URI',
  'GOOGLE_CLIENT_ID', 
  'JWT_SECRET'
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT'
];

let allConfigured = true;

console.log('📋 Variables requeridas:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ Configurado' : '❌ Faltante';
  console.log(`  ${varName}: ${status}`);
  
  if (!value) {
    allConfigured = false;
  }
});

console.log('\n📋 Variables opcionales:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? `✅ ${value}` : '⚠️ No configurado (usando default)';
  console.log(`  ${varName}: ${status}`);
});

console.log('\n🎯 Resultado:');
if (allConfigured) {
  console.log('✅ Todas las variables requeridas están configuradas correctamente');
} else {
  console.log('❌ Faltan variables de entorno requeridas');
  console.log('\n📝 Ejemplo de archivo .env:');
  console.log('MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/bytelock');
  console.log('GOOGLE_CLIENT_ID=870858868997-k805fbel52feb59fqgiod48ci9aaedge.apps.googleusercontent.com');
  console.log('JWT_SECRET=tu_clave_secreta_muy_segura_aqui_minimo_32_caracteres');
  console.log('NODE_ENV=development');
  console.log('PORT=3000');
}

console.log('\n🔗 Para generar JWT_SECRET seguro:');
console.log('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'); 