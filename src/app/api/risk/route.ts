import { NextResponse } from 'next/server';
import { riskItems, impactSimulations } from '@/lib/seed-data';

export async function GET() {
    return NextResponse.json({
        risks: riskItems,
        simulations: impactSimulations,
        summary: {
            critical: riskItems.filter(r => r.severity === 'critical').length,
            high: riskItems.filter(r => r.severity === 'high').length,
            medium: riskItems.filter(r => r.severity === 'medium').length,
            low: riskItems.filter(r => r.severity === 'low').length,
        },
    });
}
