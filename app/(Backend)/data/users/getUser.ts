import { sql } from '@vercel/postgres';
import { User } from '../../definitions';

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้โดยใช้อีเมล
export default async function getUser(email: string) {
  try {
    // ดึงข้อมูลผู้ใช้โดยใช้อีเมล
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User; // คืนค่าข้อมูลผู้ใช้
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
