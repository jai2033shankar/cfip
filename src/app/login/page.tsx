'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiShield, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { authenticateUser, setUserToStorage } from '@/lib/auth';
import { demoUsers } from '@/lib/seed-data';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const user = authenticateUser(email, password);
            if (user) {
                setUserToStorage(user);
                router.push('/dashboard');
            } else {
                setError('Invalid credentials. Try a demo account below.');
            }
            setLoading(false);
        }, 800);
    };

    const quickLogin = (userEmail: string, userPassword: string) => {
        setEmail(userEmail);
        setPassword(userPassword);
        const user = authenticateUser(userEmail, userPassword);
        if (user) {
            setUserToStorage(user);
            router.push('/dashboard');
        }
    };

    return (
        <div className="login-page">
            {/* Background orbs */}
            <div style={{
                position: 'fixed',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                top: '-150px',
                right: '-150px',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'fixed',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
                bottom: '-100px',
                left: '-100px',
                pointerEvents: 'none',
            }} />

            <div className="glass-card-static login-card animate-scale-in">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'white',
                    }}>CF</div>
                    <div>
                        <div style={{ fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            CFIP
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                            CODE FORENSICS INTELLIGENCE
                        </div>
                    </div>
                </div>

                <h1>Welcome Back</h1>
                <p>Sign in to access your code intelligence dashboard.</p>

                {error && (
                    <div style={{
                        padding: '10px 14px',
                        background: 'var(--risk-critical-bg)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--risk-critical)',
                        fontSize: '0.85rem',
                        marginBottom: '16px',
                    }}>
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '36px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '36px', paddingRight: '36px' }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '8px' }}
                    >
                        {loading ? (
                            <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                        ) : (
                            <>Sign In <FiArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="demo-creds">
                    <h4>
                        <FiShield size={12} style={{ marginRight: '6px' }} />
                        Demo Credentials (Click to login)
                    </h4>
                    {demoUsers.map((user, i) => (
                        <div
                            key={i}
                            className="cred-row"
                            style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: 'var(--radius-sm)', transition: 'background 0.15s' }}
                            onClick={() => quickLogin(user.email, user.password)}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            <span className="role" style={{ textTransform: 'capitalize' }}>
                                {user.role} — {user.name}
                            </span>
                            <span className="login-info">{user.email}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
