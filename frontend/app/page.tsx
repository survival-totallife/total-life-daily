'use client';

import { JSX } from "react";

export default function Home(): JSX.Element {
    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
            <h1>Total Life Daily - Test Pages</h1>
            <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>
                Temporary test pages for backend functionality
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <a 
                    href="/test-articles" 
                    style={{
                        display: 'block',
                        padding: '30px',
                        border: '2px solid #0070f3',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <h2 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>
                        📝 Article CRUD Test
                    </h2>
                    <p style={{ margin: 0, color: '#666' }}>
                        Test creating, reading, updating, and deleting articles in markdown format
                    </p>
                </a>

                <a 
                    href="/test-chat" 
                    style={{
                        display: 'block',
                        padding: '30px',
                        border: '2px solid #0070f3',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <h2 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>
                        💬 Wellness Chat Test
                    </h2>
                    <p style={{ margin: 0, color: '#666' }}>
                        Test the AI-powered wellness chatbot with PubMed research integration
                    </p>
                </a>
            </div>

            <div style={{
                marginTop: '40px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px'
            }}>
                <h3 style={{ marginTop: 0 }}>Setup Instructions:</h3>
                <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                    <li><strong>Start with Docker:</strong> <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>docker-compose up --build</code></li>
                    <li>Wait for services to start (30-60 seconds first time)</li>
                    <li>Access test pages at the links above</li>
                    <li>Check browser console for any errors</li>
                    <li><strong>Note:</strong> For chat to work, add <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>GOOGLE_API_KEY</code> to <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>.env</code> file in project root</li>
                </ol>
            </div>
        </div>
    );
};
