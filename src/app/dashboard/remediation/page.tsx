'use client';

import { useState } from 'react';
import { FiCpu, FiCheck, FiX, FiTrendingUp, FiClock, FiShield, FiZap, FiCode, FiActivity, FiTarget, FiAlertTriangle } from 'react-icons/fi';
import { remediationSuggestions as seedRemediations } from '@/lib/seed-data';
import { useScan } from '@/lib/scan-context';

const categoryIcons: Record<string, React.ReactNode> = {
    architecture: <FiTarget size={16} />,
    refactoring: <FiCode size={16} />,
    security: <FiShield size={16} />,
    compliance: <FiShield size={16} />,
    testing: <FiActivity size={16} />,
    performance: <FiZap size={16} />,
};

const categoryColors: Record<string, string> = {
    architecture: '#6366f1',
    refactoring: '#06b6d4',
    security: '#ef4444',
    compliance: '#f97316',
    testing: '#22c55e',
    performance: '#eab308',
};

export default function RemediationPage() {
    const { scanData } = useScan();
    const [filter, setFilter] = useState('all');
    const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
    const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

    const currentRemediations = scanData?.remediations || seedRemediations;

    const categories = ['all', ...Array.from(new Set(currentRemediations.map((r: any) => r.category)))];
    const filtered = filter === 'all' ? currentRemediations : currentRemediations.filter((r: any) => r.category === filter);

    const totalRiskReduction = currentRemediations
        .filter((r: any) => acceptedIds.has(r.id))
        .reduce((sum: number, r: any) => sum + r.riskReduction, 0);

    const totalEffort = currentRemediations
        .filter((r: any) => acceptedIds.has(r.id))
        .reduce((sum: number, r: any) => sum + r.effortDays, 0);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / AI Remediation</div>
                <h1>AI Remediation Engine</h1>
                <p>AI-generated suggestions with confidence scores and engineering effort estimates</p>
            </div>

            {/* Summary Cards */}
            <div className="grid-4" style={{ marginBottom: '24px' }}>
                <div className="glass-card stat-card">
                    <div className="stat-value">{currentRemediations.length}</div>
                    <div className="stat-label">Total Suggestions</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-value" style={{ color: 'var(--risk-low)' }}>{acceptedIds.size}</div>
                    <div className="stat-label">Accepted</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-value">{totalRiskReduction}%</div>
                    <div className="stat-label">Risk Reduction (if applied)</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-value">{totalEffort}d</div>
                    <div className="stat-label">Estimated Effort</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {categories.map(c => (
                    <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                        {c === 'all' ? 'All Categories' : c}
                    </button>
                ))}
            </div>

            {/* Suggestion Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map(suggestion => {
                    const isAccepted = acceptedIds.has(suggestion.id);
                    const isRejected = rejectedIds.has(suggestion.id);
                    const color = categoryColors[suggestion.category] || '#6366f1';

                    return (
                        <div key={suggestion.id} className="glass-card-static" style={{
                            padding: '20px',
                            borderLeft: `3px solid ${color}`,
                            opacity: isRejected ? 0.5 : 1,
                            transition: 'opacity 0.3s',
                        }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                                    background: `${color}15`, color: color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {categoryIcons[suggestion.category]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <h4 style={{ fontSize: '0.95rem' }}>{suggestion.title}</h4>
                                        <span className="chip" style={{ textTransform: 'capitalize', borderColor: `${color}40`, color }}>{suggestion.category}</span>
                                        <span className="chip"><FiTrendingUp size={11} /> {suggestion.riskReduction}% risk reduction</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>{suggestion.description}</p>

                                    <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FiCpu size={13} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ color: 'var(--text-muted)' }}>Confidence:</span>
                                            <span style={{
                                                fontWeight: 700,
                                                color: suggestion.confidence >= 90 ? 'var(--risk-low)' : suggestion.confidence >= 80 ? 'var(--risk-medium)' : 'var(--risk-high)',
                                            }}>{suggestion.confidence}%</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FiClock size={13} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ color: 'var(--text-muted)' }}>Effort:</span>
                                            <span style={{ fontWeight: 600 }}>{suggestion.effortDays} days ({suggestion.effort})</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pattern:</span>
                                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary-light)' }}>{suggestion.pattern}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                        {suggestion.affectedFiles && suggestion.affectedFiles.map((f: string, i: number) => (
                                            <span key={i} style={{
                                                padding: '2px 8px',
                                                background: 'var(--bg-surface)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.7rem',
                                                fontFamily: 'var(--font-mono)',
                                                color: 'var(--text-secondary)',
                                            }}>{f}</span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className={isAccepted ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                                            onClick={() => {
                                                const next = new Set(acceptedIds);
                                                if (isAccepted) next.delete(suggestion.id);
                                                else next.add(suggestion.id);
                                                setAcceptedIds(next);
                                                rejectedIds.delete(suggestion.id);
                                                setRejectedIds(new Set(rejectedIds));
                                            }}
                                        >
                                            <FiCheck size={14} /> {isAccepted ? 'Accepted' : 'Accept'}
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => {
                                                const next = new Set(rejectedIds);
                                                if (isRejected) next.delete(suggestion.id);
                                                else next.add(suggestion.id);
                                                setRejectedIds(next);
                                                acceptedIds.delete(suggestion.id);
                                                setAcceptedIds(new Set(acceptedIds));
                                            }}
                                        >
                                            <FiX size={14} /> {isRejected ? 'Rejected' : 'Reject'}
                                        </button>
                                        <button className="btn btn-ghost btn-sm">View Impact</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
