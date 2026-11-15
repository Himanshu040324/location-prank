import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Visit } from '@/models/Visit';

export async function POST(req: Request) {
  const { name, lat, lng, accuracy } = await req.json();
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }
  await connectDB();
  await Visit.create({ name: String(name || 'Anonymous').slice(0, 50), lat, lng, accuracy });
  return NextResponse.json({ ok: true }, { status: 201 });
}