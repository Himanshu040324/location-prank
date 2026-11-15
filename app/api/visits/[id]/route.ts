import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { Visit } from '@/models/Visit';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) return new NextResponse(null, { status: 401 });
  const { id } = await params;
  await connectDB();
  await Visit.findByIdAndDelete(id);
  return new NextResponse(null, { status: 204 });
}