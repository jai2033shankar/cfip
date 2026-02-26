/* eslint-disable @typescript-eslint/no-explicit-any */
// CFIP Comprehensive Seed Data - Simulating a BFSI codebase analysis

export interface GraphNode {
  id: string;
  label: string;
  type: 'file' | 'function' | 'class' | 'api' | 'db_table' | 'business_capability' | 'module' | 'service';
  language?: string;
  metrics?: {
    loc?: number;
    complexity?: number;
    maintainability?: number;
    testCoverage?: number;
    lastModified?: string;
    contributors?: number;
  };
  risk?: 'critical' | 'high' | 'medium' | 'low';
  businessMapping?: string;
  module?: string;
  description?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'calls' | 'depends_on' | 'writes_to' | 'reads_from' | 'impacts' | 'implements' | 'extends';
  weight?: number;
  criticality?: 'high' | 'medium' | 'low';
}

export interface RiskItem {
  id: string;
  nodeId: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  businessImpact: string;
  affectedDownstream: number;
  recommendation: string;
  estimatedEffort: string;
  category: string;
}

export interface RemediationSuggestion {
  id: string;
  title: string;
  category: 'refactoring' | 'security' | 'performance' | 'testing' | 'architecture' | 'compliance';
  confidence: number;
  riskReduction: number;
  effort: 'low' | 'medium' | 'high';
  effortDays: number;
  description: string;
  affectedFiles: string[];
  pattern: string;
  priority: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  role: string;
  details: string;
  type: 'scan' | 'analysis' | 'config_change' | 'access' | 'ai_inference';
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  language: string;
  lastScanned: string;
  healthScore: number;
  totalFiles: number;
  totalFunctions: number;
  totalClasses: number;
  riskProfile: { critical: number; high: number; medium: number; low: number };
  status: 'scanned' | 'scanning' | 'pending' | 'error';
}

export interface BusinessCapability {
  id: string;
  name: string;
  domain: string;
  description: string;
  modules: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  coverage: number;
  healthScore: number;
}

// ========================
// REPOSITORIES
// ========================
export const repositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'core-banking-engine',
    url: 'https://github.com/acme-bank/core-banking-engine',
    language: 'Java',
    lastScanned: '2026-02-26T10:30:00Z',
    healthScore: 72,
    totalFiles: 342,
    totalFunctions: 1847,
    totalClasses: 198,
    riskProfile: { critical: 12, high: 34, medium: 67, low: 229 },
    status: 'scanned',
  },
  {
    id: 'repo-2',
    name: 'payment-gateway-service',
    url: 'https://github.com/acme-bank/payment-gateway',
    language: 'Python',
    lastScanned: '2026-02-26T09:15:00Z',
    healthScore: 85,
    totalFiles: 156,
    totalFunctions: 923,
    totalClasses: 87,
    riskProfile: { critical: 3, high: 12, medium: 28, low: 113 },
    status: 'scanned',
  },
  {
    id: 'repo-3',
    name: 'aml-screening-platform',
    url: 'https://github.com/acme-bank/aml-screening',
    language: 'Python',
    lastScanned: '2026-02-25T22:45:00Z',
    healthScore: 68,
    totalFiles: 234,
    totalFunctions: 1345,
    totalClasses: 145,
    riskProfile: { critical: 18, high: 42, medium: 56, low: 118 },
    status: 'scanned',
  },
  {
    id: 'repo-4',
    name: 'kyc-onboarding-service',
    url: 'https://github.com/acme-bank/kyc-onboarding',
    language: 'TypeScript',
    lastScanned: '2026-02-26T08:00:00Z',
    healthScore: 91,
    totalFiles: 98,
    totalFunctions: 567,
    totalClasses: 54,
    riskProfile: { critical: 1, high: 5, medium: 15, low: 77 },
    status: 'scanned',
  },
  {
    id: 'repo-5',
    name: 'treasury-management-system',
    url: 'https://github.com/acme-bank/treasury-mgmt',
    language: 'Java',
    lastScanned: '2026-02-24T14:30:00Z',
    healthScore: 58,
    totalFiles: 287,
    totalFunctions: 1678,
    totalClasses: 167,
    riskProfile: { critical: 24, high: 56, medium: 89, low: 118 },
    status: 'scanned',
  },
  {
    id: 'repo-6',
    name: 'trade-lifecycle-engine',
    url: 'https://github.com/acme-bank/trade-lifecycle',
    language: 'Java',
    lastScanned: '2026-02-26T11:00:00Z',
    healthScore: 76,
    totalFiles: 189,
    totalFunctions: 1102,
    totalClasses: 134,
    riskProfile: { critical: 8, high: 22, medium: 45, low: 114 },
    status: 'scanned',
  },
];

// ========================
// GRAPH NODES
// ========================
export const graphNodes: GraphNode[] = [
  // Core Banking Modules
  { id: 'mod-core-banking', label: 'Core Banking Engine', type: 'module', risk: 'critical', module: 'core-banking', businessMapping: 'Transaction Processing', description: 'Central transaction processing engine' },
  { id: 'mod-payment', label: 'Payment Gateway', type: 'module', risk: 'high', module: 'payment', businessMapping: 'Payment Processing', description: 'Payment routing and processing' },
  { id: 'mod-aml', label: 'AML Screening', type: 'module', risk: 'critical', module: 'compliance', businessMapping: 'AML Compliance', description: 'Anti-money laundering detection' },
  { id: 'mod-kyc', label: 'KYC Onboarding', type: 'module', risk: 'medium', module: 'onboarding', businessMapping: 'Customer Onboarding', description: 'Know Your Customer verification' },
  { id: 'mod-treasury', label: 'Treasury Management', type: 'module', risk: 'high', module: 'treasury', businessMapping: 'Treasury Operations', description: 'Cash and liquidity management' },
  { id: 'mod-trade', label: 'Trade Lifecycle', type: 'module', risk: 'high', module: 'trading', businessMapping: 'Trade Processing', description: 'Trade execution and settlement' },
  { id: 'mod-reporting', label: 'Regulatory Reporting', type: 'module', risk: 'critical', module: 'compliance', businessMapping: 'Regulatory Compliance', description: 'Basel III/IV regulatory reporting' },
  { id: 'mod-ledger', label: 'General Ledger', type: 'module', risk: 'critical', module: 'core-banking', businessMapping: 'Financial Accounting', description: 'Double-entry accounting ledger' },
  { id: 'mod-auth', label: 'Auth Service', type: 'module', risk: 'high', module: 'security', businessMapping: 'Access Control', description: 'Authentication & authorization' },
  { id: 'mod-notification', label: 'Notification Service', type: 'module', risk: 'low', module: 'infrastructure', businessMapping: 'Communication', description: 'Email, SMS, push notifications' },

  // Services
  { id: 'svc-txn-processor', label: 'TransactionProcessor', type: 'service', risk: 'critical', module: 'core-banking', description: 'Core transaction processing service', metrics: { loc: 3420, complexity: 45, maintainability: 62, testCoverage: 78 } },
  { id: 'svc-payment-router', label: 'PaymentRouter', type: 'service', risk: 'high', module: 'payment', description: 'Routes payments to processors', metrics: { loc: 1890, complexity: 32, maintainability: 71, testCoverage: 85 } },
  { id: 'svc-aml-engine', label: 'AMLEngine', type: 'service', risk: 'critical', module: 'compliance', description: 'AML rule execution engine', metrics: { loc: 4560, complexity: 56, maintainability: 55, testCoverage: 72 } },
  { id: 'svc-kyc-validator', label: 'KYCValidator', type: 'service', risk: 'medium', module: 'onboarding', description: 'KYC document & identity validation', metrics: { loc: 1240, complexity: 22, maintainability: 82, testCoverage: 91 } },
  { id: 'svc-risk-calculator', label: 'RiskCalculator', type: 'service', risk: 'high', module: 'core-banking', description: 'Credit & market risk calculation', metrics: { loc: 2780, complexity: 48, maintainability: 58, testCoverage: 67 } },

  // Key Functions
  { id: 'fn-process-payment', label: 'processPayment()', type: 'function', risk: 'critical', module: 'payment', description: 'Main payment processing entry point', metrics: { loc: 234, complexity: 18, testCoverage: 82 } },
  { id: 'fn-validate-txn', label: 'validateTransaction()', type: 'function', risk: 'high', module: 'core-banking', description: 'Transaction validation logic', metrics: { loc: 189, complexity: 15, testCoverage: 88 } },
  { id: 'fn-screen-customer', label: 'screenCustomer()', type: 'function', risk: 'critical', module: 'compliance', description: 'Screens customer against sanctions lists', metrics: { loc: 345, complexity: 22, testCoverage: 75 } },
  { id: 'fn-calc-interest', label: 'calculateInterest()', type: 'function', risk: 'high', module: 'core-banking', description: 'Interest calculation engine', metrics: { loc: 156, complexity: 12, testCoverage: 95 } },
  { id: 'fn-settle-trade', label: 'settleTrade()', type: 'function', risk: 'high', module: 'trading', description: 'Trade settlement execution', metrics: { loc: 267, complexity: 20, testCoverage: 70 } },
  { id: 'fn-post-ledger', label: 'postToLedger()', type: 'function', risk: 'critical', module: 'core-banking', description: 'Posts entries to general ledger', metrics: { loc: 198, complexity: 14, testCoverage: 92 } },
  { id: 'fn-generate-report', label: 'generateRegulatoryReport()', type: 'function', risk: 'critical', module: 'compliance', description: 'Generates Basel III regulatory reports', metrics: { loc: 456, complexity: 28, testCoverage: 60 } },
  { id: 'fn-encrypt-data', label: 'encryptSensitiveData()', type: 'function', risk: 'high', module: 'security', description: 'AES-256 data encryption', metrics: { loc: 89, complexity: 8, testCoverage: 98 } },
  { id: 'fn-route-payment', label: 'routeToProcessor()', type: 'function', risk: 'high', module: 'payment', description: 'Routes payment to appropriate processor', metrics: { loc: 167, complexity: 14, testCoverage: 80 } },
  { id: 'fn-check-balance', label: 'checkAccountBalance()', type: 'function', risk: 'medium', module: 'core-banking', description: 'Real-time balance inquiry', metrics: { loc: 78, complexity: 6, testCoverage: 96 } },

  // Classes
  { id: 'cls-account', label: 'Account', type: 'class', risk: 'critical', module: 'core-banking', description: 'Core account entity', metrics: { loc: 890, complexity: 35, testCoverage: 85 } },
  { id: 'cls-transaction', label: 'Transaction', type: 'class', risk: 'critical', module: 'core-banking', description: 'Transaction entity with lifecycle', metrics: { loc: 1200, complexity: 42, testCoverage: 80 } },
  { id: 'cls-customer', label: 'Customer', type: 'class', risk: 'high', module: 'onboarding', description: 'Customer profile entity', metrics: { loc: 560, complexity: 18, testCoverage: 90 } },
  { id: 'cls-trade', label: 'Trade', type: 'class', risk: 'high', module: 'trading', description: 'Trade entity', metrics: { loc: 780, complexity: 28, testCoverage: 75 } },
  { id: 'cls-payment', label: 'Payment', type: 'class', risk: 'high', module: 'payment', description: 'Payment entity with processing state', metrics: { loc: 670, complexity: 24, testCoverage: 82 } },

  // APIs
  { id: 'api-payments', label: '/api/v2/payments', type: 'api', risk: 'critical', module: 'payment', description: 'Payment processing REST API' },
  { id: 'api-accounts', label: '/api/v2/accounts', type: 'api', risk: 'high', module: 'core-banking', description: 'Account management API' },
  { id: 'api-transfers', label: '/api/v2/transfers', type: 'api', risk: 'critical', module: 'core-banking', description: 'Fund transfer API' },
  { id: 'api-kyc', label: '/api/v2/kyc/verify', type: 'api', risk: 'high', module: 'onboarding', description: 'KYC verification endpoint' },
  { id: 'api-aml-check', label: '/api/v2/aml/screen', type: 'api', risk: 'critical', module: 'compliance', description: 'AML screening endpoint' },
  { id: 'api-trades', label: '/api/v2/trades', type: 'api', risk: 'high', module: 'trading', description: 'Trade execution API' },
  { id: 'api-reports', label: '/api/v2/reports/regulatory', type: 'api', risk: 'critical', module: 'compliance', description: 'Regulatory reporting API' },

  // DB Tables
  { id: 'db-accounts', label: 'tbl_accounts', type: 'db_table', risk: 'critical', module: 'core-banking', description: 'Customer account records' },
  { id: 'db-transactions', label: 'tbl_transactions', type: 'db_table', risk: 'critical', module: 'core-banking', description: 'Transaction ledger' },
  { id: 'db-payments', label: 'tbl_payments', type: 'db_table', risk: 'high', module: 'payment', description: 'Payment records' },
  { id: 'db-customers', label: 'tbl_customers', type: 'db_table', risk: 'high', module: 'onboarding', description: 'Customer PII data' },
  { id: 'db-aml-alerts', label: 'tbl_aml_alerts', type: 'db_table', risk: 'critical', module: 'compliance', description: 'AML alert records' },
  { id: 'db-trades', label: 'tbl_trades', type: 'db_table', risk: 'high', module: 'trading', description: 'Trade records' },
  { id: 'db-audit-log', label: 'tbl_audit_log', type: 'db_table', risk: 'medium', module: 'security', description: 'System audit trail' },
  { id: 'db-sanctions', label: 'tbl_sanctions_list', type: 'db_table', risk: 'critical', module: 'compliance', description: 'Sanctions screening list' },
  { id: 'db-ledger', label: 'tbl_general_ledger', type: 'db_table', risk: 'critical', module: 'core-banking', description: 'General ledger entries' },

  // Business Capabilities
  { id: 'biz-pay-processing', label: 'Payment Processing', type: 'business_capability', risk: 'critical', businessMapping: 'Payment Processing' },
  { id: 'biz-aml', label: 'AML Compliance', type: 'business_capability', risk: 'critical', businessMapping: 'AML Compliance' },
  { id: 'biz-kyc', label: 'Customer Onboarding', type: 'business_capability', risk: 'high', businessMapping: 'Customer Onboarding' },
  { id: 'biz-treasury', label: 'Treasury Operations', type: 'business_capability', risk: 'high', businessMapping: 'Treasury Operations' },
  { id: 'biz-trading', label: 'Trade Processing', type: 'business_capability', risk: 'high', businessMapping: 'Trade Processing' },
  { id: 'biz-reporting', label: 'Regulatory Reporting', type: 'business_capability', risk: 'critical', businessMapping: 'Regulatory Compliance' },
];

// ========================
// GRAPH EDGES
// ========================
export const graphEdges: GraphEdge[] = [
  // Module dependencies
  { id: 'e1', source: 'mod-payment', target: 'mod-core-banking', type: 'depends_on', criticality: 'high', weight: 5 },
  { id: 'e2', source: 'mod-aml', target: 'mod-core-banking', type: 'depends_on', criticality: 'high', weight: 4 },
  { id: 'e3', source: 'mod-kyc', target: 'mod-aml', type: 'depends_on', criticality: 'high', weight: 3 },
  { id: 'e4', source: 'mod-trade', target: 'mod-core-banking', type: 'depends_on', criticality: 'high', weight: 4 },
  { id: 'e5', source: 'mod-trade', target: 'mod-payment', type: 'depends_on', criticality: 'medium', weight: 3 },
  { id: 'e6', source: 'mod-treasury', target: 'mod-core-banking', type: 'depends_on', criticality: 'high', weight: 5 },
  { id: 'e7', source: 'mod-treasury', target: 'mod-trade', type: 'depends_on', criticality: 'medium', weight: 3 },
  { id: 'e8', source: 'mod-reporting', target: 'mod-core-banking', type: 'depends_on', criticality: 'high', weight: 5 },
  { id: 'e9', source: 'mod-reporting', target: 'mod-aml', type: 'depends_on', criticality: 'high', weight: 4 },
  { id: 'e10', source: 'mod-reporting', target: 'mod-trade', type: 'depends_on', criticality: 'medium', weight: 3 },
  { id: 'e11', source: 'mod-ledger', target: 'mod-core-banking', type: 'depends_on', criticality: 'high', weight: 5 },
  { id: 'e12', source: 'mod-payment', target: 'mod-auth', type: 'depends_on', criticality: 'high', weight: 3 },
  { id: 'e13', source: 'mod-core-banking', target: 'mod-notification', type: 'depends_on', criticality: 'low', weight: 1 },

  // Service calls
  { id: 'e14', source: 'svc-txn-processor', target: 'svc-risk-calculator', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e15', source: 'svc-payment-router', target: 'svc-txn-processor', type: 'calls', criticality: 'high', weight: 5 },
  { id: 'e16', source: 'svc-payment-router', target: 'svc-aml-engine', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e17', source: 'svc-kyc-validator', target: 'svc-aml-engine', type: 'calls', criticality: 'medium', weight: 3 },

  // Function calls
  { id: 'e18', source: 'fn-process-payment', target: 'fn-validate-txn', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e19', source: 'fn-process-payment', target: 'fn-route-payment', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e20', source: 'fn-process-payment', target: 'fn-screen-customer', type: 'calls', criticality: 'high', weight: 5 },
  { id: 'e21', source: 'fn-process-payment', target: 'fn-check-balance', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e22', source: 'fn-validate-txn', target: 'fn-check-balance', type: 'calls', criticality: 'medium', weight: 3 },
  { id: 'e23', source: 'fn-settle-trade', target: 'fn-post-ledger', type: 'calls', criticality: 'high', weight: 5 },
  { id: 'e24', source: 'fn-settle-trade', target: 'fn-calc-interest', type: 'calls', criticality: 'medium', weight: 2 },
  { id: 'e25', source: 'fn-generate-report', target: 'fn-post-ledger', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e26', source: 'fn-process-payment', target: 'fn-encrypt-data', type: 'calls', criticality: 'high', weight: 3 },
  { id: 'e27', source: 'fn-screen-customer', target: 'fn-encrypt-data', type: 'calls', criticality: 'high', weight: 3 },

  // DB writes/reads
  { id: 'e28', source: 'fn-process-payment', target: 'db-payments', type: 'writes_to', criticality: 'high', weight: 5 },
  { id: 'e29', source: 'fn-process-payment', target: 'db-transactions', type: 'writes_to', criticality: 'high', weight: 5 },
  { id: 'e30', source: 'fn-post-ledger', target: 'db-ledger', type: 'writes_to', criticality: 'high', weight: 5 },
  { id: 'e31', source: 'fn-validate-txn', target: 'db-accounts', type: 'reads_from', criticality: 'high', weight: 4 },
  { id: 'e32', source: 'fn-screen-customer', target: 'db-sanctions', type: 'reads_from', criticality: 'high', weight: 5 },
  { id: 'e33', source: 'fn-screen-customer', target: 'db-aml-alerts', type: 'writes_to', criticality: 'high', weight: 4 },
  { id: 'e34', source: 'fn-settle-trade', target: 'db-trades', type: 'writes_to', criticality: 'high', weight: 4 },
  { id: 'e35', source: 'fn-check-balance', target: 'db-accounts', type: 'reads_from', criticality: 'medium', weight: 3 },
  { id: 'e36', source: 'fn-generate-report', target: 'db-transactions', type: 'reads_from', criticality: 'high', weight: 4 },
  { id: 'e37', source: 'fn-generate-report', target: 'db-aml-alerts', type: 'reads_from', criticality: 'high', weight: 4 },

  // API → Function
  { id: 'e38', source: 'api-payments', target: 'fn-process-payment', type: 'calls', criticality: 'high', weight: 5 },
  { id: 'e39', source: 'api-accounts', target: 'fn-check-balance', type: 'calls', criticality: 'medium', weight: 3 },
  { id: 'e40', source: 'api-transfers', target: 'fn-validate-txn', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e41', source: 'api-kyc', target: 'fn-screen-customer', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e42', source: 'api-aml-check', target: 'fn-screen-customer', type: 'calls', criticality: 'high', weight: 5 },
  { id: 'e43', source: 'api-trades', target: 'fn-settle-trade', type: 'calls', criticality: 'high', weight: 4 },
  { id: 'e44', source: 'api-reports', target: 'fn-generate-report', type: 'calls', criticality: 'high', weight: 4 },

  // Business capability implementations
  { id: 'e45', source: 'mod-payment', target: 'biz-pay-processing', type: 'implements', criticality: 'high', weight: 5 },
  { id: 'e46', source: 'mod-aml', target: 'biz-aml', type: 'implements', criticality: 'high', weight: 5 },
  { id: 'e47', source: 'mod-kyc', target: 'biz-kyc', type: 'implements', criticality: 'high', weight: 4 },
  { id: 'e48', source: 'mod-treasury', target: 'biz-treasury', type: 'implements', criticality: 'high', weight: 4 },
  { id: 'e49', source: 'mod-trade', target: 'biz-trading', type: 'implements', criticality: 'high', weight: 4 },
  { id: 'e50', source: 'mod-reporting', target: 'biz-reporting', type: 'implements', criticality: 'high', weight: 5 },

  // Impact chains
  { id: 'e51', source: 'cls-account', target: 'cls-transaction', type: 'impacts', criticality: 'high', weight: 5 },
  { id: 'e52', source: 'cls-transaction', target: 'cls-payment', type: 'impacts', criticality: 'high', weight: 4 },
  { id: 'e53', source: 'cls-customer', target: 'cls-account', type: 'impacts', criticality: 'high', weight: 4 },
  { id: 'e54', source: 'cls-trade', target: 'cls-transaction', type: 'impacts', criticality: 'high', weight: 3 },
];

// ========================
// RISK ITEMS
// ========================
export const riskItems: RiskItem[] = [
  {
    id: 'risk-1',
    nodeId: 'fn-process-payment',
    type: 'Transaction Failure',
    severity: 'critical',
    title: 'Payment processing lacks retry mechanism',
    description: 'processPayment() has no exponential backoff retry logic for failed processor calls. Under high load, transient failures cascade into permanent payment failures.',
    businessImpact: 'Direct revenue loss — estimated $2.3M/month in failed transactions during peak hours',
    affectedDownstream: 14,
    recommendation: 'Implement circuit breaker pattern with exponential backoff retry (max 3 retries, 1s/2s/4s delays)',
    estimatedEffort: '3-5 days',
    category: 'reliability',
  },
  {
    id: 'risk-2',
    nodeId: 'fn-screen-customer',
    type: 'Compliance Breach',
    severity: 'critical',
    title: 'AML screening cache stale for 24 hours',
    description: 'screenCustomer() uses cached sanctions data with 24-hour TTL. New sanctions entries are not reflected until cache refresh, creating a compliance window.',
    businessImpact: 'Regulatory penalty risk — potential $50M+ fine for missed sanctions match',
    affectedDownstream: 8,
    recommendation: 'Reduce cache TTL to 1 hour and implement real-time webhook for sanctions list updates',
    estimatedEffort: '2-3 days',
    category: 'compliance',
  },
  {
    id: 'risk-3',
    nodeId: 'svc-txn-processor',
    type: 'Security Vulnerability',
    severity: 'critical',
    title: 'SQL injection vulnerability in transaction query builder',
    description: 'TransactionProcessor uses string concatenation for SQL queries in the search endpoint. User-supplied parameters are not properly sanitized.',
    businessImpact: 'Data exposure risk — full transaction database accessible via injection attack',
    affectedDownstream: 22,
    recommendation: 'Replace string concatenation with parameterized queries. Add input validation layer.',
    estimatedEffort: '2 days',
    category: 'security',
  },
  {
    id: 'risk-4',
    nodeId: 'fn-generate-report',
    type: 'Performance',
    severity: 'high',
    title: 'Regulatory report generation exceeds SLA',
    description: 'generateRegulatoryReport() performs sequential database queries without batching. Report generation takes 45+ minutes for quarterly reports.',
    businessImpact: 'SLA breach — regulatory submission deadlines at risk, potential late filing penalties',
    affectedDownstream: 6,
    recommendation: 'Implement parallel query execution and materialized views for reporting aggregates',
    estimatedEffort: '5-8 days',
    category: 'performance',
  },
  {
    id: 'risk-5',
    nodeId: 'fn-settle-trade',
    type: 'Data Integrity',
    severity: 'high',
    title: 'Trade settlement lacks idempotency check',
    description: 'settleTrade() can be invoked multiple times for the same trade without idempotency guards, potentially creating duplicate ledger entries.',
    businessImpact: 'Financial loss — duplicate settlements could result in incorrect fund transfers',
    affectedDownstream: 9,
    recommendation: 'Add idempotency key check at function entry. Implement database-level unique constraint on settlement_id.',
    estimatedEffort: '2-3 days',
    category: 'reliability',
  },
  {
    id: 'risk-6',
    nodeId: 'cls-account',
    type: 'Dead Code',
    severity: 'medium',
    title: 'Legacy account migration methods unused',
    description: 'Account class contains 12 methods related to legacy migration that are no longer called. These methods still have database access and could be exploited.',
    businessImpact: 'Security risk — unused code with database access increases attack surface',
    affectedDownstream: 0,
    recommendation: 'Remove legacy migration methods. Archive in separate utility if needed for future reference.',
    estimatedEffort: '1 day',
    category: 'maintenance',
  },
  {
    id: 'risk-7',
    nodeId: 'fn-encrypt-data',
    type: 'Security',
    severity: 'high',
    title: 'Encryption key rotation not implemented',
    description: 'encryptSensitiveData() uses a static encryption key loaded at startup. No key rotation mechanism exists.',
    businessImpact: 'Compliance violation — PCI-DSS requires regular key rotation for cardholder data',
    affectedDownstream: 12,
    recommendation: 'Implement key rotation using HSM integration. Support decrypt with old key, encrypt with new key.',
    estimatedEffort: '5-7 days',
    category: 'security',
  },
  {
    id: 'risk-8',
    nodeId: 'mod-treasury',
    type: 'Architecture',
    severity: 'high',
    title: 'Treasury module has circular dependency with Core Banking',
    description: 'Treasury Management System has bidirectional dependency with Core Banking Engine, creating tight coupling and deployment challenges.',
    businessImpact: 'Engineering velocity — changes to either module require coordinated deployment',
    affectedDownstream: 18,
    recommendation: 'Extract shared interfaces into a common library. Implement event-driven communication via message queue.',
    estimatedEffort: '10-15 days',
    category: 'architecture',
  },
  {
    id: 'risk-9',
    nodeId: 'fn-post-ledger',
    type: 'Data Integrity',
    severity: 'critical',
    title: 'Ledger posting not wrapped in database transaction',
    description: 'postToLedger() performs multiple database writes (debit + credit entries) without a wrapping database transaction. Partial failures leave ledger inconsistent.',
    businessImpact: 'Financial accuracy — out-of-balance ledger requires manual reconciliation costing $50K+ per incident',
    affectedDownstream: 15,
    recommendation: 'Wrap all ledger operations in explicit database transaction with proper rollback handling.',
    estimatedEffort: '2 days',
    category: 'reliability',
  },
  {
    id: 'risk-10',
    nodeId: 'svc-aml-engine',
    type: 'Performance',
    severity: 'medium',
    title: 'AML engine loads entire sanctions list into memory',
    description: 'AMLEngine loads the full sanctions list (500K+ records) into memory on startup. This causes 2GB+ memory consumption and slow restarts.',
    businessImpact: 'Infrastructure cost — requires oversized instances; restart takes 4+ minutes',
    affectedDownstream: 5,
    recommendation: 'Implement lazy loading with indexed search. Use bloom filter for rapid pre-screening.',
    estimatedEffort: '5-7 days',
    category: 'performance',
  },
  {
    id: 'risk-11',
    nodeId: 'api-payments',
    type: 'Security',
    severity: 'high',
    title: 'Payment API missing rate limiting',
    description: 'The /api/v2/payments endpoint has no rate limiting configured. Susceptible to brute-force and DOS attacks.',
    businessImpact: 'Service availability — payment service could be taken offline by a simple DOS attack',
    affectedDownstream: 8,
    recommendation: 'Implement token-bucket rate limiting at API gateway level. Set to 100 req/s per client.',
    estimatedEffort: '1-2 days',
    category: 'security',
  },
  {
    id: 'risk-12',
    nodeId: 'fn-calc-interest',
    type: 'Accuracy',
    severity: 'medium',
    title: 'Interest calculation uses floating point arithmetic',
    description: 'calculateInterest() uses JavaScript floating point (double) for currency calculations, leading to rounding errors.',
    businessImpact: 'Financial accuracy — cumulative rounding errors of ~$12K/quarter across all accounts',
    affectedDownstream: 4,
    recommendation: 'Replace with BigDecimal/Decimal library for all currency operations. Apply banker\'s rounding.',
    estimatedEffort: '3-4 days',
    category: 'reliability',
  },
];

// ========================
// REMEDIATION SUGGESTIONS
// ========================
export const remediationSuggestions: RemediationSuggestion[] = [
  {
    id: 'rem-1',
    title: 'Extract Payment Processing into Microservice',
    category: 'architecture',
    confidence: 87,
    riskReduction: 34,
    effort: 'high',
    effortDays: 30,
    description: 'The payment processing logic is tightly coupled with the core banking engine. Extracting it into an independent microservice with clear API contracts will reduce blast radius and enable independent scaling.',
    affectedFiles: ['PaymentRouter.java', 'TransactionProcessor.java', 'PaymentGateway.java'],
    pattern: 'Strangler Fig Pattern + API Gateway',
    priority: 1,
  },
  {
    id: 'rem-2',
    title: 'Implement Circuit Breaker for External Integrations',
    category: 'refactoring',
    confidence: 94,
    riskReduction: 28,
    effort: 'medium',
    effortDays: 8,
    description: 'Add circuit breaker pattern (Resilience4j) to all external service calls including payment processors, sanctions APIs, and credit bureaus.',
    affectedFiles: ['PaymentRouter.java', 'AMLEngine.java', 'KYCValidator.java'],
    pattern: 'Circuit Breaker + Bulkhead Pattern',
    priority: 2,
  },
  {
    id: 'rem-3',
    title: 'Add Parameterized Queries to Transaction Service',
    category: 'security',
    confidence: 98,
    riskReduction: 45,
    effort: 'low',
    effortDays: 2,
    description: 'Replace all string-concatenated SQL queries with parameterized prepared statements to eliminate SQL injection vulnerabilities.',
    affectedFiles: ['TransactionProcessor.java', 'AccountRepository.java'],
    pattern: 'Prepared Statement Pattern',
    priority: 3,
  },
  {
    id: 'rem-4',
    title: 'Implement Database Transaction Wrapping for Ledger',
    category: 'refactoring',
    confidence: 96,
    riskReduction: 38,
    effort: 'low',
    effortDays: 2,
    description: 'Wrap all ledger posting operations in explicit database transactions with proper rollback handling on failure.',
    affectedFiles: ['LedgerService.java', 'postToLedger.java'],
    pattern: 'Unit of Work Pattern',
    priority: 4,
  },
  {
    id: 'rem-5',
    title: 'Reduce AML Cache TTL and Add Webhooks',
    category: 'compliance',
    confidence: 91,
    riskReduction: 42,
    effort: 'medium',
    effortDays: 5,
    description: 'Reduce sanctions list cache TTL from 24h to 1h and implement real-time webhook receiver for sanctions list updates.',
    affectedFiles: ['AMLEngine.java', 'SanctionsCache.java', 'WebhookReceiver.java'],
    pattern: 'Event-Driven Cache Invalidation',
    priority: 5,
  },
  {
    id: 'rem-6',
    title: 'Generate Missing Unit Tests for Trade Settlement',
    category: 'testing',
    confidence: 85,
    riskReduction: 22,
    effort: 'medium',
    effortDays: 7,
    description: 'Trade settlement has 70% test coverage with critical paths untested. Generate comprehensive test suites covering edge cases: partial fills, failed settlements, rollbacks.',
    affectedFiles: ['TradeSettlement.test.java', 'SettlementIntegration.test.java'],
    pattern: 'Boundary Value Analysis + Mutation Testing',
    priority: 6,
  },
  {
    id: 'rem-7',
    title: 'Implement Encryption Key Rotation Mechanism',
    category: 'security',
    confidence: 89,
    riskReduction: 32,
    effort: 'high',
    effortDays: 12,
    description: 'Implement automated key rotation with HSM integration. Support dual-key operation during rotation period (decrypt with old, encrypt with new).',
    affectedFiles: ['EncryptionService.java', 'KeyManager.java', 'HSMClient.java'],
    pattern: 'Envelope Encryption + Key Versioning',
    priority: 7,
  },
  {
    id: 'rem-8',
    title: 'Optimize Regulatory Report Generation',
    category: 'performance',
    confidence: 82,
    riskReduction: 18,
    effort: 'medium',
    effortDays: 10,
    description: 'Replace sequential database queries with parallel execution and materialized views. Target: reduce report generation from 45min to under 5min.',
    affectedFiles: ['ReportGenerator.java', 'MaterializedViewSetup.sql'],
    pattern: 'CQRS Read Optimization',
    priority: 8,
  },
  {
    id: 'rem-9',
    title: 'Remove Legacy Dead Code from Account Module',
    category: 'refactoring',
    confidence: 95,
    riskReduction: 8,
    effort: 'low',
    effortDays: 1,
    description: 'Remove 12 unused legacy migration methods from the Account class that have database access. Reduces attack surface and maintenance burden.',
    affectedFiles: ['Account.java', 'LegacyMigration.java'],
    pattern: 'Dead Code Elimination',
    priority: 9,
  },
  {
    id: 'rem-10',
    title: 'Replace Floating Point with BigDecimal for Currency',
    category: 'refactoring',
    confidence: 97,
    riskReduction: 15,
    effort: 'medium',
    effortDays: 6,
    description: 'Replace all double/float arithmetic with BigDecimal for currency calculations across the codebase. Apply banker\'s rounding (HALF_EVEN).',
    affectedFiles: ['InterestCalculator.java', 'FeeCalculator.java', 'BalanceService.java'],
    pattern: 'Money Pattern (Fowler)',
    priority: 10,
  },
];

// ========================
// BUSINESS CAPABILITIES
// ========================
export const businessCapabilities: BusinessCapability[] = [
  {
    id: 'bc-1',
    name: 'Payment Processing',
    domain: 'Operations',
    description: 'End-to-end payment processing including routing, clearing, and settlement across multiple payment rails (SWIFT, SEPA, ACH, RTP).',
    modules: ['mod-payment', 'fn-process-payment', 'fn-route-payment', 'api-payments'],
    riskLevel: 'critical',
    coverage: 78,
    healthScore: 72,
  },
  {
    id: 'bc-2',
    name: 'AML Compliance',
    domain: 'Compliance',
    description: 'Anti-money laundering screening, transaction monitoring, suspicious activity detection, and regulatory reporting.',
    modules: ['mod-aml', 'fn-screen-customer', 'svc-aml-engine', 'api-aml-check'],
    riskLevel: 'critical',
    coverage: 85,
    healthScore: 68,
  },
  {
    id: 'bc-3',
    name: 'Customer Onboarding',
    domain: 'Customer Management',
    description: 'KYC verification, identity validation, risk profiling, and customer account creation workflows.',
    modules: ['mod-kyc', 'svc-kyc-validator', 'api-kyc', 'cls-customer'],
    riskLevel: 'high',
    coverage: 91,
    healthScore: 88,
  },
  {
    id: 'bc-4',
    name: 'Treasury Operations',
    domain: 'Operations',
    description: 'Cash management, liquidity forecasting, FX operations, and interbank settlement processes.',
    modules: ['mod-treasury'],
    riskLevel: 'high',
    coverage: 65,
    healthScore: 58,
  },
  {
    id: 'bc-5',
    name: 'Trade Processing',
    domain: 'Capital Markets',
    description: 'Trade capture, matching, confirmation, settlement, and lifecycle management for equities, bonds, and derivatives.',
    modules: ['mod-trade', 'fn-settle-trade', 'cls-trade', 'api-trades'],
    riskLevel: 'high',
    coverage: 72,
    healthScore: 76,
  },
  {
    id: 'bc-6',
    name: 'Regulatory Reporting',
    domain: 'Compliance',
    description: 'Basel III/IV capital adequacy, liquidity coverage ratio, net stable funding ratio, and stress testing reports.',
    modules: ['mod-reporting', 'fn-generate-report', 'api-reports'],
    riskLevel: 'critical',
    coverage: 82,
    healthScore: 64,
  },
  {
    id: 'bc-7',
    name: 'Financial Accounting',
    domain: 'Finance',
    description: 'General ledger management, chart of accounts, journal entries, and financial statement generation.',
    modules: ['mod-ledger', 'fn-post-ledger', 'fn-calc-interest', 'db-ledger'],
    riskLevel: 'critical',
    coverage: 88,
    healthScore: 75,
  },
  {
    id: 'bc-8',
    name: 'Access Control',
    domain: 'Security',
    description: 'Authentication, authorization, role-based access control, session management, and multi-factor authentication.',
    modules: ['mod-auth', 'fn-encrypt-data'],
    riskLevel: 'high',
    coverage: 92,
    healthScore: 82,
  },
];

// ========================
// AUDIT LOG
// ========================
export const auditLog: AuditLogEntry[] = [
  { id: 'log-1', timestamp: '2026-02-26T10:30:00Z', action: 'Repository Scan Initiated', user: 'admin@acmebank.com', role: 'Admin', details: 'Full scan of core-banking-engine repository (342 files)', type: 'scan' },
  { id: 'log-2', timestamp: '2026-02-26T10:32:15Z', action: 'AST Parsing Complete', user: 'system', role: 'System', details: 'Parsed 342 files, extracted 1847 functions, 198 classes', type: 'analysis' },
  { id: 'log-3', timestamp: '2026-02-26T10:33:45Z', action: 'Dependency Graph Built', user: 'system', role: 'System', details: 'Generated graph with 245 nodes and 512 edges', type: 'analysis' },
  { id: 'log-4', timestamp: '2026-02-26T10:35:00Z', action: 'Risk Assessment Complete', user: 'system', role: 'System', details: 'Identified 12 critical, 34 high, 67 medium, 229 low risk items', type: 'analysis' },
  { id: 'log-5', timestamp: '2026-02-26T10:36:22Z', action: 'AI Insight Generation', user: 'system', role: 'System', details: 'Generated 10 remediation suggestions with confidence scores 82-98%', type: 'ai_inference' },
  { id: 'log-6', timestamp: '2026-02-26T10:40:00Z', action: 'Report Exported', user: 'sarah.chen@acmebank.com', role: 'Architect', details: 'Exported risk assessment report (PDF, 42 pages)', type: 'access' },
  { id: 'log-7', timestamp: '2026-02-26T09:15:00Z', action: 'Repository Scan Initiated', user: 'admin@acmebank.com', role: 'Admin', details: 'Full scan of payment-gateway-service repository (156 files)', type: 'scan' },
  { id: 'log-8', timestamp: '2026-02-26T09:17:30Z', action: 'Risk Threshold Modified', user: 'admin@acmebank.com', role: 'Admin', details: 'Critical threshold changed from 50 to 40 downstream nodes', type: 'config_change' },
  { id: 'log-9', timestamp: '2026-02-25T22:45:00Z', action: 'Repository Scan Initiated', user: 'scheduler', role: 'System', details: 'Scheduled nightly scan of aml-screening-platform (234 files)', type: 'scan' },
  { id: 'log-10', timestamp: '2026-02-25T22:48:15Z', action: 'Business Mapping Updated', user: 'james.wilson@acmebank.com', role: 'Architect', details: 'Updated AML module mapping to BIAN v12 taxonomy', type: 'config_change' },
  { id: 'log-11', timestamp: '2026-02-25T20:00:00Z', action: 'User Login', user: 'dev.team@acmebank.com', role: 'Developer', details: 'Login from 192.168.1.45, session ID: sess_abc123', type: 'access' },
  { id: 'log-12', timestamp: '2026-02-25T18:30:00Z', action: 'Compliance Rule Added', user: 'admin@acmebank.com', role: 'Admin', details: 'Added PCI-DSS key rotation check to compliance rules', type: 'config_change' },
];

// ========================
// USERS
// ========================
export const demoUsers = [
  { id: 'user-1', email: 'admin@cfip.io', password: 'admin123', name: 'Alex Morgan', role: 'admin', avatar: 'AM' },
  { id: 'user-2', email: 'architect@cfip.io', password: 'architect123', name: 'Sarah Chen', role: 'architect', avatar: 'SC' },
  { id: 'user-3', email: 'developer@cfip.io', password: 'dev123', name: 'James Wilson', role: 'developer', avatar: 'JW' },
  { id: 'user-4', email: 'auditor@cfip.io', password: 'audit123', name: 'Maria Garcia', role: 'auditor', avatar: 'MG' },
];

// ========================
// DASHBOARD STATS
// ========================
export const dashboardStats = {
  totalRepositories: 6,
  totalFiles: 1306,
  totalFunctions: 7462,
  totalClasses: 785,
  graphNodes: 245,
  graphEdges: 512,
  avgHealthScore: 75,
  criticalRisks: 66,
  highRisks: 171,
  mediumRisks: 300,
  lowRisks: 769,
  aiInsightsGenerated: 156,
  scansCompleted: 42,
  lastScanTime: '2026-02-26T10:30:00Z',
  codebaseLanguages: [
    { language: 'Java', percentage: 45, files: 587 },
    { language: 'Python', percentage: 25, files: 326 },
    { language: 'TypeScript', percentage: 15, files: 196 },
    { language: 'SQL', percentage: 10, files: 131 },
    { language: 'Other', percentage: 5, files: 66 },
  ],
  riskTrend: [
    { date: '2026-01-01', critical: 82, high: 198, medium: 345, low: 720 },
    { date: '2026-01-15', critical: 78, high: 190, medium: 330, low: 735 },
    { date: '2026-02-01', critical: 74, high: 182, medium: 318, low: 750 },
    { date: '2026-02-10', critical: 70, high: 176, medium: 308, low: 758 },
    { date: '2026-02-20', critical: 68, high: 173, medium: 302, low: 765 },
    { date: '2026-02-26', critical: 66, high: 171, medium: 300, low: 769 },
  ],
  recentActivity: [
    { id: 'act-1', type: 'scan', message: 'Completed scan of core-banking-engine', time: '2 hours ago', severity: 'info' },
    { id: 'act-2', type: 'risk', message: 'New critical risk detected in payment module', time: '3 hours ago', severity: 'critical' },
    { id: 'act-3', type: 'remediation', message: 'Remediation applied: SQL injection fix', time: '5 hours ago', severity: 'success' },
    { id: 'act-4', type: 'scan', message: 'Scheduled scan of aml-screening-platform', time: '12 hours ago', severity: 'info' },
    { id: 'act-5', type: 'config', message: 'Risk threshold updated by admin', time: '1 day ago', severity: 'warning' },
    { id: 'act-6', type: 'ai', message: 'AI generated 10 new remediation suggestions', time: '1 day ago', severity: 'info' },
  ],
};

// ========================
// SCAN HISTORY
// ========================
export const scanHistory = [
  { id: 'scan-1', repository: 'core-banking-engine', timestamp: '2026-02-26T10:30:00Z', duration: '5m 32s', filesScanned: 342, risksFound: 342, status: 'completed' as const },
  { id: 'scan-2', repository: 'payment-gateway-service', timestamp: '2026-02-26T09:15:00Z', duration: '2m 48s', filesScanned: 156, risksFound: 156, status: 'completed' as const },
  { id: 'scan-3', repository: 'aml-screening-platform', timestamp: '2026-02-25T22:45:00Z', duration: '4m 15s', filesScanned: 234, risksFound: 234, status: 'completed' as const },
  { id: 'scan-4', repository: 'kyc-onboarding-service', timestamp: '2026-02-26T08:00:00Z', duration: '1m 52s', filesScanned: 98, risksFound: 98, status: 'completed' as const },
  { id: 'scan-5', repository: 'treasury-management-system', timestamp: '2026-02-24T14:30:00Z', duration: '6m 10s', filesScanned: 287, risksFound: 287, status: 'completed' as const },
  { id: 'scan-6', repository: 'trade-lifecycle-engine', timestamp: '2026-02-26T11:00:00Z', duration: '3m 30s', filesScanned: 189, risksFound: 189, status: 'completed' as const },
];

// ========================
// IMPACT SIMULATION DATA
// ========================
export const impactSimulations = [
  {
    changedNode: 'fn-process-payment',
    impacts: [
      { nodeId: 'api-payments', type: 'API Impact', severity: 'critical' as const, description: 'Payment API behavior changes' },
      { nodeId: 'db-payments', type: 'Data Impact', severity: 'high' as const, description: 'Payment records structure affected' },
      { nodeId: 'db-transactions', type: 'Data Impact', severity: 'high' as const, description: 'Transaction records affected' },
      { nodeId: 'fn-validate-txn', type: 'Function Dependency', severity: 'medium' as const, description: 'Validation logic may need update' },
      { nodeId: 'fn-screen-customer', type: 'Compliance Impact', severity: 'critical' as const, description: 'AML screening flow affected' },
      { nodeId: 'fn-encrypt-data', type: 'Security Impact', severity: 'high' as const, description: 'Encryption pipeline may need review' },
      { nodeId: 'mod-reporting', type: 'Upstream Impact', severity: 'high' as const, description: 'Reporting data may be affected' },
      { nodeId: 'biz-pay-processing', type: 'Business Impact', severity: 'critical' as const, description: 'Payment processing capability degraded' },
    ],
    riskSummary: {
      slaRisk: 'HIGH — Payment SLA likely breached during transition',
      complianceRisk: 'CRITICAL — AML screening dependency must be verified',
      dataRisk: 'HIGH — Transaction data integrity needs validation',
      securityRisk: 'MEDIUM — Encryption pipeline unaffected if API contract maintained',
    },
  },
  {
    changedNode: 'fn-post-ledger',
    impacts: [
      { nodeId: 'db-ledger', type: 'Data Impact', severity: 'critical' as const, description: 'Ledger entries directly affected' },
      { nodeId: 'fn-settle-trade', type: 'Function Dependency', severity: 'high' as const, description: 'Trade settlement depends on ledger posting' },
      { nodeId: 'fn-generate-report', type: 'Function Dependency', severity: 'high' as const, description: 'Report generation reads from ledger' },
      { nodeId: 'mod-reporting', type: 'Module Impact', severity: 'critical' as const, description: 'Regulatory reporting accuracy at risk' },
      { nodeId: 'biz-reporting', type: 'Business Impact', severity: 'critical' as const, description: 'Regulatory compliance may be breached' },
    ],
    riskSummary: {
      slaRisk: 'MEDIUM — Report generation timing may be affected',
      complianceRisk: 'CRITICAL — Ledger accuracy directly impacts regulatory reports',
      dataRisk: 'CRITICAL — Financial data integrity at stake',
      securityRisk: 'LOW — No security impact identified',
    },
  },
];

// ========================
// ARCHITECTURE LAYERS
// ========================
export const architectureLayers = [
  {
    name: 'Presentation Layer',
    color: '#6366f1',
    components: ['Web Dashboard', 'Mobile App', 'Admin Portal', 'API Documentation'],
  },
  {
    name: 'API Gateway Layer',
    color: '#8b5cf6',
    components: ['REST API v2', 'gRPC Services', 'WebSocket Server', 'Rate Limiter'],
  },
  {
    name: 'Service Layer',
    color: '#06b6d4',
    components: ['Payment Service', 'AML Service', 'KYC Service', 'Trade Service', 'Treasury Service', 'Auth Service'],
  },
  {
    name: 'Business Logic Layer',
    color: '#22c55e',
    components: ['Transaction Engine', 'Risk Calculator', 'Compliance Engine', 'Settlement Engine', 'Reporting Engine'],
  },
  {
    name: 'Data Access Layer',
    color: '#eab308',
    components: ['Account Repository', 'Transaction Repository', 'Trade Repository', 'Audit Repository'],
  },
  {
    name: 'Infrastructure Layer',
    color: '#f97316',
    components: ['PostgreSQL', 'Redis Cache', 'RabbitMQ', 'Elasticsearch', 'S3 Storage'],
  },
];
