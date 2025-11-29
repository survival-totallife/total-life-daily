'use client';

import { useState, useEffect } from 'react';

interface Article {
    article_id: number;
    article_markdown: string;
    created_at: string;
    updated_at: string;
}

export default function TestArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [markdown, setMarkdown] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Fetch all articles
    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/articles`);
            if (response.ok) {
                const data = await response.json();
                setArticles(data);
                setMessage('Articles loaded successfully');
            } else {
                setMessage('Failed to fetch articles');
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    // Create article
    const createArticle = async () => {
        if (!markdown.trim()) {
            setMessage('Please enter markdown content');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ article_markdown: markdown }),
            });

            if (response.ok) {
                setMessage('Article created successfully');
                setMarkdown('');
                fetchArticles();
            } else {
                setMessage('Failed to create article');
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    // Update article
    const updateArticle = async () => {
        if (!selectedArticle || !markdown.trim()) {
            setMessage('Please select an article and enter markdown content');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/articles/${selectedArticle.article_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ article_markdown: markdown }),
            });

            if (response.ok) {
                setMessage('Article updated successfully');
                setSelectedArticle(null);
                setMarkdown('');
                fetchArticles();
            } else {
                setMessage('Failed to update article');
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    // Delete article
    const deleteArticle = async (id: number) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/articles/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage('Article deleted successfully');
                fetchArticles();
            } else {
                setMessage('Failed to delete article');
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    // Select article for editing
    const selectArticle = (article: Article) => {
        setSelectedArticle(article);
        setMarkdown(article.article_markdown);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
            <h1 style={{ marginBottom: '20px' }}>🧪 Article CRUD Test Page</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                API: {API_URL} | <a href="/" style={{ color: '#0070f3' }}>← Back to Home</a> | <a href="/test-chat" style={{ color: '#0070f3' }}>Chat Test →</a>
            </p>

            {message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '20px',
                    backgroundColor: message.includes('Error') || message.includes('Failed') ? '#fee' : '#efe',
                    border: '1px solid ' + (message.includes('Error') || message.includes('Failed') ? '#fcc' : '#cfc'),
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left: Create/Update Form */}
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                    <h2 style={{ marginTop: 0 }}>
                        {selectedArticle ? `Edit Article #${selectedArticle.article_id}` : 'Create New Article'}
                    </h2>
                    
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Enter markdown content here..."
                        style={{
                            width: '100%',
                            minHeight: '300px',
                            padding: '10px',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            marginBottom: '10px'
                        }}
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {selectedArticle ? (
                            <>
                                <button
                                    onClick={updateArticle}
                                    disabled={loading}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#0070f3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        opacity: loading ? 0.5 : 1
                                    }}
                                >
                                    Update Article
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedArticle(null);
                                        setMarkdown('');
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#666',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={createArticle}
                                disabled={loading}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    opacity: loading ? 0.5 : 1
                                }}
                            >
                                Create Article
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Articles List */}
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2 style={{ margin: 0 }}>Articles ({articles.length})</h2>
                        <button
                            onClick={fetchArticles}
                            disabled={loading}
                            style={{
                                padding: '5px 15px',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Refresh
                        </button>
                    </div>

                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {articles.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center' }}>No articles yet. Create one!</p>
                        ) : (
                            articles.map((article) => (
                                <div
                                    key={article.article_id}
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        padding: '15px',
                                        marginBottom: '10px',
                                        backgroundColor: selectedArticle?.article_id === article.article_id ? '#f0f8ff' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                        <strong>Article #{article.article_id}</strong>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => selectArticle(article)}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: '#0070f3',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteArticle(article.article_id)}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: '#ff4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <pre style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        maxHeight: '100px',
                                        overflow: 'hidden',
                                        margin: '10px 0',
                                        fontFamily: 'monospace'
                                    }}>
                                        {article.article_markdown.substring(0, 200)}
                                        {article.article_markdown.length > 200 ? '...' : ''}
                                    </pre>
                                    <small style={{ color: '#999' }}>
                                        Created: {new Date(article.created_at).toLocaleString()} | 
                                        Updated: {new Date(article.updated_at).toLocaleString()}
                                    </small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <h3 style={{ marginTop: 0 }}>Test Tips:</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Create articles with markdown content (# headers, **bold**, *italic*, etc.)</li>
                    <li>Click "Edit" to modify an existing article</li>
                    <li>Click "Delete" to remove an article</li>
                    <li>Click "Refresh" to reload the article list</li>
                    <li>Check browser console for any errors</li>
                </ul>
            </div>
        </div>
    );
}
