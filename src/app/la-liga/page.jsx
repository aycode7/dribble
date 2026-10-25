"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

const sampleStandings = [
  { position: 1, club: "Real Madrid", badge: "RMA", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
  { position: 2, club: "Barcelona", badge: "BAR", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
  { position: 3, club: "Atletico Madrid", badge: "ATM", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
  { position: 4, club: "Athletic Club", badge: "ATH", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
  { position: 5, club: "Real Sociedad", badge: "RSO", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
  { position: 6, club: "Villarreal", badge: "VIL", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
  { position: 7, club: "Real Betis", badge: "BET", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
  { position: 8, club: "Sevilla", badge: "SEV", played: "—", won: "—", drawn: "—", lost: "—", gd: "—", points: "—" },
];

const sampleScorers = [
  { rank: "01", name: "Kylian Mbappé", club: "Real Madrid", goals: "—" },
  { rank: "02", name: "Robert Lewandowski", club: "Barcelona", goals: "—" },
  { rank: "03", name: "Raphinha", club: "Barcelona", goals: "—" },
  { rank: "04", name: "Antoine Griezmann", club: "Atletico Madrid", goals: "—" },
  { rank: "05", name: "Vinícius Júnior", club: "Real Madrid", goals: "—" },
];

export default function LaLigaPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select(
          "id, title, slug, excerpt, image_url, category, league, published_at"
        )
        .eq("status", "published")
        .eq("league", "La Liga")
        .order("published_at", { ascending: false })
        .limit(3);

      if (!error) setArticles(data || []);
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
            DRIBBLE. LEAGUE CENTRE
          </div>

          <p className="pl-season">SPAIN'S TOP FLIGHT</p>

          <h1>
            LA <span>LIGA.</span>
          </h1>

          <p className="pl-hero-description">
            From El Clásico to the race for the title, follow the stories,
            clubs and players shaping Spanish football.
          </p>

          <Link href="/fixtures/la-liga" className="pl-button">
            EXPLORE FIXTURES <span>↗</span>
          </Link>
        </div>

        <div className="pl-hero-mark">
          <span>LL</span>
          <div />
          <small>THE GAME NEVER STOPS.</small>
        </div>
      </section>

      <section className="pl-section">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">THE RACE</p>
            <h2>LEAGUE <span>STANDINGS.</span></h2>
          </div>
          <span className="pl-demo-label">STANDINGS DATA UNAVAILABLE</span>
        </div>

        <p className="pl-notice">
          The table below is a layout preview. Official standings will appear
          here when live league data is connected.
        </p>

        <div className="pl-table-wrap">
          <table className="pl-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>CLUB</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GD</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              {sampleStandings.map((team) => (
                <tr key={team.position}>
                  <td className="pl-position">
                    {String(team.position).padStart(2, "0")}
                  </td>
                  <td>
                    <div className="pl-club">
                      <span className="pl-club-badge">{team.badge}</span>
                      {team.club}
                    </div>
                  </td>
                  <td>{team.played}</td>
                  <td>{team.won}</td>
                  <td>{team.drawn}</td>
                  <td>{team.lost}</td>
                  <td>{team.gd}</td>
                  <td className="pl-points">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="pl-table-footnote">
          MP: Matches played · GD: Goal difference · PTS: Points
        </p>
      </section>

      <section className="pl-section pl-scorers-section">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">THE FINISHERS</p>
            <h2>TOP <span>SCORERS.</span></h2>
          </div>
          <span className="pl-demo-label">LIVE DATA NOT CONNECTED</span>
        </div>

        <p className="pl-notice">
          Scorer statistics will be populated once the football data API is
          connected.
        </p>

        <div className="pl-scorers-list">
          {sampleScorers.map((player) => (
            <div className="pl-scorer" key={player.rank}>
              <span className="pl-scorer-rank">{player.rank}</span>
              <div className="pl-scorer-info">
                <h3>{player.name}</h3>
                <p>{player.club}</p>
              </div>
              <span className="pl-scorer-goals">{player.goals}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pl-section pl-news-section">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">LATEST STORIES</p>
            <h2>LA LIGA <span>NEWS.</span></h2>
          </div>
          <Link href="/news" className="pl-text-link">
            ALL STORIES <span>↗</span>
          </Link>
        </div>

        {loading ? (
          <div className="pl-news-message">LOADING THE LATEST STORIES...</div>
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
                    <div className="pl-image-placeholder">DRIBBLE.</div>
                  )}
                  <span className="pl-news-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="pl-news-meta">
                  <span>{article.category || "LA LIGA"}</span>
                  <span>
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <h3>{article.title}</h3>
                <p>{article.excerpt || "Read the latest story from La Liga."}</p>

                <span className="pl-read-more">
                  READ STORY <span>↗</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="pl-empty-news">
            <span>THE NEWSROOM</span>
            <h3>THE NEXT BIG STORY STARTS HERE.</h3>
            <p>
              {errorMessage(loading)}
              Publish an article with its league set to “La Liga” to feature it
              here.
            </p>
            <Link href="/news" className="pl-button">
              EXPLORE NEWS <span>↗</span>
            </Link>
          </div>
        )}
      </section>

      <section className="pl-bottom-banner">
        <p>DRIBBLE. — THE GAME NEVER STOPS.</p>
        <h2>
          THIS IS <span>LA LIGA.</span>
        </h2>
        <Link href="/fixtures/la-liga" className="pl-button">
          VIEW FIXTURES <span>↗</span>
        </Link>
      </section>
    </main>
  );
}

function errorMessage() {
  return "No published La Liga stories yet. ";
}
