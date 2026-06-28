import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  console.log('Contact form submitted:', data);
  return NextResponse.json({ success: true });
}
