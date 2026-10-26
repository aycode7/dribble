"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

const PremierLeaguePage = () => {
  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(false);

  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [footballLoading, setFootballLoading] = useState(true);
  const [footballError, setFootballError] = useState("");
  const [matchesError, setMatchesError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function getFootballData(view) {
      const response = await fetch(
        `/api/football?league=premier-league&view=${view}`
      );

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error(`Empty API response (HTTP ${response.status}).`);
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("The football API returned invalid JSON.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load football data.");
      }

      return data;
    }

    async function fetchFootballData() {
      try {
        const results = await Promise.allSettled([
          getFootballData("standings"),
          getFootballData("matches"),
        ]);

        if (cancelled) return;

        const [standingsResult, matchesResult] = results;

        if (standingsResult.status === "fulfilled") {
          setStandings(
            Array.isArray(standingsResult.value.standings)
              ? standingsResult.value.standings
              : []
          );
          setFootballError("");
        } else {
          console.error(
            "Error loading Premier League standings:",
            standingsResult.reason
          );
          setFootballError(
            standingsResult.reason?.message ||
              "Unable to load league standings."
          );
        }

        if (matchesResult.status === "fulfilled") {
          setMatches(
            Array.isArray(matchesResult.value.matches)
              ? matchesResult.value.matches
              : []
          );
          setMatchesError("");
        } else {
          console.error(
            "Error loading Premier League matches:",
            matchesResult.reason
          );
          setMatchesError(
            matchesResult.reason?.message ||
              "Unable to load fixtures and results."
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error loading football data:", error);
          setFootballError(
            error.message || "Football data is unavailable."
          );
        }
      } finally {
        if (!cancelled) setFootballLoading(false);
      }
    }

    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select(
            "id, title, slug, excerpt, image_url, category, league, published_at"
          )
          .eq("status", "published")
          .eq("league", "Premier League")
          .order("published_at", { ascending: false })
          .limit(3);

        if (error) throw error;

        if (!cancelled) setArticles(data || []);
      } catch (error) {
        console.error("Error loading Premier League news:", error);
        if (!cancelled) setNewsError(true);
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    }

    fetchFootballData();
    fetchNews();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "LATEST NEWS";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatMatchDate = (date) => {
    if (!date) return "Date TBC";

    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const finishedMatches = matches
    .filter((match) => match.status === "FINISHED")
    .sort(
      (a, b) =>
        new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
    )
    .slice(0, 5);

  const upcomingMatches = matches
    .filter((match) =>
      ["SCHEDULED", "TIMED"].includes(match.status)
    )
    .sort(
      (a, b) =>
        new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    )
    .slice(0, 5);

  const renderMatch = (match, index, isFinished) => {
    const homeScore = match.score?.fullTime?.home;
    const awayScore = match.score?.fullTime?.away;

    return (
      <div className="pl-scorer pl-match-row" key={match.id}>
        <span className="pl-scorer-rank">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="pl-match-date">
          <span>{formatMatchDate(match.utcDate)}</span>
          <small>
            {match.matchday ? `MATCHDAY ${match.matchday}` : "PREMIER LEAGUE"}
          </small>
        </div>

        <div className="pl-match-teams">
          <div className="pl-match-team">
            {match.homeTeam?.crest ? (
              <img
                src={match.homeTeam.crest}
                alt=""
                loading="lazy"
              />
            ) : null}
            <span>{match.homeTeam?.shortName || match.homeTeam?.name || "Home"}</span>
          </div>

          <div className="pl-match-team">
            {match.awayTeam?.crest ? (
              <img
                src={match.awayTeam.crest}
                alt=""
                loading="lazy"
              />
            ) : null}
            <span>{match.awayTeam?.shortName || match.awayTeam?.name || "Away"}</span>
          </div>
        </div>

        <div className="pl-match-score">
          {isFinished ? (
            <>
              <span>{homeScore ?? "—"}</span>
              <span className="pl-match-score-divider">:</span>
              <span>{awayScore ?? "—"}</span>
            </>
          ) : (
            <span className="pl-match-vs">VS</span>
          )}
        </div>
      </div>
    );
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
            <h2>
              LEAGUE <span>STANDINGS</span>
            </h2>
          </div>

          <span className="pl-demo-label">
            {footballLoading
              ? "LOADING"
              : footballError
                ? "UNAVAILABLE"
                : standings.length
                  ? "LIVE DATA"
                  : "NO DATA"}
          </span>
        </div>

        {footballError && <p className="pl-notice">{footballError}</p>}

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
              {footballLoading ? (
                <tr>
                  <td colSpan={10}>LOADING LEAGUE STANDINGS...</td>
                </tr>
              ) : standings.length ? (
                standings.map((team) => (
                  <tr key={team.team.id}>
                    <td className="pl-position">{team.position}</td>

                    <td>
                      <div className="pl-club">
                        {team.team.crest ? (
                          <img
                            className="pl-team-crest"
                            src={team.team.crest}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <span className="pl-club-badge">
                            {team.team.tla ||
                              team.team.name?.slice(0, 3).toUpperCase()}
                          </span>
                        )}

                        <span>{team.team.name}</span>
                      </div>
                    </td>

                    <td>{team.playedGames ?? 0}</td>
                    <td>{team.won ?? 0}</td>
                    <td>{team.draw ?? 0}</td>
                    <td>{team.lost ?? 0}</td>
                    <td>{team.goalsFor ?? 0}</td>
                    <td>{team.goalsAgainst ?? 0}</td>
                    <td>{team.goalDifference ?? 0}</td>
                    <td className="pl-points">{team.points ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10}>
                    No standings available for this season yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="pl-table-footnote">
          Standings provided by football-data.org. Data refreshes according
          to the provider and cache settings.
        </p>
      </section>

      <section className="pl-section pl-scorers-section" id="pl-matches">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">THE ACTION</p>
            <h2>
              RESULTS <span>& FIXTURES</span>
            </h2>
          </div>

          <span className="pl-demo-label">
            {footballLoading
              ? "LOADING"
              : matchesError
                ? "UNAVAILABLE"
                : "MATCH DATA"}
          </span>
        </div>

        {matchesError && <p className="pl-notice">{matchesError}</p>}

        {!footballLoading && !matchesError && (
          <>
            <div className="pl-match-group">
              <h3 className="pl-match-group-title">RECENT RESULTS</h3>

              <div className="pl-scorers-list">
                {finishedMatches.length ? (
                  finishedMatches.map((match, index) =>
                    renderMatch(match, index, true)
                  )
                ) : (
                  <p className="pl-news-message">
                    No completed matches are available.
                  </p>
                )}
              </div>
            </div>

            <div className="pl-match-group">
              <h3 className="pl-match-group-title">UPCOMING FIXTURES</h3>

              <div className="pl-scorers-list">
                {upcomingMatches.length ? (
                  upcomingMatches.map((match, index) =>
                    renderMatch(match, index, false)
                  )
                ) : (
                  <p className="pl-news-message">
                    No upcoming fixtures are available.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {footballLoading && (
          <p className="pl-news-message">LOADING RESULTS AND FIXTURES...</p>
        )}

        <p className="pl-table-footnote">
          Match dates and scores provided by football-data.org. Times are
          displayed in your browser's local time zone.
        </p>
      </section>

      <section className="pl-section pl-news-section">
        <div className="pl-section-heading">
          <div>
            <p className="pl-eyebrow">STRAIGHT FROM THE NEWSROOM</p>
            <h2>
              PREMIER LEAGUE <span>NEWS</span>
            </h2>
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
        <h2>
          MORE THAN <span>90 MINUTES.</span>
        </h2>
        <Link href="/fixtures/premier-league" className="pl-button">
          EXPLORE FIXTURES <span>↗</span>
        </Link>
      </section>
    </main>
  );
};

export default PremierLeaguePage;

