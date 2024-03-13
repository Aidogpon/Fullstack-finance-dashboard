const { revenue } = require('./placeholder-data');

// ฟังก์ชันสำหรับเพิ่มข้อมูลรายได้ลงในฐานข้อมูล
export async function seedRevenue(client) {
  try {
    // สร้างตาราง revenue หากยังไม่มี
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS revenue (
          month VARCHAR(4) NOT NULL UNIQUE,
          revenue INT NOT NULL
        );
      `;
    console.log(`Created "revenue" table`);

    // เพิ่มข้อมูลรายได้ลงในตาราง revenue
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
          INSERT INTO revenue (month, revenue)
          VALUES (${rev.month}, ${rev.revenue})
          ON CONFLICT (month) DO NOTHING;
        `,
      ),
    );
    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}
