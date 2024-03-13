import { sql } from '@vercel/postgres';
import { formatCurrency } from '../../lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

// ฟังก์ชันสำหรับดึงข้อมูลสรุปสำหรับการแสดงผลบน dashboard
export default async function fetchCardData() {
  noStore();
  try {
    // ดึงข้อมูลสรุปจำนวนใบแจ้งหนี้, จำนวนลูกค้า, ยอดรวมที่จ่ายแล้ว, และยอดรวมที่ยังไม่จ่าย
    const data = sql`SELECT
        (SELECT COUNT(*) FROM invoices) AS invoice_count,
        (SELECT COUNT(*) FROM customers) AS customer_count,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS total_paid,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS total_pending
      FROM invoices`;

    const result = await data;

    // สกัดข้อมูลจากผลลัพธ์
    const { invoice_count, customer_count, total_paid, total_pending } =
      result.rows[0];

    // จัดรูปแบบยอดรวมเงินและคืนค่าข้อมูลสรุป
    const totalPaidInvoices = formatCurrency(Number(total_paid ?? 0));
    const totalPendingInvoices = formatCurrency(Number(total_pending ?? 0));

    return {
      numberOfCustomers: Number(customer_count ?? 0),
      numberOfInvoices: Number(invoice_count ?? 0),
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
