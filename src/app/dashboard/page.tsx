'use client';

import { useEffect, useRef, useState } from 'react';
import {
    FiDatabase, FiCode, FiGitBranch, FiAlertTriangle, FiTrendingDown,
    FiActivity, FiCpu, FiCheckCircle, FiClock, FiShield, FiArrowUpRight, FiArrowDownRight,
    FiFileText, FiPlay
} from 'react-icons/fi';
import { dashboardStats, repositories, riskItems } from '@/lib/seed-data';
import * as d3 from 'd3';
import { useScan } from '@/lib/scan-context';

function RiskTrendChart() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = svgRef.current.clientWidth || 300;
        const height = 200;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        const data = dashboardStats.riskTrend;

        const x = d3.scalePoint()
            .domain(data.map(d => d.date))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.critical + d.high) || 300])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Grid lines
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(4).tickSize(-(width - margin.left - margin.right)))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line').attr('stroke', 'rgba(148, 163, 184, 0.08)'))
            .call(g => g.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', '11px'));

        // X axis
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(d => {
                const date = new Date(d as string);
                return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
            }))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line').remove())
            .call(g => g.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', '11px'));

        // Critical line
        const criticalLine = d3.line<typeof data[0]>()
            .x(d => x(d.date)!)
            .y(d => y(d.critical))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#ef4444')
            .attr('stroke-width', 2.5)
            .attr('d', criticalLine);

        // High line
        const highLine = d3.line<typeof data[0]>()
            .x(d => x(d.date)!)
            .y(d => y(d.high))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#f97316')
            .attr('stroke-width', 2.5)
            .attr('d', highLine);

        // Area fill for critical
        const critArea = d3.area<typeof data[0]>()
            .x(d => x(d.date)!)
            .y0(height - margin.bottom)
            .y1(d => y(d.critical))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(data)
            .attr('fill', 'url(#critGrad)')
            .attr('d', critArea);

        // Gradient def
        const defs = svg.append('defs');
        const grad = defs.append('linearGradient').attr('id', 'critGrad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
        grad.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.15);
        grad.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', 0);

        // Dots for critical
        svg.selectAll('.crit-dot')
            .data(data)
            .join('circle')
            .attr('cx', d => x(d.date)!)
            .attr('cy', d => y(d.critical))
            .attr('r', 4)
            .attr('fill', '#ef4444')
            .attr('stroke', '#0a0e1a')
            .attr('stroke-width', 2);

    }, []);

    return <svg ref={svgRef} style={{ width: '100%', height: '200px' }} />;
}

function LanguageDonut({ scanData }: { scanData: any }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const size = 160;
        const radius = size / 2;
        const innerRadius = radius * 0.65;

        const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

        // Use scan data if available, else seed data
        let data: any[] = [];
        let totalFiles = 0;

        if (scanData && scanData.metrics && scanData.metrics.language_breakdown) {
            const breakdown = scanData.metrics.language_breakdown;
            totalFiles = scanData.metrics.total_files;

            data = Object.keys(breakdown).map(lang => ({
                language: lang,
                files: breakdown[lang],
                percentage: Math.round((breakdown[lang] / totalFiles) * 100)
            })).sort((a, b) => b.percentage - a.percentage);
        } else {
            data = dashboardStats.codebaseLanguages;
            totalFiles = 1306;
        }

        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#64748b'];

        const pie = d3.pie<typeof data[0]>().value(d => d.percentage).sort(null).padAngle(0.03);
        const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .cornerRadius(3);

        if (data.length > 0) {
            g.selectAll('path')
                .data(pie(data))
                .join('path')
                .attr('d', arc)
                .attr('fill', (_, i) => colors[i % colors.length])
                .attr('stroke', 'transparent');
        }

        // Center text
        g.append('text').attr('text-anchor', 'middle').attr('dy', '-4px').attr('fill', '#f1f5f9').attr('font-size', '20px').attr('font-weight', '800').text(totalFiles);
        g.append('text').attr('text-anchor', 'middle').attr('dy', '14px').attr('fill', '#64748b').attr('font-size', '10px').text('Total Files');

    }, [scanData]);

    return <svg ref={svgRef} style={{ width: '160px', height: '160px' }} />;
}

const severityIcons: Record<string, React.ReactNode> = {
    critical: <FiAlertTriangle style={{ color: 'var(--risk-critical)' }} />,
    info: <FiActivity style={{ color: 'var(--risk-info)' }} />,
    success: <FiCheckCircle style={{ color: 'var(--risk-low)' }} />,
    warning: <FiShield style={{ color: 'var(--risk-medium)' }} />,
};

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const { scanData, isScanning, runScan } = useScan();
    const [repoUrl, setRepoUrl] = useState('https://github.com/jai2033shankar/aero-copilot');

    useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);

    if (!mounted) return null;

    const handleScan = async () => {
        if (!repoUrl) return;
        const pat = localStorage.getItem('cfip_github_pat');
        if (!pat) {
            alert("No GitHub PAT found. Please add it in Settings.");
            return;
        }
        await runScan(repoUrl, pat);
    };

    // Calculate dynamic stats if scanData is present
    const stats = { ...dashboardStats };
    let risks = [...riskItems];
    let languages = dashboardStats.codebaseLanguages;

    if (scanData) {
        // Derive stats from real Python response
        stats.totalRepositories = 1;
        stats.totalFunctions = scanData.nodes.length;
        stats.criticalRisks = scanData.risks.filter(r => r.severity === 'critical').length;
        stats.highRisks = scanData.risks.filter(r => r.severity === 'high').length;
        stats.mediumRisks = scanData.risks.filter(r => r.severity === 'medium').length;
        stats.lowRisks = scanData.risks.filter(r => r.severity === 'low').length;
        stats.avgHealthScore = 100 - (stats.criticalRisks * 2) - stats.highRisks;
        if (stats.avgHealthScore < 0) stats.avgHealthScore = 0;

        stats.scansCompleted += 1;
        stats.graphNodes = scanData.nodes.length;

        risks = scanData.risks.map((r, i) => ({
            id: `risk-${i}`,
            title: r.reason,
            severity: r.severity,
            category: r.risk_type.split('_').join(' '),
            nodeId: r.node_id,
            affectedDownstream: r.affected_downstream_count,
            businessImpact: `Impact on ${scanData.nodes.find(n => n.id === r.node_id)?.label || 'unknown'} and downstream dependencies`,
            estimatedEffort: r.recommendation.length > 50 ? '3 days' : '1 day',
            type: r.risk_type,
            description: r.reason,
            recommendation: r.recommendation
        }));

        if (scanData.metrics && scanData.metrics.language_breakdown) {
            const breakdown = scanData.metrics.language_breakdown;
            const total = scanData.metrics.total_files;
            languages = Object.keys(breakdown).map(lang => ({
                language: lang.replace('.', '').toUpperCase(),
                files: breakdown[lang],
                percentage: Math.round((breakdown[lang] / total) * 100)
            })).sort((a, b) => b.percentage - a.percentage);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div className="breadcrumb">
                        <span>CFIP</span> / Dashboard
                    </div>
                    <h1>Command Center</h1>
                    <p>Real-time code intelligence across {stats.totalRepositories} repositories</p>
                </div>

                {/* Live Scan Input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        className="input"
                        placeholder="https://github.com/org/repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        style={{ width: '300px' }}
                        disabled={isScanning}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleScan}
                        disabled={isScanning || !repoUrl}
                    >
                        {isScanning ? (
                            <><div className="animate-spin" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Scanning...</>
                        ) : (
                            <><FiPlay size={14} /> Scan Repo</>
                        )}
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid-4 stagger" style={{ marginBottom: '24px' }}>
                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.totalRepositories}</div>
                            <div className="stat-label">{scanData ? 'Active Repository' : 'Repositories Scanned'}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                            <FiDatabase size={20} />
                        </div>
                    </div>
                    <div className="stat-trend up"><FiArrowUpRight size={14} /> {scanData ? 'Live Data Mode' : '+2 this week'}</div>
                </div>

                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.totalFunctions.toLocaleString()}</div>
                            <div className="stat-label">Total Graph Nodes</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                            <FiCode size={20} />
                        </div>
                    </div>
                    <div className="stat-trend up"><FiArrowUpRight size={14} /> {scanData ? 'Parsed from AST' : '+342 new'}</div>
                </div>

                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.criticalRisks}</div>
                            <div className="stat-label">Critical Risks</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--risk-critical-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--risk-critical)' }}>
                            <FiAlertTriangle size={20} />
                        </div>
                    </div>
                    <div className="stat-trend down"><FiArrowDownRight size={14} /> {scanData ? 'Computed in real-time' : '-16 from last month'}</div>
                </div>

                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.avgHealthScore}%</div>
                            <div className="stat-label">Avg Health Score</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--risk-low)' }}>
                            <FiActivity size={20} />
                        </div>
                    </div>
                    <div className="stat-trend up"><FiArrowUpRight size={14} /> {scanData ? 'Based on severity density' : '+3% improvement'}</div>
                </div>
            </div>

            {/* Second Row: Risk Overview + Language Distribution */}
            <div className="grid-2" style={{ marginBottom: '24px' }}>
                {/* Risk Distribution */}
                <div className="glass-card-static" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiShield size={18} style={{ color: 'var(--accent-primary-light)' }} />
                        Risk Distribution
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        {[
                            { label: 'Critical', value: stats.criticalRisks, color: 'var(--risk-critical)', bg: 'var(--risk-critical-bg)' },
                            { label: 'High', value: stats.highRisks, color: 'var(--risk-high)', bg: 'var(--risk-high-bg)' },
                            { label: 'Medium', value: stats.mediumRisks, color: 'var(--risk-medium)', bg: 'var(--risk-medium-bg)' },
                            { label: 'Low', value: stats.lowRisks, color: 'var(--risk-low)', bg: 'var(--risk-low-bg)' },
                        ].map((r, i) => (
                            <div key={i} style={{ flex: 1, padding: '14px', background: r.bg, borderRadius: 'var(--radius-md)', textAlign: 'center', border: `1px solid ${r.color}20` }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: r.color }}>{r.value}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{r.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Risk Trend (Last 2 Months)</div>
                    <RiskTrendChart />
                </div>

                {/* Language Breakdown */}
                <div className="glass-card-static" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiGitBranch size={18} style={{ color: 'var(--accent-primary-light)' }} />
                        Codebase Composition
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <LanguageDonut scanData={scanData} />
                        <div style={{ flex: 1 }}>
                            {languages.map((lang, i) => {
                                const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#64748b'];
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.85rem' }}>{lang.language}</span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lang.percentage}% ({lang.files})</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Insights Mini */}
                    <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <FiCpu size={14} style={{ color: 'var(--accent-primary-light)' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary-light)' }}>AI Insight</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {scanData ? `Live scan analyzed ${scanData.metrics.total_files} files showing ${scanData.risks.length} total risk nodes. Graph structure is now updated in real-time across the platform.` : `Java codebase (45%) has the highest concentration of critical risks. Consider prioritizing the core-banking-engine for security review.`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Third Row: Repositories + Activity Feed */}
            <div className="grid-2" style={{ marginBottom: '24px' }}>
                {/* Repository Health */}
                <div className="glass-card-static" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiFileText size={18} style={{ color: 'var(--accent-primary-light)' }} />
                        Repository Health
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {repositories.slice(0, scanData ? 1 : 4).map((repo) => (
                            <div key={repo.id} style={{
                                padding: '12px 16px',
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: (scanData ? stats.avgHealthScore : repo.healthScore) >= 80 ? 'var(--risk-low)' : (scanData ? stats.avgHealthScore : repo.healthScore) >= 60 ? 'var(--risk-medium)' : 'var(--risk-critical)',
                                    flexShrink: 0,
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{scanData ? repoUrl.split('/').pop() : repo.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{scanData ? 'Live Scan' : repo.language} • {scanData ? scanData.metrics.total_files : repo.totalFiles} files</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        color: (scanData ? stats.avgHealthScore : repo.healthScore) >= 80 ? 'var(--risk-low)' : (scanData ? stats.avgHealthScore : repo.healthScore) >= 60 ? 'var(--risk-medium)' : 'var(--risk-critical)',
                                    }}>{scanData ? stats.avgHealthScore : repo.healthScore}%</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                        {scanData ? `${stats.criticalRisks}C / ${stats.highRisks}H` : `${repo.riskProfile.critical}C / ${repo.riskProfile.high}H`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="glass-card-static" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiActivity size={18} style={{ color: 'var(--accent-primary-light)' }} />
                        Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {stats.recentActivity.map((act) => (
                            <div key={act.id} style={{
                                padding: '12px 14px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                transition: 'background 0.15s',
                            }}>
                                <div style={{ marginTop: '2px' }}>
                                    {severityIcons[act.severity] || <FiActivity style={{ color: 'var(--text-muted)' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem' }}>{scanData && act.id === '1' ? 'Live GitHub Repository Scan Completed' : act.message}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        <FiClock size={11} /> {scanData && act.id === '1' ? 'Just now' : act.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-secondary)', display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary-light)' }}>{stats.scansCompleted}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Scans Run</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary-light)' }}>{stats.aiInsightsGenerated}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>AI Insights</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary-light)' }}>{stats.graphNodes}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Graph Nodes</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Risks Table */}
            <div className="glass-card-static" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiAlertTriangle size={18} style={{ color: 'var(--risk-critical)' }} />
                    Top Critical Risks
                </h3>
                {risks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No critical risks detected.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Risk</th>
                                <th>Severity</th>
                                <th>Category</th>
                                <th>Downstream Impact</th>
                                <th>Business Impact</th>
                                <th>Effort</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risks.filter(r => r.severity === 'critical' || r.severity === 'high').slice(0, 8).map((risk) => (
                                <tr key={risk.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{risk.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{risk.nodeId}</div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${risk.severity}`}>{risk.severity}</span>
                                    </td>
                                    <td style={{ textTransform: 'capitalize' }}>{risk.category}</td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: risk.affectedDownstream > 10 ? 'var(--risk-critical)' : 'var(--risk-medium)' }}>
                                            {risk.affectedDownstream} nodes
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', maxWidth: '200px', color: 'var(--text-secondary)' }}>
                                        {risk.businessImpact ? risk.businessImpact.slice(0, 60) : 'Impact on local execution scope'}...
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{risk.estimatedEffort}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
