import { NextResponse } from 'next/server';
import { graphNodes, graphEdges } from '@/lib/seed-data';

export async function GET() {
    return NextResponse.json({
        nodes: graphNodes,
        edges: graphEdges,
        totalNodes: graphNodes.length,
        totalEdges: graphEdges.length,
    });
}
