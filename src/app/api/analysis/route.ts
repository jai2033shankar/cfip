import { NextResponse } from 'next/server';
import { repositories, dashboardStats, scanHistory } from '@/lib/seed-data';

export async function GET() {
    return NextResponse.json({
        repositories,
        stats: dashboardStats,
        scanHistory,
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { action, githubUrl, githubPat } = body;

    if (action === 'scan') {
        // Proxy to Python analysis engine
        try {
            const engineResponse = await fetch('http://localhost:8001/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    github_url: githubUrl,
                    github_pat: githubPat,
                }),
            });
            const data = await engineResponse.json();
            return NextResponse.json(data);
        } catch {
            // Fallback to seed data if engine is not running
            return NextResponse.json({
                message: 'Analysis engine not available. Using seed data.',
                data: { repositories, stats: dashboardStats },
            });
        }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
