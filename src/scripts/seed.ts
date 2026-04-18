import 'dotenv/config';
import { db } from '../db';
import { usersTable, ownersTable, walkersTable, adminsTable } from '../db/schema';
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // ADVERTENCIA: Contraseña sin hashear para desarrollo
    const password = 'password123';
    
    // 1. Crear owner
    const [owner1User] = await db.insert(usersTable).values({
      email: 'juan@example.com',
      password: password,
      role: 'owner',
    }).$returningId();

    await db.insert(ownersTable).values({
      userId: owner1User.id,
      name: 'Juan',
      lastname: 'Pérez',
      location: 'San Miguel de Tucumán',
    });

    // 2. Crear otro owner
    const [owner2User] = await db.insert(usersTable).values({
      email: 'maria@example.com',
      password: password,
      role: 'owner',
    }).$returningId();

    await db.insert(ownersTable).values({
      userId: owner2User.id,
      name: 'María',
      lastname: 'González',
      location: 'Yerba Buena',
    });

    // 3. Crear walker
    const [walker1User] = await db.insert(usersTable).values({
      email: 'carlos@example.com',
      password: password,
      role: 'walker',
    }).$returningId();

    await db.insert(walkersTable).values({
      userId: walker1User.id,
      name: 'Carlos',
      lastname: 'Rodríguez',
      location: 'San Miguel de Tucumán',
      experience: '2 años',
      description: 'Amante de los animales con experiencia en paseos',
    });

    // 4. Crear otro walker
    const [walker2User] = await db.insert(usersTable).values({
      email: 'ana@example.com',
      password: password,
      role: 'walker',
    }).$returningId();

    await db.insert(walkersTable).values({
      userId: walker2User.id,
      name: 'Ana',
      lastname: 'Martínez',
      location: 'Yerba Buena',
      experience: '1 año',
      description: 'Cuidadora responsable y cariñosa',
    });

    // 5. Crear admin
    const [adminUser] = await db.insert(usersTable).values({
      email: 'admin@example.com',
      password: password,
      role: 'admin',
    }).$returningId();

    await db.insert(adminsTable).values({
      userId: adminUser.id,
      name: 'Admin',
      lastname: 'Sistema',
    });

    console.log('✅ Usuarios creados:');
    console.log('  - Owners: juan@example.com, maria@example.com');
    console.log('  - Walkers: carlos@example.com, ana@example.com');
    console.log('  - Admin: admin@example.com');
    console.log('  - Password para todos: password123');
    console.log('🎉 Seed completado exitosamente!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
