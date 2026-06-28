import { NextResponse } from 'next/server';
import { seedInitialData } from '@/lib/kv';

export async function POST() {
  await seedInitialData();
  return NextResponse.json({ success: true, message: 'Data seeded successfully' });
}
