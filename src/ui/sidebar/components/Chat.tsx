import { Send, Bot, Loader2 } from 'lucide-react';
import { GeminiProvider, MockProvider } from '../../../shared/providers/gemini';
import { logger } from '../../../shared/logging/logger';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [provider, setProvider] = useState<GeminiProvider | MockProvider | null>(null);
    const [setupRequired, setSetupRequired] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize provider based on API key
        chrome.storage.local.get('gemini_api_key', (result) => {
            if (result.gemini_api_key) {
                setProvider(new GeminiProvider(result.gemini_api_key));
                logger.info('Gemini provider initialized');
            } else {
                setSetupRequired(true);
                setProvider(new MockProvider()); // Fallback to mock
                logger.warn('No API key found, using MockProvider');
            }
        });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping || !provider) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: ''
        };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            logger.info('Sending message to AI', { prompt: input });

            await provider.streamText(input, undefined, (chunk) => {
                setMessages(prev => {
                    const updated = [...prev];
                    const lastMessage = updated[updated.length - 1];
                    if (lastMessage.role === 'assistant') {
                        lastMessage.content += chunk;
                    }
                    return updated;
                });
            });

            logger.info('AI response received');
        } catch (error: any) {
            logger.error('Failed to get AI response', error);
            setMessages(prev => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];
                if (lastMessage.role === 'assistant') {
                    lastMessage.content = `Error: ${error.message || 'Failed to get response. Please try again.'}`;
                }
                return updated;
            });
        } finally {
            setIsTyping(false);
        }
    };

    if (setupRequired && provider instanceof MockProvider) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Setup Required
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        Connect your Gemini API to get started
                    </p>
                    <button
                        onClick={() => chrome.tabs.create({ url: 'src/ui/setup/index.html' })}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Open Setup
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                        <p>Start a conversation with Gemini</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            marginBottom: '1rem',
                            alignItems: 'flex-start'
                        }}
                    >
                        {msg.role === 'assistant' && (
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: '#e0f2fe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Bot size={16} color="#0284c7" />
                            </div>
                        )}
                        <div style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: msg.role === 'user' ? '#f3f4f6' : 'transparent',
                            borderRadius: '0.5rem',
                            maxWidth: msg.role === 'user' ? '80%' : '100%',
                            marginLeft: msg.role === 'user' ? 'auto' : '0'
                        }}>
                            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Gemini anything..."
                        disabled={isTyping}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isTyping || !input.trim()}
                        style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: isTyping || !input.trim() ? '#e5e7 eb' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: isTyping || !input.trim() ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isTyping ? <Loader2 size={16} /> : <Send size={16} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
