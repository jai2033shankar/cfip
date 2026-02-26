'use client';

import { useState, useEffect } from 'react';
import {
    FiGithub, FiCpu, FiSliders, FiShield, FiSave,
    FiCheck, FiKey, FiGlobe, FiServer, FiActivity, FiCheckCircle, FiAlertTriangle
} from 'react-icons/fi';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('github');
    const [githubPAT, setGithubPAT] = useState('');
    const [githubOrg, setGithubOrg] = useState('acme-bank');
    const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
    const [ollamaModel, setOllamaModel] = useState('codellama:13b');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedPAT = localStorage.getItem('cfip_github_pat');
        const storedOrg = localStorage.getItem('cfip_github_org');
        setTimeout(() => {
            if (storedPAT) setGithubPAT(storedPAT);
            if (storedOrg) setGithubOrg(storedOrg);
        }, 0);
    }, []);

    const [thresholds, setThresholds] = useState({
        criticalDownstream: 40,
        highDownstream: 20,
        complexityThreshold: 30,
        coverageMinimum: 70,
        confidenceMinimum: 75,
    });

    const handleSave = () => {
        if (activeTab === 'github') {
            localStorage.setItem('cfip_github_pat', githubPAT);
            localStorage.setItem('cfip_github_org', githubOrg);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'github', icon: <FiGithub />, label: 'GitHub Integration' },
        { id: 'model', icon: <FiCpu />, label: 'AI Model' },
        { id: 'thresholds', icon: <FiSliders />, label: 'Risk Thresholds' },
        { id: 'scanning', icon: <FiActivity />, label: 'Scanning' },
        { id: 'security', icon: <FiShield />, label: 'Security' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Settings</div>
                <h1>Configuration</h1>
                <p>System configuration, integrations, and threshold management</p>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                {/* Settings Nav */}
                <div style={{ width: '220px', flexShrink: 0 }}>
                    <div className="glass-card-static" style={{ padding: '8px' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="nav-icon">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div style={{ flex: 1 }}>
                    {saved && (
                        <div style={{
                            padding: '10px 16px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--risk-low)',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '16px',
                        }}>
                            <FiCheck size={16} /> Settings saved successfully
                        </div>
                    )}

                    {activeTab === 'github' && (
                        <div className="glass-card-static" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiGithub size={18} /> GitHub Integration
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                Connect to GitHub repositories for automated code scanning.
                            </p>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Personal Access Token (PAT)</label>
                                <div style={{ position: 'relative' }}>
                                    <FiKey style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        className="input"
                                        type="password"
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        value={githubPAT}
                                        onChange={e => setGithubPAT(e.target.value)}
                                        style={{ paddingLeft: '36px' }}
                                    />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required scopes: repo, read:org</span>
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Organization / Owner</label>
                                <div style={{ position: 'relative' }}>
                                    <FiGlobe style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        className="input"
                                        placeholder="organization-name"
                                        value={githubOrg}
                                        onChange={e => setGithubOrg(e.target.value)}
                                        style={{ paddingLeft: '36px' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label>Default Branch</label>
                                <select className="input" defaultValue="main">
                                    <option value="main">main</option>
                                    <option value="master">master</option>
                                    <option value="develop">develop</option>
                                </select>
                            </div>

                            <div style={{
                                padding: '16px',
                                background: 'rgba(99, 102, 241, 0.06)',
                                border: '1px solid rgba(99, 102, 241, 0.15)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '16px',
                            }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary-light)', marginBottom: '8px' }}>
                                    Connection Status
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: githubPAT ? 'var(--risk-low)' : 'var(--risk-medium)' }} />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {githubPAT ? 'Connected to GitHub' : 'Not connected — enter PAT to connect'}
                                    </span>
                                </div>
                            </div>

                            <button className="btn btn-primary" onClick={handleSave}>
                                <FiSave size={16} /> Save Configuration
                            </button>
                        </div>
                    )}

                    {activeTab === 'model' && (
                        <div className="glass-card-static" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiCpu size={18} /> AI Model Configuration
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                Configure the on-prem LLM for code analysis and recommendation generation.
                            </p>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Ollama Server URL</label>
                                <div style={{ position: 'relative' }}>
                                    <FiServer style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input className="input" placeholder="http://localhost:11434" value={ollamaUrl} onChange={e => setOllamaUrl(e.target.value)} style={{ paddingLeft: '36px' }} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Model</label>
                                <select className="input" value={ollamaModel} onChange={e => setOllamaModel(e.target.value)}>
                                    <option value="codellama:13b">CodeLlama 13B</option>
                                    <option value="codellama:34b">CodeLlama 34B</option>
                                    <option value="deepseek-coder:6.7b">DeepSeek Coder 6.7B</option>
                                    <option value="starcoder:15b">StarCoder 15B</option>
                                    <option value="mistral:7b">Mistral 7B</option>
                                    <option value="llama3:8b">Llama 3 8B</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label>Confidence Threshold for Suggestions</label>
                                <input type="range" min="50" max="99" value={thresholds.confidenceMinimum}
                                    onChange={e => setThresholds({ ...thresholds, confidenceMinimum: Number(e.target.value) })}
                                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>50%</span>
                                    <span style={{ color: 'var(--accent-primary-light)', fontWeight: 600 }}>{thresholds.confidenceMinimum}%</span>
                                    <span>99%</span>
                                </div>
                            </div>

                            <div style={{
                                padding: '12px 16px',
                                background: 'rgba(234, 179, 8, 0.08)',
                                border: '1px solid rgba(234, 179, 8, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '16px',
                                fontSize: '0.8rem',
                                color: 'var(--risk-medium)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}>
                                <FiAlertTriangle size={16} />
                                All AI inference runs on-prem. No code or data leaves your environment.
                            </div>

                            <button className="btn btn-primary" onClick={handleSave}>
                                <FiSave size={16} /> Save Model Config
                            </button>
                        </div>
                    )}

                    {activeTab === 'thresholds' && (
                        <div className="glass-card-static" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiSliders size={18} /> Risk Threshold Configuration
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                Tune risk scoring parameters to match your organization&apos;s risk tolerance.
                            </p>

                            {[
                                { label: 'Critical Risk: Downstream Node Count', key: 'criticalDownstream' as const, min: 10, max: 100, desc: 'Nodes with this many downstream dependencies are flagged as CRITICAL' },
                                { label: 'High Risk: Downstream Node Count', key: 'highDownstream' as const, min: 5, max: 50, desc: 'Nodes with this many downstream dependencies are flagged as HIGH' },
                                { label: 'Complexity Threshold', key: 'complexityThreshold' as const, min: 10, max: 80, desc: 'Cyclomatic complexity above this value triggers a risk flag' },
                                { label: 'Minimum Test Coverage', key: 'coverageMinimum' as const, min: 30, max: 100, desc: 'Functions below this coverage percentage are flagged' },
                            ].map((t, i) => (
                                <div key={i} style={{ marginBottom: '20px' }}>
                                    <div className="form-group">
                                        <label>{t.label}</label>
                                        <input type="range" min={t.min} max={t.max} value={thresholds[t.key]}
                                            onChange={e => setThresholds({ ...thresholds, [t.key]: Number(e.target.value) })}
                                            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span>{t.min}</span>
                                            <span style={{ color: 'var(--accent-primary-light)', fontWeight: 600 }}>{thresholds[t.key]}</span>
                                            <span>{t.max}</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.desc}</span>
                                    </div>
                                </div>
                            ))}

                            <button className="btn btn-primary" onClick={handleSave}>
                                <FiSave size={16} /> Save Thresholds
                            </button>
                        </div>
                    )}

                    {activeTab === 'scanning' && (
                        <div className="glass-card-static" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiActivity size={18} /> Scanning Configuration
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                Configure automated scanning schedules and file filters.
                            </p>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Scan Schedule</label>
                                <select className="input" defaultValue="nightly">
                                    <option value="manual">Manual Only</option>
                                    <option value="hourly">Every Hour</option>
                                    <option value="nightly">Nightly (2:00 AM)</option>
                                    <option value="weekly">Weekly (Sunday 2AM)</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>File Extensions to Scan</label>
                                <input className="input" defaultValue=".java, .py, .ts, .js, .sql, .go, .kt, .cs" />
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Exclude Patterns</label>
                                <input className="input" defaultValue="node_modules/**, .git/**, build/**, dist/**" />
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label>Max File Size (KB)</label>
                                <input className="input" type="number" defaultValue={500} />
                            </div>

                            <button className="btn btn-primary" onClick={handleSave}>
                                <FiSave size={16} /> Save Scan Config
                            </button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass-card-static" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiShield size={18} /> Security Settings
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                Enterprise security guardrails for BFSI compliance.
                            </p>

                            {[
                                { label: 'Air-Gapped Mode', desc: 'Block all external network calls', enabled: true },
                                { label: 'Prompt Injection Detection', desc: 'Validate all LLM inputs against injection patterns', enabled: true },
                                { label: 'Encryption at Rest', desc: 'AES-256 encryption for stored analysis data', enabled: true },
                                { label: 'Audit Log Retention', desc: 'Retain audit logs for 7 years (regulatory requirement)', enabled: true },
                                { label: 'Human-in-the-Loop Override', desc: 'Require manual approval for AI-generated fixes', enabled: true },
                                { label: 'Code Export Prevention', desc: 'Prevent any code snippets from leaving the platform', enabled: true },
                            ].map((setting, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    background: 'var(--bg-surface)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '8px',
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{setting.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{setting.desc}</div>
                                    </div>
                                    <div className={`toggle ${setting.enabled ? 'active' : ''}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
