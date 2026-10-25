"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

const sampleStandings = [
  { pos: 1, club: "Arsenal", code: "ARS", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  { pos: 2, club: "Manchester City", code: "MCI", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  { pos: 3, club: "Liverpool", code: "LIV", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  { pos: 4, club: "Chelsea", code: "CHE", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  { pos: 5, club: "Aston Villa", code: "AVL", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  { pos: 6, club: "Tottenham", code: "TOT", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  { pos: 7, club: "Manchester United", code: "MUN", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  { pos: 8, club: "Newcastle United", code: "NEW", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
];

const sampleScorers = [
  { name: "Erling Haaland", club: "Manchester City", goals: "—" },
  { name: "Mohamed Salah", club: "Liverpool", goals: "—" },
  { name: "Bukayo Saka", club: "Arsenal", goals: "—" },
  { name: "Cole Palmer", club: "Chelsea", goals: "—" },
  { name: "Alexander Isak", club: "Newcastle United", goals: "—" },
];

export default function PremierLeaguePage() {
  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, slug, excerpt, image_url, category, league, published_at")
          .eq("status", "published")
          .eq("league", "Premier League")
          .order("published_at", { ascending: false })
          .limit(3);

        if (error) throw error;

        setArticles(data || []);
      } catch (error) {
        console.error("Error loading Premier League news:", error);
        setNewsError(true);
      } finally {
        setNewsLoading(false);
      }
    }

    fetchNews();
  }, []);

  const formatDate = (date) => {
    if (!date) return "LATEST NEWS";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="pl-page">
      <section className="pl-hero">
        <div className="pl-hero-content">
          <span className="pl-kicker">
            <span className="pl-live-dot" />
            DRIBBLE. / LEAGUES
          </span>

          <p className="pl-season">ENGLISH FOOTBALL</p>

          <h1>
            PREMIER
            <br />
            <span>LEAGUE.</span>
          </h1>

          <p className="pl-hero-description">
            The biggest stories, the fiercest rivalries, and everything
            happening in English football — all in one place.
          </p>

          <a href="#pl-standings" className="pl-button">
            EXPLORE THE LEAGUE <span>↘</span>
          </a>
        </div>

        <div className="pl-hero-mark" aria-hidden="true">
          <span>PL</span>
          <div />
          <small>THE GAME NEVER STOPS.</small>
        </div>
      </section>

      <section className="pl-section" id="pl-standings">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">THE TABLE</p>
            <h2>LEAGUE <span>STANDINGS</span></h2>
          </div>

          <span className="pl-demo-label">DEMO DATA</span>
        </div>

        <p className="pl-notice">
          Standings will update when we connect the football data API.
        </p>

        <div className="pl-table-wrap">
          <table className="pl-table">
            <thead>
              <tr>
                <th className="pl-position">#</th>
                <th>CLUB</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>PTS</th>
              </tr>
            </thead>

            <tbody>
              {sampleStandings.map((team) => (
                <tr key={team.code}>
                  <td className="pl-position">{team.pos}</td>
                  <td>
                    <div className="pl-club">
                      <span className="pl-club-badge">{team.code}</span>
                      <span>{team.club}</span>
                    </div>
                  </td>
                  <td>{team.p}</td>
                  <td>{team.w}</td>
                  <td>{team.d}</td>
                  <td>{team.l}</td>
                  <td>{team.gf}</td>
                  <td>{team.ga}</td>
                  <td>{team.gf - team.ga}</td>
                  <td className="pl-points">{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="pl-table-footnote">
          Illustrative rows only — this is not the official league table.
        </p>
      </section>

      <section className="pl-section pl-scorers-section">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">IN FRONT OF GOAL</p>
            <h2>TOP <span>SCORERS</span></h2>
          </div>

          <span className="pl-demo-label">DEMO DATA</span>
        </div>

        <div className="pl-scorers-list">
          {sampleScorers.map((player, index) => (
            <div className="pl-scorer" key={player.name}>
              <span className="pl-scorer-rank">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="pl-scorer-info">
                <h3>{player.name}</h3>
                <p>{player.club}</p>
              </div>

              <span className="pl-scorer-goals">{player.goals}</span>
            </div>
          ))}
        </div>

        <p className="pl-table-footnote">
          Goal totals will appear after the football API is connected.
        </p>
      </section>

      <section className="pl-section pl-news-section">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">STRAIGHT FROM THE NEWSROOM</p>
            <h2>PREMIER LEAGUE <span>NEWS</span></h2>
          </div>

          <Link href="/news" className="pl-text-link">
            ALL NEWS <span>↗</span>
          </Link>
        </div>

        {newsLoading ? (
          <p className="pl-news-message">LOADING THE LATEST STORIES...</p>
        ) : newsError ? (
          <p className="pl-news-message">
            Couldn't load news right now. Please try again later.
          </p>
        ) : articles.length === 0 ? (
          <div className="pl-empty-news">
            <span>01 / NEWSROOM</span>
            <h3>THE NEXT BIG STORY STARTS HERE.</h3>
            <p>
              Published Premier League articles from your DRIBBLE. newsroom
              will appear here.
            </p>
            <Link href="/admin" className="pl-button">
              OPEN NEWSROOM <span>↗</span>
            </Link>
          </div>
        ) : (
          <div className="pl-news-grid">
            {articles.map((article, index) => (
              <Link
                href={`/news/${article.slug}`}
                className="pl-news-card"
                key={article.id}
              >
                <div className="pl-news-image">
                  {article.image_url ? (
                    <img src={article.image_url} alt="" />
                  ) : (
                    <div className="pl-image-placeholder">DRIBBLE.</div>
                  )}

                  <span className="pl-news-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="pl-news-meta">
                  <span>{article.category || "FOOTBALL"}</span>
                  <span>{formatDate(article.published_at)}</span>
                </div>

                <h3>{article.title}</h3>

                {article.excerpt && <p>{article.excerpt}</p>}

                <span className="pl-read-more">
                  READ STORY <span>↗</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="pl-bottom-banner">
        <p>DRIBBLE. / THE GAME NEVER STOPS.</p>
        <h2>MORE THAN <span>90 MINUTES.</span></h2>
        <Link href="/fixtures/premier-league" className="pl-button">
          EXPLORE FIXTURES <span>↗</span>
        </Link>
      </section>
    </main>
  );
}

