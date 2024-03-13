'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// ฟังก์ชันสำหรับลบใบแจ้งหนี้
export default async function deleteInvoice(id: string) {
  try {
    // ลบข้อมูลใบแจ้งหนี้จากฐานข้อมูล
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
