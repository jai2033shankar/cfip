import { NextResponse } from 'next/server';
import { auditLog, scanHistory } from '@/lib/seed-data';

export async function GET() {
    return NextResponse.json({
        auditLog,
        scanHistory,
        totalEntries: auditLog.length,
    });
}
