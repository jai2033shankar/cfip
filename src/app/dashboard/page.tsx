'use client';

import { useEffect, useRef, useState } from 'react';
import {
    FiDatabase, FiCode, FiGitBranch, FiAlertTriangle, FiTrendingDown,
    FiActivity, FiCpu, FiCheckCircle, FiClock, FiShield, FiArrowUpRight, FiArrowDownRight,
    FiFileText
} from 'react-icons/fi';
import { dashboardStats, repositories, riskItems } from '@/lib/seed-data';
import * as d3 from 'd3';

function RiskTrendChart() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = svgRef.current.clientWidth;
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

function LanguageDonut() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const size = 160;
        const radius = size / 2;
        const innerRadius = radius * 0.65;

        const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

        const data = dashboardStats.codebaseLanguages;
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#64748b'];

        const pie = d3.pie<typeof data[0]>().value(d => d.percentage).sort(null).padAngle(0.03);
        const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .cornerRadius(3);

        g.selectAll('path')
            .data(pie(data))
            .join('path')
            .attr('d', arc)
            .attr('fill', (_, i) => colors[i])
            .attr('stroke', 'transparent');

        // Center text
        g.append('text').attr('text-anchor', 'middle').attr('dy', '-4px').attr('fill', '#f1f5f9').attr('font-size', '20px').attr('font-weight', '800').text('1306');
        g.append('text').attr('text-anchor', 'middle').attr('dy', '14px').attr('fill', '#64748b').attr('font-size', '10px').text('Total Files');

    }, []);

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
    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    const stats = dashboardStats;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb">
                    <span>CFIP</span> / Dashboard
                </div>
                <h1>Command Center</h1>
                <p>Real-time code intelligence across {stats.totalRepositories} repositories</p>
            </div>

            {/* KPI Cards */}
            <div className="grid-4 stagger" style={{ marginBottom: '24px' }}>
                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.totalRepositories}</div>
                            <div className="stat-label">Repositories Scanned</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                            <FiDatabase size={20} />
                        </div>
                    </div>
                    <div className="stat-trend up"><FiArrowUpRight size={14} /> +2 this week</div>
                </div>

                <div className="glass-card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.totalFunctions.toLocaleString()}</div>
                            <div className="stat-label">Functions Analyzed</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                            <FiCode size={20} />
                        </div>
                    </div>
                    <div className="stat-trend up"><FiArrowUpRight size={14} /> +342 new</div>
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
                    <div className="stat-trend down"><FiArrowDownRight size={14} /> -16 from last month</div>
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
                    <div className="stat-trend up"><FiArrowUpRight size={14} /> +3% improvement</div>
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
                        <LanguageDonut />
                        <div style={{ flex: 1 }}>
                            {dashboardStats.codebaseLanguages.map((lang, i) => {
                                const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#64748b'];
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[i], flexShrink: 0 }} />
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
                            Java codebase (45%) has the highest concentration of critical risks. Consider prioritizing
                            the core-banking-engine for security review — 12 critical issues detected in transaction processing.
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
                        {repositories.map((repo) => (
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
                                    background: repo.healthScore >= 80 ? 'var(--risk-low)' : repo.healthScore >= 60 ? 'var(--risk-medium)' : 'var(--risk-critical)',
                                    flexShrink: 0,
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{repo.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{repo.language} • {repo.totalFiles} files</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        color: repo.healthScore >= 80 ? 'var(--risk-low)' : repo.healthScore >= 60 ? 'var(--risk-medium)' : 'var(--risk-critical)',
                                    }}>{repo.healthScore}%</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                        {repo.riskProfile.critical}C / {repo.riskProfile.high}H
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
                                    <div style={{ fontSize: '0.85rem' }}>{act.message}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        <FiClock size={11} /> {act.time}
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
                        {riskItems.filter(r => r.severity === 'critical' || r.severity === 'high').slice(0, 6).map((risk) => (
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
                                    {risk.businessImpact.slice(0, 60)}...
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{risk.estimatedEffort}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
