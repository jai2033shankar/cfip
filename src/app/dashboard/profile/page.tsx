'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiShield, FiBriefcase, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { getUserFromStorage, AuthUser } from '@/lib/auth';

export default function ProfilePage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const u = getUserFromStorage();
        if (u) {
            setUser(u);
            setName(u.name);
            setEmail(u.email);
        }
        setMounted(true);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        alert('Profile updated successfully!');
    };

    if (!mounted || !user) return null;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Settings / Profile</div>
                <h1>Account Profile</h1>
                <p>Manage your account settings and self-service preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '24px' }}>
                {/* Left: Avatar / Status */}
                <div className="glass-card-static" style={{ padding: '24px', textAlign: 'center', height: 'fit-content' }}>
                    <div style={{ 
                        width: '80px', height: '80px', background: 'var(--accent-primary)', 
                        borderRadius: '50%', margin: '0 auto 16px', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 
                    }}>
                        {user.avatar}
                    </div>
                    <h3 style={{ marginBottom: '4px' }}>{user.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'capitalize', marginBottom: '16px' }}>{user.role}</p>

                    <div className="divider" style={{ margin: '16px 0' }} />

                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiBriefcase style={{ color: 'var(--accent-primary-light)' }} />
                            <div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Subscription</div>
                                <div style={{ fontSize: '0.85rem' }}>Enterprise Trial</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiShield style={{ color: 'var(--risk-low)' }} />
                            <div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Security Clearance</div>
                                <div style={{ fontSize: '0.85rem' }}>Level 3 (Admin)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Settings Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <form className="glass-card-static" style={{ padding: '24px' }} onSubmit={handleSave}>
                        <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiUser style={{ color: 'var(--accent-primary-light)' }} /> Personal Information
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <FiUser style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ paddingLeft: '36px', width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '10px 10px 10px 36px', color: '#fff' }} 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <FiMail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ paddingLeft: '36px', width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '10px 10px 10px 36px', color: '#fff' }} 
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }} disabled={isSaving}>
                            {isSaving ? <FiRefreshCw className="animate-spin" /> : <FiCheck />} Save Changes
                        </button>
                    </form>

                    <form className="glass-card-static" style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiLock style={{ color: 'var(--risk-critical)' }} /> Password Management
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Password</label>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '10px', color: '#fff' }} 
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '10px', color: '#fff' }} 
                                />
                            </div>
                        </div>

                        <button className="btn btn-secondary" style={{ marginTop: '20px', width: '100%' }} type="button">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
