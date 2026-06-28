import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionData {
  isLoggedIn: boolean;
}

export async function getSession() {
  const cookieStore = cookies();
  const session = await getIronSession<SessionData>(cookieStore, {
    password: process.env.SECRET_COOKIE_PASSWORD || 'a-random-secret-at-least-32-characters-long',
    cookieName: 'jutti-dot-com-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  return session;
}
