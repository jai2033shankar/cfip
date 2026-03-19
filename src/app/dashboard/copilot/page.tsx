'use client';

import { useState, useRef, useEffect } from 'react';
import { FiSend, FiCpu, FiUser, FiCode, FiLayers, FiAlertTriangle, FiDatabase } from 'react-icons/fi';
import { useScan } from '@/lib/scan-context';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function CopilotPage() {
    const { scanData } = useScan();
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: '1',
        role: 'assistant',
        content: `Hi! I'm the CFIP AI Copilot, powered by local \`gemma3:latest\` with persistent vector RAG.

I have full contextual understanding of the currently scanned repository. You can ask me to:
- Explain complex code blocks or architecture flows
- Predict the blast radius of modifying a database schema
- Generate test cases or refactoring solutions

What would you like to investigate?`
    }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [provider, setProvider] = useState<'ollama' | 'openai' | 'anthropic'>('ollama');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Check if analysis hasn't run yet
            const isLocalStoreData = localStorage.getItem('cfip_scan_complete');
            if (!scanData && !isLocalStoreData) {
                // Mock response if they haven't run a scan
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: `**Notice**: I don't have a Repository Scan Context loaded right now.\\n\\nPlease go to the **Command Center** and trigger a scan on a repository (like \`aero-copilot\`) so my ChromaDB vector store can build the context indices. I can only do general queries without it!`
                    }]);
                    setIsLoading(false);
                }, 1000);
                return;
            }

            const response = await fetch('http://localhost:8001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': 'tenant_acme' // For demo purposes, hardcoding the enterprise tenant to allow access to all cloud models
                },
                body: JSON.stringify({
                    query: userMsg.content,
                    provider: provider,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message
            }]);

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `🚨 **Connection Error**\\n\\nCould not reach the Python Inference Engine on port 8001. Ensure that:\\n1. The Python Backend is running\\n2. Ollama is running \`gemma3:latest\``
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div className="breadcrumb">
                        <span>CFIP</span> / AI Copilot
                    </div>
                    <h1>Code Conversation <span className="badge badge-success" style={{ verticalAlign: 'middle', marginLeft: '12px', fontSize: '10px' }}>RAG ACTIVE</span></h1>
                    <p>Chat with the AI Copilot integrated with full repository context vectors.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Model Provider:</span>
                    <select
                        className="input"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', height: 'auto', background: 'rgba(255,255,255,0.05)' }}
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as any)}
                    >
                        <option value="ollama">Local (Ollama gemma3)</option>
                        <option value="openai">OpenAI (GPT-4o)</option>
                        <option value="anthropic">Anthropic (Claude 3.5)</option>
                    </select>
                </div>
            </div>

            <div className="glass-card-static" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Chat Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            display: 'flex',
                            gap: '16px',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        }}>
                            <div style={{
                                width: '36px', height: '36px',
                                borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: msg.role === 'assistant' ? 'rgba(99, 102, 241, 0.1)' : 'var(--border-secondary)',
                                color: msg.role === 'assistant' ? 'var(--accent-primary-light)' : 'var(--text-secondary)'
                            }}>
                                {msg.role === 'assistant' ? <FiCpu size={18} /> : <FiUser size={18} />}
                            </div>

                            <div style={{
                                maxWidth: '75%',
                                padding: '16px',
                                borderRadius: '12px',
                                borderTopLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                                borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                                background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                                border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                lineHeight: '1.6'
                            }}>
                                {msg.role === 'user' ? (
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                ) : (
                                    <div className="markdown-body">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{
                                width: '36px', height: '36px',
                                borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary-light)'
                            }}>
                                <FiCpu size={18} />
                            </div>
                            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', borderTopLeftRadius: '2px' }}>
                                <div className="animate-spin" style={{ width: '14px', height: '14px', border: '2px solid rgba(99, 102, 241, 0.3)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Analyzing context and inferring logic...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Chips Area */}
                {!scanData && messages.length < 3 && (
                    <div style={{ padding: '0 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button className="badge" style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setInput("Can you summarize the core ledger dependencies?")}>
                            <FiDatabase style={{ display: 'inline', marginRight: '6px' }} /> Summarize Ledger Logic
                        </button>
                        <button className="badge" style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setInput("What happens if I bypass AuthMiddleware?")}>
                            <FiAlertTriangle style={{ display: 'inline', marginRight: '6px' }} /> Auth Bypass Impact
                        </button>
                        <button className="badge" style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setInput("Explain the architectural diagram for the payments module.")}>
                            <FiLayers style={{ display: 'inline', marginRight: '6px' }} /> Understand Payments Flow
                        </button>
                    </div>
                )}

                {/* Input Area */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <textarea
                            className="input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about the codebase, request a refactor, or simulate an architectural change... (Shift+Enter for newline)"
                            style={{ width: '100%', minHeight: '50px', maxHeight: '200px', resize: 'none', paddingRight: '48px', paddingTop: '14px' }}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        style={{ alignSelf: 'flex-end', height: '50px', width: '50px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <FiSend size={18} />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .markdown-body {
                    color: inherit;
                }
                .markdown-body pre {
                    background: rgba(0, 0, 0, 0.3) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    padding: 12px;
                    overflow-x: auto;
                    margin: 12px 0;
                }
                .markdown-body code {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.85em;
                }
                .markdown-body p:last-child {
                    margin-bottom: 0;
                }
                .markdown-body p:first-child {
                    margin-top: 0;
                }
            `}</style>
        </div>
    );
}
