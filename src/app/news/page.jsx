"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

const page = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(
          "id, title, slug, excerpt, image_url, category, league, published_at"
        )
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error.message);
      } else {
        setArticles(data || []);
      }

      setLoading(false);
    };

    fetchArticles();
  }, []);

  const categories = [
    "All",
    "Football",
    "Transfers",
    "Premier League",
    "La Liga",
    "Champions League",
    "Serie A",
  ];

  const filteredArticles =
    category === "All"
      ? articles
      : articles.filter(
          (article) =>
            article.category === category ||
            article.league === category
        );

  return (
    <main className="dr-news-page">
      <section className="dr-news-heading">
        <p className="dr-eyebrow">THE LATEST FROM THE GAME</p>
        <h1>FOOTBALL <span>NEWS.</span></h1>
        <p>Breaking stories, big moves and everything football.</p>
      </section>

      <section className="dr-news-content">
        <div className="dr-news-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="dr-news-message">Loading the latest news...</p>
        ) : filteredArticles.length === 0 ? (
          <div className="dr-news-empty">
            <h2>NO STORIES YET.</h2>
            <p>
              The next big story is on its way. Check back soon.
            </p>
          </div>
        ) : (
          <div className="dr-news-grid">
            {filteredArticles.map((article) => (
              <Link
                href={`/news/${article.slug}`}
                className="dr-news-card"
                key={article.id}
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                  />
                ) : (
                  <div className="dr-news-image-placeholder">
                    DRIBBLE.
                  </div>
                )}

                <div className="dr-news-card-body">
                  <p className="dr-news-category">
                    {article.league || article.category}
                  </p>
                  <h2>{article.title}</h2>
                  <p className="dr-news-excerpt">
                    {article.excerpt}
                  </p>
                  <span className="dr-read-more">
                    READ STORY ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default page;

