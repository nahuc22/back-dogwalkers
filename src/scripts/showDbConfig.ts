import 'dotenv/config';

console.log('\n🔧 Configuración de conexión MySQL:\n');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ No se encontró DATABASE_URL en el archivo .env');
  process.exit(1);
}

try {
  const url = new URL(dbUrl);
  
  console.log('Host:', url.hostname);
  console.log('Puerto:', url.port || '3306');
  console.log('Usuario:', url.username);
  console.log('Contraseña:', url.password ? '***' + url.password.slice(-3) : 'No configurada');
  console.log('Base de datos:', url.pathname.replace('/', ''));
  console.log('\n📋 URL completa (para copiar):');
  console.log(dbUrl);
  console.log('\n');
} catch (error) {
  console.error('❌ Error al parsear DATABASE_URL:', error);
  console.log('\nURL raw:', dbUrl);
}
