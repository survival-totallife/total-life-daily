import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface Article {
  id: number;
  slug: string;
  title: string;
  markdown: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function TestArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/articles`);
      const data = await res.json();
      setArticles(data);
      setMessage("Articles fetched successfully");
    } catch (error) {
      setMessage(`Error fetching articles: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async () => {
    if (!markdown.trim()) {
      setMessage("Please enter markdown content");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });
      if (res.ok) {
        setMessage("Article created successfully");
        setMarkdown("");
        fetchArticles();
      } else {
        const error = await res.json();
        setMessage(`Error: ${error.detail || "Failed to create article"}`);
      }
    } catch (error) {
      setMessage(`Error creating article: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = async () => {
    if (!selectedArticle) {
      setMessage("Please select an article to update");
      return;
    }
    if (!markdown.trim()) {
      setMessage("Please enter markdown content");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/articles/${selectedArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });
      if (res.ok) {
        setMessage("Article updated successfully");
        setMarkdown("");
        setSelectedArticle(null);
        fetchArticles();
      } else {
        const error = await res.json();
        setMessage(`Error: ${error.detail || "Failed to update article"}`);
      }
    } catch (error) {
      setMessage(`Error updating article: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/articles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Article deleted successfully");
        if (selectedArticle?.id === id) {
          setSelectedArticle(null);
          setMarkdown("");
        }
        fetchArticles();
      } else {
        const error = await res.json();
        setMessage(`Error: ${error.detail || "Failed to delete article"}`);
      }
    } catch (error) {
      setMessage(`Error deleting article: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const selectArticle = (article: Article) => {
    setSelectedArticle(article);
    setMarkdown(article.markdown);
    setMessage(`Selected: ${article.title}`);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <>
      <Helmet>
        <title>Article Test | Total Life Daily</title>
      </Helmet>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px", color: "#0066cc" }}>
            Back to Home
          </Link>
          <Link to="/test-chat" style={{ color: "#0066cc" }}>
            Chat Test
          </Link>
        </div>

        <h1 style={{ marginBottom: "10px" }}>Article CRUD Test Page</h1>

        {message && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: message.includes("Error") ? "#ffcccc" : "#ccffcc",
              borderRadius: "4px",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: "flex", gap: "30px" }}>
          {/* Left Column - Form */}
          <div style={{ flex: 1 }}>
            <h2>
              {selectedArticle ? `Editing: ${selectedArticle.title}` : "Create New Article"}
            </h2>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter markdown content..."
              style={{
                width: "100%",
                height: "300px",
                padding: "10px",
                fontFamily: "monospace",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              {selectedArticle ? (
                <>
                  <button
                    onClick={updateArticle}
                    disabled={loading}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Updating..." : "Update Article"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      setMarkdown("");
                      setMessage("");
                    }}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#888",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
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
                    padding: "10px 20px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Creating..." : "Create Article"}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Article List */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
              <h2 style={{ margin: 0 }}>Articles ({articles.length})</h2>
              <button
                onClick={fetchArticles}
                disabled={loading}
                style={{
                  padding: "5px 15px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Refresh
              </button>
            </div>

            {loading && articles.length === 0 ? (
              <p>Loading articles...</p>
            ) : articles.length === 0 ? (
              <p>No articles found. Create one!</p>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {articles.map((article) => (
                  <div
                    key={article.id}
                    style={{
                      padding: "15px",
                      marginBottom: "10px",
                      backgroundColor: selectedArticle?.id === article.id ? "#e3f2fd" : "#f5f5f5",
                      borderRadius: "4px",
                      border: selectedArticle?.id === article.id ? "2px solid #2196F3" : "1px solid #ddd",
                    }}
                  >
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{article.title}</h3>
                    <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}>
                      Category: {article.category} | Slug: {article.slug}
                    </p>
                    <p style={{ margin: "0 0 10px 0", color: "#888", fontSize: "11px" }}>
                      Created: {new Date(article.created_at).toLocaleString()}
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => selectArticle(article)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
