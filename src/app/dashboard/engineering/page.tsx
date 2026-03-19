'use client';

import { useState } from 'react';
import { useScan } from '@/lib/scan-context';
import { FiTarget, FiBox, FiCpu, FiShield, FiDatabase, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const fallbackEngineeringRisks = [
    {
        id: 'eng-1',
        node_id: 'db-migration',
        domain: 'Database Schema',
        impact_type: 'Database Schema Configuration Risk',
        severity: 'critical',
        description: "Database Schema risk: Unsafe migration or ORM access in 'V2__Add_Customer_Table' could result in data loss or locking."
    },
    {
        id: 'eng-2',
        node_id: 'ci-pipeline',
        domain: 'Ci Cd',
        impact_type: 'Ci Cd Configuration Risk',
        severity: 'high',
        description: "Pipeline vulnerability in '.github/workflows/deploy.yml'. A high risk in deployment config may expose secrets or halt the CI/CD flow."
    }
];

const categoryIcons: Record<string, React.ReactNode> = {
    'Database Schema': <FiDatabase />,
    'Ci Cd': <FiCpu />,
    'Infrastructure': <FiBox />,
    'Auth Security': <FiShield />,
};

export default function EngineeringPage() {
    const { scanData } = useScan();

    // Filter engineering risks from scanData (starting with eng- prefix) or fallback to seed
    let engineeringRisks: any[] = [];
    if (scanData && scanData.risks) {
        engineeringRisks = scanData.risks.filter(r => r.id?.startsWith('eng-') || (r.domain && ['Database Schema', 'Ci Cd', 'Infrastructure', 'Auth Security'].includes(r.domain)));
    }

    if (engineeringRisks.length === 0 && !scanData) {
        engineeringRisks = fallbackEngineeringRisks;
    }

    const domainGroups = engineeringRisks.reduce((acc, risk) => {
        const d = risk.domain || 'Other';
        if (!acc[d]) acc[d] = [];
        acc[d].push(risk);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <div className="breadcrumb">
                    <span>CFIP</span> / Intelligence / Engineering Insights
                </div>
                <h1>Engineering Domain Analysis</h1>
                <p>Architectural drift, DevOps configuration, and systemic engineering vulnerabilities.</p>
            </div>

            <div className="grid-3" style={{ marginBottom: '24px' }}>
                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{engineeringRisks.length}</div>
                            <div className="stat-label">Total Domain Risks</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                            <FiTarget size={20} />
                        </div>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{Object.keys(domainGroups).length}</div>
                            <div className="stat-label">Affected Categories</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--risk-critical)' }}>
                            <FiAlertTriangle size={20} />
                        </div>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">Active</div>
                            <div className="stat-label">Copilot Monitor</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--risk-low)' }}>
                            <FiCheckCircle size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {engineeringRisks.length === 0 ? (
                <div className="glass-card-static" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <FiCheckCircle size={48} style={{ color: 'var(--risk-low)', margin: '0 auto 16px', opacity: 0.8 }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>No Engineering Risks Detected</h3>
                    <p>The Python pipeline has verified your Infrastructure, CI/CD, and Auth Configurations are clean.</p>
                </div>
            ) : (
                <div className="grid-2 stagger" style={{ gap: '24px' }}>
                    {(Object.entries(domainGroups) as [string, any[]][]).map(([domain, risks]) => (
                        <div key={domain} className="glass-card-static" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'var(--accent-primary-light)' }}>
                                    {categoryIcons[domain] || <FiTarget />}
                                </span>
                                {domain}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {risks.map((risk) => (
                                    <div key={risk.id} style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid var(--border-secondary)',
                                        padding: '16px',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{risk.impact_type}</div>
                                            <span className={`badge badge-${risk.severity}`}>{risk.severity}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            {risk.description}
                                        </p>
                                        <div style={{ marginTop: '12px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                            Node: {risk.node_id}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
