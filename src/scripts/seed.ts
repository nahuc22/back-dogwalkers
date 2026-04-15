import 'dotenv/config';
import { db } from '../db';
import { usersTable } from '../db/schema/users';
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Hash de la contraseña común para todos los usuarios
    const hashedPassword = await hashPassword('password123');
    
    // Insertar usuarios de prueba
    const users = await db.insert(usersTable).values([
      {
        name: 'Juan',
        lastname: 'Pérez',
        age: 28,
        email: 'juan@example.com',
        password: hashedPassword,
      },
      {
        name: 'María',
        lastname: 'González',
        age: 32,
        email: 'maria@example.com',
        password: hashedPassword,
      },
      {
        name: 'Carlos',
        lastname: 'Rodríguez',
        age: 25,
        email: 'carlos@example.com',
        password: hashedPassword,
      },
      {
        name: 'Ana',
        lastname: 'Martínez',
        age: 30,
        email: 'ana@example.com',
        password: hashedPassword,
      },
    ]).$returningId();

    console.log('✅ Usuarios creados:', users);
    console.log('🎉 Seed completado exitosamente!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
