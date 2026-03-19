'use client';

import { FiLayers, FiArrowDown, FiArrowRight, FiBox, FiServer, FiDatabase, FiGlobe, FiShield, FiCpu } from 'react-icons/fi';
import { graphNodes, graphEdges } from '@/lib/seed-data';

import { useScan } from '@/lib/scan-context';

export default function ArchitecturePage() {
    const { scanData } = useScan();

    const currentNodes = scanData?.nodes || graphNodes;
    const currentEdges = scanData?.edges || graphEdges;

    const modules = currentNodes.filter((n: any) => n.type === 'module');
    const moduleEdges = currentEdges.filter((e: any) => e.source.startsWith('mod-') && e.target.startsWith('mod-'));

    // Dynamic Architecture Layers
    const currentArchitectureLayers = [
        {
            name: 'Client Applications',
            color: '#06b6d4',
            components: ['Web Dashboard (React)', 'Mobile App (iOS/Android)', 'API Gateway']
        },
        {
            name: 'Business Logic Services',
            color: '#6366f1',
            components: currentNodes.filter((n: any) => n.type === 'service' || n.type === 'module').slice(0, 5).map((n: any) => n.label)
        },
        {
            name: 'Data & Persistence',
            color: '#10b981',
            components: ['PostgreSQL (Primary DB)', 'Redis (Caching)', 'Kafka (Event Stream)', 'S3 (Document Store)']
        }
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Architecture View</div>
                <h1>Architecture Reconstruction</h1>
                <p>Reverse-engineered system architecture from code analysis</p>
            </div>

            {/* Architecture Layers */}
            <div className="glass-card-static" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiLayers size={18} style={{ color: 'var(--accent-primary-light)' }} />
                    System Layer Architecture
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentArchitectureLayers.map((layer, i) => (
                        <div key={i}>
                            <div style={{
                                padding: '16px 20px',
                                background: `${layer.color}08`,
                                border: `1px solid ${layer.color}30`,
                                borderLeft: `4px solid ${layer.color}`,
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontWeight: 700, color: layer.color, fontSize: '0.9rem', minWidth: '180px' }}>{layer.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    {layer.components.map((comp, j) => (
                                        <span key={j} style={{
                                            padding: '4px 10px',
                                            background: `${layer.color}15`,
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            color: layer.color,
                                            fontWeight: 500,
                                        }}>{comp}</span>
                                    ))}
                                </div>
                            </div>
                            {i < currentArchitectureLayers.length - 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                                    <FiArrowDown size={14} style={{ color: 'var(--text-muted)' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Module Dependency Matrix */}
            <div className="grid-2" style={{ marginBottom: '24px' }}>
                <div className="glass-card-static" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiBox size={18} style={{ color: 'var(--accent-primary-light)' }} />
                        Module Dependencies
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {modules.map((mod: any) => {
                            const outgoing = moduleEdges.filter((e: any) => e.source === mod.id);
                            const incoming = moduleEdges.filter((e: any) => e.target === mod.id);
                            return (
                                <div key={mod.id} style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-surface)',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: `3px solid ${mod.risk === 'critical' ? 'var(--risk-critical)' : mod.risk === 'high' ? 'var(--risk-high)' : mod.risk === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)'}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{mod.label}</span>
                                        <span className={`badge badge-${mod.risk || 'low'}`}>{mod.risk}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {mod.description}
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.7rem' }}>
                                        <span style={{ color: 'var(--accent-secondary-light)' }}>→ {outgoing.length} outgoing</span>
                                        <span style={{ color: 'var(--accent-primary-light)' }}>← {incoming.length} incoming</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Service Mesh */}
                <div className="glass-card-static" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiServer size={18} style={{ color: 'var(--accent-primary-light)' }} />
                        Service Mesh Topology
                    </h3>
                    <div style={{
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}>
                        {[
                            { name: 'Payment Service', deps: ['Core Banking', 'Auth Service'], icon: <FiGlobe />, color: '#6366f1', status: 'healthy' },
                            { name: 'AML Service', deps: ['Core Banking', 'Sanctions DB'], icon: <FiShield />, color: '#ef4444', status: 'warning' },
                            { name: 'KYC Service', deps: ['AML Service', 'Auth Service'], icon: <FiCpu />, color: '#22c55e', status: 'healthy' },
                            { name: 'Trade Service', deps: ['Core Banking', 'Payment Service'], icon: <FiArrowRight />, color: '#f97316', status: 'healthy' },
                            { name: 'Treasury Service', deps: ['Core Banking', 'Trade Service'], icon: <FiDatabase />, color: '#eab308', status: 'degraded' },
                            { name: 'Reporting Service', deps: ['Core Banking', 'AML Service'], icon: <FiLayers />, color: '#8b5cf6', status: 'healthy' },
                        ].map((svc, i) => (
                            <div key={i} style={{
                                padding: '12px 16px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                                    background: `${svc.color}15`, color: svc.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>{svc.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{svc.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>→ {svc.deps.join(', ')}</div>
                                </div>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: svc.status === 'healthy' ? 'var(--risk-low)' : svc.status === 'warning' ? 'var(--risk-high)' : 'var(--risk-medium)',
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* API Contracts */}
            <div className="glass-card-static" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiGlobe size={18} style={{ color: 'var(--accent-primary-light)' }} />
                    API Contract Map
                </h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Endpoint</th>
                            <th>Method</th>
                            <th>Service</th>
                            <th>Risk</th>
                            <th>Dependencies</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { endpoint: '/api/v2/payments', method: 'POST', service: 'Payment Service', risk: 'critical' as const, deps: 'processPayment → validateTxn → screenCustomer', status: 'Active' },
                            { endpoint: '/api/v2/accounts', method: 'GET', service: 'Core Banking', risk: 'high' as const, deps: 'checkBalance → AccountRepository', status: 'Active' },
                            { endpoint: '/api/v2/transfers', method: 'POST', service: 'Core Banking', risk: 'critical' as const, deps: 'validateTxn → postLedger', status: 'Active' },
                            { endpoint: '/api/v2/kyc/verify', method: 'POST', service: 'KYC Service', risk: 'high' as const, deps: 'screenCustomer → KYCValidator', status: 'Active' },
                            { endpoint: '/api/v2/aml/screen', method: 'POST', service: 'AML Service', risk: 'critical' as const, deps: 'screenCustomer → SanctionsList', status: 'Active' },
                            { endpoint: '/api/v2/trades', method: 'POST', service: 'Trade Service', risk: 'high' as const, deps: 'settleTrade → postLedger', status: 'Active' },
                            { endpoint: '/api/v2/reports/regulatory', method: 'GET', service: 'Reporting Service', risk: 'critical' as const, deps: 'generateReport → multiple DB reads', status: 'Active' },
                        ].map((api, i) => (
                            <tr key={i}>
                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-secondary-light)' }}>{api.endpoint}</td>
                                <td><span className="badge badge-info">{api.method}</span></td>
                                <td style={{ fontSize: '0.85rem' }}>{api.service}</td>
                                <td><span className={`badge badge-${api.risk}`}>{api.risk}</span></td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '200px' }}>{api.deps}</td>
                                <td><span style={{ color: 'var(--risk-low)', fontSize: '0.8rem' }}>● {api.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
