const { customers } = require('./placeholder-data');

// ฟังก์ชันสำหรับเพิ่มข้อมูลลูกค้าลงในฐานข้อมูล
export async function seedCustomers(client) {
  try {
    // สร้าง extension "uuid-ossp" หากยังไม่มี
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // สร้างตาราง customers หากยังไม่มี
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS customers (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          image_url VARCHAR(255) NOT NULL
        );
      `;
    console.log(`Created "customers" table`);

    // เพิ่มข้อมูลลูกค้าลงในตาราง customers
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
          INSERT INTO customers (id, name, email, image_url)
          VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
          ON CONFLICT (id) DO NOTHING;
        `,
      ),
    );
    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}
