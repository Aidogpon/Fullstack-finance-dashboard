import { Revenue } from '../definitions';

// ฟังก์ชันสำหรับจัดรูปแบบจำนวนเงินเป็นสกุลเงินบาทไทย
export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('th-TH', {
    style: 'currency',
    currency: 'THB',
  });
};

// ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบlocalที่ต้องการ
export const formatDateToLocal = (
  dateStr: string, 
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr); // แปลงสตริงวันที่เป็นวัตถุ Date
  const options: Intl.DateTimeFormatOptions = { // กำหนดตัวเลือกสำหรับการจัดรูปแบบวันที่
    day: 'numeric', // แสดงวันเป็นตัวเลข
    month: 'short', // แสดงเดือนเป็นชื่อย่อ
    year: 'numeric', // แสดงปีเป็นตัวเลข
  };
  const formatter = new Intl.DateTimeFormat(locale, options); // สร้าง formatter ด้วยตัวเลือกที่กำหนด
  return formatter.format(date); // จัดรูปแบบและคืนค่าวันที่ตามที่ต้องการ
};

// ฟังก์ชันสำหรับสร้างป้ายกำกับแกน Y จากข้อมูลรายได้
export const generateYAxis = (revenue: Revenue[]) => {

  const yAxisLabels = []; // อาร์เรย์สำหรับเก็บป้ายกำกับแกน Y
  const highestRecord = Math.max(...revenue.map((month) => month.revenue)); // หาค่าสูงสุดในข้อมูลรายได้
  const topLabel = Math.ceil(highestRecord / 1000) * 1000; // ปัดค่าสูงสุดขึ้นเป็นพัน

  for (let i = topLabel; i >= 0; i -= 150000) { // สร้างป้ายกำกับตั้งแต่ค่าสูงสุดไปจนถึง 0
    yAxisLabels.push(`฿${i / 1000}K`); // แต่ละป้ายกำกับแสดงเป็นพันบาท
  }

  return { yAxisLabels, topLabel }; // คืนค่าป้ายกำกับแกน Y และค่าสูงสุด
};

// ฟังก์ชันสำหรับสร้างการแบ่งหน้า
export const generatePagination = (currentPage: number, totalPages: number) => {
  // ถ้าหน้าทั้งหมดไม่เกิน 7 หน้า, แสดงหน้าทั้งหมดโดยไม่มีจุดไข่ปลา
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // ถ้าหน้าปัจจุบันอยู่ใน 3 หน้าแรก, แสดง 3 หน้าแรก, จุดไข่ปลา, และ 2 หน้าสุดท้าย
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // ถ้าหน้าปัจจุบันอยู่ใน 3 หน้าสุดท้าย, แสดง 2 หน้าแรก, จุดไข่ปลา, และ 3 หน้าสุดท้าย
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // ถ้าหน้าปัจจุบันอยู่ตรงกลาง, แสดงหน้าแรก, จุดไข่ปลา, หน้าปัจจุบันและหน้าข้างเคียง,
  // อีกจุดไข่ปลาหนึ่ง, และหน้าสุดท้าย
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
