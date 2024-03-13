const { users } = require('./placeholder-data');
const bcrypt = require('bcrypt');

// ฟังก์ชันสำหรับเพิ่มข้อมูลผู้ใช้งานลงในฐานข้อมูล
export async function seedUsers(client) {
  try {
    // สร้าง extension "uuid-ossp" หากยังไม่มี เพื่อสนับสนุนการสร้าง UUID
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // สร้างตาราง users หากยังไม่มี
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `;
    console.log(`Created "users" table`);

    // เพิ่มข้อมูลผู้ใช้งานลงในตาราง users
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      }),
    );
    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
