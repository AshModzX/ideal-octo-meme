import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  const { password } = await request.json();
  const session = await getSession();

  if (password === process.env.ADMIN_PASSWORD) {
    session.isLoggedIn = true;
    await session.save();
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ success: true });
}
