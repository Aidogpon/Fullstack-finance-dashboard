import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // ระบุเส้นทางที่ต้องได้รับการปกป้อง
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};