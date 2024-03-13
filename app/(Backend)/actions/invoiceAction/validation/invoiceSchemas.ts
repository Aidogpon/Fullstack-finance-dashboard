import { z } from 'zod';

// กำหนด schema ของฟอร์มใบแจ้งหนี้ โดยใช้ zod
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// กำหนด schema สำหรับสร้างและอัพเดทใบแจ้งหนี้ โดยละเว้นบางฟิลด์ (id ใช้ uuid default, date:ปัจจุบัน)
export const CreateInvoice = FormSchema.omit({ id: true, date: true });
export const UpdateInvoice = FormSchema.omit({ date: true, id: true });
