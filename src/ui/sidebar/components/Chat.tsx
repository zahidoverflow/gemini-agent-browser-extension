import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { MockProvider } from '../providers/ai';


interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const ai = new MockProvider();

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hi! I am your browser assistant. How can I help?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await ai.generateText(userMsg.content);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                    }}>
                        {msg.role === 'assistant' && (
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Bot size={14} />
                            </div>
                        )}
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: msg.role === 'user' ? '#2563eb' : '#f3f4f6',
                            color: msg.role === 'user' ? 'white' : 'black',
                            fontSize: '0.875rem',
                            lineHeight: '1.25'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loader2 size={14} className="animate-spin" />
                        </div>
                        <div style={{ padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    style={{
                        padding: '0.5rem',
                        backgroundColor: input.trim() ? '#2563eb' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: input.trim() ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}
