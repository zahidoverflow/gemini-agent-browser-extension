import { useState } from 'react'
import { Trash2, Shield, Info, CheckCircle, AlertTriangle } from 'lucide-react';

function App() {
    const [cleared, setCleared] = useState(false);

    const handleClearData = async () => {
        if (confirm('Are you sure you want to delete all extension data? This cannot be undone.')) {
            await chrome.storage.local.clear();
            setCleared(true);
            setTimeout(() => setCleared(false), 3000);
        }
    };

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
                        This extension stores chats and macros locally on your device. Clearing data will remove all history and saved automations.
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

                {/* Privacy */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Shield className="text-blue-500" size={24} color="#3b82f6" />
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Privacy & Safety</h2>
                    </div>
                    <div style={{ color: '#374151', lineHeight: '1.6' }}>
                        <p style={{ marginBottom: '0.5rem' }}>
                            <strong>Local First:</strong> All your data stays on your device. We do not transmit your chats or browsing activity to any external server (except the AI provider you configure).
                        </p>
                        <p>
                            <strong>Safe Automation:</strong> The agent acts on your behalf but requires confirmation for high-risk actions.
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
                        <strong>Built with:</strong> React, Vite, TypeScript
                    </p>
                </section>

            </div>
        </div>
    )
}

export default App
