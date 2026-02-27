'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    FiGrid, FiGitBranch, FiShield, FiActivity, FiLayers, FiCpu, FiSettings,
    FiFileText, FiSearch, FiBell, FiChevronLeft, FiChevronRight, FiLogOut,
    FiFolder, FiAlertTriangle, FiTarget, FiBookOpen, FiTerminal, FiBriefcase, FiMessageSquare
} from 'react-icons/fi';
import { getUserFromStorage, clearUserFromStorage, AuthUser } from '@/lib/auth';

const navItems = [
    { label: 'Overview', section: 'main' },
    { href: '/dashboard', icon: <FiGrid />, label: 'Dashboard', badge: null },
    { href: '/dashboard/copilot', icon: <FiMessageSquare />, label: 'AI Copilot', badge: 'New' },
    { href: '/dashboard/explorer', icon: <FiFolder />, label: 'Code Explorer', badge: null },
    { href: '/dashboard/graph', icon: <FiGitBranch />, label: 'Dependency Graph', badge: null },

    { label: 'Intelligence', section: 'analysis' },
    { href: '/dashboard/engineering', icon: <FiTarget />, label: 'Engineering Insights', badge: null },
    { href: '/dashboard/risk', icon: <FiAlertTriangle />, label: 'Risk & Impact', badge: '12' },
    { href: '/dashboard/architecture', icon: <FiLayers />, label: 'Architecture View', badge: null },
    { href: '/dashboard/business', icon: <FiBriefcase />, label: 'Business Intelligence', badge: null },

    { label: 'Actions', section: 'actions' },
    { href: '/dashboard/remediation', icon: <FiCpu />, label: 'AI Remediation', badge: '10' },
    { href: '/dashboard/governance', icon: <FiShield />, label: 'Governance & Audit', badge: null },

    { label: 'System', section: 'system' },
    { href: '/dashboard/settings', icon: <FiSettings />, label: 'Settings', badge: null },
];

import { ScanProvider } from '@/lib/scan-context';
import ProductTour from '@/components/ProductTour';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [runTour, setRunTour] = useState(false);

    useEffect(() => {
        const u = getUserFromStorage();
        if (!u) {
            router.push('/login');
            return;
        }
        setUser(u);
        setMounted(true);
    }, [router]);

    const handleLogout = () => {
        clearUserFromStorage();
        router.push('/login');
    };

    if (!mounted || !user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--border-secondary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <ProductTour run={runTour} setRun={setRunTour} />
            <ScanProvider>
                {/* Sidebar */}
                <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    {/* Logo */}
                    <div className="sidebar-logo">
                        <div className="logo-icon">CF</div>
                        {!collapsed && <span className="logo-text">CFIP</span>}
                    </div>

                    {/* Navigation */}
                    <nav className="sidebar-nav">
                        {navItems.map((item, i) => {
                            if ('section' in item && item.section) {
                                return !collapsed ? (
                                    <div key={i} className="nav-section-label">{item.label}</div>
                                ) : <div key={i} style={{ height: '16px' }} />;
                            }

                            const isActive = item.href === '/dashboard'
                                ? pathname === '/dashboard'
                                : pathname?.startsWith(item.href || '');

                            let navId = undefined;
                            if (item.href === '/dashboard/copilot') navId = 'tour-nav-copilot';
                            else if (item.href === '/dashboard/engineering') navId = 'tour-nav-engineering';
                            else if (item.href === '/dashboard/remediation') navId = 'tour-nav-remediation';
                            else if (item.href === '/dashboard/governance') navId = 'tour-nav-governance';

                            return (
                                <Link
                                    key={i}
                                    href={item.href || '#'}
                                    id={navId}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    {!collapsed && (
                                        <>
                                            <span>{item.label}</span>
                                            {item.badge && <span className="nav-badge">{item.badge}</span>}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Collapse toggle */}
                    <div style={{ padding: '12px', borderTop: '1px solid var(--border-glass)' }}>
                        <button
                            className="nav-item"
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                        >
                            <span className="nav-icon">
                                {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                            </span>
                            {!collapsed && <span>Collapse</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                    {/* Header */}
                    <header className="header">
                        <div className="header-left">
                            <div className="search-bar">
                                <FiSearch size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                <input placeholder="Search nodes, functions, APIs..." />
                                <span className="search-shortcut">⌘K</span>
                            </div>
                        </div>
                        <div className="header-right">
                            <button className="header-icon-btn" title="Terminal">
                                <FiTerminal size={18} />
                            </button>
                            <button id="tour-doc-btn" className="header-icon-btn" title="Start Demo Tour" onClick={() => setRunTour(true)}>
                                <FiBookOpen size={18} />
                            </button>
                            <button className="header-icon-btn" title="Notifications" style={{ position: 'relative' }}>
                                <FiBell size={18} />
                                <span className="notification-dot" />
                            </button>
                            <div style={{ width: '1px', height: '24px', background: 'var(--border-secondary)', margin: '0 4px' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <div className="avatar">{user.avatar}</div>
                                {!collapsed && (
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{user.role}</div>
                                    </div>
                                )}
                            </div>
                            <button className="header-icon-btn" onClick={handleLogout} title="Sign Out">
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="page-content">
                        {children}
                    </main>
                </div>
            </ScanProvider>
        </div>
    );
}
