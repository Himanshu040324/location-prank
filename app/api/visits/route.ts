import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { Visit } from '@/models/Visit';

export async function GET(req: Request) {
  if (!isAdmin(req)) return new NextResponse(null, { status: 401 });
  await connectDB();
  const visits = await Visit.find().sort({ at: -1 }).limit(100).lean();
  return NextResponse.json(visits);
}