import 'dotenv/config';
import { db } from '../db';
import { usersTable, ownersTable, walkersTable, adminsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

async function viewAllUsers() {
  try {
    console.log('📋 Consultando usuarios en la base de datos...\n');
    
    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        isActive: usersTable.isActive,
      })
      .from(usersTable)
      .execute();

    if (users.length === 0) {
      console.log('⚠️  No hay usuarios registrados en la base de datos.');
      console.log('💡 Ejecuta el script de seed para crear usuarios de prueba.');
    } else {
      console.log(`✅ Se encontraron ${users.length} usuario(s):\n`);
      
      for (const user of users) {
        let profile;
        if (user.role === 'owner') {
          [profile] = await db.select().from(ownersTable).where(eq(ownersTable.userId, user.id)).execute();
        } else if (user.role === 'walker') {
          [profile] = await db.select().from(walkersTable).where(eq(walkersTable.userId, user.id)).execute();
        } else if (user.role === 'admin') {
          [profile] = await db.select().from(adminsTable).where(eq(adminsTable.userId, user.id)).execute();
        }
        
        console.log(`👤 ${user.email} (${user.role})`);
        console.log(`   ID: ${user.id}`);
        if (profile) {
          console.log(`   Nombre: ${profile.name} ${profile.lastname || ''}`);
          if ('location' in profile) console.log(`   Ubicación: ${profile.location || 'N/A'}`);
          if ('experience' in profile) console.log(`   Experiencia: ${profile.experience || 'N/A'}`);
        }
        console.log('');
      }
      
      console.log('\n📧 Emails disponibles para login:');
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
      console.log('\n🔑 Password para todos: password123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al consultar usuarios:', error);
    process.exit(1);
  }
}

viewAllUsers();
