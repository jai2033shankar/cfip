'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiShield, FiGitBranch, FiActivity, FiCpu, FiLayers, FiZap, FiArrowRight, FiCode, FiDatabase, FiLock } from 'react-icons/fi';

const features = [
  { icon: <FiCode />, title: 'Code Comprehension Engine', desc: 'Deep semantic analysis of legacy & modern codebases. Multi-language AST parsing, business rule extraction, and data flow tracing.', color: '#6366f1' },
  { icon: <FiGitBranch />, title: 'Architecture Reconstruction', desc: 'Reverse-engineer architecture visually. Module dependency maps, service mesh simulation, and call graph heatmaps.', color: '#8b5cf6' },
  { icon: <FiShield />, title: 'Pre-Commit Risk Radar', desc: 'Simulate impact before code ships. Know what breaks, what APIs fail, and what SLAs degrade — before DevSecOps even runs.', color: '#06b6d4' },
  { icon: <FiActivity />, title: 'Business Impact Intelligence', desc: 'Map code to BFSI business capabilities. Payment flows, AML modules, KYC onboarding — all traced to technical components.', color: '#22c55e' },
  { icon: <FiCpu />, title: 'AI Remediation Engine', desc: 'Get AI-powered suggestions with confidence scores, risk reduction metrics, and estimated engineering effort per fix.', color: '#f97316' },
  { icon: <FiLock />, title: 'Enterprise Governance', desc: 'Full audit trail, RBAC, explainable AI, air-gapped deployment. Built for regulated industries.', color: '#ef4444' },
];

const stats = [
  { value: '60%', label: 'Legacy Blind Spots Eliminated' },
  { value: '40%', label: 'Fewer Change Impact Incidents' },
  { value: '< 5min', label: 'Risk Assessment Time' },
  { value: '98%', label: 'AI Suggestion Accuracy' },
];

const techLogos = ['Java', '.NET', 'Python', 'COBOL', 'SQL', 'TypeScript', 'Go', 'Kotlin'];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: 'white',
          }}>CF</div>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>CFIP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Features</a>
          <a href="#architecture" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Architecture</a>
          <a href="#security" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Security</a>
          <Link href="/login" className="btn btn-primary btn-sm">Launch Platform →</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" style={{ paddingTop: '64px' }}>
        <div style={{ position: 'relative', zIndex: 10, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
          <div className="hero-badge">
            <FiShield size={14} />
            Built for Regulated Industries (BFSI)
          </div>
          <h1 className="hero-title">
            See Your Code.<br />
            <span className="gradient-text">Understand Your Risk.</span><br />
            Predict Your Impact.
          </h1>
          <p className="hero-subtitle">
            An on-prem AI-powered code intelligence platform that performs deep code forensics,
            architecture reconstruction, and business impact simulation — all before your DevSecOps pipeline even starts.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="btn btn-primary btn-lg">
              <FiZap size={18} /> Enter Platform
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              <FiLayers size={18} /> Explore Capabilities
            </a>
          </div>
        </div>

        <div className="hero-stats" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
          {stats.map((stat, i) => (
            <div key={i} className="hero-stat">
              <div className="value">{stat.value}</div>
              <div className="label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Floating grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />
      </section>

      {/* Language Support Bar */}
      <section style={{
        padding: '32px 48px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Supports
          </span>
          {techLogos.map((lang, i) => (
            <span key={i} style={{
              padding: '6px 16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              fontFamily: 'var(--font-mono)',
            }}>{lang}</span>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Core Capabilities
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Enterprise-grade code intelligence that goes beyond static analysis.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="glass-card feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon" style={{ background: `${f.color}20`, color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Preview */}
      <section id="architecture" style={{ padding: '80px 48px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                System Architecture
              </span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Air-gapped, on-prem deployment with full control.
            </p>
          </div>
          <div className="glass-card-static" style={{ padding: '40px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {[
              { name: 'UI Layer', desc: 'React + Graph Visualizer (D3/Cytoscape)', color: '#6366f1' },
              { name: 'API Gateway', desc: 'REST / gRPC', color: '#8b5cf6' },
              { name: 'AI Orchestration', desc: 'LLM Interface • Prompt Guardrails • Explainability • Risk Scoring', color: '#06b6d4' },
              { name: 'Analysis Engine', desc: 'AST Parser • CFG Generator • Dependency Graph • Static Analyzer', color: '#22c55e' },
              { name: 'Knowledge Graph', desc: 'Code + Architecture + Business Mapping (Neo4j)', color: '#eab308' },
              { name: 'Secure Runtime', desc: 'On-Prem GPU Cluster • Fine-Tuned Model', color: '#f97316' },
            ].map((layer, i) => (
              <div key={i} style={{
                padding: '16px 24px',
                border: `1px solid ${layer.color}40`,
                borderLeft: `4px solid ${layer.color}`,
                borderRadius: 'var(--radius-md)',
                marginBottom: i < 5 ? '8px' : 0,
                background: `${layer.color}08`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: layer.color, fontWeight: 700 }}>{layer.name}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{layer.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" style={{ padding: '80px 48px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Enterprise Security & Governance
              </span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Mandatory guardrails for BFSI compliance.
            </p>
          </div>
          <div className="grid-2" style={{ gap: '16px' }}>
            {[
              { icon: <FiLock />, title: 'Air-Gapped Deployment', desc: 'No external calls. All processing on-prem.' },
              { icon: <FiShield />, title: 'Prompt Injection Detection', desc: 'Multi-layer validation on all LLM inputs.' },
              { icon: <FiDatabase />, title: 'Encrypted At Rest & Transit', desc: 'AES-256 encryption for all data stores.' },
              { icon: <FiActivity />, title: 'Full Audit Trail', desc: 'Every AI inference logged and traceable.' },
              { icon: <FiLayers />, title: 'RBAC Access Control', desc: 'Role-based permissions for all operations.' },
              { icon: <FiCpu />, title: 'Human-in-the-Loop', desc: 'Override capability for all AI suggestions.' },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary-light)',
                  flexShrink: 0,
                }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{
        padding: '80px 48px',
        background: 'var(--bg-primary)',
        textAlign: 'center',
        borderTop: '1px solid var(--border-glass)',
      }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
          Ready to <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>See Your Code Differently?</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Start analyzing your codebase in minutes. No external dependencies required.
        </p>
        <Link href="/login" className="btn btn-primary btn-lg">
          Launch CFIP Platform <FiArrowRight size={18} />
        </Link>
        <div style={{ marginTop: '48px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © 2026 CFIP — Code Forensics Intelligence Platform. Enterprise Edition.
        </div>
      </section>
    </div>
  );
}
