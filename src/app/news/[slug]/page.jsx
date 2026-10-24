"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

function StoryContent() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(false);

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error || !data) {
        console.error("Error fetching article:", error?.message);
        setError(true);
      } else {
        setArticle(data);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="dr-story-message">
        Loading story...
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="dr-story-message">
        <h1>STORY NOT FOUND.</h1>
        <p>This story may have been removed or is not published.</p>
        <Link href="/news" className="dr-story-back">
          ← BACK TO NEWS
        </Link>
      </main>
    );
  }

  const content =
    article.content ||
    article.body ||
    article.article_content ||
    article.excerpt ||
    "";

  return (
    <main className="dr-story-page">
      <div className="dr-story-container">
        <Link href="/news" className="dr-story-back">
          ← BACK TO NEWS
        </Link>

        <header className="dr-story-header">
          <p className="dr-story-category">
            {article.league || article.category || "FOOTBALL"}
          </p>

          <h1>{article.title}</h1>

          {article.excerpt && (
            <p className="dr-story-excerpt">{article.excerpt}</p>
          )}

          {article.published_at && (
            <p className="dr-story-date">
              {new Date(article.published_at).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          )}
        </header>

        {article.image_url && (
          <div className="dr-story-image">
            <img src={article.image_url} alt={article.title} />
          </div>
        )}

        <article className="dr-story-content">
          {content.split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index}>{paragraph}</p>
            ) : null
          )}
        </article>

        <Link href="/news" className="dr-story-bottom-link">
          ← MORE FOOTBALL NEWS
        </Link>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="dr-story-message">
          Loading story...
        </main>
      }
    >
      <StoryContent />
    </Suspense>
  );
}

