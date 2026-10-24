'use client'
import { useState } from "react";
import Link from "next/link";
import "./page.css";

const page = () => {
  return (
    <main className="dr-home">

      {/* BREAKING NEWS */}
      <section className="dr-ticker">
        <span className="dr-ticker-label">THE LATEST</span>
        <p>Your home for football news, transfer talk and match updates.</p>
        <span className="dr-live-dot"></span>
      </section>

      {/* HERO */}
      <section className="dr-hero">
        <div className="dr-hero-main">
          <div className="dr-hero-image"></div>
          <div className="dr-hero-overlay"></div>

          <div className="dr-hero-content">
            <span className="dr-tag">
              <span></span> THE BIG STORY
            </span>

            <p className="dr-eyebrow">WELCOME TO DRIBBLE.</p>

            <h1>
              THE GAME
              <br />
              NEVER <span>STOPS.</span>
            </h1>

            <p className="dr-hero-description">
              Football news, transfer rumours, match updates and opinions.
              Everything happening in the beautiful game, all in one place.
            </p>

            <Link href="/news" className="dr-button">
              EXPLORE THE LATEST <span>↗</span>
            </Link>
          </div>

          <span className="dr-hero-index">001 / FOOTBALL CULTURE</span>
        </div>

        {/* ON THE RADAR */}
        <aside className="dr-hero-side">
          <div className="dr-side-heading">
            <span>ON THE RADAR</span>
            <span className="dr-lime-dot"></span>
          </div>

          <Link href="/news" className="dr-radar-item">
            <span className="dr-radar-number">01</span>
            <div>
              <span className="dr-category">PREMIER LEAGUE</span>
              <h3>The tactical battles shaping the season</h3>
              <span className="dr-story-time">MATCH ANALYSIS</span>
            </div>
            <span className="dr-arrow">↗</span>
          </Link>

          <Link href="/transfers" className="dr-radar-item">
            <span className="dr-radar-number">02</span>
            <div>
              <span className="dr-category">TRANSFERS</span>
              <h3>Transfer rumours and the latest developments</h3>
              <span className="dr-story-time">RUMOUR WATCH</span>
            </div>
            <span className="dr-arrow">↗</span>
          </Link>

          <Link href="/news" className="dr-radar-item">
            <span className="dr-radar-number">03</span>
            <div>
              <span className="dr-category">WORLD FOOTBALL</span>
              <h3>The stories making waves across football</h3>
              <span className="dr-story-time">LATEST NEWS</span>
            </div>
            <span className="dr-arrow">↗</span>
          </Link>

          <Link href="/news" className="dr-text-link">
            ALL STORIES <span>→</span>
          </Link>
        </aside>
      </section>

      {/* LATEST NEWS */}
      <section className="dr-section">
        <div className="dr-section-heading">
          <div>
            <p className="dr-eyebrow">STAY IN THE KNOW</p>
            <h2>
              THE LATEST <span>BUZZ.</span>
            </h2>
          </div>

          <Link href="/news" className="dr-text-link">
            VIEW ALL NEWS <span>→</span>
          </Link>
        </div>

        <div className="dr-news-grid">

          {/* NEWS CARD 1 */}
          <Link href="/premier-league" className="dr-news-card">
            <div className="dr-card-image">
              <img
                src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=85"
                alt="Football stadium"
              />
              <span className="dr-card-number">01</span>
              <span className="dr-card-arrow">↗</span>
            </div>

            <div className="dr-card-meta">
              <span>PREMIER LEAGUE</span>
              <span>LATEST NEWS</span>
            </div>

            <h3>The race for the top spots is heating up</h3>

            <span className="dr-read-more">
              READ STORY <span>→</span>
            </span>
          </Link>

          {/* NEWS CARD 2 */}
          <Link href="/transfers" className="dr-news-card">
            <div className="dr-card-image">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=85"
                alt="Football pitch"
              />
              <span className="dr-card-number">02</span>
              <span className="dr-card-arrow">↗</span>
            </div>

            <div className="dr-card-meta">
              <span>TRANSFER CENTRE</span>
              <span>RUMOUR WATCH</span>
            </div>

            <h3>The names to watch ahead of the next transfer window</h3>

            <span className="dr-read-more">
              READ STORY <span>→</span>
            </span>
          </Link>

          {/* NEWS CARD 3 */}
          <Link href="/news" className="dr-news-card">
            <div className="dr-card-image">
              <img
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=85"
                alt="Football match"
              />
              <span className="dr-card-number">03</span>
              <span className="dr-card-arrow">↗</span>
            </div>

            <div className="dr-card-meta">
              <span>FOOTBALL</span>
              <span>ANALYSIS</span>
            </div>

            <h3>What makes a modern midfield tick?</h3>

            <span className="dr-read-more">
              READ STORY <span>→</span>
            </span>
          </Link>

        </div>
      </section>

      {/* TRANSFER CENTRE */}
      <section className="dr-transfer">
        <div className="dr-transfer-image"></div>

        <div className="dr-transfer-content">
          <span className="dr-tag">
            <span></span> TRANSFER CENTRE
          </span>

          <p className="dr-eyebrow">DEALS, LINKS & SPECULATION</p>

          <h2>
            EVERY MOVE
            <br />
            STARTS <span>SOMEWHERE.</span>
          </h2>

          <p>
            Follow transfer developments, reported interest and rumours.
            We separate confirmed deals from speculation.
          </p>

          <Link href="/transfers" className="dr-button">
            ENTER TRANSFER CENTRE <span>↗</span>
          </Link>
        </div>
      </section>

      {/* LEAGUES */}
      <section className="dr-section dr-leagues">
        <div className="dr-section-heading">
          <div>
            <p className="dr-eyebrow">YOUR GAME. YOUR LEAGUE.</p>
            <h2>
              PICK YOUR <span>FIX.</span>
            </h2>
          </div>

          <Link href="/fixtures" className="dr-text-link">
            FIXTURES & SCORES <span>→</span>
          </Link>
        </div>

        <div className="dr-league-grid">

          <Link href="/premier-league" className="dr-league-card">
            <span className="dr-league-number">01</span>
            <span className="dr-league-code">ENG</span>
            <h3>Premier League</h3>
            <span className="dr-league-arrow">↗</span>
          </Link>

          <Link href="/la-liga" className="dr-league-card">
            <span className="dr-league-number">02</span>
            <span className="dr-league-code">ESP</span>
            <h3>La Liga</h3>
            <span className="dr-league-arrow">↗</span>
          </Link>

          <Link href="/champions-league" className="dr-league-card">
            <span className="dr-league-number">03</span>
            <span className="dr-league-code">UCL</span>
            <h3>Champions League</h3>
            <span className="dr-league-arrow">↗</span>
          </Link>

          <Link href="/serie-a" className="dr-league-card">
            <span className="dr-league-number">04</span>
            <span className="dr-league-code">ITA</span>
            <h3>Serie A</h3>
            <span className="dr-league-arrow">↗</span>
          </Link>

        </div>
      </section>

      {/* BOTTOM BANNER */}
      <section className="dr-bottom-banner">
        <p>90 MINUTES. COUNTLESS STORIES.</p>

        <h2>
          FOOTBALL NEVER
          <br />
          <span>STANDS STILL.</span>
        </h2>

        <Link href="/news" className="dr-button">
          STAY IN THE LOOP <span>↗</span>
        </Link>
      </section>

    </main>
  );
};

export default page;

