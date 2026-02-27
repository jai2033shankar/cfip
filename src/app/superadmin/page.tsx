'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUsers, FiSettings, FiActivity, FiKey, FiLock, FiStar, FiZap, FiShield, FiSave, FiAlertCircle } from 'react-icons/fi';

interface Tenant {
    id: string;
    name: string;
    tier: string;
    api_keys: {
        openai?: string;
        anthropic?: string;
    };
    repo_count: number;
}

export default function SuperAdminPage() {
    const [mounted, setMounted] = useState(false);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8001/api/admin/tenants');
            if (!res.ok) throw new Error('Failed to fetch tenants');
            const data = await res.json();
            setTenants(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTierChange = async (tenantId: string, newTier: string) => {
        try {
            setSavingId(tenantId);
            const res = await fetch('http://localhost:8001/api/admin/tenants/tier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenant_id: tenantId, tier: newTier })
            });
            if (!res.ok) throw new Error('Update failed');

            // Local state update
            setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, tier: newTier } : t));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSavingId(null);
        }
    };

    const TierIcon = ({ tier }: { tier: string }) => {
        if (tier === 'enterprise') return <FiShield style={{ color: '#06b6d4' }} />;
        if (tier === 'premium') return <FiZap style={{ color: '#8b5cf6' }} />;
        return <FiStar style={{ color: '#94a3b8' }} />;
    };

    if (!mounted) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px' }}>
            <div className="page-header" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div className="breadcrumb">
                        <span>CFIP</span> / Super Admin
                    </div>
                    <h1>Tenant Management</h1>
                    <p>Global visual control parameters for multi-tenancy access and feature flags</p>
                </div>
                <div>
                    <Link href="/dashboard" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiSettings /> Return to Dashboard
                    </Link>
                </div>
            </div>

            <main style={{ maxWidth: '1200px', margin: '40px auto' }}>
                {error && (
                    <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <FiAlertCircle size={20} />
                        <div>{error}. Ensure the Python Engine is running on port 8001.</div>
                    </div>
                )}

                <div className="glass-card">
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FiUsers size={20} style={{ color: 'var(--accent-primary)' }} />
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Registered Tenants</h2>
                        </div>
                        <div className="nav-badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                            {tenants.length} Active Workspaces
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '0.85rem' }}>Tenant ID</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '0.85rem' }}>Workspace Name</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '0.85rem' }}>Usage (Repos)</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '0.85rem' }}>Cloud LLM Connectors</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '0.85rem' }}>Subscription Tier</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '0.85rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                            <div className="animate-spin" style={{ width: '24px', height: '24px', border: '2px solid var(--border-secondary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto' }} />
                                        </td>
                                    </tr>
                                )}
                                {!loading && tenants.map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{t.id}</td>
                                        <td style={{ padding: '16px 24px', fontWeight: 500 }}>{t.name}</td>
                                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                                            {t.repo_count} / {t.tier === 'freemium' ? 1 : t.tier === 'premium' ? 10 : 'Unlimited'}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <span className="risk-chip risk-info" style={{ opacity: t.api_keys?.openai ? 1 : 0.3 }}>
                                                    <FiKey size={12} /> OpenAI
                                                </span>
                                                <span className="risk-chip risk-medium" style={{ opacity: t.api_keys?.anthropic ? 1 : 0.3 }}>
                                                    <FiKey size={12} /> Claude
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <select
                                                className="input"
                                                value={t.tier}
                                                onChange={(e) => handleTierChange(t.id, e.target.value)}
                                                disabled={savingId === t.id}
                                                style={{ width: '140px', padding: '6px 12px', background: 'var(--bg-secondary)' }}
                                            >
                                                <option value="freemium">Freemium</option>
                                                <option value="premium">Premium</option>
                                                <option value="enterprise">Enterprise</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                                                {savingId === t.id ? (
                                                    <div className="animate-spin" style={{ width: '12px', height: '12px', border: '2px solid var(--text-muted)', borderTopColor: 'white', borderRadius: '50%' }} />
                                                ) : <FiSave size={14} />}
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
