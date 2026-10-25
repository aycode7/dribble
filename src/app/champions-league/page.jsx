"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

const standings = [
{ pos: 1, name: "Paris Saint-Germain", short: "PSG", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 2, name: "Real Madrid", short: "RMA", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 3, name: "Manchester City", short: "MCI", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 4, name: "Bayern Munich", short: "FCB", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 5, name: "Arsenal", short: "ARS", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 6, name: "Barcelona", short: "BAR", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 7, name: "Liverpool", short: "LIV", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
{ pos: 8, name: "Inter Milan", short: "INT", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", pts: "—" },
];

const scorers = [
{ name: "Kylian Mbappé", club: "Real Madrid", goals: "—" },
{ name: "Erling Haaland", club: "Manchester City", goals: "—" },
{ name: "Harry Kane", club: "Bayern Munich", goals: "—" },
{ name: "Vinícius Júnior", club: "Real Madrid", goals: "—" },
{ name: "Mohamed Salah", club: "Liverpool", goals: "—" },
];

export default function ChampionsLeague() {
const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function fetchArticles() {
const { data, error } = await supabase
.from("articles")
.select("*")
.eq("league", "Champions League")
.eq("status", "published")
.order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching Champions League news:", error);
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
EUROPEAN CLUB FOOTBALL
</div>

      <p className="pl-season">2026/27 SEASON</p>

      <h1>
        CHAMPIONS <span>LEAGUE.</span>
      </h1>

      <p className="pl-hero-description">
        Europe's biggest clubs. The brightest stars. The road to glory.
        Every story from the biggest stage in club football.
      </p>

      <Link href="/fixtures/champions-league" className="pl-button">
        EXPLORE FIXTURES <span>→</span>
      </Link>
    </div>

    <div className="pl-hero-mark">
      <span>UCL</span>
      <div />
      <small>EUROPE • ONE DREAM</small>
    </div>
  </section>

  <section className="pl-section">
    <div className="pl-section-heading">
      <div>
        <p className="pl-eyebrow">THE LEAGUE PHASE</p>
        <h2>League <span>Standings.</span></h2>
      </div>
      <span className="pl-demo-label">LIVE DATA NOT CONNECTED</span>
    </div>

    <p className="pl-notice">
      The 2026/27 league phase features 36 clubs. These eight rows are
      placeholders until the official live standings are connected.
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
      Positions shown are display placeholders, not the official current standings.
    </p>
  </section>

  <section className="pl-section pl-scorers-section">
    <div className="pl-section-heading">
      <div>
        <p className="pl-eyebrow">EUROPE'S ELITE</p>
        <h2>Top <span>Scorers.</span></h2>
      </div>
      <span className="pl-demo-label">STATS UNAVAILABLE</span>
    </div>

    <p className="pl-notice">
      Champions League goal totals will appear when live player statistics are connected.
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

  <section
    className="pl-section pl-news-section"
    id="champions-league-news"
  >
    <div className="pl-section-heading">
      <div>
        <p className="pl-eyebrow">ACROSS EUROPE</p>
        <h2>Champions League <span>Newsroom.</span></h2>
      </div>
      <Link href="/news" className="pl-text-link">
        ALL NEWS <span>→</span>
      </Link>
    </div>

    {loading ? (
      <div className="pl-news-message">
        Loading Champions League stories...
      </div>
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
                <div className="pl-image-placeholder">UCL</div>
              )}
              <span className="pl-news-number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="pl-news-meta">
              <span>{article.category || "CHAMPIONS LEAGUE"}</span>
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
        <span>THE CHAMPIONS LEAGUE NEWSROOM</span>
        <h3>No stories published yet.</h3>
        <p>
          Publish an article with its league set to "Champions League"
          in your newsroom and it will appear here automatically.
        </p>
        <Link href="/news" className="pl-button">
          EXPLORE ALL NEWS <span>→</span>
        </Link>
      </div>
    )}
  </section>

  <section className="pl-bottom-banner">
    <p className="pl-eyebrow">THE GAME NEVER STOPS</p>
    <h2>One continent. <span>One dream.</span></h2>
    <p>THE BIGGEST NIGHTS. THE BIGGEST STAGE.</p>
    <Link href="/fixtures/champions-league" className="pl-button">
      VIEW FIXTURES <span>→</span>
    </Link>
  </section>
</main>

);
}
