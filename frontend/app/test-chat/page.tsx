'use client';

import { useState } from 'react';

interface Source {
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: string;
    url: string;
}

interface ChatResponse {
    answer: string;
    sources: Source[];
}

export default function TestChatPage() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState<ChatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const sendMessage = async () => {
        if (!message.trim()) {
            setError('Please enter a message');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setResponse(null);

            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (res.ok) {
                const data: ChatResponse = await res.json();
                setResponse(data);
            } else {
                const errorData = await res.json();
                setError(`Error: ${errorData.detail || res.statusText}`);
            }
        } catch (err) {
            setError(`Network error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const exampleQuestions = [
        "What are the benefits of omega-3?",
        "How does vitamin D support immunity?",
        "What helps with sleep quality?",
        "Is turmeric good for inflammation?",
        "Does exercise help with anxiety?"
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui' }}>
            <h1 style={{ marginBottom: '20px' }}>🧪 Wellness Chat Test Page</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                API: {API_URL} | <a href="/" style={{ color: '#0070f3' }}>← Back to Home</a> | <a href="/test-articles" style={{ color: '#0070f3' }}>Article Test →</a>
            </p>

            {/* Chat Input */}
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                <h2 style={{ marginTop: 0 }}>Ask a Wellness Question</h2>
                
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your wellness question here..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontFamily: 'inherit'
                    }}
                />

                <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: loading ? '#ccc' : '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Processing...' : 'Send Question'}
                </button>

                {/* Example Questions */}
                <div style={{ marginTop: '15px' }}>
                    <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Try these examples:</small>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {exampleQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setMessage(q)}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    color: '#c00'
                }}>
                    {error}
                </div>
            )}

            {/* Response Display */}
            {response && (
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                    <h2 style={{ marginTop: 0, color: '#0070f3' }}>Response</h2>
                    
                    {/* Answer */}
                    <div style={{
                        backgroundColor: '#f9f9f9',
                        padding: '15px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        lineHeight: '1.6'
                    }}>
                        {response.answer.split('\n').map((paragraph, i) => (
                            <p key={i} style={{ margin: '10px 0' }}>
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Sources */}
                    {response.sources && response.sources.length > 0 && (
                        <div>
                            <h3 style={{ marginBottom: '10px' }}>
                                Research Sources ({response.sources.length})
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {response.sources.map((source, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            padding: '12px',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ flex: 1 }}>
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: '#0070f3',
                                                        textDecoration: 'none',
                                                        fontWeight: 'bold',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    {source.title}
                                                </a>
                                                <div style={{ marginTop: '5px', fontSize: '13px', color: '#666' }}>
                                                    <div><strong>Authors:</strong> {source.authors}</div>
                                                    <div><strong>Journal:</strong> {source.journal}</div>
                                                    <div><strong>Year:</strong> {source.year}</div>
                                                </div>
                                            </div>
                                            <span style={{
                                                backgroundColor: '#e3f2fd',
                                                color: '#1976d2',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                PMID: {source.id}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {response.sources && response.sources.length === 0 && (
                        <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                            <small style={{ color: '#856404' }}>
                                ℹ️ No PubMed research articles were found for this query. The response is based on general wellness knowledge.
                            </small>
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                    <p style={{ color: '#666', margin: 0 }}>
                        Searching PubMed and generating response...
                        <br />
                        <small>(This may take 5-10 seconds)</small>
                    </p>
                </div>
            )}

            {/* Info Box */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <h3 style={{ marginTop: 0 }}>Test Tips:</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Ask health and wellness questions</li>
                    <li>Responses include citations from PubMed research (when available)</li>
                    <li>Format: [Source: PMID] links to research articles</li>
                    <li>If no research is found, general wellness guidance is provided</li>
                    <li>Check browser console and backend logs for debugging</li>
                    <li>Response time: typically 5-10 seconds</li>
                </ul>
            </div>
        </div>
    );
}
