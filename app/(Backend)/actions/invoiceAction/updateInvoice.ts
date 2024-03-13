import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { UpdateInvoice } from './validation/invoiceSchemas';
import { State } from './validation/invoiceTypes';

// ฟังก์ชันสำหรับอัพเดทใบแจ้งหนี้

export default async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  // ตรวจสอบความถูกต้องของข้อมูลฟอร์ม
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  try {
    // อัพเดทข้อมูลใบแจ้งหนี้ในฐานข้อมูล
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amount}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
