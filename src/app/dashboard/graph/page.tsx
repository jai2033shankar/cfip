'use client';

import { useEffect, useRef, useState } from 'react';
import { FiFilter, FiMaximize2, FiMinimize2, FiZoomIn, FiZoomOut, FiRefreshCw, FiInfo, FiX } from 'react-icons/fi';
import { graphNodes as seedNodes, graphEdges as seedEdges } from '@/lib/seed-data';
import type { GraphNode } from '@/lib/seed-data';
import cytoscape from 'cytoscape';
import { useScan } from '@/lib/scan-context';

const riskColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
};

const typeShapes: Record<string, string> = {
    module: 'roundrectangle',
    service: 'diamond',
    function: 'ellipse',
    class: 'hexagon',
    api: 'rectangle',
    db_table: 'barrel',
    business_capability: 'star',
    file: 'triangle',
};

const typeColors: Record<string, string> = {
    module: '#6366f1',
    service: '#8b5cf6',
    function: '#06b6d4',
    class: '#22c55e',
    api: '#f97316',
    db_table: '#eab308',
    business_capability: '#ec4899',
    file: '#64748b',
};

export default function GraphPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<cytoscape.Core | null>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterRisk, setFilterRisk] = useState<string>('all');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { scanData } = useScan();

    const currentNodes = scanData ? scanData.nodes : seedNodes;
    const currentEdges = scanData ? scanData.edges : seedEdges;

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!containerRef.current || !mounted) return;

        const cy = cytoscape({
            container: containerRef.current,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'font-size': '9px',
                        'color': '#94a3b8',
                        'text-margin-y': 6,
                        'background-color': 'data(color)',
                        'border-width': 2,
                        'border-color': 'data(borderColor)',
                        'width': 'data(size)',
                        'height': 'data(size)',
                        'shape': 'data(shape)' as cytoscape.Css.NodeShape,
                        'overlay-padding': 4,
                        'text-wrap': 'ellipsis',
                        'text-max-width': '80px',
                    } as cytoscape.Css.Node,
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 'data(weight)',
                        'line-color': 'data(color)',
                        'target-arrow-color': 'data(color)',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'opacity': 0.6,
                        'arrow-scale': 0.8,
                    } as cytoscape.Css.Edge,
                },
                {
                    selector: 'node:selected',
                    style: {
                        'border-width': 4,
                        'border-color': '#6366f1',
                        'overlay-color': '#6366f1',
                        'overlay-opacity': 0.15,
                    },
                },
                {
                    selector: '.highlighted',
                    style: {
                        'opacity': 1,
                        'border-width': 3,
                    },
                },
                {
                    selector: '.faded',
                    style: {
                        'opacity': 0.15,
                    },
                },
            ],
            elements: {
                nodes: currentNodes
                    .filter((n: any) => filterType === 'all' || n.type === filterType)
                    .filter((n: any) => filterRisk === 'all' || n.risk === filterRisk)
                    .map((n: any) => ({
                        data: {
                            id: n.id,
                            label: n.label,
                            color: typeColors[n.type] || '#64748b',
                            borderColor: riskColors[n.risk || 'low'] || '#64748b',
                            size: n.type === 'module' ? 50 : n.type === 'service' ? 40 : 30,
                            shape: typeShapes[n.type] || 'ellipse',
                        },
                    })),
                edges: currentEdges
                    .filter((e: any) => {
                        const validNodes = currentNodes
                            .filter((n: any) => filterType === 'all' || n.type === filterType)
                            .filter((n: any) => filterRisk === 'all' || n.risk === filterRisk)
                            .map((n: any) => n.id);
                        return validNodes.includes(e.source) && validNodes.includes(e.target);
                    })
                    .map((e: any) => ({
                        data: {
                            id: e.id,
                            source: e.source,
                            target: e.target,
                            weight: (e.weight || 1) * 0.5 + 0.5,
                            color: e.criticality === 'high' ? '#ef4444' : e.criticality === 'medium' ? '#eab308' : '#475569',
                        },
                    })),
            },
            layout: {
                name: 'cose',
                animate: true,
                animationDuration: 800,
                nodeRepulsion: () => 8000,
                idealEdgeLength: () => 120,
                gravity: 0.3,
                padding: 40,
            } as cytoscape.CoseLayoutOptions,
            minZoom: 0.3,
            maxZoom: 3,
        });

        cy.on('tap', 'node', (evt) => {
            const nodeId = evt.target.id();
            const node = currentNodes.find((n: any) => n.id === nodeId);
            setSelectedNode(node || null);

            // Highlight connected nodes
            cy.elements().removeClass('highlighted faded');
            const neighborhood = evt.target.neighborhood().add(evt.target);
            cy.elements().addClass('faded');
            neighborhood.removeClass('faded').addClass('highlighted');
        });

        cy.on('tap', (evt) => {
            if (evt.target === cy) {
                setSelectedNode(null);
                cy.elements().removeClass('highlighted faded');
            }
        });

        cyRef.current = cy;

        return () => {
            cy.destroy();
        };
    }, [mounted, filterType, filterRisk, currentNodes, currentEdges]);

    if (!mounted) return null;

    const nodeTypes = ['all', ...new Set(currentNodes.map((n: any) => n.type))];
    const riskLevels = ['all', 'critical', 'high', 'medium', 'low'];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Dependency Graph</div>
                <h1>Dependency Graph Visualization</h1>
                <p>Interactive dependency map across {currentNodes.length} nodes and {currentEdges.length} edges</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiFilter size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type:</span>
                </div>
                {nodeTypes.map((t: any) => (
                    <button key={t} className={`chip ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
                        {t === 'all' ? 'All Types' : t.replace('_', ' ')}
                    </button>
                ))}
                <div style={{ width: '1px', height: '20px', background: 'var(--border-secondary)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Risk:</span>
                {riskLevels.map(r => (
                    <button key={r} className={`chip ${filterRisk === r ? 'active' : ''}`} onClick={() => setFilterRisk(r)}>
                        {r === 'all' ? 'All Risks' : r}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', height: isFullscreen ? 'calc(100vh - 180px)' : '600px' }}>
                {/* Graph */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <div
                        ref={containerRef}
                        className="graph-container"
                        style={{ height: '100%' }}
                    />
                    <div className="graph-controls">
                        <button className="btn btn-ghost btn-icon" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}>
                            <FiZoomIn size={16} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}>
                            <FiZoomOut size={16} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => cyRef.current?.fit(undefined, 40)}>
                            <FiRefreshCw size={16} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                            {isFullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                        </button>
                    </div>

                    {/* Legend */}
                    <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        background: 'var(--bg-card)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        fontSize: '0.7rem',
                    }}>
                        <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Legend</div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {Object.entries(typeColors).map(([type, color]) => (
                                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
                                    <span style={{ color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Border:</span>
                            {Object.entries(riskColors).map(([risk, color]) => (
                                <div key={risk} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: `2px solid ${color}`, background: 'transparent' }} />
                                    <span style={{ color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{risk}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Node Detail Panel */}
                {selectedNode && (
                    <div className="glass-card-static animate-slide-right" style={{ width: '320px', padding: '20px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <span className={`badge badge-${selectedNode.risk || 'low'}`}>{selectedNode.risk || 'low'}</span>
                                <h3 style={{ fontSize: '1.1rem', marginTop: '8px' }}>{selectedNode.label}</h3>
                            </div>
                            <button className="btn btn-ghost btn-icon" onClick={() => setSelectedNode(null)}>
                                <FiX size={16} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</div>
                                <div style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{selectedNode.type.replace('_', ' ')}</div>
                            </div>
                            {selectedNode.module && (
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Module</div>
                                    <div style={{ fontSize: '0.85rem' }}>{selectedNode.module}</div>
                                </div>
                            )}
                            {selectedNode.description && (
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedNode.description}</div>
                                </div>
                            )}
                            {selectedNode.businessMapping && (
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Mapping</div>
                                    <div className="chip active" style={{ marginTop: '4px' }}>{selectedNode.businessMapping}</div>
                                </div>
                            )}
                            {selectedNode.metrics && (
                                <>
                                    <div className="divider" />
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Metrics</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        {selectedNode.metrics.loc && (
                                            <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary-light)' }}>{selectedNode.metrics.loc}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LOC</div>
                                            </div>
                                        )}
                                        {selectedNode.metrics.complexity !== undefined && (
                                            <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedNode.metrics.complexity > 30 ? 'var(--risk-critical)' : 'var(--risk-medium)' }}>{selectedNode.metrics.complexity}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Complexity</div>
                                            </div>
                                        )}
                                        {selectedNode.metrics.testCoverage && (
                                            <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedNode.metrics.testCoverage >= 80 ? 'var(--risk-low)' : 'var(--risk-medium)' }}>{selectedNode.metrics.testCoverage}%</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Coverage</div>
                                            </div>
                                        )}
                                        {selectedNode.metrics.maintainability && (
                                            <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedNode.metrics.maintainability >= 70 ? 'var(--risk-low)' : 'var(--risk-high)' }}>{selectedNode.metrics.maintainability}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Maintainability</div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Connected edges */}
                            <div className="divider" />
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Connections</div>
                            {currentEdges.filter((e: any) => e.source === selectedNode.id || e.target === selectedNode.id).slice(0, 8).map((edge: any) => {
                                const isSource = edge.source === selectedNode.id;
                                const otherNode = currentNodes.find((n: any) => n.id === (isSource ? edge.target : edge.source));
                                return (
                                    <div key={edge.id} style={{
                                        padding: '6px 10px',
                                        background: 'var(--bg-surface)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{isSource ? '→' : '←'}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary-light)', fontFamily: 'var(--font-mono)' }}>{edge.type || 'deps'}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{otherNode?.label || edge.target}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
