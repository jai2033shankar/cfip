'use client';

import { useState } from 'react';
import { FiShield, FiUsers, FiFileText, FiClock, FiFilter, FiDownload, FiSearch, FiActivity, FiSettings, FiKey, FiCpu } from 'react-icons/fi';
import { auditLog, scanHistory } from '@/lib/seed-data';

const typeColors: Record<string, string> = {
    scan: '#6366f1',
    analysis: '#06b6d4',
    config_change: '#f97316',
    access: '#22c55e',
    ai_inference: '#8b5cf6',
};

const typeIcons: Record<string, React.ReactNode> = {
    scan: <FiActivity size={14} />,
    analysis: <FiCpu size={14} />,
    config_change: <FiSettings size={14} />,
    access: <FiKey size={14} />,
    ai_inference: <FiCpu size={14} />,
};

export default function GovernancePage() {
    const [tab, setTab] = useState<'audit' | 'scans' | 'rbac'>('audit');
    const [logFilter, setLogFilter] = useState('all');

    const filteredLogs = logFilter === 'all' ? auditLog : auditLog.filter(l => l.type === logFilter);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Governance & Audit</div>
                <h1>Governance & Audit</h1>
                <p>Complete audit trail, RBAC management, and scan history</p>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: '24px', width: 'fit-content' }}>
                <button className={`tab ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
                    <FiFileText size={14} style={{ marginRight: '6px' }} /> Audit Log
                </button>
                <button className={`tab ${tab === 'scans' ? 'active' : ''}`} onClick={() => setTab('scans')}>
                    <FiActivity size={14} style={{ marginRight: '6px' }} /> Scan History
                </button>
                <button className={`tab ${tab === 'rbac' ? 'active' : ''}`} onClick={() => setTab('rbac')}>
                    <FiUsers size={14} style={{ marginRight: '6px' }} /> Access Control
                </button>
            </div>

            {tab === 'audit' && (
                <div>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
                        <FiFilter size={14} style={{ color: 'var(--text-muted)' }} />
                        {['all', 'scan', 'analysis', 'config_change', 'access', 'ai_inference'].map(t => (
                            <button key={t} className={`chip ${logFilter === t ? 'active' : ''}`} onClick={() => setLogFilter(t)}>
                                {t === 'all' ? 'All' : t.replace('_', ' ')}
                            </button>
                        ))}
                        <div style={{ flex: 1 }} />
                        <button className="btn btn-secondary btn-sm"><FiDownload size={14} /> Export CSV</button>
                    </div>

                    {/* Audit Table */}
                    <div className="glass-card-static" style={{ overflow: 'hidden' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log.id}>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px',
                                                borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 600,
                                                background: `${typeColors[log.type]}15`,
                                                color: typeColors[log.type],
                                            }}>
                                                {typeIcons[log.type]} {log.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{log.action}</td>
                                        <td style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary-light)' }}>{log.user}</td>
                                        <td style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{log.role}</td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'scans' && (
                <div className="glass-card-static" style={{ overflow: 'hidden' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Repository</th>
                                <th>Timestamp</th>
                                <th>Duration</th>
                                <th>Files Scanned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scanHistory.map(scan => (
                                <tr key={scan.id}>
                                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{scan.repository}</td>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(scan.timestamp).toLocaleString()}
                                    </td>
                                    <td style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FiClock size={12} style={{ color: 'var(--text-muted)' }} /> {scan.duration}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{scan.filesScanned}</td>
                                    <td>
                                        <span style={{
                                            color: 'var(--risk-low)',
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}>● Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'rbac' && (
                <div>
                    <div className="grid-2" style={{ marginBottom: '24px' }}>
                        {[
                            {
                                role: 'Admin', permissions: ['Full system access', 'User management', 'Configuration', 'Scan initiation', 'Report export'],
                                users: ['Alex Morgan'], color: '#ef4444',
                            },
                            {
                                role: 'Architect', permissions: ['View all analysis', 'Architecture view', 'Business mapping edit', 'Report export'],
                                users: ['Sarah Chen'], color: '#6366f1',
                            },
                            {
                                role: 'Developer', permissions: ['View code analysis', 'View risk reports', 'Accept/reject remediations'],
                                users: ['James Wilson'], color: '#06b6d4',
                            },
                            {
                                role: 'Auditor', permissions: ['View audit logs', 'View compliance reports', 'Export reports', 'Read-only access'],
                                users: ['Maria Garcia'], color: '#22c55e',
                            },
                        ].map((role, i) => (
                            <div key={i} className="glass-card-static" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                                        background: `${role.color}15`, color: role.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <FiShield size={16} />
                                    </div>
                                    <h3 style={{ fontSize: '1rem' }}>{role.role}</h3>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permissions</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {role.permissions.map((p, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: role.color }} />
                                                {p}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Users</div>
                                    {role.users.map((u, j) => (
                                        <span key={j} className="chip">{u}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
