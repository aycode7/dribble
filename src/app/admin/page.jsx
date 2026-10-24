"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

const categories = [
  "Football",
  "Transfers",
  "Premier League",
  "La Liga",
  "Champions League",
  "Serie A",
];

const createEmptyArticle = () => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  category: "Football",
  league: "",
});

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const page = () => {
  const router = useRouter();

  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(createEmptyArticle());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadArticles = useCallback(async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    setArticles(data || []);
  }, []);

  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
          router.replace("/admin/login");
          return;
        }

        const { data: isAdmin, error: adminError } =
          await supabase.rpc("is_admin");

        if (adminError) throw adminError;

        if (!isAdmin) {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        if (active) {
          await loadArticles();
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load the dashboard.");
        }
      } finally {
        if (active) {
          setLoading(false);
          setCheckingAuth(false);
        }
      }
    };

    checkAdmin();

    return () => {
      active = false;
    };
  }, [router, loadArticles]);

  const updateField = (field, value) => {
    setArticle((current) => {
      const updated = { ...current, [field]: value };

      if (field === "title" && !editingId) {
        updated.slug = slugify(value);
      }

      return updated;
    });
  };

  const resetForm = () => {
    setArticle(createEmptyArticle());
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!article.title.trim() || !article.content.trim()) {
      setError("Title and article content are required.");
      return;
    }

    const finalSlug = slugify(article.slug);

    if (!finalSlug) {
      setError("Enter a valid article title or slug.");
      return;
    }

    setSaving(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!sessionData.session) {
        router.replace("/admin/login");
        return;
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_admin");

      if (adminError) throw adminError;

      if (!isAdmin) {
        throw new Error("You do not have admin permission.");
      }

      const { data: existing, error: existingError } =
        await supabase
          .from("articles")
          .select("id, published_at")
          .eq("slug", finalSlug)
          .maybeSingle();

      if (existingError) throw existingError;

      if (existing && existing.id !== editingId) {
        throw new Error(
          "That slug is already in use. Choose a different one."
        );
      }

      const existingArticle = editingId
        ? articles.find((item) => item.id === editingId)
        : null;

      const status = article.status || "draft";

      const publishedAt =
        status === "published"
          ? existingArticle?.published_at ||
            new Date().toISOString()
          : null;

      const payload = {
        title: article.title.trim(),
        slug: finalSlug,
        excerpt: article.excerpt.trim() || null,
        content: article.content.trim(),
        image_url: article.image_url.trim() || null,
        category: article.category,
        league: article.league.trim() || null,
        status,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setSuccess("Article updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("articles")
          .insert([payload]);

        if (insertError) throw insertError;

        setSuccess(
          status === "published"
            ? "Article published successfully."
            : "Draft saved successfully."
        );
      }

      await loadArticles();
      setArticle(createEmptyArticle());
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setArticle({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      image_url: item.image_url || "",
      category: item.category || "Football",
      league: item.league || "",
      status: item.status || "draft",
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      if (editingId === item.id) resetForm();

      await loadArticles();
      setSuccess("Article deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete article.");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/admin/login");
  };

  const filteredArticles = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading || checkingAuth) {
    return (
      <main className="admin-loading">
        <p>LOADING DRIBBLE. NEWSROOM...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <Link href="/" className="admin-logo">
          DRIBBLE<span>.</span>
        </Link>

        <div className="admin-header-actions">
          <span>NEWSROOM ADMIN</span>
          <button type="button" onClick={handleLogout}>
            LOG OUT ↗
          </button>
        </div>
      </header>

      <section className="admin-welcome">
        <div>
          <p className="admin-eyebrow">THE GAME NEVER STOPS.</p>
          <h1>Newsroom Dashboard</h1>
          <p>Manage your stories. Keep the football world talking.</p>
        </div>

        <Link href="/news" className="admin-view-news">
          VIEW NEWSROOM ↗
        </Link>
      </section>

      <section className="admin-stats">
        <div className="admin-stat">
          <span>TOTAL ARTICLES</span>
          <strong>{articles.length}</strong>
        </div>

        <div className="admin-stat">
          <span>PUBLISHED</span>
          <strong>
            {articles.filter((item) => item.status === "published").length}
          </strong>
        </div>

        <div className="admin-stat">
          <span>DRAFTS</span>
          <strong>
            {articles.filter((item) => item.status === "draft").length}
          </strong>
        </div>
      </section>

      <section className="admin-editor-section">
        <div className="admin-section-heading">
          <div>
            <p className="admin-eyebrow">
              {editingId ? "UPDATE STORY" : "CONTENT MANAGEMENT"}
            </p>
            <h2>{editingId ? "Edit Article" : "Write a Story"}</h2>
          </div>

          {editingId && (
            <button
              type="button"
              className="admin-cancel-edit"
              onClick={resetForm}
            >
              CANCEL EDITING
            </button>
          )}
        </div>

        <form className="admin-article-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="article-title">Article title *</label>
              <input
                id="article-title"
                value={article.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Arsenal prepare for crucial weekend clash"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="article-slug">Article URL slug *</label>
              <input
                id="article-slug"
                value={article.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="arsenal-weekend-clash"
                required
              />
              <small>
                Your article URL: /news/{slugify(article.slug) || "..."}
              </small>
            </div>

            <div className="admin-field admin-full-field">
              <label htmlFor="article-excerpt">Short description</label>
              <textarea
                id="article-excerpt"
                value={article.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Give readers a quick preview of the story..."
                rows={3}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="article-category">Category *</label>
              <select
                id="article-category"
                value={article.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="article-league">League (optional)</label>
              <input
                id="article-league"
                value={article.league}
                onChange={(e) => updateField("league", e.target.value)}
                placeholder="e.g. Premier League"
              />
            </div>

            <div className="admin-field admin-full-field">
              <label htmlFor="article-image">Image URL</label>
              <input
                id="article-image"
                type="url"
                value={article.image_url}
                onChange={(e) => updateField("image_url", e.target.value)}
                placeholder="https://example.com/football-image.jpg"
              />
              <small>Use a direct link to an online image.</small>
            </div>

            <div className="admin-field admin-full-field">
              <label htmlFor="article-content">Full article content *</label>
              <textarea
                id="article-content"
                className="admin-content-input"
                value={article.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Write your complete football story here..."
                rows={12}
                required
              />
              <small>
                Plain text for now. Separate paragraphs with blank lines.
              </small>
            </div>
          </div>

          {error && <p className="admin-message admin-error">{error}</p>}
          {success && (
            <p className="admin-message admin-success">{success}</p>
          )}

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-draft-button"
              disabled={saving}
              onClick={() => {
                setArticle((current) => ({
                  ...current,
                  status: "draft",
                }));

                document
                  .getElementById("admin-save-draft")
                  ?.click();
              }}
            >
              SAVE AS DRAFT
            </button>

            <button
              id="admin-save-draft"
              type="submit"
              className="admin-hidden-submit"
              hidden
            >
              Save draft
            </button>

            <button
              type="submit"
              className="admin-publish-button"
              disabled={saving}
              onClick={() => {
                setArticle((current) => ({
                  ...current,
                  status: "published",
                }));
              }}
            >
              {saving
                ? "SAVING..."
                : editingId
                  ? "UPDATE ARTICLE →"
                  : "PUBLISH STORY →"}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-articles-section">
        <div className="admin-section-heading">
          <div>
            <p className="admin-eyebrow">YOUR CONTENT</p>
            <h2>Manage Articles</h2>
          </div>
        </div>

        <div className="admin-article-tools">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter articles by status"
          >
            <option value="all">All articles</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="admin-empty">
            <h3>NO STORIES FOUND.</h3>
            <p>Your articles will appear here once you save them.</p>
          </div>
        ) : (
          <div className="admin-article-list">
            {filteredArticles.map((item) => (
              <article className="admin-article-row" key={item.id}>
                <div className="admin-article-info">
                  <span
                    className={`admin-status ${
                      item.status === "published"
                        ? "status-published"
                        : "status-draft"
                    }`}
                  >
                    {item.status}
                  </span>

                  <h3>{item.title}</h3>

                  <p>
                    {item.category}
                    {item.league ? ` · ${item.league}` : ""}
                    {" · "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="admin-article-actions">
                  {item.status === "published" && (
                    <Link
                      href={`/news/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      VIEW ↗
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDelete(item)}
                  >
                    DELETE
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default page;
