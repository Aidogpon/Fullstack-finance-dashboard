const { invoices } = require('./placeholder-data');

// ฟังก์ชันสำหรับเพิ่มข้อมูลใบแจ้งหนี้ลงในฐานข้อมูล
export async function seedInvoices(client) {
  try {
    // สร้าง extension "uuid-ossp" หากยังไม่มี
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // สร้างตาราง invoices หากยังไม่มี
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
    console.log(`Created "invoices" table`);

    // เพิ่มข้อมูลใบแจ้งหนี้ลงในตาราง invoices
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
          ON CONFLICT (id) DO NOTHING;
        `,
      ),
    );
    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}
