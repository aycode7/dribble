"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

const standings = [
{ pos: 1, name: "Bayern Munich", short: "FCB", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 2, name: "Borussia Dortmund", short: "BVB", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 3, name: "Bayer Leverkusen", short: "B04", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 4, name: "RB Leipzig", short: "RBL", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 5, name: "Eintracht Frankfurt", short: "SGE", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 6, name: "VfB Stuttgart", short: "VFB", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 7, name: "SC Freiburg", short: "SCF", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 8, name: "Werder Bremen", short: "SVW", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
];

const scorers = [
{ name: "Harry Kane", club: "Bayern Munich", goals: "—" },
{ name: "Serhou Guirassy", club: "Borussia Dortmund", goals: "—" },
{ name: "Florian Wirtz", club: "Bayer Leverkusen", goals: "—" },
{ name: "Loïs Openda", club: "RB Leipzig", goals: "—" },
{ name: "Deniz Undav", club: "VfB Stuttgart", goals: "—" },
];

export default function Bundesliga() {
const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function fetchArticles() {
const { data, error } = await supabase
.from("articles")
.select("*")
.eq("league", "Bundesliga")
.eq("status", "published")
.order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching Bundesliga news:", error);
    setArticles([]);
  } else {
    setArticles(data || []);
  }

  setLoading(false);
}

fetchArticles();

}, []);

return (
<main className="pl-page">
<section className="pl-hero">
<div className="pl-hero-content">
<div className="pl-kicker">
<span className="pl-live-dot" />
GERMAN FOOTBALL
</div>

      <p className="pl-season">2026/27 SEASON</p>

      <h1>
        BUNDES<span>LIGA.</span>
      </h1>

      <p className="pl-hero-description">
        Electric atmospheres. Relentless football. Legendary clubs.
        Everything happening across Germany's top flight.
      </p>

      <Link href="/fixtures/bundesliga" className="pl-button">
        EXPLORE FIXTURES <span>→</span>
      </Link>
    </div>

    <div className="pl-hero-mark">
      <span>B</span>
      <div />
      <small>FUSSBALL • DEUTSCHLAND</small>
    </div>
  </section>

  <section className="pl-section">
    <div className="pl-section-heading">
      <div>
        <p className="pl-eyebrow">THE TABLE</p>
        <h2>League <span>Standings.</span></h2>
      </div>
      <span className="pl-demo-label">LIVE DATA NOT CONNECTED</span>
    </div>

    <p className="pl-notice">
      League positions and statistics will update when a live football data API is connected.
    </p>

    <div className="pl-table-wrap">
      <table className="pl-table">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ textAlign: "left" }}>CLUB</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((club) => (
            <tr key={club.short}>
              <td className="pl-position">{club.pos}</td>
              <td>
                <div className="pl-club">
                  <span className="pl-club-badge">{club.short}</span>
                  {club.name}
                </div>
              </td>
              <td>{club.played}</td>
              <td>{club.won}</td>
              <td>{club.drawn}</td>
              <td>{club.lost}</td>
              <td>{club.gd}</td>
              <td className="pl-points">{club.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="pl-table-footnote">
      Positions shown are display placeholders, not the current official table.
    </p>
  </section>

  <section className="pl-section pl-scorers-section">
    <div className="pl-section-heading">
      <div>
        <p className="pl-eyebrow">THE GOLDEN BOOT RACE</p>
        <h2>Top <span>Scorers.</span></h2>
      </div>
      <span className="pl-demo-label">STATS UNAVAILABLE</span>
    </div>

    <p className="pl-notice">
      Goal totals will appear once live player statistics are connected.
    </p>

    <div className="pl-scorers-list">
      {scorers.map((player, index) => (
        <article className="pl-scorer" key={player.name}>
          <span className="pl-scorer-rank">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="pl-scorer-info">
            <h3>{player.name}</h3>
            <p>{player.club}</p>
          </div>
          <span className="pl-scorer-goals">{player.goals}</span>
        </article>
      ))}
    </div>
  </section>

  <section className="pl-section pl-news-section" id="bundesliga-news">
    <div className="pl-section-heading">
      <div>
        <p className="pl-eyebrow">LATEST STORIES</p>
        <h2>Bundesliga <span>Newsroom.</span></h2>
      </div>
      <Link href="/news" className="pl-text-link">
        ALL NEWS <span>→</span>
      </Link>
    </div>

    {loading ? (
      <div className="pl-news-message">Loading Bundesliga stories...</div>
    ) : articles.length > 0 ? (
      <div className="pl-news-grid">
        {articles.map((article, index) => (
          <Link
            href={`/news/${article.slug}`}
            className="pl-news-card"
            key={article.id}
          >
            <div className="pl-news-image">
              {article.image_url ? (
                <img src={article.image_url} alt={article.title} />
              ) : (
                <div className="pl-image-placeholder">BUNDESLIGA</div>
              )}
              <span className="pl-news-number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="pl-news-meta">
              <span>{article.category || "BUNDESLIGA"}</span>
              <span>
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString()
                  : "LATEST"}
              </span>
            </div>

            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>

            <span className="pl-read-more">
              READ STORY <span>→</span>
            </span>
          </Link>
        ))}
      </div>
    ) : (
      <div className="pl-empty-news">
        <span>THE BUNDESLIGA NEWSROOM</span>
        <h3>No stories published yet.</h3>
        <p>
          Publish an article with its league set to "Bundesliga" in your
          newsroom and it will appear here automatically.
        </p>
        <Link href="/news" className="pl-button">
          EXPLORE ALL NEWS <span>→</span>
        </Link>
      </div>
    )}
  </section>

  <section className="pl-bottom-banner">
    <p className="pl-eyebrow">THE GAME NEVER STOPS</p>
    <h2>German football. <span>Unfiltered.</span></h2>
    <p>THE STORIES. THE RIVALRIES. THE GAME.</p>
    <Link href="/fixtures/bundesliga" className="pl-button">
      VIEW FIXTURES <span>→</span>
    </Link>
  </section>
</main>

);
}



