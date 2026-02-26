import { NextResponse } from 'next/server';
import { businessCapabilities } from '@/lib/seed-data';

export async function GET() {
    return NextResponse.json({ capabilities: businessCapabilities });
}
