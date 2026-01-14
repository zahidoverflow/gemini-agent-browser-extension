import { useState, useEffect } from 'react';
import { Trash2, Shield, Info, CheckCircle, AlertTriangle, FileDown, Eye, EyeOff } from 'lucide-react';
import { logger, LogEntry, LogLevel } from '../../shared/logging/logger';

function App() {
    const [cleared, setCleared] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all');

    useEffect(() => {
        if (showLogs) {
            loadLogs();
        }
    }, [showLogs]);

    const loadLogs = async () => {
        const recentLogs = await logger.getRecentLogs();
        setLogs(recentLogs);
    };

    const handleClearData = async () => {
        if (confirm('Are you sure you want to delete all extension data? This cannot be undone.')) {
            await chrome.storage.local.clear();
            setCleared(true);
            setTimeout(() => setCleared(false), 3000);
        }
    };

    const handleClearLogs = async () => {
        if (confirm('Clear all logs?')) {
            await logger.clearLogs();
            setLogs([]);
        }
    };

    const handleExportLogs = async () => {
        const exported = await logger.exportLogs();
        const blob = new Blob([exported], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gemini-agent-logs-${Date.now()}.json`;
        a.click();
    };

    const filteredLogs = filterLevel === 'all' ? logs : logs.filter(log => log.level === filterLevel);

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gemini Agent Settings</h1>
                <p style={{ color: '#6b7280' }}>Manage your preferences and data.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Data Management */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Trash2 className="text-red-500" size={24} color="#ef4444" />
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Data Management</h2>
                    </div>
                    <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
                        This extension stores chats, macros, and API keys locally on your device. Clearing data will remove all history and saved automations.
                    </p>
                    <button
                        onClick={handleClearData}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500
                        }}
                    >
                        {cleared ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                        {cleared ? 'Data Cleared' : 'Clear All Data'}
                    </button>
                </section>

                {/* Logs */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Eye className="text-blue-500" size={24} color="#3b82f6" />
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Error Logs</h2>
                        </div>
                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {showLogs ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showLogs ? 'Hide' : 'Show'} Logs
                        </button>
                    </div>

                    {showLogs && (
                        <div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <select
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value as any)}
                                    style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                                >
                                    <option value="all">All Levels</option>
                                    <option value="debug">Debug</option>
                                    <option value="info">Info</option>
                                    <option value="warn">Warning</option>
                                    <option value="error">Error</option>
                                </select>
                                <button onClick={handleExportLogs} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileDown size={16} />
                                    Export
                                </button>
                                <button onClick={handleClearLogs} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', cursor: 'pointer' }}>
                                    Clear
                                </button>
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '1rem' }}>
                                {filteredLogs.length === 0 ? (
                                    <p style={{ color: '#9ca3af' }}>No logs found</p>
                                ) : (
                                    filteredLogs.map((log, i) => (
                                        <div key={i} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: i < filteredLogs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{
                                                    padding: '0.125rem 0.5rem',
                                                    backgroundColor: log.level === 'error' ? '#fef2f2' : log.level === 'warn' ? '#fef3c7' : '#f0f9ff',
                                                    color: log.level === 'error' ? '#dc2626' : log.level === 'warn' ? '#d97706' : '#2563eb',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500
                                                }}>
                                                    {log.level.toUpperCase()}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem' }}>{log.message}</p>
                                            {log.data && (
                                                <pre style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>
                                                    {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Privacy */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Shield className="text-blue-500" size={24} color="#3b82f6" />
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Privacy & Safety</h2>
                    </div>
                    <div style={{ color: '#374151', lineHeight: '1.6' }}>
                        <p style={{ marginBottom: '0.5rem' }}>
                            <strong>Local First:</strong> All your data stays on your device. Your API key and chats are stored locally.
                        </p>
                        <p>
                            <strong>Safe Automation:</strong> The agent acts on your behalf but requires your API key for AI features.
                        </p>
                    </div>
                </section>

                {/* About */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Info className="text-gray-500" size={24} color="#6b7280" />
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>About</h2>
                    </div>
                    <p style={{ color: '#374151' }}>
                        <strong>Version:</strong> 1.0.0<br />
                        <strong>Built with:</strong> React, Vite, TypeScript<br />
                        <strong>AI:</strong> Google Gemini API
                    </p>
                </section>

            </div>
        </div>
    )
}

export default App
