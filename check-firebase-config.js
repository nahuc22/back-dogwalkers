require('dotenv').config();

console.log('🔍 Verificando configuración de Firebase Admin SDK:\n');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log('FIREBASE_PROJECT_ID:', projectId ? '✅ Configurado' : '❌ NO configurado');
console.log('FIREBASE_CLIENT_EMAIL:', clientEmail ? '✅ Configurado' : '❌ NO configurado');
console.log('FIREBASE_PRIVATE_KEY:', privateKey ? '✅ Configurado' : '❌ NO configurado');

if (projectId) {
  console.log('\nProject ID:', projectId);
}

if (clientEmail) {
  console.log('Client Email:', clientEmail);
}

if (privateKey) {
  console.log('Private Key (primeros 50 caracteres):', privateKey.substring(0, 50) + '...');
}

console.log('\n' + '='.repeat(60));
