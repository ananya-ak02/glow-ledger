import { NextResponse } from 'next/server';

export async function GET() {
  // If Supabase is configured, we could do a lightweight ping
  // Otherwise return healthy
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
