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
            return NextResponse.json({
                error: 'Analysis engine not available. Please ensure the Python engine is running (e.g. docker compose up) to perform live scans.',
            }, { status: 503 });
        }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
