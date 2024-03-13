import { unstable_noStore as noStore } from 'next/cache';
import { CustomersTableType } from '../../definitions';
import { sql } from '@vercel/postgres';
import { formatCurrency } from '../../lib/utils';

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้าตามเงื่อนไขการค้นหา
export default async function fetchFilteredCustomers(query: string) {
  noStore(); // ป้องกันการเก็บข้อมูลใน cache
  try {
    // ดึงข้อมูลลูกค้าตามเงื่อนไขการค้นหา
    const data = await sql<CustomersTableType>`
          SELECT
            customers.id,
            customers.name,
            customers.email,
            customers.image_url,
            COUNT(invoices.id) AS total_invoices,
            SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
            SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
          FROM customers
          LEFT JOIN invoices ON customers.id = invoices.customer_id
          WHERE
            customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`}
          GROUP BY customers.id, customers.name, customers.email, customers.image_url
          ORDER BY customers.name ASC
        `;

    // จัดรูปแบบข้อมูลลูกค้าและคืนค่า
    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers; // คืนค่าข้อมูลลูกค้าตามเงื่อนไขการค้นหา
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
