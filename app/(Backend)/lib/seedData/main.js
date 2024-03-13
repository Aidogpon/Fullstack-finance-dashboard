const { db } = require('@vercel/postgres');

const seedUsers = require('./seedUsers.js');
const seedCustomers = require('./seedCustomers.js');
const seedRevenue = require('./seedRevenue.js');
const seedInvoices = require('./seedInvoices.js');

// ฟังก์ชันหลักสำหรับเชื่อมต่อฐานข้อมูลและเรียกใช้งานฟังก์ชันเพิ่มข้อมูล
async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
