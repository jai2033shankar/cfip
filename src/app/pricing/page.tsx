'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCheck, FiX, FiZap, FiShield, FiCpu, FiStar, FiDatabase, FiLock, FiChevronLeft } from 'react-icons/fi';

const tiers = [
    {
        name: 'Freemium',
        price: '$0',
        period: 'forever',
        description: 'Perfect for solo developers and open-source contributions.',
        icon: <FiStar className="tier-icon" />,
        features: [
            { text: 'Local Ollama LLM (gemma3)', included: true },
            { text: 'Basic Code Explorer', included: true },
            { text: 'Simple Dependency Graph', included: true },
            { text: 'Max 1 Repository Scan', included: true },
            { text: 'Cloud LLM API Support (OpenAI / Claude)', included: false },
            { text: 'RAG Context inside Copilot', included: false },
            { text: 'AI Risk Remediation', included: false },
            { text: 'BFSI / General Domains', included: false },
        ],
        btnText: 'Current Plan',
        highlight: false,
    },
    {
        name: 'Premium',
        price: '$49',
        period: 'per user / month',
        description: 'Ideal for startups and small teams building modern apps.',
        icon: <FiZap className="tier-icon" />,
        features: [
            { text: 'Local Ollama LLM (gemma3)', included: true },
            { text: 'Advanced Code Explorer', included: true },
            { text: 'Interactive Graph with What-If Impact', included: true },
            { text: 'Max 10 Repository Scans', included: true },
            { text: 'Cloud LLM API Support (OpenAI / Claude)', included: true },
            { text: 'RAG Context inside Copilot', included: true },
            { text: 'AI Risk Remediation', included: true },
            { text: 'BFSI / General Domains', included: false },
        ],
        btnText: 'Upgrade to Premium',
        highlight: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'contact sales',
        description: 'For large organizations and highly regulated environments.',
        icon: <FiShield className="tier-icon" />,
        features: [
            { text: 'Local + Isolated Cloud LLM Clusters', included: true },
            { text: 'Full Global Code Explorer', included: true },
            { text: 'Enterprise Architecture Mesh', included: true },
            { text: 'Unlimited Repository Scans', included: true },
            { text: 'API Integration & Webhooks', included: true },
            { text: 'Live RAG Vector Re-Indexing', included: true },
            { text: 'AI Remediation + Auto PR Generation', included: true },
            { text: 'BFSI Regulatory Rules & Audit Log', included: true },
        ],
        btnText: 'Contact Sales',
        highlight: false,
    }
];

export default function PricingPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="landing-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <nav className="navbar" style={{ position: 'relative', zIndex: 10 }}>
                <div className="nav-logo">
                    <div className="logo-icon">CF</div>
                    <span className="logo-text">CFIP</span>
                </div>
                <div className="nav-links">
                    <Link href="/">Home</Link>
                    <Link href="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px' }}>Back to Dashboard</Link>
                </div>
            </nav>

            <main className="hero-section" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
                <div className="hero-content animate-fade-in" style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '60px' }}>
                    <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
                        Simple, <span className="gradient-text">transparent</span> pricing.
                    </h1>
                    <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Unlock the full power of Multi-tenancy, Cloud LLMs, and RAG Code Intelligence by upgrading your tier.
                    </p>
                </div>

                <div className="pricing-grid animate-fade-in stagger" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '1200px',
                    padding: '0 24px'
                }}>
                    {tiers.map((tier, idx) => (
                        <div key={idx} className={`glass-card tier-card ${tier.highlight ? 'highlight' : ''}`} style={{
                            position: 'relative',
                            padding: '40px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            border: tier.highlight ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                            transform: tier.highlight ? 'scale(1.02)' : 'scale(1)',
                            zIndex: tier.highlight ? 2 : 1
                        }}>
                            {tier.highlight && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                    padding: '4px 16px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                }}>
                                    MOST POPULAR
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: tier.highlight ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tier.highlight ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                                    {tier.icon}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{tier.name}</h3>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{tier.price}</span>
                                <span style={{ color: 'var(--text-tertiary)', marginLeft: '8px' }}>{tier.period}</span>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.5' }}>
                                {tier.description}
                            </p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                {tier.features.map((feature, fidx) => (
                                    <li key={fidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        {feature.included ? (
                                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '50%', padding: '2px', flexShrink: 0, marginTop: '2px' }}>
                                                <FiCheck size={14} />
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: '2px' }}>
                                                <FiX size={16} />
                                            </div>
                                        )}
                                        <span style={{ color: feature.included ? 'var(--text-primary)' : 'var(--text-tertiary)', fontSize: '0.95rem' }}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`btn ${tier.highlight ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', padding: '12px' }}>
                                {tier.btnText}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
