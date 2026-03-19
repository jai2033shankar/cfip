'use client';

import { useState } from 'react';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiCode, FiSearch, FiAlertTriangle, FiShield, FiActivity } from 'react-icons/fi';
import { useScan } from '@/lib/scan-context';

interface FileNode {
    id?: string;
    name: string;
    type: 'file' | 'folder';
    language?: string;
    risk?: 'critical' | 'high' | 'medium' | 'low';
    loc?: number;
    children?: FileNode[];
    originalNode?: any;
}

const mockFileTree: FileNode[] = [
    {
        name: 'core-banking-engine', type: 'folder', children: [
            {
                name: 'src', type: 'folder', children: [
                    {
                        name: 'services', type: 'folder', children: [
                            { id: '1', name: 'TransactionProcessor.java', type: 'file', language: 'Java', risk: 'critical', loc: 3420 },
                            { id: '2', name: 'RiskCalculator.java', type: 'file', language: 'Java', risk: 'high', loc: 2780 },
                        ]
                    }
                ]
            }
        ]
    }
];

const riskColors: Record<string, string> = {
    critical: 'var(--risk-critical)',
    high: 'var(--risk-high)',
    medium: 'var(--risk-medium)',
    low: 'var(--risk-low)',
};

function TreeItem({ node, depth = 0, onSelect, selectedId }: { node: FileNode; depth?: number; onSelect: (node: FileNode) => void; selectedId: string | null }) {
    const [expanded, setExpanded] = useState(depth < 2);
    const isFolder = node.type === 'folder';
    const isSelected = selectedId === node.id;

    return (
        <div>
            <div
                onClick={() => {
                    if (isFolder) setExpanded(!expanded);
                    else onSelect(node);
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    paddingLeft: `${depth * 16 + 8}px`,
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: isFolder ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    borderLeft: isSelected ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
                {isFolder ? (
                    expanded ? <FiChevronDown size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <FiChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                ) : <span style={{ width: '12px' }} />}
                {isFolder ? <FiFolder size={14} style={{ color: 'var(--accent-primary-light)', flexShrink: 0 }} /> : <FiFile size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
                {node.risk && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: riskColors[node.risk], flexShrink: 0 }} />
                )}
            </div>
            {isFolder && expanded && node.children?.map((child, i) => (
                <TreeItem key={i} node={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />
            ))}
        </div>
    );
}

export default function ExplorerPage() {
    const [search, setSearch] = useState('');
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const { scanData } = useScan();

    let currentTree = mockFileTree;
    let totalFiles = 1306;

    if (scanData && scanData.nodes) {
        totalFiles = scanData.nodes.length;

        // Build dynamic tree grouped by type
        const grouped = scanData.nodes.reduce((acc: any, node: any) => {
            const type = node.type || 'unknown';
            if (!acc[type]) acc[type] = [];
            acc[type].push(node);
            return acc;
        }, {});

        currentTree = Object.keys(grouped).map(type => ({
            name: type.toUpperCase() + 'S',
            type: 'folder',
            children: grouped[type].map((n: any) => ({
                id: n.id,
                name: n.label || n.id,
                type: 'file',
                risk: n.risk || 'low',
                loc: n.metrics?.loc || 0,
                originalNode: n
            }))
        }));
    }

    const filterTree = (nodes: FileNode[], term: string): FileNode[] => {
        if (!term) return nodes;
        return nodes.reduce((acc: FileNode[], node) => {
            if (node.type === 'file' && node.name.toLowerCase().includes(term.toLowerCase())) {
                acc.push(node);
            } else if (node.type === 'folder' && node.children) {
                const filteredChildren = filterTree(node.children, term);
                if (filteredChildren.length > 0) {
                    acc.push({ ...node, children: filteredChildren });
                }
            }
            return acc;
        }, []);
    };

    const displayTree = filterTree(currentTree, search);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Code Explorer</div>
                <h1>Code Explorer</h1>
                <p>Browse and analyze scanned repository file structures</p>
            </div>

            <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 220px)' }}>
                {/* File Tree */}
                <div className="glass-card-static" style={{ width: '340px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-sm)', padding: '6px 10px' }}>
                            <FiSearch size={14} style={{ color: 'var(--text-muted)' }} />
                            <input
                                placeholder="Search nodes..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 4px' }}>
                        {displayTree.map((node, i) => (
                            <TreeItem key={i} node={node} onSelect={setSelectedFile} selectedId={selectedFile?.id || null} />
                        ))}
                    </div>
                    <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-secondary)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {totalFiles} total nodes identified
                    </div>
                </div>

                {/* Content Viewer */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedFile ? (
                        <>
                            {/* Header */}
                            <div className="glass-card-static" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FiCode size={16} style={{ color: 'var(--accent-primary-light)' }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{selectedFile.name}</span>
                                    {selectedFile.risk && <span className={`badge badge-${selectedFile.risk}`}>{selectedFile.risk.toUpperCase()}</span>}
                                    {selectedFile.loc ? <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedFile.loc} LOC</span> : null}
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {selectedFile.originalNode?.type && <span className="chip"><FiActivity size={12} /> {selectedFile.originalNode.type}</span>}
                                    {selectedFile.originalNode?.businessMapping && <span className="chip"><FiShield size={12} /> {selectedFile.originalNode.businessMapping}</span>}
                                </div>
                            </div>

                            {/* Details Panel */}
                            <div className="code-viewer" style={{ flex: 1, overflow: 'auto', padding: '24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Node Analysis</h3>

                                {selectedFile.originalNode?.description && (
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                                        {selectedFile.originalNode.description}
                                    </p>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metadata</div>
                                        <pre style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                                            {JSON.stringify(selectedFile.originalNode, null, 2)}
                                        </pre>
                                    </div>

                                    {/* Related Risks */}
                                    {(scanData?.risks || []).filter((r: any) => r.node_id === selectedFile.id).length > 0 && (
                                        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--risk-critical)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}><FiAlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} /> Associated Risks</div>
                                            {(scanData?.risks || []).filter((r: any) => r.node_id === selectedFile.id).map((risk: any, i: number) => (
                                                <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{risk.reason}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Recommendation: {risk.recommendation}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="glass-card-static" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <FiCode size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>No Node Selected</h3>
                            <p style={{ fontSize: '0.9rem' }}>Select a node from the explorer to view its deep analysis details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
