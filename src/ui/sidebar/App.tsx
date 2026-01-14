import { useState } from 'react'
import { Layout, Globe, AlertCircle } from 'lucide-react';
import { Chat } from './components/Chat'
import { useExtension } from './hooks/useExtension'
import { MessageClient } from '../../shared/messaging/client';

function App() {
    const { analyzePage, loading, error } = useExtension();
    const [pageInfo, setPageInfo] = useState<{ title: string, url: string } | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleAnalyze = async () => {
        try {
            const result = await analyzePage();
            if (result) {
                setPageInfo({ title: result.title, url: result.url });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleRecording = async () => {
        try {
            // Send to active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab?.id) {
                await MessageClient.send('tab', 'TOGGLE_RECORDING', { active: !isRecording }, tab.id);
                setIsRecording(!isRecording);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
            {/* Header */}
            <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layout size={20} className="text-blue-600" color="#2563eb" />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Gemini Agent</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={toggleRecording}
                        style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.25rem',
                            backgroundColor: isRecording ? '#fee2e2' : 'white',
                            color: isRecording ? '#dc2626' : 'inherit',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isRecording ? '#dc2626' : '#9ca3af' }} />
                        {isRecording ? 'Stop' : 'Rec'}
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.25rem',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <Globe size={12} />
                        {loading ? 'Analyzing...' : 'Context'}
                    </button>
                </div>
            </div>

            {/* Page Context Chip */}
            {pageInfo && (
                <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f0f9ff', borderBottom: '1px solid #e0f2fe', fontSize: '0.75rem', color: '#0369a1' }}>
                    <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageInfo.title}</div>
                    <div style={{ opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageInfo.url}</div>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div style={{ padding: '0.5rem', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={12} />
                    {error}
                </div>
            )}

            {/* Chat Area */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <Chat />
            </div>
        </div>
    )
}

export default App
