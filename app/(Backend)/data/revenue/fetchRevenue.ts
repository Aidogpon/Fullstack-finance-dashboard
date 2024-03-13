import { sql } from '@vercel/postgres';
import { Revenue } from '@/app/(Backend)/definitions';
import { unstable_noStore as noStore } from 'next/cache';

// ฟังก์ชันสำหรับดึงข้อมูลรายได้จากฐานข้อมูล
export default async function fetchRevenue() {
  noStore(); // ป้องกันการเก็บข้อมูลใน cache
  try {
    // ดึงข้อมูลรายได้จากตาราง revenue
    const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data.rows; // คืนค่าข้อมูลรายได้
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
