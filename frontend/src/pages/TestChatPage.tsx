import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface Source {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  url: string;
}

interface ChatResponse {
  response: string;
  sources: Source[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EXAMPLE_QUESTIONS = [
  "What are the benefits of meditation for stress?",
  "How does exercise improve mental health?",
  "What foods help with inflammation?",
  "How much sleep do adults need?",
  "What are natural remedies for anxiety?",
];

export default function TestChatPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (questionText?: string) => {
    const question = questionText || message;
    if (!question.trim()) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (res.ok) {
        const data: ChatResponse = await res.json();
        setResponse(data);
        if (!questionText) setMessage("");
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to get response");
      }
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (question: string) => {
    setMessage(question);
    sendMessage(question);
  };

  return (
    <>
      <Helmet>
        <title>Chat Test | Total Life Daily</title>
      </Helmet>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px", color: "#0066cc" }}>
            Back to Home
          </Link>
          <Link to="/test-articles" style={{ color: "#0066cc" }}>
            Article Test
          </Link>
        </div>

        <h1 style={{ marginBottom: "10px" }}>Wellness Chat Test Page</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Ask questions about health and wellness topics. The AI will search scientific literature to provide answers.
        </p>

        {/* Example Questions */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>Try an example question:</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {EXAMPLE_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(question)}
                disabled={loading}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "#e0e0e0";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              placeholder="Ask a wellness question..."
              style={{
                flex: 1,
                padding: "12px 15px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              style={{
                padding: "12px 24px",
                backgroundColor: loading ? "#ccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "8px",
              color: "#c62828",
            }}
          >
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#666",
            }}
          >
            <div style={{ marginBottom: "10px" }}>🔍 Searching scientific literature...</div>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #4CAF50",
                borderRadius: "50%",
                margin: "0 auto",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div style={{ marginTop: "20px" }}>
            {/* Main Response */}
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#333" }}>Response</h3>
              <div style={{ whiteSpace: "pre-wrap" }}>{response.response}</div>
            </div>

            {/* Sources */}
            {response.sources && response.sources.length > 0 && (
              <div>
                <h3 style={{ marginBottom: "15px", color: "#333" }}>
                  Sources ({response.sources.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {response.sources.map((source, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "15px",
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "5px", color: "#1a73e8" }}>
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1a73e8", textDecoration: "none" }}
                          >
                            {source.title}
                          </a>
                        ) : (
                          source.title
                        )}
                      </div>
                      <div style={{ fontSize: "13px", color: "#666" }}>
                        {source.authors?.join(", ")}
                      </div>
                      <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
                        {source.journal} {source.year && `(${source.year})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
