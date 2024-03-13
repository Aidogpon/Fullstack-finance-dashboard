import { sql } from '@vercel/postgres';
import { InvoicesTable } from '../../definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;
// ฟังก์ชันสำหรับดึงข้อมูลใบแจ้งหนี้ตามเงื่อนไขการค้นหาและหน้าที่กำลังดู
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore(); // ป้องกันการเก็บข้อมูลใน cache
  const offset = (currentPage - 1) * ITEMS_PER_PAGE; // คำนวณตำแหน่งเริ่มต้นสำหรับการดึงข้อมูล

  try {
    // ดึงข้อมูลใบแจ้งหนี้ตามเงื่อนไขการค้นหา
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows; // คืนค่าข้อมูลใบแจ้งหนี้ที่ได้
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

// ฟังก์ชันสำหรับคำนวณจำนวนหน้าของผลลัพธ์การค้นหาใบแจ้งหนี้
export async function fetchInvoicesPages(query: string) {
  noStore(); // ป้องกันการเก็บข้อมูลใน cache
  try {
    // คำนวณจำนวนใบแจ้งหนี้ทั้งหมดตามเงื่อนไขการค้นหา
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    // คำนวณจำนวนหน้าทั้งหมดจากจำนวนใบแจ้งหนี้ที่ได้
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages; // คืนค่าจำนวนหน้าทั้งหมด
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}
