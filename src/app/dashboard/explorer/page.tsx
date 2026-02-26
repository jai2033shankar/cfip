'use client';

import { useState } from 'react';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiCode, FiSearch, FiAlertTriangle, FiShield, FiActivity } from 'react-icons/fi';

interface FileNode {
    name: string;
    type: 'file' | 'folder';
    language?: string;
    risk?: 'critical' | 'high' | 'medium' | 'low';
    loc?: number;
    children?: FileNode[];
}

const mockFileTree: FileNode[] = [
    {
        name: 'core-banking-engine', type: 'folder', children: [
            {
                name: 'src', type: 'folder', children: [
                    {
                        name: 'services', type: 'folder', children: [
                            { name: 'TransactionProcessor.java', type: 'file', language: 'Java', risk: 'critical', loc: 3420 },
                            { name: 'RiskCalculator.java', type: 'file', language: 'Java', risk: 'high', loc: 2780 },
                            { name: 'LedgerService.java', type: 'file', language: 'Java', risk: 'critical', loc: 1890 },
                            { name: 'AccountService.java', type: 'file', language: 'Java', risk: 'medium', loc: 1240 },
                            { name: 'NotificationService.java', type: 'file', language: 'Java', risk: 'low', loc: 560 },
                        ]
                    },
                    {
                        name: 'models', type: 'folder', children: [
                            { name: 'Account.java', type: 'file', language: 'Java', risk: 'critical', loc: 890 },
                            { name: 'Transaction.java', type: 'file', language: 'Java', risk: 'critical', loc: 1200 },
                            { name: 'Payment.java', type: 'file', language: 'Java', risk: 'high', loc: 670 },
                            { name: 'Customer.java', type: 'file', language: 'Java', risk: 'medium', loc: 560 },
                        ]
                    },
                    {
                        name: 'controllers', type: 'folder', children: [
                            { name: 'PaymentController.java', type: 'file', language: 'Java', risk: 'high', loc: 456 },
                            { name: 'AccountController.java', type: 'file', language: 'Java', risk: 'medium', loc: 320 },
                            { name: 'TransferController.java', type: 'file', language: 'Java', risk: 'high', loc: 380 },
                        ]
                    },
                    {
                        name: 'utils', type: 'folder', children: [
                            { name: 'EncryptionService.java', type: 'file', language: 'Java', risk: 'high', loc: 234 },
                            { name: 'ValidationUtils.java', type: 'file', language: 'Java', risk: 'low', loc: 189 },
                            { name: 'DateUtils.java', type: 'file', language: 'Java', risk: 'low', loc: 120 },
                        ]
                    },
                ]
            },
            {
                name: 'sql', type: 'folder', children: [
                    { name: 'schema.sql', type: 'file', language: 'SQL', risk: 'medium', loc: 450 },
                    {
                        name: 'migrations', type: 'folder', children: [
                            { name: 'V1__init.sql', type: 'file', language: 'SQL', risk: 'low', loc: 120 },
                            { name: 'V2__add_audit.sql', type: 'file', language: 'SQL', risk: 'low', loc: 45 },
                        ]
                    }
                ]
            },
        ]
    },
    {
        name: 'payment-gateway-service', type: 'folder', children: [
            {
                name: 'src', type: 'folder', children: [
                    { name: 'payment_router.py', type: 'file', language: 'Python', risk: 'high', loc: 1890 },
                    { name: 'processor_client.py', type: 'file', language: 'Python', risk: 'medium', loc: 720 },
                    { name: 'settlement.py', type: 'file', language: 'Python', risk: 'high', loc: 960 },
                ]
            }
        ]
    },
    {
        name: 'aml-screening-platform', type: 'folder', children: [
            {
                name: 'engine', type: 'folder', children: [
                    { name: 'aml_engine.py', type: 'file', language: 'Python', risk: 'critical', loc: 4560 },
                    { name: 'sanctions_checker.py', type: 'file', language: 'Python', risk: 'critical', loc: 2340 },
                    { name: 'transaction_monitor.py', type: 'file', language: 'Python', risk: 'high', loc: 1890 },
                ]
            }
        ]
    },
];

const sampleCode = `/**
 * TransactionProcessor.java
 * Core transaction processing service
 * 
 * @risk CRITICAL - 22 downstream dependencies
 * @business-mapping Transaction Processing
 */
public class TransactionProcessor {
    
    private final RiskCalculator riskCalculator;
    private final LedgerService ledgerService;
    private final AMLEngine amlEngine;
    
    // ⚠️ RISK: No retry mechanism for failed processor calls
    public TransactionResult processPayment(PaymentRequest request) {
        // Validate transaction
        ValidationResult validation = validateTransaction(request);
        if (!validation.isValid()) {
            return TransactionResult.failed(validation.getErrors());
        }
        
        // AML Screening - CRITICAL dependency
        AMLResult amlResult = amlEngine.screenCustomer(
            request.getCustomerId(),
            request.getAmount()
        );
        
        if (amlResult.isFlagged()) {
            auditLog.record("AML_FLAG", request);
            return TransactionResult.blocked("AML screening failed");
        }
        
        // Calculate risk score
        double riskScore = riskCalculator.calculate(request);
        
        // ⚠️ RISK: SQL injection in search query
        // String query = "SELECT * FROM transactions WHERE id = '" 
        //     + request.getId() + "'";
        
        // Process payment
        PaymentResult result = paymentRouter.route(request);
        
        // Post to ledger - CRITICAL: Not wrapped in DB transaction
        ledgerService.postToLedger(
            new LedgerEntry(request.getDebitAccount(), request.getAmount(), "DEBIT"),
            new LedgerEntry(request.getCreditAccount(), request.getAmount(), "CREDIT")
        );
        
        // ⚠️ RISK: No idempotency check
        return TransactionResult.success(result);
    }
    
    private ValidationResult validateTransaction(PaymentRequest request) {
        List<String> errors = new ArrayList<>();
        
        if (request.getAmount() <= 0) {
            errors.add("Amount must be positive");
        }
        
        // Check account balance
        Account account = accountRepository.findById(request.getDebitAccount());
        if (account.getBalance() < request.getAmount()) {
            errors.add("Insufficient funds");
        }
        
        return new ValidationResult(errors);
    }
}`;

const riskColors: Record<string, string> = {
    critical: 'var(--risk-critical)',
    high: 'var(--risk-high)',
    medium: 'var(--risk-medium)',
    low: 'var(--risk-low)',
};

function TreeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
    const [expanded, setExpanded] = useState(depth < 2);
    const isFolder = node.type === 'folder';

    return (
        <div>
            <div
                onClick={() => isFolder && setExpanded(!expanded)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    paddingLeft: `${depth * 16 + 8}px`,
                    cursor: isFolder ? 'pointer' : 'default',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: isFolder ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
                {isFolder ? (
                    expanded ? <FiChevronDown size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <FiChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                ) : <span style={{ width: '12px' }} />}
                {isFolder ? <FiFolder size={14} style={{ color: 'var(--accent-primary-light)', flexShrink: 0 }} /> : <FiFile size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                <span style={{ flex: 1 }}>{node.name}</span>
                {node.risk && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: riskColors[node.risk], flexShrink: 0 }} />
                )}
                {node.loc && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{node.loc}</span>}
            </div>
            {isFolder && expanded && node.children?.map((child, i) => (
                <TreeItem key={i} node={child} depth={depth + 1} />
            ))}
        </div>
    );
}

export default function ExplorerPage() {
    const [search, setSearch] = useState('');

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="breadcrumb"><span>CFIP</span> / Code Explorer</div>
                <h1>Code Explorer</h1>
                <p>Browse and analyze scanned repository file structures</p>
            </div>

            <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 220px)' }}>
                {/* File Tree */}
                <div className="glass-card-static" style={{ width: '340px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-sm)', padding: '6px 10px' }}>
                            <FiSearch size={14} style={{ color: 'var(--text-muted)' }} />
                            <input
                                placeholder="Search files..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 4px' }}>
                        {mockFileTree.map((node, i) => <TreeItem key={i} node={node} />)}
                    </div>
                    <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-secondary)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        1,306 files across 6 repositories
                    </div>
                </div>

                {/* Code Viewer */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* File Header */}
                    <div className="glass-card-static" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FiCode size={16} style={{ color: 'var(--accent-primary-light)' }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>TransactionProcessor.java</span>
                            <span className="badge badge-critical">CRITICAL</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3,420 LOC</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <span className="chip"><FiAlertTriangle size={12} /> 3 risks</span>
                            <span className="chip"><FiShield size={12} /> AML dependency</span>
                            <span className="chip"><FiActivity size={12} /> 22 downstream</span>
                        </div>
                    </div>

                    {/* Code */}
                    <div className="code-viewer" style={{ flex: 1, overflow: 'auto' }}>
                        <pre style={{ padding: '16px' }}>
                            {sampleCode.split('\n').map((line, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    background: line.includes('⚠️') ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                                    borderLeft: line.includes('⚠️') ? '3px solid var(--risk-critical)' : '3px solid transparent',
                                    padding: '0 4px',
                                }}>
                                    <span className="line-number">{i + 1}</span>
                                    <span style={{
                                        color: line.includes('//') || line.includes('/*') || line.includes('*')
                                            ? '#6a9955'
                                            : line.includes('public') || line.includes('private') || line.includes('if') || line.includes('return') || line.includes('new')
                                                ? '#569cd6'
                                                : line.includes('"')
                                                    ? '#ce9178'
                                                    : line.includes('⚠️')
                                                        ? '#ef4444'
                                                        : '#d4d4d4',
                                    }}>{line}</span>
                                </div>
                            ))}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
