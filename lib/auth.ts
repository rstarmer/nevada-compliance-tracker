import { cookies } from 'next/headers';

const ACCESS_CODE = process.env.ACCESS_CODE || 'demo-123';
const AUTH_COOKIE = 'compliance-auth';

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  return authCookie?.value === 'authenticated';
}

export function verifyAccessCode(code: string): boolean {
  return code === ACCESS_CODE;
}

export function setAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE);
}