import { useState } from 'react';
import { Sparkles, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { logger } from '../../shared/logging/logger';

function App() {
    const [apiKey, setApiKey] = useState('');
    const [testing, setTesting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const testApiKey = async () => {
        if (!apiKey.trim()) {
            setError('Please enter an API key');
            return;
        }

        setTesting(true);
        setError('');

        try {
            // Test the API key by making a simple request
            const { GeminiProvider } = await import('../../shared/providers/gemini');
            const provider = new GeminiProvider(apiKey);
            await provider.generateText('Say "API key valid" if you can read this');

            // Save API key
            await chrome.storage.local.set({ gemini_api_key: apiKey });
            logger.info('API key validated and saved');

            setSuccess(true);
            setTimeout(() => {
                window.close();
            }, 1500);
        } catch (err: any) {
            logger.error('API key validation failed', err);
            setError(err.message || 'Invalid API key. Please check and try again.');
        } finally {
            setTesting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '3rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Sparkles size={48} color="#667eea" style={{ margin: '0 auto 1rem' }} />
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
                        Welcome to Gemini Agent
                    </h1>
                    <p style={{ color: '#718096' }}>
                        Your AI-powered browser assistant
                    </p>
                </div>

                {success ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '0.5rem',
                        border: '1px solid #86efac'
                    }}>
                        <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#166534' }}>
                            Setup Complete!
                        </p>
                        <p style={{ color: '#15803d', marginTop: '0.5rem' }}>
                            Redirecting...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Step 1 */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    borderRadius: '50%',
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold'
                                }}>1</div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Get your Gemini API Key</h3>
                            </div>
                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5568d3'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                            >
                                Open Google AI Studio
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    borderRadius: '50%',
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold'
                                }}>2</div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Paste your API Key</h3>
                            </div>

                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    marginBottom: '1rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />

                            {error && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    backgroundColor: '#fef2f2',
                                    color: '#991b1b',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={testApiKey}
                                disabled={testing || !apiKey.trim()}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: testing || !apiKey.trim() ? '#cbd5e0' : '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: testing || !apiKey.trim() ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!testing && apiKey.trim()) {
                                        e.currentTarget.style.backgroundColor = '#059669';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!testing && apiKey.trim()) {
                                        e.currentTarget.style.backgroundColor = '#10b981';
                                    }
                                }}
                            >
                                {testing && <Loader2 size={16} className="animate-spin" />}
                                {testing ? 'Testing...' : 'Save & Continue'}
                            </button>
                        </div>
                    </>
                )}

                {/* Footer */}
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                        Your API key is stored locally and never shared
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
