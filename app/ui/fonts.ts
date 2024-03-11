import { Inter, Lusitana } from 'next/font/google';
 //เพิ่มprimary font.เลือกโหลดเฉพาะlatin
export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
    weight:['400','700'],
    subsets:['latin']
})