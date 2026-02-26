'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// The Analysis engine backend response format
export interface ScanData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    edges: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    risks: any[];
    metrics: {
        total_files: number;
        total_loc: number;
        language_breakdown: Record<string, number>;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    business_mappings: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remediations: any[];
}

interface ScanContextType {
    scanData: ScanData | null;
    isScanning: boolean;
    setScanData: (data: ScanData | null) => void;
    setIsScanning: (scanning: boolean) => void;
    runScan: (githubUrl: string, githubPat: string) => Promise<boolean>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
    const [scanData, setScanData] = useState<ScanData | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const runScan = async (githubUrl: string, githubPat: string) => {
        setIsScanning(true);
        try {
            const response = await fetch('/api/analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'scan', githubUrl, githubPat }),
            });
            const data = await response.json();

            if (data && data.nodes) {
                // Log this scan in local audit trail
                const newAuditEntry = {
                    id: `log-scan-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    action: 'Live Repository Scan Initiated',
                    user: 'admin@cfip.io',
                    role: 'Admin',
                    details: `Full analysis of ${githubUrl || 'local directory'}`,
                    type: 'scan'
                };
                const existingLogsRaw = localStorage.getItem('cfip_audit_logs');
                const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
                localStorage.setItem('cfip_audit_logs', JSON.stringify([newAuditEntry, ...existingLogs]));

                setScanData(data);
                setIsScanning(false);
                return true;
            }
            throw new Error('Invalid data format');
        } catch (error) {
            console.error('Scan failed:', error);
            setIsScanning(false);
            return false;
        }
    };

    return (
        <ScanContext.Provider value={{ scanData, isScanning, setScanData, setIsScanning, runScan }}>
            {children}
        </ScanContext.Provider>
    );
}

export function useScan() {
    const context = useContext(ScanContext);
    if (context === undefined) {
        throw new Error('useScan must be used within a ScanProvider');
    }
    return context;
}
