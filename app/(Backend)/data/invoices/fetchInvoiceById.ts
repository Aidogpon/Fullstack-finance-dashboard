import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { InvoiceForm } from '../../definitions';

// ฟังก์ชันสำหรับดึงข้อมูลใบแจ้งหนี้โดยใช้ ID สำหรับ update
export default async function fetchInvoiceById(id: string) {
  noStore(); // ป้องกันการเก็บข้อมูลใน cache
  try {
    // ดึงข้อมูลใบแจ้งหนี้โดยใช้ ID
    const data = await sql<InvoiceForm>`
        SELECT
          invoices.id,
          invoices.customer_id,
          invoices.amount,
          invoices.status
        FROM invoices
        WHERE invoices.id = ${id};
      `;

    // จัดรูปแบบข้อมูลใบแจ้งหนี้และคืนค่า
    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      amount: invoice.amount,
    }));

    return invoice[0]; // คืนค่าข้อมูลใบแจ้งหนี้
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
