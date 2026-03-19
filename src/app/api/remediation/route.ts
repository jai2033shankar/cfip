import { NextResponse } from 'next/server';
import { remediationSuggestions } from '@/lib/seed-data';

export async function GET() {
    return NextResponse.json({ suggestions: remediationSuggestions });
}
