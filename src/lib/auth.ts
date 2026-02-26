import { demoUsers } from './seed-data';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string;
}

export function authenticateUser(email: string, password: string): AuthUser | null {
    const user = demoUsers.find(u => u.email === email && u.password === password);
    if (!user) return null;
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
    };
}

export function getUserFromStorage(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('cfip_user');
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

export function setUserToStorage(user: AuthUser): void {
    localStorage.setItem('cfip_user', JSON.stringify(user));
}

export function clearUserFromStorage(): void {
    localStorage.removeItem('cfip_user');
}
