// กำหนด type ข้อมูลที่ได้รับจาก <input>
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
