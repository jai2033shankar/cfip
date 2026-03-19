'use client';

import { useState } from 'react';
import { FiTarget, FiActivity, FiShield, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiLayers } from 'react-icons/fi';
import { businessCapabilities } from '@/lib/seed-data';

const domains = ['All', 'Operations', 'Compliance', 'Customer Management', 'Capital Markets', 'Finance', 'Security'];

const BIAN_DOMAINS = [
    { name: 'Operations', capabilities: ['Payment Processing', 'Treasury Operations'] },
    { name: 'Compliance', capabilities: ['AML Compliance', 'Regulatory Reporting'] },
    { name: 'Customer Management', capabilities: ['Customer Onboarding'] },
    { name: 'Capital Markets', capabilities: ['Trade Processing'] },
    { name: 'Finance', capabilities: ['Financial Accounting'] },
    { name: 'Security', capabilities: ['Access Control'] },
];

import { useScan } from '@/lib/scan-context';

export default function BusinessPage() {
    const { scanData } = useScan();
    const [selectedDomain, setSelectedDomain] = useState('All');

    const currentCapabilities = scanData?.business_mappings || businessCapabilities;

    const filtered = selectedDomain === 'All'
        ? currentCapabilities
        : currentCapabilities.filter((bc: any) => bc.domain === selectedDomain);

    // Dynamic Taxonomy recalculation based on actual scan mappings
    const activeTaxonomy = BIAN_DOMAINS.map(b_domain => {
        const matchingCaps = currentCapabilities.filter((bc: any) => bc.domain === b_domain.name);
        const mapped = matchingCaps.length;
        const total = b_domain.capabilities.length;
        return {
            domain: b_domain.name,
            capabilities: b_domain.capabilities,
            coverage: total > 0 ? Math.round((mapped / total) * 100) : 0
        };
    });

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Business Intelligence</div>
                <h1>Business Intelligence Layer</h1>
                <p>Code-to-business capability mapping aligned with BIAN Framework</p>
            </div>

            {/* Domain Filter */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {domains.map(d => (
                    <button key={d} className={`chip ${selectedDomain === d ? 'active' : ''}`} onClick={() => setSelectedDomain(d)}>
                        {d}
                    </button>
                ))}
            </div>

            {/* Capability Cards */}
            <div className="grid-2" style={{ marginBottom: '24px' }}>
                {filtered.map((bc: any) => (
                    <div key={bc.id} className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--accent-secondary-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{bc.domain}</span>
                                <h3 style={{ fontSize: '1.05rem', marginTop: '4px' }}>{bc.name}</h3>
                            </div>
                            <span className={`badge badge-${bc.riskLevel}`}>{bc.riskLevel}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{bc.description}</p>

                        {/* Metrics */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Health Score</div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{
                                        width: `${bc.healthScore}%`,
                                        background: bc.healthScore >= 80 ? 'var(--risk-low)' : bc.healthScore >= 60 ? 'var(--risk-medium)' : 'var(--risk-critical)',
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{bc.healthScore}%</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Test Coverage</div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{
                                        width: `${bc.coverage}%`,
                                        background: bc.coverage >= 80 ? 'var(--risk-low)' : bc.coverage >= 60 ? 'var(--risk-medium)' : 'var(--risk-high)',
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{bc.coverage}%</div>
                            </div>
                        </div>

                        {/* Linked modules */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {bc.modules?.map((mod: string, i: number) => (
                                <span key={i} style={{
                                    padding: '2px 8px',
                                    background: 'rgba(99, 102, 241, 0.08)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.7rem',
                                    color: 'var(--accent-primary-light)',
                                    fontFamily: 'var(--font-mono)',
                                }}>{mod}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* BIAN Taxonomy */}
            <div className="glass-card-static" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiLayers size={18} style={{ color: 'var(--accent-primary-light)' }} />
                    BIAN Service Domain Coverage
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeTaxonomy.map((domain, i) => (
                        <div key={i} style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{domain.domain}</span>
                                <span style={{
                                    fontWeight: 700,
                                    color: domain.coverage >= 75 ? 'var(--risk-low)' : domain.coverage >= 50 ? 'var(--risk-medium)' : 'var(--risk-high)',
                                }}>{domain.coverage}% mapped</span>
                            </div>
                            <div className="progress-bar" style={{ marginBottom: '8px' }}>
                                <div className="progress-fill" style={{
                                    width: `${domain.coverage}%`,
                                    background: domain.coverage >= 75 ? 'var(--risk-low)' : domain.coverage >= 50 ? 'var(--gradient-primary)' : 'var(--risk-high)',
                                }} />
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {domain.capabilities.map((cap, j) => (
                                    <span key={j} className="chip">{cap}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
