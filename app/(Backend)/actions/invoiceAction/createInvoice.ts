'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateInvoice } from './validation/invoiceSchemas';
import { State } from './validation/invoiceTypes';

// ฟังก์ชันสำหรับสร้างใบแจ้งหนี้
export default async function createInvoice(
  prevState: State,
  formData: FormData,
) {
  // ตรวจสอบความถูกต้องของข้อมูลฟอร์ม
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // หากตรวจสอบแล้วพบข้อผิดพลาด คืนค่า errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // เตรียมข้อมูลสำหรับการเพิ่มลงฐานข้อมูล
  const { customerId, amount, status } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0]; // ใช้วันที่ปัจจุบัน

  try {
    // เพิ่มข้อมูลใบแจ้งหนี้ลงในฐานข้อมูล
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amount}, ${status}, ${date})
      `;
  } catch (error) {
    // หากมีข้อผิดพลาดจากฐานข้อมูล คืนค่าข้อผิดพลาด
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // อัพเดต cache และนำทางผู้ใช้กลับไปยังหน้ารายการใบแจ้งหนี้
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
