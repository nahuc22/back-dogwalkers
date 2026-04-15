import 'dotenv/config';
import { db } from '../db';
import { usersTable } from '../db/schema/users';

async function viewAllUsers() {
  try {
    console.log('📋 Consultando usuarios en la base de datos...\n');
    
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        lastname: usersTable.lastname,
        age: usersTable.age,
        email: usersTable.email,
      })
      .from(usersTable)
      .execute();

    if (users.length === 0) {
      console.log('⚠️  No hay usuarios registrados en la base de datos.');
      console.log('💡 Ejecuta el script de seed para crear usuarios de prueba.');
    } else {
      console.log(`✅ Se encontraron ${users.length} usuario(s):\n`);
      console.table(users);
      
      console.log('\n📧 Emails disponibles para login:');
      users.forEach(user => {
        console.log(`   - ${user.email}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al consultar usuarios:', error);
    process.exit(1);
  }
}

viewAllUsers();
