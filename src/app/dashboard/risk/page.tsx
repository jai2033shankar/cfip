'use client';

import { useState } from 'react';
import {
    FiAlertTriangle, FiTarget, FiChevronRight,
    FiDatabase, FiGlobe, FiShield, FiClock, FiCpu
} from 'react-icons/fi';
import { riskItems as seedRisks, graphNodes as seedNodes, impactSimulations } from '@/lib/seed-data';
import { useScan } from '@/lib/scan-context';

const categories = ['all', 'reliability', 'compliance', 'security', 'performance', 'maintenance', 'architecture'];

export default function RiskPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [showSimulation, setShowSimulation] = useState(false);
    const { scanData } = useScan();

    const currentNodes = scanData ? scanData.nodes : seedNodes;
    let riskItems = seedRisks;

    if (scanData) {
        riskItems = scanData.risks.map((r: any, i: number) => ({
            id: `risk-${i}`,
            title: r.reason,
            severity: r.severity,
            category: r.risk_type.split('_').join(' '),
            nodeId: r.node_id,
            affectedDownstream: r.affected_downstream_count,
            businessImpact: `Impact on ${scanData.nodes.find((n: any) => n.id === r.node_id)?.label || 'unknown'} and downstream dependencies`,
            estimatedEffort: r.recommendation.length > 50 ? '3 days' : '1 day',
            type: r.risk_type,
            description: r.reason,
            recommendation: r.recommendation
        }));
    }

    const filteredRisks = riskItems.filter(r =>
        (selectedCategory === 'all' || r.category === selectedCategory) &&
        (selectedSeverity === 'all' || r.severity === selectedSeverity)
    );

    const activeSimulation = impactSimulations.find(s => s.changedNode === selectedNode);
    const simulableNodes = currentNodes;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Risk & Impact</div>
                <h1>Risk & Impact Simulation</h1>
                <p>Pre-commit risk radar with downstream impact analysis</p>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: '24px', width: 'fit-content' }}>
                <button className={`tab ${!showSimulation ? 'active' : ''}`} onClick={() => setShowSimulation(false)}>
                    <FiAlertTriangle size={14} style={{ marginRight: '6px' }} /> Risk Registry
                </button>
                <button className={`tab ${showSimulation ? 'active' : ''}`} onClick={() => setShowSimulation(true)}>
                    <FiTarget size={14} style={{ marginRight: '6px' }} /> Impact Simulation
                </button>
            </div>

            {!showSimulation ? (
                <>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Category:</span>
                        {categories.map(c => (
                            <button key={c} className={`chip ${selectedCategory === c ? 'active' : ''}`} onClick={() => setSelectedCategory(c)}>
                                {c === 'all' ? 'All' : c}
                            </button>
                        ))}
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-secondary)', alignSelf: 'center' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Severity:</span>
                        {['all', 'critical', 'high', 'medium', 'low'].map(s => (
                            <button key={s} className={`chip ${selectedSeverity === s ? 'active' : ''}`} onClick={() => setSelectedSeverity(s)}>
                                {s === 'all' ? 'All' : s}
                            </button>
                        ))}
                    </div>

                    {/* Risk Summary Bar */}
                    <div className="grid-4" style={{ marginBottom: '24px' }}>
                        {[
                            { label: 'Critical', count: riskItems.filter(r => r.severity === 'critical').length, color: 'var(--risk-critical)', bg: 'var(--risk-critical-bg)' },
                            { label: 'High', count: riskItems.filter(r => r.severity === 'high').length, color: 'var(--risk-high)', bg: 'var(--risk-high-bg)' },
                            { label: 'Medium', count: riskItems.filter(r => r.severity === 'medium').length, color: 'var(--risk-medium)', bg: 'var(--risk-medium-bg)' },
                            { label: 'Low', count: riskItems.filter(r => r.severity === 'low').length, color: 'var(--risk-low)', bg: 'var(--risk-low-bg)' },
                        ].map((s, i) => (
                            <div key={i} className="glass-card" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedSeverity(s.label.toLowerCase())}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.count}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label} Risks</div>
                            </div>
                        ))}
                    </div>

                    {/* Risk Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredRisks.map(risk => (
                            <div key={risk.id} className="glass-card-static" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                                        background: risk.severity === 'critical' ? 'var(--risk-critical-bg)' : risk.severity === 'high' ? 'var(--risk-high-bg)' : 'var(--risk-medium-bg)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: risk.severity === 'critical' ? 'var(--risk-critical)' : risk.severity === 'high' ? 'var(--risk-high)' : 'var(--risk-medium)',
                                        flexShrink: 0,
                                    }}>
                                        <FiAlertTriangle size={18} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <h4 style={{ fontSize: '0.95rem' }}>{risk.title}</h4>
                                            <span className={`badge badge-${risk.severity}`}>{risk.severity}</span>
                                            <span className="chip" style={{ textTransform: 'capitalize' }}>{risk.category}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.6 }}>{risk.description}</p>
                                        <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', marginBottom: '12px' }}>
                                            <div><span style={{ color: 'var(--text-muted)' }}>Node:</span> <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary-light)' }}>{risk.nodeId}</span></div>
                                            <div><span style={{ color: 'var(--text-muted)' }}>Downstream:</span> <span style={{ fontWeight: 700, color: risk.affectedDownstream > 10 ? 'var(--risk-critical)' : 'var(--text-primary)' }}>{risk.affectedDownstream} nodes</span></div>
                                            <div><span style={{ color: 'var(--text-muted)' }}>Effort:</span> <span>{risk.estimatedEffort}</span></div>
                                        </div>
                                        <div style={{ padding: '10px 14px', background: 'rgba(249, 115, 22, 0.06)', border: '1px solid rgba(249, 115, 22, 0.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--risk-high)' }}>Business Impact:</span>
                                            <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>{risk.businessImpact}</span>
                                        </div>
                                        <div style={{ marginTop: '8px', padding: '10px 14px', background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--risk-low)' }}>Recommendation:</span>
                                            <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>{risk.recommendation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                /* Impact Simulation */
                <div>
                    <div className="glass-card-static" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiTarget size={18} style={{ color: 'var(--accent-primary-light)' }} />
                            What-If Analysis
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            Select a node to simulate the impact of changing it. See downstream failures, API impacts, and SLA risks.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {simulableNodes.slice(0, 10).map(node => (
                                <button key={node.id} className={`chip ${selectedNode === node.id ? 'active' : ''}`} onClick={() => setSelectedNode(node.id)}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{node.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeSimulation ? (
                        <div className="animate-fade-in">
                            <div className="glass-card-static" style={{ padding: '24px', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>
                                    Impact Cascade for <span style={{ color: 'var(--accent-primary-light)', fontFamily: 'var(--font-mono)' }}>
                                        {currentNodes.find((n: any) => n.id === selectedNode)?.label}
                                    </span>
                                </h3>

                                {/* Risk Summary */}
                                <div className="grid-4" style={{ marginBottom: '20px' }}>
                                    {[
                                        { label: 'SLA Risk', value: activeSimulation.riskSummary.slaRisk, icon: <FiClock /> },
                                        { label: 'Compliance Risk', value: activeSimulation.riskSummary.complianceRisk, icon: <FiShield /> },
                                        { label: 'Data Risk', value: activeSimulation.riskSummary.dataRisk, icon: <FiDatabase /> },
                                        { label: 'Security Risk', value: activeSimulation.riskSummary.securityRisk, icon: <FiGlobe /> },
                                    ].map((r, i) => (
                                        <div key={i} style={{
                                            padding: '12px',
                                            background: r.value.startsWith('CRITICAL') ? 'var(--risk-critical-bg)' : r.value.startsWith('HIGH') ? 'var(--risk-high-bg)' : 'var(--risk-medium-bg)',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${r.value.startsWith('CRITICAL') ? 'rgba(239,68,68,0.2)' : r.value.startsWith('HIGH') ? 'rgba(249,115,22,0.2)' : 'rgba(234,179,8,0.2)'}`,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                {r.icon} {r.label}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{r.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Impact Chain */}
                                <h4 style={{ fontSize: '0.85rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>Downstream Impact Chain ({activeSimulation.impacts.length} affected)</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {activeSimulation.impacts.map((impact, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            background: 'var(--bg-surface)',
                                            borderRadius: 'var(--radius-md)',
                                            borderLeft: `3px solid ${impact.severity === 'critical' ? 'var(--risk-critical)' : impact.severity === 'high' ? 'var(--risk-high)' : 'var(--risk-medium)'}`,
                                        }}>
                                            <FiChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary-light)' }}>
                                                        {currentNodes.find((n: any) => n.id === impact.nodeId)?.label || impact.nodeId}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{impact.description}</div>
                                            </div>
                                            <span className={`badge badge-${impact.severity}`}>{impact.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : selectedNode ? (
                        <div className="glass-card-static" style={{ padding: '40px', textAlign: 'center' }}>
                            <FiCpu size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>No Simulation Data</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                Impact simulation for this node will be generated on next analysis run.
                            </p>
                        </div>
                    ) : (
                        <div className="glass-card-static" style={{ padding: '40px', textAlign: 'center' }}>
                            <FiTarget size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>Select a Node</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                Choose a function or service above to simulate its change impact across the system.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
