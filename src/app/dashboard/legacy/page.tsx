'use client';

import { useState } from 'react';
import {
    FiCode, FiAlertTriangle, FiCpu, FiArrowRight, FiZap, FiSearch,
    FiCheckCircle, FiXCircle, FiAlertCircle, FiFileText
} from 'react-icons/fi';
import {
    legacyRepositories, legacyGraphNodes, legacyRiskItems, legacyRemediations
} from '@/lib/seed-data';

const LANGUAGE_SIGNATURES: Record<string, { keywords: string[]; patterns: string[]; description: string; color: string }> = {
    COBOL: {
        keywords: ['IDENTIFICATION DIVISION', 'PROCEDURE DIVISION', 'WORKING-STORAGE', 'PERFORM', 'MOVE', 'PIC', 'COPY', 'PROGRAM-ID'],
        patterns: ['Fixed-column format (columns 1-6: sequence, 7: indicator, 8-72: code)', 'DIVISION/SECTION/PARAGRAPH structure', 'COPY copybook imports'],
        description: 'Common Business-Oriented Language — dominant in mainframe batch processing, financial transaction systems, and government systems.',
        color: '#6366f1',
    },
    Fortran: {
        keywords: ['PROGRAM', 'SUBROUTINE', 'FUNCTION', 'IMPLICIT NONE', 'INTEGER', 'REAL', 'DO', 'CALL', 'MODULE', 'END PROGRAM'],
        patterns: ['Fixed-form (F77) or free-form (F90+) formatting', 'Column-based structure in legacy code', 'COMMON blocks for shared data'],
        description: 'Formula Translation — used in scientific computing, numerical analysis, and high-performance financial modeling.',
        color: '#06b6d4',
    },
    'PL/I': {
        keywords: ['PROCEDURE', 'DECLARE', 'DCL', 'BEGIN', 'END', 'GET', 'PUT', 'DO', 'CALL', 'ALLOCATE'],
        patterns: ['Block-structured with BEGIN/END', 'DECLARE statements for variables', 'Exception handling with ON conditions'],
        description: 'Programming Language One — IBM mainframe language combining features of COBOL, Fortran, and ALGOL.',
        color: '#8b5cf6',
    },
    RPG: {
        keywords: ['DCL-S', 'DCL-DS', 'DCL-F', 'DCL-PROC', 'BEGSR', 'ENDSR', 'CHAIN', 'READ', 'WRITE', 'EVAL'],
        patterns: ['Fixed-format (RPG III/IV) or free-format (RPG ILE)', 'Specification types (H, F, D, I, C, O)', 'Built-in database I/O operations'],
        description: 'Report Program Generator — IBM AS/400 language for business applications, especially in financial services.',
        color: '#22c55e',
    },
};

const SAMPLE_COBOL = `       IDENTIFICATION DIVISION.
       PROGRAM-ID. TXNPROC.
       AUTHOR. ACME-BANK-TEAM.
      *
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-ACCOUNT-NO    PIC X(10).
       01 WS-AMOUNT         PIC 9(9)V99.
       01 WS-YEAR           PIC 9(2).
       01 WS-STATUS         PIC XX.
      *
       PROCEDURE DIVISION.
       MAIN-PARA.
           PERFORM VALIDATE-INPUT
           PERFORM PROCESS-TRANSACTION
           PERFORM POST-LEDGER-ENTRY
           GO TO EXIT-PARA.
      *
       VALIDATE-INPUT.
           IF WS-AMOUNT > 0
               MOVE 'OK' TO WS-STATUS
           ELSE
               GO TO ERROR-PARA.
      *
       PROCESS-TRANSACTION.
           CALL 'ACCTUPD' USING WS-ACCOUNT-NO
                                WS-AMOUNT.
       EXIT-PARA.
           STOP RUN.`;

export default function LegacyAnalyzerPage() {
    const [codeInput, setCodeInput] = useState(SAMPLE_COBOL);
    const [detectedLang, setDetectedLang] = useState<string | null>('COBOL');
    const [analyzed, setAnalyzed] = useState(true);
    const [activeTab, setActiveTab] = useState<'detect' | 'repos' | 'risks' | 'modernize'>('detect');

    const detectLanguage = (code: string) => {
        if (!code.trim()) {
            setDetectedLang(null);
            setAnalyzed(false);
            return;
        }

        let bestMatch = '';
        let bestScore = 0;

        for (const [lang, sig] of Object.entries(LANGUAGE_SIGNATURES)) {
            let score = 0;
            for (const kw of sig.keywords) {
                if (code.toUpperCase().includes(kw.toUpperCase())) {
                    score += 2;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = lang;
            }
        }

        setDetectedLang(bestScore >= 2 ? bestMatch : null);
        setAnalyzed(true);
    };

    const detectedSignature = detectedLang ? LANGUAGE_SIGNATURES[detectedLang] : null;

    // Analysis results based on the detected language
    const analysisResults = detectedLang === 'COBOL' ? [
        { label: 'GO TO Statements', value: '2', severity: 'high' as const, icon: <FiAlertTriangle /> },
        { label: 'PERFORM Calls', value: '3', severity: 'low' as const, icon: <FiCheckCircle /> },
        { label: 'CALL Statements', value: '1', severity: 'low' as const, icon: <FiCheckCircle /> },
        { label: 'COPY Imports', value: '0', severity: 'low' as const, icon: <FiCheckCircle /> },
        { label: 'Y2K Date Fields', value: '1', severity: 'high' as const, icon: <FiAlertTriangle /> },
        { label: 'Missing END-IF', value: '1', severity: 'medium' as const, icon: <FiAlertCircle /> },
    ] : [];

    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'critical': return 'var(--risk-critical)';
            case 'high': return 'var(--risk-high)';
            case 'medium': return 'var(--risk-medium)';
            case 'low': return 'var(--risk-low)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Legacy Analyzer</div>
                <h1>Legacy Language Analyzer</h1>
                <p>Detect, analyze, and refine COBOL, Fortran, PL/I, and RPG codebases with AI-powered structural analysis.</p>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: '24px' }}>
                {[
                    { id: 'detect' as const, label: 'Language Detection', icon: <FiSearch size={14} /> },
                    { id: 'repos' as const, label: 'Legacy Repositories', icon: <FiFileText size={14} /> },
                    { id: 'risks' as const, label: 'Risk Analysis', icon: <FiAlertTriangle size={14} /> },
                    { id: 'modernize' as const, label: 'Modernization', icon: <FiCpu size={14} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB: Language Detection */}
            {activeTab === 'detect' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Left: Code Input */}
                    <div className="glass-card-static" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiCode size={18} /> Paste Legacy Code
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            Paste COBOL, Fortran, PL/I, or RPG code to auto-detect and analyze.
                        </p>
                        <textarea
                            className="input"
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                                minHeight: '340px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                background: '#0d1117',
                                color: '#e6edf3',
                                border: '1px solid var(--border-glass)',
                            }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => detectLanguage(codeInput)}
                            style={{ marginTop: '12px', width: '100%' }}
                        >
                            <FiZap size={16} /> Analyze Code
                        </button>
                    </div>

                    {/* Right: Detection Results */}
                    <div>
                        {/* Detected Language Card */}
                        {analyzed && (
                            <div className="glass-card-static" style={{ padding: '24px', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FiCpu size={18} /> Detection Result
                                </h3>
                                {detectedLang && detectedSignature ? (
                                    <div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
                                            padding: '16px', background: `${detectedSignature.color}15`,
                                            border: `1px solid ${detectedSignature.color}40`,
                                            borderRadius: 'var(--radius-md)',
                                        }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                                                background: `${detectedSignature.color}20`, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem', fontWeight: 800, color: detectedSignature.color,
                                            }}>
                                                {detectedLang.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: detectedSignature.color }}>
                                                    {detectedLang}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Language Detected</div>
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <span className="badge badge-info">Detected</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                            {detectedSignature.description}
                                        </p>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                            Matched Keywords:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                            {detectedSignature.keywords.filter(kw =>
                                                codeInput.toUpperCase().includes(kw.toUpperCase())
                                            ).map((kw, i) => (
                                                <span key={i} style={{
                                                    padding: '3px 10px', background: `${detectedSignature.color}15`,
                                                    border: `1px solid ${detectedSignature.color}30`,
                                                    borderRadius: 'var(--radius-full)', fontSize: '0.75rem',
                                                    fontFamily: 'var(--font-mono)', color: detectedSignature.color,
                                                }}>
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                        <FiXCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                        <p>No legacy language detected. Paste COBOL, Fortran, PL/I, or RPG code to analyze.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analysis Results */}
                        {analyzed && detectedLang === 'COBOL' && (
                            <div className="glass-card-static" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FiAlertTriangle size={18} /> Structural Analysis
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {analysisResults.map((r, i) => (
                                        <div key={i} style={{
                                            padding: '12px 16px', background: 'var(--bg-surface)',
                                            borderRadius: 'var(--radius-md)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'space-between',
                                            borderLeft: `3px solid ${getSeverityColor(r.severity)}`,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: getSeverityColor(r.severity) }}>{r.icon}</span>
                                                <span style={{ fontSize: '0.85rem' }}>{r.label}</span>
                                            </div>
                                            <span style={{
                                                fontFamily: 'var(--font-mono)', fontWeight: 700,
                                                fontSize: '1rem', color: getSeverityColor(r.severity),
                                            }}>{r.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Supported Languages Reference */}
            {activeTab === 'detect' && (
                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Supported Legacy Languages</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {Object.entries(LANGUAGE_SIGNATURES).map(([lang, sig]) => (
                            <div key={lang} className="glass-card" style={{ padding: '20px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                                    background: `${sig.color}15`, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800,
                                    color: sig.color, marginBottom: '12px',
                                }}>
                                    {lang.slice(0, 2).toUpperCase()}
                                </div>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>{lang}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                    {sig.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: Legacy Repositories */}
            {activeTab === 'repos' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        {legacyRepositories.map(repo => (
                            <div key={repo.id} className="glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{repo.name}</h3>
                                        <span style={{
                                            padding: '2px 10px', borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem', fontWeight: 600,
                                            background: repo.language === 'COBOL' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                                            color: repo.language === 'COBOL' ? '#818cf8' : '#22d3ee',
                                        }}>
                                            {repo.language}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '1.5rem', fontWeight: 800,
                                            color: repo.healthScore < 50 ? 'var(--risk-critical)' : repo.healthScore < 70 ? 'var(--risk-medium)' : 'var(--risk-low)',
                                        }}>
                                            {repo.healthScore}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health Score</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    {[
                                        { label: 'Critical', value: repo.riskProfile.critical, color: 'var(--risk-critical)' },
                                        { label: 'High', value: repo.riskProfile.high, color: 'var(--risk-high)' },
                                        { label: 'Medium', value: repo.riskProfile.medium, color: 'var(--risk-medium)' },
                                        { label: 'Low', value: repo.riskProfile.low, color: 'var(--risk-low)' },
                                    ].map((item, i) => (
                                        <div key={i} style={{
                                            padding: '8px', borderRadius: 'var(--radius-sm)',
                                            background: 'var(--bg-surface)', textAlign: 'center',
                                        }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: item.color }}>{item.value}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {repo.totalFiles} files · {repo.totalFunctions} functions · Last scanned {new Date(repo.lastScanned).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legacy Nodes */}
                    <div className="glass-card-static" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Legacy Code Structure</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Type</th>
                                    <th>Module</th>
                                    <th>Risk</th>
                                    <th>LOC</th>
                                    <th>Complexity</th>
                                    <th>Test Coverage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {legacyGraphNodes.filter(n => n.metrics).map(node => (
                                    <tr key={node.id}>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>{node.label}</td>
                                        <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{node.type}</span></td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{node.module}</td>
                                        <td><span className={`badge badge-${node.risk}`}>{node.risk}</span></td>
                                        <td style={{ fontFamily: 'var(--font-mono)' }}>{node.metrics?.loc?.toLocaleString()}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)', color: (node.metrics?.complexity || 0) > 40 ? 'var(--risk-critical)' : 'var(--text-primary)' }}>
                                            {node.metrics?.complexity}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="progress-bar" style={{ width: '60px' }}>
                                                    <div className="progress-fill" style={{
                                                        width: `${node.metrics?.testCoverage}%`,
                                                        background: (node.metrics?.testCoverage || 0) < 30 ? 'var(--risk-critical)' : 'var(--gradient-primary)',
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{node.metrics?.testCoverage}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: Risk Analysis */}
            {activeTab === 'risks' && (
                <div className="stagger">
                    {legacyRiskItems.map(risk => (
                        <div key={risk.id} className="glass-card" style={{
                            padding: '24px', marginBottom: '12px',
                            borderLeft: `4px solid ${getSeverityColor(risk.severity)}`,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                    <span className={`badge badge-${risk.severity}`} style={{ marginBottom: '8px', display: 'inline-flex' }}>{risk.severity}</span>
                                    <h3 style={{ fontSize: '1rem' }}>{risk.title}</h3>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <div>Downstream: {risk.affectedDownstream}</div>
                                    <div>Effort: {risk.estimatedEffort}</div>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{risk.description}</p>
                            <div style={{
                                padding: '10px 14px', background: 'rgba(249, 115, 22, 0.06)',
                                border: '1px solid rgba(249, 115, 22, 0.15)', borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem', marginBottom: '8px',
                            }}>
                                <strong style={{ color: 'var(--risk-high)' }}>Business Impact:</strong>{' '}
                                <span style={{ color: 'var(--text-secondary)' }}>{risk.businessImpact}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <strong>Recommendation:</strong> {risk.recommendation}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB: Modernization */}
            {activeTab === 'modernize' && (
                <div className="stagger">
                    {legacyRemediations.map(rem => (
                        <div key={rem.id} className="glass-card" style={{ padding: '24px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FiArrowRight size={16} style={{ color: 'var(--accent-primary-light)' }} />
                                        {rem.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{rem.category}</span>
                                        <span className={`badge badge-${rem.effort === 'high' ? 'high' : rem.effort === 'medium' ? 'medium' : 'low'}`}>
                                            {rem.effortDays} days
                                        </span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary-light)' }}>{rem.confidence}%</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</div>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{rem.description}</p>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Risk Reduction</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div className="progress-bar" style={{ flex: 1 }}>
                                            <div className="progress-fill" style={{ width: `${rem.riskReduction}%` }} />
                                        </div>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>{rem.riskReduction}%</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <strong>Pattern:</strong> {rem.pattern} &nbsp;·&nbsp;
                                <strong>Files:</strong> {rem.affectedFiles.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
