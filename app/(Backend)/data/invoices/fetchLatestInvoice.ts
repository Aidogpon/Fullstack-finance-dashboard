import { sql } from '@vercel/postgres';
import { LatestInvoiceRaw } from '../../definitions';
import { formatCurrency } from '../../lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

// ฟังก์ชันสำหรับดึงข้อมูลใบแจ้งหนี้ล่าสุดจากฐานข้อมูล
export default async function fetchLatestInvoices() {
  noStore(); // ป้องกันการเก็บข้อมูลใน cache
  try {
    // ดึงข้อมูล 5 ใบแจ้งหนี้ล่าสุดจากฐานข้อมูล
    const data = await sql<LatestInvoiceRaw>`
        SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        ORDER BY invoices.date DESC
        LIMIT 5`;

    // จัดรูปแบบข้อมูลใบแจ้งหนี้และคืนค่า
    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}
