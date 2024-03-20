import { sql } from '@vercel/postgres';
import { CustomerField } from '../../definitions';
import { unstable_noStore as noStore } from 'next/cache';
// ฟังก์ชันสำหรับดึงข้อมูลลูกค้า ใช้หน้า create page
export default async function fetchCustomers() {
  noStore();
  try {
    // ดึงข้อมูลลูกค้าทุกคนเพื่อแสดงใน form
    const data = await sql<CustomerField>`
        SELECT
          id,
          name
        FROM customers
        ORDER BY name ASC
      `;

    const customers = data.rows;
    return customers; // คืนค่าข้อมูลลูกค้า
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}
