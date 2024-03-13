import '@/app/(Frontend)/ui/global.css';
import { inter } from '@/app/(Frontend)/ui/fonts';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*เข้าถึงfontที่อยู่ในobject */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
