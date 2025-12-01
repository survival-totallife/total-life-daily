import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/supabase-queries";

interface ArticleDisplay {
  article_id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  featured_image: { url: string; alt: string } | null;
  is_featured: boolean;
  published_at: string;
}

export default function TestArticlesPage() {
  const [articles, setArticles] = useState<ArticleDisplay[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDisplay | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"nourishment" | "restoration" | "mindset" | "relationships" | "vitality">("nourishment");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHero, setIsHero] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      const transformed: ArticleDisplay[] = data.map((article) => ({
        article_id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        featured_image: article.featured_image_url
          ? { url: article.featured_image_url, alt: article.featured_image_alt || "" }
          : null,
        is_featured: article.is_featured,
        published_at: article.published_at,
      }));
      setArticles(transformed);
      setMessage("Articles fetched successfully");
    } catch (error: any) {
      setMessage(`Error fetching articles: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createNewArticle = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setMessage("Please fill in title, slug, and content");
      return;
    }
    setLoading(true);
    try {
      await createArticle({
        slug: slug,
        title: title,
        excerpt: excerpt || null,
        content: content,
        category: category,
        featured_image_url: featuredImageUrl || null,
        featured_image_alt: featuredImageAlt || null,
        is_featured: isFeatured,
        is_hero: isHero,
      });
      setMessage("Article created successfully");
      // Clear form
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCategory("nourishment");
      setFeaturedImageUrl("");
      setFeaturedImageAlt("");
      setIsFeatured(false);
      setIsHero(false);
      fetchArticles();
    } catch (error: any) {
      setMessage(`Error creating article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateExistingArticle = async () => {
    if (!selectedArticle) {
      setMessage("Please select an article to update");
      return;
    }
    if (!selectedArticle.article_id) {
      setMessage("Error: Selected article has no ID. Please select the article again.");
      setSelectedArticle(null);
      return;
    }
    if (!title.trim() || !content.trim()) {
      setMessage("Please fill in title and content");
      return;
    }
    setLoading(true);
    try {
      await updateArticle(selectedArticle.article_id, {
        title: title,
        slug: slug,
        excerpt: excerpt || null,
        content: content,
        category: category,
        featured_image_url: featuredImageUrl || null,
        featured_image_alt: featuredImageAlt || null,
        is_featured: isFeatured,
        is_hero: isHero,
      });
      setMessage("Article updated successfully");
      // Clear form
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCategory("nourishment");
      setFeaturedImageUrl("");
      setFeaturedImageAlt("");
      setIsFeatured(false);
      setIsHero(false);
      setSelectedArticle(null);
      fetchArticles();
    } catch (error: any) {
      setMessage(`Error updating article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setLoading(true);
    try {
      await deleteArticle(id);
      setMessage("Article deleted successfully");
      if (selectedArticle?.article_id === id) {
        setSelectedArticle(null);
        // Clear form
        setTitle("");
        setSlug("");
        setExcerpt("");
        setContent("");
        setCategory("nourishment");
        setFeaturedImageUrl("");
        setFeaturedImageAlt("");
        setIsFeatured(false);
        setIsHero(false);
      }
      fetchArticles();
    } catch (error: any) {
      setMessage(`Error deleting article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectArticle = async (article: ArticleDisplay) => {
    setMessage(`Selected: ${article.title}. Loading full content...`);
    try {
      const fullArticle = await getArticleById(article.article_id);
      // Update the selected article with the full data including article_id
      setSelectedArticle({
        article_id: fullArticle.id,
        slug: fullArticle.slug,
        title: fullArticle.title,
        excerpt: fullArticle.excerpt,
        category: fullArticle.category,
        featured_image: fullArticle.featured_image_url
          ? { url: fullArticle.featured_image_url, alt: fullArticle.featured_image_alt || "" }
          : null,
        is_featured: fullArticle.is_featured,
        published_at: fullArticle.published_at,
      });
      setTitle(fullArticle.title || "");
      setSlug(fullArticle.slug || "");
      setExcerpt(fullArticle.excerpt || "");
      setContent(fullArticle.content || "");
      setCategory(fullArticle.category as any);
      setFeaturedImageUrl(fullArticle.featured_image_url || "");
      setFeaturedImageAlt(fullArticle.featured_image_alt || "");
      setIsFeatured(fullArticle.is_featured || false);
      setIsHero(fullArticle.is_hero || false);
      setMessage(`Loaded: ${fullArticle.title}`);
    } catch (error: any) {
      setMessage(`Error loading article content: ${error.message}`);
    }
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
          <div style={{ flex: 1, maxHeight: "80vh", overflowY: "auto" }}>
            <h2>
              {selectedArticle ? `Editing: ${selectedArticle.title}` : "Create New Article"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title *"
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug (URL-friendly) *"
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Excerpt (short summary)"
                rows={2}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              >
                <option value="nourishment">Nourishment</option>
                <option value="restoration">Restoration</option>
                <option value="mindset">Mindset</option>
                <option value="relationships">Relationships</option>
                <option value="vitality">Vitality</option>
              </select>
              <input
                type="text"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="Featured Image URL"
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Featured Image Alt Text"
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <div style={{ display: "flex", gap: "15px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  Featured Article
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input
                    type="checkbox"
                    checked={isHero}
                    onChange={(e) => setIsHero(e.target.checked)}
                  />
                  Hero Article
                </label>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content (markdown) *"
                rows={12}
                style={{
                  padding: "10px",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              {selectedArticle ? (
                <>
                  <button
                  onClick={updateExistingArticle}
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
                      setTitle("");
                      setSlug("");
                      setExcerpt("");
                      setContent("");
                      setCategory("nourishment");
                      setFeaturedImageUrl("");
                      setFeaturedImageAlt("");
                      setIsFeatured(false);
                      setIsHero(false);
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
                  onClick={createNewArticle}
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
                    key={article.article_id}
                    style={{
                      padding: "15px",
                      marginBottom: "10px",
                      backgroundColor: selectedArticle?.article_id === article.article_id ? "#e3f2fd" : "#f5f5f5",
                      borderRadius: "4px",
                      border: selectedArticle?.article_id === article.article_id ? "2px solid #2196F3" : "1px solid #ddd",
                    }}
                  >
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{article.title}</h3>
                    <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}>
                      Category: {article.category} | Slug: {article.slug}
                    </p>
                    <p style={{ margin: "0 0 10px 0", color: "#888", fontSize: "11px" }}>
                      Published: {new Date(article.published_at).toLocaleString()}
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
                        onClick={() => deleteExistingArticle(article.article_id)}
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
